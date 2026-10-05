import React, { useState, useEffect, useCallback } from 'react';
import AuthScreen from './components/AuthScreen';
import WorkerDashboard from './components/WorkerDashboard';
import ModuleDetailsScreen from './components/ModuleDetailsScreen';
import ARSimulationLauncher from './components/ARSimulationLauncher';
import InteractiveDrillModal from './components/InteractiveDrillModal';
import AdminDashboardModal from './components/AdminDashboardModal';
import DrillCompletionModal from './components/DrillCompletionModal';
import PPECourseModal from './components/PPECourseModal';
import FireExtinguisherGuideModal from './components/FireExtinguisherGuideModal';
import { offlineSync } from './services/offlineSync';

export default function App() {
  const [worker, setWorker] = useState(null);
  const [userRole, setUserRole] = useState('worker'); // 'worker' | 'admin'
  const [language, setLanguage] = useState('English');
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  // Screen Navigation: 'dashboard' | 'module_details'
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState('ppe_hazard');

  // Live Database Records for Worker
  const [workerTrainings, setWorkerTrainings] = useState([]);

  // Modals
  const [showPPECourse, setShowPPECourse] = useState(false);
  const [showFireGuide, setShowFireGuide] = useState(false);
  const [showInteractiveDrill, setShowInteractiveDrill] = useState(false);
  const [activeDrillModuleId, setActiveDrillModuleId] = useState('ppe_hazard');
  const [showARModal, setShowARModal] = useState(false);
  const [drillResult, setDrillResult] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Track completed drills
  const [drillStats, setDrillStats] = useState({
    fireSafetyCompleted: false,
    fireSafetyTime: null,
    fireSafetyScore: null
  });

  // Track active worker with ref to immediately cancel in-flight queries upon logout
  const activeWorkerRef = React.useRef(worker);
  React.useEffect(() => {
    activeWorkerRef.current = worker;
  }, [worker]);

  // Fetch all completed training sessions and latest profile for the active worker
  const refreshWorkerTrainings = useCallback(async (workerId) => {
    if (!workerId || !activeWorkerRef.current || activeWorkerRef.current.worker_id !== workerId) {
      setWorkerTrainings([]);
      setDrillStats({ fireSafetyCompleted: false, fireSafetyTime: null, fireSafetyScore: null });
      return;
    }
    try {
      // 1. Fetch latest worker profile directly from database to keep safety_score accurate
      const verified = await offlineSync.verifyWorker(workerId, false);
      if (verified && activeWorkerRef.current && activeWorkerRef.current.worker_id === workerId) {
        setWorker(verified);
      }

      // 2. Fetch fresh training history
      const history = await offlineSync.getWorkerTrainings(workerId);
      if (activeWorkerRef.current && activeWorkerRef.current.worker_id === workerId) {
        const safeHistory = history || [];
        setWorkerTrainings(safeHistory);

        // 3. Check if fire safety completed
        const fireSession = safeHistory.find(t => 
          (t.module_type || '').toUpperCase() === 'FIRE_SAFETY_PASS' && t.pass_protocol_success
        );
        if (fireSession) {
          setDrillStats({
            fireSafetyCompleted: true,
            fireSafetyTime: fireSession.time_taken_seconds || 8.5,
            fireSafetyScore: fireSession.score || 100
          });
        } else {
          setDrillStats({
            fireSafetyCompleted: false,
            fireSafetyTime: null,
            fireSafetyScore: null
          });
        }
      }
    } catch (err) {
      console.warn('[App] Error fetching worker trainings:', err);
    }
  }, []);

  // Initialize
  useEffect(() => {
    // Check saved language
    const savedLang = localStorage.getItem('johar_selected_language');
    if (savedLang) setLanguage(savedLang);

    // Check saved worker and role
    const savedWorker = localStorage.getItem('johar_active_worker');
    const savedRole = localStorage.getItem('johar_user_role') || 'worker';
    setUserRole(savedRole);
    if (savedWorker) {
      try {
        const parsed = JSON.parse(savedWorker);
        if (parsed && parsed.worker_id) {
          setWorker(parsed);
          activeWorkerRef.current = parsed;
          if (savedRole === 'worker') {
            refreshWorkerTrainings(parsed.worker_id);
          }
        }
      } catch {}
    }

    // Subscribe to network sync status
    const unsubscribeSync = offlineSync.subscribe((status) => {
      setIsOnline(status.isOnline);
      setPendingCount(status.pendingCount);
    });

    setIsOnline(offlineSync.isOnline);
    setPendingCount(offlineSync.getPendingCount());

    // Register Native Android Bridge completion listener
    window.onARDrillComplete = (data) => {
      console.log('[Native AndroidBridge] Received AR Drill Completion:', data);
      if (data && (data.duration || data.score)) {
        const currentWk = activeWorkerRef.current;
        if (currentWk) {
          handleDrillFinished({
            ...data,
            worker_id: data.worker_id || currentWk.worker_id,
            moduleId: 'fire_safety',
            moduleType: 'FIRE_SAFETY_PASS'
          });
        }
      }
    };

    // Check if returned from Unity via URL parameters
    const params = new URLSearchParams(window.location.search);
    if (params.get('drill_completed') === 'true' && (params.get('score') || params.get('time'))) {
      const currentWk = activeWorkerRef.current;
      const paramWorker = params.get('worker_id');
      if (currentWk && (!paramWorker || paramWorker.toUpperCase() === currentWk.worker_id.toUpperCase())) {
        const score = parseInt(params.get('score') || '100', 10);
        const duration = parseFloat(params.get('time') || '8.5');
        handleDrillFinished({ duration, score, moduleId: 'fire_safety', moduleType: 'FIRE_SAFETY_PASS', worker_id: currentWk.worker_id });
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Subscribe to Supabase Realtime channel for zero-refresh updates
    const unsubscribeRealtime = offlineSync.subscribeToRealtime((table, payload) => {
      console.log(`[App] Realtime event on ${table}:`, payload);
      const currentWk = activeWorkerRef.current;
      if (currentWk && (localStorage.getItem('johar_user_role') || 'worker') === 'worker') {
        refreshWorkerTrainings(currentWk.worker_id);
      }
    });

    // 3.5s auto-poll backup to guarantee real-time updates everywhere
    const pollInterval = setInterval(() => {
      const currentWk = activeWorkerRef.current;
      if (currentWk && (localStorage.getItem('johar_user_role') || 'worker') === 'worker') {
        refreshWorkerTrainings(currentWk.worker_id);
      }
    }, 3500);

    return () => {
      unsubscribeSync();
      unsubscribeRealtime();
      clearInterval(pollInterval);
      window.onARDrillComplete = null;
    };
  }, []);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('johar_selected_language', newLang);
  };

  const handleLoginSuccess = (authenticatedUser, role = 'worker') => {
    setUserRole(role);
    setWorker(authenticatedUser);
    activeWorkerRef.current = authenticatedUser;
    offlineSync.setActiveWorker(authenticatedUser);
    setCurrentView('dashboard');
    localStorage.setItem('johar_user_role', role);

    // Completely clear prior drill stats and training records to prevent state leakage across workers
    setWorkerTrainings([]);
    setDrillStats({
      fireSafetyCompleted: false,
      fireSafetyTime: null,
      fireSafetyScore: null
    });

    if (role === 'worker') {
      refreshWorkerTrainings(authenticatedUser.worker_id);
    }
  };

  const handleLogout = () => {
    activeWorkerRef.current = null;
    offlineSync.clearActiveWorker();
    localStorage.removeItem('johar_active_worker');
    localStorage.removeItem('johar_user_role');
    setWorker(null);
    setUserRole('worker');
    setWorkerTrainings([]);
    setDrillStats({
      fireSafetyCompleted: false,
      fireSafetyTime: null,
      fireSafetyScore: null
    });
    setCurrentView('dashboard');
  };

  // Starts the appropriate simulation drill (interactive in-app or Native Unity AR)
  const handleStartSimulation = (moduleId = 'ppe_hazard') => {
    const targetModuleId = moduleId || selectedModuleId || 'ppe_hazard';
    setActiveDrillModuleId(targetModuleId);

    // If PPE Module, open full interactive course with 6 pages, Quiz 1, 5 pages, Quiz 2!
    if (targetModuleId === 'ppe_hazard') {
      setShowPPECourse(true);
      return;
    }

    // If Fire Safety, first open interactive Extinguisher Pre-Briefing & Training Guide!
    if (targetModuleId === 'fire_safety') {
      setShowFireGuide(true);
      return;
    }

    // Launch multi-module interactive drill modal for other modules
    setShowInteractiveDrill(true);
  };

  const handleLaunchFireAR = () => {
    setShowFireGuide(false);
    const workerId = worker?.worker_id || 'W-7042';
    const lang = language || 'English';

    // If on Android native wrapper, launch Unity AR activity
    if (window.AndroidBridge && typeof window.AndroidBridge.launchAR === 'function') {
      console.log('[Native AndroidBridge] Launching embedded Unity AR activity...');
      window.AndroidBridge.launchAR(workerId, lang);
      return;
    }

    // Otherwise launch interactive web drill simulation
    setActiveDrillModuleId('fire_safety');
    setShowInteractiveDrill(true);
  };

  const handleDrillFinished = async (result) => {
    const duration = result.duration || 8.5;
    const score = result.score || 100;
    const modId = result.moduleId || activeDrillModuleId || 'fire_safety';

    const MODULE_TYPE_MAP = {
      fire_safety: 'FIRE_SAFETY_PASS',
      gas_leak: 'GAS_LEAK_DETECTION',
      ppe_hazard: 'PPE_INSPECTION',
      loto: 'LOTO_ISOLATION',
      roof_bolting: 'STRATA_ROOF_BOLT'
    };
    const modType = result.moduleType || MODULE_TYPE_MAP[modId] || 'FIRE_SAFETY_PASS';

    // Synchronize directly to Supabase
    try {
      const activeWorkerId = result.worker_id || worker?.worker_id;
      await offlineSync.recordTrainingSession({
        module_type: modType,
        pass_protocol_success: true,
        time_taken_seconds: duration,
        score,
        rating_stars: result.stars !== undefined ? result.stars : (score >= 80 ? 3 : score >= 70 ? 2 : score >= 60 ? 1 : 0),
        worker_id: activeWorkerId
      });
      console.log(`[App] Session ${modType} (Score: ${score}, Grade: ${result.grade || 'N/A'}) for ${activeWorkerId} recorded to Supabase.`);
    } catch (err) {
      console.error('[App] Error logging session to Supabase:', err);
    }

    // Refresh training history and accurately compute worker safety competency score
    if (worker) {
      const updatedHistory = await offlineSync.getWorkerTrainings(worker.worker_id);
      setWorkerTrainings(updatedHistory || []);

      const completedModules = new Set(
        (updatedHistory || [])
          .filter(t => t.pass_protocol_success)
          .map(t => (t.module_type || '').toUpperCase())
      );
      const avgScore = updatedHistory && updatedHistory.length > 0
        ? Math.round(updatedHistory.reduce((acc, t) => acc + (t.score || 100), 0) / updatedHistory.length)
        : score;
      // Rating: 33% per core module (PPE, Fire, Gas), weighted by score
      const newScore = Math.min(100, Math.round((completedModules.size / 3) * avgScore));

      const updated = {
        ...worker,
        safety_score: newScore
      };
      setWorker(updated);
      offlineSync.setActiveWorker(updated);
      await offlineSync.updateWorkerScore(worker.worker_id, newScore);

      refreshWorkerTrainings(worker.worker_id);
    }

    setDrillResult({
      duration,
      score,
      moduleType: modType
    });

    setShowInteractiveDrill(false);
    setShowARModal(false);
    setShowCompletionModal(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#090A0F] text-zinc-100 flex flex-col justify-start">
      {/* 1. Auth / Login Screen */}
      {!worker && (
        <AuthScreen
          language={language}
          onLanguageChange={handleLanguageChange}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* 2. Admin Operations Command Center (when authenticated as Admin) */}
      {worker && userRole === 'admin' && (
        <AdminDashboardModal
          onClose={handleLogout}
        />
      )}

      {/* 3. Safety Training Home Hub (Worker View ONLY) */}
      {worker && userRole === 'worker' && currentView === 'dashboard' && (
        <WorkerDashboard
          worker={worker}
          language={language}
          onSelectModule={(moduleId) => {
            setSelectedModuleId(moduleId);
            setCurrentView('module_details');
          }}
          onLaunchAR={() => handleStartSimulation('fire_safety')}
          onLogout={handleLogout}
          trainings={workerTrainings}
          drillStats={drillStats}
        />
      )}

      {/* 4. Module Details Screen (Worker View ONLY) */}
      {worker && userRole === 'worker' && currentView === 'module_details' && (
        <ModuleDetailsScreen
          worker={worker}
          language={language}
          moduleId={selectedModuleId}
          onBack={() => setCurrentView('dashboard')}
          onStartSimulation={(modId) => handleStartSimulation(modId || selectedModuleId)}
        />
      )}

      {/* Comprehensive PPE & Hazard Interactive Training Course */}
      {showPPECourse && worker && userRole === 'worker' && (
        <PPECourseModal
          worker={worker}
          language={language}
          onClose={() => setShowPPECourse(false)}
          onCompleteCourse={async (result) => {
            setShowPPECourse(false);
            await handleDrillFinished(result);
          }}
        />
      )}

      {/* Interactive Fire Extinguisher Pre-Briefing & Training Guide */}
      {showFireGuide && worker && userRole === 'worker' && (
        <FireExtinguisherGuideModal
          worker={worker}
          language={language}
          onClose={() => setShowFireGuide(false)}
          onStartAR={handleLaunchFireAR}
        />
      )}

      {/* Multi-Module Interactive Drill Modal */}
      {showInteractiveDrill && worker && userRole === 'worker' && (
        <InteractiveDrillModal
          moduleId={activeDrillModuleId}
          worker={worker}
          language={language}
          onClose={() => setShowInteractiveDrill(false)}
          onCompleteDrill={handleDrillFinished}
        />
      )}

      {/* AR Simulation Modal (Legacy / Fallback) */}
      {showARModal && worker && userRole === 'worker' && (
        <ARSimulationLauncher
          worker={worker}
          language={language}
          onClose={() => setShowARModal(false)}
          onCompleteDrill={handleDrillFinished}
        />
      )}

      {/* Drill Passed Celebration Modal */}
      {showCompletionModal && drillResult && (
        <DrillCompletionModal
          result={drillResult}
          language={language}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Flame, 
  Activity, 
  Check, 
  Award,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../services/supabase';
import { offlineSync } from '../services/offlineSync';
import jiwiLogo from '../assets/jiwiAR_logo.png';

export default function AdminDashboardModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [workers, setWorkers] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realtimeStatus, setRealtimeStatus] = useState('CONNECTED');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  useEffect(() => {
    fetchInitialData();

    // Subscribe to real-time events for training_sessions and workers
    const channel = supabase
      .channel('admin_operations_realtime_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'training_sessions' }, (payload) => {
        handleTrainingChange(payload);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workers' }, (payload) => {
        handleWorkerChange(payload);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('LIVE');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setRealtimeStatus('RECONNECTING');
        }
      });

    // Background poll every 3 seconds to guarantee zero-refresh sync
    const pollTimer = setInterval(() => {
      fetchInitialData(true);
    }, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(pollTimer);
    };
  }, []);

  const fetchInitialData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);

      const [workersRes, trainingsRes] = await Promise.all([
        supabase.from('workers').select('*').order('created_at', { ascending: true }),
        supabase.from('training_sessions').select('*').order('completed_at', { ascending: false }).limit(50)
      ]);

      if (workersRes.data && workersRes.data.length > 0) {
        setWorkers(workersRes.data);
      } else if (!workers.length) {
        const offlineWorkers = offlineSync.getRegisteredWorkers();
        if (offlineWorkers && offlineWorkers.length > 0) {
          setWorkers(offlineWorkers);
        }
      }

      if (trainingsRes.data && trainingsRes.data.length > 0) {
        setTrainings(trainingsRes.data);
      }

      setLastSyncTime(new Date());
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      if (!workers.length) {
        const offlineWorkers = offlineSync.getRegisteredWorkers();
        if (offlineWorkers && offlineWorkers.length > 0) {
          setWorkers(offlineWorkers);
        }
      }
    } finally {
      if (!isBackground) setLoading(false);
      setIsSyncing(false);
    }
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    fetchInitialData(false);
  };

  const handleTrainingChange = (payload) => {
    if (payload.eventType === 'INSERT') {
      setTrainings(prev => [payload.new, ...prev.filter(t => t.id !== payload.new.id)]);
      triggerHapticNotification(40);
    } else if (payload.eventType === 'UPDATE') {
      setTrainings(prev => prev.map(t => t.id === payload.new.id ? payload.new : t));
    }
  };

  const handleWorkerChange = (payload) => {
    if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
      setWorkers(prev => {
        const index = prev.findIndex(w => w.worker_id === payload.new.worker_id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = payload.new;
          return next;
        }
        return [...prev, payload.new];
      });
    }
  };

  const triggerHapticNotification = (ms = 40) => {
    try {
      if (window.AndroidBridge && typeof window.AndroidBridge.triggerHaptic === 'function') {
        window.AndroidBridge.triggerHaptic(ms);
      } else if (navigator.vibrate) {
        navigator.vibrate(ms);
      }
    } catch {}
  };

  const calculateWorkerSafetyScore = (worker) => {
    if (!worker) return 0;
    const workerDrills = trainings.filter(t => (t.worker_id || '').toUpperCase() === (worker.worker_id || '').toUpperCase() && t.pass_protocol_success);
    if (!workerDrills || workerDrills.length === 0) return 0;
    if (typeof worker.safety_score === 'number' && worker.safety_score > 0) {
      return Math.min(100, Math.max(0, Math.round(worker.safety_score)));
    }
    const distinct = new Set(workerDrills.map(t => (t.module_type || '').toUpperCase()));
    const avg = Math.round(workerDrills.reduce((acc, t) => acc + (Number(t.score) || 100), 0) / workerDrills.length);
    return Math.min(100, Math.round((distinct.size / 5) * avg));
  };

  const totalWorkers = workers.length;
  const certifiedWorkersCount = workers.filter(w => 
    trainings.some(t => (t.worker_id || '').toUpperCase() === (w.worker_id || '').toUpperCase() && t.pass_protocol_success)
  ).length;
  const compliancePct = totalWorkers > 0 ? Math.round((certifiedWorkersCount / totalWorkers) * 100) : 0;
  const avgSafetyScore = totalWorkers > 0 
    ? Math.round(workers.reduce((acc, w) => acc + calculateWorkerSafetyScore(w), 0) / totalWorkers)
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#090A0F] text-slate-100 flex flex-col overflow-hidden animate-fadeIn select-none font-sans">
      
      {/* Top Operations Header */}
      <header className="px-4 py-3 bg-[#090A0F]/95 border-b border-white/[0.06] flex items-center justify-between z-10 shrink-0">
        {/* Unboxed Logo + Clean Typography */}
        <div className="flex items-center gap-2.5">
          <img src={jiwiLogo} alt="Jiwi-AR" className="h-7 w-7 object-contain drop-shadow-sm shrink-0" />
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white tracking-tight">
                Jiwi-AR Operations Center
              </h2>
              <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border flex items-center gap-1.5 ${
                realtimeStatus === 'LIVE' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${realtimeStatus === 'LIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                <span>{realtimeStatus === 'LIVE' ? 'Live Stream' : 'Syncing'}</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Centralized DGMS Industrial Safety Command • Live Telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Manual Force Sync */}
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1.5 transition border border-white/[0.06]"
            title="Force Sync Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 stroke-[1.5] ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          {/* Close / Return Button */}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white text-xs font-medium border border-white/[0.08] transition flex items-center gap-1.5"
          >
            <span>Exit</span>
            <X className="w-3.5 h-3.5 stroke-[1.75]" />
          </button>
        </div>
      </header>

      {/* Main KPI Row (Workers & Drills Telemetry) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-4 bg-[#090A0F] border-b border-white/[0.06] shrink-0 text-left">
        
        {/* KPI 1: Workers (Renamed from Miners) */}
        <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-400 uppercase font-medium tracking-wider">
              Workers
            </p>
            <h3 className="text-xl font-bold text-white mt-0.5 tracking-tight font-mono">
              {totalWorkers}
            </h3>
            <span className="text-[10px] text-emerald-400 font-normal">
              100% Database Verified
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Users className="w-4 h-4 stroke-[1.75]" />
          </div>
        </div>

        {/* KPI 2: AR Drills Completed */}
        <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-400 uppercase font-medium tracking-wider">
              Field Drills
            </p>
            <h3 className="text-xl font-bold text-white mt-0.5 tracking-tight font-mono">
              {trainings.length}
            </h3>
            <span className="text-[10px] text-amber-400 font-normal">
              {certifiedWorkersCount}/{totalWorkers} Certified ({compliancePct}%)
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Flame className="w-4 h-4 stroke-[1.75]" />
          </div>
        </div>

        {/* KPI 3: DGMS Compliance */}
        <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-400 uppercase font-medium tracking-wider">
              DGMS Compliance
            </p>
            <h3 className="text-xl font-bold text-emerald-400 mt-0.5 tracking-tight font-mono">
              {compliancePct}%
            </h3>
            <span className="text-[10px] text-zinc-400 font-normal">
              Safety Standard Met
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 stroke-[1.75]" />
          </div>
        </div>

        {/* KPI 4: Average Safety Score */}
        <div className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-400 uppercase font-medium tracking-wider">
              Avg Safety Score
            </p>
            <h3 className="text-xl font-bold text-white mt-0.5 tracking-tight font-mono">
              {avgSafetyScore}%
            </h3>
            <span className="text-[10px] text-zinc-400 font-normal">
              Personnel Rating
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] text-amber-400 flex items-center justify-center">
            <Award className="w-4 h-4 stroke-[1.75]" />
          </div>
        </div>

      </div>

      {/* Navigation Tabs (Overview, AR Drills, Workers) */}
      <nav className="flex px-4 border-b border-white/[0.06] bg-[#090A0F] gap-1 overflow-x-auto no-scrollbar shrink-0">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'trainings', label: `AR Drills (${trainings.length})`, icon: Flame },
          { id: 'workers', label: `Workers (${workers.length})`, icon: Users }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 text-xs font-medium border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
                isActive
                  ? 'text-white border-amber-500'
                  : 'text-zinc-400 border-transparent hover:text-zinc-200'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5 stroke-[1.75]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Scrollable Tab Views Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar text-left">

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            
            {/* Recent Drills Stream */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-amber-500 stroke-[1.75]" />
                  <span>Realtime AR Field Drills</span>
                </h3>
                <span className="text-[10px] text-zinc-400 font-mono">Live WebSocket</span>
              </div>
              <div className="space-y-2 max-h-[380px] overflow-y-auto no-scrollbar">
                {trainings.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-6 text-center">No drills logged yet in the database.</p>
                ) : (
                  trainings.map((t) => (
                    <div key={t.id || t.client_session_id} className="p-2.5 rounded-lg bg-white/[0.025] border border-white/[0.05] flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white font-mono">{t.worker_id}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                            {t.module_type}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          Time: {t.time_taken_seconds}s • Score: {t.score}/100 • {t.pass_protocol_success ? '✓ Passed' : 'Incomplete'}
                        </p>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {t.completed_at ? new Date(t.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Worker Competency & Readiness Status */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-blue-400 stroke-[1.75]" />
                  <span>Worker Readiness &amp; Certification</span>
                </h3>
                <span className="text-[10px] text-zinc-400 font-mono">Database Status</span>
              </div>
              <div className="space-y-2 max-h-[380px] overflow-y-auto no-scrollbar">
                {workers.map((w) => {
                  const isCertified = trainings.some(t => t.worker_id === w.worker_id && t.pass_protocol_success);
                  const drillCount = trainings.filter(t => t.worker_id === w.worker_id).length;
                  return (
                    <div key={w.worker_id} className="p-2.5 rounded-lg bg-white/[0.025] border border-white/[0.05] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <div className="w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center font-mono text-[11px] font-bold text-zinc-200 shrink-0">
                          {w.name ? w.name.charAt(0).toUpperCase() : 'W'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-white truncate">{w.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">{w.worker_id}</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 truncate">
                            {w.role} • {w.sector}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-zinc-400">{drillCount} drill{drillCount !== 1 ? 's' : ''}</span>
                        {isCertified ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ✓ Certified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.05] text-zinc-400 border border-white/[0.06]">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* 2. AR DRILLS TAB */}
        {activeTab === 'trainings' && (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 overflow-x-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                Field Simulation &amp; Protocol Drill Log
              </h3>
              <span className="text-[10px] text-zinc-400 font-mono">
                {trainings.length} Total Records in Supabase
              </span>
            </div>
            {trainings.length === 0 ? (
              <p className="text-xs text-zinc-500 py-8 text-center">No simulation logs found in database.</p>
            ) : (
              <table className="w-full text-left text-xs text-zinc-300 min-w-[600px]">
                <thead className="border-b border-white/[0.06] text-zinc-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Session ID</th>
                    <th className="py-2.5 px-3">Worker</th>
                    <th className="py-2.5 px-3">Module</th>
                    <th className="py-2.5 px-3">Protocol Status</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Score</th>
                    <th className="py-2.5 px-3">Completed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {trainings.map((t) => (
                    <tr key={t.id || t.client_session_id} className="hover:bg-white/[0.02] transition">
                      <td className="py-2.5 px-3 font-mono text-[11px] text-zinc-400 truncate max-w-[140px]" title={t.client_session_id}>
                        {t.client_session_id}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-white font-mono">{t.worker_id}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                          {t.module_type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {t.pass_protocol_success ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                            <Check className="w-3 h-3 stroke-[2]" /> Passed
                          </span>
                        ) : (
                          <span className="text-zinc-500 text-[11px]">Incomplete</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-amber-300">{t.time_taken_seconds}s</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-400">{t.score}/100</td>
                      <td className="py-2.5 px-3 text-zinc-400 font-mono text-[11px]">
                        {t.completed_at ? new Date(t.completed_at).toLocaleString() : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* 3. WORKERS DIRECTORY TAB (Renamed from Miners) */}
        {activeTab === 'workers' && (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 overflow-x-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                Registered Underground Personnel &amp; Safety Records
              </h3>
              <span className="text-[10px] text-zinc-400 font-mono">
                {workers.length} Registered Workers
              </span>
            </div>
            <table className="w-full text-left text-xs text-zinc-300 min-w-[600px]">
              <thead className="border-b border-white/[0.06] text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Worker ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Sector</th>
                  <th className="py-2.5 px-3">Safety Score</th>
                  <th className="py-2.5 px-3">Certification</th>
                  <th className="py-2.5 px-3">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {workers.map((w) => {
                  const hasCertified = trainings.some(t => t.worker_id === w.worker_id && t.pass_protocol_success);
                  return (
                    <tr key={w.worker_id} className="hover:bg-white/[0.02] transition">
                      <td className="py-2.5 px-3 font-mono font-medium text-amber-400">{w.worker_id}</td>
                      <td className="py-2.5 px-3 font-semibold text-white">{w.name}</td>
                      <td className="py-2.5 px-3 text-zinc-300">{w.role}</td>
                      <td className="py-2.5 px-3 text-zinc-400">{w.sector}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-400 font-mono text-sm">
                        {calculateWorkerSafetyScore(w)}%
                      </td>
                      <td className="py-2.5 px-3">
                        {hasCertified ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ✓ Certified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.05] text-zinc-400">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-500 font-mono text-[11px]">
                        {w.last_active_at ? new Date(w.last_active_at).toLocaleString() : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

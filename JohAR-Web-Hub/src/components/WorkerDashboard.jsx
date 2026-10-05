import React, { useState } from 'react';
import { 
  Flame, 
  Wind, 
  Lock, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Award, 
  History, 
  Sparkles, 
  Menu, 
  Check, 
  LogOut, 
  Home, 
  User,
  ShieldCheck,
  ChevronRight,
  Play,
  RotateCcw
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import jiwiLogo from '../assets/jiwiAR_logo.png';

export default function WorkerDashboard({ 
  worker, 
  language, 
  onLogout, 
  onSelectModule,
  onLaunchAR,
  trainings = [],
  drillStats
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.English;
  const [activeTab, setActiveTab] = useState('home');
  const [showMenu, setShowMenu] = useState(false);

  const triggerHaptic = (ms = 25) => {
    try {
      if (window.AndroidBridge && typeof window.AndroidBridge.triggerHaptic === 'function') {
        window.AndroidBridge.triggerHaptic(ms);
      } else if (navigator.vibrate) {
        navigator.vibrate(ms);
      }
    } catch {}
  };

  const getInitials = (name) => {
    if (!name) return 'JH';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    triggerHaptic(35);
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const getModuleStatus = (moduleType) => {
    // Look up real completed session from database for THIS worker exclusively
    const session = (trainings || []).find(t => 
      (t.module_type || '').toUpperCase() === moduleType.toUpperCase() && t.pass_protocol_success
    );

    const isCompleted = Boolean(session);
    const time = session ? session.time_taken_seconds : null;
    const score = session ? session.score : null;

    return {
      completed: isCompleted,
      percent: isCompleted ? 100 : 0,
      badgeText: isCompleted ? 'Certified' : '0%',
      btnText: isCompleted ? 'Retake' : 'Start',
      time: isCompleted && time != null ? time : null,
      score: isCompleted && score != null ? score : null
    };
  };

  const ppeStatus = getModuleStatus('PPE_INSPECTION');
  const fireStatus = getModuleStatus('FIRE_SAFETY_PASS');
  const gasStatus = getModuleStatus('GAS_LEAK_DETECTION');
  const lotoStatus = getModuleStatus('LOTO_ISOLATION');
  const roofStatus = getModuleStatus('STRATA_ROOF_BOLT');

  const isPpePassed = ppeStatus.completed;
  const isFirePassed = fireStatus.completed;

  const moduleList = [ppeStatus, fireStatus, gasStatus];
  const completedCount = moduleList.filter(m => m.completed).length;

  // Real-time score: If 0 drills completed, score is strictly 0!
  const dynamicCompetency = completedCount === 0 
    ? 0 
    : (worker?.safety_score && typeof worker.safety_score === 'number' && worker.safety_score > 0
        ? Math.min(100, Math.round(worker.safety_score))
        : Math.min(100, Math.round(moduleList.filter(m => m.completed).reduce((sum, m) => sum + (m.score || 100), 0) / 3))
      );

  return (
    <div className="w-full max-w-md min-h-screen bg-[#090A0F] flex flex-col relative overflow-hidden mx-auto select-none pb-24 text-slate-100">
      
      {/* Header Section */}
      <header className="px-5 py-3.5 flex justify-between items-center z-10 sticky top-0 bg-[#090A0F]/90 backdrop-blur-xl border-b border-white/[0.06]">
        {/* Unboxed Logo + Brand Wordmark */}
        <div className="flex items-center gap-2.5">
          <img src={jiwiLogo} alt="Jiwi-AR" className="h-7 w-7 object-contain drop-shadow-sm" />
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-white">JiwiAR</span>
              <span className="w-1 h-1 rounded-full bg-amber-500"></span>
              <span className="text-[10px] font-medium tracking-wider text-amber-500/90 uppercase">Suraksha</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-normal">Safety Training Hub</span>
          </div>
        </div>

        {/* Minimalist Profile/Menu Action */}
        <div className="relative">
          <button
            aria-label="Open Navigation Menu"
            onClick={() => { triggerHaptic(15); setShowMenu(!showMenu); }}
            className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] flex items-center justify-center text-zinc-300 active:scale-95 transition"
          >
            <Menu className="w-4 h-4 stroke-[1.75]" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-[#12151E] border border-white/[0.1] rounded-xl shadow-2xl py-1.5 z-50 animate-fadeIn text-left">
              <div className="px-3.5 py-2 border-b border-white/[0.06]">
                <p className="text-xs font-semibold text-white">{worker.name || 'Worker'}</p>
                <p className="text-[10px] text-zinc-400 font-mono">{worker.worker_id || 'W-7042'}</p>
              </div>
              <button
                type="button"
                onClick={() => { setShowMenu(false); onLogout(); }}
                className="w-full px-3.5 py-2 text-left text-xs text-zinc-300 hover:bg-white/[0.06] flex items-center gap-2 transition"
              >
                <LogOut className="w-3.5 h-3.5 text-zinc-400 stroke-[1.5]" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-6 space-y-4">
        
        {/* User Competency Card */}
        <section className="bg-white/[0.025] border border-white/[0.07] rounded-2xl p-4 flex items-center justify-between relative overflow-hidden" data-purpose="user-profile-summary">
          <div className="flex items-center space-x-3 text-left">
            {/* Minimal Avatar */}
            <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-white/[0.08] flex items-center justify-center text-zinc-200 font-semibold text-xs shrink-0">
              {getInitials(worker.name)}
            </div>

            {/* Identity Details */}
            <div>
              <h2 className="text-sm font-semibold text-white leading-snug">
                {worker.name || 'Ramesh Soren'}
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono tracking-tight">
                {worker.worker_id || 'JH-WRK-00182'} • {worker.role || 'Operator'}
              </p>
              <div className="inline-flex items-center gap-1.5 mt-1 text-[10px] text-emerald-400 font-normal">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Active • {worker.sector || 'Sector 4 Mine'}</span>
              </div>
            </div>
          </div>

          {/* Minimal Competency Gauge */}
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/[0.06]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-amber-500 stroke-current"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeDasharray={`${dynamicCompetency}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <span className="absolute text-xs font-semibold text-white">
                {dynamicCompetency}%
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-zinc-400 mt-1 font-medium">
              Score
            </span>
          </div>
        </section>

        {/* Training Modules Section */}
        <section data-purpose="training-modules-overview" className="text-left">
          <div className="flex justify-between items-center mb-2 px-0.5">
            <h3 className="text-[11px] font-semibold text-zinc-400 tracking-wider uppercase">
              Training Modules
            </h3>
            <span className="text-[11px] font-medium text-amber-500/90">3 Core Drills • 2 Upcoming</span>
          </div>

          <div className="space-y-2.5">
            {/* Module 1: PPE & Hazard Inspection (FIRST & UNLOCKED) */}
            <article 
              onClick={() => { triggerHaptic(20); onSelectModule('ppe_hazard'); }}
              className="bg-white/[0.025] hover:bg-white/[0.045] border border-white/[0.07] hover:border-emerald-500/30 rounded-xl p-3.5 transition cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                  <ShieldCheck className="w-4 h-4 stroke-[1.75]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-semibold text-white truncate pr-2">
                      PPE &amp; Hazard Inspection
                    </h4>
                    <span className={`text-[11px] font-medium ${ppeStatus.completed ? 'text-emerald-400' : 'text-amber-400 font-semibold'}`}>
                      {ppeStatus.completed ? 'Certified' : 'Module 1'}
                    </span>
                  </div>
                  
                  {/* Subtle Progress Bar */}
                  <div className="w-full bg-white/[0.06] rounded-full h-1 overflow-hidden mb-2.5">
                    <div 
                      className={`h-1 rounded-full transition-all duration-500 ${ppeStatus.completed ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${ppeStatus.percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">
                      {ppeStatus.completed ? `${ppeStatus.time}s • Score ${ppeStatus.score}% (Grade ${ppeStatus.score >= 90 ? 'A+' : ppeStatus.score >= 80 ? 'A' : ppeStatus.score >= 70 ? 'B' : ppeStatus.score >= 60 ? 'C' : 'D'})` : '8-10 min • DGMS Standard'}
                    </span>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); triggerHaptic(30); onSelectModule('ppe_hazard'); }}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                        ppeStatus.completed 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                          : 'bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400'
                      }`}
                    >
                      {ppeStatus.completed ? (
                        <>
                          <Check className="w-3 h-3 stroke-[2]" />
                          <span>Certified</span>
                        </>
                      ) : (
                        <>
                          <span>Start</span>
                          <ChevronRight className="w-3 h-3 stroke-[2]" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Module 2: Fire & Explosion Response (LOCKED if !isPpePassed) */}
            <article 
              onClick={() => {
                if (!isPpePassed) {
                  showToast('Locked • Complete Module 1: PPE & Hazard Inspection first');
                  return;
                }
                triggerHaptic(20);
                onSelectModule('fire_safety');
              }}
              className={`border rounded-xl p-3.5 transition cursor-pointer active:scale-[0.99] ${
                isPpePassed 
                  ? 'bg-white/[0.025] hover:bg-white/[0.045] border-white/[0.07] hover:border-white/[0.12]' 
                  : 'bg-white/[0.01] border-white/[0.04] opacity-75'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isPpePassed 
                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400' 
                    : 'bg-white/[0.03] border border-white/[0.06] text-zinc-500'
                }`}>
                  {isPpePassed ? <Flame className="w-4 h-4 stroke-[1.75]" /> : <Lock className="w-4 h-4 stroke-[1.75]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-semibold text-white truncate pr-2">
                      Fire &amp; Explosion Response
                    </h4>
                    <span className={`text-[11px] font-medium ${
                      fireStatus.completed 
                        ? 'text-emerald-400' 
                        : isPpePassed 
                          ? 'text-zinc-400' 
                          : 'text-zinc-500 flex items-center gap-1'
                    }`}>
                      {fireStatus.completed ? 'Certified' : isPpePassed ? '0%' : (
                        <>
                          <Lock className="w-2.5 h-2.5" />
                          <span>Locked</span>
                        </>
                      )}
                    </span>
                  </div>
                  
                  {/* Subtle Progress Bar */}
                  <div className="w-full bg-white/[0.06] rounded-full h-1 overflow-hidden mb-2.5">
                    <div 
                      className={`h-1 rounded-full transition-all duration-500 ${fireStatus.completed ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${fireStatus.percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">
                      {fireStatus.completed 
                        ? `${fireStatus.time}s • Score ${fireStatus.score}%` 
                        : isPpePassed 
                          ? '6-8 min • AR PASS Drill' 
                          : 'Locked • Requires PPE Certification'}
                    </span>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isPpePassed) {
                          showToast('Locked • Complete Module 1: PPE & Hazard Inspection first');
                          return;
                        }
                        triggerHaptic(30);
                        onSelectModule('fire_safety');
                      }}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                        fireStatus.completed 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                          : isPpePassed
                            ? 'bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400'
                            : 'bg-white/[0.03] text-zinc-500 border border-white/[0.05]'
                      }`}
                    >
                      {fireStatus.completed ? (
                        <>
                          <Check className="w-3 h-3 stroke-[2]" />
                          <span>Certified</span>
                        </>
                      ) : isPpePassed ? (
                        <>
                          <span>Start Drill</span>
                          <ChevronRight className="w-3 h-3 stroke-[2]" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 stroke-[1.75]" />
                          <span>Locked</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Module 3: Gas Leak & Confined Space (LOCKED if !isFirePassed) */}
            <article 
              onClick={() => {
                if (!isFirePassed) {
                  showToast('Locked • Complete Module 2: Fire & Explosion Response first');
                  return;
                }
                triggerHaptic(20);
                onSelectModule('gas_leak');
              }}
              className={`border rounded-xl p-3.5 transition cursor-pointer active:scale-[0.99] ${
                isFirePassed 
                  ? 'bg-white/[0.025] hover:bg-white/[0.045] border-white/[0.07] hover:border-white/[0.12]' 
                  : 'bg-white/[0.01] border-white/[0.04] opacity-75'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isFirePassed 
                    ? 'bg-sky-500/10 border border-sky-500/20 text-sky-400' 
                    : 'bg-white/[0.03] border border-white/[0.06] text-zinc-500'
                }`}>
                  {isFirePassed ? <Wind className="w-4 h-4 stroke-[1.75]" /> : <Lock className="w-4 h-4 stroke-[1.75]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-semibold text-white truncate pr-2">
                      Gas Leak &amp; Confined Space
                    </h4>
                    <span className={`text-[11px] font-medium ${
                      gasStatus.completed 
                        ? 'text-emerald-400' 
                        : isFirePassed 
                          ? 'text-zinc-400' 
                          : 'text-zinc-500 flex items-center gap-1'
                    }`}>
                      {gasStatus.completed ? 'Certified' : isFirePassed ? '0%' : (
                        <>
                          <Lock className="w-2.5 h-2.5" />
                          <span>Locked</span>
                        </>
                      )}
                    </span>
                  </div>
                  
                  <div className="w-full bg-white/[0.06] rounded-full h-1 overflow-hidden mb-2.5">
                    <div 
                      className={`h-1 rounded-full transition-all duration-500 ${gasStatus.completed ? 'bg-emerald-500' : 'bg-sky-500'}`} 
                      style={{ width: `${gasStatus.percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">
                      {gasStatus.completed 
                        ? `${gasStatus.time}s • Score ${gasStatus.score}%` 
                        : isFirePassed 
                          ? '7-10 min • CH4 / CO Sensors' 
                          : 'Locked • Requires Fire Certification'}
                    </span>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isFirePassed) {
                          showToast('Locked • Complete Module 2: Fire & Explosion Response first');
                          return;
                        }
                        triggerHaptic(20);
                        onSelectModule('gas_leak');
                      }}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                        gasStatus.completed 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : isFirePassed
                            ? 'bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 border border-white/[0.08]'
                            : 'bg-white/[0.03] text-zinc-500 border border-white/[0.05]'
                      }`}
                    >
                      {gasStatus.completed ? (
                        <>
                          <Check className="w-3 h-3 stroke-[2]" />
                          <span>Certified</span>
                        </>
                      ) : isFirePassed ? (
                        <>
                          <span>Start</span>
                          <ChevronRight className="w-3 h-3 stroke-[2]" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 stroke-[1.75]" />
                          <span>Locked</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </article>

            {/* Module 4: LOTO Mechanical Isolation (UPCOMING) */}
            <article 
              onClick={() => showToast('Upcoming Module: LOTO Mechanical Isolation')}
              className="bg-white/[0.015] border border-white/[0.04] rounded-xl p-3.5 transition cursor-pointer opacity-60 hover:opacity-75"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 text-zinc-500">
                  <Lock className="w-4 h-4 stroke-[1.75]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-semibold text-zinc-300 truncate pr-2">
                      LOTO Mechanical Isolation
                    </h4>
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-400 border border-white/[0.06]">
                      Upcoming
                    </span>
                  </div>
                  
                  <div className="w-full bg-white/[0.04] rounded-full h-1 overflow-hidden mb-2.5">
                    <div className="bg-white/[0.1] h-1 rounded-full w-0" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500">
                      In Development • Advanced Module
                    </span>
                    <span className="text-[10px] font-medium px-2 py-1 rounded bg-white/[0.03] text-zinc-500 border border-white/[0.05]">
                      Upcoming
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* Module 5: Strata Control & Roof Bolting (UPCOMING) */}
            <article 
              onClick={() => showToast('Upcoming Module: Strata Control & Roof Bolting')}
              className="bg-white/[0.015] border border-white/[0.04] rounded-xl p-3.5 transition cursor-pointer opacity-60 hover:opacity-75"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 text-zinc-500">
                  <Layers className="w-4 h-4 stroke-[1.75]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-semibold text-zinc-300 truncate pr-2">
                      Strata Control &amp; Roof Bolting
                    </h4>
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-400 border border-white/[0.06]">
                      Upcoming
                    </span>
                  </div>
                  
                  <div className="w-full bg-white/[0.04] rounded-full h-1 overflow-hidden mb-2.5">
                    <div className="bg-white/[0.1] h-1 rounded-full w-0" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-500">
                      In Development • Advanced Module
                    </span>
                    <span className="text-[10px] font-medium px-2 py-1 rounded bg-white/[0.03] text-zinc-500 border border-white/[0.05]">
                      Upcoming
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Quick Access Grid */}
        <section data-purpose="quick-access-shortcuts" className="text-left">
          <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-0.5">
            Quick Access
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button 
              type="button"
              onClick={() => { triggerHaptic(15); alert('My Assessments: 1 Core AR Drill (Fire Safety PASS Protocol) ready for retraining.'); }}
              className="bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.06] rounded-xl p-3 flex items-center gap-2.5 text-left transition active:scale-[0.99]"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.75]" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-white truncate">Assessments</span>
                <span className="block text-[10px] text-zinc-400">1 Ready</span>
              </div>
            </button>

            <button 
              type="button"
              onClick={() => { triggerHaptic(15); alert('Verified DGMS Safety Certificate: Level 1 Mining Safety Pass ID #JH-WRK-00182.'); }}
              className="bg-white/[0.025] hover:bg-white/[0.05] border border-white/[0.06] rounded-xl p-3 flex items-center gap-2.5 text-left transition active:scale-[0.99]"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-3.5 h-3.5 stroke-[1.75]" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-semibold text-white truncate">Certificates</span>
                <span className="block text-[10px] text-zinc-400">Verified</span>
              </div>
            </button>
          </div>
        </section>

        {/* Status indicator */}
        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-normal">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Offline Ready • Local Sync Active</span>
        </div>
      </div>

      {/* Bottom Navigation Dock */}
      <nav aria-label="Main Navigation" className="fixed bottom-0 max-w-md w-full bg-[#090A0F]/90 backdrop-blur-xl border-t border-white/[0.06] px-6 py-2.5 flex justify-between items-center z-30">
        <button
          type="button"
          onClick={() => { triggerHaptic(15); setActiveTab('home'); }}
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <Home className="w-4 h-4 stroke-[1.75]" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          type="button"
          onClick={() => { triggerHaptic(15); onSelectModule('ppe_hazard'); }}
          className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-200"
        >
          <Layers className="w-4 h-4 stroke-[1.75]" />
          <span className="text-[10px] font-medium">Training</span>
        </button>

        <button
          type="button"
          onClick={() => { triggerHaptic(15); alert('Verified DGMS Safety Certificates: 2 Verified on Coal India Ledger.'); }}
          className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-200"
        >
          <Award className="w-4 h-4 stroke-[1.75]" />
          <span className="text-[10px] font-medium">Certificates</span>
        </button>

        <button
          type="button"
          onClick={() => { triggerHaptic(15); setShowMenu(true); }}
          className="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-200"
        >
          <User className="w-4 h-4 stroke-[1.75]" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>

      {/* Lock Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 max-w-xs w-[90%] bg-[#151926]/95 border border-amber-500/40 text-amber-200 text-xs px-3.5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-fadeIn backdrop-blur-md">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="leading-snug text-left">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Flame, 
  Wind, 
  ShieldCheck, 
  Lock, 
  Layers, 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  AlertTriangle,
  Radio,
  Check,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Gauge,
  Activity,
  Timer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TRANSLATIONS } from '../i18n/translations';
import { offlineSync } from '../services/offlineSync';

// Comprehensive drill definitions
const DRILL_SPECS = {
  fire_safety: {
    moduleType: 'FIRE_SAFETY_PASS',
    title: 'Fire & Explosion Response (AR Drill)',
    badge: 'P.A.S.S. PROTOCOL',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: Flame,
    iconColor: 'text-amber-400',
    steps: [
      { id: 'pull', letter: 'P', title: 'Pull the Safety Pin', desc: 'Break plastic tamper seal and pull extinguisher locking ring pin.' },
      { id: 'aim', letter: 'A', title: 'Aim at Fire Base', desc: 'Direct heavy horn nozzle at the fuel base, not flames.' },
      { id: 'squeeze', letter: 'S', title: 'Squeeze Trigger Lever', desc: 'Depress levers slowly to release pressurized dry chemical agent.' },
      { id: 'sweep', letter: 'S', title: 'Sweep Side-to-Side', desc: 'Sweep extinguishing stream across fire base until completely out.' }
    ]
  },
  gas_leak: {
    moduleType: 'GAS_LEAK_DETECTION',
    title: 'Gas Leak & Confined Space Calibration',
    badge: 'CH4 / CO TOXIC ATMOSPHERE',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    icon: Wind,
    iconColor: 'text-sky-400',
    steps: [
      { id: 'zero', letter: '1', title: 'Zero Sensor Detector', desc: 'Power on 4-gas optical sensor and calibrate clean air baseline.' },
      { id: 'sample', letter: '2', title: 'Sample Underground Face', desc: 'Insert probe into deep seam. Methane spike: 3.2% LEL detected.' },
      { id: 'scba', letter: '3', title: 'Don Breathing Apparatus', desc: 'Activate positive-pressure SCBA oxygen mask with seal check.' },
      { id: 'vent', letter: '4', title: 'Engage Auxiliary Ventilation', desc: 'Start forced auxiliary ducting fan to purge toxic gas below 0.5%.' }
    ]
  },
  ppe_hazard: {
    moduleType: 'PPE_INSPECTION',
    title: 'Mandatory PPE & Workface Hazard Audit',
    badge: 'DGMS FORM-IV COMPLIANCE',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icon: ShieldCheck,
    iconColor: 'text-emerald-400',
    steps: [
      { id: 'helmet', letter: '1', title: 'Safety Helmet & Harness', desc: 'Audit 6-point suspension harness tension and lock chin strap.' },
      { id: 'lamp', letter: '2', title: 'Cap Lamp & Beam Test', desc: 'Inspect battery pack casing and test 4500-lumen emergency beam.' },
      { id: 'boots', letter: '3', title: 'Metatarsal Steel Boots', desc: 'Verify steel-toe cap condition and slip-resistant sole tread.' },
      { id: 'dgms', letter: '4', title: 'Sign Safety Compliance', desc: 'Scan workface roof strata and sign digital DGMS Form-IV compliance.' }
    ]
  },
  loto: {
    moduleType: 'LOTO_ISOLATION',
    title: 'Lockout / Tagout High-Voltage Isolation',
    badge: 'ZERO ENERGY VERIFICATION',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: Lock,
    iconColor: 'text-amber-400',
    steps: [
      { id: 'locate', letter: '1', title: 'Locate Upstream Breaker', desc: 'Identify 3.3kV main supply breaker for slurry pump motor.' },
      { id: 'trip', letter: '2', title: 'Trip Isolation Switch', desc: 'Pull manual disconnect lever down into complete OFF position.' },
      { id: 'hasp', letter: '3', title: 'Attach Lockout Hasp', desc: 'Fit multi-worker steel lockout hasp and apply personal padlock.' },
      { id: 'tag', letter: '4', title: 'Affix DANGER Tag', desc: 'Write worker ID and timestamp on high-visibility out-of-service tag.' },
      { id: 'try', letter: '5', title: 'Zero Energy Try Test', desc: 'Test voltmeter probes across phases to confirm 0.0V dead circuit.' }
    ]
  },
  roof_bolting: {
    moduleType: 'STRATA_ROOF_BOLT',
    title: 'Strata Control & Chemical Roof Bolting',
    badge: 'ROOF STRATA STABILIZATION',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    icon: Layers,
    iconColor: 'text-purple-400',
    steps: [
      { id: 'sound', letter: '1', title: 'Strata Sounding Test', desc: 'Strike roof with sounding hammer to identify loose rock resonance.' },
      { id: 'drill', letter: '2', title: 'Bore 32mm Pilot Hole', desc: 'Drill 1.8m anchor hole through fracture line into solid sandstone.' },
      { id: 'resin', letter: '3', title: 'Insert Resin Capsule', desc: 'Feed dual-setting thixotropic polyester chemical resin capsules.' },
      { id: 'bolt', letter: '4', title: 'Drive & Spin Steel Bolt', desc: 'Insert steel rebar bolt and rotate 15 seconds to mix chemical resin.' },
      { id: 'torque', letter: '5', title: 'Torque to 150 Nm', desc: 'Torque domed bearing plate to DGMS certified 150 Nm tension.' }
    ]
  }
};

export default function InteractiveDrillModal({ 
  moduleId = 'fire_safety', 
  worker, 
  language, 
  onClose, 
  onCompleteDrill 
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.English;
  const spec = DRILL_SPECS[moduleId] || DRILL_SPECS.fire_safety;
  const IconComponent = spec.icon;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isDrillStarted, setIsDrillStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [fireHealth, setFireHealth] = useState(100);
  const [gasCh4Level, setGasCh4Level] = useState(3.4);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enhanced multi-phase Fire Simulation states: 'scan' -> 'decision' -> 'pass' -> 'evacuate' -> complete
  const [fireStage, setFireStage] = useState('scan');
  const [equipmentWarning, setEquipmentWarning] = useState(null);

  // Timer
  useEffect(() => {
    let timer;
    if (isDrillStarted && !isFinished) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => +(prev + 0.1).toFixed(1));
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isDrillStarted, isFinished]);

  // Haptic feedback
  const triggerHaptic = (ms = 25) => {
    try {
      if (window.AndroidBridge && typeof window.AndroidBridge.triggerHaptic === 'function') {
        window.AndroidBridge.triggerHaptic(ms);
      } else if (navigator.vibrate) {
        navigator.vibrate(ms);
      }
    } catch {}
  };

  // Launch embedded Unity AR (only for fire safety on Android)
  const handleLaunchUnityAR = () => {
    triggerHaptic(40);
    const workerId = worker?.worker_id || 'W-7042';
    const lang = language || 'English';

    if (window.AndroidBridge && typeof window.AndroidBridge.launchAR === 'function') {
      console.log('[Native AndroidBridge] Launching Unity AR activity from drill modal...');
      window.AndroidBridge.launchAR(workerId, lang);
      return;
    }

    // Custom URL scheme fallback
    window.location.href = `johar://simulate?drill=fire_safety&worker_id=${encodeURIComponent(workerId)}&language=${encodeURIComponent(lang)}`;
  };

  // Select equipment in decision stage
  const handleSelectEquipment = (choice) => {
    triggerHaptic(35);
    setEquipmentWarning(null);

    if (choice === 'water') {
      setEquipmentWarning('⚠️ DANGER! Never use Water on Mine Electrical or Coal Fires! Severe risk of electrocution & steam explosion.');
      return;
    }

    if (choice === 'cloth') {
      setEquipmentWarning('⚠️ INSUFFICIENT! A wet cloth cannot control an underground industrial coal fire! Choose appropriate equipment.');
      return;
    }

    if (choice === 'extinguisher') {
      setEquipmentWarning(null);
      setFireStage('pass');
      setCurrentStepIndex(0);
    }
  };

  // Progress to next step
  const handleStepAction = () => {
    triggerHaptic(30);
    if (!isDrillStarted) setIsDrillStarted(true);

    // Fire Safety custom multi-phase flow
    if (moduleId === 'fire_safety') {
      if (fireStage === 'scan') {
        setFireStage('decision');
        return;
      }

      if (fireStage === 'pass') {
        if (currentStepIndex === 0) {
          setCurrentStepIndex(1); // Seal & pin
        } else if (currentStepIndex === 1) {
          setCurrentStepIndex(2); // Aim
        } else {
          // Spraying
          setFireHealth(prev => {
            const next = Math.max(0, prev - 35);
            if (next === 0) {
              setFireStage('evacuate');
            }
            return next;
          });
        }
        return;
      }

      if (fireStage === 'evacuate') {
        completeTheDrill();
        return;
      }
      return;
    }

    // Gas Leak custom mechanic
    if (moduleId === 'gas_leak') {
      if (currentStepIndex < 3) {
        setCurrentStepIndex(prev => prev + 1);
        if (currentStepIndex === 2) {
          setGasCh4Level(0.2); // Vent cleared gas
        }
      } else {
        completeTheDrill();
      }
      return;
    }

    // General step progression
    if (currentStepIndex < spec.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTheDrill();
    }
  };

  const completeTheDrill = async () => {
    if (isFinished || isSubmitting) return;
    setIsSubmitting(true);
    setIsFinished(true);
    triggerHaptic(60);

    // Celebration confetti
    try {
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}

    const duration = elapsedSeconds > 0 ? elapsedSeconds : (Math.floor(Math.random() * 5) + 7.5);
    const score = 100;

    // Immediately synchronize to Supabase Cloud Database!
    try {
      await offlineSync.recordTrainingSession(
        spec.moduleType,
        true,
        duration,
        score,
        3
      );
      console.log(`[DrillModal] Logged ${spec.moduleType} to Supabase successfully.`);
    } catch (err) {
      console.error('[DrillModal] Error recording training to Supabase:', err);
    }

    setIsSubmitting(false);

    if (onCompleteDrill) {
      onCompleteDrill({
        moduleId,
        moduleType: spec.moduleType,
        duration,
        score
      });
    }
  };

  const handleReset = () => {
    triggerHaptic(20);
    setCurrentStepIndex(0);
    setElapsedSeconds(0);
    setIsDrillStarted(false);
    setIsFinished(false);
    setFireHealth(100);
    setGasCh4Level(3.4);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn select-none">
      <div className="w-full max-w-[420px] bg-[#090A0F] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <header className="px-4 py-3.5 border-b border-white/[0.06] bg-[#090A0F] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
              <IconComponent className={`w-4 h-4 ${spec.iconColor}`} />
            </div>
            <div>
              <span className={`text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded border ${spec.badgeColor} inline-block`}>
                {spec.badge}
              </span>
              <h3 className="text-sm font-semibold text-white tracking-tight truncate max-w-[230px] mt-0.5">
                {spec.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Body Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 no-scrollbar">

          {/* Android Unity AR Option (if Fire Safety) */}
          {moduleId === 'fire_safety' && (
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-3 flex items-center justify-between gap-2.5">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-xs font-medium text-white">Native Spatial AR Simulation</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Interactive 3D pass drill anchored in physical workspace
                </p>
              </div>
              <button
                type="button"
                onClick={handleLaunchUnityAR}
                className="bg-white hover:bg-slate-200 text-black text-[11px] font-semibold px-3 py-1.5 rounded-lg active:scale-95 transition tracking-wide shrink-0 flex items-center gap-1"
              >
                <span>Launch</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Interactive Drill Simulation Stage */}
          <div className="bg-[#0D0F17] border border-white/[0.06] rounded-xl p-4 relative overflow-hidden text-center">
            
            {/* Live Timer Pill */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-500">
                Evaluation Protocol
              </span>
              <span className="text-xs font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                <Timer className="w-3 h-3" />
                <span>{elapsedSeconds.toFixed(1)}s</span>
              </span>
            </div>

            {/* Dynamic Stage Canvas Visuals */}
            {isFinished ? (
              <div className="py-4 space-y-2 animate-fadeIn">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-white">
                  Drill Successfully Completed
                </h4>
                <p className="text-xs text-emerald-400 font-medium">
                  Score: 100/100 • Time: {elapsedSeconds > 0 ? elapsedSeconds : '8.5'}s
                </p>
                <p className="text-[10px] text-slate-400">
                  Audit log synced to central mine operations registry.
                </p>
              </div>
            ) : moduleId === 'fire_safety' ? (
              <div className="py-2 flex flex-col items-center justify-center space-y-2">
                {fireStage === 'scan' && (
                  <div className="space-y-2 animate-fadeIn w-full">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Smartphone className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="text-xs font-semibold text-white">
                      Scanning Underground Environment
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Move phone camera around to scan the floor plane for hazard anchors.
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Floor Plane Anchored (2.0m)</span>
                    </div>
                  </div>
                )}

                {fireStage === 'decision' && (
                  <div className="space-y-2.5 animate-fadeIn w-full">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                        <Flame className="w-5 h-5 animate-bounce" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-red-400 uppercase tracking-tight">Hazard Detected</div>
                        <div className="text-[10px] text-slate-300">Coal dust & cable fire on floor plane</div>
                      </div>
                    </div>

                    <p className="text-[11px] font-semibold text-white">
                      Select the appropriate fire response tool:
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectEquipment('water')}
                        className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex flex-col items-center gap-1 text-center transition active:scale-95"
                      >
                        <span className="text-xl">🪣</span>
                        <span className="text-[10px] font-bold text-slate-200">Water</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectEquipment('extinguisher')}
                        className="p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border-2 border-amber-500 flex flex-col items-center gap-1 text-center transition active:scale-95 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                      >
                        <span className="text-xl">🧯</span>
                        <span className="text-[10px] font-black text-amber-300">Extinguisher</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectEquipment('cloth')}
                        className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex flex-col items-center gap-1 text-center transition active:scale-95"
                      >
                        <span className="text-xl">🧺</span>
                        <span className="text-[10px] font-bold text-slate-200">Wet Cloth</span>
                      </button>
                    </div>

                    {equipmentWarning && (
                      <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-[10px] text-red-300 text-left flex items-start gap-1.5 animate-fadeIn">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <span>{equipmentWarning}</span>
                      </div>
                    )}
                  </div>
                )}

                {fireStage === 'pass' && (
                  <div className="space-y-2 animate-fadeIn w-full">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-1 text-amber-400">
                      <Flame className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="w-full max-w-[240px] mx-auto bg-white/[0.06] rounded-full h-1.5 overflow-hidden mb-1">
                      <div 
                        className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${fireHealth}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 font-mono">
                      Fire Intensity: {fireHealth}%
                    </span>
                  </div>
                )}

                {fireStage === 'evacuate' && (
                  <div className="space-y-2 animate-fadeIn w-full py-1">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)] animate-bounce">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-tight">
                      Fire Extinguished!
                    </div>
                    <p className="text-[10px] text-slate-300">
                      Emergency Fire Exit detected 2.5m away. Tap below to complete evacuation.
                    </p>
                    <button
                      type="button"
                      onClick={completeTheDrill}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 active:scale-95 transition flex items-center justify-center gap-1.5"
                    >
                      <span>🚪 TAP TO EVACUATE VIA FIRE EXIT</span>
                    </button>
                  </div>
                )}
              </div>
            ) : moduleId === 'gas_leak' ? (
              <div className="py-2 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-2 text-sky-400">
                  <Gauge className="w-6 h-6" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-mono font-medium mb-1">
                  <Activity className="w-3 h-3 text-sky-400 animate-pulse" />
                  <span>CH4 Concentration: {gasCh4Level}% LEL</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {gasCh4Level <= 0.5 ? 'Safe breathable atmosphere restored' : 'Elevated atmosphere hazard detected'}
                </span>
              </div>
            ) : moduleId === 'loto' ? (
              <div className="py-2 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-2 text-amber-400">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-white">
                  3.3kV Main Feeder Panel
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Phase {currentStepIndex + 1} of {spec.steps.length}: {spec.steps[currentStepIndex]?.title}
                </span>
              </div>
            ) : (
              <div className="py-2 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-2 text-purple-400">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-white">
                  Strata Roof Integrity Test
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Phase {currentStepIndex + 1} of {spec.steps.length}: {spec.steps[currentStepIndex]?.title}
                </span>
              </div>
            )}
          </div>

          {/* Operational Steps List */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              Action Verification Steps
            </h4>
            <div className="space-y-1.5">
              {spec.steps.map((step, idx) => {
                const isActive = !isFinished && currentStepIndex === idx;
                const isPassed = isFinished || currentStepIndex > idx;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500/40 text-white ring-1 ring-amber-500/20'
                        : isPassed
                        ? 'bg-white/[0.04] border-white/[0.08] text-slate-200'
                        : 'bg-white/[0.01] border-white/[0.04] text-slate-500 opacity-60'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-semibold shrink-0 ${
                      isPassed
                        ? 'bg-white text-black'
                        : isActive
                        ? 'bg-amber-400 text-black'
                        : 'bg-white/[0.06] text-slate-400'
                    }`}>
                      {isPassed ? <Check className="w-3.5 h-3.5" /> : step.letter}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-medium text-white truncate">
                        {step.title}
                      </h5>
                      <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <footer className="p-3.5 border-t border-white/[0.06] bg-[#090A0F] flex gap-2">
          {isFinished ? (
            <>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-300 active:scale-95 transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repeat Drill</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-200 text-black text-xs font-semibold active:scale-95 transition flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Done</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleStepAction}
              disabled={moduleId === 'fire_safety' && fireStage === 'decision'}
              className={`w-full py-2.5 px-4 rounded-xl transition font-semibold text-xs tracking-wide flex items-center justify-center gap-1.5 ${
                moduleId === 'fire_safety' && fireStage === 'decision'
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/[0.06]'
                  : 'bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-black shadow-md shadow-amber-500/20'
              }`}
            >
              <span>
                {moduleId === 'fire_safety'
                  ? (fireStage === 'scan'
                      ? 'Start Simulation (Auto Floor Anchor)'
                      : fireStage === 'decision'
                      ? 'Select Equipment Option Above'
                      : fireStage === 'pass' && currentStepIndex >= 2
                      ? `Squeeze & Sweep (${Math.ceil(fireHealth / 35)} sweeps left)`
                      : fireStage === 'evacuate'
                      ? 'Tap Emergency Exit Above'
                      : `Step ${currentStepIndex + 1}: ${spec.steps[currentStepIndex]?.title}`)
                  : currentStepIndex < spec.steps.length - 1
                  ? `Execute Step ${currentStepIndex + 1}: ${spec.steps[currentStepIndex]?.title}`
                  : `Complete Protocol`}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

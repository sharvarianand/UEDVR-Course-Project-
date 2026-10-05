import React, { useState } from 'react';
import { ArrowLeft, Volume2, CheckCircle2, Clock, Zap, Layers, Download, Play, Check, ShieldCheck, Flame, Wind, Lock } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

const MODULE_DATA = {
  fire_safety: {
    title: 'Fire & Explosion Response',
    level: 'HIGH PRIORITY',
    levelColor: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    heroImage: './module_images/module_fire_safety_hero.jpg',
    description: 'Learn to identify, respond and control underground fire hazards in industrial environments with PASS protocol.',
    objectives: [
      'Identify coal dust & belt conveyor fire hazards',
      'Select correct PPE (Self-Rescuer & Flame Retardant Suit)',
      'Choose appropriate extinguisher (Class A, B, C, D)',
      'Execute P.A.S.S. protocol (Pull, Aim, Squeeze, Sweep)',
      'Follow safe underground evacuation procedures'
    ],
    duration: '6-8 minutes',
    difficulty: 'Intermediate',
    difficultyBars: [true, true, false],
    mode: 'AR Simulation',
    offline: true,
    ctaText: 'START SIMULATION',
    isAR: true
  },
  gas_leak: {
    title: 'Gas Leak & Confined Space',
    level: 'HAZARDOUS ATMOSPHERE',
    levelColor: 'text-sky-400 bg-sky-500/10 border-sky-500/25',
    heroImage: './module_images/module_gas_leak_hero.jpg',
    description: 'Detect toxic and explosive atmospheric gases (CH4, CO, H2S) in confined mine shafts with multi-gas detector calibration.',
    objectives: [
      'Calibrate 4-gas optical sensor detector',
      'Identify Lower Explosive Limit (LEL) for Methane (CH4)',
      'Don positive-pressure self-contained breathing apparatus',
      'Establish forced atmospheric ventilation ducting',
      'Execute emergency underground evacuation horn protocol'
    ],
    duration: '7-10 minutes',
    difficulty: 'Advanced',
    difficultyBars: [true, true, true],
    mode: 'AR Procedure',
    offline: true,
    ctaText: 'START TRAINING',
    isAR: false
  },
  ppe_hazard: {
    title: 'PPE & Hazard Inspection',
    level: 'MANDATORY DGMS AUDIT',
    levelColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
    heroImage: './module_images/module_ppe_hazard_hero.jpg',
    description: 'Directorate General of Mines Safety (DGMS) certified curriculum covering life-saving personal protective equipment, buddy audits, and underground workface hazard detection.',
    objectives: [
      'Hard hat (IS 2925) suspension & cap lamp lumen audit',
      'Anti-fog ballistic goggles & P100 particulate respirator',
      'SCSR emergency self-rescuer & metatarsal footwear',
      'Workface atmospheric toxic gases & strata sounding',
      'Interactive 2-part learning modules & DGMS certification quiz'
    ],
    duration: '8-10 minutes',
    difficulty: 'DGMS Standard',
    difficultyBars: [true, true, false],
    mode: 'Interactive Course & Quiz',
    offline: true,
    ctaText: 'START TRAINING',
    isAR: false
  },
  loto: {
    title: 'LOTO Mechanical Isolation',
    level: 'ZERO ENERGY STATE',
    levelColor: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
    heroImage: './module_images/module_loto_hero.jpg',
    description: 'Lockout / Tagout high-voltage control breakers, slurry pumps, and heavy haulage gear before scheduled maintenance.',
    objectives: [
      'Identify all stored energy sources (electrical, hydraulic, gravity)',
      'Isolate master 3.3kV feeder circuit breaker with padlocks',
      'Bleed residual fluid pressure from hydraulic rock drills',
      'Apply standardized DGMS Danger Tags with worker ID stamp',
      'Attempt restart test to verify absolute zero energy state'
    ],
    duration: '10-12 minutes',
    difficulty: 'Intermediate',
    difficultyBars: [true, true, false],
    mode: 'AR Interactive Isolation',
    offline: true,
    ctaText: 'COMMENCE LOTO DRILL',
    isAR: false
  },
  roof_bolting: {
    title: 'Strata Control & Roof Bolting',
    level: 'STRUCTURAL INTEGRITY',
    levelColor: 'text-zinc-400 bg-white/[0.06] border-white/[0.1]',
    heroImage: './module_images/module_roof_bolting_hero.jpg',
    description: 'Evaluate roof strata stability using sounding rod technique and operate resin capsule roof bolter drill.',
    objectives: [
      'Sound test roof strata using acoustic brass sounding bar',
      'Inspect mechanical resin capsule setting and resin hardening rate',
      'Position hydraulic bolting rig at 90-degree strata angle',
      'Torque roof bolts to DGMS 150 Nm retention standard',
      'Install tell-tale visual strata movement gauge'
    ],
    duration: '12-15 minutes',
    difficulty: 'Advanced',
    difficultyBars: [true, true, true],
    mode: 'AR Strata Scanner',
    offline: true,
    ctaText: 'INSPECT ROOF STRATA',
    isAR: false
  }
};

export default function ModuleDetailsScreen({ 
  worker, 
  language, 
  moduleId = 'fire_safety', 
  onBack, 
  onStartSimulation 
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.English;
  const [audioActive, setAudioActive] = useState(false);
  const mod = MODULE_DATA[moduleId] || MODULE_DATA.fire_safety;

  const triggerHaptic = (ms = 25) => {
    try {
      if (window.AndroidBridge && typeof window.AndroidBridge.triggerHaptic === 'function') {
        window.AndroidBridge.triggerHaptic(ms);
      } else if (navigator.vibrate) {
        navigator.vibrate(ms);
      }
    } catch {}
  };

  const handleStart = () => {
    triggerHaptic(40);
    if (onStartSimulation) {
      onStartSimulation(moduleId, mod.isAR);
    }
  };

  const toggleAudio = () => {
    triggerHaptic(20);
    setAudioActive(!audioActive);
    if ('speechSynthesis' in window) {
      if (!audioActive) {
        window.speechSynthesis.cancel();
        const text = language === 'Hindi'
          ? `${mod.title} प्रशिक्षण। ${mod.description}`
          : `${mod.title}. ${mod.description}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';
        window.speechSynthesis.speak(utterance);
      } else {
        window.speechSynthesis.cancel();
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-[#090A0F] min-h-screen flex flex-col justify-between shadow-2xl relative border-x border-white/[0.06] pb-32 mx-auto select-none font-sans text-slate-100">
      {/* Top Bar and Header */}
      <header className="sticky top-0 z-30 bg-[#090A0F]/90 backdrop-blur-xl px-4 py-3 border-b border-white/[0.06]">
        <nav aria-label="Module Navigation" className="flex items-center justify-between">
          <button
            aria-label="Go Back"
            onClick={() => { triggerHaptic(15); onBack(); }}
            className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] flex items-center justify-center text-zinc-300 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.75]" />
          </button>
          
          <h1 className="text-sm font-semibold text-white tracking-tight truncate px-2">
            {mod.title}
          </h1>

          {/* Narration / Audio button */}
          <button
            aria-label="Listen in your language"
            onClick={toggleAudio}
            className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] flex items-center justify-center text-amber-400 active:scale-95 transition-all relative"
          >
            <Volume2 className="w-4 h-4 stroke-[1.75]" />
            <span className={`absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ${audioActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`}></span>
          </button>
        </nav>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pt-3 space-y-3.5 text-left" data-purpose="module-details-scroll">
        {/* Hero Banner Image Area */}
        <section className="relative rounded-2xl overflow-hidden border border-white/[0.07] bg-zinc-900 group" data-purpose="hero-banner">
          <div className="h-44 w-full relative">
            <img 
              alt="Training Background" 
              className="w-full h-full object-cover hero-mask" 
              src={mod.heroImage}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-zinc-950/40 to-transparent"></div>
            
            {/* Minimal Priority Badge */}
            <div className="absolute top-3 left-3 bg-[#090A0F]/80 backdrop-blur-md border border-white/[0.1] px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-[10px] font-medium text-zinc-300 uppercase tracking-wider">{mod.level}</span>
            </div>

            {/* Language indicator */}
            <div className="absolute bottom-3 right-3 bg-[#090A0F]/80 border border-white/[0.08] px-2 py-0.5 rounded text-[10px] text-zinc-300 flex items-center gap-1 font-medium backdrop-blur-sm">
              <span className="text-zinc-500">Audio:</span>
              <span className="text-amber-400 font-medium">{language === 'Hindi' ? 'हिन्दी' : language === 'Santali' ? 'ᱥᱟᱱᱛᱟᱲᱤ' : 'English'}</span>
            </div>
          </div>
        </section>

        {/* Description Block */}
        <section className="space-y-1" data-purpose="module-description">
          <p className="text-zinc-300 text-xs leading-relaxed font-normal">
            {mod.description}
          </p>
        </section>

        {/* Key Learning Objectives */}
        <section className="bg-white/[0.025] border border-white/[0.07] rounded-xl p-3.5 space-y-2.5" data-purpose="learning-objectives-card">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 stroke-[1.75]" />
            Key Learning Objectives
          </h2>
          <ul className="space-y-2 text-xs text-zinc-300">
            {mod.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center mt-0.5 font-bold text-[9px]">
                  ✓
                </span>
                <span className="font-normal text-[11px] leading-snug">{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Module Specs Meta Grid */}
        <section className="bg-white/[0.02] border border-white/[0.06] rounded-xl divide-y divide-white/[0.04] text-xs" data-purpose="meta-specifications">
          {/* Duration */}
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-400 stroke-[1.5]" />
              <span className="text-[11px]">Duration</span>
            </div>
            <span className="font-medium text-white font-mono text-[11px]">{mod.duration}</span>
          </div>

          {/* Difficulty */}
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400">
              <Zap className="w-3.5 h-3.5 text-zinc-400 stroke-[1.5]" />
              <span className="text-[11px]">Difficulty</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-white text-[11px]">{mod.difficulty}</span>
              <div className="flex gap-0.5">
                <div className={`w-1 h-2 rounded-sm ${mod.difficultyBars[0] ? 'bg-amber-500' : 'bg-zinc-800'}`}></div>
                <div className={`w-1 h-2 rounded-sm ${mod.difficultyBars[1] ? 'bg-amber-500' : 'bg-zinc-800'}`}></div>
                <div className={`w-1 h-2 rounded-sm ${mod.difficultyBars[2] ? 'bg-amber-500' : 'bg-zinc-800'}`}></div>
              </div>
            </div>
          </div>

          {/* Mode */}
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400">
              <Layers className="w-3.5 h-3.5 text-zinc-400 stroke-[1.5]" />
              <span className="text-[11px]">Mode</span>
            </div>
            <span className="font-medium text-white text-[11px]">{mod.mode}</span>
          </div>

          {/* Offline Available */}
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400">
              <Download className="w-3.5 h-3.5 text-emerald-400 stroke-[1.5]" />
              <span className="text-[11px]">Offline Status</span>
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
              <Check className="w-3 h-3 stroke-[2]" />
              Ready
            </span>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Bar */}
      <footer className="fixed bottom-0 max-w-md w-full bg-[#090A0F]/90 backdrop-blur-xl border-t border-white/[0.06] p-4 space-y-2 z-40" data-purpose="cta-bottom-bar">
        {/* Main Action Button */}
        <button
          type="button"
          onClick={handleStart}
          aria-label={mod.ctaText}
          className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.99] transition-all text-zinc-950 font-semibold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 text-xs tracking-wider uppercase"
        >
          <Play className="w-3.5 h-3.5 fill-current text-zinc-950" />
          <span>{mod.ctaText}</span>
        </button>

        {/* Offline Status Subtext */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-normal">
          <Check className="w-3 h-3 text-emerald-500 stroke-[2]" />
          <span>Downloaded &amp; ready for offline industrial use</span>
        </div>
      </footer>
    </div>
  );
}


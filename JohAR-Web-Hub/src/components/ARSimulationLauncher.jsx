import React, { useState, useEffect } from 'react';
import { X, Flame, Smartphone, Play, CheckCircle2, RotateCcw, Sparkles, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TRANSLATIONS } from '../i18n/translations';
import { offlineSync } from '../services/offlineSync';

export default function ARSimulationLauncher({ worker, language, onClose, onCompleteDrill }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.English;

  // Simulator step: 0 = Idle/P, 1 = Aim, 2 = Squeeze, 3 = Sweep, 4 = Complete
  const [activeStep, setActiveStep] = useState(0);
  const [fireHealth, setFireHealth] = useState(100);
  const [isSqueezing, setIsSqueezing] = useState(false);
  const [sweepCount, setSweepCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [drillStarted, setDrillStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [intentLaunched, setIntentLaunched] = useState(false);

  // Timer for drill
  useEffect(() => {
    let timer;
    if (drillStarted && !isCompleted) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => +(prev + 0.1).toFixed(1));
      }, 100);
    }
    return () => clearInterval(timer);
  }, [drillStarted, isCompleted]);

  // Register Native Android Bridge completion listener
  useEffect(() => {
    window.onARDrillComplete = (data) => {
      console.log('[Native AndroidBridge] Received AR Drill Completion:', data);
      triggerCompletion(data?.duration || 8.5, data?.score || 100);
    };
    return () => {
      window.onARDrillComplete = null;
    };
  }, []);

  // Launch on Android phone (Direct Native Activity or Custom Scheme)
  const launchUnityARIntent = () => {
    setIntentLaunched(true);
    const workerId = worker.worker_id || 'W-7042';
    const lang = language || 'English';

    // 1. Direct Native Android Activity Invocation (Single APK)
    if (window.AndroidBridge && typeof window.AndroidBridge.launchAR === 'function') {
      console.log('[Native AndroidBridge] Launching embedded Unity AR activity...');
      window.AndroidBridge.launchAR(workerId, lang);
      return;
    }

    // 2. Custom Intent / Deep Link fallback
    const deepLinkUrl = `johar://simulate?drill=fire_safety&worker_id=${encodeURIComponent(workerId)}&language=${encodeURIComponent(lang)}`;
    const intentUrl = `intent://simulate?drill=fire_safety&worker_id=${encodeURIComponent(workerId)}&language=${encodeURIComponent(lang)}#Intent;scheme=johar;package=com.jiwiar.app;end`;

    console.log('[AR Bridge] Attempting to launch Unity AR app:', deepLinkUrl);
    window.location.href = deepLinkUrl;
    setTimeout(() => {
      window.location.href = intentUrl;
    }, 500);
  };

  // Step 1: Pull Pin
  const handlePullPin = () => {
    if (!drillStarted) setDrillStarted(true);
    setActiveStep(1);
  };

  // Step 2: Aim
  const handleAim = () => {
    setActiveStep(2);
  };

  // Step 3 & 4: Squeeze and Sweep
  const handleSweepTick = () => {
    if (activeStep < 2) return;
    setActiveStep(3);
    setSweepCount(prev => {
      const next = prev + 1;
      setFireHealth(h => {
        const remaining = Math.max(0, h - 20);
        if (remaining === 0 && !isCompleted) {
          triggerCompletion();
        }
        return remaining;
      });
      return next;
    });
  };

  const triggerCompletion = async () => {
    setIsCompleted(true);
    setActiveStep(4);

    // Blast celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {}

    const duration = elapsedSeconds > 0 ? elapsedSeconds : 8.5;
    
    // Log to Supabase / offline cache
    await offlineSync.recordTrainingSession(
      'FIRE_SAFETY_PASS',
      true,
      duration,
      100,
      3
    );

    if (onCompleteDrill) {
      onCompleteDrill({ duration, score: 100 });
    }
  };

  const resetDrill = () => {
    setActiveStep(0);
    setFireHealth(100);
    setSweepCount(0);
    setElapsedSeconds(0);
    setDrillStarted(false);
    setIsCompleted(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h3>
            <Flame size={22} color="var(--safety-orange)" />
            {t.mod1Title}
          </h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Mobile Launch Section */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.12) 0%, rgba(20, 28, 48, 0.8) 100%)',
            border: '1.5px solid var(--safety-orange)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <Smartphone size={20} color="var(--safety-orange)" />
                <b style={{ color: '#FFF', fontSize: '1rem' }}>Physical AR Drill on Mobile</b>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Tap below on your Android phone to launch the Unity AR simulation directly on your device camera.
              </p>
            </div>

            <button 
              className="btn-primary"
              onClick={launchUnityARIntent}
              style={{ padding: '0.8rem 1.4rem' }}
            >
              <Play size={18} />
              <span>Launch Unity AR</span>
              <ExternalLink size={14} />
            </button>
          </div>

          {intentLaunched && (
            <div style={{
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.8rem',
              color: 'var(--safety-cyan)'
            }}>
              ✓ Launch signal sent (`johar://simulate`). If prompt appears, select <b>JohARApp</b>. Exiting Unity will return here automatically.
            </div>
          )}

          {/* PASS Protocol Steps Visualizer */}
          <h4 style={{ color: '#FFF', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            P.A.S.S. Operational Protocol
          </h4>
          <div className="pass-steps-row">
            <div className={`pass-step-card ${activeStep === 0 ? 'active' : ''}`}>
              <div className="step-letter">P</div>
              <div className="step-title">{t.passP_title}</div>
              <div className="step-desc">{t.passP_desc}</div>
            </div>
            <div className={`pass-step-card ${activeStep === 1 ? 'active' : ''}`}>
              <div className="step-letter">A</div>
              <div className="step-title">{t.passA_title}</div>
              <div className="step-desc">{t.passA_desc}</div>
            </div>
            <div className={`pass-step-card ${activeStep === 2 ? 'active' : ''}`}>
              <div className="step-letter">S</div>
              <div className="step-title">{t.passS1_title}</div>
              <div className="step-desc">{t.passS1_desc}</div>
            </div>
            <div className={`pass-step-card ${activeStep >= 3 ? 'active' : ''}`}>
              <div className="step-letter">S</div>
              <div className="step-title">{t.passS2_title}</div>
              <div className="step-desc">{t.passS2_desc}</div>
            </div>
          </div>

          {/* Interactive Web Simulator Canvas */}
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Interactive In-Browser Evaluation Drill
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--safety-orange)', fontFamily: 'var(--font-mono)' }}>
                ⏱ {elapsedSeconds}s
              </span>
            </div>

            <div className="interactive-drill-canvas">
              {!isCompleted ? (
                <>
                  <div 
                    className="fire-vfx-container"
                    style={{
                      transform: `scale(${0.4 + (fireHealth / 100) * 0.6})`,
                      opacity: fireHealth > 0 ? 1 : 0
                    }}
                  >
                    🔥
                  </div>
                  <div className="drill-gauge-bar">
                    <div 
                      className="drill-gauge-fill" 
                      style={{ 
                        width: `${fireHealth}%`,
                        background: fireHealth > 50 ? 'var(--grad-crimson)' : 'var(--grad-orange)' 
                      }} 
                    />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    Hazard Fire Intensity: {fireHealth}%
                  </span>
                </>
              ) : (
                <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>🧯✨</div>
                  <b style={{ color: 'var(--safety-emerald)', fontSize: '1.15rem' }}>
                    {t.drillCompleteTitle}
                  </b>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {t.drillCompleteSub} • Score: 100/100 • ★★★
                  </p>
                </div>
              )}
            </div>

            {/* Drill Action Controls */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {!isCompleted ? (
                <>
                  {activeStep === 0 && (
                    <button 
                      className="btn-primary" 
                      style={{ flex: 1 }}
                      onClick={handlePullPin}
                    >
                      <span>1. Pull Extinguisher Pin (P)</span>
                    </button>
                  )}

                  {activeStep === 1 && (
                    <button 
                      className="btn-primary" 
                      style={{ flex: 1, background: 'var(--safety-cyan)' }}
                      onClick={handleAim}
                    >
                      <span>2. Aim Nozzle at Base (A)</span>
                    </button>
                  )}

                  {activeStep >= 2 && (
                    <button 
                      className="btn-primary" 
                      style={{ flex: 1, background: 'var(--grad-crimson)' }}
                      onClick={handleSweepTick}
                    >
                      <Flame size={18} />
                      <span>Squeeze & Sweep Side-to-Side ({5 - Math.floor((100 - fireHealth)/20)} left)</span>
                    </button>
                  )}
                </>
              ) : (
                <button 
                  className="btn-secondary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={resetDrill}
                >
                  <RotateCcw size={16} />
                  <span>Repeat Drill</span>
                </button>
              )}

              {isCompleted && (
                <button 
                  className="btn-primary" 
                  style={{ flex: 1 }}
                  onClick={onClose}
                >
                  <CheckCircle2 size={18} />
                  <span>{t.returnHub}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

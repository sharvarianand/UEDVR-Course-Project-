import React, { useState, useEffect } from 'react';
import { X, Radio, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { offlineSync } from '../services/offlineSync';

export default function SOSModal({ language, onClose }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.English;

  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTriggered, setIsTriggered] = useState(false);
  const [beaconId, setBeaconId] = useState('BEACON-SHAFT-4');
  const [zone, setZone] = useState('Exit Shaft B / Zone 4');

  useEffect(() => {
    let interval;
    if (holding && !isTriggered) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            triggerSOS();
            return 100;
          }
          return p + 5;
        });
      }, 75);
    } else if (!holding && !isTriggered) {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [holding, isTriggered]);

  const triggerSOS = async () => {
    setIsTriggered(true);
    try {
      await offlineSync.recordSOSEvent(beaconId, zone);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ border: '2px solid var(--safety-crimson)', boxShadow: 'var(--shadow-red-pulse)' }}
      >
        <div className="modal-header" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
          <h3 style={{ color: '#FFA5A5' }}>
            <Radio size={22} color="var(--safety-crimson)" className="dot-pulse" />
            {t.sosTitle}
          </h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center' }}>
          {!isTriggered ? (
            <>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.18)',
                border: '2px solid var(--safety-crimson)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: 'var(--safety-crimson)'
              }}>
                <ShieldAlert size={44} />
              </div>

              <h4 style={{ color: '#FFF', fontSize: '1.25rem', fontWeight: 800 }}>
                High-Priority Miner Distress Signal
              </h4>
              <p style={{ color: '#F87171', fontSize: '0.85rem', marginTop: '0.35rem', maxWidth: '380px', margin: '0.35rem auto 1.5rem' }}>
                Hold the emergency trigger for 2 seconds to dispatch an immediate SOS broadcast to underground rescue squads.
              </p>

              <div style={{
                background: 'rgba(20, 10, 14, 0.8)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                marginBottom: '1.5rem',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)'
              }}>
                <div>Distress Beacon ID: <b style={{ color: '#FFF' }}>{beaconId}</b></div>
                <div>Geo-Zone Location: <b style={{ color: '#FFF' }}>{zone}</b></div>
              </div>

              {/* Hold to Trigger Button */}
              <button
                type="button"
                className="btn-sos"
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  fontSize: '1.05rem',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseDown={() => setHolding(true)}
                onMouseUp={() => setHolding(false)}
                onTouchStart={() => setHolding(true)}
                onTouchEnd={() => setHolding(false)}
                onClick={triggerSOS}
              >
                <Radio size={22} />
                <span>{holding ? t.sosHolding : t.sosBtn}</span>
                {holding && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${progress}%`,
                    background: 'rgba(255, 255, 255, 0.3)',
                    transition: 'width 0.075s linear'
                  }} />
                )}
              </button>
            </>
          ) : (
            <div style={{ padding: '1rem 0' }}>
              <CheckCircle2 size={56} color="var(--safety-emerald)" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ color: '#FFF', fontSize: '1.35rem', fontWeight: 800 }}>
                {t.sosTriggered}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Surface Control Room & Emergency Rescue Teams have received your location tag at <b>{zone}</b>.
              </p>

              <button 
                className="btn-secondary"
                style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center' }}
                onClick={onClose}
              >
                {t.closeBtn}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

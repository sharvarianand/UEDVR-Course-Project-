import React, { useEffect } from 'react';
import { X, Award, CheckCircle2, Flame, Star, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TRANSLATIONS } from '../i18n/translations';

export default function DrillCompletionModal({ language, drillResult, isOnline, onClose }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.English;

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ border: '2px solid var(--safety-emerald)', boxShadow: '0 0 35px var(--safety-emerald-glow)' }}
      >
        <div className="modal-header" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>
          <h3 style={{ color: 'var(--safety-emerald)' }}>
            <Award size={22} color="var(--safety-emerald)" />
            {t.drillCompleteTitle}
          </h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid var(--safety-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: 'var(--safety-emerald)'
          }}>
            <CheckCircle2 size={48} />
          </div>

          <h3 style={{ color: '#FFF', fontSize: '1.45rem', fontWeight: 800 }}>
            {t.drillCompleteSub}
          </h3>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', margin: '0.75rem 0 1.25rem' }}>
            <Star size={24} fill="#F59E0B" color="#F59E0B" />
            <Star size={24} fill="#F59E0B" color="#F59E0B" />
            <Star size={24} fill="#F59E0B" color="#F59E0B" />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.85rem',
            background: 'rgba(14, 20, 36, 0.8)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.scoreEarned}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--safety-emerald)' }}>
                {drillResult?.score || 100}/100
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.timeTaken}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--safety-orange)' }}>
                {drillResult?.duration ? `${drillResult.duration}s` : '8.5s'}
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '0.85rem',
            color: isOnline ? 'var(--safety-emerald)' : 'var(--safety-amber)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}>
            <span>{isOnline ? '✓ Synced to Supabase Cloud' : '💾 Queued in Offline Storage'}</span>
          </div>

          <button 
            className="btn-primary"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', justifyContent: 'center' }}
            onClick={onClose}
          >
            <span>{t.returnHub}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

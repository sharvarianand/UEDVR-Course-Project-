import React from 'react';
import { Flame, LogOut, Radio, Shield, Globe } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function Navbar({ worker, language, onLanguageChange, isOnline, pendingCount, onLogout }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.English;

  const triggerHaptic = (ms = 20) => {
    try {
      if (window.AndroidBridge && typeof window.AndroidBridge.triggerHaptic === 'function') {
        window.AndroidBridge.triggerHaptic(ms);
      } else if (navigator.vibrate) {
        navigator.vibrate(ms);
      }
    } catch {}
  };

  return (
    <header className="modern-navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="navbar-logo-badge">
            <Flame size={20} className="logo-flame-icon" />
          </div>
          <div className="navbar-title-wrap">
            <div className="navbar-brand-name">
              Jiwi<span className="brand-accent">-AR</span>
            </div>
            <div className="navbar-brand-sub">
              <span className="pulse-dot-green"></span>
              <span>COAL INDIA • DGMS</span>
            </div>
          </div>
        </div>

        {/* Actions & Status */}
        <div className="navbar-actions">
          {/* Language Toggle Pills */}
          <div className="nav-lang-pills">
            <button
              type="button"
              className={`nav-lang-btn ${language === 'English' ? 'active' : ''}`}
              onClick={() => { triggerHaptic(15); onLanguageChange('English'); }}
            >
              EN
            </button>
            <button
              type="button"
              className={`nav-lang-btn ${language === 'Hindi' ? 'active' : ''}`}
              onClick={() => { triggerHaptic(15); onLanguageChange('Hindi'); }}
            >
              हिन्दी
            </button>
            <button
              type="button"
              className={`nav-lang-btn ${language === 'Santali' ? 'active' : ''}`}
              onClick={() => { triggerHaptic(15); onLanguageChange('Santali'); }}
            >
              ᱥᱟᱱᱛᱟᱲᱤ
            </button>
          </div>

          {/* Sync Status Badge */}
          <div className={`nav-sync-pill ${isOnline ? 'synced' : 'pending'}`}>
            <span className={`sync-indicator-dot ${isOnline ? 'online' : 'offline'}`}></span>
            <span className="sync-text">
              {isOnline ? (pendingCount > 0 ? `Syncing (${pendingCount})` : 'Cloud Active') : `Offline (${pendingCount})`}
            </span>
          </div>

          {/* Logout Action */}
          {worker && (
            <button 
              type="button"
              className="nav-logout-btn" 
              onClick={() => { triggerHaptic(25); onLogout(); }}
              title={t.logout || 'Log Out'}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

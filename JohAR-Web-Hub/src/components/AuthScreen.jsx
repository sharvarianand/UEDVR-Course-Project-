import React, { useState } from 'react';
import { User, Shield, Lock, Eye, EyeOff, ChevronRight, Check, Users, QrCode } from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';
import { offlineSync } from '../services/offlineSync';
import QRScannerModal from './QRScannerModal';
import jiwiLogo from '../assets/jiwiAR_logo.png';

export default function AuthScreen({ language, onLanguageChange, onLoginSuccess }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.English;

  const [authRole, setAuthRole] = useState('worker'); // 'worker' | 'admin'
  const [workerId, setWorkerId] = useState('');
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showDemoList, setShowDemoList] = useState(false);
  const [showAdminDemoList, setShowAdminDemoList] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const triggerHaptic = (ms = 25) => {
    try {
      if (window.AndroidBridge && typeof window.AndroidBridge.triggerHaptic === 'function') {
        window.AndroidBridge.triggerHaptic(ms);
      } else if (navigator.vibrate) {
        navigator.vibrate(ms);
      }
    } catch {}
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    triggerHaptic(30);
    setErrorMsg('');

    if (authRole === 'worker') {
      if (!workerId.trim()) {
        setErrorMsg('Please enter your Worker ID');
        return;
      }

      setLoading(true);
      try {
        const worker = await offlineSync.verifyWorker(workerId);
        if (worker) {
          onLoginSuccess(worker, 'worker');
        } else {
          setErrorMsg(`Access Denied: "${workerId}" is not registered in the mine database.`);
        }
      } catch {
        setErrorMsg('Database verification error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    } else {
      // Admin Authentication
      const normId = adminId.trim().toUpperCase();
      const pwd = adminPassword.trim();

      if (!normId || !pwd) {
        setErrorMsg('Please enter both Admin ID and Password');
        return;
      }

      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const validAdmins = ['ADMIN', 'ADMIN-01', 'DGMS-ADMIN', 'SUPERVISOR'];
        const validPasswords = ['admin', 'admin123', 'JohAR@2026', 'johar2026', 'mine123'];

        if (validAdmins.includes(normId) && validPasswords.includes(pwd)) {
          onLoginSuccess({
            worker_id: normId,
            name: 'Operations Command Officer',
            role: 'Mine Safety Supervisor',
            sector: 'Central Command'
          }, 'admin');
        } else {
          setErrorMsg('Access Denied: Invalid Admin ID or Password.');
        }
      }, 300);
    }
  };

  const handleQuickDemo = (id) => {
    triggerHaptic(35);
    setWorkerId(id);
    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      offlineSync.verifyWorker(id).then((worker) => {
        setLoading(false);
        if (worker) {
          onLoginSuccess(worker, 'worker');
        } else {
          setErrorMsg(`Worker ID "${id}" could not be verified.`);
        }
      }).catch(() => {
        setLoading(false);
        setErrorMsg('Verification error.');
      });
    }, 150);
  };

  const handleAdminQuickDemo = (admin) => {
    triggerHaptic(35);
    setAdminId(admin.id);
    setAdminPassword(admin.pass);
    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        worker_id: admin.id,
        name: admin.name,
        role: admin.role,
        sector: 'Central Command'
      }, 'admin');
    }, 200);
  };

  const handleQRScanSuccess = async (scannedRaw) => {
    setShowQRScanner(false);
    triggerHaptic(45);
    setErrorMsg('');

    let resolvedId = scannedRaw.trim();

    // Check if JSON payload e.g. {"app":"Jiwi-AR","worker_id":"W-5521",...}
    try {
      if (resolvedId.startsWith('{') && resolvedId.endsWith('}')) {
        const parsed = JSON.parse(resolvedId);
        if (parsed.worker_id) {
          resolvedId = parsed.worker_id;
        }
      }
    } catch {}

    setWorkerId(resolvedId);
    setLoading(true);

    try {
      const worker = await offlineSync.verifyWorker(resolvedId);
      if (worker) {
        onLoginSuccess(worker, 'worker');
      } else {
        setErrorMsg(`Access Denied: Scanned ID "${resolvedId}" is not registered in the mine database.`);
      }
    } catch {
      setErrorMsg('Error verifying scanned worker credentials.');
    } finally {
      setLoading(false);
    }
  };

  const registeredWorkers = offlineSync.getRegisteredWorkers();

  return (
    <div className="w-full min-h-screen flex-1 flex flex-col justify-between px-6 pt-8 pb-6 z-10 overflow-y-auto max-w-sm mx-auto relative select-none bg-[#090A0F]">
      
      {/* Top Section */}
      <div className="w-full flex flex-col items-center">
        {/* Unboxed, Floating Logo */}
        <div className="mb-3 flex items-center justify-center">
          <img 
            src={jiwiLogo} 
            alt="Jiwi-AR Logo" 
            className="w-16 h-16 object-contain filter drop-shadow-sm" 
          />
        </div>

        {/* Minimal Typography */}
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-white">
            {authRole === 'worker' ? 'Worker Training Hub' : 'Operations Command'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-normal">
            {authRole === 'worker' 
              ? 'Jiwi-AR • Industrial Mine Safety Simulator' 
              : 'Authorized DGMS Supervisors & Controllers'}
          </p>
        </div>

        {/* Minimal Segmented Switcher */}
        <div className="w-full mt-6 bg-white/[0.03] p-1 rounded-xl border border-white/[0.07] flex gap-1">
          <button
            type="button"
            onClick={() => { triggerHaptic(15); setAuthRole('worker'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authRole === 'worker' 
                ? 'bg-white/[0.12] text-white shadow-sm border border-white/[0.08]' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Worker Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { triggerHaptic(15); setAuthRole('admin'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authRole === 'admin' 
                ? 'bg-white/[0.12] text-white shadow-sm border border-white/[0.08]' 
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Form Inputs */}
        <div className="w-full mt-5">
          <form onSubmit={handleLogin} className="space-y-3.5">
            {authRole === 'worker' ? (
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-medium text-zinc-400 tracking-wider uppercase" htmlFor="workerId">
                  Worker ID
                </label>
                <div className="relative">
                  <input
                    id="workerId"
                    type="text"
                    autoComplete="off"
                    autoCapitalize="characters"
                    value={workerId}
                    onChange={(e) => setWorkerId(e.target.value)}
                    placeholder="Enter Worker ID (e.g. W-5521)"
                    className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-amber-500/60 focus:bg-white/[0.05] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all font-mono"
                  />
                  <User className="w-4 h-4 absolute right-3.5 top-3.5 text-zinc-500 pointer-events-none stroke-[1.5]" />
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-medium text-zinc-400 tracking-wider uppercase" htmlFor="adminId">
                    Admin / Supervisor ID
                  </label>
                  <div className="relative">
                    <input
                      id="adminId"
                      type="text"
                      autoComplete="off"
                      value={adminId}
                      onChange={(e) => setAdminId(e.target.value)}
                      placeholder="Enter Admin ID (e.g. ADMIN-01)"
                      className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-amber-500/60 focus:bg-white/[0.05] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all font-mono"
                    />
                    <Shield className="w-4 h-4 absolute right-3.5 top-3.5 text-zinc-500 pointer-events-none stroke-[1.5]" />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-medium text-zinc-400 tracking-wider uppercase" htmlFor="adminPassword">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="adminPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-amber-500/60 focus:bg-white/[0.05] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 stroke-[1.5]" /> : <Eye className="w-4 h-4 stroke-[1.5]" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs px-3.5 py-2.5 rounded-xl text-center font-normal">
                {errorMsg}
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-zinc-950 font-semibold text-xs tracking-wider uppercase py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <span className="inline-block animate-pulse">Verifying...</span>
              ) : (
                <span>{authRole === 'worker' ? 'Verify Worker ID' : 'Open Operations Center'}</span>
              )}
            </button>

            {/* Scan QR Code Option (Below Verify Worker ID) */}
            {authRole === 'worker' && (
              <button
                type="button"
                onClick={() => { triggerHaptic(25); setShowQRScanner(true); }}
                className="w-full bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.99] border border-white/[0.08] text-white font-medium text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4 text-amber-400 stroke-[1.75]" />
                <span>Scan QR Code</span>
              </button>
            )}
          </form>

          {/* Quick Select Section for Worker: Tagged (FOR DEMO) */}
          {authRole === 'worker' && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowDemoList(!showDemoList)}
                className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] active:scale-[0.99] transition-all rounded-xl py-2.5 px-3.5 flex items-center justify-between text-zinc-300"
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-zinc-400 stroke-[1.5]" />
                  <span className="text-xs font-normal">Select Registered Worker</span>
                  <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    (FOR DEMO)
                  </span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${showDemoList ? 'rotate-90' : ''}`} />
              </button>

              {showDemoList && (
                <div className="mt-2 flex flex-col space-y-1.5 max-h-56 overflow-y-auto no-scrollbar pt-1">
                  {registeredWorkers.map((w) => {
                    const initials = w.name ? w.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'WR';
                    return (
                      <div
                        key={w.worker_id}
                        onClick={() => handleQuickDemo(w.worker_id)}
                        className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-xl p-2.5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/[0.06] flex items-center justify-center text-zinc-300 font-semibold text-xs">
                            {initials}
                          </div>
                          <div className="text-left">
                            <h4 className="text-xs font-medium text-white leading-tight">{w.name}</h4>
                            <p className="text-[10px] text-zinc-400 leading-tight font-mono mt-0.5">
                              {w.worker_id} • {w.role}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-zinc-400 bg-white/[0.05] hover:bg-amber-500 hover:text-black border border-white/[0.06] px-2.5 py-1 rounded-md transition-colors">
                          Select
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Quick Select Section for Admin: Tagged (FOR DEMO) */}
          {authRole === 'admin' && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowAdminDemoList(!showAdminDemoList)}
                className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] active:scale-[0.99] transition-all rounded-xl py-2.5 px-3.5 flex items-center justify-between text-zinc-300"
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-zinc-400 stroke-[1.5]" />
                  <span className="text-xs font-normal">Select Registered Admin</span>
                  <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    (FOR DEMO)
                  </span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${showAdminDemoList ? 'rotate-90' : ''}`} />
              </button>

              {showAdminDemoList && (
                <div className="mt-2 flex flex-col space-y-1.5 max-h-56 overflow-y-auto no-scrollbar pt-1">
                  {[
                    { id: 'ADMIN-01', name: 'Operations Supervisor', role: 'Shift Command Lead', pass: 'admin123' },
                    { id: 'DGMS-ADMIN', name: 'DGMS Safety Inspector', role: 'Regulatory Auditor', pass: 'JohAR@2026' },
                    { id: 'ADMIN', name: 'Master Operations Chief', role: 'Chief Safety Engineer', pass: 'admin' }
                  ].map((admin) => (
                    <div
                      key={admin.id}
                      onClick={() => handleAdminQuickDemo(admin)}
                      className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-xl p-2.5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-semibold text-xs">
                          <Shield className="w-4 h-4 stroke-[1.75]" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-xs font-medium text-white leading-tight">{admin.name}</h4>
                          <p className="text-[10px] text-zinc-400 leading-tight font-mono mt-0.5">
                            {admin.id} • {admin.role}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-zinc-400 bg-white/[0.05] hover:bg-amber-500 hover:text-black border border-white/[0.06] px-2.5 py-1 rounded-md transition-colors">
                        Sign In
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Bottom Localization & Compliance */}
      <div className="w-full mt-6 flex flex-col items-center space-y-3">
        {/* Minimalist Language Switcher */}
        <div className="flex items-center bg-white/[0.02] border border-white/[0.06] p-1 rounded-xl w-full max-w-[280px]">
          {['English', 'Hindi', 'Santali'].map((lang) => {
            const labels = { English: 'English', Hindi: 'हिन्दी', Santali: 'ᱥᱟᱱᱛᱟᱲᱤ' };
            const isActive = language === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => { triggerHaptic(15); onLanguageChange(lang); }}
                className={`flex-1 py-1.5 text-xs rounded-lg transition-all text-center ${
                  isActive 
                    ? 'bg-white/[0.12] text-white font-medium border border-white/[0.08]' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {labels[lang]}
              </button>
            );
          })}
        </div>

        {/* Minimal Status Dot */}
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-normal">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Works offline • DGMS Compliant</span>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScanSuccess={handleQRScanSuccess}
      />

    </div>
  );
}

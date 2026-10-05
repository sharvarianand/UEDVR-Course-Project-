import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, RefreshCw, AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { offlineSync } from '../services/offlineSync';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [cameraError, setCameraError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [cameraList, setCameraList] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const qrCodeScannerRef = useRef(null);

  const registeredWorkers = offlineSync.getRegisteredWorkers();

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    let isMounted = true;

    const startScanner = async () => {
      setCameraError('');
      setScanning(true);

      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          if (isMounted) setCameraList(devices);
          // Prefer back camera if available
          const backCam = devices.find(d => 
            d.label.toLowerCase().includes('back') || 
            d.label.toLowerCase().includes('rear') || 
            d.label.toLowerCase().includes('environment')
          );
          const camId = backCam ? backCam.id : devices[0].id;
          if (isMounted) setSelectedCameraId(camId);

          const scanner = new Html5Qrcode('qr-scanner-viewport');
          qrCodeScannerRef.current = scanner;

          const config = {
            fps: 15,
            qrbox: { width: 240, height: 240 },
            aspectRatio: 1.0
          };

          await scanner.start(
            camId,
            config,
            (decodedText) => {
              // Successfully scanned a QR code!
              handleSuccessfulDecode(decodedText);
            },
            () => {
              // Ignore frame-by-frame scan misses
            }
          );
        } else {
          setCameraError('No camera found on this device.');
        }
      } catch (err) {
        console.warn('[QRScanner] Camera start error:', err);
        setCameraError(
          'Unable to access camera directly in this environment. You can use the Quick Demo Scanner below to test instant QR login.'
        );
      }
    };

    // Small delay to ensure modal DOM is mounted
    const timer = setTimeout(startScanner, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen]);

  const stopScanner = async () => {
    if (qrCodeScannerRef.current) {
      try {
        if (qrCodeScannerRef.current.isScanning) {
          await qrCodeScannerRef.current.stop();
        }
        qrCodeScannerRef.current.clear();
      } catch (e) {
        console.warn('Error stopping scanner:', e);
      }
      qrCodeScannerRef.current = null;
    }
    setScanning(false);
  };

  const handleSuccessfulDecode = (decodedText) => {
    stopScanner();
    onScanSuccess(decodedText);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode('qr-scanner-viewport');
      const result = await html5QrCode.scanFile(file, true);
      html5QrCode.clear();
      handleSuccessfulDecode(result);
    } catch {
      setCameraError('Could not find a valid QR code in the uploaded image.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 select-none font-sans animate-fadeIn">
      
      {/* Top Header */}
      <div className="w-full max-w-sm flex items-center justify-between pt-2 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
            <Camera className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-white">Scan Worker QR Badge</h3>
            <p className="text-[10px] text-zinc-400">Position QR code within the frame</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white border border-white/[0.08] transition"
        >
          <X className="w-4 h-4 stroke-[1.75]" />
        </button>
      </div>

      {/* Scanner Viewport / Box */}
      <div className="w-full max-w-sm flex flex-col items-center justify-center my-auto">
        <div className="relative w-64 h-64 rounded-2xl overflow-hidden bg-[#0E1017] border-2 border-amber-500/40 shadow-2xl flex items-center justify-center">
          
          {/* HTML5 QR Camera Container */}
          <div id="qr-scanner-viewport" className="w-full h-full object-cover"></div>

          {/* Holographic Aiming Frame & Crosshairs */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Corner accents */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-amber-400"></div>
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-amber-400"></div>
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-amber-400"></div>
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-amber-400"></div>

            {/* Scanning line animation */}
            <div className="w-full h-0.5 bg-amber-400/80 shadow-[0_0_12px_#f59e0b] animate-bounce"></div>
          </div>
        </div>

        {cameraError ? (
          <div className="mt-4 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-left max-w-xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-zinc-400 mt-4 text-center">
            Align QR code from the Web Admin Portal inside the reticle
          </p>
        )}
      </div>

      {/* Bottom Controls / Quick Test QR Simulation */}
      <div className="w-full max-w-sm flex flex-col gap-2 pb-4">
        
        {/* Upload QR Image file as alternative */}
        <label className="w-full py-2.5 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-xs text-zinc-300 flex items-center justify-center gap-2 cursor-pointer transition">
          <Upload className="w-3.5 h-3.5 text-zinc-400" />
          <span>Upload QR Code Image</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>

        {/* Quick Simulation Bar for instant demo testing */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400">
              Instant QR Simulator (Demo)
            </span>
            <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
              TAP TO SIMULATE
            </span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {registeredWorkers.slice(0, 4).map((w) => (
              <button
                key={w.worker_id}
                type="button"
                onClick={() => handleSuccessfulDecode(w.worker_id)}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-amber-500 hover:text-black text-[11px] font-mono font-medium text-zinc-200 border border-white/[0.08] shrink-0 transition"
              >
                {w.worker_id} ({w.name.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

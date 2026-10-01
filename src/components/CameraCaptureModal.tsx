import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  // Start camera stream when opened
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setErrorMessage(null);
    setHasPermission(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      setHasPermission(true);
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      // Try fallback to any available video device without facingMode constraint
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play();
        }
        setHasPermission(true);
      } catch (fallbackErr: any) {
        setHasPermission(false);
        if (fallbackErr.name === 'NotAllowedError' || fallbackErr.name === 'PermissionDeniedError') {
          setErrorMessage('Camera access was denied. Please allow camera permissions in your browser address bar.');
        } else if (fallbackErr.name === 'NotFoundError' || fallbackErr.name === 'DevicesNotFoundError') {
          setErrorMessage('No camera was detected on this device. You can still upload receipt photos or use demo samples!');
        } else {
          setErrorMessage(fallbackErr.message || 'Unable to access camera.');
        }
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleSnapPhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Use full video resolution
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw the current video frame
    ctx.drawImage(video, 0, 0, width, height);

    // Convert to file blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `receipt-photo-${Date.now()}.jpg`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          stopCamera();
          setIsCapturing(false);
          onCapture(file);
          onClose();
        }
      },
      'image/jpeg',
      0.92
    );
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-lg overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 z-10">
          <div className="flex items-center gap-2 text-white">
            <Camera className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold tracking-wide uppercase">
              PaisaLens Live Receipt Scanner
            </span>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full bg-black flex items-center justify-center overflow-hidden">
          {hasPermission === false ? (
            <div className="p-6 text-center text-slate-300 max-w-xs space-y-3">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 ring-4 ring-rose-500/10">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Camera Unavailable</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {errorMessage}
              </p>
              <button
                onClick={startCamera}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry Permission</span>
              </button>
            </div>
          ) : (
            <>
              {/* Live Video Feed */}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Viewfinder Guide Box Overlay */}
              <div className="pointer-events-none absolute inset-6 sm:inset-10 border-2 border-emerald-400/80 rounded-xl shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 h-5 w-5 border-t-4 border-l-4 border-emerald-400 rounded-tl-sm" />
                <div className="absolute -top-1 -right-1 h-5 w-5 border-t-4 border-r-4 border-emerald-400 rounded-tr-sm" />
                <div className="absolute -bottom-1 -left-1 h-5 w-5 border-b-4 border-l-4 border-emerald-400 rounded-bl-sm" />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 border-b-4 border-r-4 border-emerald-400 rounded-br-sm" />

                {/* Laser scan line in camera view */}
                <div className="animate-scan-beam absolute left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />

                <div className="absolute -bottom-8 left-0 right-0 text-center">
                  <span className="rounded-full bg-slate-900/85 px-3 py-1 text-[11px] font-medium text-emerald-300 backdrop-blur-xs border border-emerald-500/30">
                    Align receipt within target
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Hidden Canvas for Frame Capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Shutter / Controls Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-t border-slate-800">
          {/* Switch Camera */}
          <button
            onClick={toggleFacingMode}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
            title="Switch front / rear camera"
          >
            <div className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700">
              <RefreshCw className="h-4 w-4" />
            </div>
            <span className="text-[10px]">Flip</span>
          </button>

          {/* Big Circular Capture Shutter */}
          <button
            onClick={handleSnapPhoto}
            disabled={!hasPermission || isCapturing}
            className={`group relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-emerald-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed`}
            title="Capture Receipt Photo"
          >
            <div className="h-11 w-11 rounded-full bg-white group-hover:scale-95 transition-transform" />
          </button>

          {/* Close/Cancel */}
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <div className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700">
              <X className="h-4 w-4" />
            </div>
            <span className="text-[10px]">Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

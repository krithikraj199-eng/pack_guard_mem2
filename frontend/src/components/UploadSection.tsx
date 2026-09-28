'use client';

import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Sparkles, X, AlertCircle, RefreshCw, SwitchCamera } from 'lucide-react';
import { AnalysisResult } from '../services/types';
import { DEMO_FIXTURES } from '../data/demoFixtures';

interface UploadSectionProps {
  onImageSelected: (file: File) => void;
  onSelectFixture: (fixture: AnalysisResult) => void;
  onReset: () => void;
  selectedFixtureId?: string;
  isAnalyzing: boolean;
  isDemoMode: boolean;
}

const MAX_FILE_SIZE_MB = 25;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const UploadSection: React.FC<UploadSectionProps> = ({
  onImageSelected,
  onSelectFixture,
  onReset,
  selectedFixtureId,
  isAnalyzing,
  isDemoMode,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(DEMO_FIXTURES[0].image_url);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Live in-browser camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream cleanly when component unmounts or camera is closed
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    stopCameraStream();
    setIsCameraActive(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser. Please use the file upload option.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.warn('Camera Access Issue:', error);
      let msg = 'Unable to access packaging camera.';
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        msg = 'Camera permission was denied. Please allow camera permissions in your browser or select an image file.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        msg = 'No video camera detected on this system. Please upload a package photo instead.';
      } else {
        msg = error.message || 'Camera could not be initialized.';
      }
      setCameraError(msg);
      stopCameraStream();
    }
  };

  const closeCamera = () => {
    stopCameraStream();
    setIsCameraActive(false);
    setCameraError(null);
  };

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `package-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      closeCamera();
      validateAndProcessFile(file);
    }, 'image/jpeg', 0.95);
  };

  const validateAndProcessFile = (file: File) => {
    setValidationError(null);

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setValidationError(`Unsupported file type (${file.type || 'unknown'}). Please upload a JPEG, PNG, or WEBP packaging photo.`);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setValidationError(`File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum allowed limit of ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onImageSelected(file);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    validateAndProcessFile(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onReset();
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-6 backdrop-blur-md shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-cyan-400" />
            Packaging Image Inspection Input
          </h2>
          <p className="text-xs text-slate-400">
            Upload package label, front panel, or mandatory declaration table for statutory compliance screening.
          </p>
        </div>

        {/* Benchmark Presets Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-cyan-400" /> {isDemoMode ? 'Verified Benchmark Presets (Offline):' : 'Benchmark Presets:'}
          </span>
          {DEMO_FIXTURES.map((fixture) => (
            <button
              key={fixture.analysis_id}
              type="button"
              onClick={() => {
                setValidationError(null);
                setPreviewUrl(fixture.image_url);
                setSelectedFile(null);
                onSelectFixture(fixture);
              }}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold transition-all focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                selectedFixtureId === fixture.analysis_id
                  ? 'border-cyan-400 bg-cyan-950 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  : 'border-white/10 bg-slate-800/80 text-slate-300 hover:border-cyan-500/50 hover:text-white'
              }`}
            >
              {fixture.metadata.fixture_name || fixture.product_name}
            </button>
          ))}
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div role="alert" className="mt-4 rounded-xl border border-rose-500/50 bg-rose-950/30 p-3 text-xs font-mono text-rose-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{validationError}</span>
          </div>
          <button type="button" onClick={() => setValidationError(null)} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Dropzone Container */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`mt-4 relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
          dragActive
            ? 'border-cyan-400 bg-cyan-950/20'
            : 'border-white/15 bg-slate-950/50 hover:border-cyan-500/40 hover:bg-slate-950/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {previewUrl ? (
          <div className="relative flex flex-col items-center gap-3">
            <div className="relative h-44 w-44 sm:h-52 sm:w-52 overflow-hidden rounded-lg border border-white/20 bg-slate-900 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Selected Package Preview"
                className="h-full w-full object-contain block"
              />
              <div className="absolute top-2 right-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-cyan-300 border border-white/10">
                {isAnalyzing ? 'Auditing...' : selectedFile ? 'Custom Image' : 'Preset Fixture'}
              </div>
            </div>

            {selectedFile && (
              <div className="font-mono text-xs text-slate-300">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-white/20 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={() => startCamera()}
                className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
              >
                <Camera className="h-3.5 w-3.5 text-cyan-400" />
                Live Camera
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-lg border border-rose-500/30 bg-rose-950/40 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-900/60 transition"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 mb-3 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              <ImageIcon className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold text-white">
              Drag & Drop your package photo here, or browse files
            </p>
            <p className="mt-1 text-xs text-slate-400">
              JPEG, PNG, WEBP (Max 25MB) • Front Label, Nutrition Facts, or MRP Panel
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-4 py-2 font-mono text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition shadow-[0_0_12px_rgba(0,240,255,0.15)]"
              >
                Browse Files
              </button>
              <button
                type="button"
                onClick={() => startCamera()}
                className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-slate-800 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-slate-700 transition"
              >
                <Camera className="h-3.5 w-3.5 text-cyan-400" />
                Capture with Camera
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live In-Browser Camera Viewfinder Modal */}
      {isCameraActive && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Package Camera Scanner"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-slate-950 p-4 shadow-2xl flex flex-col items-center">
            {/* Header */}
            <div className="flex items-center justify-between w-full pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-cyan-400" />
                <span className="font-mono text-xs font-bold text-white">
                  Package Label Camera Viewfinder
                </span>
              </div>
              <button
                type="button"
                onClick={closeCamera}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error state */}
            {cameraError ? (
              <div className="py-8 text-center px-4">
                <AlertCircle className="mx-auto h-10 w-10 text-rose-400 mb-2" />
                <p className="text-xs font-mono text-rose-300 mb-4">{cameraError}</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-slate-800 px-3 py-1.5 text-xs text-white hover:bg-slate-700 font-mono"
                  >
                    <RefreshCw className="h-3 w-3" /> Retry
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeCamera();
                      fileInputRef.current?.click();
                    }}
                    className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs text-white font-mono hover:bg-cyan-500"
                  >
                    Select File Instead
                  </button>
                </div>
              </div>
            ) : (
              /* Live Camera Stream with Package Alignment Frame */
              <div className="relative w-full overflow-hidden rounded-xl border border-white/15 bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-72 sm:h-80 object-cover"
                />

                {/* Viewfinder Target Guides */}
                <div className="pointer-events-none absolute inset-4 border-2 border-dashed border-cyan-400/70 rounded-lg flex flex-col justify-between p-2">
                  <div className="flex justify-between text-[10px] font-mono text-cyan-300 bg-black/60 px-1.5 py-0.5 rounded self-start">
                    Align mandatory declaration panel
                  </div>
                  <div className="self-center font-mono text-[10px] text-cyan-400/80 bg-black/50 px-2 py-0.5 rounded">
                    Ensure text & barcode are legible
                  </div>
                </div>

                {/* Corner Accents */}
                <div className="pointer-events-none absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-cyan-400"></div>
              </div>
            )}

            {/* Shutter & Controls */}
            {!cameraError && (
              <div className="mt-4 flex items-center justify-between w-full px-4">
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-xs font-mono text-slate-300 hover:text-white"
                  title="Switch between front and back camera"
                >
                  <SwitchCamera className="h-4 w-4 text-cyan-400" />
                  <span className="hidden sm:inline">Flip</span>
                </button>

                {/* Shutter Button */}
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="flex items-center gap-2 rounded-full border-2 border-cyan-400 bg-cyan-500/20 px-6 py-2.5 font-mono text-xs font-bold text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan-500/30 transition transform active:scale-95"
                >
                  <div className="h-3 w-3 rounded-full bg-cyan-400 animate-ping"></div>
                  <span>Capture Frame</span>
                </button>

                <button
                  type="button"
                  onClick={closeCamera}
                  className="rounded-lg border border-white/15 px-3 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

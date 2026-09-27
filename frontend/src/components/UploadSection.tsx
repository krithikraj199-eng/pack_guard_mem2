'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Sparkles, X, AlertCircle } from 'lucide-react';
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
    if (cameraInputRef.current) cameraInputRef.current.value = '';
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
            Upload package label, front panel, or mandatory declaration table for statutory audit.
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
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-white/20 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition"
              >
                <Camera className="h-3.5 w-3.5 text-cyan-400" /> Retake Photo
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
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-slate-800 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-slate-700 transition"
              >
                <Camera className="h-3.5 w-3.5 text-cyan-400" />
                Capture with Camera
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

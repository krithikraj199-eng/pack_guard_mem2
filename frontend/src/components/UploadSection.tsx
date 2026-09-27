'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, Sparkles, AlertCircle, FileCheck2 } from 'lucide-react';
import { DEMO_FIXTURES } from '../data/demoFixtures';
import { AnalysisResult } from '../services/types';

interface UploadSectionProps {
  onImageSelected: (file: File) => void;
  onSelectFixture: (fixture: AnalysisResult) => void;
  selectedFixtureId?: string;
  isAnalyzing: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onImageSelected,
  onSelectFixture,
  selectedFixtureId,
  isAnalyzing,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onImageSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-6 backdrop-blur-md shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-cyan-400" />
            Upload Packaging Image
          </h2>
          <p className="text-xs text-slate-400">
            Upload high-resolution package label, front face, or barcode for optical statutory inspection.
          </p>
        </div>

        {/* Demo Preset Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-slate-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-cyan-400" /> Quick Samples:
          </span>
          {DEMO_FIXTURES.map((fixture) => (
            <button
              key={fixture.analysis_id}
              onClick={() => {
                setPreviewUrl(fixture.image_url);
                setSelectedFile(null);
                onSelectFixture(fixture);
              }}
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold transition-all ${
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
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {previewUrl ? (
          <div className="relative flex flex-col items-center gap-3">
            <div className="relative h-44 w-44 sm:h-52 sm:w-52 overflow-hidden rounded-lg border border-white/20 bg-slate-900 shadow-lg">
              <img
                src={previewUrl}
                alt="Selected Package Preview"
                className="h-full w-full object-contain"
              />
              <div className="absolute top-2 right-2 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                Ready for Audit
              </div>
            </div>

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
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 mb-3 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              <ImageIcon className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold text-white">
              Drag & Drop your package photo here, or browse
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Supports JPEG, PNG, WEBP up to 25MB • Front, Back, or Nutrition Labels
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

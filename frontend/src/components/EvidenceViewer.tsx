'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair, Info, Activity } from 'lucide-react';
import { AnalysisResult, Violation } from '../services/types';

interface EvidenceViewerProps {
  analysis: AnalysisResult;
  selectedViolationId?: string;
  onSelectViolation: (violation: Violation) => void;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  analysis,
  selectedViolationId,
  onSelectViolation,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [hoveredBoxId, setHoveredBoxId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'ALL' | 'VIOLATIONS_ONLY' | 'COMPLIANT_ONLY'>('ALL');

  const hasBoxes = analysis.metadata.has_detected_boxes !== false;

  const filteredViolations = analysis.violations.filter((v) => {
    if (filterMode === 'VIOLATIONS_ONLY') return v.severity === 'CRITICAL' || v.severity === 'WARNING';
    if (filterMode === 'COMPLIANT_ONLY') return v.severity === 'COMPLIANT';
    return true;
  });

  return (
    <div
      role="region"
      aria-label="Packaging Evidence Inspector"
      className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-6 backdrop-blur-md shadow-2xl"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Crosshair className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              Interactive Statutory Evidence Viewport
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Bounding-box annotations localized on packaging surface. Click any region to inspect.
          </p>
        </div>

        {/* Telemetry & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* AI Telemetry Pill */}
          <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1 text-[11px] font-mono text-slate-300">
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
            <span>OCR: {(analysis.metadata.ocr_confidence * 100).toFixed(1)}%</span>
            <span className="text-slate-600">|</span>
            <span>{analysis.metadata.latency_ms}ms</span>
          </div>

          {/* Filter Pills */}
          {hasBoxes && (
            <div className="flex items-center rounded-lg border border-white/10 bg-slate-950 p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setFilterMode('ALL')}
                className={`px-2.5 py-1 rounded transition ${filterMode === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('VIOLATIONS_ONLY')}
                className={`px-2.5 py-1 rounded transition ${filterMode === 'VIOLATIONS_ONLY' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Violations
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('COMPLIANT_ONLY')}
                className={`px-2.5 py-1 rounded transition ${filterMode === 'COMPLIANT_ONLY' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Compliant
              </button>
            </div>
          )}

          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-950 p-1">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(Number((z + 0.25).toFixed(2)), 2.5))}
              className="p-1 text-slate-300 hover:text-cyan-400 transition"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <span className="px-1 text-[11px] font-mono text-slate-400 min-w-[36px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(Number((z - 0.25).toFixed(2)), 0.75))}
              className="p-1 text-slate-300 hover:text-cyan-400 transition"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="p-1 text-slate-300 hover:text-cyan-400 transition"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Image Viewport with Precision Responsive Bounding Box Overlays */}
      <div className="relative mt-4 flex items-center justify-center overflow-auto rounded-xl border border-slate-800 bg-[#070a12] p-4 min-h-[380px] sm:min-h-[440px]">
        {/* Viewfinder Corner Notches */}
        <div className="pointer-events-none absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-cyan-400 z-10"></div>
        <div className="pointer-events-none absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-cyan-400 z-10"></div>
        <div className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-cyan-400 z-10"></div>
        <div className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-cyan-400 z-10"></div>

        <div
          className="relative inline-block transition-transform duration-150 origin-center"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={analysis.image_url}
            alt={analysis.product_name}
            className="block max-h-[460px] w-auto rounded-lg object-contain select-none"
          />

          {/* HTML Overlay Coordinate Layer - Perfectly Responsive and Scale-Proof */}
          {hasBoxes && (
            <div className="absolute inset-0 pointer-events-none">
              {filteredViolations.map((v) => {
                if (!v.bounding_box) return null;
                const [ymin, xmin, ymax, xmax] = v.bounding_box;
                const isSelected = selectedViolationId === v.id;
                const isHovered = hoveredBoxId === v.id;

                const borderColor =
                  v.severity === 'CRITICAL'
                    ? '#ef4444'
                    : v.severity === 'WARNING'
                    ? '#f59e0b'
                    : '#10b981';

                const bgClass =
                  v.severity === 'CRITICAL'
                    ? 'bg-rose-500/20'
                    : v.severity === 'WARNING'
                    ? 'bg-amber-500/20'
                    : 'bg-emerald-500/20';

                // Smart positioning: if box is near top of image, place badge below it
                const isNearTop = ymin < 0.14;

                return (
                  <div
                    key={v.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`Evidence region: ${v.title} (${v.severity})`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectViolation(v);
                      }
                    }}
                    onMouseEnter={() => setHoveredBoxId(v.id)}
                    onMouseLeave={() => setHoveredBoxId(null)}
                    onClick={() => onSelectViolation(v)}
                    style={{
                      position: 'absolute',
                      top: `${ymin * 100}%`,
                      left: `${xmin * 100}%`,
                      width: `${(xmax - xmin) * 100}%`,
                      height: `${(ymax - ymin) * 100}%`,
                      borderColor: borderColor,
                    }}
                    className={`pointer-events-auto cursor-pointer rounded transition-all duration-150 border-2 ${
                      isSelected
                        ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-black border-solid'
                        : v.severity === 'WARNING'
                        ? 'border-dashed'
                        : 'border-solid'
                    } ${isHovered || isSelected ? bgClass : 'bg-transparent'}`}
                  >
                    {/* Bounding Box Annotation Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '0px',
                        ...(isNearTop
                          ? { top: 'calc(100% + 4px)' }
                          : { bottom: 'calc(100% + 4px)' }),
                        borderColor: borderColor,
                      }}
                      className="whitespace-nowrap rounded border bg-slate-950/95 px-2 py-0.5 text-[9px] font-mono font-bold shadow-lg pointer-events-none z-20"
                    >
                      <span style={{ color: borderColor }}>
                        {v.severity === 'CRITICAL'
                          ? '[NON-COMPLIANT]'
                          : v.severity === 'WARNING'
                          ? '[WARNING]'
                          : '[VERIFIED]'}
                      </span>
                      <span className="ml-1 text-slate-300 font-normal">
                        {v.rule_number}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Notice for Custom Upload without Member 1 Engine */}
      {!hasBoxes && (
        <div className="mt-3 rounded-lg border border-cyan-500/20 bg-slate-950 p-3 font-mono text-xs text-cyan-300 flex items-start gap-2">
          <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            Custom package photo displayed. Object bounding-box localization coordinates are generated live by Member 1&apos;s Computer Vision pipeline. To test interactive coordinates, select one of the three verified benchmark presets.
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded border border-rose-500 bg-rose-500/20"></span>
            Statutory Violation
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded border border-amber-500 bg-amber-500/20"></span>
            Statutory Warning
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded border border-emerald-500 bg-emerald-500/20"></span>
            Verified Compliant
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          Normalized Space [0.0 - 1.0]
        </span>
      </div>
    </div>
  );
};

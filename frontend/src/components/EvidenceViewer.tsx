'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Layers, Info } from 'lucide-react';
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
  const [zoom, setZoom] = useState(1);
  const [filterMode, setFilterMode] = useState<'ALL' | 'VIOLATIONS_ONLY' | 'COMPLIANT_ONLY'>('ALL');
  const [hoveredBoxId, setHoveredBoxId] = useState<string | null>(null);

  const filteredViolations = analysis.violations.filter((v) => {
    if (filterMode === 'VIOLATIONS_ONLY') return v.severity === 'CRITICAL' || v.severity === 'WARNING';
    if (filterMode === 'COMPLIANT_ONLY') return v.severity === 'COMPLIANT';
    return true;
  });

  const hasBoxes = analysis.metadata.has_detected_boxes !== false && analysis.violations.some((v) => v.bounding_box);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-6 backdrop-blur-md">
      {/* Top Header & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            Statutory Evidence Inspector
          </h3>
          <p className="text-xs text-slate-400">
            Interactive coordinate mapping across mandatory packaging declaration zones.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {hasBoxes && (
            <div className="flex rounded-lg border border-white/10 bg-slate-950 p-0.5 text-xs font-mono">
              <button
                onClick={() => setFilterMode('ALL')}
                className={`px-2.5 py-1 rounded ${filterMode === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                All ({analysis.violations.length})
              </button>
              <button
                onClick={() => setFilterMode('VIOLATIONS_ONLY')}
                className={`px-2.5 py-1 rounded ${filterMode === 'VIOLATIONS_ONLY' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Violations
              </button>
              <button
                onClick={() => setFilterMode('COMPLIANT_ONLY')}
                className={`px-2.5 py-1 rounded ${filterMode === 'COMPLIANT_ONLY' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Compliant
              </button>
            </div>
          )}

          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-950 p-1">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}
              className="p-1 text-slate-300 hover:text-cyan-400 transition"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
              className="p-1 text-slate-300 hover:text-cyan-400 transition"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
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

      {/* Main Image Viewport with Bounding Box Overlays */}
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

          {/* SVG Overlay Coordinate Layer */}
          {hasBoxes && (
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none"
              style={{ overflow: 'visible' }}
            >
              {filteredViolations.map((v) => {
                if (!v.bounding_box) return null;
                const [ymin, xmin, ymax, xmax] = v.bounding_box;
                const isSelected = selectedViolationId === v.id;
                const isHovered = hoveredBoxId === v.id;

                const strokeColor =
                  v.severity === 'CRITICAL'
                    ? '#ef4444'
                    : v.severity === 'WARNING'
                    ? '#f59e0b'
                    : '#10b981';

                const fillColor =
                  v.severity === 'CRITICAL'
                    ? 'rgba(239, 68, 68, 0.2)'
                    : v.severity === 'WARNING'
                    ? 'rgba(245, 158, 11, 0.2)'
                    : 'rgba(16, 185, 129, 0.2)';

                // Smart positioning: if box is near top of image, place badge below it so it never gets clipped!
                const isNearTop = ymin < 0.12;

                return (
                  <g
                    key={v.id}
                    className="pointer-events-auto cursor-pointer focus:outline-none"
                    tabIndex={0}
                    role="button"
                    aria-label={`Violation: ${v.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectViolation(v);
                      }
                    }}
                    onMouseEnter={() => setHoveredBoxId(v.id)}
                    onMouseLeave={() => setHoveredBoxId(null)}
                    onClick={() => onSelectViolation(v)}
                  >
                    <rect
                      x={`${xmin * 100}%`}
                      y={`${ymin * 100}%`}
                      width={`${(xmax - xmin) * 100}%`}
                      height={`${(ymax - ymin) * 100}%`}
                      fill={isHovered || isSelected ? fillColor : 'transparent'}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? '3' : '2'}
                      strokeDasharray={v.severity === 'WARNING' ? '4 2' : 'none'}
                      className="transition-all duration-150"
                    />

                    {/* Annotation Badge */}
                    <g transform={`translate(${xmin * 100} ${ymin * 100})`}>
                      <rect
                        x="2"
                        y={isNearTop ? `${(ymax - ymin) * 100 + 4}` : '-20'}
                        width="116"
                        height="18"
                        rx="3"
                        fill="#0b0f19"
                        stroke={strokeColor}
                        strokeWidth="1"
                      />
                      <text
                        x="6"
                        y={isNearTop ? `${(ymax - ymin) * 100 + 16}` : '-7'}
                        fill={strokeColor}
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {v.severity === 'CRITICAL' ? '✖ NON-COMPLIANT' : v.severity === 'WARNING' ? '⚠ WARNING' : '✓ VERIFIED'}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
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

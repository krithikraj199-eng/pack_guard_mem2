'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, AlertOctagon, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
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

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-6 backdrop-blur-md">
      {/* Top Header & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            Interactive Statutory Evidence Viewer
          </h3>
          <p className="text-xs text-slate-400">
            Hover or click bounding boxes to inspect detected label violations and statutory rules.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Filter Segmented Control */}
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

          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-950 p-1">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
              className="p-1 text-slate-300 hover:text-cyan-400"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
              className="p-1 text-slate-300 hover:text-cyan-400"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 text-slate-300 hover:text-cyan-400"
              title="Reset Zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Image Viewport with SVG Bounding Box Overlays */}
      <div className="relative mt-4 flex items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-[#070a12] p-4 min-h-[380px] sm:min-h-[440px]">
        {/* Optical Viewfinder Corner Notches */}
        <div className="pointer-events-none absolute top-2 left-2 h-4 w-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="pointer-events-none absolute top-2 right-2 h-4 w-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-cyan-400"></div>

        <div
          className="relative inline-block transition-transform duration-200"
          style={{ transform: `scale(${zoom})` }}
        >
          <img
            src={analysis.image_url}
            alt={analysis.product_name}
            className="max-h-[460px] w-auto rounded-lg object-contain select-none"
          />

          {/* SVG Overlay Coordinate Layer */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none">
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
                  ? 'rgba(239, 68, 68, 0.15)'
                  : v.severity === 'WARNING'
                  ? 'rgba(245, 158, 11, 0.15)'
                  : 'rgba(16, 185, 129, 0.15)';

              return (
                <g key={v.id} className="pointer-events-auto cursor-pointer">
                  <rect
                    x={`${xmin * 100}%`}
                    y={`${ymin * 100}%`}
                    width={`${(xmax - xmin) * 100}%`}
                    height={`${(ymax - ymin) * 100}%`}
                    fill={isHovered || isSelected ? fillColor : 'transparent'}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? '3' : '2'}
                    strokeDasharray={v.severity === 'WARNING' ? '4 2' : 'none'}
                    onMouseEnter={() => setHoveredBoxId(v.id)}
                    onMouseLeave={() => setHoveredBoxId(null)}
                    onClick={() => onSelectViolation(v)}
                    className="transition-all duration-150"
                  />

                  {/* Callout Marker */}
                  <g
                    transform={`translate(${xmin * 100} ${ymin * 100})`}
                    onClick={() => onSelectViolation(v)}
                  >
                    <rect
                      x="4"
                      y="-20"
                      width="120"
                      height="18"
                      rx="3"
                      fill="#0b0f19"
                      stroke={strokeColor}
                      strokeWidth="1"
                    />
                    <text
                      x="10"
                      y="-7"
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
        </div>
      </div>

      {/* Legend Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded border border-rose-500 bg-rose-500/20"></span>
            Critical Violation
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
          Source Coordinate System: Normalized Relative [ymin, xmin, ymax, xmax]
        </span>
      </div>
    </div>
  );
};

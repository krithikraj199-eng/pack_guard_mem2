'use client';

import React, { useState } from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  Scale,
  BookOpen,
  ShieldAlert,
  Barcode as BarcodeIcon,
  FileSpreadsheet,
  Info,
  Crosshair
} from 'lucide-react';
import { AnalysisResult, Violation, ExtractedDeclaration } from '../services/types';

interface ComplianceResultsProps {
  analysis: AnalysisResult;
  selectedViolation: Violation | null;
  onSelectViolation: (violation: Violation) => void;
  onOpenComplaintModal: () => void;
  onLocateDeclaration?: (declaration: ExtractedDeclaration) => void;
}

export const ComplianceResults: React.FC<ComplianceResultsProps> = ({
  analysis,
  selectedViolation,
  onSelectViolation,
  onOpenComplaintModal,
  onLocateDeclaration,
}) => {
  const [activeTab, setActiveTab] = useState<'FINDINGS' | 'DECLARATIONS' | 'BARCODE'>('FINDINGS');

  const isCritical = analysis.status === 'CRITICAL';
  const isWarning = analysis.status === 'WARNING';
  const isCompliant = analysis.status === 'COMPLIANT';

  const declarations = analysis.declarations || [];

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <div
        className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-md transition-all ${
          isCritical
            ? 'border-rose-500/40 bg-rose-950/20 shadow-[0_0_25px_rgba(239,68,68,0.15)]'
            : isWarning
            ? 'border-amber-500/40 bg-amber-950/20 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
            : 'border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${
                  isCritical
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : isWarning
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {isCritical && <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />}
                {isWarning && <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />}
                {isCompliant && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                {isCritical
                  ? 'POTENTIAL NON-COMPLIANCE (SCREENING RESULT)'
                  : isWarning
                  ? 'SCREENING ADVISORY (REQUIRES HUMAN VERIFICATION)'
                  : 'PRELIMINARY COMPLIANT (SCREENING RESULT)'}
              </span>

              {analysis.metadata.is_demo_fixture && (
                <span className="rounded border border-cyan-500/30 bg-cyan-950/60 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                  BENCHMARK PRESET
                </span>
              )}
            </div>

            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-white">
              {analysis.product_name}
            </h2>
            <p className="mt-1 text-xs text-slate-300 max-w-xl">
              {analysis.summary}
            </p>
          </div>

          {/* Score Badge */}
          <div className="flex items-center gap-4 self-start sm:self-center">
            <div className="text-right">
              <div className="text-[11px] font-mono text-slate-400">Compliance Index</div>
              <div
                className={`font-mono text-3xl sm:text-4xl font-black ${
                  isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {analysis.overall_score}
                <span className="text-base text-slate-500 font-normal">/100</span>
              </div>
            </div>

            {/* Action Button */}
            {!isCompliant && (
              <button
                type="button"
                onClick={onOpenComplaintModal}
                className="flex items-center gap-2 rounded-xl border border-rose-500/50 bg-rose-600 px-4 py-2.5 font-mono text-xs font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:bg-rose-500 transition focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>File Grievance</span>
              </button>
            )}
          </div>
        </div>

        {/* Mandatory Statutory Disclaimer Banner */}
        <div className="mt-4 rounded-lg border border-white/10 bg-slate-950/70 p-2.5 text-[11px] font-mono text-slate-400 flex items-start gap-2">
          <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong>Statutory Disclaimer:</strong> PackGuard AI produces algorithmic screening indicators to assist consumers and enforcement personnel. These findings represent preliminary observations and require human verification before formal adjudication under the Legal Metrology Act, 2009.
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('FINDINGS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition ${
            activeTab === 'FINDINGS'
              ? 'border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <BookOpen className="h-4 w-4 text-cyan-400" />
          <span>Screening Findings ({analysis.violations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('DECLARATIONS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition ${
            activeTab === 'DECLARATIONS'
              ? 'border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4 text-cyan-400" />
          <span>Extracted Declarations ({declarations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('BARCODE')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition ${
            activeTab === 'BARCODE'
              ? 'border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
          }`}
        >
          <BarcodeIcon className="h-4 w-4 text-cyan-400" />
          <span>Barcode & Metadata</span>
        </button>
      </div>

      {/* Tab 1: Screening Findings */}
      {activeTab === 'FINDINGS' && (
        <div className="space-y-3">
          {analysis.violations.map((violation) => {
            const isSelected = selectedViolation?.id === violation.id;

            return (
              <div
                key={violation.id}
                onClick={() => onSelectViolation(violation)}
                className={`cursor-pointer rounded-xl border p-4 transition-all focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                  isSelected
                    ? 'border-cyan-400 bg-slate-900 shadow-[0_0_15px_rgba(0,240,255,0.15)] ring-1 ring-cyan-400'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/20 hover:bg-slate-900/90'
                }`}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectViolation(violation);
                  }
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {violation.severity === 'CRITICAL' && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-950 border border-rose-500/40 text-rose-400">
                        <AlertOctagon className="h-3.5 w-3.5" />
                      </span>
                    )}
                    {violation.severity === 'WARNING' && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-950 border border-amber-500/40 text-amber-400">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </span>
                    )}
                    {violation.severity === 'COMPLIANT' && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <h4 className="text-sm font-bold text-white">
                      {violation.title}
                    </h4>
                  </div>

                  <span className="font-mono text-[11px] text-cyan-400 border border-cyan-500/20 bg-cyan-950/40 rounded px-2 py-0.5 self-start sm:self-auto">
                    {violation.rule_number}
                  </span>
                </div>

                {/* Act citation & details */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border-t border-white/5 pt-2.5">
                  <div>
                    <span className="text-slate-500 font-mono">Applicable Standard:</span>
                    <p className="text-slate-300 font-medium">{violation.act_reference}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono">Detected Finding:</span>
                    <p className="text-rose-300 font-medium">{violation.detected_value}</p>
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-400">
                  <span className="text-slate-500 font-mono">Statutory Requirement: </span>
                  {violation.expected_standard}
                </div>

                {violation.remedy && (
                  <div className="mt-2 rounded bg-slate-950/70 p-2 text-xs font-mono text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span>{violation.remedy}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Extracted Declarations Ledger */}
      {activeTab === 'DECLARATIONS' && (
        <div className="space-y-3">
          <p className="text-xs font-mono text-slate-400">
            Mandatory packaging declarations extracted via Member 1 OCR pipeline. Bounding coordinates match statutory text blocks on packaging surface.
          </p>

          <div className="space-y-2.5">
            {declarations.map((decl) => {
              const isMissing = decl.status === 'MISSING';
              const isIssue = decl.status === 'POTENTIAL_ISSUE';
              const isVerify = decl.status === 'REQUIRES_VERIFICATION';

              return (
                <div
                  key={decl.id}
                  className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">
                        {decl.field_name}
                      </span>
                      <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/50 border border-cyan-500/20 px-1.5 py-0.5 rounded">
                        {decl.rule_citation}
                      </span>
                    </div>

                    <div className="mt-1 font-mono text-xs">
                      {isMissing ? (
                        <span className="text-rose-400 font-semibold italic">
                          [OMITTED] {decl.extracted_value}
                        </span>
                      ) : (
                        <span className="text-slate-200">
                          {decl.extracted_value}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    {/* Status Pill */}
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isMissing
                          ? 'border-rose-500/40 bg-rose-950/40 text-rose-300'
                          : isIssue
                          ? 'border-amber-500/40 bg-amber-950/40 text-amber-300'
                          : isVerify
                          ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300'
                          : 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                      }`}
                    >
                      {decl.status}
                    </span>

                    {/* OCR Confidence */}
                    <span className="font-mono text-[10px] text-slate-400">
                      {(decl.confidence * 100).toFixed(0)}% OCR
                    </span>

                    {/* Locate Button */}
                    {decl.bounding_box ? (
                      <button
                        type="button"
                        onClick={() => onLocateDeclaration && onLocateDeclaration(decl)}
                        className="flex items-center gap-1 rounded border border-white/15 bg-slate-800 px-2 py-1 font-mono text-[10px] text-cyan-300 hover:bg-slate-700"
                        title="Highlight on evidence viewport"
                      >
                        <Crosshair className="h-3 w-3 text-cyan-400" />
                        <span>Locate</span>
                      </button>
                    ) : (
                      <span className="font-mono text-[10px] text-slate-600 italic">
                        No Coordinate
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Barcode & Packaging Metadata */}
      {activeTab === 'BARCODE' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarcodeIcon className="h-5 w-5 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">
                Optical Barcode Inspection
              </h4>
            </div>

            {analysis.barcode?.detected ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="rounded-lg border border-white/5 bg-slate-950 p-2.5">
                  <span className="text-slate-500">Symbology Format:</span>
                  <div className="text-cyan-300 font-bold">{analysis.barcode.format}</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-slate-950 p-2.5">
                  <span className="text-slate-500">Decoded GTIN / Value:</span>
                  <div className="text-emerald-300 font-bold tracking-widest">{analysis.barcode.raw_value}</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-slate-950 p-2.5 sm:col-span-2">
                  <span className="text-slate-500">GS1 Country Prefix:</span>
                  <div className="text-white">{analysis.barcode.country_of_origin}</div>
                </div>
              </div>
            ) : (
              <div className="text-xs font-mono text-slate-400 p-2">
                No linear or 2D barcode localized on packaging front panel.
              </div>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 font-mono text-xs">
            <h4 className="text-sm font-bold text-white mb-2 font-sans">
              Screening Telemetry & Model Engine
            </h4>
            <div className="space-y-1.5 text-slate-400">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Engine Specification:</span>
                <span className="text-cyan-300">{analysis.metadata.engine_version}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Mean OCR Confidence:</span>
                <span className="text-emerald-300">{(analysis.metadata.ocr_confidence * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Inference Latency:</span>
                <span className="text-amber-300">{analysis.metadata.latency_ms} ms</span>
              </div>
              <div className="flex justify-between">
                <span>Scan Timestamp:</span>
                <span className="text-slate-300">{analysis.metadata.scanned_at}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

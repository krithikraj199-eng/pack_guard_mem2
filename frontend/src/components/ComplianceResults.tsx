'use client';

import React from 'react';
import { AlertOctagon, CheckCircle2, AlertTriangle, FileText, ArrowRight, Scale, BookOpen, ShieldAlert } from 'lucide-react';
import { AnalysisResult, Violation } from '../services/types';

interface ComplianceResultsProps {
  analysis: AnalysisResult;
  selectedViolation: Violation | null;
  onSelectViolation: (violation: Violation) => void;
  onOpenComplaintModal: () => void;
}

export const ComplianceResults: React.FC<ComplianceResultsProps> = ({
  analysis,
  selectedViolation,
  onSelectViolation,
  onOpenComplaintModal,
}) => {
  const isCritical = analysis.status === 'CRITICAL';
  const isWarning = analysis.status === 'WARNING';
  const isCompliant = analysis.status === 'COMPLIANT';

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-md ${
        isCritical
          ? 'border-rose-500/40 bg-rose-950/20 shadow-[0_0_25px_rgba(239,68,68,0.15)]'
          : isWarning
          ? 'border-amber-500/40 bg-amber-950/20 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
          : 'border-emerald-500/40 bg-emerald-950/20 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${
                isCritical
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : isWarning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {isCritical && <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />}
                {isWarning && <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />}
                {isCompliant && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                {isCritical ? 'STATUTORY VIOLATION DETECTED' : isWarning ? 'STATUTORY WARNING' : 'VERIFIED COMPLIANT'}
              </span>

              {analysis.metadata.is_demo_fixture && (
                <span className="rounded border border-cyan-500/30 bg-cyan-950/60 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                  DEMO FIXTURE
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
              <div className="text-[11px] font-mono text-slate-400">Compliance Health</div>
              <div className={`font-mono text-3xl sm:text-4xl font-black ${
                isCritical ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {analysis.overall_score}<span className="text-base text-slate-500 font-normal">/100</span>
              </div>
            </div>

            {/* Action Button */}
            {!isCompliant && (
              <button
                onClick={onOpenComplaintModal}
                className="flex items-center gap-2 rounded-xl border border-rose-500/50 bg-rose-600 px-4 py-2.5 font-mono text-xs font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:bg-rose-500 transition"
              >
                <ShieldAlert className="h-4 w-4" />
                <span>File Grievance</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Violation Breakdown List */}
      <div>
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-cyan-400" />
          Statutory Violations & Verification Ledger ({analysis.violations.length})
        </h3>

        <div className="space-y-3">
          {analysis.violations.map((violation) => {
            const isSelected = selectedViolation?.id === violation.id;

            return (
              <div
                key={violation.id}
                onClick={() => onSelectViolation(violation)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-slate-900 shadow-[0_0_15px_rgba(0,240,255,0.15)] ring-1 ring-cyan-400'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/20 hover:bg-slate-900/90'
                }`}
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
                    <span className="text-slate-500 font-mono">Governing Statute:</span>
                    <p className="text-slate-300 font-medium">{violation.act_reference}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-mono">Detected Finding:</span>
                    <p className="text-rose-300 font-medium">{violation.detected_value}</p>
                  </div>
                </div>

                <div className="mt-2 text-xs text-slate-400">
                  <span className="text-slate-500 font-mono">Legal Requirement: </span>
                  {violation.expected_standard}
                </div>

                {violation.remedy && (
                  <div className="mt-2 rounded bg-slate-950/70 p-2 text-xs font-mono text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    <span>Statutory Remedy: {violation.remedy}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useEffect, useState } from 'react';
import { Scan, Eye, Scale, FileText, CheckCircle2 } from 'lucide-react';

interface AnalysisProgressProps {
  onComplete: () => void;
}

const STAGES = [
  { id: 1, label: 'Optical Character Recognition (OCR)', desc: 'Extracting multilingual text, MRP declarations, and ingredient lists...', icon: Eye },
  { id: 2, label: 'Legal Metrology Compliance Check', desc: 'Validating net weight numeral height, date of packing, and Unit Sale Price...', icon: Scale },
  { id: 3, label: 'FSSAI & Regulatory Cross-Verification', desc: 'Querying FSSAI registry and auditing mandatory nutritional allergen warnings...', icon: Scan },
  { id: 4, label: 'Synthesizing Statutory Evidence Dossier', desc: 'Computing compliance health index and generating statutory bounding boxes...', icon: FileText },
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ onComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return prev;
        }
      });
    }, 650);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-md shadow-[0_0_30px_rgba(0,240,255,0.15)]">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-cyan-400 animate-ping"></div>
          <span className="font-mono text-sm font-bold text-cyan-300">
            AUDIT IN PROGRESS: AI REGULATORY ENGINE ACTIVE
          </span>
        </div>
        <span className="font-mono text-xs text-slate-400">
          Stage {currentStage + 1} of {STAGES.length}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;

          return (
            <div
              key={stage.id}
              className={`flex items-start gap-4 rounded-xl border p-3.5 transition-all ${
                isCurrent
                  ? 'border-cyan-400/60 bg-cyan-950/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : isDone
                  ? 'border-emerald-500/30 bg-emerald-950/20'
                  : 'border-white/5 bg-slate-950/40 opacity-50'
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                  isDone
                    ? 'border-emerald-400 bg-emerald-950 text-emerald-400'
                    : isCurrent
                    ? 'border-cyan-400 bg-cyan-950 text-cyan-400 animate-pulse'
                    : 'border-slate-800 bg-slate-900 text-slate-600'
                }`}
              >
                {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold ${isCurrent ? 'text-cyan-300' : isDone ? 'text-emerald-300' : 'text-slate-400'}`}>
                    {stage.label}
                  </h4>
                  {isCurrent && (
                    <span className="font-mono text-[11px] text-cyan-400 animate-pulse">
                      Processing...
                    </span>
                  )}
                  {isDone && (
                    <span className="font-mono text-[11px] text-emerald-400">
                      ✓ Complete
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-400">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

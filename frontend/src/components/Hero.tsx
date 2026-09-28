'use client';

import React from 'react';
import { Scale, UploadCloud, Eye, CheckSquare, Crosshair, Send, AlertTriangle } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-8">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[320px] w-[640px] rounded-full bg-cyan-500/10 blur-[130px]"></div>
        <div className="h-[260px] w-[520px] rounded-full bg-indigo-500/10 blur-[110px]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Prototype Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 font-mono text-xs text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.15)] mb-4">
          <Scale className="h-3.5 w-3.5 text-cyan-400" />
          <span>Packaged Commodity Compliance & Consumer Protection • Academic Expo 2026</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Verify Before You Buy. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            Automated Packaging Metrology Audits.
          </span>
        </h1>

        {/* Subhead */}
        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
          Screen packaged consumer goods against the <strong>Legal Metrology (Packaged Commodities) Rules, 2011</strong> and <strong>FSSAI Packaging Regulations</strong>. Inspect optical bounding-box evidence and forward verified grievances for human officer review.
        </p>

        {/* Explicit Statutory Disclaimer Box */}
        <div className="mt-5 mx-auto max-w-3xl rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs font-mono text-amber-200/90 flex items-start gap-2.5 text-left">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Statutory Notice:</strong> PackGuard AI provides automated compliance pre-screening to assist consumers and enforcement personnel. The platform identifies <em>potential issues</em> and <em>screening advisories</em>. Final legal determinations are made solely by designated regulatory officers under the Legal Metrology Act, 2009.
          </span>
        </div>

        {/* Complete 5-Step Consumer Workflow Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-5 gap-3 max-w-5xl mx-auto text-left">
          {/* Step 1 */}
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-sm relative group hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-cyan-400 font-bold bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                01. INPUT
              </span>
              <UploadCloud className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Upload / Camera</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Capture or upload package front label, nutrition table, or declaration panel.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-sm relative group hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-indigo-400 font-bold bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-500/30">
                02. OCR
              </span>
              <Eye className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 transition" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">OCR & Barcode</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Extract MRP, USP, Net Quantity, Mfg date, and optical barcode symbologies.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-sm relative group hover:border-emerald-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                03. SCREEN
              </span>
              <CheckSquare className="h-4 w-4 text-slate-400 group-hover:text-emerald-400 transition" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Rule Screening</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Screen against Rule 6 & 7 (Packaging Rules) and FSSAI mandatory notices.
            </p>
          </div>

          {/* Step 4 */}
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-sm relative group hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-cyan-400 font-bold bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                04. EVIDENCE
              </span>
              <Crosshair className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Evidence Viewport</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Inspect normalized visual coordinates linking findings to packaging surfaces.
            </p>
          </div>

          {/* Step 5 */}
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5 backdrop-blur-sm relative group hover:border-rose-500/40 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-rose-400 font-bold bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-500/30">
                05. GRIEVANCE
              </span>
              <Send className="h-4 w-4 text-slate-400 group-hover:text-rose-400 transition" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Officer Dispatch</h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Generate evidence-backed docket for Member 4 Officer review & resolution.
            </p>
          </div>
        </div>

        {/* Technical Benchmarks */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-4xl mx-auto text-left sm:text-center">
          <div className="rounded-xl border border-white/10 bg-slate-900/40 p-2.5 backdrop-blur-sm">
            <div className="font-mono text-lg sm:text-xl font-bold text-cyan-400">3 Presets</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400">Verified Ground-Truth Benchmarks</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/40 p-2.5 backdrop-blur-sm">
            <div className="font-mono text-lg sm:text-xl font-bold text-emerald-400">14 Clauses</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400">Legal Metrology & FSSAI Standards</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/40 p-2.5 backdrop-blur-sm">
            <div className="font-mono text-lg sm:text-xl font-bold text-cyan-300">Normalized</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400">Relative Space [ymin, xmin, ymax, xmax]</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/40 p-2.5 backdrop-blur-sm">
            <div className="font-mono text-lg sm:text-xl font-bold text-amber-400">FastAPI API</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400">Typed /api/v1 REST Contracts</div>
          </div>
        </div>
      </div>
    </section>
  );
};

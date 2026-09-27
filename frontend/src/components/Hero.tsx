'use client';

import React from 'react';
import { Scale } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-6">
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[300px] w-[600px] rounded-full bg-cyan-500/10 blur-[120px]"></div>
        <div className="h-[250px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Prototype Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 font-mono text-xs text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.15)] mb-4">
          <Scale className="h-3.5 w-3.5 text-cyan-400" />
          <span>Statutory Packaging Compliance Assistant • Academic Expo Prototype</span>
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
          Audit consumer package labeling against the <strong>Legal Metrology (Packaged Commodities) Rules, 2011</strong> and <strong>FSSAI Packaging Regulations</strong>. Inspect optical bounding-box evidence and generate formal grievance records.
        </p>

        {/* Realistic Technical Capability Metrics */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-4xl mx-auto text-left sm:text-center">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-sm">
            <div className="font-mono text-xl sm:text-2xl font-bold text-cyan-400">3 Presets</div>
            <div className="text-[11px] sm:text-xs text-slate-400">Verified Ground-Truth Fixtures</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-sm">
            <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-400">14 Rules</div>
            <div className="text-[11px] sm:text-xs text-slate-400">Legal Metrology & FSSAI Clauses</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-sm">
            <div className="font-mono text-xl sm:text-2xl font-bold text-cyan-300">Normalized</div>
            <div className="text-[11px] sm:text-xs text-slate-400">Relative [ymin, xmin, ymax, xmax]</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 backdrop-blur-sm">
            <div className="font-mono text-xl sm:text-2xl font-bold text-amber-400">FastAPI API</div>
            <div className="text-[11px] sm:text-xs text-slate-400">Live /api/v1 REST Contracts</div>
          </div>
        </div>
      </div>
    </section>
  );
};

'use client';

import React from 'react';
import { Scale, ShieldCheck, FileCheck, AlertTriangle } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-6">
      {/* Background glow mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[300px] w-[600px] rounded-full bg-cyan-500/10 blur-[120px]"></div>
        <div className="h-[250px] w-[500px] rounded-full bg-indigo-500/10 blur-[100px]"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Authority Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 font-mono text-xs text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.15)] mb-4">
          <Scale className="h-3.5 w-3.5 text-cyan-400" />
          <span>Statutory Compliance Checker • Legal Metrology Act, 2009 & FSSAI</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Verify Before You Buy. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            Enforce Your Consumer Rights.
          </span>
        </h1>

        {/* Subhead */}
        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
          Instantly audit retail packaging against the <strong>Legal Metrology (Packaged Commodities) Rules, 2011</strong> and <strong>FSSAI Labeling Standards</strong> with automated multi-modal computer vision and interactive statutory evidence analysis.
        </p>

        {/* Live Trust Metrics Bar */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-4xl mx-auto">
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 text-center backdrop-blur-sm">
            <div className="font-mono text-xl sm:text-2xl font-bold text-cyan-400">1.48M+</div>
            <div className="text-[11px] sm:text-xs text-slate-400">Packages Audited</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 text-center backdrop-blur-sm">
            <div className="font-mono text-xl sm:text-2xl font-bold text-emerald-400">99.4%</div>
            <div className="text-[11px] sm:text-xs text-slate-400">Statutory Precision</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 text-center backdrop-blur-sm">
            <div className="font-mono text-xl sm:text-2xl font-bold text-cyan-300">1.2s</div>
            <div className="text-[11px] sm:text-xs text-slate-400">Avg. Optical OCR Scan</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3 text-center backdrop-blur-sm">
            <div className="font-mono text-xl sm:text-2xl font-bold text-amber-400">₹14.8 Cr</div>
            <div className="text-[11px] sm:text-xs text-slate-400">Consumer Actions Initiated</div>
          </div>
        </div>
      </div>
    </section>
  );
};

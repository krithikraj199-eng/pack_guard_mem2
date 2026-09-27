'use client';

import React from 'react';
import { ShieldAlert, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#070a12] py-8 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-cyan-400" />
            <span className="font-bold text-white">PackGuard AI</span>
            <span className="text-slate-500">| Project Expo September 2026</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
            <a
              href="https://edaakhil.nic.in"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-cyan-300 transition"
            >
              E-Daakhil Portal <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://fssai.gov.in"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-cyan-300 transition"
            >
              FSSAI FoSCoS <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://consumeraffairs.nic.in"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-cyan-300 transition"
            >
              Legal Metrology Division <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-4 border-t border-white/5 pt-4 text-center sm:text-left text-[11px] text-slate-500">
          Disclaimer: PackGuard AI provides automated regulatory compliance verification and citizen grievance drafting based on the Legal Metrology Act (2009) and FSSAI Packaging Regulations (2020). Formal prosecution and adjudication are subject to verification by designated District Legal Metrology Officers.
        </div>
      </div>
    </footer>
  );
};

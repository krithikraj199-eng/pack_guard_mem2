'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, Activity, PhoneCall, Sparkles, Server } from 'lucide-react';
import { ApiStatus } from '../services/api';

interface HeaderProps {
  apiStatus: ApiStatus | null;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiStatus,
  isDemoMode,
  onToggleDemoMode,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b0f19]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <ShieldAlert className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-xl font-bold tracking-tight text-white">
                PackGuard <span className="text-cyan-400">AI</span>
              </span>
              <span className="rounded border border-cyan-500/30 bg-cyan-950/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-300">
                v2.4
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-400">
              Consumer Packaging Compliance & Metrology Verification
            </p>
          </div>
        </div>

        {/* Center / Status */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Live Backend Telemetry Pill */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 font-mono text-xs">
            <Server className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-400">Backend:</span>
            {apiStatus?.online ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                FastAPI Live ({apiStatus.latencyMs}ms)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400" title={apiStatus?.statusText}>
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                FastAPI Unreachable
              </span>
            )}
          </div>

          {/* National Consumer Helpline Badge */}
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 font-mono text-xs text-emerald-300">
            <PhoneCall className="h-3 w-3 text-emerald-400" />
            <span>NCH Helpline: 1915</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDemoMode}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
              isDemoMode
                ? 'border-cyan-400/60 bg-cyan-950/80 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'border-white/10 bg-slate-900/80 text-slate-400 hover:border-white/20 hover:text-white'
            }`}
            title="Toggle offline demo fixtures for expo demonstration"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>{isDemoMode ? 'Demo Mode: ON' : 'Demo Mode: OFF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

'use client';

import React from 'react';
import { ShieldAlert, Sparkles, Server, Clock, Network } from 'lucide-react';
import { ApiStatus } from '../services/api';

interface HeaderProps {
  apiStatus: ApiStatus | null;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  complaintsCount: number;
  onOpenHistory: () => void;
  onOpenContracts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  apiStatus,
  isDemoMode,
  onToggleDemoMode,
  complaintsCount,
  onOpenHistory,
  onOpenContracts,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b0f19]/90 backdrop-blur-md">
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
                MEM 2 Consumer Frontend
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-400">
              Packaged Commodity Compliance & Statutory Metrology
            </p>
          </div>
        </div>

        {/* Center / Backend Telemetry Status */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 font-mono text-xs">
            <Server className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-400">FastAPI Backend:</span>
            {apiStatus?.online ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Connected ({apiStatus.latencyMs}ms)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400 font-medium" title={apiStatus?.statusText}>
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                Offline ({apiStatus?.baseUrl || 'http://localhost:8000'})
              </span>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Contracts Button */}
          <button
            type="button"
            onClick={onOpenContracts}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-slate-900/80 px-2.5 py-1.5 font-mono text-xs text-slate-300 hover:border-cyan-500/40 hover:text-white transition"
            title="Inspect MEM 1, MEM 3, and MEM 4 Integration Contracts"
          >
            <Network className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Contracts</span>
          </button>

          {/* Grievance History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-slate-900/80 px-2.5 py-1.5 font-mono text-xs text-slate-300 hover:border-cyan-500/40 hover:text-white transition"
            title="View submitted complaints & tracking tokens"
          >
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Grievances</span>
            {complaintsCount > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-cyan-500 px-1 font-mono text-[10px] font-bold text-black">
                {complaintsCount}
              </span>
            )}
          </button>

          {/* Demo / Live Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDemoMode}
            aria-pressed={isDemoMode}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              isDemoMode
                ? 'border-cyan-400/60 bg-cyan-950/80 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'border-white/15 bg-slate-900/80 text-slate-300 hover:border-white/30 hover:text-white'
            }`}
            title="Switch between Live FastAPI mode and Offline Benchmark Demo Fixtures"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>{isDemoMode ? 'Demo Mode' : 'Live API'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

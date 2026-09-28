'use client';

import React, { useState, useEffect } from 'react';
import { X, Clock, FileCheck, Copy, Check, Trash2, ShieldAlert, ArrowRight } from 'lucide-react';
import { ComplaintResponse } from '../services/types';

interface ComplaintHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNewAudit?: () => void;
}

export const ComplaintHistoryModal: React.FC<ComplaintHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectNewAudit,
}) => {
  const [complaints, setComplaints] = useState<ComplaintResponse[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load complaints from localStorage asynchronously when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem('packguard_complaints');
        if (stored) {
          setComplaints(JSON.parse(stored));
        } else {
          setComplaints([]);
        }
      } catch (e) {
        console.warn('Failed to load complaint history:', e);
        setComplaints([]);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const copyToken = (token: string, id: string) => {
    navigator.clipboard.writeText(token);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearHistory = () => {
    if (confirm('Clear your local grievance history? This will only remove local records on this browser.')) {
      localStorage.removeItem('packguard_complaints');
      setComplaints([]);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="complaint-history-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-slate-900 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 id="complaint-history-title" className="text-lg font-bold text-white">
                Consumer Grievance History
              </h3>
              <p className="text-xs text-slate-400">
                Track filed complaints dispatched for Member 4 Officer review.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {complaints.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                title="Clear History"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Complaints List or Empty State */}
        {complaints.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/80 border border-white/10 text-slate-500 mb-3">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h4 className="text-sm font-semibold text-white">No Grievance Dockets Filed Yet</h4>
            <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
              When you submit non-compliant packaged commodity findings, your tracking tokens and case receipts will appear here.
            </p>
            {onSelectNewAudit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSelectNewAudit();
                }}
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-600 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-cyan-500 transition"
              >
                <span>Audit a Package Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {complaints.map((item) => {
              const isCopied = copiedId === item.complaint_id;

              return (
                <div
                  key={item.complaint_id}
                  className="rounded-xl border border-white/10 bg-slate-950/70 p-4 transition hover:border-cyan-500/40"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">
                          {item.product_name || 'Audited Packaging Product'}
                        </span>
                        {item.is_simulated_demo && (
                          <span className="rounded bg-amber-950/70 border border-amber-500/30 px-1.5 py-0.2 font-mono text-[9px] text-amber-300">
                            DEMO
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        {item.brand || 'Retail Commodity'}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-950/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-300 self-start sm:self-auto">
                      <FileCheck className="h-3 w-3" />
                      {item.status}
                    </span>
                  </div>

                  {/* Token & Routing */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="rounded bg-slate-900/80 p-2 border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Tracking Token:</span>
                        <span className="text-emerald-300 font-bold">{item.tracking_number}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToken(item.tracking_number, item.complaint_id)}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Copy tracking token"
                      >
                        {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>

                    <div className="rounded bg-slate-900/80 p-2 border border-white/5">
                      <span className="text-slate-500 block text-[10px]">Docket ID:</span>
                      <span className="text-cyan-300">{item.complaint_id}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                    <span>
                      Filed: {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-slate-400">
                      Forwarded for Human Officer Review
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-white/10 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

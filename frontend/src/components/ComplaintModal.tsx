'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Send, Printer, Copy, Check, FileCheck, AlertCircle, CheckSquare, Square } from 'lucide-react';
import { AnalysisResult, ComplaintPayload, ComplaintResponse } from '../services/types';
import { submitComplaint } from '../services/api';

interface ComplaintModalProps {
  analysis: AnalysisResult;
  isDemoMode: boolean;
  onClose: () => void;
  onComplaintSubmitted?: (complaint: ComplaintResponse) => void;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  analysis,
  isDemoMode,
  onClose,
  onComplaintSubmitted,
}) => {
  const [merchant, setMerchant] = useState('Local Retail Store / E-Commerce Platform');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [consumerName, setConsumerName] = useState('Consumer Citizen');
  const [consumerEmail, setConsumerEmail] = useState('citizen@example.com');
  const [consumerPhone, setConsumerPhone] = useState('9876543210');
  const [notes, setNotes] = useState('Purchased package was found non-compliant with statutory packaging declarations.');

  // Selectable violations list (default all non-compliant findings checked)
  const nonCompliantViolations = analysis.violations.filter((v) => v.severity !== 'COMPLIANT');
  const [selectedViolationIds, setSelectedViolationIds] = useState<string[]>(
    nonCompliantViolations.map((v) => v.id)
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submittedDocket, setSubmittedDocket] = useState<ComplaintResponse | null>(null);
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const toggleViolationSelection = (id: string) => {
    setSelectedViolationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!merchant.trim()) {
      errs.merchant = 'Merchant or platform name is required.';
    }

    if (!purchaseDate) {
      errs.purchaseDate = 'Purchase date is required.';
    } else if (new Date(purchaseDate) > new Date()) {
      errs.purchaseDate = 'Purchase date cannot be in the future.';
    }

    if (!consumerName.trim() || consumerName.trim().length < 2) {
      errs.consumerName = 'Valid complainant name (min 2 chars) is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(consumerEmail.trim())) {
      errs.consumerEmail = 'Valid email address is required.';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(consumerPhone.replace(/\D/g, ''))) {
      errs.consumerPhone = 'Please provide a valid 10-digit Indian mobile number.';
    }

    if (!notes.trim() || notes.trim().length < 10) {
      errs.notes = 'Please provide detailed remarks (min 10 characters).';
    }

    if (selectedViolationIds.length === 0) {
      errs.violations = 'Please select at least one screening finding to include in the complaint.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Helper to persist complaint in browser storage
  const saveToLocalHistory = (docket: ComplaintResponse) => {
    try {
      const stored = localStorage.getItem('packguard_complaints');
      const list: ComplaintResponse[] = stored ? JSON.parse(stored) : [];
      list.unshift(docket);
      localStorage.setItem('packguard_complaints', JSON.stringify(list));
      if (onComplaintSubmitted) {
        onComplaintSubmitted(docket);
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setApiError(null);

    const payload: ComplaintPayload = {
      analysis_id: analysis.analysis_id,
      product_name: analysis.product_name,
      brand: analysis.brand,
      merchant_or_platform: merchant.trim(),
      purchase_date: purchaseDate,
      consumer_name: consumerName.trim(),
      consumer_email: consumerEmail.trim(),
      consumer_phone: consumerPhone.trim(),
      additional_notes: notes.trim(),
      violation_ids: selectedViolationIds,
    };

    if (isDemoMode) {
      // Offline Demo Mode: Generate realistic watermarked test docket
      setTimeout(() => {
        const demoDocket: ComplaintResponse = {
          success: true,
          complaint_id: `DEMO-PG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          tracking_number: `DEMO-TRACK-${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'SUBMITTED_FOR_OFFICER_REVIEW',
          created_at: new Date().toISOString(),
          filing_authority: 'Designated Legal Metrology Officer (Simulated Queue for Expo Demo)',
          message: 'Simulated grievance docket generated successfully for offline expo testing.',
          is_simulated_demo: true,
          product_name: analysis.product_name,
          brand: analysis.brand,
          violations_count: selectedViolationIds.length,
        };
        setSubmittedDocket(demoDocket);
        saveToLocalHistory(demoDocket);
        setSubmitting(false);
      }, 400);
      return;
    }

    // Live Mode: Call Member 3's backend. Do not fabricate success if backend fails!
    try {
      const response = await submitComplaint(payload);
      const enhancedResponse: ComplaintResponse = {
        ...response,
        product_name: analysis.product_name,
        brand: analysis.brand,
        violations_count: selectedViolationIds.length,
      };
      setSubmittedDocket(enhancedResponse);
      saveToLocalHistory(enhancedResponse);
    } catch (err: unknown) {
      const error = err as Error;
      setApiError(
        `Live Submission Failed: ${error.message}. Member 3's FastAPI service is unreachable at http://localhost:8000. Live submission requires an active backend.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const copyDocket = () => {
    if (!submittedDocket) return;
    const text = `PACKGUARD AI GRIEVANCE DOCKET
Docket ID: ${submittedDocket.complaint_id}
Tracking Token: ${submittedDocket.tracking_number}
Product: ${analysis.product_name}
Brand: ${analysis.brand}
Created: ${submittedDocket.created_at}
Routing Authority: ${submittedDocket.filing_authority}
Status: ${submittedDocket.status}
${
  submittedDocket.is_simulated_demo
    ? '[SIMULATED DEMO DOCKET — EXPO EXHIBITION ONLY]'
    : '[OFFICIAL COMPLAINT DOCKET TRANSMITTED TO MEMBER 3 BACKEND]'
}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="complaint-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-slate-900 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {submittedDocket ? (
          /* Success Docket Receipt */
          <div className="text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-4">
              <FileCheck className="h-8 w-8" />
            </div>

            {submittedDocket.is_simulated_demo ? (
              <div className="inline-block rounded-md border border-amber-500/50 bg-amber-950/60 px-3 py-1 font-mono text-xs font-bold text-amber-300 mb-2">
                [SIMULATED DEMO DOCKET — EXPO EXHIBITION ONLY]
              </div>
            ) : (
              <div className="inline-block rounded-md border border-emerald-500/50 bg-emerald-950/60 px-3 py-1 font-mono text-xs font-bold text-emerald-300 mb-2">
                [COMPLAINT TRANSMITTED FOR HUMAN OFFICER VERIFICATION]
              </div>
            )}

            <h3 id="complaint-modal-title" className="text-2xl font-bold text-white">
              Grievance Record Generated
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              {submittedDocket.is_simulated_demo
                ? 'Simulated record ready for presentation and Member 4 dashboard ingestion test.'
                : 'Transmitted to Member 3 FastAPI database for Member 4 Officer review queue.'}
            </p>

            {/* Docket Details Card */}
            <div className="mt-6 rounded-xl border border-cyan-500/30 bg-slate-950 p-4 text-left font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Formal Docket ID:</span>
                <span className="font-bold text-cyan-300">{submittedDocket.complaint_id}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Citizen Tracking Token:</span>
                <span className="font-bold text-emerald-300">{submittedDocket.tracking_number}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Designated Routing:</span>
                <span className="text-slate-200">{submittedDocket.filing_authority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-amber-400 font-bold">{submittedDocket.status}</span>
              </div>
            </div>

            {/* Notice */}
            <div className="mt-4 rounded bg-slate-950/60 p-3 text-[11px] text-slate-400 text-left border border-white/5">
              <strong>Notice:</strong> This grievance record documents preliminary statutory observations. Final legal determinations and official notices are issued by authorized enforcement officers under the Legal Metrology Act, 2009. Retain your citizen tracking token for status inquiries.
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={copyDocket}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Docket Text'}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 transition shadow-[0_0_12px_rgba(0,240,255,0.25)]"
              >
                <Printer className="h-4 w-4" />
                <span>Print Formal Docket</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/15 px-4 py-2 text-xs text-slate-300 hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Complaint Submission Form */
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 id="complaint-modal-title" className="text-lg font-bold text-white">
                  Submit Evidence-Backed Compliance Complaint
                </h3>
                <p className="text-xs text-slate-400">
                  Pre-populated with preliminary screening findings for forwarding to Officer Review.
                </p>
              </div>
            </div>

            {apiError && (
              <div
                role="alert"
                className="mb-4 rounded-xl border border-rose-500/50 bg-rose-950/40 p-3 text-xs font-mono text-rose-300 flex items-start gap-2"
              >
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Info & Selectable Findings */}
              <div className="rounded-lg border border-white/10 bg-slate-950/60 p-3">
                <div className="text-[11px] font-mono text-slate-400">Audited Commodity:</div>
                <div className="text-sm font-bold text-white">{analysis.product_name}</div>
                <div className="text-xs text-slate-400 mb-2">{analysis.brand}</div>

                <div className="border-t border-white/10 pt-2">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1.5">
                    Include Screened Observations in Grievance:
                  </span>
                  <div className="space-y-1.5">
                    {nonCompliantViolations.map((v) => {
                      const isSelected = selectedViolationIds.includes(v.id);
                      return (
                        <div
                          key={v.id}
                          onClick={() => toggleViolationSelection(v.id)}
                          className="flex items-center gap-2 cursor-pointer text-xs p-1.5 rounded hover:bg-slate-900"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-cyan-400 shrink-0" />
                          ) : (
                            <Square className="h-4 w-4 text-slate-600 shrink-0" />
                          )}
                          <span className="font-mono text-cyan-300 font-semibold">{v.rule_number}:</span>
                          <span className="text-slate-300">{v.title}</span>
                        </div>
                      );
                    })}
                  </div>
                  {errors.violations && (
                    <p className="mt-1 text-[11px] text-rose-400 font-mono">{errors.violations}</p>
                  )}
                </div>
              </div>

              {/* Merchant Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="merchant-input" className="block text-xs font-mono text-slate-300 mb-1">
                    Store or Online Platform Name:
                  </label>
                  <input
                    id="merchant-input"
                    type="text"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    className={`w-full rounded-lg border bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none ${
                      errors.merchant ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-cyan-400'
                    }`}
                  />
                  {errors.merchant && <p className="mt-1 text-[11px] text-rose-400 font-mono">{errors.merchant}</p>}
                </div>
                <div>
                  <label htmlFor="date-input" className="block text-xs font-mono text-slate-300 mb-1">
                    Purchase / Inspection Date:
                  </label>
                  <input
                    id="date-input"
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className={`w-full rounded-lg border bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none ${
                      errors.purchaseDate ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-cyan-400'
                    }`}
                  />
                  {errors.purchaseDate && <p className="mt-1 text-[11px] text-rose-400 font-mono">{errors.purchaseDate}</p>}
                </div>
              </div>

              {/* Consumer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="name-input" className="block text-xs font-mono text-slate-300 mb-1">
                    Complainant Name:
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    value={consumerName}
                    onChange={(e) => setConsumerName(e.target.value)}
                    className={`w-full rounded-lg border bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none ${
                      errors.consumerName ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-cyan-400'
                    }`}
                  />
                  {errors.consumerName && <p className="mt-1 text-[11px] text-rose-400 font-mono">{errors.consumerName}</p>}
                </div>
                <div>
                  <label htmlFor="email-input" className="block text-xs font-mono text-slate-300 mb-1">
                    Email Address:
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    value={consumerEmail}
                    onChange={(e) => setConsumerEmail(e.target.value)}
                    className={`w-full rounded-lg border bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none ${
                      errors.consumerEmail ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-cyan-400'
                    }`}
                  />
                  {errors.consumerEmail && <p className="mt-1 text-[11px] text-rose-400 font-mono">{errors.consumerEmail}</p>}
                </div>
                <div>
                  <label htmlFor="phone-input" className="block text-xs font-mono text-slate-300 mb-1">
                    10-Digit Mobile:
                  </label>
                  <input
                    id="phone-input"
                    type="tel"
                    placeholder="9876543210"
                    value={consumerPhone}
                    onChange={(e) => setConsumerPhone(e.target.value)}
                    className={`w-full rounded-lg border bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none ${
                      errors.consumerPhone ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-cyan-400'
                    }`}
                  />
                  {errors.consumerPhone && <p className="mt-1 text-[11px] text-rose-400 font-mono">{errors.consumerPhone}</p>}
                </div>
              </div>

              {/* Consumer Remarks */}
              <div>
                <label htmlFor="remarks-input" className="block text-xs font-mono text-slate-300 mb-1">
                  Additional Grievance Remarks:
                </label>
                <textarea
                  id="remarks-input"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`w-full rounded-lg border bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none ${
                    errors.notes ? 'border-rose-500 focus:border-rose-400' : 'border-white/15 focus:border-cyan-400'
                  }`}
                />
                {errors.notes && <p className="mt-1 text-[11px] text-rose-400 font-mono">{errors.notes}</p>}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg border border-rose-500/50 bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-500 transition shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{submitting ? 'Transmitting Grievance...' : 'Submit Grievance Docket'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

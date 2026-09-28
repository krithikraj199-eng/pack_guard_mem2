'use client';

import React, { useState } from 'react';
import { X, Network, Server, Eye, ShieldCheck, Copy, Check } from 'lucide-react';

interface IntegrationContractsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationContractsModal: React.FC<IntegrationContractsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'MEM1' | 'MEM3' | 'MEM4' | 'ARCHITECTURE'>('ARCHITECTURE');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const mem1Schema = `{
  "product_name": "string",
  "brand": "string",
  "category": "string",
  "overall_score": 75, // 0 - 100
  "status": "CRITICAL" | "WARNING" | "COMPLIANT",
  "summary": "Preliminary screening summary (requires human verification)",
  "barcode": {
    "detected": true,
    "format": "EAN-13",
    "raw_value": "8901030829123",
    "country_of_origin": "India (GS1 890)",
    "bounding_box": [0.72, 0.70, 0.88, 0.92] // [ymin, xmin, ymax, xmax] normalized 0.0 - 1.0
  },
  "declarations": [
    {
      "id": "DECL-001",
      "field_name": "Maximum Retail Price (MRP)",
      "rule_citation": "Rule 6(1)(e)",
      "extracted_value": "₹120.00",
      "status": "COMPLIANT",
      "confidence": 0.98,
      "bounding_box": [0.38, 0.55, 0.46, 0.82] // Undefined if missing!
    }
  ],
  "violations": [
    {
      "id": "VIOL-001",
      "title": "Missing Mandatory Unit Sale Price",
      "severity": "CRITICAL",
      "rule_number": "Rule 6(11)",
      "detected_value": "No per-ml price declared",
      "expected_standard": "Unit Sale Price required adjacent to MRP",
      "bounding_box": [0.38, 0.55, 0.55, 0.92]
    }
  ]
}`;

  const mem3Endpoints = `// FastAPI REST Service Contracts (Base URL: http://localhost:8000)

// 1. Health Liveness Probe
GET /api/v1/health
Response: { "status": "ok", "service": "PackGuard Backend", "version": "1.0.0" }

// 2. Package Image Analysis
POST /api/v1/analyze
Content-Type: multipart/form-data
Body: file: File (JPEG/PNG/WEBP), client_timestamp: ISO-8601
Response: AnalysisResult JSON

// 3. Complaint Filing & Case Docket Persistence
POST /api/v1/complaints
Content-Type: application/json
Body: {
  "analysis_id": "string",
  "product_name": "string",
  "brand": "string",
  "merchant_or_platform": "string",
  "purchase_date": "YYYY-MM-DD",
  "consumer_name": "string",
  "consumer_email": "string",
  "consumer_phone": "string",
  "additional_notes": "string",
  "violation_ids": ["VIOL-001", "VIOL-002"]
}
Response: {
  "success": true,
  "complaint_id": "PG-2026-CASE-1049",
  "tracking_number": "TRACK-892104",
  "status": "SUBMITTED_FOR_OFFICER_REVIEW",
  "filing_authority": "Designated District Legal Metrology Officer",
  "created_at": "2026-09-28T14:30:00Z",
  "message": "Case queued for officer verification."
}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="integration-contracts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/20 bg-slate-900 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <h3 id="integration-contracts-title" className="text-lg font-bold text-white">
                PackGuard AI Module Integration Contracts
              </h3>
              <p className="text-xs text-slate-400">
                Architectural boundaries between MEM 1, MEM 2 (Frontend), MEM 3 (FastAPI), and MEM 4 (Officer).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-4 border-b border-white/10 pb-3 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('ARCHITECTURE')}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition ${
              activeTab === 'ARCHITECTURE'
                ? 'border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            Team Flow
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('MEM1')}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition ${
              activeTab === 'MEM1'
                ? 'border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            MEM 1: AI & OCR Engine
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('MEM3')}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition ${
              activeTab === 'MEM3'
                ? 'border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            MEM 3: FastAPI Backend
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('MEM4')}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition ${
              activeTab === 'MEM4'
                ? 'border border-cyan-500/40 bg-cyan-950/60 text-cyan-300 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            MEM 4: Officer Dashboard
          </button>
        </div>

        {/* Tab 1: Architecture */}
        {activeTab === 'ARCHITECTURE' && (
          <div className="mt-4 space-y-4 text-xs font-mono">
            <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
              <h4 className="text-sm font-bold text-white mb-2 font-sans">
                PackGuard AI Multi-Module Architecture
              </h4>
              <p className="text-slate-400 leading-relaxed font-sans mb-3">
                The consumer frontend (MEM 2) communicates exclusively with MEM 3&apos;s FastAPI backend. MEM 3 orchestrates MEM 1&apos;s AI/OCR inference and stores complaint dockets for MEM 4&apos;s Officer Command Center.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center pt-2">
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/30 p-2.5">
                  <div className="font-bold text-cyan-400">MEM 2 (Me)</div>
                  <div className="text-[10px] text-slate-300">Consumer Next.js App</div>
                  <div className="text-[9px] text-slate-500 mt-1">Upload • Viewer • Complaint</div>
                </div>
                <div className="rounded-lg border border-indigo-500/30 bg-indigo-950/30 p-2.5">
                  <div className="font-bold text-indigo-400">MEM 3</div>
                  <div className="text-[10px] text-slate-300">FastAPI Backend</div>
                  <div className="text-[9px] text-slate-500 mt-1">REST API • DB • Reports</div>
                </div>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-2.5">
                  <div className="font-bold text-emerald-400">MEM 1</div>
                  <div className="text-[10px] text-slate-300">AI / Vision Engine</div>
                  <div className="text-[9px] text-slate-500 mt-1">OCR • Barcode • Rules</div>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-950/30 p-2.5">
                  <div className="font-bold text-amber-400">MEM 4</div>
                  <div className="text-[10px] text-slate-300">Officer Center</div>
                  <div className="text-[9px] text-slate-500 mt-1">Review • Verification</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4 font-sans text-xs">
              <h5 className="font-bold text-white mb-1 flex items-center gap-1.5 font-mono">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Statutory Compliance Boundary
              </h5>
              <p className="text-slate-400 leading-relaxed">
                The frontend strictly enforces honest non-determination terminology. No screen claims that AI has issued a legal violation. Every observation is categorized as a <strong>preliminary screening result</strong> awaiting verification by a human enforcement officer.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: MEM 1 Contract */}
        {activeTab === 'MEM1' && (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Eye className="h-4 w-4 text-cyan-400" />
                  MEM 1 AI / OCR Coordinate & Declaration Contract
                </h4>
                <button
                  type="button"
                  onClick={() => copySnippet(mem1Schema, 'mem1')}
                  className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300"
                >
                  {copiedCode === 'mem1' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedCode === 'mem1' ? 'Copied' : 'Copy Schema'}</span>
                </button>
              </div>

              <div className="text-xs text-slate-400 mb-3 space-y-1">
                <p>
                  • <strong>Coordinate Convention:</strong> Bounding boxes MUST use normalized relative coordinates: <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">[ymin, xmin, ymax, xmax]</code> where all values are between 0.0 and 1.0.
                </p>
                <p className="text-rose-300">
                  • <strong>Integrity Rule:</strong> Never invent bounding boxes for missing declarations (e.g. absent Unit Sale Price or missing warning). Return <code className="text-white">bounding_box: null</code> or omit it.
                </p>
              </div>

              <pre className="rounded-lg bg-black/80 p-3 text-[11px] font-mono text-cyan-300 overflow-x-auto border border-white/5">
                {mem1Schema}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: MEM 3 Contract */}
        {activeTab === 'MEM3' && (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Server className="h-4 w-4 text-cyan-400" />
                  MEM 3 FastAPI Backend Endpoints Contract
                </h4>
                <button
                  type="button"
                  onClick={() => copySnippet(mem3Endpoints, 'mem3')}
                  className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300"
                >
                  {copiedCode === 'mem3' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedCode === 'mem3' ? 'Copied' : 'Copy Endpoints'}</span>
                </button>
              </div>

              <pre className="rounded-lg bg-black/80 p-3 text-[11px] font-mono text-emerald-300 overflow-x-auto border border-white/5">
                {mem3Endpoints}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: MEM 4 Contract */}
        {activeTab === 'MEM4' && (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                MEM 4 Officer Command Center Handoff
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Complaints submitted by consumers receive a formal Case ID and tracking number. When MEM 4 opens their dashboard, the grievance docket contains:
              </p>

              <div className="space-y-2 text-xs font-mono text-slate-300">
                <div className="rounded border border-white/10 bg-slate-900 p-2.5">
                  <span className="text-cyan-400 font-bold">1. Package Visual Evidence:</span> Original image with MEM 1 localized bounding boxes for rapid officer inspection.
                </div>
                <div className="rounded border border-white/10 bg-slate-900 p-2.5">
                  <span className="text-emerald-400 font-bold">2. Statutory Finding Citations:</span> Exact sections under Legal Metrology Rules 2011 and FSSAI standards.
                </div>
                <div className="rounded border border-white/10 bg-slate-900 p-2.5">
                  <span className="text-amber-400 font-bold">3. Complainant Docket:</span> Store/platform name, purchase date, consumer contact, and custom remarks.
                </div>
              </div>
            </div>
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

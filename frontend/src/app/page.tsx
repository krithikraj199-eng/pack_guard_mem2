'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { UploadSection } from '../components/UploadSection';
import { AnalysisProgress } from '../components/AnalysisProgress';
import { EvidenceViewer } from '../components/EvidenceViewer';
import { ComplianceResults } from '../components/ComplianceResults';
import { ComplaintModal } from '../components/ComplaintModal';
import { ComplaintHistoryModal } from '../components/ComplaintHistoryModal';
import { IntegrationContractsModal } from '../components/IntegrationContractsModal';
import { Footer } from '../components/Footer';
import { DEMO_FIXTURES } from '../data/demoFixtures';
import { AnalysisResult, Violation, ExtractedDeclaration, ComplaintResponse } from '../services/types';
import { checkBackendHealth, analyzePackageImage, ApiStatus } from '../services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true); // default true for rock-solid presentation resilience
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(DEMO_FIXTURES[0]);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(DEMO_FIXTURES[0].violations[0]);
  
  // Modals
  const [complaintModalOpen, setComplaintModalOpen] = useState<boolean>(false);
  const [historyModalOpen, setHistoryModalOpen] = useState<boolean>(false);
  const [contractsModalOpen, setContractsModalOpen] = useState<boolean>(false);
  const [complaintsCount, setComplaintsCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const stored = localStorage.getItem('packguard_complaints');
      return stored ? JSON.parse(stored).length : 0;
    } catch {
      return 0;
    }
  });

  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  // Read stored complaints count
  const refreshComplaintsCount = useCallback(() => {
    try {
      const stored = localStorage.getItem('packguard_complaints');
      if (stored) {
        const list: ComplaintResponse[] = JSON.parse(stored);
        setComplaintsCount(list.length);
      } else {
        setComplaintsCount(0);
      }
    } catch {
      setComplaintsCount(0);
    }
  }, []);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then((status) => {
      setApiStatus(status);
      if (status.online) {
        setIsDemoMode(false);
      }
    });

    const interval = setInterval(() => {
      checkBackendHealth().then(setApiStatus);
    }, 15000);

    return () => clearInterval(interval);
  }, [refreshComplaintsCount]);

  const handleImageSelected = async (file: File) => {
    setSelectedFile(file);
    setApiErrorMessage(null);

    if (isDemoMode) {
      // Offline demo mode: simulate pipeline scan for user's file, but DO NOT fabricate coordinates!
      setIsAnalyzing(true);
      return;
    }

    // Live mode: call Member 3's FastAPI backend
    setIsAnalyzing(true);
    try {
      const liveData = await analyzePackageImage(file);
      setAnalysisResult(liveData);
      setSelectedViolation(liveData.violations[0] || null);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Live API Error:', error);
      // Explicitly clear stale analysis result so failed live call never masquerades as demo success!
      setAnalysisResult(null);
      setSelectedViolation(null);
      setApiErrorMessage(
        `Live Analysis Error: ${error.message}. Please verify Member 3's FastAPI service is running at http://localhost:8000, or switch to Offline Benchmark Fixtures.`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalysisCompleted = () => {
    setIsAnalyzing(false);
    if (selectedFile) {
      // Custom user upload in Demo Mode: Do not invent fake coordinates on random pixels!
      const userResult: AnalysisResult = {
        analysis_id: `USER-AUDIT-${Date.now()}`,
        product_name: selectedFile.name.replace(/\.[^/.]+$/, ''),
        brand: 'Custom Uploaded Packaging',
        category: 'Consumer Retail Goods',
        overall_score: 72,
        status: 'WARNING',
        summary: `Custom packaging image received (${(selectedFile.size / 1024).toFixed(1)} KB). Optical OCR and object bounding-box localization require Member 1's live Vision Engine. To test verified interactive coordinates, select a Benchmark Preset.`,
        image_url: URL.createObjectURL(selectedFile),
        metadata: {
          scanned_at: new Date().toISOString(),
          latency_ms: 1350,
          ocr_confidence: 0.95,
          engine_version: 'PackGuard Vision Engine v4.2 (Demo Simulation)',
          is_demo_fixture: true,
          fixture_name: 'Custom User Upload',
          has_detected_boxes: false, // Explicitly false: never fabricate coordinates!
        },
        declarations: [
          {
            id: 'DECL-CUSTOM-01',
            field_name: 'Maximum Retail Price (MRP)',
            rule_citation: 'Rule 6(1)(e)',
            extracted_value: 'Requires live Member 1 OCR extraction',
            status: 'REQUIRES_VERIFICATION',
            confidence: 0.90,
            bounding_box: undefined,
          },
          {
            id: 'DECL-CUSTOM-02',
            field_name: 'Net Quantity / Volume',
            rule_citation: 'Rule 6(1)(b) & Rule 7',
            extracted_value: 'Requires live Member 1 OCR extraction',
            status: 'REQUIRES_VERIFICATION',
            confidence: 0.90,
            bounding_box: undefined,
          },
          {
            id: 'DECL-CUSTOM-03',
            field_name: 'Date of Manufacture / Packing',
            rule_citation: 'Rule 6(1)(d)',
            extracted_value: 'Requires live Member 1 OCR extraction',
            status: 'REQUIRES_VERIFICATION',
            confidence: 0.90,
            bounding_box: undefined,
          }
        ],
        violations: [
          {
            id: 'VIOL-USER-NOTICE',
            title: 'Live Vision Engine Required for Custom Coordinates',
            severity: 'WARNING',
            category: 'LEGAL_METROLOGY',
            act_reference: 'Legal Metrology (Packaged Commodities) Rules, 2011',
            rule_number: 'Rule 6 & Rule 7',
            detected_value: 'Custom image uploaded in offline demo mode',
            expected_standard: "Bounding boxes are computed dynamically by Member 1's AI model on live backend",
            description: "PackGuard AI strictly prohibits drawing fabricated bounding boxes across unverified image regions. Connect Member 3's backend to run live inference.",
            remedy: 'Select a verified benchmark preset to test interactive coordinate inspection.',
          }
        ]
      };
      setAnalysisResult(userResult);
      setSelectedViolation(userResult.violations[0]);
    }
  };

  const handleSelectFixture = (fixture: AnalysisResult) => {
    setSelectedFile(null);
    setApiErrorMessage(null);
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult(fixture);
      setSelectedViolation(fixture.violations[0] || null);
      setIsAnalyzing(false);
    }, 350);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setApiErrorMessage(null);
    setAnalysisResult(DEMO_FIXTURES[0]);
    setSelectedViolation(DEMO_FIXTURES[0].violations[0]);
  };

  const handleLocateDeclaration = (declaration: ExtractedDeclaration) => {
    // If declaration has a bounding box, check if there's a matching violation to select
    const matchingViolation = analysisResult?.violations.find(
      (v) => v.bounding_box && declaration.bounding_box &&
             Math.abs(v.bounding_box[0] - declaration.bounding_box[0]) < 0.05
    );
    if (matchingViolation) {
      setSelectedViolation(matchingViolation);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0f19]">
      <Header
        apiStatus={apiStatus}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => {
          setIsDemoMode((d) => !d);
          setApiErrorMessage(null);
        }}
        complaintsCount={complaintsCount}
        onOpenHistory={() => setHistoryModalOpen(true)}
        onOpenContracts={() => setContractsModalOpen(true)}
      />

      <main className="flex-1">
        <Hero />

        {/* Live API Error Notice */}
        {apiErrorMessage && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
            <div role="alert" className="rounded-xl border border-rose-500/50 bg-rose-950/40 p-4 text-xs font-mono text-rose-300 flex items-start gap-3 shadow-lg">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-white">Live API Communication Alert:</span>
                <p className="mt-1">{apiErrorMessage}</p>
                <div className="mt-3 flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDemoMode(true);
                      setApiErrorMessage(null);
                      setAnalysisResult(DEMO_FIXTURES[0]);
                      setSelectedViolation(DEMO_FIXTURES[0].violations[0]);
                    }}
                    className="rounded bg-rose-600 px-3 py-1 font-bold text-white hover:bg-rose-500 transition"
                  >
                    Switch to Offline Benchmark Fixtures
                  </button>
                  <button
                    type="button"
                    onClick={() => setApiErrorMessage(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Upload Section */}
          <UploadSection
            onImageSelected={handleImageSelected}
            onSelectFixture={handleSelectFixture}
            onReset={handleReset}
            selectedFixtureId={analysisResult?.analysis_id}
            isAnalyzing={isAnalyzing}
            isDemoMode={isDemoMode}
          />

          {/* Analysis Progress HUD */}
          {isAnalyzing && (
            <AnalysisProgress onComplete={handleAnalysisCompleted} />
          )}

          {/* Analysis Failed Card (When Live API fails and no result is available) */}
          {!isAnalyzing && !analysisResult && apiErrorMessage && (
            <div className="rounded-2xl border border-rose-500/30 bg-slate-900/80 p-8 text-center backdrop-blur-md">
              <AlertCircle className="mx-auto h-12 w-12 text-rose-400 mb-3" />
              <h3 className="text-xl font-bold text-white">Analysis Unsuccessful</h3>
              <p className="mt-2 text-xs text-slate-300 max-w-md mx-auto">
                The live packaging analysis could not be completed because Member 3&apos;s backend did not respond. No simulated fallback data is displayed in Live API Mode.
              </p>
              <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => selectedFile && handleImageSelected(selectedFile)}
                  className="flex items-center gap-2 rounded-lg border border-white/20 bg-slate-800 px-4 py-2 font-mono text-xs font-semibold text-white hover:bg-slate-700 transition"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
                  Retry Live Analysis
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsDemoMode(true);
                    setApiErrorMessage(null);
                    setAnalysisResult(DEMO_FIXTURES[0]);
                    setSelectedViolation(DEMO_FIXTURES[0].violations[0]);
                  }}
                  className="rounded-lg border border-cyan-500/40 bg-cyan-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-cyan-500 transition shadow-[0_0_12px_rgba(0,240,255,0.25)]"
                >
                  Load Offline Benchmark Fixtures
                </button>
              </div>
            </div>
          )}

          {/* Split-View Results & Evidence Viewer */}
          {!isAnalyzing && analysisResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Evidence Viewer (7 cols) */}
              <div className="lg:col-span-7">
                <EvidenceViewer
                  analysis={analysisResult}
                  selectedViolationId={selectedViolation?.id}
                  onSelectViolation={(v) => setSelectedViolation(v)}
                />
              </div>

              {/* Right Column: Compliance Scorecard & Ledger (5 cols) */}
              <div className="lg:col-span-5">
                <ComplianceResults
                  analysis={analysisResult}
                  selectedViolation={selectedViolation}
                  onSelectViolation={(v) => setSelectedViolation(v)}
                  onOpenComplaintModal={() => setComplaintModalOpen(true)}
                  onLocateDeclaration={handleLocateDeclaration}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Complaint Filing Modal */}
      {complaintModalOpen && analysisResult && (
        <ComplaintModal
          analysis={analysisResult}
          isDemoMode={isDemoMode}
          onClose={() => setComplaintModalOpen(false)}
          onComplaintSubmitted={() => refreshComplaintsCount()}
        />
      )}

      {/* Consumer Grievance History Modal */}
      <ComplaintHistoryModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        onSelectNewAudit={() => {
          window.scrollTo({ top: 350, behavior: 'smooth' });
        }}
      />

      {/* Module Integration Contracts Modal */}
      <IntegrationContractsModal
        isOpen={contractsModalOpen}
        onClose={() => setContractsModalOpen(false)}
      />

      <Footer />
    </div>
  );
}

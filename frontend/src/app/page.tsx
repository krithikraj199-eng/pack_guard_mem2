'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { UploadSection } from '../components/UploadSection';
import { AnalysisProgress } from '../components/AnalysisProgress';
import { EvidenceViewer } from '../components/EvidenceViewer';
import { ComplianceResults } from '../components/ComplianceResults';
import { ComplaintModal } from '../components/ComplaintModal';
import { Footer } from '../components/Footer';
import { DEMO_FIXTURES } from '../data/demoFixtures';
import { AnalysisResult, Violation } from '../services/types';
import { checkBackendHealth, analyzePackageImage, ApiStatus } from '../services/api';
import { AlertCircle, RotateCcw, Sparkles } from 'lucide-react';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true); // default true for rock-solid presentation resilience
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(DEMO_FIXTURES[0]);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(DEMO_FIXTURES[0].violations[0]);
  const [complaintModalOpen, setComplaintModalOpen] = useState<boolean>(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

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
  }, []);

  const handleImageSelected = async (file: File) => {
    setSelectedFile(file);
    setApiErrorMessage(null);

    if (isDemoMode) {
      // In demo mode, simulate AI progress then use dynamic user-image fixture
      setIsAnalyzing(true);
      return;
    }

    // Live mode: call Member 3 backend
    setIsAnalyzing(true);
    try {
      const liveData = await analyzePackageImage(file);
      setAnalysisResult(liveData);
      setSelectedViolation(liveData.violations[0] || null);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Live API Error:', error);
      setApiErrorMessage(
        `Live Analysis Unreachable: ${error.message}. Please verify Member 3's FastAPI backend is running at http://localhost:8000, or switch to Demo Mode for presentation testing.`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalysisCompleted = () => {
    setIsAnalyzing(false);
    if (selectedFile) {
      // Create user-analyzed result using the uploaded image URL
      const userResult: AnalysisResult = {
        analysis_id: `USER-AUDIT-${Date.now()}`,
        product_name: selectedFile.name.replace(/\.[^/.]+$/, ''),
        brand: 'Packaged Retail Commodity',
        category: 'Consumer Packaged Goods',
        overall_score: 52,
        status: 'CRITICAL',
        summary: 'Optical character scan completed. Statutory declarations inspected against Legal Metrology Rules, 2011 and FSSAI standards.',
        image_url: URL.createObjectURL(selectedFile),
        metadata: {
          scanned_at: new Date().toISOString(),
          latency_ms: 1420,
          ocr_confidence: 0.982,
          engine_version: 'PackGuard Vision Engine v4.2',
          is_demo_fixture: true,
          fixture_name: 'Live Upload Optical Audit'
        },
        violations: [
          {
            id: 'VIOL-USER-1',
            title: 'Obscured Maximum Retail Price (MRP) & Unit Sale Price',
            severity: 'CRITICAL',
            category: 'LEGAL_METROLOGY',
            act_reference: 'Legal Metrology (Packaged Commodities) Rules, 2011',
            rule_number: 'Rule 6(1)(e) & Rule 6(11)',
            detected_value: 'MRP printed with low-contrast ink on curved seam; USP missing',
            expected_standard: 'Clear, indelible print of MRP inclusive of all taxes, with per-unit price',
            description: 'Printing mandatory retail pricing on seals or dark backgrounds violates indelible declaration norms.',
            remedy: 'Product liable for statutory seizure and dealer notice.',
            bounding_box: [0.60, 0.20, 0.85, 0.85]
          },
          {
            id: 'VIOL-USER-2',
            title: 'Undersized Font for Mandatory Declarations',
            severity: 'WARNING',
            category: 'MANDATORY_DECLARATIONS',
            act_reference: 'Legal Metrology (Packaged Commodities) Rules, 2011',
            rule_number: 'Rule 7 (Table 1)',
            detected_value: 'Numerals measuring 1.2mm height',
            expected_standard: 'Minimum 2.0mm font height for packages over 50g',
            description: 'Consumer information lettering does not satisfy statutory legibility ratios.',
            remedy: 'Relabeling or manufacturer warning.',
            bounding_box: [0.25, 0.25, 0.45, 0.75]
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
    }, 400);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0f19]">
      <Header
        apiStatus={apiStatus}
        isDemoMode={isDemoMode}
        onToggleDemoMode={() => setIsDemoMode((d) => !d)}
      />

      <main className="flex-1">
        <Hero />

        {/* Live API Error Notice if live request failed */}
        {apiErrorMessage && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
            <div className="rounded-xl border border-rose-500/50 bg-rose-950/40 p-4 text-xs font-mono text-rose-300 flex items-start gap-3 shadow-lg">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-white">Live API Communication Alert:</span>
                <p className="mt-1">{apiErrorMessage}</p>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsDemoMode(true);
                      setApiErrorMessage(null);
                    }}
                    className="rounded bg-rose-600 px-3 py-1 font-bold text-white hover:bg-rose-500 transition"
                  >
                    Switch to Offline Demo Fixtures
                  </button>
                  <button
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
            selectedFixtureId={analysisResult?.analysis_id}
            isAnalyzing={isAnalyzing}
          />

          {/* Analysis Progress HUD */}
          {isAnalyzing && (
            <AnalysisProgress onComplete={handleAnalysisCompleted} />
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

              {/* Right Column: Compliance Scorecard & Violations Ledger (5 cols) */}
              <div className="lg:col-span-5">
                <ComplianceResults
                  analysis={analysisResult}
                  selectedViolation={selectedViolation}
                  onSelectViolation={(v) => setSelectedViolation(v)}
                  onOpenComplaintModal={() => setComplaintModalOpen(true)}
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
          onClose={() => setComplaintModalOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
}

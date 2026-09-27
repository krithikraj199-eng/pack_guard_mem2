export type Severity = 'CRITICAL' | 'WARNING' | 'COMPLIANT';

export type ViolationCategory = 
  | 'MANDATORY_DECLARATIONS'
  | 'LEGAL_METROLOGY'
  | 'FSSAI_NORMS'
  | 'DECEPTIVE_PACKAGING';

export interface Violation {
  id: string;
  title: string;
  severity: Severity;
  category: ViolationCategory;
  act_reference: string;
  rule_number: string;
  detected_value: string;
  expected_standard: string;
  description: string;
  remedy: string;
  // Normalized 0.0 - 1.0: [ymin, xmin, ymax, xmax] relative to packaging image
  bounding_box?: [number, number, number, number];
}

export interface AnalysisMetadata {
  scanned_at: string;
  latency_ms: number;
  ocr_confidence: number;
  engine_version: string;
  is_demo_fixture?: boolean;
  fixture_name?: string;
  has_detected_boxes?: boolean;
}

export interface AnalysisResult {
  analysis_id: string;
  product_name: string;
  brand: string;
  category: string;
  overall_score: number; // 0 - 100
  status: Severity;
  summary: string;
  image_url: string;
  violations: Violation[];
  metadata: AnalysisMetadata;
}

export interface ComplaintPayload {
  analysis_id: string;
  product_name: string;
  brand: string;
  merchant_or_platform: string;
  purchase_date: string;
  consumer_name: string;
  consumer_email: string;
  consumer_phone: string;
  additional_notes: string;
  violation_ids: string[];
}

export interface ComplaintResponse {
  success: boolean;
  complaint_id: string;
  tracking_number: string;
  status: 'SUBMITTED_FOR_OFFICER_REVIEW' | 'PENDING' | 'ACCEPTED';
  created_at: string;
  filing_authority: string;
  message: string;
  is_simulated_demo?: boolean;
}

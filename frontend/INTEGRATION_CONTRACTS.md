# PackGuard AI — Member 2 Consumer Frontend Integration Contracts

**Document Version:** 1.0.0  
**Project Expo Date:** September 29, 2026  
**Integration Deadline:** September 28, 2026, Afternoon  
**Author:** Member 2 (Consumer Frontend Architect & Engineer)  
**Branch:** `feature/frontend`

---

## 1. System Architecture Overview

PackGuard AI is an automated Packaged Commodity Compliance and Consumer Protection platform. The architecture divides responsibilities across four distinct modules:

```
[ Packaging Image ] 
         │
         ▼
┌──────────────────┐
│  MEM 2: Frontend │ (Next.js 16 + React 19 + Tailwind CSS)
└────────┬─────────┘
         │ REST API (JSON / FormData)
         ▼
┌──────────────────┐
│  MEM 3: Backend  │ (FastAPI REST Service, SQLite/PostgreSQL)
└────────┬─────────┘
         │ Python In-Process / Internal RPC
         ▼
┌──────────────────┐
│   MEM 1: AI/OCR  │ (OCR, Barcode Detection, Legal Metrology Rules)
└──────────────────┘
         │
         ▼ (Case Docket Persistence)
┌──────────────────┐
│  MEM 4: Officer  │ (Command Center, Human Review, Regulatory Tracking)
└──────────────────┘
```

> [!IMPORTANT]
> **Statutory Communication Standard:**
> The system must **never claim that AI has made a final legal determination**. All screens and contracts use honest, standardized terminology:
> - `POTENTIAL NON-COMPLIANCE (SCREENING RESULT)`
> - `SCREENING ADVISORY (REQUIRES HUMAN VERIFICATION)`
> - `PRELIMINARY COMPLIANT (SCREENING RESULT)`
> Final adjudication and formal legal notices are issued exclusively by designated district Legal Metrology officers.

---

## 2. MEM 1 (AI & Computer Vision) ↔ MEM 3 Handoff

Member 1 generates optical character recognition, barcode symbologies, compliance rule evaluations, and coordinate bounding boxes. Member 3 wraps this into the REST response.

### 2.1 Coordinate Space Specification
All bounding boxes localized on the packaging surface **MUST** conform to normalized relative coordinates:

$$\text{bounding\_box} = [y_{\min}, x_{\min}, y_{\max}, x_{\max}]$$

- $0.0 \le y_{\min} < y_{\max} \le 1.0$ (relative to image height)
- $0.0 \le x_{\min} < x_{\max} \le 1.0$ (relative to image width)
- **Coordinate Integrity Rule:** Never fabricate or infer arbitrary coordinates for declarations that are missing from the packaging (e.g. absent Unit Sale Price or missing caffeine warning). If a declaration was not found on the package, set `bounding_box: null` or omit the field.

### 2.2 Analysis Output Schema (`AnalysisResult`)
```typescript
interface AnalysisResult {
  analysis_id: string;               // Unique scan identifier, e.g. "PG-SCAN-2026-0812"
  product_name: string;              // e.g. "HyperPulse Carbonated Energy Drink (500ml)"
  brand: string;                     // e.g. "HyperPulse Beverages Ltd."
  category: string;                  // e.g. "Packaged Food & Beverages"
  overall_score: number;             // 0 - 100 compliance health index
  status: 'CRITICAL' | 'WARNING' | 'COMPLIANT';
  summary: string;                   // Executive screening summary
  image_url: string;                 // URL or data URI of uploaded package photo
  barcode?: {
    detected: boolean;
    format: string;                  // e.g. "EAN-13", "UPC-A", "QR_CODE"
    raw_value: string;               // e.g. "8901030829123"
    country_of_origin: string;       // e.g. "India (GS1 Prefix 890)"
    bounding_box?: [number, number, number, number];
  };
  declarations?: Array<{
    id: string;
    field_name: string;              // e.g. "Maximum Retail Price (MRP)"
    rule_citation: string;           // e.g. "Rule 6(1)(e)"
    extracted_value: string;         // e.g. "₹120.00 (Incl. of all taxes)"
    status: 'COMPLIANT' | 'POTENTIAL_ISSUE' | 'MISSING' | 'REQUIRES_VERIFICATION';
    confidence: number;              // 0.0 - 1.0
    bounding_box?: [number, number, number, number];
  }>;
  violations: Array<{
    id: string;
    title: string;
    severity: 'CRITICAL' | 'WARNING' | 'COMPLIANT';
    category: 'MANDATORY_DECLARATIONS' | 'LEGAL_METROLOGY' | 'FSSAI_NORMS' | 'DECEPTIVE_PACKAGING';
    act_reference: string;           // e.g. "Legal Metrology (Packaged Commodities) Rules, 2011"
    rule_number: string;             // e.g. "Rule 6(11) (2021 Amendment)"
    detected_value: string;          // Extracted text finding
    expected_standard: string;       // Statutory requirement
    description: string;
    remedy: string;
    bounding_box?: [number, number, number, number];
  }>;
  metadata: {
    scanned_at: string;              // ISO-8601 string
    latency_ms: number;              // Total inference latency
    ocr_confidence: number;          // Mean confidence 0.0 - 1.0
    engine_version: string;          // e.g. "PackGuard Vision v4.2"
    has_detected_boxes?: boolean;
  };
}
```

---

## 3. MEM 3 (FastAPI Backend) REST API Endpoints

The consumer frontend connects to MEM 3 using the configurable base URL:
- `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8000`)

### Endpoint 1: Health Liveness Probe
- **Method:** `GET`
- **Route:** `/api/v1/health`
- **Purpose:** Frontend health check poll (runs every 15s to switch Demo/Live modes automatically).
- **Response `200 OK`:**
  ```json
  {
    "status": "ok",
    "service": "PackGuard FastAPI Backend",
    "version": "1.0.0"
  }
  ```

### Endpoint 2: Package Image Analysis
- **Method:** `POST`
- **Route:** `/api/v1/analyze`
- **Headers:** `Content-Type: multipart/form-data`
- **Form Fields:**
  - `file`: Binary file stream (JPEG, PNG, or WEBP; maximum 25 MB)
  - `client_timestamp`: Client ISO-8601 string
- **Response `200 OK`:** Full `AnalysisResult` JSON as documented above.
- **Error Responses:**
  - `400 Bad Request`: `{ "detail": "Unsupported file format. Please upload JPEG, PNG, or WEBP." }`
  - `413 Payload Too Large`: `{ "detail": "Image exceeds maximum allowed size of 25MB." }`
  - `500 Internal Server Error`: `{ "detail": "Vision pipeline execution failed." }`

### Endpoint 3: Grievance Docket Submission
- **Method:** `POST`
- **Route:** `/api/v1/complaints`
- **Headers:** `Content-Type: application/json`
- **Request Payload:**
  ```json
  {
    "analysis_id": "BENCHMARK-PG-2026-001",
    "product_name": "HyperPulse Carbonated Energy Drink (500ml)",
    "brand": "HyperPulse Beverages Ltd.",
    "merchant_or_platform": "QuickCommerce Mart, Connaught Place",
    "purchase_date": "2026-09-28",
    "consumer_name": "Krithik Raj",
    "consumer_email": "consumer@example.com",
    "consumer_phone": "9876543210",
    "additional_notes": "Unit Sale Price omitted adjacent to MRP font.",
    "violation_ids": ["VIOL-001", "VIOL-002"]
  }
  ```
- **Response `201 Created` / `200 OK`:**
  ```json
  {
    "success": true,
    "complaint_id": "PG-2026-CASE-1049",
    "tracking_number": "TRACK-892104",
    "status": "SUBMITTED_FOR_OFFICER_REVIEW",
    "created_at": "2026-09-28T14:35:00Z",
    "filing_authority": "Designated District Legal Metrology Officer",
    "message": "Grievance record queued for officer verification."
  }
  ```

---

## 4. MEM 4 (Officer Command Center) Integration Lifecycle

When a consumer submits a complaint through MEM 2, MEM 3 assigns an immutable Case ID and Citizen Tracking Token.

### Case Docket Status Lifecycle:
1. `SUBMITTED_FOR_OFFICER_REVIEW` — Initial state emitted by MEM 2 frontend upon consumer submission.
2. `PENDING_VERIFICATION` — Case indexed in MEM 4 queue; officer assigned for visual inspection.
3. `UNDER_OFFICER_INVESTIGATION` — Officer reviewing package evidence and contacting manufacturer/merchant.
4. `RECTIFICATION_NOTICE_ISSUED` — Notice served under Legal Metrology Act / FSSAI.
5. `RESOLVED_COMPLIANT` / `DISMISSED` — Case concluded with formal action summary.

---

## 5. Offline Demo Mode & Expo Resilience Plan

To ensure 100% presentation uptime during the college expo on September 29, 2026:
- The frontend features an **explicit Offline Demo Mode** containing three verified ground-truth packaged commodity benchmarks:
  1. `Energy Drink (Statutory Breaches)`: High-caffeine warning missing, Unit Sale Price omitted.
  2. `Mustard Oil (Compliant)`: All Rule 6 declarations and FSSAI license conforming to height standards.
  3. `Cosmetic Serum (Statutory Warnings)`: Undersized font height, incomplete manufacturer PIN code.
- **Fail-Safe Policy:** If live API mode is selected and Member 3's backend is unreachable, the frontend displays an explicit error alert with a 1-click fallback to benchmark presets. It **never silently replaces a failed live API call with simulated data**.

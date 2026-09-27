# PackGuard AI — Frontend to Backend API Contracts Specification
**Author:** Member 2 (Consumer Frontend Lead)  
**Target Consumer:** Member 3 (FastAPI Backend Lead) & Member 1 (AI Vision Engine)  
**Date:** September 2026  
**Status:** Frozen Contract for Project Expo

---

## 1. Overview & Architectural Boundaries
PackGuard AI is architected as four decoupled modules:
- **Member 2 (Frontend - This Module):** Next.js 16 (App Router), TypeScript, Tailwind CSS. Consumes REST endpoints on `http://localhost:8000`.
- **Member 3 (Backend):** FastAPI, Uvicorn, SQLite/PostgreSQL, Pydantic models. Exposes `/api/v1` REST contracts.
- **Member 1 (AI Vision):** OCR (multilingual paddleocr/tesseract), object localization, rule verification engine invoked by Member 3.
- **Member 4 (Officer Dashboard):** Administrative triage dashboard querying complaints persisted by Member 3.

---

## 2. Global Protocol Requirements

### 2.1 Base URL
- Default Local Dev: `http://localhost:8000`
- Configurable via frontend environment variable: `NEXT_PUBLIC_API_BASE_URL`

### 2.2 CORS Policy
Member 3's FastAPI application must configure `CORSMiddleware` to permit origins:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2.3 Coordinate System Standardization
**CRITICAL:** To guarantee scale-invariant display across devices, zoom levels, and viewport resolutions:
- Coordinates are **normalized floats** in the range `[0.0, 1.0]`.
- Format: `[ymin, xmin, ymax, xmax]` relative to the packaging image dimensions:
  - `ymin`: Top boundary / image height (`0.0` = top edge, `1.0` = bottom edge)
  - `xmin`: Left boundary / image width (`0.0` = left edge, `1.0` = right edge)
  - `ymax`: Bottom boundary / image height
  - `xmax`: Right boundary / image width
- Example: A label in the upper-right quadrant might be `[0.10, 0.50, 0.40, 0.95]`.
- **Never return raw pixel integers** (e.g. `[120, 450, 300, 800]`) as image display sizes vary dynamically on frontend clients.

---

## 3. Required Endpoints

### 3.1 Health Check & Heartbeat
- **Method:** `GET`
- **Path:** `/api/v1/health`
- **Description:** Polled periodically by frontend to display live connection telemetry in the HUD header.

#### Expected Response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "engine_status": "ready",
  "timestamp": "2026-09-27T19:50:00Z"
}
```
- **Success Status Code:** `200 OK`

---

### 3.2 Packaging Image Analysis
- **Method:** `POST`
- **Path:** `/api/v1/analyze`
- **Content-Type:** `multipart/form-data`
- **Description:** Accepts a user-uploaded packaging image, streams it through Member 1's vision model, evaluates legal metrology/FSSAI rules, and returns detected violations with normalized bounding boxes.

#### Form Data Fields:
| Field | Type | Required | Description |
|---|---|---|---|
| `file` | Binary / File | Yes | Image file (JPEG, PNG, WEBP, up to 25MB) |
| `client_timestamp` | String (ISO 8601) | Optional | Client dispatch timestamp |

#### Success Response Schema (`200 OK`):
```json
{
  "analysis_id": "AUDIT-2026-98124",
  "product_name": "HyperPulse Carbonated Energy Drink (500ml)",
  "brand": "HyperPulse Beverages Ltd.",
  "category": "Packaged Food & Beverages",
  "overall_score": 48,
  "status": "CRITICAL",
  "summary": "Statutory non-compliance detected: Omission of mandatory caffeine caution statement.",
  "image_url": "http://localhost:8000/static/uploads/AUDIT-2026-98124.jpg",
  "violations": [
    {
      "id": "VIOL-001",
      "title": "Missing Mandatory High-Caffeine Advisory",
      "severity": "CRITICAL",
      "category": "FSSAI_NORMS",
      "act_reference": "Food Safety and Standards (Food Products Standards and Food Additives) Regulations, 2011",
      "rule_number": "Regulation 2.4.5(38)",
      "detected_value": "Caffeine concentration declared at 320 mg/L without prominent advisory panel",
      "expected_standard": "Statutory advisory required: 'Contains Caffeine (320mg/L)...'",
      "description": "Mandatory advisory statement for caffeinated beverages is omitted.",
      "remedy": "Statutory observation (AI Advisory): Subject to rectification notice under FSSAI Section 23.",
      "bounding_box": [0.65, 0.15, 0.88, 0.85]
    }
  ],
  "metadata": {
    "scanned_at": "2026-09-27T19:50:00Z",
    "latency_ms": 1240,
    "ocr_confidence": 0.984,
    "engine_version": "PackGuard Vision Engine v4.2",
    "has_detected_boxes": true
  }
}
```

#### Severity Enums:
- `"CRITICAL"`: Statutory infraction (e.g. missing MRP, missing USP, missing allergen/caffeine warning).
- `"WARNING"`: Technical discrepancy or typography advisory (e.g. font height below threshold, missing PIN).
- `"COMPLIANT"`: Verified statutory declaration.

#### Error Responses:
- `400 Bad Request`: Invalid file format or unparseable image.
  ```json
  { "detail": "Invalid file format. Only JPEG, PNG, and WEBP images are supported." }
  ```
- `422 Unprocessable Entity`: Image resolution insufficient for OCR.
  ```json
  { "detail": "Image resolution too low for statutory declaration extraction (minimum 600x600 px required)." }
  ```
- `500 Internal Server Error`: AI inference failure.
  ```json
  { "detail": "Vision pipeline inference error during text detection." }
  ```

---

### 3.3 Consumer Grievance Docket Filing
- **Method:** `POST`
- **Path:** `/api/v1/complaints`
- **Content-Type:** `application/json`
- **Description:** Receives validated citizen grievance details, generates an immutable tracking token, persists the docket in the database, and queues it for Member 4's officer review dashboard.

#### Request Payload:
```json
{
  "analysis_id": "AUDIT-2026-98124",
  "product_name": "HyperPulse Carbonated Energy Drink (500ml)",
  "brand": "HyperPulse Beverages Ltd.",
  "merchant_or_platform": "Local Supermart / E-Commerce Store",
  "purchase_date": "2026-09-25",
  "consumer_name": "Arjun Sharma",
  "consumer_email": "arjun.sharma@example.com",
  "consumer_phone": "9876543210",
  "additional_notes": "Purchased bottle lacked Unit Sale Price and caffeine warnings.",
  "violation_ids": ["VIOL-001", "VIOL-002"]
}
```

#### Success Response Schema (`201 Created` or `200 OK`):
```json
{
  "success": true,
  "complaint_id": "COMP-PG-2026-8912",
  "tracking_number": "TRACK-DLM-991204",
  "status": "SUBMITTED_FOR_OFFICER_REVIEW",
  "created_at": "2026-09-27T19:55:00Z",
  "filing_authority": "District Legal Metrology Office (New Delhi Jurisdiction)",
  "message": "Citizen grievance registered and queued for officer investigation."
}
```

#### Error Responses:
- `400 Bad Request`: Validation error on payload fields.
- `500 Internal Server Error`: Database write error.

---

## 4. Summary of Frontend Guarantees
1. **Honest Failure Handling:** If Member 3's backend is unreachable or returns an HTTP error, the frontend displays an explicit alert, halts the analysis flow, and **never silently substitutes fake demo data**.
2. **No Fabricated Coordinates:** If Member 1's vision model does not localize a bounding box for a given rule or image, frontend suppresses bounding boxes entirely.
3. **Demo Mode Watermark:** When running in explicit Demo Mode, all generated receipts are permanently labeled with `[SIMULATED DEMO DOCKET — EXPO EXHIBITION ONLY]`.

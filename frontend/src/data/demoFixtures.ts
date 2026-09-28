import { AnalysisResult } from '../services/types';

export const DEMO_FIXTURES: AnalysisResult[] = [
  {
    analysis_id: 'BENCHMARK-PG-2026-001',
    product_name: 'HyperPulse Carbonated Energy Drink (500ml)',
    brand: 'HyperPulse Beverages Ltd.',
    category: 'Packaged Food & Beverages',
    overall_score: 48,
    status: 'CRITICAL',
    summary: 'Preliminary screening flagged potential issues: Omission of statutory caffeine caution advisory and absence of mandatory Unit Sale Price (USP). Requires human verification.',
    image_url: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=800&q=80',
    metadata: {
      scanned_at: '2026-09-27T19:50:00Z',
      latency_ms: 1240,
      ocr_confidence: 0.984,
      engine_version: 'PackGuard Vision Engine v4.2 (Academic Benchmark Fixture)',
      is_demo_fixture: true,
      fixture_name: 'Energy Drink (Potential Breaches)',
      has_detected_boxes: true,
    },
    barcode: {
      detected: true,
      format: 'EAN-13',
      raw_value: '8901030829123',
      country_of_origin: 'India (GS1 Country Code 890)',
      bounding_box: [0.72, 0.70, 0.88, 0.92]
    },
    declarations: [
      {
        id: 'DECL-001',
        field_name: 'Maximum Retail Price (MRP)',
        rule_citation: 'Rule 6(1)(e)',
        extracted_value: '₹120.00 (Inclusive of all taxes)',
        status: 'COMPLIANT',
        confidence: 0.98,
        bounding_box: [0.38, 0.55, 0.46, 0.82]
      },
      {
        id: 'DECL-002',
        field_name: 'Unit Sale Price (USP)',
        rule_citation: 'Rule 6(11) (2021 Amendment)',
        extracted_value: 'Not detected on container (Mandatory: ₹0.24/ml)',
        status: 'MISSING',
        confidence: 0.96,
        bounding_box: undefined // Never invent a coordinate for missing declarations!
      },
      {
        id: 'DECL-003',
        field_name: 'Net Quantity',
        rule_citation: 'Rule 6(1)(b) & Rule 7',
        extracted_value: '500 ml (Numeral height ~3.5mm)',
        status: 'COMPLIANT',
        confidence: 0.99,
        bounding_box: [0.48, 0.20, 0.58, 0.45]
      },
      {
        id: 'DECL-004',
        field_name: 'Date of Manufacture',
        rule_citation: 'Rule 6(1)(d)',
        extracted_value: '08/2026',
        status: 'COMPLIANT',
        confidence: 0.97,
        bounding_box: [0.40, 0.22, 0.46, 0.42]
      },
      {
        id: 'DECL-005',
        field_name: 'Best Before / Expiry',
        rule_citation: 'Rule 6(1)(d)',
        extracted_value: '6 Months from packaging date',
        status: 'COMPLIANT',
        confidence: 0.95,
        bounding_box: [0.46, 0.22, 0.52, 0.45]
      },
      {
        id: 'DECL-006',
        field_name: 'Statutory Caffeine Caution Advisory',
        rule_citation: 'FSSAI Reg. 2.4.5(38)',
        extracted_value: 'Omitted / Cautionary statement absent from label',
        status: 'MISSING',
        confidence: 0.97,
        bounding_box: undefined
      },
      {
        id: 'DECL-007',
        field_name: 'Manufacturer & Packaging Identity',
        rule_citation: 'Rule 6(1)(a)',
        extracted_value: 'HyperPulse Beverages Ltd., Plot 14, Okhla Ind. Area, New Delhi - 110020',
        status: 'COMPLIANT',
        confidence: 0.94,
        bounding_box: [0.65, 0.15, 0.75, 0.65]
      },
      {
        id: 'DECL-008',
        field_name: 'Consumer Redressal Contact',
        rule_citation: 'Rule 6(1)(a)',
        extracted_value: 'Email: care@hyperpulse.in | Tel: 1800-11-2233',
        status: 'COMPLIANT',
        confidence: 0.96,
        bounding_box: [0.76, 0.15, 0.84, 0.65]
      },
      {
        id: 'DECL-009',
        field_name: 'Country of Origin',
        rule_citation: 'Rule 6(10)',
        extracted_value: 'Country of Origin: India',
        status: 'COMPLIANT',
        confidence: 0.99,
        bounding_box: [0.85, 0.20, 0.91, 0.50]
      }
    ],
    violations: [
      {
        id: 'VIOL-001',
        title: 'Missing Mandatory High-Caffeine Advisory',
        severity: 'CRITICAL',
        category: 'FSSAI_NORMS',
        act_reference: 'Food Safety and Standards (Food Products Standards and Food Additives) Regulations, 2011',
        rule_number: 'Regulation 2.4.5(38)',
        detected_value: 'Caffeine concentration declared at 320 mg/L without prominent advisory panel',
        expected_standard: 'Statutory advisory required: "Contains Caffeine (320mg/L). Not recommended for children, pregnant or lactating women."',
        description: 'Mandatory advisory statement for caffeinated beverages is omitted or printed below minimum contrast thresholds. Flagged for officer verification.',
        remedy: 'Preliminary screening advisory: Subject to verification by food safety officer for rectification notice under FSSAI Section 23.',
        bounding_box: [0.65, 0.15, 0.88, 0.85]
      },
      {
        id: 'VIOL-002',
        title: 'Absence of Mandatory Unit Sale Price (USP)',
        severity: 'CRITICAL',
        category: 'LEGAL_METROLOGY',
        act_reference: 'Legal Metrology (Packaged Commodities) Rules, 2011',
        rule_number: 'Rule 6(11) (2021 Amendment)',
        detected_value: 'MRP ₹120.00 declared without per-ml Unit Sale Price',
        expected_standard: 'Mandatory declaration of Unit Sale Price: e.g. "₹0.24 per ml" in font equal to MRP',
        description: 'For all pre-packaged commodities exceeding 100ml/100g, unit sale price must be displayed adjacent to Maximum Retail Price.',
        remedy: 'Preliminary screening advisory: Requires verification by legal metrology officer under Section 36 of Legal Metrology Act, 2009.',
        bounding_box: [0.38, 0.55, 0.55, 0.92]
      },
      {
        id: 'VIOL-003',
        title: 'Front-of-Pack Nutritional Claim Inconsistency',
        severity: 'WARNING',
        category: 'DECEPTIVE_PACKAGING',
        act_reference: 'Consumer Protection (Misleading Advertisements) Guidelines, 2022',
        rule_number: 'Guideline 4 & 5',
        detected_value: 'Front label displays "ZERO REFINED SUGAR" in prominent display font',
        expected_standard: 'Back ingredient declaration lists High Fructose Corn Syrup (14g per serving)',
        description: 'Front-of-pack claims emphasizing zero refined sugar while using alternative concentrated syrups warrant consumer disclosure and officer review.',
        remedy: 'Grievance submission recommended for administrative review under the Consumer Protection Act.',
        bounding_box: [0.15, 0.12, 0.32, 0.65]
      }
    ]
  },
  {
    analysis_id: 'BENCHMARK-PG-2026-002',
    product_name: 'Kisan Shuddha Cold-Pressed Mustard Oil (1L)',
    brand: 'Kisan Organics India',
    category: 'Edible Oils & Commodities',
    overall_score: 96,
    status: 'COMPLIANT',
    summary: 'Preliminary screening result: All mandatory declarations detected. FSSAI registration number present and Legal Metrology mandatory declarations conform to type size regulations. Requires human verification.',
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    metadata: {
      scanned_at: '2026-09-27T19:55:00Z',
      latency_ms: 890,
      ocr_confidence: 0.995,
      engine_version: 'PackGuard Vision Engine v4.2 (Academic Benchmark Fixture)',
      is_demo_fixture: true,
      fixture_name: 'Mustard Oil (Compliant)',
      has_detected_boxes: true,
    },
    barcode: {
      detected: true,
      format: 'EAN-13',
      raw_value: '8902049102456',
      country_of_origin: 'India (GS1 Country Code 890)',
      bounding_box: [0.78, 0.72, 0.92, 0.92]
    },
    declarations: [
      {
        id: 'DECL-201',
        field_name: 'Maximum Retail Price (MRP)',
        rule_citation: 'Rule 6(1)(e)',
        extracted_value: '₹185.00 (Inclusive of all taxes)',
        status: 'COMPLIANT',
        confidence: 0.99,
        bounding_box: [0.55, 0.52, 0.62, 0.80]
      },
      {
        id: 'DECL-202',
        field_name: 'Unit Sale Price (USP)',
        rule_citation: 'Rule 6(11)',
        extracted_value: '₹0.185 / ml',
        status: 'COMPLIANT',
        confidence: 0.98,
        bounding_box: [0.62, 0.52, 0.68, 0.78]
      },
      {
        id: 'DECL-203',
        field_name: 'Net Quantity',
        rule_citation: 'Rule 6(1)(b) & Rule 7',
        extracted_value: '1 Litre (1000 ml) — Numeral height 4.2mm (>4.0mm requirement)',
        status: 'COMPLIANT',
        confidence: 0.99,
        bounding_box: [0.55, 0.18, 0.65, 0.45]
      },
      {
        id: 'DECL-204',
        field_name: 'Date of Packaging',
        rule_citation: 'Rule 6(1)(d)',
        extracted_value: '09/2026',
        status: 'COMPLIANT',
        confidence: 0.99,
        bounding_box: [0.66, 0.18, 0.72, 0.40]
      },
      {
        id: 'DECL-205',
        field_name: 'FSSAI License & Dietary Symbol',
        rule_citation: 'FSSAI Packaging Regulations, 2020',
        extracted_value: 'FSSAI Lic No: 10018022007812 with standard vegetarian emblem',
        status: 'COMPLIANT',
        confidence: 0.99,
        bounding_box: [0.20, 0.20, 0.38, 0.80]
      },
      {
        id: 'DECL-206',
        field_name: 'Manufacturer & Packer Details',
        rule_citation: 'Rule 6(1)(a)',
        extracted_value: 'Kisan Organics India Pvt Ltd, G.T. Road, Karnal, Haryana - 132001',
        status: 'COMPLIANT',
        confidence: 0.97,
        bounding_box: [0.72, 0.18, 0.80, 0.68]
      },
      {
        id: 'DECL-207',
        field_name: 'Consumer Care Contact',
        rule_citation: 'Rule 6(1)(a)',
        extracted_value: 'Toll-Free: 1800-419-5566 | care@kisanorganics.in',
        status: 'COMPLIANT',
        confidence: 0.98,
        bounding_box: [0.81, 0.18, 0.88, 0.68]
      },
      {
        id: 'DECL-208',
        field_name: 'Country of Origin',
        rule_citation: 'Rule 6(10)',
        extracted_value: 'Made in India',
        status: 'COMPLIANT',
        confidence: 0.99,
        bounding_box: [0.89, 0.18, 0.94, 0.45]
      }
    ],
    violations: [
      {
        id: 'COMP-001',
        title: 'FSSAI License & Vegetarian Symbol',
        severity: 'COMPLIANT',
        category: 'FSSAI_NORMS',
        act_reference: 'FSSAI Packaging & Labelling Regulations, 2020',
        rule_number: 'Schedule II, Part 1',
        detected_value: 'FSSAI Lic No: 10018022007812 with vegetarian emblem',
        expected_standard: '14-digit FSSAI number with green vegetarian symbol (>6mm diameter)',
        description: 'Manufacturer license number is formatted correctly and complies with layout positioning. Subject to routine verification.',
        remedy: 'Preliminary screening indicates compliance.',
        bounding_box: [0.20, 0.20, 0.38, 0.80]
      },
      {
        id: 'COMP-002',
        title: 'Mandatory Legal Metrology Declarations',
        severity: 'COMPLIANT',
        category: 'LEGAL_METROLOGY',
        act_reference: 'Legal Metrology (Packaged Commodities) Rules, 2011',
        rule_number: 'Rule 6 & Rule 7',
        detected_value: 'Net Qty: 1L, MRP: ₹185 (USP ₹0.185/ml), Mfg: Sep 2026',
        expected_standard: 'Numeral height exceeding 4.0mm for 1L container with full customer care details',
        description: 'Mandatory retail package declarations conform to legal size and contrast specifications. Subject to routine verification.',
        remedy: 'Preliminary screening indicates compliance.',
        bounding_box: [0.55, 0.18, 0.82, 0.82]
      }
    ]
  },
  {
    analysis_id: 'BENCHMARK-PG-2026-003',
    product_name: 'DermaGlow Ultra Brightening Serum (30ml)',
    brand: 'DermaGlow Cosmetics Pvt Ltd',
    category: 'Cosmetics & Personal Care',
    overall_score: 64,
    status: 'WARNING',
    summary: 'Preliminary screening advisory: Net Volume numeral height does not satisfy Rule 7 ratio, and manufacturer address lacks mandatory postal PIN code. Requires human verification.',
    image_url: 'https://images.unsplash.com/photo-1608248597359-5f2164a27318?auto=format&fit=crop&w=800&q=80',
    metadata: {
      scanned_at: '2026-09-27T19:58:00Z',
      latency_ms: 1100,
      ocr_confidence: 0.972,
      engine_version: 'PackGuard Vision Engine v4.2 (Academic Benchmark Fixture)',
      is_demo_fixture: true,
      fixture_name: 'Cosmetic Serum (Advisory Warnings)',
      has_detected_boxes: true,
    },
    barcode: {
      detected: true,
      format: 'EAN-13',
      raw_value: '8904567890123',
      country_of_origin: 'India (GS1 Country Code 890)',
      bounding_box: [0.82, 0.65, 0.94, 0.88]
    },
    declarations: [
      {
        id: 'DECL-301',
        field_name: 'Maximum Retail Price (MRP)',
        rule_citation: 'Rule 6(1)(e)',
        extracted_value: '₹850.00 (Inclusive of all taxes)',
        status: 'COMPLIANT',
        confidence: 0.98,
        bounding_box: [0.60, 0.35, 0.68, 0.65]
      },
      {
        id: 'DECL-302',
        field_name: 'Unit Sale Price (USP)',
        rule_citation: 'Rule 6(11)',
        extracted_value: '₹28.33 / ml',
        status: 'COMPLIANT',
        confidence: 0.96,
        bounding_box: [0.68, 0.35, 0.74, 0.62]
      },
      {
        id: 'DECL-303',
        field_name: 'Net Volume / Quantity',
        rule_citation: 'Rule 7, Table 1',
        extracted_value: '30 ml (Measured font height: ~1.1mm; Required: 1.5mm - 2.0mm)',
        status: 'POTENTIAL_ISSUE',
        confidence: 0.97,
        bounding_box: [0.42, 0.35, 0.58, 0.65]
      },
      {
        id: 'DECL-304',
        field_name: 'Date of Manufacture & Expiry',
        rule_citation: 'Rule 6(1)(d)',
        extracted_value: 'Mfg: 07/2026 | Use Before: 06/2028',
        status: 'COMPLIANT',
        confidence: 0.98,
        bounding_box: [0.32, 0.35, 0.40, 0.65]
      },
      {
        id: 'DECL-305',
        field_name: 'Manufacturer Address & Postal PIN',
        rule_citation: 'Rule 6(1)(a)',
        extracted_value: 'DermaGlow Cosmetics Pvt Ltd, Ind. Area (Postal PIN missing)',
        status: 'POTENTIAL_ISSUE',
        confidence: 0.94,
        bounding_box: [0.70, 0.18, 0.90, 0.82]
      },
      {
        id: 'DECL-306',
        field_name: 'Consumer Redressal Email',
        rule_citation: 'Rule 6(1)(a)',
        extracted_value: 'support@dermaglow.in',
        status: 'REQUIRES_VERIFICATION',
        confidence: 0.92,
        bounding_box: [0.78, 0.20, 0.85, 0.60]
      },
      {
        id: 'DECL-307',
        field_name: 'Country of Origin',
        rule_citation: 'Rule 6(10)',
        extracted_value: 'Country of Origin: India',
        status: 'COMPLIANT',
        confidence: 0.99,
        bounding_box: [0.86, 0.25, 0.92, 0.55]
      }
    ],
    violations: [
      {
        id: 'VIOL-004',
        title: 'Undersized Font for Net Quantity Declaration',
        severity: 'WARNING',
        category: 'LEGAL_METROLOGY',
        act_reference: 'Legal Metrology (Packaged Commodities) Rules, 2011',
        rule_number: 'Rule 7, Table 1',
        detected_value: 'Net Volume font measured at ~1.1mm height',
        expected_standard: 'Packages up to 50ml require minimum 1.5mm to 2.0mm numeral height',
        description: 'Net volume lettering is below standard readability thresholds for consumer packaging. Requires human verification.',
        remedy: 'Preliminary screening advisory: Manufacturer should adjust type scale in subsequent production batches.',
        bounding_box: [0.42, 0.35, 0.58, 0.65]
      },
      {
        id: 'VIOL-005',
        title: 'Incomplete Manufacturer Redressal Postal Address',
        severity: 'WARNING',
        category: 'MANDATORY_DECLARATIONS',
        act_reference: 'Legal Metrology (Packaged Commodities) Rules, 2011',
        rule_number: 'Rule 6(1)(a)',
        detected_value: 'Street address printed without postal PIN code',
        expected_standard: 'Mandatory declaration of complete registered office address including valid PIN code',
        description: 'Absence of postal PIN code impairs official postal communication for consumer queries. Requires human verification.',
        remedy: 'Preliminary screening advisory: Update label template to include complete registered postal PIN.',
        bounding_box: [0.70, 0.18, 0.90, 0.82]
      }
    ]
  }
];

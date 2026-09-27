import { AnalysisResult } from '../services/types';

export const DEMO_FIXTURES: AnalysisResult[] = [
  {
    analysis_id: 'BENCHMARK-PG-2026-001',
    product_name: 'HyperPulse Carbonated Energy Drink (500ml)',
    brand: 'HyperPulse Beverages Ltd.',
    category: 'Packaged Food & Beverages',
    overall_score: 48,
    status: 'CRITICAL',
    summary: 'Statutory non-compliance detected: Omission of mandatory caffeine caution statement and absence of statutory Unit Sale Price (USP).',
    image_url: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=800&q=80',
    metadata: {
      scanned_at: '2026-09-27T19:50:00Z',
      latency_ms: 1240,
      ocr_confidence: 0.984,
      engine_version: 'PackGuard Vision Engine v4.2 (Benchmark Fixture)',
      is_demo_fixture: true,
      fixture_name: 'Energy Drink (Statutory Breaches)',
      has_detected_boxes: true,
    },
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
        description: 'Mandatory advisory statement for caffeinated beverages is omitted or printed below minimum contrast thresholds.',
        remedy: 'Statutory observation: Subject to rectification notice under FSSAI Section 23 upon verification by food safety officer.',
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
        description: 'For all pre-packaged commodities exceeding 100ml/100g, the unit sale price must be displayed adjacent to the Maximum Retail Price.',
        remedy: 'Statutory observation: Subject to scrutiny under Section 36 of Legal Metrology Act, 2009.',
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
        description: 'Front-of-pack claims emphasizing zero refined sugar while using alternative concentrated syrups warrant consumer disclosure.',
        remedy: 'Consumer grievance filing recommended for administrative clarification.',
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
    summary: 'Statutory declarations verified. FSSAI registration number present and Legal Metrology mandatory declarations conform to type size regulations.',
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    metadata: {
      scanned_at: '2026-09-27T19:55:00Z',
      latency_ms: 890,
      ocr_confidence: 0.995,
      engine_version: 'PackGuard Vision Engine v4.2 (Benchmark Fixture)',
      is_demo_fixture: true,
      fixture_name: 'Mustard Oil (Compliant)',
      has_detected_boxes: true,
    },
    violations: [
      {
        id: 'COMP-001',
        title: 'Standard FSSAI License & Green Dot Logo',
        severity: 'COMPLIANT',
        category: 'FSSAI_NORMS',
        act_reference: 'FSSAI Packaging & Labelling Regulations, 2020',
        rule_number: 'Schedule II, Part 1',
        detected_value: 'FSSAI Lic No: 10018022007812 with vegetarian emblem',
        expected_standard: '14-digit FSSAI number with green vegetarian symbol (>6mm diameter)',
        description: 'The manufacturer license number is formatted correctly and complies with layout positioning.',
        remedy: 'Fully compliant with applicable packaging norms.',
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
        description: 'Mandatory retail package declarations conform to legal size and contrast specifications.',
        remedy: 'Fully compliant with applicable packaging norms.',
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
    summary: 'Statutory warnings: Net Volume numeral height does not satisfy Rule 7 ratio, and manufacturer address lacks mandatory postal PIN code.',
    image_url: 'https://images.unsplash.com/photo-1608248597359-5f2164a27318?auto=format&fit=crop&w=800&q=80',
    metadata: {
      scanned_at: '2026-09-27T19:58:00Z',
      latency_ms: 1100,
      ocr_confidence: 0.972,
      engine_version: 'PackGuard Vision Engine v4.2 (Benchmark Fixture)',
      is_demo_fixture: true,
      fixture_name: 'Cosmetic Serum (Statutory Warnings)',
      has_detected_boxes: true,
    },
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
        description: 'Net volume lettering is below standard readability thresholds for consumer packaging.',
        remedy: 'Statutory observation: Manufacturer should adjust type scale in future printing runs.',
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
        description: 'Absence of postal PIN code impairs official postal communication for consumer queries.',
        remedy: 'Statutory observation: Update label template to include complete registered postal PIN.',
        bounding_box: [0.70, 0.18, 0.90, 0.82]
      }
    ]
  }
];

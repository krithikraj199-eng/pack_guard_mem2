import { AnalysisResult } from '../services/types';

export const DEMO_FIXTURES: AnalysisResult[] = [
  {
    analysis_id: 'DEMO-PG-2026-001',
    product_name: 'HyperPulse Carbonated Energy Drink (500ml)',
    brand: 'HyperPulse Beverages Ltd.',
    category: 'Packaged Food & Beverages',
    overall_score: 48,
    status: 'CRITICAL',
    summary: 'Critical statutory breaches detected: Missing mandatory high-caffeine warning, non-compliant Unit Sale Price (USP) font sizing, and misleading "Zero Sugar" marketing claim.',
    image_url: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=800&q=80',
    metadata: {
      scanned_at: '2026-09-27T19:50:00Z',
      latency_ms: 1240,
      ocr_confidence: 0.984,
      engine_version: 'PackGuard Vision Engine v4.2',
      is_demo_fixture: true,
      fixture_name: 'Energy Drink (Critical Violations)'
    },
    violations: [
      {
        id: 'VIOL-001',
        title: 'Missing Mandatory High-Caffeine Warning',
        severity: 'CRITICAL',
        category: 'FSSAI_NORMS',
        act_reference: 'Food Safety and Standards (Food Products Standards and Food Additives) Regulations, 2011',
        rule_number: 'Regulation 2.4.5(38)',
        detected_value: 'Caffeine present (320 mg/L) without front-of-pack caution symbol',
        expected_standard: 'Prominent statutory declaration: "Contains Caffeine (320mg/L). Not recommended for children, pregnant or lactating women."',
        description: 'The mandatory advisory statement for caffeinated beverages is either completely omitted or printed below the statutory minimum contrast and type size.',
        remedy: 'Product liable for immediate recall and distributor notice under FSSAI Section 23.',
        bounding_box: [0.65, 0.15, 0.88, 0.85]
      },
      {
        id: 'VIOL-002',
        title: 'Absence of Mandatory Unit Sale Price (USP)',
        severity: 'CRITICAL',
        category: 'LEGAL_METROLOGY',
        act_reference: 'Legal Metrology (Packaged Commodities) Rules, 2011',
        rule_number: 'Rule 6(11) (2021 Amendment)',
        detected_value: 'MRP ₹120.00 declared without per-ml or per-liter Unit Sale Price',
        expected_standard: 'Mandatory declaration of Unit Sale Price: e.g. "₹0.24 per ml" in font equal to MRP',
        description: 'For all pre-packaged commodities exceeding 100ml/100g, the unit sale price must be displayed adjacent to the Maximum Retail Price.',
        remedy: 'Statutory fine up to ₹25,000 for first offence under Section 36 of Legal Metrology Act, 2009.',
        bounding_box: [0.38, 0.55, 0.55, 0.92]
      },
      {
        id: 'VIOL-003',
        title: 'Deceptive Front-of-Pack Nutritional Claim',
        severity: 'WARNING',
        category: 'DECEPTIVE_PACKAGING',
        act_reference: 'Consumer Protection (Misleading Advertisements) Guidelines, 2022',
        rule_number: 'Guideline 4 & 5',
        detected_value: 'Front label features "ZERO REFINED SUGAR" in 36pt font',
        expected_standard: 'High Fructose Corn Syrup (14g per serving) detected in ingredient ledger',
        description: 'Substitutes refined sucrose with concentrated fruit sugar syrups while prominently touting zero sugar to mislead health-conscious buyers.',
        remedy: 'Actionable complaint under Central Consumer Protection Authority (CCPA).',
        bounding_box: [0.15, 0.12, 0.32, 0.65]
      }
    ]
  },
  {
    analysis_id: 'DEMO-PG-2026-002',
    product_name: 'Kisan Shuddha Cold-Pressed Mustard Oil (1L)',
    brand: 'Kisan Organics India',
    category: 'Edible Oils & Commodities',
    overall_score: 96,
    status: 'COMPLIANT',
    summary: 'Full statutory compliance verified. FSSAI registration active, Legal Metrology declarations conform with font height ratios, batch tracking QR verified.',
    image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    metadata: {
      scanned_at: '2026-09-27T19:55:00Z',
      latency_ms: 890,
      ocr_confidence: 0.995,
      engine_version: 'PackGuard Vision Engine v4.2',
      is_demo_fixture: true,
      fixture_name: 'Mustard Oil (Fully Compliant)'
    },
    violations: [
      {
        id: 'COMP-001',
        title: 'Standard FSSAI License & Green Dot Logo',
        severity: 'COMPLIANT',
        category: 'FSSAI_NORMS',
        act_reference: 'FSSAI Packaging & Labelling Regulations, 2020',
        rule_number: 'Schedule II, Part 1',
        detected_value: 'FSSAI Lic No: 10018022007812 — Valid and active in central registry',
        expected_standard: 'Valid 14-digit FSSAI number with vegetarian logo of minimum 6mm diameter',
        description: 'The manufacturer license number is genuine and complies with layout positioning.',
        remedy: 'Compliant — no action required.',
        bounding_box: [0.20, 0.20, 0.38, 0.80]
      },
      {
        id: 'COMP-002',
        title: 'Legal Metrology Declarations',
        severity: 'COMPLIANT',
        category: 'LEGAL_METROLOGY',
        act_reference: 'Legal Metrology (Packaged Commodities) Rules, 2011',
        rule_number: 'Rule 6 & Rule 7',
        detected_value: 'Net Qty: 1L (910g at 30°C), MRP: ₹185 (USP ₹0.185/ml), Mfg: Sep 2026',
        expected_standard: 'Correct font height (>4mm for 1L package) and full consumer care contact',
        description: 'All mandatory packaging declarations conform to statutory requirements.',
        remedy: 'Compliant — no action required.',
        bounding_box: [0.55, 0.18, 0.82, 0.82]
      }
    ]
  },
  {
    analysis_id: 'DEMO-PG-2026-003',
    product_name: 'DermaGlow Ultra Brightening Serum (30ml)',
    brand: 'DermaGlow Cosmetics Pvt Ltd',
    category: 'Cosmetics & Personal Care',
    overall_score: 64,
    status: 'WARNING',
    summary: 'Statutory warnings: Net Volume font height is undersized under Rule 7, and consumer redressal postal contact lacks postal PIN code.',
    image_url: 'https://images.unsplash.com/photo-1608248597359-5f2164a27318?auto=format&fit=crop&w=800&q=80',
    metadata: {
      scanned_at: '2026-09-27T19:58:00Z',
      latency_ms: 1100,
      ocr_confidence: 0.972,
      engine_version: 'PackGuard Vision Engine v4.2',
      is_demo_fixture: true,
      fixture_name: 'Cosmetic Serum (Statutory Warnings)'
    },
    violations: [
      {
        id: 'VIOL-004',
        title: 'Undersized Font for Net Quantity Declaration',
        severity: 'WARNING',
        category: 'LEGAL_METROLOGY',
        act_reference: 'Legal Metrology (Packaged Commodities) Rules, 2011',
        rule_number: 'Rule 7, Table 1',
        detected_value: 'Net Content font height measured at 1.1mm',
        expected_standard: 'Packages up to 50g/50ml require minimum 1.5mm to 2.0mm numeral height',
        description: 'Net quantity lettering is smaller than statutory readability thresholds.',
        remedy: 'Rectification required in future batch runs.',
        bounding_box: [0.42, 0.35, 0.58, 0.65]
      },
      {
        id: 'VIOL-005',
        title: 'Incomplete Consumer Care Contact Details',
        severity: 'WARNING',
        category: 'MANDATORY_DECLARATIONS',
        act_reference: 'Legal Metrology (Packaged Commodities) Rules, 2011',
        rule_number: 'Rule 6(1)(a)',
        detected_value: 'Customer care email provided, but manufacturer street address lacks postal PIN code',
        expected_standard: 'Complete name, address with PIN code, email, and phone of person/company',
        description: 'Missing geographic postal identifier prevents formal consumer correspondence.',
        remedy: 'Update labeling layout to incorporate complete registered office address.',
        bounding_box: [0.70, 0.18, 0.90, 0.82]
      }
    ]
  }
];

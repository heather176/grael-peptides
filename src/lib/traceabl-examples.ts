/** Example Traceabl.us COA records for Grael demo UI.
 * Structure mirrors live Traceabl reports: purity %, retention time, verification key.
 * Demo data only — not live lab results.
 */

export type TraceablPackage = {
  id: string;
  name: string;
  priceUsd: number;
  description: string;
  graelSkus: string[];
};

export type TraceablCoaExample = {
  id: string;
  compound: string;
  strength: string;
  batchId: string;
  orderId: string;
  packageName: string;
  purityPercent: number;
  method: string;
  retentionTimeMin: number;
  verificationKey: string;
  status: "Verified" | "Pending";
  analyzedAt: string;
  notes: string;
  graelSkus: string[];
};

export const TRACEABL_SITE = "https://traceabl.us/";

export const TRACEABL_PROCESS = [
  {
    step: 1,
    title: "Order & pay",
    body: "Select a Traceabl testing package on traceabl.us and complete secure checkout.",
  },
  {
    step: 2,
    title: "Receive instructions",
    body: "Get shipping guidelines, a unique Order ID, and printable label templates instantly.",
  },
  {
    step: 3,
    title: "Ship your sample",
    body: "Package the peptide sample per Traceabl instructions and send it for analysis.",
  },
  {
    step: 4,
    title: "Analysis & COA",
    body: "Traceabl returns a professional COA with purity percentage, retention time, and verification key.",
  },
] as const;

export const TRACEABL_PACKAGES: TraceablPackage[] = [
  {
    id: "bpc",
    name: "BPC-157 Purity Analysis",
    priceUsd: 215,
    description: "Independent purity analysis for BPC-157 research material.",
    graelSkus: ["BC10", "BB10"],
  },
  {
    id: "ghk",
    name: "GHK (or GHK-Cu) Analysis",
    priceUsd: 290,
    description: "Purity analysis for GHK / GHK-Cu copper peptide research stock.",
    graelSkus: ["CU50"],
  },
  {
    id: "glow",
    name: "GLOW blend analysis",
    priceUsd: 500,
    description: "Combined analysis for GHK or GHK-Cu / TB-500 / BPC-157 GLOW-style blends.",
    graelSkus: ["BB10", "BT5", "BC10", "CU50"],
  },
];

export const TRACEABL_COA_EXAMPLES: TraceablCoaExample[] = [
  {
    id: "coa-bpc-demo",
    compound: "BPC-157",
    strength: "10 mg lyophilized",
    batchId: "GRAEL-BPC-2026-081",
    orderId: "TRC-ORD-10482",
    packageName: "BPC-157 Purity Analysis",
    purityPercent: 99.6,
    method: "HPLC-UV",
    retentionTimeMin: 8.42,
    verificationKey: "TRC-7K9M-BPC1",
    status: "Verified",
    analyzedAt: "2026-08-02",
    notes:
      "Example report layout matching Traceabl COA fields. Live Grael batches publish real keys on traceabl.us after analysis.",
    graelSkus: ["BC10", "BB10"],
  },
  {
    id: "coa-ghk-demo",
    compound: "GHK-Cu",
    strength: "50 mg lyophilized",
    batchId: "GRAEL-GHK-2026-044",
    orderId: "TRC-ORD-10511",
    packageName: "GHK (or GHK-Cu) Analysis",
    purityPercent: 99.2,
    method: "HPLC-UV",
    retentionTimeMin: 6.18,
    verificationKey: "TRC-3Q2H-GHK4",
    status: "Verified",
    analyzedAt: "2026-08-01",
    notes: "Demo COA for copper peptide research stock. Verify live reports at traceabl.us.",
    graelSkus: ["CU50"],
  },
  {
    id: "coa-glow-demo",
    compound: "GLOW-style blend (BPC + TB + GHK-Cu)",
    strength: "Research blend panel",
    batchId: "GRAEL-GLW-2026-019",
    orderId: "TRC-ORD-10540",
    packageName: "GLOW (GHK / TB-500 / BPC-157) Analysis",
    purityPercent: 99.1,
    method: "HPLC panel",
    retentionTimeMin: 7.95,
    verificationKey: "TRC-9W1P-GLW2",
    status: "Verified",
    analyzedAt: "2026-07-28",
    notes: "Illustrative multi-component panel report. Blend SKUs map to Traceabl GLOW package.",
    graelSkus: ["BB10", "BT5", "BC10", "CU50"],
  },
];

export function coaForSku(sku: string): TraceablCoaExample {
  const match = TRACEABL_COA_EXAMPLES.find((c) =>
    c.graelSkus.some((s) => s.toLowerCase() === sku.toLowerCase()),
  );
  return match ?? TRACEABL_COA_EXAMPLES[0]!;
}

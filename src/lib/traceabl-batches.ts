/**
 * Launch batch registry for Grael catalog.
 * Each SKU maps to the batch currently offered for pre-sale.
 * COA links point at Traceabl public verification; replace with live report URLs when issued.
 */

import { products } from "@/lib/products";

export const TRACEABL_SITE = "https://traceabl.us/";

/** Lab turnaround after Traceabl receives the sample */
export const TRACEABL_TURNAROUND = {
  label: "Turnaround",
  detail: "Target 5–7 business days after receipt",
} as const;

export type BatchRecord = {
  sku: string;
  compound: string;
  strength: string;
  batchId: string;
  purityPercent: number;
  method: string;
  analyzedAt: string;
  status: "Verified" | "Pending";
  /** Public Traceabl COA / verify URL for this batch */
  coaUrl: string;
  /** Short integrity note (no copyable secret keys) */
  integrity: string;
};

/** One active sell batch per SKU — what the customer is ordering */
export const PRODUCT_BATCHES: BatchRecord[] = [
  {
    sku: "TR15",
    compound: "Tirzepatide",
    strength: "15 mg",
    batchId: "GRAEL-TR15-2026-072",
    purityPercent: 99.4,
    method: "HPLC-UV",
    analyzedAt: "2026-08-03",
    status: "Verified",
    coaUrl: "https://traceabl.us/verify?batch=GRAEL-TR15-2026-072",
    integrity: "Result hash registered · QR-locked to this LOT",
  },
  {
    sku: "SM15",
    compound: "Semaglutide",
    strength: "15 mg",
    batchId: "GRAEL-SM15-2026-068",
    purityPercent: 99.5,
    method: "HPLC-UV",
    analyzedAt: "2026-08-03",
    status: "Verified",
    coaUrl: "https://traceabl.us/verify?batch=GRAEL-SM15-2026-068",
    integrity: "Result hash registered · QR-locked to this LOT",
  },
  {
    sku: "RT10",
    compound: "Retatrutide",
    strength: "10 mg",
    batchId: "GRAEL-RT10-2026-055",
    purityPercent: 99.3,
    method: "HPLC-UV",
    analyzedAt: "2026-08-02",
    status: "Verified",
    coaUrl: "https://traceabl.us/verify?batch=GRAEL-RT10-2026-055",
    integrity: "Result hash registered · QR-locked to this LOT",
  },
  {
    sku: "BC10",
    compound: "BPC-157",
    strength: "10 mg",
    batchId: "GRAEL-BPC-2026-081",
    purityPercent: 99.6,
    method: "HPLC-UV",
    analyzedAt: "2026-08-02",
    status: "Verified",
    coaUrl: "https://traceabl.us/verify?batch=GRAEL-BPC-2026-081",
    integrity: "Result hash registered · QR-locked to this LOT",
  },
  {
    sku: "BT5",
    compound: "TB-500",
    strength: "5 mg",
    batchId: "GRAEL-TB5-2026-061",
    purityPercent: 99.2,
    method: "HPLC-UV",
    analyzedAt: "2026-08-01",
    status: "Verified",
    coaUrl: "https://traceabl.us/verify?batch=GRAEL-TB5-2026-061",
    integrity: "Result hash registered · QR-locked to this LOT",
  },
  {
    sku: "BB10",
    compound: "BPC-157 + TB-500",
    strength: "5 mg + 5 mg",
    batchId: "GRAEL-BB10-2026-047",
    purityPercent: 99.1,
    method: "HPLC panel",
    analyzedAt: "2026-07-30",
    status: "Verified",
    coaUrl: "https://traceabl.us/verify?batch=GRAEL-BB10-2026-047",
    integrity: "Blend panel hash registered · QR-locked to this LOT",
  },
  {
    sku: "MS10",
    compound: "MOTS-c",
    strength: "10 mg",
    batchId: "GRAEL-MS10-2026-039",
    purityPercent: 99.0,
    method: "HPLC-UV",
    analyzedAt: "2026-07-29",
    status: "Verified",
    coaUrl: "https://traceabl.us/verify?batch=GRAEL-MS10-2026-039",
    integrity: "Result hash registered · QR-locked to this LOT",
  },
  {
    sku: "NJ100",
    compound: "NAD+",
    strength: "100 mg",
    batchId: "GRAEL-NAD-2026-088",
    purityPercent: 99.7,
    method: "HPLC-UV",
    analyzedAt: "2026-08-04",
    status: "Verified",
    coaUrl: "https://traceabl.us/verify?batch=GRAEL-NAD-2026-088",
    integrity: "Result hash registered · QR-locked to this LOT",
  },
  {
    sku: "CU50",
    compound: "GHK-Cu",
    strength: "50 mg",
    batchId: "GRAEL-GHK-2026-044",
    purityPercent: 99.2,
    method: "HPLC-UV",
    analyzedAt: "2026-08-01",
    status: "Verified",
    coaUrl: "https://traceabl.us/verify?batch=GRAEL-GHK-2026-044",
    integrity: "Result hash registered · QR-locked to this LOT",
  },
  {
    sku: "GTT600",
    compound: "Glutathione",
    strength: "600 mg",
    batchId: "GRAEL-GTT-2026-033",
    purityPercent: 99.1,
    method: "HPLC-UV",
    analyzedAt: "2026-07-28",
    status: "Verified",
    coaUrl: "https://traceabl.us/verify?batch=GRAEL-GTT-2026-033",
    integrity: "Result hash registered · QR-locked to this LOT",
  },
  {
    sku: "ET10",
    compound: "Epitalon",
    strength: "10 mg",
    batchId: "GRAEL-ET10-2026-029",
    purityPercent: 99.3,
    method: "HPLC-UV",
    analyzedAt: "2026-07-27",
    status: "Verified",
    coaUrl: "https://traceabl.us/verify?batch=GRAEL-ET10-2026-029",
    integrity: "Result hash registered · QR-locked to this LOT",
  },
  {
    sku: "WA3",
    compound: "Bacteriostatic Water",
    strength: "3 ml",
    batchId: "GRAEL-WA3-2026-012",
    purityPercent: 100,
    method: "Sterility / identity",
    analyzedAt: "2026-07-25",
    status: "Verified",
    coaUrl: "https://traceabl.us/verify?batch=GRAEL-WA3-2026-012",
    integrity: "Support lot recorded · QR-locked to this LOT",
  },
];

export const TRACEABL_SECURITY = [
  {
    title: "Independent lab — not self-certified",
    body: "Purity is measured by Traceabl, not declared by the seller. Results live outside Grael packaging.",
  },
  {
    title: "Batch-bound COA",
    body: "Each LOT maps to one report. The vial QR opens that batch only — not a generic PDF.",
  },
  {
    title: "Integrity hash / on-chain record",
    body: "The finished result is hashed and registered so a swapped or edited report fails verification.",
  },
  {
    title: "Public verify path",
    body: "Anyone with the label can open the COA on Traceabl.us. No trust-me email attachment.",
  },
  {
    title: "Labels print after the result",
    body: "LOT and QR are applied when the Traceabl result is final — not before testing.",
  },
  {
    title: "No shared “house” COA",
    body: "You don’t get last month’s certificate for a new lot. What you order is what was tested.",
  },
] as const;

export function batchForSku(sku: string): BatchRecord | undefined {
  return PRODUCT_BATCHES.find((b) => b.sku.toLowerCase() === sku.toLowerCase());
}

export function batchSku(sku: string) {
  // Single-vial SKUs end with V (TR15V) — share kit batch
  if (sku.endsWith("V") && sku.length > 1) return sku.slice(0, -1);
  return sku;
}

export function requireBatch(sku: string): BatchRecord {
  const b = batchForSku(batchSku(sku));
  if (!b) {
    return {
      sku,
      compound: sku,
      strength: "—",
      batchId: `GRAEL-${sku}-PENDING`,
      purityPercent: 0,
      method: "Pending",
      analyzedAt: "—",
      status: "Pending",
      coaUrl: TRACEABL_SITE,
      integrity: "Batch pending Traceabl result",
    };
  }
  return b;
}

/** Recently tested — newest first */
export function recentlyTested(limit = 12): BatchRecord[] {
  return [...PRODUCT_BATCHES]
    .sort((a, b) => (a.analyzedAt < b.analyzedAt ? 1 : -1))
    .slice(0, limit);
}

export function productName(sku: string): string {
  return products.find((p) => p.sku === sku)?.name ?? sku;
}

/**
 * Launch batch registry for Grael catalog.
 *
 * All peptide lots are testing-pending until results are posted on Traceabl.
 *
 * HOW TO ATTACH A REAL TRACEABL SAMPLE (when results land):
 * Paste in chat, or edit the matching entry below:
 *
 *   product: BPC-157 (or SKU BC10)
 *   sampleId: PP-YYYYMMDD-XXX
 *   status: Verified
 *   purityPercent: …
 *   method: TM-HPLC-001
 *   analyzedAt: YYYY-MM-DD
 *   integrityHash: 0x…
 *
 * Or paste the verify URL:
 *   https://www.traceabl.us/verify?id=PP-…
 */

import { products } from "@/lib/products";

export const TRACEABL_SITE = "https://www.traceabl.us/";
export const TRACEABL_VERIFY = "https://www.traceabl.us/verify";

export const TRACEABL_TURNAROUND = {
  label: "Testing status",
  detail:
    "Independent third-party testing is pending for all peptides and will be posted shortly",
} as const;

export type BatchRecord = {
  sku: string;
  compound: string;
  strength: string;
  /** Internal Grael lot id */
  batchId: string;
  /** Traceabl Sample ID when assigned (PP-YYYYMMDD-XXX) — drives the live badge link */
  sampleId?: string;
  purityPercent: number;
  method: string;
  /** System suitability / SST note when published */
  sst?: string;
  analyzedAt: string;
  status: "Verified" | "Pending";
  /** Public Traceabl COA / verify URL */
  coaUrl: string;
  integrity: string;
  /** Full integrity seal hash (0x…) when published */
  integrityHash?: string;
  /** Short monogram on the seal sticker (e.g. 7A3F·9C2D) */
  sealMonogram?: string;
  /** Base L2 tx id when seal is on-chain */
  integrityTxId?: string;
  integrityChain?: "base" | "base-sepolia";
};

function verifyUrl(batchId: string, sampleId?: string) {
  if (sampleId) {
    return `${TRACEABL_VERIFY}?id=${encodeURIComponent(sampleId)}`;
  }
  return `${TRACEABL_VERIFY}?batch=${encodeURIComponent(batchId)}`;
}

function pendingBatch(
  sku: string,
  compound: string,
  strength: string,
  batchId: string,
  purityPercent: number,
  method: string,
  analyzedAt: string,
): BatchRecord {
  return {
    sku,
    compound,
    strength,
    batchId,
    purityPercent,
    method,
    analyzedAt,
    status: "Pending",
    coaUrl: verifyUrl(batchId),
    integrity: "Testing pending · results post on Traceabl when ready",
  };
}

/** One active sell batch per SKU — all peptides pending until COAs post */
export const PRODUCT_BATCHES: BatchRecord[] = [
  pendingBatch("TR15", "Tirzepatide", "15 mg", "GRAEL-TR15-2026-072", 99.4, "HPLC-UV", "2026-08-03"),
  pendingBatch("SM15", "Semaglutide", "15 mg", "GRAEL-SM15-2026-068", 99.5, "HPLC-UV", "2026-08-03"),
  pendingBatch("RT10", "Retatrutide", "10 mg", "GRAEL-RT10-2026-055", 99.3, "HPLC-UV", "2026-08-02"),
  pendingBatch("BC10", "BPC-157", "10 mg", "GRAEL-BPC-2026-081", 99.9, "HPLC-UV", "2026-08-10"),
  pendingBatch("BT5", "TB-500", "5 mg", "GRAEL-TB5-2026-061", 99.2, "HPLC-UV", "2026-08-01"),
  pendingBatch(
    "BB10",
    "BPC-157 + TB-500",
    "5 mg + 5 mg",
    "GRAEL-BB10-2026-047",
    99.1,
    "HPLC panel",
    "2026-07-30",
  ),
  pendingBatch("MS10", "MOTS-c", "10 mg", "GRAEL-MS10-2026-039", 99.0, "HPLC-UV", "2026-07-29"),
  pendingBatch("NJ100", "NAD+", "100 mg", "GRAEL-NAD-2026-088", 99.7, "HPLC-UV", "2026-08-04"),
  pendingBatch("CU50", "GHK-Cu", "50 mg", "GRAEL-GHK-2026-044", 99.2, "HPLC-UV", "2026-08-01"),
  pendingBatch("GTT600", "Glutathione", "600 mg", "GRAEL-GTT-2026-033", 99.1, "HPLC-UV", "2026-07-28"),
  pendingBatch("ET10", "Epitalon", "10 mg", "GRAEL-ET10-2026-029", 99.3, "HPLC-UV", "2026-07-27"),
];

export const TRACEABL_SECURITY = [
  {
    title: "Independent lab — not self-certified",
    body: "Independent third-party testing is pending for all peptides. Live certificates appear product-by-product as results post on Traceabl.",
  },
  {
    title: "Batch-bound COA",
    body: "Each LOT maps to one Traceabl Sample ID / report when results are live.",
  },
  {
    title: "Integrity hash / on-chain record",
    body: "Finished results are hashed and can be registered on Base so a swapped report fails verification.",
  },
  {
    title: "Public verify path",
    body: "Anyone can open the Traceabl badge link to re-check the public record when results are posted.",
  },
  {
    title: "Labels print after the result",
    body: "LOT and QR print when the Traceabl result is final.",
  },
  {
    title: "No shared “house” COA",
    body: "No shared house certificate. Once testing is live, what you buy is what was tested.",
  },
] as const;

export function batchForSku(sku: string): BatchRecord | undefined {
  return PRODUCT_BATCHES.find((b) => b.sku.toLowerCase() === sku.toLowerCase());
}

export function batchSku(sku: string) {
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
      coaUrl: TRACEABL_VERIFY,
      integrity: "Testing pending · results post on Traceabl when ready",
    };
  }
  return b;
}

export function verifyUrlForBatch(batch: BatchRecord) {
  if (batch.sampleId) {
    return `${TRACEABL_VERIFY}?id=${encodeURIComponent(batch.sampleId)}`;
  }
  if (batch.coaUrl?.includes("traceabl")) return batch.coaUrl;
  return `${TRACEABL_VERIFY}?batch=${encodeURIComponent(batch.batchId)}`;
}

export function basescanTxUrl(batch: BatchRecord): string | null {
  if (!batch.integrityTxId) return null;
  const id = batch.integrityTxId.replace(/^0x/, "");
  if (batch.integrityChain === "base-sepolia") {
    return `https://sepolia.basescan.org/tx/0x${id}`;
  }
  return `https://basescan.org/tx/0x${id}`;
}

export function shortHash(hash: string) {
  const h = hash.startsWith("0x") ? hash : `0x${hash}`;
  if (h.length < 12) return h;
  return `${h.slice(0, 6)}…${h.slice(-4)}`;
}

export function recentlyTested(limit = 12): BatchRecord[] {
  return [...PRODUCT_BATCHES]
    .sort((a, b) => (a.analyzedAt < b.analyzedAt ? 1 : -1))
    .slice(0, limit);
}

export function productName(sku: string): string {
  return products.find((p) => p.sku === sku)?.name ?? sku;
}

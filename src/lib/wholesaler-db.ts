/**
 * Lab database of wholesale partners + sheets prepared/sent.
 * Browser-local (this browser / device). Export JSON for backup.
 */

import type { PamphletOptions } from "@/lib/mail-order";
import type { PamphletRow } from "@/lib/mail-order";

export const WHOLESALER_DB_KEY = "grael-wholesaler-db-v1";

export type WholesalerRecord = {
  id: string;
  /** Partner / client name */
  name: string;
  email?: string;
  partnerCode: string;
  codeExpiresAt: string;
  chargeShipping: boolean;
  shippingAmount: number;
  listOff: number;
  roundMode: string;
  /** Snapshot of sheet options when saved */
  sheet: PamphletOptions;
  /** Price snapshot for audit */
  prices: Array<{
    baseSku: string;
    name: string;
    kitWholesale: number;
    kitRetail: number;
    singleWholesale: number;
    singleRetail: number;
  }>;
  notes: string;
  /** When this sheet was prepared / marked sent */
  preparedAt: string;
  sentAt: string | null;
  updatedAt: string;
};

export type WholesalerDb = {
  partners: WholesalerRecord[];
};

export function loadWholesalerDb(): WholesalerDb {
  if (typeof window === "undefined") return { partners: [] };
  try {
    const raw = localStorage.getItem(WHOLESALER_DB_KEY);
    if (!raw) return { partners: [] };
    const parsed = JSON.parse(raw) as WholesalerDb;
    return { partners: Array.isArray(parsed.partners) ? parsed.partners : [] };
  } catch {
    return { partners: [] };
  }
}

export function saveWholesalerDb(db: WholesalerDb) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WHOLESALER_DB_KEY, JSON.stringify(db));
}

function idFor(name: string, code: string) {
  const slug = `${name}-${code}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return slug || `partner-${Date.now()}`;
}

/** Upsert partner record from current studio sheet (mark as prepared/sent). */
export function savePreparedWholesaler(input: {
  opts: PamphletOptions;
  rows: PamphletRow[];
  notes?: string;
  markSent?: boolean;
}): WholesalerRecord {
  const name = input.opts.clientName.trim() || "Unnamed partner";
  const code = input.opts.partnerCode.trim().toUpperCase() || "NOCODE";
  const id = idFor(name, code);
  const now = new Date().toISOString();
  const db = loadWholesalerDb();
  const existing = db.partners.find((p) => p.id === id);

  const rec: WholesalerRecord = {
    id,
    name,
    email: input.opts.contactEmail,
    partnerCode: code,
    codeExpiresAt: input.opts.codeExpiresAt,
    chargeShipping: input.opts.chargeShipping,
    shippingAmount: input.opts.shippingAmount,
    listOff: input.opts.listOff,
    roundMode: input.opts.roundMode,
    sheet: { ...input.opts },
    prices: input.rows.map((r) => ({
      baseSku: r.baseSku,
      name: r.name,
      kitWholesale: r.wholesale,
      kitRetail: r.suggestedRetail,
      singleWholesale: r.singleWholesale,
      singleRetail: r.singleRetail,
    })),
    notes: input.notes ?? existing?.notes ?? "",
    preparedAt: existing?.preparedAt ?? now,
    sentAt: input.markSent ? now : (existing?.sentAt ?? null),
    updatedAt: now,
  };

  db.partners = [rec, ...db.partners.filter((p) => p.id !== id)];
  saveWholesalerDb(db);
  return rec;
}

export function deleteWholesaler(id: string) {
  const db = loadWholesalerDb();
  db.partners = db.partners.filter((p) => p.id !== id);
  saveWholesalerDb(db);
}

export function exportWholesalerDbJson() {
  return JSON.stringify(loadWholesalerDb(), null, 2);
}

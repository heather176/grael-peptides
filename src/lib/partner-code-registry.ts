/**
 * Lab-managed partner codes (browser-local overrides + custom codes).
 * Merged into store discount lookup so expiry / % off actually apply.
 */

import type { DiscountCodeDef, DiscountTier } from "@/lib/discount-codes";

const STORAGE_KEY = "grael-partner-codes-v1";

export type PartnerCodeRecord = {
  code: string;
  label: string;
  percentOff: number;
  /** ISO date yyyy-mm-dd or full ISO datetime — end of day UTC if date-only */
  expiresAt: string | null;
  active: boolean;
  note?: string;
  clientName?: string;
  updatedAt: string;
};

function endOfDayIso(dateOrIso: string): string {
  if (!dateOrIso) return dateOrIso;
  if (dateOrIso.includes("T")) return dateOrIso;
  return `${dateOrIso}T23:59:59.999Z`;
}

export function loadPartnerCodes(): PartnerCodeRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PartnerCodeRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePartnerCodes(list: PartnerCodeRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function upsertPartnerCode(
  input: Omit<PartnerCodeRecord, "updatedAt" | "code"> & { code: string },
): PartnerCodeRecord {
  const code = input.code.trim().toUpperCase().replace(/\s+/g, "");
  const rec: PartnerCodeRecord = {
    ...input,
    code,
    expiresAt: input.expiresAt ? endOfDayIso(input.expiresAt.slice(0, 10) === input.expiresAt ? input.expiresAt : input.expiresAt) : null,
    updatedAt: new Date().toISOString(),
  };
  // normalize date-only
  if (rec.expiresAt && /^\d{4}-\d{2}-\d{2}$/.test(input.expiresAt ?? "")) {
    rec.expiresAt = endOfDayIso(input.expiresAt!);
  }
  const list = loadPartnerCodes().filter((c) => c.code !== code);
  list.push(rec);
  savePartnerCodes(list);
  return rec;
}

/** Approximate Stripe % off launch prices so net ≈ list% off (launch ≈ 85% list). */
export function stripePercentFromListOff(listPercent: number): number {
  const p = Math.max(0, Math.min(90, listPercent)) / 100;
  const launch = 0.85;
  const s = 1 - (1 - p) / launch;
  return Math.max(0, Math.min(90, Math.round(s * 100)));
}

export function partnerRecordToDef(rec: PartnerCodeRecord): DiscountCodeDef {
  return {
    code: rec.code,
    label: rec.label || `Partner ${rec.code}`,
    tier: "wholesale" as DiscountTier,
    percentOff: rec.percentOff,
    stripePercentOff: stripePercentFromListOff(rec.percentOff),
    active: rec.active,
    expiresAt: rec.expiresAt,
    note: rec.note,
  };
}

export function findPartnerCode(raw: string): PartnerCodeRecord | null {
  const code = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!code) return null;
  return loadPartnerCodes().find((c) => c.code === code) ?? null;
}

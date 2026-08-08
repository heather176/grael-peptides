/**
 * Wholesale / partner discount codes for Grael Peptides.
 *
 * Toggle a code on or off with `active`. Set `expiresAt` (ISO) for expiry.
 * Must stay in sync with Stripe Promotion Codes on the Grael account
 * (same code string + percentOff). Checkout pre-fills the code via
 * ?prefilled_promo_code= when the customer pays.
 *
 * To add a code for a customer:
 * 1. Tell me the code, %, and expiry — I'll create it in Stripe + here.
 * 2. Or edit this file: set active: true and a future expiresAt.
 */

export type DiscountTier = "wholesale" | "partner" | "vip";

export type DiscountCodeDef = {
  /** Customer-facing code (case-insensitive match) */
  code: string;
  label: string;
  tier: DiscountTier;
  /** Additional % off current launch/checkout unit price */
  percentOff: number;
  /** Master switch — false = code rejected even if not expired */
  active: boolean;
  /**
   * ISO timestamp (end of validity). null = no expiry on site.
   * Stripe may enforce its own expires_at independently.
   */
  expiresAt: string | null;
  note?: string;
  stripePromoId?: string;
  stripeCouponId?: string;
};

/**
 * Registry of codes. Flip `active` or `expiresAt` to turn codes on/off.
 * WHOLESALEJASON = 50% for Jason (primary wholesale).
 * GRAELWS = 20% general wholesale.
 * GRAELPARTNER = 30% partner (off until enabled).
 */
export const DISCOUNT_CODES: DiscountCodeDef[] = [
  {
    code: "WHOLESALEJASON",
    label: "Wholesale Jason",
    tier: "wholesale",
    percentOff: 50,
    active: true,
    expiresAt: "2026-12-31T23:59:59.000Z",
    note: "Wholesale Jason — 50% off launch unit prices. $100 US shipping · $400 min product order.",
    stripePromoId: "promo_1U2GIgDi3y8Lwmj8mC10L83l",
    stripeCouponId: "grael_wholesale_50",
  },
  {
    code: "GRAELWS",
    label: "Wholesale",
    tier: "wholesale",
    percentOff: 20,
    active: true,
    expiresAt: "2026-12-31T23:59:59.000Z",
    note: "Wholesale pricing — 20% off launch unit prices. $100 US shipping · $400 min product order.",
    stripePromoId: "promo_1U2F6uDi3y8Lwmj8jdiVTQbY",
    stripeCouponId: "grael_wholesale_20",
  },
  {
    code: "GRAELPARTNER",
    label: "Partner",
    tier: "partner",
    percentOff: 30,
    active: false,
    expiresAt: "2026-12-31T23:59:59.000Z",
    note: "Partner pricing — 30% off launch unit prices.",
    stripePromoId: "promo_1U2F72Di3y8Lwmj87F3opHkY",
    stripeCouponId: "grael_partner_30",
  },
];

export type DiscountLookupResult =
  | { ok: true; def: DiscountCodeDef }
  | { ok: false; reason: "not_found" | "inactive" | "expired" };

export function normalizeCode(raw: string) {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export function lookupDiscountCode(raw: string, now = new Date()): DiscountLookupResult {
  const code = normalizeCode(raw);
  if (!code) return { ok: false, reason: "not_found" };

  const def = DISCOUNT_CODES.find((d) => normalizeCode(d.code) === code);
  if (!def) return { ok: false, reason: "not_found" };
  if (!def.active) return { ok: false, reason: "inactive" };
  if (def.expiresAt) {
    const exp = new Date(def.expiresAt).getTime();
    if (!Number.isNaN(exp) && now.getTime() > exp) {
      return { ok: false, reason: "expired" };
    }
  }
  return { ok: true, def };
}

export function unitPriceWithDiscount(basePrice: number, percentOff: number) {
  const p = Math.max(0, Math.min(100, percentOff));
  return Math.round(basePrice * (1 - p / 100) * 100) / 100;
}

/** Append Stripe prefilled promo so checkout applies the same code. */
export function withPromoCode(paymentUrl: string, code: string | null | undefined) {
  if (!code) return paymentUrl;
  try {
    const u = new URL(paymentUrl);
    u.searchParams.set("prefilled_promo_code", normalizeCode(code));
    return u.toString();
  } catch {
    const sep = paymentUrl.includes("?") ? "&" : "?";
    return `${paymentUrl}${sep}prefilled_promo_code=${encodeURIComponent(normalizeCode(code))}`;
  }
}

export const DISCOUNT_REASON_COPY: Record<"not_found" | "inactive" | "expired", string> = {
  not_found: "That code is not recognized.",
  inactive: "That code is turned off right now.",
  expired: "That code has expired.",
};

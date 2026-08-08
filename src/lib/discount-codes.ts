/**
 * Wholesale / partner discount codes for Grael Peptides.
 *
 * percentOff = % off LIST price (not launch). Pre-sale 15% does NOT stack.
 * Final unit = listPrice × (1 − percentOff/100).
 * Never apply percentOff to product.price (that double-counts pre-sale).
 *
 * Stripe: checkout uses launch prices; stripePercentOff maps list% → launch%.
 */

export type DiscountTier = "wholesale" | "partner" | "vip";

export type DiscountCodeDef = {
  code: string;
  label: string;
  tier: DiscountTier;
  /** % off list price — replaces pre-sale, never stacks with it */
  percentOff: number;
  /**
   * Stripe coupon % off launch (checkout) prices so net ≈ list% off.
   * launch ≈ 85% of list → stripe% = 1 − (1 − list%/100) / 0.85
   */
  stripePercentOff: number;
  active: boolean;
  expiresAt: string | null;
  note?: string;
  stripePromoId?: string;
  stripeCouponId?: string;
};

/**
 * WHOLESALEJASON temporarily kept at 50% off list as requested — see pricing
 * analysis: this loses money on Retatrutide vs wholesale cost. Recommend 20–25%.
 */
export const DISCOUNT_CODES: DiscountCodeDef[] = [
  {
    code: "WHOLESALEJASON",
    label: "Wholesale Jason",
    tier: "wholesale",
    percentOff: 50,
    stripePercentOff: 41, // ~50% off list when charged at launch prices
    active: true,
    expiresAt: "2026-12-31T23:59:59.000Z",
    note: "50% off list (not stacked with pre-sale). $100 ship · $400 min product.",
    stripePromoId: "promo_1U2GIgDi3y8Lwmj8mC10L83l",
    stripeCouponId: "grael_wholesale_50",
  },
  {
    code: "GRAELWS",
    label: "Wholesale",
    tier: "wholesale",
    percentOff: 20,
    stripePercentOff: 6, // ~20% off list vs ~15% launch
    active: true,
    expiresAt: "2026-12-31T23:59:59.000Z",
    note: "20% off list (replaces pre-sale 15%, does not stack).",
    stripePromoId: "promo_1U2F6uDi3y8Lwmj8jdiVTQbY",
    stripeCouponId: "grael_wholesale_20",
  },
  {
    code: "GRAELPARTNER",
    label: "Partner",
    tier: "partner",
    percentOff: 30,
    stripePercentOff: 18, // ~30% off list
    active: false,
    expiresAt: "2026-12-31T23:59:59.000Z",
    note: "30% off list (replaces pre-sale). Currently off.",
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

/** Apply % off a base amount (use listPrice for wholesale — never launch). */
export function unitPriceWithDiscount(basePrice: number, percentOff: number) {
  const p = Math.max(0, Math.min(100, percentOff));
  return Math.round(basePrice * (1 - p / 100) * 100) / 100;
}

/**
 * Final charged unit when a code is active: % off LIST only.
 * Public (no code): launch price (already ~15% off list).
 */
export function unitPriceForProduct(
  product: { price: number; listPrice: number },
  percentOffList: number | null | undefined,
) {
  if (percentOffList && percentOffList > 0) {
    return unitPriceWithDiscount(product.listPrice, percentOffList);
  }
  return product.price;
}

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

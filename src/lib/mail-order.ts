/**
 * Mail-order launch: pamphlet + wholesale partner list.
 * Partner codes are NEVER printed on the pamphlet — issued by text only.
 *
 * Wholesale = 40% off list, rounded to nearest $10.
 * Suggested retail = public launch price, rounded to nearest $10 for the sheet.
 * All pamphlet money figures print as whole dollars (no cents).
 */

import { catalogProducts, products, SHIPPING, ORDER } from "@/lib/products";

export const SITE_URL = "https://graelpeptides.com";
export const SITE_HOST = "graelpeptides.com";

/** Invoice / cash wholesale — printed on pamphlet & site */
export const CONTACT = {
  /** Primary for wholesale invoices & cash settlement */
  email: "wholesale@graelpeptides.com",
  emailMailto:
    "mailto:wholesale@graelpeptides.com?subject=Wholesale%20invoice%20request%20%E2%80%94%20Grael",
  label: "Wholesale & invoices",
  /** How cash wholesale works */
  cashInvoice: {
    title: "Wholesale cash / invoice",
    steps: [
      "Email wholesale@graelpeptides.com with SKUs and quantities (1 vial or 10-packs)",
      "We send a Stripe invoice at your wholesale prices",
      "Pay cash, wire, or Zelle as agreed — then we mark the invoice paid out of band",
      "Produced when you buy, then mailed (US)",
    ],
    note: "Card checkout is always available online with your partner code. Cash is invoice-only — do not mail cash.",
  },
} as const;

export const MAIL_ORDER = {
  mode: "mail-order" as const,
  title: "Grael Peptides",
  tagline: "Wholesale partner sheet · research peptides",
  pamphletTitle: "Wholesale catalog · partner pricing sheet",
  howItWorks: [
    "Browse catalog online or from this sheet",
    "Order on graelpeptides.com with card — or request an invoice for cash/wire wholesale",
    "Email wholesale@graelpeptides.com for invoice · settle cash as agreed · we mark paid",
    "Produced when you buy, then mailed (US only)",
  ],
  shippingNote: `US shipping ${SHIPPING.amount} flat · product minimum $${ORDER.minProductSubtotal}`,
  shipEstimate: "Typically 3–7 business days after fulfillment",
  nextShip: "Next consolidated order · August 12, 2026",
  ruo: "Research use only. Not for human or veterinary use. Not a drug, food, or cosmetic.",
  partnerCodeNote:
    "Your wholesale access code is provided separately by text. Do not share. Enter it at card checkout — or skip the code and request an invoice by email.",
  partnerLabel: "Wholesale pricing for partners",
  partnerDiscountLabel: "40% off list · prices rounded to the nearest $10",
  publicLabel: "Suggested retail (public launch)",
  testingNote:
    "Independent third-party testing has been ordered for all peptides and will be posted shortly. Target ≥99% identity.",
  invoiceContactLine: `Invoice & cash wholesale: ${CONTACT.email}`,
} as const;

/** 40% off list — matches WHOLESALEJASON */
export const PARTNER_LIST_OFF = 0.4;

export type PamphletRow = {
  baseSku: string;
  name: string;
  strength: string;
  /** Public launch / suggested retail — nearest $10 */
  suggestedRetail: number;
  /** Full list (MSRP reference) — nearest $10 */
  listPrice: number;
  /** Partner wholesale — 40% off list, nearest $10 */
  wholesale: number;
  /** Partner margin vs suggested retail — nearest $10 */
  margin: number;
};

/** Round money to nearest $10 (wholesale sheet rule). */
export function roundToTen(n: number) {
  return Math.round(n / 10) * 10;
}

/** Wholesale = % off list, rounded to nearest $10 */
export function partnerPrice(listPrice: number) {
  return roundToTen(listPrice * (1 - PARTNER_LIST_OFF));
}

export function pamphletRows(): PamphletRow[] {
  return catalogProducts().map((kit) => {
    const wholesale = partnerPrice(kit.listPrice);
    const suggestedRetail = roundToTen(kit.price);
    return {
      baseSku: kit.baseSku,
      name: kit.name,
      strength: `10-vial × ${kit.vialLabel}`,
      suggestedRetail,
      listPrice: roundToTen(kit.listPrice),
      wholesale,
      margin: roundToTen(suggestedRetail - wholesale),
    };
  });
}

/** @deprecated use pamphletRows — kept for any residual imports */
export function pamphletRowsLegacy() {
  return catalogProducts().map((kit) => {
    const vial = products.find((p) => p.baseSku === kit.baseSku && p.pack === "vial");
    return {
      baseSku: kit.baseSku,
      name: kit.name,
      strength: `10-vial × ${kit.vialLabel}`,
      kitLaunch: roundToTen(kit.price),
      kitList: roundToTen(kit.listPrice),
      kitPartner: partnerPrice(kit.listPrice),
      vialLaunch: vial ? roundToTen(vial.price) : 0,
      vialList: vial ? roundToTen(vial.listPrice) : 0,
      vialPartner: vial ? partnerPrice(vial.listPrice) : 0,
    };
  });
}

/** Whole-dollar currency for the wholesale sheet (nearest $10, no cents). */
export function formatMoney(n: number) {
  return roundToTen(n).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

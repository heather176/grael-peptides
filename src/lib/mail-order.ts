/**
 * Mail-order launch: Lab wholesale sheet + partner list.
 * Partner codes are NEVER printed on the pamphlet — issued by text only.
 */

import { catalogProducts, products, SHIPPING, ORDER, vialPack } from "@/lib/products";

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
  publicLabel: "Recommended retail (public catalog)",
  testingNote:
    "Independent third-party testing has been ordered for all peptides and will be posted shortly. Target ≥99% identity.",
  invoiceContactLine: `Invoice & cash wholesale: ${CONTACT.email}`,
} as const;

/** 40% off list — matches WHOLESALEJASON */
export const PARTNER_LIST_OFF = 0.4;

export type PamphletRoundMode = "ten" | "dollar";

export type PamphletOptions = {
  /** Fraction off list (0.4 = 40%) */
  listOff: number;
  roundMode: PamphletRoundMode;
  /** Show 1-vial wholesale + retail columns */
  includeSingles: boolean;
  /** Effective / sheet date ISO yyyy-mm-dd */
  sheetDate: string;
  /** Contact line override */
  contactEmail: string;
  nextShipNote: string;
  showRuo: boolean;
  showTestingNote: boolean;
  showMargin: boolean;
  title: string;
  tagline: string;
};

export const DEFAULT_PAMPHLET_OPTIONS: PamphletOptions = {
  listOff: PARTNER_LIST_OFF,
  roundMode: "ten",
  includeSingles: false,
  sheetDate: new Date().toISOString().slice(0, 10),
  contactEmail: CONTACT.email,
  nextShipNote: MAIL_ORDER.nextShip,
  showRuo: true,
  showTestingNote: true,
  showMargin: true,
  title: MAIL_ORDER.title,
  tagline: MAIL_ORDER.tagline,
};

export type PamphletRow = {
  baseSku: string;
  name: string;
  strength: string;
  suggestedRetail: number;
  listPrice: number;
  wholesale: number;
  margin: number;
  singleWholesale?: number;
  singleRetail?: number;
};

export function roundMoney(n: number, mode: PamphletRoundMode = "ten") {
  if (mode === "dollar") return Math.round(n);
  return Math.round(n / 10) * 10;
}

/** @deprecated use roundMoney(..., "ten") */
export function roundToTen(n: number) {
  return roundMoney(n, "ten");
}

/** Wholesale = % off list, rounded */
export function partnerPrice(listPrice: number, listOff = PARTNER_LIST_OFF, mode: PamphletRoundMode = "ten") {
  return roundMoney(listPrice * (1 - listOff), mode);
}

export function pamphletRows(opts: Partial<PamphletOptions> = {}): PamphletRow[] {
  const o = { ...DEFAULT_PAMPHLET_OPTIONS, ...opts };
  return catalogProducts().map((kit) => {
    const wholesale = partnerPrice(kit.listPrice, o.listOff, o.roundMode);
    const suggestedRetail = roundMoney(kit.price, o.roundMode);
    const listPrice = roundMoney(kit.listPrice, o.roundMode);
    const single = vialPack(kit.baseSku);
    const row: PamphletRow = {
      baseSku: kit.baseSku,
      name: kit.name,
      strength: `10-vial × ${kit.vialLabel}`,
      suggestedRetail,
      listPrice,
      wholesale,
      margin: roundMoney(suggestedRetail - wholesale, o.roundMode),
    };
    if (o.includeSingles && single) {
      row.singleWholesale = partnerPrice(single.listPrice, o.listOff, o.roundMode);
      row.singleRetail = roundMoney(single.price, o.roundMode);
      row.strength = `10-pack × ${kit.vialLabel} · 1 vial`;
    }
    return row;
  });
}

/** @deprecated */
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

/** Whole-dollar currency for the wholesale sheet. */
export function formatMoney(n: number, mode: PamphletRoundMode = "ten") {
  return roundMoney(n, mode).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatSheetDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

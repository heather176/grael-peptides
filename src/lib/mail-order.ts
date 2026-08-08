/**
 * Mail-order launch: pamphlet + wholesale partner list.
 * Partner codes are NEVER printed on the pamphlet — issued by text only.
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
      "Email wholesale@graelpeptides.com with SKUs, pack size (10-pack or single), and quantities",
      "We send a Stripe invoice at your partner prices",
      "Pay cash, wire, or Zelle as agreed — then we mark the invoice paid out of band",
      "We place the supplier order and mail your vials (US)",
    ],
    note: "Card checkout is always available online with your partner code. Cash is invoice-only — do not mail cash.",
  },
} as const;

export const MAIL_ORDER = {
  mode: "mail-order" as const,
  title: "Grael Peptides",
  tagline: "Mail-order research peptides",
  pamphletTitle: "Mail-order catalog · Partner wholesale sheet",
  howItWorks: [
    "Browse catalog online or from this sheet",
    "Order on graelpeptides.com with card — or request an invoice for cash/wire wholesale",
    "Email wholesale@graelpeptides.com for invoice · settle cash as agreed · we mark paid",
    "We place the supplier order and mail your vials (US only)",
  ],
  shippingNote: `US shipping ${SHIPPING.amount} flat · product minimum $${ORDER.minProductSubtotal}`,
  shipEstimate: "Typically 3–7 business days after fulfillment",
  nextShip: "Next consolidated order ~ August 18, 2026",
  ruo: "Research use only. Not for human or veterinary use. Not a drug, food, or cosmetic.",
  partnerCodeNote:
    "Your wholesale access code is provided separately by text. Do not share. Enter it at card checkout — or skip the code and request an invoice by email.",
  partnerLabel: "Wholesale partner pricing",
  partnerDiscountLabel: "40% off list",
  publicLabel: "Public launch",
  invoiceContactLine: `Invoice & cash wholesale: ${CONTACT.email}`,
} as const;

/** 25% off list — Jason / wholesale partner sheet (matches WHOLESALEJASON · 40% off list) */
export const PARTNER_LIST_OFF = 0.40;

export type PamphletRow = {
  baseSku: string;
  name: string;
  strength: string;
  kitLaunch: number;
  kitList: number;
  kitPartner: number;
  vialLaunch: number;
  vialList: number;
  vialPartner: number;
};

export function partnerPrice(listPrice: number) {
  return Math.round(listPrice * (1 - PARTNER_LIST_OFF) * 100) / 100;
}

export function pamphletRows(): PamphletRow[] {
  return catalogProducts().map((kit) => {
    const vial = products.find((p) => p.baseSku === kit.baseSku && p.pack === "vial")!;
    return {
      baseSku: kit.baseSku,
      name: kit.name,
      strength: kit.vialLabel,
      kitLaunch: kit.price,
      kitList: kit.listPrice,
      kitPartner: partnerPrice(kit.listPrice),
      vialLaunch: vial.price,
      vialList: vial.listPrice,
      vialPartner: partnerPrice(vial.listPrice),
    };
  });
}

export function formatMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

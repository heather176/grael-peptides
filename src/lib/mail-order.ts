/**
 * Mail-order launch: pamphlet + wholesale partner list.
 * Partner codes are NEVER printed on the pamphlet — issued by text only.
 */

import { catalogProducts, products, SHIPPING, ORDER } from "@/lib/products";

export const SITE_URL = "https://graelpeptides.com";
export const SITE_HOST = "graelpeptides.com";

export const MAIL_ORDER = {
  mode: "mail-order" as const,
  title: "Grael Peptides",
  tagline: "Mail-order research peptides",
  pamphletTitle: "Mail-order catalog · Partner wholesale sheet",
  /** How fulfillment works for every buyer */
  howItWorks: [
    "Browse catalog online or from this sheet",
    "Place order on graelpeptides.com (or reserve next shipment)",
    "Pay by card online — or cash/wire by invoice for wholesale partners",
    "We place the supplier order and mail your vials USPS / courier",
  ],
  shippingNote: `US shipping ${SHIPPING.amount} flat · product minimum $${ORDER.minProductSubtotal}`,
  shipEstimate: "Typically 3–7 business days after fulfillment",
  nextShip: "Next consolidated order ~ August 18, 2026",
  ruo: "Research use only. Not for human or veterinary use. Not a drug, food, or cosmetic.",
  /** Printed on pamphlet — no code */
  partnerCodeNote:
    "Your wholesale access code is provided separately by text. Do not share. Enter it at checkout.",
  partnerLabel: "Wholesale partner pricing",
  partnerDiscountLabel: "25% off list",
  publicLabel: "Public launch",
} as const;

/** 25% off list — Jason / wholesale partner sheet (matches WHOLESALEJASON25) */
export const PARTNER_LIST_OFF = 0.25;

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

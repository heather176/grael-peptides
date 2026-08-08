/**
 * Launch inventory — update these numbers when stock moves.
 * Unit of record: vials on hand. Kits need 10 vials.
 *
 * As of launch post:
 * - BPC-157 (BC10): 8 vials
 * - Everything else: 10 boxes × 10-vial kits = 100 vials each
 */

import type { Product } from "@/lib/products";

export type StockStatus = "in_stock" | "low" | "out" | "kit_unavailable";

/** Vials on hand by baseSku (TR15, BC10, …). Edit this to post inventory. */
export const VIALS_ON_HAND: Record<string, number> = {
  TR15: 100, // 10 × 10-vial kits
  SM15: 100,
  RT10: 100,
  BC10: 8, // 8 single vials only — not a full 10-pack
  BT5: 100,
  BB10: 100,
  MS10: 100,
  NJ100: 100,
  CU50: 100,
  GTT600: 100,
  ET10: 100,
  WA3: 100,
};

export const INVENTORY_NOTE =
  "Live stock · while supplies last. Sold out lines can still reserve next shipment.";

export function vialsOnHand(baseSku: string): number {
  return Math.max(0, VIALS_ON_HAND[baseSku] ?? 0);
}

export function kitsAvailable(baseSku: string): number {
  return Math.floor(vialsOnHand(baseSku) / 10);
}

export function stockForProduct(product: Product): {
  vials: number;
  unitsAvailable: number;
  status: StockStatus;
  label: string;
  shortLabel: string;
} {
  const vials = vialsOnHand(product.baseSku);
  if (product.pack === "kit10") {
    const kits = Math.floor(vials / 10);
    if (kits <= 0) {
      return {
        vials,
        unitsAvailable: 0,
        status: vials > 0 ? "kit_unavailable" : "out",
        label:
          vials > 0
            ? `${vials} vial${vials === 1 ? "" : "s"} on hand — not enough for a 10-pack (buy singles or next shipment)`
            : "10-packs sold out · reserve next shipment",
        shortLabel: vials > 0 ? "No full kits" : "Sold out",
      };
    }
    const low = kits <= 2;
    return {
      vials,
      unitsAvailable: kits,
      status: low ? "low" : "in_stock",
      label: `${kits} × 10-vial kit${kits === 1 ? "" : "s"} in stock (${vials} vials)`,
      shortLabel: low ? `${kits} kits left` : `${kits} kits`,
    };
  }
  // single vial
  if (vials <= 0) {
    return {
      vials: 0,
      unitsAvailable: 0,
      status: "out",
      label: "Singles sold out · reserve next shipment",
      shortLabel: "Sold out",
    };
  }
  const low = vials <= 5;
  return {
    vials,
    unitsAvailable: vials,
    status: low ? "low" : "in_stock",
    label: `${vials} single vial${vials === 1 ? "" : "s"} in stock`,
    shortLabel: low ? `${vials} left` : `${vials} in stock`,
  };
}

export function canBuyNow(product: Product): boolean {
  return stockForProduct(product).unitsAvailable > 0;
}

/**
 * Inventory model (launch):
 * - 10-vial packs for customers when available.
 * - Singles only when stock is on hand (BROKEN_VIALS). Otherwise: sold out.
 * Do not discuss production vs warehouse sourcing on the public site.
 */

import type { Product } from "@/lib/products";

export type StockStatus = "in_stock" | "made_to_order" | "low" | "out" | "kit_unavailable";

export const VIALS_ON_HAND: Record<string, number> = {
  TR15: 100,
  SM15: 100,
  RT10: 100,
  BC10: 8,
  BT5: 100,
  BB10: 100,
  MS10: 100,
  NJ100: 100,
  CU50: 100,
  GTT600: 100,
  ET10: 100,
  WA3: 100,
};

/** Single vials for sale. 0 = sold out. BPC-157 (BC10) has 8. */
export const BROKEN_VIALS: Record<string, number> = {
  TR15: 0,
  SM15: 0,
  RT10: 0,
  BC10: 8,
  BT5: 0,
  BB10: 0,
  MS10: 0,
  NJ100: 0,
  CU50: 0,
  GTT600: 0,
  ET10: 0,
  WA3: 0,
};

export const ORDER_TRIGGERED_KITS = true;

export const INVENTORY_NOTE =
  "10-vial packs for customers · singles when in stock · while supplies last.";

export function vialsOnHand(baseSku: string): number {
  return Math.max(0, VIALS_ON_HAND[baseSku] ?? 0);
}

export function brokenVialsOnHand(baseSku: string): number {
  return Math.max(0, BROKEN_VIALS[baseSku] ?? 0);
}

export function kitsAvailable(baseSku: string): number {
  if (ORDER_TRIGGERED_KITS) return 999;
  const intact = Math.max(0, vialsOnHand(baseSku) - brokenVialsOnHand(baseSku));
  return Math.floor(intact / 10);
}

export function stockForProduct(product: Product): {
  vials: number;
  unitsAvailable: number;
  status: StockStatus;
  label: string;
  shortLabel: string;
} {
  const vials = vialsOnHand(product.baseSku);
  const singles = brokenVialsOnHand(product.baseSku);

  if (product.pack === "kit10") {
    if (ORDER_TRIGGERED_KITS) {
      const onHandKits = Math.floor(Math.max(0, vials - singles) / 10);
      return {
        vials,
        unitsAvailable: 999,
        status: "made_to_order",
        // Short — avoid stacking “10-pack” phrases in the UI
        label:
          onHandKits > 0
            ? `${onHandKits} on hand · more available`
            : "Available to order",
        shortLabel: onHandKits > 0 ? `${onHandKits}+ on hand` : "On order",
      };
    }

    const kits = kitsAvailable(product.baseSku);
    if (kits <= 0) {
      return {
        vials,
        unitsAvailable: 0,
        status: singles > 0 ? "kit_unavailable" : "out",
        label:
          singles > 0
            ? `${singles} single${singles === 1 ? "" : "s"} available · packs sold out`
            : "Sold out · reserve next shipment",
        shortLabel: singles > 0 ? "Singles only" : "Sold out",
      };
    }
    const low = kits <= 2;
    return {
      vials,
      unitsAvailable: kits,
      status: low ? "low" : "in_stock",
      label: `${kits} pack${kits === 1 ? "" : "s"} available`,
      shortLabel: low ? `${kits} left` : `${kits} packs`,
    };
  }

  if (singles <= 0) {
    return {
      vials: 0,
      unitsAvailable: 0,
      status: "out",
      label: "Singles sold out",
      shortLabel: "Sold out",
    };
  }
  return {
    vials: singles,
    unitsAvailable: singles,
    status: singles <= 5 ? "low" : "in_stock",
    label: `${singles} single${singles === 1 ? "" : "s"} available`,
    shortLabel: `${singles} left`,
  };
}

export function canBuyNow(product: Product): boolean {
  if (product.pack === "kit10" && ORDER_TRIGGERED_KITS) return true;
  return stockForProduct(product).unitsAvailable > 0;
}

/**
 * Inventory model (launch):
 * - Sold as unbreakable 10-vial packs only.
 * - You can order a 10-pack from the supplier whenever a customer buys one
 *   (made-to-order / order-triggered). Kits are always available to purchase.
 * - Optional on-hand notes for internal awareness only — do not block checkout.
 */

import type { Product } from "@/lib/products";

export type StockStatus = "in_stock" | "made_to_order" | "low" | "out" | "kit_unavailable";

/**
 * Optional on-hand snapshot (vials). Informational only.
 * BC10: 8 vials already in house; still sell full kits — you reorder packs on demand.
 */
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

/** When true, kit buy is never blocked by VIALS_ON_HAND (supplier reorder on order). */
export const ORDER_TRIGGERED_KITS = true;

export const INVENTORY_NOTE =
  "10-packs made to order · we place a supplier pack when you buy · while supplies last on wave capacity.";

export function vialsOnHand(baseSku: string): number {
  return Math.max(0, VIALS_ON_HAND[baseSku] ?? 0);
}

export function kitsAvailable(baseSku: string): number {
  if (ORDER_TRIGGERED_KITS) return 999; // always orderable
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
    if (ORDER_TRIGGERED_KITS) {
      const onHandKits = Math.floor(vials / 10);
      return {
        vials,
        unitsAvailable: 999,
        status: "made_to_order",
        label:
          onHandKits > 0
            ? `10-pack available · ${onHandKits} on hand · more ordered when you buy`
            : vials > 0
              ? `10-pack available · ${vials} vials on hand · full pack ordered when you buy`
              : "10-pack available · ordered from supplier when you buy",
        shortLabel: onHandKits > 0 ? `${onHandKits}+ kits` : "Order on demand",
      };
    }

    const kits = Math.floor(vials / 10);
    if (kits <= 0) {
      return {
        vials,
        unitsAvailable: 0,
        status: vials > 0 ? "kit_unavailable" : "out",
        label:
          vials > 0
            ? `${vials} vial${vials === 1 ? "" : "s"} on hand — not enough for a full 10-pack`
            : "10-packs sold out · reserve next shipment",
        shortLabel: vials > 0 ? "Need 10 for kit" : "Sold out",
      };
    }
    const low = kits <= 2;
    return {
      vials,
      unitsAvailable: kits,
      status: low ? "low" : "in_stock",
      label: `${kits} × 10-vial kit${kits === 1 ? "" : "s"} in stock`,
      shortLabel: low ? `${kits} kits left` : `${kits} kits`,
    };
  }

  // single vial path (disabled at launch via SELL_SINGLES)
  if (vials <= 0) {
    return {
      vials: 0,
      unitsAvailable: 0,
      status: "out",
      label: "Singles sold out",
      shortLabel: "Sold out",
    };
  }
  return {
    vials,
    unitsAvailable: vials,
    status: vials <= 5 ? "low" : "in_stock",
    label: `${vials} single vial${vials === 1 ? "" : "s"} in stock`,
    shortLabel: `${vials} in stock`,
  };
}

export function canBuyNow(product: Product): boolean {
  if (product.pack === "kit10" && ORDER_TRIGGERED_KITS) return true;
  return stockForProduct(product).unitsAvailable > 0;
}

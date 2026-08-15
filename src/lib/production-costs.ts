/**
 * Grael production / supplier cost (COGS) — Lab only.
 * Defaults from supplier 1-box quote (Aug 2026). 1 box = 10 vials.
 */

export type ProductionCost = {
  /** Your cost for one 10-vial pack */
  kit: number;
  /** Your cost for one single vial (~ box / 10) */
  single: number;
};

/** Base SKU → production cost from digested wholesale quote */
export const DEFAULT_PRODUCTION_COSTS: Record<string, ProductionCost> = {
  BC10: { kit: 70, single: 7 },
  BT5: { kit: 89, single: 9 },
  BB10: { kit: 117, single: 12 },
  MS10: { kit: 68, single: 7 },
  NJ100: { kit: 45, single: 5 },
  CU50: { kit: 33, single: 3 },
  GTT600: { kit: 59, single: 6 },
  ET10: { kit: 35, single: 4 },
};

export function productionCostFor(
  baseSku: string,
  overrides?: Record<string, Partial<ProductionCost>>,
): ProductionCost {
  const base = DEFAULT_PRODUCTION_COSTS[baseSku] ?? { kit: 0, single: 0 };
  const ov = overrides?.[baseSku];
  return {
    kit: ov?.kit ?? base.kit,
    single: ov?.single ?? base.single,
  };
}

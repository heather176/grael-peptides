/**
 * Grael production / supplier cost (COGS) — Lab only.
 * Used for private margin columns on the wholesale studio (never on partner PDF).
 *
 * Defaults are starting estimates for 10-pack and single vials — edit in Lab.
 */

export type ProductionCost = {
  /** Your cost for one 10-vial pack */
  kit: number;
  /** Your cost for one single vial */
  single: number;
};

/**
 * Base SKU → production cost.
 * Round dollars. Adjust anytime in Lab private columns (saved in browser).
 */
export const DEFAULT_PRODUCTION_COSTS: Record<string, ProductionCost> = {
  TR15: { kit: 280, single: 32 },
  SM15: { kit: 240, single: 28 },
  RT10: { kit: 340, single: 38 },
  BC10: { kit: 160, single: 18 },
  BT5: { kit: 180, single: 20 },
  BB10: { kit: 230, single: 26 },
  MS10: { kit: 160, single: 18 },
  NJ100: { kit: 110, single: 12 },
  CU50: { kit: 110, single: 12 },
  GTT600: { kit: 130, single: 14 },
  ET10: { kit: 110, single: 12 },
  WA3: { kit: 35, single: 4 },
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

/**
 * Private Lab pricing worksheet — cost, retail, wholesale, margins.
 * Edits persist in browser; can push to site prices + wholesale sheet costs.
 */

import { partnerPrice, PARTNER_LIST_OFF, roundMoney } from "@/lib/mail-order";
import { DEFAULT_PRODUCTION_COSTS } from "@/lib/production-costs";
import { kitPack, products, vialPack } from "@/lib/products";
import { SUPPLIER_QUOTE, type SupplierQuoteRow } from "@/lib/supplier-quote";

export const PRICING_WS_KEY = "grael-lab-pricing-worksheet-v1";
export const SITE_PRICE_PUSH_KEY = "grael-site-price-overrides-v1";
export const WHOLESALE_PUSH_KEY = "grael-lab-wholesale-studio-v1";

export type PricingFields = {
  boxCost: number;
  /** Public 10-pack launch/retail */
  kitRetail: number;
  /** Public 10-pack list (for wholesale % off) */
  kitList: number;
  /** Partner 10-pack wholesale */
  kitWholesale: number;
  /** Public single vial retail */
  singleRetail: number;
  singleList: number;
  singleWholesale: number;
};

export type PricingOverride = Partial<PricingFields>;

export type PricingWorksheetState = {
  /** Keyed by supplier quote SKU */
  overrides: Record<string, PricingOverride>;
  updatedAt: string;
};

export type PricingRow = PricingFields & {
  sku: string;
  name: string;
  packLabel: string;
  catalogBaseSku?: string;
  onSite: boolean;
  /** Margins before shipping */
  retailMarginKit: number;
  wholesaleMarginKit: number;
  retailMarginSingle: number;
  wholesaleMarginSingle: number;
  /** Which fields differ from computed defaults */
  dirty: Partial<Record<keyof PricingFields, boolean>>;
};

function round10(n: number) {
  return Math.round(n / 10) * 10;
}

function round1(n: number) {
  return Math.round(n);
}

/** Defaults from quote + catalog (or cost-based estimates if not on site) */
export function defaultFieldsFor(q: SupplierQuoteRow): PricingFields {
  const base = q.catalogBaseSku;
  const kit = base ? kitPack(base) : undefined;
  const vial = base ? vialPack(base) : undefined;

  const boxCost = q.boxCost;
  // Prefer live catalog; else estimate markup from cost
  const kitRetail = kit?.price ?? round10(Math.max(boxCost * 6, boxCost + 80));
  const kitList = kit?.listPrice ?? round10(kitRetail / 0.85);
  const kitWholesale = kit
    ? partnerPrice(kit.listPrice, PARTNER_LIST_OFF, "ten")
    : round10(kitList * (1 - PARTNER_LIST_OFF));

  const singleRetail =
    vial?.price ?? round1(Math.max(kitRetail / 10, boxCost / 10 + 8));
  const singleList = vial?.listPrice ?? round1(Math.max(kitList / 10, singleRetail + 5));
  const singleWholesale = vial
    ? partnerPrice(vial.listPrice, PARTNER_LIST_OFF, "ten")
    : round1(Math.max(singleList * (1 - PARTNER_LIST_OFF), 1));

  const prod = base ? DEFAULT_PRODUCTION_COSTS[base] : undefined;
  return {
    boxCost: prod?.kit ?? boxCost,
    kitRetail,
    kitList,
    kitWholesale,
    singleRetail,
    singleList,
    singleWholesale,
  };
}

export function loadWorksheet(): PricingWorksheetState {
  if (typeof window === "undefined") return { overrides: {}, updatedAt: "" };
  try {
    const raw = localStorage.getItem(PRICING_WS_KEY);
    if (!raw) return { overrides: {}, updatedAt: "" };
    return { overrides: {}, updatedAt: "", ...JSON.parse(raw) } as PricingWorksheetState;
  } catch {
    return { overrides: {}, updatedAt: "" };
  }
}

export function saveWorksheet(state: PricingWorksheetState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    PRICING_WS_KEY,
    JSON.stringify({ ...state, updatedAt: new Date().toISOString() }),
  );
}

export function buildRows(state: PricingWorksheetState): PricingRow[] {
  return SUPPLIER_QUOTE.map((q) => {
    const def = defaultFieldsFor(q);
    const ov = state.overrides[q.sku] ?? {};
    const fields: PricingFields = {
      boxCost: ov.boxCost ?? def.boxCost,
      kitRetail: ov.kitRetail ?? def.kitRetail,
      kitList: ov.kitList ?? def.kitList,
      kitWholesale: ov.kitWholesale ?? def.kitWholesale,
      singleRetail: ov.singleRetail ?? def.singleRetail,
      singleList: ov.singleList ?? def.singleList,
      singleWholesale: ov.singleWholesale ?? def.singleWholesale,
    };
    const dirty: PricingRow["dirty"] = {};
    (Object.keys(fields) as (keyof PricingFields)[]).forEach((k) => {
      if (ov[k] !== undefined && ov[k] !== def[k]) dirty[k] = true;
    });
    return {
      ...fields,
      sku: q.sku,
      name: q.name,
      packLabel: q.packLabel,
      catalogBaseSku: q.catalogBaseSku,
      onSite: Boolean(q.catalogBaseSku),
      retailMarginKit: fields.kitRetail - fields.boxCost,
      wholesaleMarginKit: fields.kitWholesale - fields.boxCost,
      retailMarginSingle: fields.singleRetail - Math.round(fields.boxCost / 10),
      wholesaleMarginSingle: fields.singleWholesale - Math.round(fields.boxCost / 10),
      dirty,
    };
  });
}

export type SitePriceOverride = {
  price: number;
  listPrice: number;
};

/** Push catalog rows → site product price overrides (kit + vial SKUs) */
export function pushToWebsite(rows: PricingRow[]) {
  const map: Record<string, SitePriceOverride> = {};
  for (const r of rows) {
    if (!r.catalogBaseSku) continue;
    const kit = kitPack(r.catalogBaseSku);
    const vial = vialPack(r.catalogBaseSku);
    if (kit) {
      map[kit.sku] = { price: r.kitRetail, listPrice: r.kitList };
    }
    if (vial) {
      map[vial.sku] = { price: r.singleRetail, listPrice: r.singleList };
    }
  }
  localStorage.setItem(SITE_PRICE_PUSH_KEY, JSON.stringify(map));
  // Also patch in-memory products for current session
  for (const p of products) {
    const o = map[p.sku];
    if (o) {
      p.price = o.price;
      p.listPrice = o.listPrice;
    }
  }
  return Object.keys(map).length;
}

/** Push box costs + wholesale → wholesale studio production + partner overrides */
export function pushToWholesaleSheet(rows: PricingRow[]) {
  const productionOverrides: Record<string, { kit: number; single: number }> = {};
  const priceOverrides: Record<
    string,
    { kitWholesale?: number; kitRetail?: number; singleWholesale?: number; singleRetail?: number }
  > = {};

  for (const r of rows) {
    if (!r.catalogBaseSku) continue;
    productionOverrides[r.catalogBaseSku] = {
      kit: r.boxCost,
      single: Math.round(r.boxCost / 10),
    };
    priceOverrides[r.catalogBaseSku] = {
      kitWholesale: r.kitWholesale,
      kitRetail: r.kitRetail,
      singleWholesale: r.singleWholesale,
      singleRetail: r.singleRetail,
    };
  }

  // Merge into wholesale studio storage
  let studio: Record<string, unknown> = {};
  try {
    studio = JSON.parse(localStorage.getItem(WHOLESALE_PUSH_KEY) || "{}");
  } catch {
    studio = {};
  }
  studio.productionOverrides = {
    ...((studio.productionOverrides as object) || {}),
    ...productionOverrides,
  };
  studio.overrides = {
    ...((studio.overrides as object) || {}),
    ...priceOverrides,
  };
  localStorage.setItem(WHOLESALE_PUSH_KEY, JSON.stringify(studio));

  // Keep production-costs path in sync for pamphletRows defaults path
  try {
    const prodKey = "grael-production-cost-overrides-v1";
    localStorage.setItem(prodKey, JSON.stringify(productionOverrides));
  } catch {
    /* ignore */
  }

  return Object.keys(productionOverrides).length;
}

export function loadSitePriceOverrides(): Record<string, SitePriceOverride> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(SITE_PRICE_PUSH_KEY) || "{}");
  } catch {
    return {};
  }
}

export function applySitePriceOverridesToProducts() {
  const map = loadSitePriceOverrides();
  for (const p of products) {
    const o = map[p.sku];
    if (o) {
      p.price = o.price;
      p.listPrice = o.listPrice;
    }
  }
}

export function money(n: number) {
  return roundMoney(n, "dollar").toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

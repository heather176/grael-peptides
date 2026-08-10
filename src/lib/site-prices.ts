/**
 * Runtime price resolution — applies Lab pricing worksheet pushes.
 */
import { loadSitePriceOverrides } from "@/lib/pricing-worksheet";
import type { Product } from "@/lib/products";

export function effectivePrice(product: Product): number {
  if (typeof window === "undefined") return product.price;
  const o = loadSitePriceOverrides()[product.sku];
  return o?.price ?? product.price;
}

export function effectiveListPrice(product: Product): number {
  if (typeof window === "undefined") return product.listPrice;
  const o = loadSitePriceOverrides()[product.sku];
  return o?.listPrice ?? product.listPrice;
}

/** Product with Lab-pushed prices applied (non-mutating view) */
export function withEffectivePrices(product: Product): Product {
  if (typeof window === "undefined") return product;
  const o = loadSitePriceOverrides()[product.sku];
  if (!o) return product;
  return { ...product, price: o.price, listPrice: o.listPrice };
}

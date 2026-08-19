import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct, isStorefrontSku, products, type Product } from "@/lib/products";

export type CartLine = {
  sku: string;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  add: (sku: string, qty?: number) => void;
  setQty: (sku: string, qty: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
  enriched: () => Array<CartLine & { product: Product }>;
};

function resolveSellableSku(sku: string): string | null {
  if (!isStorefrontSku(sku)) return null;
  const raw = products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
  return raw?.sku ?? null;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      add: (sku, qty = 1) => {
        const resolved = resolveSellableSku(sku);
        if (!resolved || !getProduct(resolved)) return;
        set((state) => {
          const existing = state.lines.find((l) => l.sku === resolved);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.sku === resolved ? { ...l, qty: Math.min(50, l.qty + qty) } : l,
              ),
            };
          }
          return { lines: [...state.lines, { sku: resolved, qty: Math.min(50, qty) }] };
        });
      },
      setQty: (sku, qty) => {
        if (qty <= 0) {
          get().remove(sku);
          return;
        }
        set((state) => ({
          lines: state.lines.map((l) =>
            l.sku === sku ? { ...l, qty: Math.min(50, Math.floor(qty)) } : l,
          ),
        }));
      },
      remove: (sku) =>
        set((state) => ({ lines: state.lines.filter((l) => l.sku !== sku) })),
      clear: () => set({ lines: [] }),
      count: () => get().lines.reduce((n, l) => n + l.qty, 0),
      subtotal: () =>
        get().lines.reduce((sum, l) => {
          const p = getProduct(l.sku);
          return sum + (p ? p.price * l.qty : 0);
        }, 0),
      enriched: () =>
        get()
          .lines.map((l) => {
            const resolved = resolveSellableSku(l.sku);
            const product = resolved ? getProduct(resolved) : undefined;
            return product && resolved ? { ...l, sku: resolved, product } : null;
          })
          .filter((x): x is CartLine & { product: Product } => x !== null),
    }),
    {
      name: "grael-cart-v2",
      partialize: (state) => ({ lines: state.lines }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

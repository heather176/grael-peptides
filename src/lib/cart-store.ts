import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct, type Product } from "@/lib/products";

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

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      add: (sku, qty = 1) => {
        if (!getProduct(sku)) return;
        set((state) => {
          const existing = state.lines.find((l) => l.sku === sku);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.sku === sku ? { ...l, qty: Math.min(20, l.qty + qty) } : l,
              ),
            };
          }
          return { lines: [...state.lines, { sku, qty: Math.min(20, qty) }] };
        });
      },
      setQty: (sku, qty) => {
        if (qty <= 0) {
          get().remove(sku);
          return;
        }
        set((state) => ({
          lines: state.lines.map((l) =>
            l.sku === sku ? { ...l, qty: Math.min(20, Math.floor(qty)) } : l,
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
            const product = getProduct(l.sku);
            return product ? { ...l, product } : null;
          })
          .filter((x): x is CartLine & { product: Product } => x !== null),
    }),
    {
      name: "grael-cart-v1",
      partialize: (state) => ({ lines: state.lines }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

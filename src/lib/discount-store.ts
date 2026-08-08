import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  lookupDiscountCode,
  normalizeCode,
  type DiscountCodeDef,
} from "@/lib/discount-codes";

type ApplyFail = { ok: false; reason: "not_found" | "inactive" | "expired" };
type ApplyOk = { ok: true; def: DiscountCodeDef };

type DiscountState = {
  code: string | null;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  apply: (raw: string) => ApplyOk | ApplyFail;
  clear: () => void;
  activeDef: () => DiscountCodeDef | null;
  percentOff: () => number;
};

export const useDiscount = create<DiscountState>()(
  persist(
    (set, get) => ({
      code: null,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      apply: (raw) => {
        const result = lookupDiscountCode(raw);
        if (!result.ok) {
          return { ok: false as const, reason: result.reason };
        }
        set({ code: normalizeCode(result.def.code) });
        return { ok: true as const, def: result.def };
      },
      clear: () => set({ code: null }),
      activeDef: () => {
        const code = get().code;
        if (!code) return null;
        const result = lookupDiscountCode(code);
        if (!result.ok) {
          if (get().code) set({ code: null });
          return null;
        }
        return result.def;
      },
      percentOff: () => get().activeDef()?.percentOff ?? 0,
    }),
    {
      name: "grael-discount-v1",
      partialize: (s) => ({ code: s.code }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

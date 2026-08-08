import { PRESALE } from "@/lib/products";

export function PresaleBanner() {
  if (!PRESALE.active) return null;
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-2.5 text-center text-sm sm:flex-row sm:items-center sm:justify-center sm:gap-3 sm:px-6 sm:text-left">
        <span className="font-medium text-[var(--color-fg)]">
          {PRESALE.label} · {PRESALE.discountLabel}
        </span>
        <span className="text-[var(--color-fg-muted)]">{PRESALE.note}</span>
      </div>
    </div>
  );
}

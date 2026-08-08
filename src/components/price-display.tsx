import { discountPercent, PRESALE, type Product } from "@/lib/products";
import { unitPriceWithDiscount } from "@/lib/discount-codes";
import { useDiscount } from "@/lib/discount-store";
import { cn, formatUsd } from "@/lib/utils";

/**
 * Prices use IBM Plex Mono — lab/ledger feel, high numeral clarity.
 * Shows wholesale unit price when a valid discount code is applied.
 */
export function PriceDisplay({
  product,
  size = "md",
  className,
}: {
  product: Product;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const def = useDiscount((s) => s.activeDef());
  const off = discountPercent(product);
  const wholesalePct = def?.percentOff ?? 0;
  const displayPrice =
    wholesalePct > 0 ? unitPriceWithDiscount(product.price, wholesalePct) : product.price;

  const priceCls =
    size === "lg"
      ? "text-[1.75rem] sm:text-[2rem] leading-none"
      : size === "sm"
        ? "text-[0.95rem] sm:text-[1.05rem] leading-none"
        : "text-[1.2rem] sm:text-[1.35rem] leading-none";
  const listCls = size === "lg" ? "text-sm" : "text-xs";

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span
        className={cn(
          "font-mono font-medium tracking-tight tabular-nums text-[var(--color-fg)]",
          priceCls,
        )}
      >
        {formatUsd(displayPrice)}
      </span>
      {wholesalePct > 0 ? (
        <>
          <span
            className={cn(
              "font-mono tabular-nums text-[var(--color-fg-subtle)] line-through",
              listCls,
            )}
          >
            {formatUsd(product.price)}
          </span>
          <span className="rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/12 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--color-primary)] uppercase">
            −{wholesalePct}% {def?.label ?? "wholesale"}
          </span>
        </>
      ) : PRESALE.active && product.listPrice > product.price ? (
        <>
          <span
            className={cn(
              "font-mono tabular-nums text-[var(--color-fg-subtle)] line-through",
              listCls,
            )}
          >
            {formatUsd(product.listPrice)}
          </span>
          <span className="rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/12 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--color-primary)] uppercase">
            −{off}% pre-sale
          </span>
        </>
      ) : null}
    </div>
  );
}

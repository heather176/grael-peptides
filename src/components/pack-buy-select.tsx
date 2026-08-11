import { ExternalLink, Plus, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { unitPriceForProduct, withPromoCode } from "@/lib/discount-codes";
import { useDiscount } from "@/lib/discount-store";
import { canBuyNow, stockForProduct } from "@/lib/inventory";
import {
  kitPack,
  packShortLabel,
  siblingPacks,
  type Product,
  vialPack,
} from "@/lib/products";
import { cn, formatUsd } from "@/lib/utils";

type Props = {
  product: Product;
  layout?: "card" | "detail";
  className?: string;
  /** Default size — single vial first */
  defaultPack?: "kit10" | "vial";
};

export function PackBuySelect({
  product,
  layout = "card",
  className,
  defaultPack = "vial",
}: Props) {
  const options = useMemo(() => {
    const packs = siblingPacks(product);
    // Prefer vial listed first when both exist
    const list =
      packs.length > 0
        ? packs
        : ([vialPack(product.baseSku), kitPack(product.baseSku)].filter(Boolean) as Product[]);
    return [...list].sort((a, b) => {
      if (a.pack === "vial" && b.pack !== "vial") return -1;
      if (b.pack === "vial" && a.pack !== "vial") return 1;
      return 0;
    });
  }, [product]);

  const preferred =
    options.find((p) => p.pack === defaultPack) ??
    options.find((p) => p.pack === "vial") ??
    options[0]!;

  const [sku, setSku] = useState(preferred.sku);
  const selected = options.find((p) => p.sku === sku) ?? preferred;
  const add = useCart((s) => s.add);
  const code = useDiscount((s) => s.activeDef()?.code ?? null);
  const promoPct = useDiscount((s) => s.activeDef()?.percentOff ?? 0);
  const unit = unitPriceForProduct(selected, promoPct || null);
  const buyable = canBuyNow(selected);
  const stock = stockForProduct(selected);
  const buyHref = withPromoCode(selected.paymentLink, code);
  const isDetail = layout === "detail";
  const isSingle = selected.pack === "vial";

  return (
    <div className={cn("space-y-2.5", className)}>
      <label className="block">
        <span
          className={cn(
            "mb-1.5 block font-medium tracking-wide text-[var(--color-fg-subtle)] uppercase",
            isDetail ? "text-xs" : "text-[10px]",
          )}
        >
          Size
        </span>
        <div className="relative">
          <select
            value={selected.sku}
            onChange={(e) => setSku(e.target.value)}
            aria-label={`Size for ${product.name}`}
            className={cn(
              "w-full appearance-none rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-card)] pr-10 font-medium text-[var(--color-fg)] shadow-[var(--shadow-soft)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20",
              isDetail ? "h-12 px-4 text-base" : "h-11 px-3 text-sm",
            )}
          >
            {options.map((opt) => {
              const price = unitPriceForProduct(opt, promoPct || null);
              const optStock = stockForProduct(opt);
              const label =
                opt.pack === "vial"
                  ? optStock.unitsAvailable > 0
                    ? `1 vial — ${formatUsd(price)} · ${optStock.unitsAvailable} left`
                    : `1 vial — ${formatUsd(price)} · sold out`
                  : `10-pack — ${formatUsd(price)}`;
              return (
                <option key={opt.sku} value={opt.sku}>
                  {label}
                </option>
              );
            })}
          </select>
          <span
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-fg-subtle)]"
            aria-hidden
          >
            ▾
          </span>
        </div>
      </label>

      {!isDetail ? (
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-[var(--color-fg-muted)]">
          {options.map((opt) => {
            const price = unitPriceForProduct(opt, promoPct || null);
            const active = opt.sku === selected.sku;
            const optBuyable = canBuyNow(opt);
            return (
              <button
                key={opt.sku}
                type="button"
                onClick={() => setSku(opt.sku)}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 tabular transition-colors",
                  active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 font-semibold text-[var(--color-primary)]"
                    : "border-[var(--color-border)] text-[var(--color-fg-subtle)] hover:border-[var(--color-border-strong)]",
                  !optBuyable && opt.pack === "vial" ? "opacity-60" : "",
                )}
              >
                {packShortLabel(opt)} {formatUsd(price)}
                {opt.pack === "vial" && !optBuyable ? " · sold out" : ""}
              </button>
            );
          })}
        </div>
      ) : null}

      {isSingle && !buyable ? (
        <p className={cn("text-[var(--color-fg-subtle)]", isDetail ? "text-xs" : "text-[10px]")}>
          Singles sold out
        </p>
      ) : null}

      <div className={cn("flex flex-wrap gap-2", isDetail ? "pt-0.5" : "")}>
        {buyable ? (
          <>
            <Button
              size={isDetail ? "default" : "sm"}
              className={cn(isDetail ? "h-11 min-w-[8.5rem] px-5" : "h-9 flex-1 px-3 text-xs")}
              asChild
            >
              <a href={buyHref} target="_blank" rel="noreferrer">
                Buy
                <span className="ml-1 tabular opacity-90">{formatUsd(unit)}</span>
                <ExternalLink className={isDetail ? "h-4 w-4" : "h-3 w-3"} strokeWidth={1.5} />
              </a>
            </Button>
            <Button
              size={isDetail ? "default" : "sm"}
              variant="secondary"
              className={cn(isDetail ? "h-11 px-4" : "h-9 px-3 text-xs")}
              onClick={() => {
                add(selected.sku);
                toast.success(
                  `${product.name} · ${isSingle ? "1 vial" : "10-pack"} added to cart`,
                );
              }}
            >
              {isDetail ? (
                <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
              )}
              Cart
            </Button>
          </>
        ) : isSingle ? (
          <>
            <Button
              size={isDetail ? "default" : "sm"}
              variant="secondary"
              className={cn(isDetail ? "h-11 px-4" : "h-9 flex-1 px-3 text-xs")}
              disabled
            >
              Sold out
            </Button>
            <Button
              size={isDetail ? "default" : "sm"}
              variant="outline"
              className={cn(isDetail ? "h-11 px-4" : "h-9 px-3 text-xs")}
              onClick={() => {
                const kit = kitPack(product.baseSku);
                if (kit) setSku(kit.sku);
              }}
            >
              Use 10-pack
            </Button>
          </>
        ) : (
          <Button size={isDetail ? "default" : "sm"} variant="secondary" asChild>
            <Link to="/preorder">Next shipment</Link>
          </Button>
        )}
      </div>

      {isDetail && isSingle && buyable ? (
        <p className="text-xs text-[var(--color-fg-subtle)]">{stock.label}</p>
      ) : null}
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { ExternalLink, Plus } from "lucide-react";
import { toast } from "sonner";
import { PriceDisplay } from "@/components/price-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { withPromoCode } from "@/lib/discount-codes";
import { useDiscount } from "@/lib/discount-store";
import { canBuyNow, stockForProduct } from "@/lib/inventory";
import type { Product } from "@/lib/products";
import { LAUNCH, NEXT_SHIPMENT, vialPack } from "@/lib/products";
import { requireBatch } from "@/lib/traceabl-batches";
import { formatUsd } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const code = useDiscount((s) => s.activeDef()?.code ?? null);
  const batch = requireBatch(product.sku);
  const buyHref = withPromoCode(product.paymentLink, code);
  const single = vialPack(product.baseSku);
  const kitStock = stockForProduct(product);
  const singleStock = single ? stockForProduct(single) : null;
  const kitBuyable = canBuyNow(product);

  return (
    <article className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] transition-colors hover:border-[var(--color-border-strong)]">
      <Link
        to="/products/$sku"
        params={{ sku: product.baseSku }}
        className="flex flex-1 flex-col no-underline text-inherit"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-white">
          <img
            src={product.image}
            alt={`${product.name} ${product.vialLabel}`}
            className="h-full w-full object-cover object-center transition-opacity duration-300 group-hover:opacity-95"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge className="bg-white/95 text-[10px] font-medium tracking-wide">
              {product.vialLabel}
            </Badge>
            <Badge
              className={
                kitStock.status === "in_stock"
                  ? "border-[var(--color-primary)]/25 bg-[var(--color-primary)]/12 text-[10px] font-medium tracking-wide text-[var(--color-primary)]"
                  : kitStock.status === "low" || kitStock.status === "kit_unavailable"
                    ? "border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 text-[10px] font-medium tracking-wide text-[var(--color-warning)]"
                    : "border-[var(--color-danger)]/25 bg-[var(--color-danger)]/10 text-[10px] font-medium tracking-wide text-[var(--color-danger)]"
              }
            >
              {kitStock.shortLabel}
            </Badge>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-[var(--color-fg)]">
                {product.name}
              </h3>
              <p className="text-sm text-[var(--color-fg-muted)]">{product.packLabel}</p>
            </div>
            <PriceDisplay product={product} size="sm" className="shrink-0 justify-end text-right" />
          </div>
          <p className="text-[11px] text-[var(--color-fg-subtle)]">{kitStock.label}</p>
          {single && singleStock ? (
            <p className="text-[11px] text-[var(--color-fg-subtle)]">
              Single from {formatUsd(single.price)} · {singleStock.shortLabel}
            </p>
          ) : null}
          <p className="font-mono text-xs text-[var(--color-fg-muted)]">
            Batch {batch.batchId}
            <span className="text-[var(--color-fg-subtle)]"> · </span>
            <span className="tabular text-[var(--color-primary)]">
              {batch.purityPercent.toFixed(1)}%
            </span>
          </p>
          <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            {product.short}
          </p>
          {NEXT_SHIPMENT.active ? (
            <p className="text-[11px] text-[var(--color-fg-subtle)]">
              {NEXT_SHIPMENT.shortLabel} · {NEXT_SHIPMENT.shortCharge}
            </p>
          ) : null}
          <p className="text-[11px] text-[var(--color-fg-subtle)]">
            + $100 US shipping / order · $400 min
          </p>
        </div>
      </Link>
      <div className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] px-4 py-3">
        {kitBuyable ? (
          <Button size="sm" className="h-8 px-3 text-xs" asChild>
            <a href={buyHref} target="_blank" rel="noreferrer">
              Buy 10-pack
              <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
            </a>
          </Button>
        ) : (
          <Button size="sm" className="h-8 px-3 text-xs" variant="secondary" asChild>
            <Link to="/preorder">Next shipment</Link>
          </Button>
        )}
        {kitBuyable ? (
          <Button
            size="sm"
            variant="secondary"
            className="h-8 px-3 text-xs"
            onClick={() => {
              add(product.sku);
              toast.success(`${product.name} 10-pack added`);
            }}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            Cart
          </Button>
        ) : null}
        {single && singleStock && singleStock.unitsAvailable > 0 ? (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-xs"
            onClick={() => {
              add(single.sku);
              toast.success(`${product.name} single vial added`);
            }}
          >
            + Single ({singleStock.unitsAvailable})
          </Button>
        ) : null}
        <a
          href={batch.coaUrl}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-xs font-medium text-[var(--color-primary)] no-underline hover:underline"
        >
          COA
        </a>
      </div>
    </article>
  );
}

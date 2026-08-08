import { Link } from "@tanstack/react-router";
import { ExternalLink, Plus } from "lucide-react";
import { toast } from "sonner";
import { PriceDisplay } from "@/components/price-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { withPromoCode } from "@/lib/discount-codes";
import { useDiscount } from "@/lib/discount-store";
import type { Product } from "@/lib/products";
import { LAUNCH, NEXT_SHIPMENT } from "@/lib/products";
import { requireBatch } from "@/lib/traceabl-batches";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const code = useDiscount((s) => s.activeDef()?.code ?? null);
  const batch = requireBatch(product.sku);
  const buyHref = withPromoCode(product.paymentLink, code);

  return (
    <article className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] transition-colors hover:border-[var(--color-border-strong)]">
      <Link
        to="/products/$sku"
        params={{ sku: product.sku }}
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
            {LAUNCH.active ? (
              <Badge className="border-[var(--color-primary)]/25 bg-[var(--color-primary)]/12 text-[10px] font-medium tracking-wide text-[var(--color-primary)]">
                {LAUNCH.suppliesLabel}
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-[var(--color-fg)]">
                {product.name}
              </h3>
              <p className="text-sm text-[var(--color-fg-muted)]">{product.strength}</p>
            </div>
            <PriceDisplay product={product} size="sm" className="shrink-0 justify-end text-right" />
          </div>
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
            <p className="text-[11px] text-[var(--color-fg-subtle)]">{NEXT_SHIPMENT.shortLabel} · {NEXT_SHIPMENT.shortCharge}</p>
          ) : null}
          <p className="text-[11px] text-[var(--color-fg-subtle)]">+ $100 US shipping / order · $400 min</p>
        </div>
      </Link>
      <div className="flex flex-wrap items-center gap-2 border-t border-[var(--color-border)] px-4 py-3">
        <Button size="sm" className="h-8 px-3 text-xs" asChild>
          <a href={buyHref} target="_blank" rel="noreferrer">
            Buy now
            <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
          </a>
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="h-8 px-3 text-xs"
          onClick={() => {
            add(product.sku);
            toast.success(`${product.name} added`);
          }}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
          Cart
        </Button>
        {NEXT_SHIPMENT.active ? (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-xs text-[var(--color-primary)]"
            asChild
          >
            <Link
              to="/preorder"
              onClick={() => {
                add(product.sku);
              }}
            >
              Next shipment
            </Link>
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

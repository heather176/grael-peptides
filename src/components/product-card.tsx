import { Link } from "@tanstack/react-router";
import { CanaryBadge } from "@/components/canary-badge";
import { PackBuySelect } from "@/components/pack-buy-select";
import { PriceDisplay } from "@/components/price-display";
import { TraceablBadge } from "@/components/traceabl-badge";
import { Badge } from "@/components/ui/badge";
import { brokenVialsOnHand, stockForProduct } from "@/lib/inventory";
import type { Product } from "@/lib/products";
import { LAUNCH, NEXT_SHIPMENT, kitPack, vialPack } from "@/lib/products";
import { requireBatch } from "@/lib/traceabl-batches";
import { formatUsd } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const batch = requireBatch(product.sku);
  const kit = kitPack(product.baseSku) ?? product;
  const single = vialPack(product.baseSku);
  const singles = brokenVialsOnHand(product.baseSku);
  const kitStock = stockForProduct(kit);
  // Card price defaults to single vial
  const priceProduct = single ?? product;

  return (
    <article className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] transition-colors hover:border-[var(--color-border-strong)]">
      <Link
        to="/products/$sku"
        params={{ sku: single?.sku ?? product.baseSku }}
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
              {product.vialLabel ?? product.strength}
            </Badge>
            {singles > 0 ? (
              <Badge className="border-[var(--color-border-strong)] bg-white/95 text-[10px] font-medium tracking-wide">
                {singles} singles
              </Badge>
            ) : null}
            <Badge
              className={
                kitStock.status === "in_stock" || kitStock.status === "made_to_order"
                  ? "border-[var(--color-border-strong)] bg-white/95 text-[10px] font-medium tracking-wide text-[var(--color-fg-muted)]"
                  : "border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 text-[10px] font-medium tracking-wide text-[var(--color-warning)]"
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
              <p className="text-sm text-[var(--color-fg-muted)]">
                {single?.vialLabel ?? product.vialLabel ?? "1 vial"}
              </p>
              <p className="text-[11px] text-[var(--color-fg-subtle)]">
                {singles > 0
                  ? `${singles} single vial${singles === 1 ? "" : "s"} available`
                  : "Singles sold out"}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <PriceDisplay product={priceProduct} size="sm" className="justify-end" />
              {kit && single ? (
                <p className="mt-0.5 text-[11px] tabular text-[var(--color-fg-subtle)]">
                  or {formatUsd(kit.price)} / 10-pack
                </p>
              ) : null}
            </div>
          </div>
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

      <div className="relative z-10 flex flex-col gap-2 px-4 pb-3">
        <TraceablBadge batch={batch} size="sm" />
        <CanaryBadge size="sm" className="w-full" />
      </div>

      <div className="border-t border-[var(--color-border)] px-4 py-3">
        <PackBuySelect product={product} layout="card" defaultPack="vial" />
        <p className="mt-2 text-right text-[10px] text-[var(--color-fg-subtle)]">
          {LAUNCH.suppliesLabel}
        </p>
      </div>
    </article>
  );
}

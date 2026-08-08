import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogProducts, featuredProducts, type Product } from "@/lib/products";
import { requireBatch } from "@/lib/traceabl-batches";
import { formatUsd } from "@/lib/utils";

/** Highlight card: peptides for sale — not Traceabl testing packages */
export function ShopProductsCard({
  limit = 8,
  title = "Research products for sale",
  subtitle = "Pre-sale · Traceabl batch COA per lot",
}: {
  limit?: number;
  title?: string;
  subtitle?: string;
}) {
  const featured = featuredProducts();
  const rest = catalogProducts().filter((p) => !featured.some((f) => f.sku === p.sku));
  const list: Product[] = [...featured, ...rest].slice(0, limit);

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[var(--color-primary)]">
          <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--color-fg)]">
            {title}
          </h3>
          <p className="mt-0.5 text-sm text-[var(--color-fg-muted)]">{subtitle}</p>
        </div>
      </div>

      <ul className="mt-5 space-y-2">
        {list.map((p) => {
          const batch = requireBatch(p.sku);
          return (
            <li key={p.sku}>
              <Link
                to="/products/$sku"
                params={{ sku: p.sku }}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2.5 no-underline transition-colors hover:border-[var(--color-border-strong)]"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-[var(--color-fg)]">{p.name}</span>
                  <span className="block text-xs text-[var(--color-fg-subtle)]">
                    {p.vialLabel}
                    {p.vials > 1 ? ` · ${p.vials} vials` : ""}
                    {" · "}
                    <span className="font-mono">Batch {batch.batchId}</span>
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold tabular text-[var(--color-fg)]">
                  {formatUsd(p.price)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-[var(--color-fg-subtle)]">
        Research use only. Lab tested · Traceabl COA linked on each product.
      </p>

      <Button className="mt-4" size="sm" asChild>
        <Link to="/catalog">
          Shop all products
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        </Link>
      </Button>
    </div>
  );
}

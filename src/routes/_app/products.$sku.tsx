import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Plus } from "lucide-react";
import { toast } from "sonner";
import { BatchCoaPanel } from "@/components/batch-coa";
import { PriceDisplay } from "@/components/price-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { CATEGORY_LABELS, FORM_LABELS, getProduct, PRESALE } from "@/lib/products";
import { requireBatch } from "@/lib/traceabl-batches";

export const Route = createFileRoute("/_app/products/$sku")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { sku } = Route.useParams();
  const product = getProduct(sku);
  const add = useCart((s) => s.add);

  if (!product) throw notFound();

  const batch = requireBatch(product.sku);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        to="/catalog"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-fg-muted)] no-underline hover:text-[var(--color-fg)]"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to shop
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-soft)]">
            <img
              src={product.image}
              alt={`${product.name} ${product.vialLabel}`}
              className="aspect-[4/5] w-full object-cover object-center"
            />
          </div>
          <p className="text-center text-xs tracking-[0.12em] text-[var(--color-fg-subtle)] uppercase">
            {FORM_LABELS[product.form]} · Batch {batch.batchId}
          </p>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-white">{CATEGORY_LABELS[product.category]}</Badge>
              <Badge className="border-[var(--color-primary)]/25 bg-[var(--color-primary)]/8 text-[var(--color-primary)]">
                {product.vialLabel}
              </Badge>
              {PRESALE.active ? (
                <Badge className="border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  {PRESALE.label}
                </Badge>
              ) : null}
            </div>
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {product.name}
            </h1>
            {/* strength already includes per-vial amount + pack size — don't repeat vialLabel */}
            <p className="text-[var(--color-fg-muted)]">{product.strength}</p>
            <p className="text-[var(--color-fg-muted)]">{product.short}</p>
          </div>

          <BatchCoaPanel batch={batch} />

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-5">
            <p className="text-sm text-[var(--color-fg-muted)]">Pre-sale price</p>
            <PriceDisplay product={product} size="lg" className="mt-1" />
            {PRESALE.active ? (
              <p className="mt-2 text-xs text-[var(--color-fg-muted)]">{PRESALE.note}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" className="h-9 px-4" asChild>
                <a href={product.paymentLink} target="_blank" rel="noreferrer">
                  Buy
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                </a>
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-9 px-4"
                onClick={() => {
                  add(product.sku);
                  toast.success(`${product.name} added`);
                }}
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                Cart
              </Button>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">{product.description}</p>

          <p className="text-xs text-[var(--color-fg-subtle)]">
            Research focus: {product.researchFocus}.{" "}
            <Link to="/transparency" className="text-[var(--color-primary)] no-underline hover:underline">
              Traceabl Testing
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

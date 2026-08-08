import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Package, Plus } from "lucide-react";
import { toast } from "sonner";
import { BatchCoaPanel } from "@/components/batch-coa";
import { PriceDisplay } from "@/components/price-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import {
  CATEGORY_LABELS,
  FORM_LABELS,
  getProduct,
  LAUNCH,
  NEXT_SHIPMENT,
  PRESALE,
} from "@/lib/products";
import { requireBatch } from "@/lib/traceabl-batches";

export const Route = createFileRoute("/_app/products/$sku")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { sku } = Route.useParams();
  const product = getProduct(sku);
  const add = useCart((s) => s.add);
  const navigate = useNavigate();

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
              {LAUNCH.active ? (
                <Badge className="border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  {LAUNCH.suppliesLabel}
                </Badge>
              ) : null}
            </div>
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {product.name}
            </h1>
            <p className="text-[var(--color-fg-muted)]">{product.strength}</p>
            <p className="text-[var(--color-fg-muted)]">{product.short}</p>
          </div>

          <BatchCoaPanel batch={batch} />

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-5">
            <p className="text-sm text-[var(--color-fg-muted)]">Launch price</p>
            <PriceDisplay product={product} size="lg" className="mt-1" />
            {LAUNCH.active ? (
              <p className="mt-2 text-xs text-[var(--color-fg-muted)]">
                {LAUNCH.suppliesLabel}. {LAUNCH.coaNote}
              </p>
            ) : PRESALE.active ? (
              <p className="mt-2 text-xs text-[var(--color-fg-muted)]">{PRESALE.note}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" className="h-9 px-4" asChild>
                <a href={product.paymentLink} target="_blank" rel="noreferrer">
                  Buy now
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

          {NEXT_SHIPMENT.active ? (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-5">
              <div className="flex items-start gap-3">
                <Package
                  className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]"
                  strokeWidth={1.5}
                />
                <div className="min-w-0 space-y-2">
                  <p className="font-medium text-[var(--color-fg)]">{NEXT_SHIPMENT.label}</p>
                  <p className="text-sm text-[var(--color-fg-muted)]">{NEXT_SHIPMENT.note}</p>
                  <p className="text-xs text-[var(--color-fg-subtle)]">
                    Estimated ship:{" "}
                    <span className="font-medium text-[var(--color-fg)]">
                      {NEXT_SHIPMENT.estimatedShipLabel}
                    </span>{" "}
                    (~{NEXT_SHIPMENT.daysEstimate} days)
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-1"
                    onClick={() => {
                      add(product.sku);
                      toast.success(`${product.name} reserved for next shipment`);
                      void navigate({ to: "/preorder" });
                    }}
                  >
                    Purchase next shipment
                    <Package className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

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

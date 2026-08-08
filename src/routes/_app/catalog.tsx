import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_LABELS,
  LAUNCH,
  NEXT_SHIPMENT,
  products,
  type ProductCategory,
} from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/catalog")({
  component: CatalogPage,
});

const filters: Array<"all" | ProductCategory> = [
  "all",
  "metabolic",
  "healing",
  "cellular",
  "longevity",
  "support",
];

function CatalogPage() {
  const [filter, setFilter] = useState<"all" | ProductCategory>("all");
  const list = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 max-w-xl space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Research products
        </h1>
        <p className="text-sm text-[var(--color-fg-muted)]">
          {products.length} compounds
          {LAUNCH.active ? ` · ${LAUNCH.discountLabel} · ${LAUNCH.suppliesLabel}` : null}
          {NEXT_SHIPMENT.active ? ` · Next shipment ~${NEXT_SHIPMENT.estimatedShipLabel}` : null}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((key) => (
          <Button
            key={key}
            size="sm"
            variant={filter === key ? "default" : "ghost"}
            className={cn("h-8", filter === key ? "" : "text-[var(--color-fg-muted)]")}
            onClick={() => setFilter(key)}
          >
            {key === "all" ? "All" : CATEGORY_LABELS[key]}
          </Button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProductCard key={p.sku} product={p} />
        ))}
      </div>
    </main>
  );
}

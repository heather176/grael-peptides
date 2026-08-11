import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { featuredProducts, LAUNCH, NEXT_SHIPMENT } from "@/lib/products";

export const Route = createFileRoute("/_app/")({
  component: HomePage,
});

function HomePage() {
  const featured = featuredProducts();

  return (
    <main>
      {/* Clean hero: no stacked backgrounds — copy + one vial */}
      <section className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2 md:gap-12 md:py-24 lg:py-28">
          <div className="order-1 max-w-xl space-y-6">
            <p className="text-[11px] font-medium tracking-[0.22em] text-[var(--color-fg-subtle)] uppercase">
              Grael Peptides · Research use only
            </p>
            <h1 className="font-display text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-[var(--color-fg)] sm:text-5xl lg:text-[3.5rem]">
              Research peptides
              <br />
              for serious labs.
            </h1>
            <p className="max-w-md text-[var(--color-fg-muted)] leading-relaxed">
              Single vials and 10-packs across every compound. Medical-grade third-party testing
              pending — results posted as they arrive.
              {NEXT_SHIPMENT.active ? (
                <> Next shipment {NEXT_SHIPMENT.estimatedShipLabel}.</>
              ) : null}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/catalog">
                  Shop research products
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link to="/preorder">Next shipment · {NEXT_SHIPMENT.estimatedShipLabel}</Link>
              </Button>
            </div>
            <p className="text-[11px] tracking-[0.14em] text-[var(--color-fg-subtle)] uppercase">
              {LAUNCH.suppliesLabel}
            </p>
          </div>

          <div className="order-2 flex justify-center md:justify-end">
            <div className="w-full max-w-[320px] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] shadow-[var(--shadow-soft)] sm:max-w-[360px]">
              <img
                src="/products/hero-primary.jpg"
                alt="Grael research peptide vial"
                className="h-auto w-full object-contain object-center"
                width={720}
                height={1080}
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Featured
          </h2>
          <Link
            to="/catalog"
            className="text-sm text-[var(--color-fg-muted)] no-underline hover:text-[var(--color-fg)]"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}

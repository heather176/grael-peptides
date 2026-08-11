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
      {/*
        Mobile-safe hero: text + full vial (never crop the bottle).
        Desktop: two columns — copy left, master vial right on soft studio ground.
      */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-white">
        {/* Soft studio wash (desktop only accent) */}
        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          aria-hidden
        >
          <img
            src="/products/hero-bg.jpg"
            alt=""
            className="h-full w-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/35" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2 md:gap-12 md:py-24 lg:py-28">
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
              Single vials and 10-packs across every compound. Medical-grade third-party
              testing ordered — results posted as they arrive.
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
                <Link to="/preorder">
                  Next shipment · {NEXT_SHIPMENT.estimatedShipLabel}
                </Link>
              </Button>
            </div>
            <p className="text-[11px] tracking-[0.14em] text-[var(--color-fg-subtle)] uppercase">
              {LAUNCH.suppliesLabel}
            </p>
          </div>

          {/* Full vial — always complete on mobile (no edge crop) */}
          <div className="order-2 flex justify-center md:justify-end">
            <img
              src="/products/hero-primary.jpg"
              alt="Grael research peptide vial — lyophilized, unlabeled"
              className="h-auto w-[min(72vw,280px)] object-contain object-center drop-shadow-sm sm:w-[min(60vw,320px)] md:w-[min(100%,360px)]"
              width={720}
              height={1080}
              decoding="async"
              fetchPriority="high"
            />
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

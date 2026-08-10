import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { featuredProducts, LAUNCH, NEXT_SHIPMENT, TESTING_ORDERED } from "@/lib/products";

export const Route = createFileRoute("/_app/")({
  component: HomePage,
});

function HomePage() {
  const featured = featuredProducts();

  return (
    <main>
      {/* Full-bleed clinical-luxury hero */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="absolute inset-0">
          <img
            src="/products/hero-primary.jpg"
            alt=""
            className="h-full w-full object-cover object-center"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-bg)]/92 to-[var(--color-bg)]/35 sm:via-[var(--color-bg)]/88 sm:to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          <div className="space-y-6">
            <p className="text-[11px] font-medium tracking-[0.22em] text-[var(--color-fg-subtle)] uppercase">
              Grael Peptides · Research use only
            </p>
            <h1 className="font-display text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-[var(--color-fg)] sm:text-5xl lg:text-[3.65rem]">
              Quiet. Clear.
              <br />
              Research-ready.
            </h1>
            <p className="max-w-md text-[var(--color-fg-muted)] leading-relaxed">
              Clinical-luxury research materials. Priced by{" "}
              <span className="text-[var(--color-fg)]">single vial</span>, with a{" "}
              <span className="text-[var(--color-fg)]">10-pack</span> on every compound. Produced
              when you buy. {TESTING_ORDERED}{" "}
              {NEXT_SHIPMENT.active ? (
                <>Next shipment {NEXT_SHIPMENT.estimatedShipLabel}.</>
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
              {LAUNCH.suppliesLabel} · Silver · stone · white
            </p>
          </div>

          {/* Framed product still — matches BPC vial language */}
          <div className="mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white/70 shadow-[var(--shadow-soft)] backdrop-blur-[2px]">
              <img
                src="/products/hero-canva.png"
                alt="Grael Peptides — Quiet. Clear. Research-ready."
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
            <p className="mt-3 text-center text-[11px] tracking-[0.14em] text-[var(--color-fg-subtle)] uppercase">
              Canva poster · studio vial · Traceabl
            </p>
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

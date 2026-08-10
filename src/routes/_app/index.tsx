import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { featuredProducts, LAUNCH, NEXT_SHIPMENT, TESTING_ORDERED } from "@/lib/products";

export const Route = createFileRoute("/_app/")({
  component: HomePage,
});

const HERO_SHOTS = [
  {
    src: "/products/hero-grid.jpg",
    alt: "Row of research vials on white studio surface",
  },
  {
    src: "/products/hero-trio.jpg",
    alt: "Three research vials in soft studio light",
  },
  {
    src: "/products/hero-close.jpg",
    alt: "Close three-quarter view of a research vial",
  },
] as const;

function HomePage() {
  const featured = featuredProducts();

  return (
    <main>
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
          <div className="space-y-6">
            <p className="text-[11px] font-medium tracking-[0.2em] text-[var(--color-fg-subtle)] uppercase">
              Research products · {LAUNCH.suppliesLabel}
            </p>
            <h1 className="font-display text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--color-fg)] sm:text-5xl lg:text-[3.5rem]">
              Quiet. Clear.
              <br />
              Research-ready.
            </h1>
            <p className="max-w-md text-[var(--color-fg-muted)] leading-relaxed">
              Research peptides priced by{" "}
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
                <Link to="/preorder">Purchase next shipment</Link>
              </Button>
            </div>
          </div>

          {/* Multi-shot hero — not a single plain vial */}
          <div className="mx-auto w-full max-w-md space-y-3">
            <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-soft)]">
              <img
                src={HERO_SHOTS[0].src}
                alt={HERO_SHOTS[0].alt}
                className="aspect-[4/5] w-full object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white">
                <img
                  src={HERO_SHOTS[1].src}
                  alt={HERO_SHOTS[1].alt}
                  className="aspect-square w-full object-cover object-center"
                />
              </div>
              <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white">
                <img
                  src={HERO_SHOTS[2].src}
                  alt={HERO_SHOTS[2].alt}
                  className="aspect-square w-full object-cover object-center"
                />
              </div>
            </div>
            <p className="text-center text-[11px] tracking-[0.12em] text-[var(--color-fg-subtle)] uppercase">
              Studio · research vials · no claims
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

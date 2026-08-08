import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { featuredProducts, PRESALE } from "@/lib/products";
import { recentlyTested } from "@/lib/traceabl-batches";

export const Route = createFileRoute("/_app/")({
  component: HomePage,
});

function HomePage() {
  const featured = featuredProducts();
  const recent = recentlyTested(6);

  return (
    <main>
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
          <div className="space-y-6">
            <p className="text-[11px] font-medium tracking-[0.2em] text-[var(--color-primary)] uppercase">
              Research products · Traceabl verified
            </p>
            <h1 className="font-display text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--color-fg)] sm:text-5xl lg:text-[3.5rem]">
              Quiet. Clear.
              <br />
              Verified.
            </h1>
            <p className="max-w-md text-[var(--color-fg-muted)] leading-relaxed">
              Research peptides with batch COAs you can open. Each product lists the LOT you will
              receive and links to its Traceabl report.
              {PRESALE.active ? (
                <>
                  {" "}
                  <span className="text-[var(--color-fg)]">
                    {PRESALE.label} — {PRESALE.discountLabel}.
                  </span>
                </>
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
                <Link to="/transparency">Traceabl Testing</Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xs">
            <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white">
              <img
                src="/products/vial-nad.jpg"
                alt="Grael research vial"
                className="aspect-[4/5] w-full object-cover object-center"
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

      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Recently tested
              </h2>
              <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
                Batches currently offered — open the COA for the lot you would order.
              </p>
            </div>
            <Link
              to="/transparency"
              className="text-sm text-[var(--color-primary)] no-underline hover:underline"
            >
              Traceabl Testing →
            </Link>
          </div>
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-xs text-[var(--color-fg-subtle)]">
                <tr>
                  <th className="px-3 py-2.5 font-medium">Product</th>
                  <th className="px-3 py-2.5 font-medium">Batch</th>
                  <th className="hidden px-3 py-2.5 font-medium sm:table-cell">Purity</th>
                  <th className="px-3 py-2.5 font-medium">COA</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((b) => (
                  <tr
                    key={b.batchId}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <td className="px-3 py-3">
                      <Link
                        to="/products/$sku"
                        params={{ sku: b.sku }}
                        className="font-medium text-[var(--color-fg)] no-underline hover:underline"
                      >
                        {b.compound}
                      </Link>
                      <p className="text-xs text-[var(--color-fg-subtle)]">{b.strength}</p>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-[var(--color-fg-muted)]">
                      {b.batchId}
                    </td>
                    <td className="hidden px-3 py-3 tabular text-[var(--color-primary)] sm:table-cell">
                      {b.purityPercent.toFixed(1)}%
                    </td>
                    <td className="px-3 py-3">
                      <a
                        href={b.coaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] no-underline hover:underline"
                      >
                        View
                        <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

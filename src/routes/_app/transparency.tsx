import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { SecurityDemo } from "@/components/security-demo";
import { ShopProductsCard } from "@/components/shop-products-card";
import {
  recentlyTested,
  TRACEABL_SECURITY,
  TRACEABL_SITE,
  TRACEABL_TURNAROUND,
} from "@/lib/traceabl-batches";

export const Route = createFileRoute("/_app/transparency")({
  component: TraceablTestingPage,
});

function TraceablTestingPage() {
  const recent = recentlyTested();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-10 max-w-2xl space-y-3">
        <p className="text-xs font-medium tracking-[0.14em] text-[var(--color-primary)] uppercase">
          Traceabl Testing
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Independent purity testing from Traceabl
        </h1>
        <p className="text-[var(--color-fg-muted)] leading-relaxed">
          Independent third-party testing has been ordered for all peptides and will be posted
          shortly. Results will be measured by{" "}
          <a
            href={TRACEABL_SITE}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--color-primary)] no-underline hover:underline"
          >
            Traceabl.us
          </a>
          {" "}
          with a batch-bound report, integrity hash, and public verify path.
        </p>
        <p className="inline-flex flex-wrap items-baseline gap-x-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3 py-2 text-sm">
          <span className="font-medium text-[var(--color-fg)]">{TRACEABL_TURNAROUND.label}</span>
          <span className="text-[var(--color-fg-muted)]">{TRACEABL_TURNAROUND.detail}</span>
        </p>
      </div>

      <section className="mb-12 grid gap-8 lg:grid-cols-2 lg:items-start">
        <ShopProductsCard limit={8} />
        <div className="space-y-3">
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Recently tested products
          </h2>
          <p className="text-sm text-[var(--color-fg-muted)]">
            Batches currently in the shop. Open the COA for the lot you would receive.
          </p>
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)]">
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

      <section className="mb-12">
        <h2 className="mb-4 font-display text-xl font-semibold tracking-tight">
          Security features
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TRACEABL_SECURITY.map((item) => (
            <article
              key={item.title}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-4"
            >
              <h3 className="text-sm font-semibold text-[var(--color-fg)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-8 max-w-xl">
        <SecurityDemo />
      </section>

      <p className="text-xs text-[var(--color-fg-subtle)] leading-relaxed">
        Testing status: {TRACEABL_TURNAROUND.detail.toLowerCase()}. COA links open Traceabl’s
        public path for that batch ID. Research use only.
      </p>
    </main>
  );
}

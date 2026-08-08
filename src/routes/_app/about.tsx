import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="space-y-3">
        <p className="text-xs font-medium tracking-[0.14em] text-[var(--color-primary)] uppercase">
          About
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Grael and Traceabl
        </h1>
        <p className="text-lg text-[var(--color-fg-muted)]">
          Research peptides with independent batch verification.
        </p>
      </div>

      <div className="mt-10 space-y-8 text-[var(--color-fg-muted)] leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-[var(--color-fg)]">Grael</h2>
          <p>
            Grael is the research peptide storefront. Launch inventory focuses on high-demand
            laboratory compounds — metabolic agonists, tissue-repair peptides, cellular energy and
            longevity research tools — sold strictly for research use only.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-[var(--color-fg)]">Traceabl</h2>
          <p>
            Traceabl (traceabl.us) provides independent purity testing and Certificates of
            Analysis. Grael labels are designed to carry Traceabl QR codes so every batch is
            externally verifiable.
          </p>
          <Button variant="secondary" asChild>
            <Link to="/transparency">See Traceabl flow</Link>
          </Button>
        </section>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="font-display text-xl font-semibold text-[var(--color-fg)]">
            Preorder launch
          </h2>
          <p className="mt-2">
            This site is the launch surface for Grael. Preorders capture demand before wholesale
            stock is ordered with testing funds. When batches clear Traceabl, invoices go out and
            vials ship with full labeling.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/preorder">Start a preorder</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/catalog">View catalog</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

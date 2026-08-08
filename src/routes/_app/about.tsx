import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/mail-order";

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

        <section className="space-y-3">
          <h2 className="font-display text-xl font-semibold text-[var(--color-fg)]">
            Mail order
          </h2>
          <p>
            Grael is a mail-order research catalog. Order on graelpeptides.com, pay by card
            (or partner invoice for cash/wire wholesale), and we ship US only. Next-shipment
            reserves lock prices until the consolidated order goes out.
          </p>
        </section>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-3">
          <h2 className="font-display text-xl font-semibold text-[var(--color-fg)]">
            {CONTACT.cashInvoice.title}
          </h2>
          <p className="text-[var(--color-fg-muted)]">
            Wholesale partners who want to pay cash, wire, or Zelle: request a Stripe invoice.
            Do not mail cash. After settlement we mark the invoice paid and place your order.
          </p>
          <p className="font-mono text-sm text-[var(--color-primary)]">{CONTACT.email}</p>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-[var(--color-fg-muted)]">
            {CONTACT.cashInvoice.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p className="text-xs text-[var(--color-fg-subtle)]">{CONTACT.cashInvoice.note}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <a href={CONTACT.emailMailto}>Request an invoice</a>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/pamphlet">Partner price sheet</Link>
            </Button>
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <h2 className="font-display text-xl font-semibold text-[var(--color-fg)]">
            Launch
          </h2>
          <p className="mt-2">
            While supplies last. 10-vial packs and single vials. Partner wholesale sheets are
            printed without codes — codes go by text only.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/catalog">View catalog</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/preorder">Next shipment</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/pamphlet">Print partner pamphlet</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CONTACT,
  formatMoney,
  MAIL_ORDER,
  pamphletRows,
  SITE_HOST,
  SITE_URL,
} from "@/lib/mail-order";

export const Route = createFileRoute("/_app/pamphlet")({
  component: PamphletPage,
});

function PamphletPage() {
  const rows = pamphletRows();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 print:max-w-none print:px-0 print:py-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <p className="text-xs font-medium tracking-[0.14em] text-[var(--color-primary)] uppercase">
            Print
          </p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Partner pamphlet
          </h1>
          <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
            Mail-order sheet · invoice contact · cash option. Code stays off the print — text it.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" strokeWidth={1.5} />
            Print pamphlet
          </Button>
          <Button size="sm" variant="secondary" asChild>
            <a href={CONTACT.emailMailto}>Email invoice contact</a>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link to="/catalog">Shop</Link>
          </Button>
        </div>
      </div>

      <article className="pamphlet space-y-0 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-soft)] print:rounded-none print:border-0 print:shadow-none">
        <section className="border-b border-[var(--color-border)] p-6 sm:p-8 print:break-inside-avoid print:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-border)] pb-5">
            <div>
              <p className="font-display text-4xl font-semibold tracking-tight text-[var(--color-fg)]">
                {MAIL_ORDER.title}
              </p>
              <p className="mt-1 text-sm tracking-[0.16em] text-[var(--color-primary)] uppercase">
                {MAIL_ORDER.tagline}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-medium text-[var(--color-fg)]">{SITE_HOST}</p>
              <p className="text-xs text-[var(--color-fg-subtle)]">{SITE_URL}</p>
              <p className="mt-1 font-mono text-xs font-medium text-[var(--color-primary)]">
                {CONTACT.email}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-xs font-medium tracking-[0.14em] text-[var(--color-fg-subtle)] uppercase">
                Mail-order flow
              </h2>
              <ol className="mt-3 space-y-2 text-sm text-[var(--color-fg-muted)]">
                {MAIL_ORDER.howItWorks.map((step, i) => (
                  <li key={step} className="flex gap-2">
                    <span className="font-mono text-[var(--color-primary)]">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
              <h2 className="text-xs font-medium tracking-[0.14em] text-[var(--color-fg-subtle)] uppercase">
                {CONTACT.cashInvoice.title}
              </h2>
              <ol className="mt-3 space-y-2 text-sm text-[var(--color-fg-muted)]">
                {CONTACT.cashInvoice.steps.map((step, i) => (
                  <li key={step} className="flex gap-2">
                    <span className="font-mono text-[var(--color-primary)]">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-xs leading-relaxed text-[var(--color-fg-subtle)]">
                {CONTACT.cashInvoice.note}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5 px-4 py-3">
              <p className="text-sm font-medium text-[var(--color-fg)]">Invoice contact</p>
              <p className="mt-1 font-mono text-sm text-[var(--color-primary)]">{CONTACT.email}</p>
              <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
                {MAIL_ORDER.invoiceContactLine}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3">
              <p className="text-sm font-medium text-[var(--color-fg)]">Terms</p>
              <ul className="mt-2 space-y-1 text-xs text-[var(--color-fg-muted)]">
                <li>{MAIL_ORDER.shippingNote}</li>
                <li>{MAIL_ORDER.shipEstimate}</li>
                <li>{MAIL_ORDER.nextShip}</li>
                <li>10-vial packs + single vials</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3">
            <p className="text-sm text-[var(--color-fg-muted)]">{MAIL_ORDER.partnerCodeNote}</p>
            <p className="mt-2 text-xs text-[var(--color-fg-subtle)]">{MAIL_ORDER.ruo}</p>
          </div>
        </section>

        <section className="p-6 sm:p-8 print:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {MAIL_ORDER.partnerLabel}
              </h2>
              <p className="text-sm text-[var(--color-fg-muted)]">
                {MAIL_ORDER.partnerDiscountLabel} · unbreakable 10-packs only · card or invoice
              </p>
            </div>
            <p className="text-xs text-[var(--color-fg-subtle)]">
              {CONTACT.email} · {SITE_HOST}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border-strong)] text-[11px] tracking-[0.08em] text-[var(--color-fg-subtle)] uppercase">
                  <th className="py-2 pr-2 font-medium">Compound</th>
                  <th className="py-2 pr-2 font-medium">Size</th>
                  <th className="py-2 pr-2 text-right font-medium">10-pack public</th>
                  <th className="py-2 text-right font-medium text-[var(--color-primary)]">
                    10-pack partner
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.baseSku}
                    className="border-b border-[var(--color-border)] text-[var(--color-fg)]"
                  >
                    <td className="py-2.5 pr-2 font-medium">{r.name}</td>
                    <td className="py-2.5 pr-2 font-mono text-xs text-[var(--color-fg-muted)]">
                      {r.strength}
                    </td>
                    <td className="py-2.5 pr-2 text-right tabular text-[var(--color-fg-muted)]">
                      {formatMoney(r.kitLaunch)}
                    </td>
                    <td className="py-2.5 text-right font-medium tabular text-[var(--color-primary)]">
                      {formatMoney(r.kitPartner)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 border-t border-[var(--color-border)] pt-5 text-xs text-[var(--color-fg-subtle)] sm:grid-cols-3">
            <p>
              <span className="font-medium text-[var(--color-fg-muted)]">Order online (card)</span>
              <br />
              {SITE_URL}
            </p>
            <p>
              <span className="font-medium text-[var(--color-fg-muted)]">Invoice / cash wholesale</span>
              <br />
              {CONTACT.email}
            </p>
            <p>
              <span className="font-medium text-[var(--color-fg-muted)]">Partner code</span>
              <br />
              By text only · never on this sheet
            </p>
          </div>

          <p className="mt-6 text-center font-display text-lg tracking-wide text-[var(--color-fg)]">
            {SITE_HOST}
          </p>
          <p className="text-center font-mono text-sm text-[var(--color-primary)]">{CONTACT.email}</p>
          <p className="mt-1 text-center text-[11px] text-[var(--color-fg-subtle)]">
            {MAIL_ORDER.ruo}
          </p>
        </section>
      </article>

      <p className="mt-4 text-center text-xs text-[var(--color-fg-subtle)] print:hidden">
        Create the mailbox {CONTACT.email} (or forward it) so partner requests land in your inbox.
      </p>
    </main>
  );
}

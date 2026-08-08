import { Link } from "@tanstack/react-router";
import { CheckCircle2, FlaskConical, Link2, QrCode, ShieldCheck } from "lucide-react";
import { TRACEABL_SITE } from "@/lib/traceabl-examples";
import { cn } from "@/lib/utils";

const signals = [
  {
    icon: FlaskConical,
    title: "Lab tested",
    body: "Independent HPLC identity & purity before release — not self-declared labels.",
  },
  {
    icon: QrCode,
    title: "Traceabl QR on every vial",
    body: "Scan the label to open the batch COA for that specific lot.",
  },
  {
    icon: Link2,
    title: "Blockchain-registered result",
    body: "Each COA is hashed and registered so the report can be verified, not swapped.",
  },
  {
    icon: ShieldCheck,
    title: "Batch-locked labels",
    body: "LOT, EXP, and verification key print only after the Traceabl result is final.",
  },
] as const;

export function TrustSignalsBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]",
        className,
      )}
    >
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {signals.map(({ icon: Icon, title }) => (
          <div key={title} className="flex items-center gap-2.5 text-sm text-[var(--color-fg)]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/8 text-[var(--color-primary)]">
              <Icon className="h-4 w-4" strokeWidth={1.5} />
            </span>
            <span className="font-medium leading-snug">{title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrustSignalsSection() {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="text-[11px] font-medium tracking-[0.18em] text-[var(--color-primary)] uppercase">
            Lab tested · Traceable
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            The label is the COA.
          </h2>
          <p className="text-[var(--color-fg-muted)] leading-relaxed">
            Every finished Grael vial carries a Traceabl QR. Scan it to open the{" "}
            <strong className="font-medium text-[var(--color-fg)]">batch COA</strong> for that lot —
            purity, method, verification key — with the result{" "}
            <strong className="font-medium text-[var(--color-fg)]">
              registered on-chain for integrity
            </strong>
            . No PDF lost in email. No swapped report.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {signals.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-5"
            >
              <Icon className="h-5 w-5 text-[var(--color-primary)]" strokeWidth={1.5} />
              <h3 className="mt-3 font-display text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">{body}</p>
            </article>
          ))}
        </div>

        <ol className="mt-10 grid gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:grid-cols-4">
          {[
            "Batch tested at Traceabl",
            "COA issued + hash registered",
            "QR + LOT printed on label",
            "Buyer scans → live verify",
          ].map((step, i) => (
            <li key={step} className="flex gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[11px] font-semibold text-[var(--color-primary-fg)]">
                {i + 1}
              </span>
              <span className="text-[var(--color-fg-muted)] leading-snug pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/transparency"
            className="inline-flex h-11 items-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-5 text-sm font-medium text-[var(--color-primary-fg)] no-underline"
          >
            See Traceabl examples
          </Link>
          <a
            href={TRACEABL_SITE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-card)] px-5 text-sm font-medium text-[var(--color-fg)] no-underline"
          >
            Open Traceabl.us
          </a>
        </div>
      </div>
    </section>
  );
}

export function ProductTrustStrip({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid gap-2 text-xs text-[var(--color-fg-muted)] sm:grid-cols-3",
        className,
      )}
    >
      <li className="flex items-center gap-1.5">
        <FlaskConical className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" strokeWidth={1.5} />
        Lab tested (HPLC)
      </li>
      <li className="flex items-center gap-1.5">
        <QrCode className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" strokeWidth={1.5} />
        Traceabl batch QR
      </li>
      <li className="flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" strokeWidth={1.5} />
        On-chain COA record
      </li>
    </ul>
  );
}

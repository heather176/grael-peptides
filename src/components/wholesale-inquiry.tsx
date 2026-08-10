import { CONTACT } from "@/lib/mail-order";

/** Site-wide cue: wholesale pricing available via wholesale@ */
export function WholesaleInquiryBanner({ className }: { className?: string }) {
  return (
    <section
      className={
        className ??
        "border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]"
      }
      aria-label="Wholesale pricing"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="max-w-xl space-y-1">
          <p className="text-[10px] font-medium tracking-[0.16em] text-[var(--color-fg-subtle)] uppercase">
            Wholesale & partners
          </p>
          <p className="font-display text-xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-2xl">
            Wholesale pricing available
          </p>
          <p className="text-sm text-[var(--color-fg-muted)] sm:text-base">
            Resellers and labs: ask for partner rates, invoice billing, and volume packs. Research use
            only.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <a
            href={CONTACT.emailMailto}
            className="inline-flex items-center rounded-full bg-[var(--color-fg)] px-5 py-2.5 text-sm font-medium text-[var(--color-bg)] no-underline transition-opacity hover:opacity-90"
          >
            Email {CONTACT.email}
          </a>
          <p className="font-mono text-xs text-[var(--color-fg-subtle)]">{CONTACT.email}</p>
        </div>
      </div>
    </section>
  );
}

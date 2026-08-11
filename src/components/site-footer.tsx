import { Link } from "@tanstack/react-router";
import { GraelWordmark } from "@/components/grael-wordmark";
import { CONTACT } from "@/lib/mail-order";
import { LAUNCH, NEXT_SHIPMENT, TESTING_ORDERED } from "@/lib/products";
import { TRACEABL_SITE } from "@/lib/traceabl-batches";

const VERSION = "1.6.3";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="space-y-3">
          <GraelWordmark size="md" withMark className="text-[2rem]" />
          <p className="max-w-xs text-sm text-[var(--color-fg-muted)]">
            Research products. {LAUNCH.suppliesLabel}. {TESTING_ORDERED}
          </p>
          {NEXT_SHIPMENT.active ? (
            <p className="max-w-xs text-xs text-[var(--color-fg-subtle)]">
              Next shipment estimated {NEXT_SHIPMENT.estimatedShipLabel}.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link to="/catalog" className="text-[var(--color-fg-muted)] no-underline hover:text-[var(--color-fg)]">
            Shop
          </Link>
          <Link
            to="/preorder"
            className="text-[var(--color-fg-muted)] no-underline hover:text-[var(--color-fg)]"
          >
            Next shipment
          </Link>
          <a
            href={CONTACT.emailMailto}
            className="text-[var(--color-fg-muted)] no-underline hover:text-[var(--color-fg)]"
          >
            Contact
          </a>
          <a
            href={TRACEABL_SITE}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--color-fg-muted)] no-underline hover:text-[var(--color-fg)]"
          >
            Traceabl.us
          </a>
        </div>
      </div>
      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-xs text-[var(--color-fg-subtle)] sm:flex-row sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} Grael Peptides · v{VERSION}
          </p>
          <p>Research use only. Not for human or animal use.</p>
        </div>
      </div>
    </footer>
  );
}

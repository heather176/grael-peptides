import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/lab/")({
  component: LabHomePage,
});

function LabHomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 max-w-xl space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Lab tools</h1>
        <p className="text-sm text-[var(--color-fg-muted)]">
          Internal workspace — wholesale partner sheets, vial labels. Not linked in the public shop
          nav.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-soft)]">
          <FileText className="h-6 w-6 text-[var(--color-fg-muted)]" strokeWidth={1.5} />
          <h2 className="mt-4 font-display text-xl font-semibold tracking-tight">
            Wholesale partner sheet
          </h2>
          <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
            Adjust discount, rounding, singles, and sheet date. Download a dated PDF for partners.
          </p>
          <Button className="mt-5" asChild>
            <Link to="/lab/wholesale">Open wholesale sheet</Link>
          </Button>
        </article>

        <article className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-soft)]">
          <Tags className="h-6 w-6 text-[var(--color-fg-muted)]" strokeWidth={1.5} />
          <h2 className="mt-4 font-display text-xl font-semibold tracking-tight">Vial labels</h2>
          <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
            Generate print-ready vial labels for production.
          </p>
          <Button className="mt-5" variant="secondary" asChild>
            <Link to="/labels">Open label studio</Link>
          </Button>
        </article>
      </div>
    </main>
  );
}

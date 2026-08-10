import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Tags, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/lab/")({
  component: LabHomePage,
});

function LabHomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 max-w-xl space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Lab tools</h1>
        <p className="text-base text-[var(--color-fg-muted)]">
          Internal workspace — pricing worksheet, wholesale partner sheets, vial labels. Not in the
          public shop nav.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-soft)]">
          <Table2 className="h-6 w-6 text-[var(--color-fg-muted)]" strokeWidth={1.5} />
          <h2 className="mt-4 font-display text-xl font-semibold tracking-tight">
            Pricing worksheet
          </h2>
          <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
            Private cost / retail / wholesale margins from your supplier quote. Push to site or
            wholesale sheet.
          </p>
          <Button className="mt-5" asChild>
            <Link to="/lab/pricing">Open pricing</Link>
          </Button>
        </article>

        <article className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-soft)]">
          <FileText className="h-6 w-6 text-[var(--color-fg-muted)]" strokeWidth={1.5} />
          <h2 className="mt-4 font-display text-xl font-semibold tracking-tight">
            Wholesale partner sheet
          </h2>
          <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
            Client sheets, codes, shipping, PDF. Pulls costs from the pricing worksheet when you
            push.
          </p>
          <Button className="mt-5" variant="secondary" asChild>
            <Link to="/lab/wholesale">Open wholesale</Link>
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/lab/")({
  component: LabHomePage,
});

function LabHomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Lab tools</h1>
      <p className="mt-2 text-[var(--color-fg-muted)]">
        Internal workspace for labels and cost worksheets.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/labels">Vial labels</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/lab/pricing">Pricing worksheet</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/catalog">Back to shop</Link>
        </Button>
      </div>
    </main>
  );
}

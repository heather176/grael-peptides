import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { RuoBanner } from "@/components/ruo-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart-store";
import { submitPreorder } from "@/lib/preorders";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/_app/preorder")({
  component: PreorderPage,
});

type Result = {
  id: string;
  subtotal: number;
  email: string;
  fullName: string;
};

function PreorderPage() {
  const lines = useCart((s) => s.lines);
  const hydrated = useCart((s) => s.hydrated);
  const setHydrated = useCart((s) => s.setHydrated);
  const enriched = useCart((s) => s.enriched);
  const subtotal = useCart((s) => s.subtotal);
  const clear = useCart((s) => s.clear);

  useEffect(() => {
    // If persist already finished before mount, mark hydrated.
    if (useCart.persist.hasHydrated()) setHydrated(true);
    const unsub = useCart.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, [setHydrated]);

  const ready = hydrated;
  const items = ready ? enriched() : [];
  const total = ready ? subtotal() : 0;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [notes, setNotes] = useState("");
  const [ack, setAck] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const canSubmit = useMemo(
    () => items.length > 0 && fullName.trim().length >= 2 && email.includes("@") && ack && !submitting,
    [items.length, fullName, email, ack, submitting],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await submitPreorder({
        data: {
          fullName: fullName.trim(),
          email: email.trim(),
          institution: institution.trim() || undefined,
          notes: notes.trim() || undefined,
          researchAck: true as const,
          lines: items.map((i) => ({ sku: i.sku, qty: i.qty })),
        },
      });
      setResult(res);
      clear();
      toast.success("Preorder submitted");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not submit preorder";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-8 text-center shadow-[var(--shadow-soft)]">
          <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--color-success)]" strokeWidth={1.5} />
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">Preorder received</h1>
          <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
            Thanks, {result.fullName}. We logged request{" "}
            <span className="font-mono text-[var(--color-fg)]">{result.id}</span> for{" "}
            {formatUsd(result.subtotal)} estimated.
          </p>
          <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
            Confirmation details will go to <span className="text-[var(--color-fg)]">{result.email}</span>{" "}
            when fulfillment opens. No payment has been charged.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link to="/catalog">Back to catalog</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/transparency">Traceable info</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 max-w-2xl space-y-3">
        <p className="text-xs font-medium tracking-[0.14em] text-[var(--color-primary)] uppercase">
          Preorder
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Reserve launch inventory
        </h1>
        <p className="text-[var(--color-fg-muted)]">
          Submit research contact details and your cart. We confirm batches after Traceable testing
          and send a final invoice before shipping.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-soft)]"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Researcher name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@lab.org"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">Institution / lab (optional)</Label>
            <Input
              id="institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Organization"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Desired ship window, special handling, related SKUs…"
            />
          </div>

          <label className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-sm text-[var(--color-fg-muted)]">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
            />
            <span>
              I confirm these materials are ordered strictly for laboratory research use only, not
              for human or animal consumption, clinical use, or compounding, and I accept all
              applicable laws for research chemicals.
            </span>
          </label>

          <RuoBanner compact />

          <Button type="submit" size="lg" className="w-full" disabled={!canSubmit}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit research preorder"
            )}
          </Button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Cart summary</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/cart">Edit</Link>
              </Button>
            </div>

            {!ready ? (
              <div className="space-y-3">
                <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--color-bg-subtle)]" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--color-bg-subtle)]" />
              </div>
            ) : items.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-[var(--color-fg-muted)]">
                  No items yet. Add compounds from the catalog first.
                </p>
                <Button variant="secondary" asChild>
                  <Link to="/catalog">Open catalog</Link>
                </Button>
              </div>
            ) : (
              <ul className="space-y-3">
                {items.map(({ sku, qty, product }) => (
                  <li key={sku} className="flex items-start justify-between gap-3 text-sm">
                    <div>
                      <p className="font-medium text-[var(--color-fg)]">{product.name}</p>
                      <p className="font-mono text-xs text-[var(--color-fg-subtle)]">
                        {sku} × {qty}
                      </p>
                    </div>
                    <p className="tabular text-[var(--color-fg-muted)]">
                      {formatUsd(product.price * qty)}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
              <span className="text-sm text-[var(--color-fg-muted)]">Estimated total</span>
              <span className="font-display text-2xl font-semibold tabular">{formatUsd(total)}</span>
            </div>
            <p className="mt-2 text-xs text-[var(--color-fg-subtle)]">
              {lines.length} line{lines.length === 1 ? "" : "s"} in session cart
            </p>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-5 text-sm text-[var(--color-fg-muted)]">
            <p className="font-medium text-[var(--color-fg)]">What happens next</p>
            <ol className="mt-3 list-decimal space-y-2 pl-4">
              <li>We log demand against the launch catalog.</li>
              <li>Wholesale stock is ordered when testing funds clear.</li>
              <li>Traceable COAs attach per batch; you get a final invoice.</li>
              <li>Vials ship with Traceabl QR labels and COAs.</li>
            </ol>
          </div>
        </aside>
      </div>
    </main>
  );
}

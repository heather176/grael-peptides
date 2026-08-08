import { useState } from "react";
import { Check, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DISCOUNT_REASON_COPY } from "@/lib/discount-codes";
import { useDiscount } from "@/lib/discount-store";

export function DiscountCodeForm({ className }: { className?: string }) {
  const code = useDiscount((s) => s.code);
  const apply = useDiscount((s) => s.apply);
  const clear = useDiscount((s) => s.clear);
  const def = useDiscount((s) => s.activeDef());
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = apply(draft);
    if (!result.ok) {
      const msg =
        result.reason in DISCOUNT_REASON_COPY
          ? DISCOUNT_REASON_COPY[result.reason as keyof typeof DISCOUNT_REASON_COPY]
          : "Could not apply code.";
      setError(msg);
      toast.error(msg);
      return;
    }
    setDraft("");
    toast.success(`${result.def.label} pricing applied (−${result.def.percentOff}%)`);
  }

  if (def && code) {
    return (
      <div
        className={
          className ??
          "rounded-[var(--radius-lg)] border border-[var(--color-primary)]/35 bg-[var(--color-primary)]/8 p-4"
        }
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
              <Check className="h-4 w-4 shrink-0" strokeWidth={2} />
              {def.label} · {code}
            </p>
            <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
              −{def.percentOff}% off launch unit prices. Code is prefilled at Stripe checkout.
              {def.expiresAt
                ? ` Expires ${new Date(def.expiresAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}.`
                : null}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-[var(--color-fg-muted)]"
            onClick={() => {
              clear();
              toast.message("Discount code removed");
            }}
          >
            <X className="h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={
        className ??
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-4"
      }
    >
      <label
        htmlFor="discount-code"
        className="flex items-center gap-2 text-sm font-medium text-[var(--color-fg)]"
      >
        <Tag className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.5} />
        Wholesale / partner code
      </label>
      <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
        Have a wholesale code? Apply it here — prices update and Stripe checkout uses the same code.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Input
          id="discount-code"
          name="discount-code"
          autoComplete="off"
          spellCheck={false}
          placeholder="Enter code"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
          }}
          className="font-mono uppercase tracking-wide sm:flex-1"
        />
        <Button type="submit" className="sm:w-auto">
          Apply
        </Button>
      </div>
      {error ? <p className="mt-2 text-xs text-[var(--color-danger)]">{error}</p> : null}
    </form>
  );
}

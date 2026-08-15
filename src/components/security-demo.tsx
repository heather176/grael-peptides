import { useMemo, useState } from "react";
import { CheckCircle2, Link2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT_BATCHES } from "@/lib/traceabl-batches";
import { cn } from "@/lib/utils";

/**
 * Interactive integrity demo — no verification keys or secrets the user can copy
 * and reuse. Shows pass/fail of a registered result hash for a real Grael batch.
 */
export function SecurityDemo() {
  const sample = PRODUCT_BATCHES[0]!; // First remaining catalog batch as demo subject
  const [tampered, setTampered] = useState(false);
  const [checked, setChecked] = useState(false);

  const hashPreview = useMemo(() => {
    // Deterministic fake hash preview from batch id — display only, not a real key
    const seed = sample.batchId;
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const base = h.toString(16).padStart(8, "0") + (h ^ 0x9e3779b9).toString(16).padStart(8, "0");
    return `0x${base}…${(h % 0xffff).toString(16).padStart(4, "0")}`;
  }, [sample.batchId]);

  const match = checked && !tampered;
  const fail = checked && tampered;

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-5 sm:p-6">
      <p className="text-[11px] font-medium tracking-[0.14em] text-[var(--color-primary)] uppercase">
        Integrity demo
      </p>
      <h3 className="mt-1 font-display text-xl font-semibold tracking-tight">
        Why a registered result matters
      </h3>
      <p className="mt-2 text-sm text-[var(--color-fg-muted)] leading-relaxed">
        This walks through what Traceabl protects — without exposing a reusable verification key.
        Toggle “tamper” to see how an altered report fails the integrity check.
      </p>

      <div className="mt-5 space-y-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4 text-sm">
        <div className="flex justify-between gap-3">
          <span className="text-[var(--color-fg-subtle)]">Batch</span>
          <span className="font-mono text-xs text-[var(--color-fg)]">{sample.batchId}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-[var(--color-fg-subtle)]">Compound</span>
          <span className="text-[var(--color-fg)]">
            {sample.compound} · {sample.strength}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-[var(--color-fg-subtle)]">Reported purity</span>
          <span className="tabular font-medium text-[var(--color-fg)]">
            {tampered ? "97.0%" : `${sample.purityPercent.toFixed(1)}%`}
            {tampered ? (
              <span className="ml-2 text-xs font-normal text-[var(--color-danger)]">edited</span>
            ) : null}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-[var(--color-fg-subtle)]">Registered hash</span>
          <span className="font-mono text-[10px] text-[var(--color-fg-muted)]">{hashPreview}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={tampered ? "secondary" : "outline"}
          className="h-8"
          type="button"
          onClick={() => {
            setTampered((v) => !v);
            setChecked(false);
          }}
        >
          {tampered ? "Restore original report" : "Simulate tampered report"}
        </Button>
        <Button
          size="sm"
          className="h-8"
          type="button"
          onClick={() => setChecked(true)}
        >
          Run integrity check
        </Button>
      </div>

      {checked ? (
        <div
          className={cn(
            "mt-4 flex items-start gap-2 rounded-[var(--radius-md)] border px-3 py-2.5 text-sm",
            match
              ? "border-[var(--color-primary)]/25 bg-[var(--color-primary)]/8 text-[var(--color-primary)]"
              : "border-[var(--color-danger)]/30 bg-[var(--color-danger)]/8 text-[var(--color-danger)]",
          )}
        >
          {match ? (
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
          ) : (
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
          )}
          <p>
            {match
              ? "Pass — report payload matches the registered hash for this batch."
              : "Fail — purity field no longer matches the registered result. Altered COAs do not verify."}
          </p>
        </div>
      ) : null}

      <ul className="mt-5 space-y-2 text-xs text-[var(--color-fg-subtle)]">
        <li className="flex gap-2">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
          Live verification always happens on Traceabl with the vial QR — keys are never printed here
          for copy-paste reuse.
        </li>
        <li className="flex gap-2">
          <Link2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" />
          Hash preview above is a UI illustration, not a secret you can redeem.
        </li>
      </ul>
    </div>
  );
}

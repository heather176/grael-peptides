import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw, Store, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  buildRows,
  loadWorksheet,
  money,
  pushToWebsite,
  pushToWholesaleSheet,
  saveWorksheet,
  type PricingFields,
  type PricingWorksheetState,
} from "@/lib/pricing-worksheet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/lab/pricing")({
  component: LabPricingPage,
});

const FIELDS: { key: keyof PricingFields; label: string; short: string }[] = [
  { key: "boxCost", label: "Our cost (1 box)", short: "Cost" },
  { key: "kitRetail", label: "Retail 10-pack", short: "Retail 10" },
  { key: "kitList", label: "List 10-pack", short: "List 10" },
  { key: "kitWholesale", label: "Partner 10-pack", short: "WS 10" },
  { key: "singleRetail", label: "Retail 1 vial", short: "Retail 1" },
  { key: "singleList", label: "List 1 vial", short: "List 1" },
  { key: "singleWholesale", label: "Partner 1 vial", short: "WS 1" },
];

function LabPricingPage() {
  const [state, setState] = useState<PricingWorksheetState>({ overrides: {}, updatedAt: "" });
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState<"all" | "site" | "quote">("site");

  useEffect(() => {
    setState(loadWorksheet());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveWorksheet(state);
  }, [state, hydrated]);

  const rows = useMemo(() => buildRows(state), [state]);
  const visible = useMemo(() => {
    if (filter === "site") return rows.filter((r) => r.onSite);
    if (filter === "quote") return rows.filter((r) => !r.onSite);
    return rows;
  }, [rows, filter]);

  function setField(sku: string, key: keyof PricingFields, raw: string) {
    setState((s) => {
      const next = { ...s.overrides };
      const row = { ...(next[sku] ?? {}) };
      if (raw.trim() === "") {
        delete row[key];
      } else {
        const n = Number(raw);
        if (!Number.isFinite(n)) return s;
        row[key] = Math.round(n);
      }
      if (Object.keys(row).length === 0) delete next[sku];
      else next[sku] = row;
      return { ...s, overrides: next, updatedAt: new Date().toISOString() };
    });
  }

  function resetAll() {
    setState({ overrides: {}, updatedAt: new Date().toISOString() });
    toast.message("Worksheet reset to quote + catalog defaults");
  }

  function onPushSite() {
    const n = pushToWebsite(rows);
    toast.success(`Pushed ${n} catalog SKUs to website prices (this browser)`);
  }

  function onPushWholesale() {
    const n = pushToWholesaleSheet(rows);
    toast.success(`Pushed ${n} catalog cost rows`);
  }

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <p className="text-[10px] font-medium tracking-[0.18em] text-[var(--color-fg-subtle)] uppercase">
            Lab · Private
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Product pricing worksheet
          </h1>
          <p className="text-base text-[var(--color-fg-muted)]">
            Digested supplier quote (1 box = 10 vials). Edit any cell —{" "}
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-900">highlighted</span>{" "}
            means changed from default. Push catalog rows to the website prices.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={onPushSite} className="gap-2">
            <Store className="h-4 w-4" strokeWidth={1.5} />
            Push to website
          </Button>
          <Button size="sm" variant="secondary" onClick={onPushWholesale} className="gap-2">
            <Upload className="h-4 w-4" strokeWidth={1.5} />
            Save sheet data
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link to="/lab">Lab home</Link>
          </Button>
          <Button size="sm" variant="ghost" onClick={resetAll} className="gap-2">
            <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
            Reset
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["site", "On our store"],
            ["all", "Full supplier quote"],
            ["quote", "Quote only (not on site)"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              filter === id
                ? "border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]"
                : "border-[var(--color-border)] text-[var(--color-fg-muted)] hover:border-[var(--color-border-strong)]",
            )}
          >
            {label}
          </button>
        ))}
        <span className="self-center text-sm text-[var(--color-fg-subtle)]">
          {visible.length} rows
        </span>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[var(--shadow-soft)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-[10px] tracking-[0.06em] text-[var(--color-fg-subtle)] uppercase">
                <th className="sticky left-0 z-10 bg-[var(--color-bg-subtle)] px-3 py-2.5 font-medium">
                  SKU
                </th>
                <th className="px-2 py-2.5 font-medium">Product</th>
                <th className="px-2 py-2.5 font-medium">Pack</th>
                <th className="px-2 py-2.5 text-right font-medium">Our cost</th>
                <th className="px-2 py-2.5 text-right font-medium">Retail 10</th>
                <th className="px-2 py-2.5 text-right font-medium text-[var(--color-success)]">
                  Retail margin
                </th>
                <th className="px-2 py-2.5 text-right font-medium">WS 10</th>
                <th className="px-2 py-2.5 text-right font-medium text-[var(--color-success)]">
                  WS margin
                </th>
                <th className="px-2 py-2.5 text-right font-medium">Retail 1</th>
                <th className="px-2 py-2.5 text-right font-medium">WS 1</th>
                <th className="px-2 py-2.5 font-medium">Site</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr
                  key={r.sku}
                  className={cn(
                    "border-b border-[var(--color-border)]",
                    r.onSite && "bg-[var(--color-bg)]/40",
                  )}
                >
                  <td className="sticky left-0 z-10 bg-[var(--color-card)] px-3 py-1.5 font-mono text-xs font-medium">
                    {r.sku}
                  </td>
                  <td className="px-2 py-1.5 font-medium text-[var(--color-fg)]">{r.name}</td>
                  <td className="px-2 py-1.5 font-mono text-xs text-[var(--color-fg-muted)]">
                    {r.packLabel}
                  </td>
                  <EditCell
                    dirty={r.dirty.boxCost}
                    value={state.overrides[r.sku]?.boxCost}
                    display={r.boxCost}
                    onChange={(v) => setField(r.sku, "boxCost", v)}
                  />
                  <EditCell
                    dirty={r.dirty.kitRetail}
                    value={state.overrides[r.sku]?.kitRetail}
                    display={r.kitRetail}
                    onChange={(v) => setField(r.sku, "kitRetail", v)}
                  />
                  <td
                    className={cn(
                      "px-2 py-1.5 text-right font-mono tabular",
                      r.retailMarginKit >= 0
                        ? "text-[var(--color-success)]"
                        : "text-[var(--color-danger)]",
                    )}
                  >
                    {money(r.retailMarginKit)}
                  </td>
                  <EditCell
                    dirty={r.dirty.kitWholesale}
                    value={state.overrides[r.sku]?.kitWholesale}
                    display={r.kitWholesale}
                    onChange={(v) => setField(r.sku, "kitWholesale", v)}
                  />
                  <td
                    className={cn(
                      "px-2 py-1.5 text-right font-mono tabular",
                      r.wholesaleMarginKit >= 0
                        ? "text-[var(--color-success)]"
                        : "text-[var(--color-danger)]",
                    )}
                  >
                    {money(r.wholesaleMarginKit)}
                  </td>
                  <EditCell
                    dirty={r.dirty.singleRetail}
                    value={state.overrides[r.sku]?.singleRetail}
                    display={r.singleRetail}
                    onChange={(v) => setField(r.sku, "singleRetail", v)}
                  />
                  <EditCell
                    dirty={r.dirty.singleWholesale}
                    value={state.overrides[r.sku]?.singleWholesale}
                    display={r.singleWholesale}
                    onChange={(v) => setField(r.sku, "singleWholesale", v)}
                  />
                  <td className="px-2 py-1.5 text-xs">
                    {r.onSite ? (
                      <span className="rounded-full bg-[var(--color-fg)]/8 px-2 py-0.5 font-medium">
                        Live
                      </span>
                    ) : (
                      <span className="text-[var(--color-fg-subtle)]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-sm text-[var(--color-fg-subtle)]">
        <strong className="font-medium text-[var(--color-fg-muted)]">Our cost</strong> = supplier 1
        box from your quote.{" "}
        <strong className="font-medium text-[var(--color-fg-muted)]">Retail margin</strong> = retail
        10-pack − cost.{" "}
        <strong className="font-medium text-[var(--color-fg-muted)]">WS margin</strong> = partner
        wholesale − cost (before shipping). List prices editable via full override map if needed —
        defaults track catalog / estimate.
      </p>
      <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">
        Pushes apply in this browser session. Stripe payment links still use Stripe prices until you
        update those separately.
      </p>
    </main>
  );
}

function EditCell({
  dirty,
  value,
  display,
  onChange,
}: {
  dirty?: boolean;
  value?: number;
  display: number;
  onChange: (v: string) => void;
}) {
  return (
    <td className="px-1 py-1">
      <input
        type="number"
        step={1}
        min={0}
        className={cn(
          "h-9 w-full min-w-[4.25rem] rounded border px-1.5 text-right font-mono text-sm tabular outline-none focus:ring-1 focus:ring-[var(--color-primary)]",
          dirty
            ? "border-amber-400 bg-amber-50 text-amber-950"
            : "border-transparent bg-transparent text-[var(--color-fg)] hover:border-[var(--color-border)]",
        )}
        placeholder={String(display)}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        title={dirty ? `Modified · default ${display}` : `Default ${display}`}
      />
    </td>
  );
}

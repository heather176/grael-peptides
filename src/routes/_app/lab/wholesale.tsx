import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer, RotateCcw, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { GraelWordmark } from "@/components/grael-wordmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CONTACT,
  DEFAULT_PAMPHLET_OPTIONS,
  formatMoney,
  formatSheetDate,
  MAIL_ORDER,
  pamphletRows,
  SITE_HOST,
  SITE_URL,
  type PamphletOptions,
  type PriceOverride,
} from "@/lib/mail-order";
import { lookupDiscountCode, normalizeCode } from "@/lib/discount-codes";
import { upsertPartnerCode } from "@/lib/partner-code-registry";
import { downloadWholesalePdf } from "@/lib/wholesale-pdf";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/lab/wholesale")({
  component: LabWholesalePage,
});

const STORAGE_KEY = "grael-lab-wholesale-studio-v1";

function loadStored(): PamphletOptions | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return { ...DEFAULT_PAMPHLET_OPTIONS, ...JSON.parse(raw) } as PamphletOptions;
  } catch {
    return null;
  }
}

function LabWholesalePage() {
  const [opts, setOpts] = useState<PamphletOptions>({ ...DEFAULT_PAMPHLET_OPTIONS });
  const [hydrated, setHydrated] = useState(false);
  const [codeStatus, setCodeStatus] = useState<string>("");

  useEffect(() => {
    const stored = loadStored();
    if (stored) setOpts(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(opts));
    } catch {
      /* ignore */
    }
  }, [opts, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const code = opts.partnerCode.trim();
    if (!code) {
      setCodeStatus("Enter a partner code to use at checkout.");
      return;
    }
    const result = lookupDiscountCode(code);
    if (result.ok) {
      const exp = result.def.expiresAt
        ? formatSheetDate(result.def.expiresAt.slice(0, 10))
        : "no expiry";
      setCodeStatus(
        `Store: active · ${result.def.percentOff}% off list · valid through ${exp}`,
      );
    } else if (result.reason === "expired") {
      setCodeStatus("Store: EXPIRED — customers will see “That code has expired.”");
    } else if (result.reason === "inactive") {
      setCodeStatus("Store: turned off.");
    } else {
      setCodeStatus(
        "Not in store yet — click “Save code to store” so partners can use it at checkout.",
      );
    }
  }, [opts.partnerCode, opts.codeExpiresAt, opts.listOff, hydrated, opts]);

  const rows = useMemo(() => pamphletRows(opts), [opts]);
  const offPct = Math.round(opts.listOff * 100);

  function patch(p: Partial<PamphletOptions>) {
    setOpts((o) => ({ ...o, ...p }));
  }

  function setOverride(baseSku: string, field: keyof PriceOverride, value: string) {
    setOpts((o) => {
      const next = { ...o.overrides };
      const row = { ...(next[baseSku] ?? {}) };
      if (value.trim() === "") {
        delete row[field];
      } else {
        const n = Number(value);
        if (!Number.isFinite(n)) return o;
        row[field] = Math.round(n);
      }
      if (Object.keys(row).length === 0) delete next[baseSku];
      else next[baseSku] = row;
      return { ...o, overrides: next };
    });
  }

  function clearOverrides() {
    patch({ overrides: {} });
    toast.message("Manual prices cleared — back to calculated defaults");
  }

  function saveCodeToStore() {
    const code = normalizeCode(opts.partnerCode);
    if (!code) {
      toast.error("Enter a partner discount code first");
      return;
    }
    if (!opts.codeExpiresAt) {
      toast.error("Set a code expiry date");
      return;
    }
    const rec = upsertPartnerCode({
      code,
      label: opts.clientName.trim()
        ? `Wholesale · ${opts.clientName.trim()}`
        : `Wholesale ${code}`,
      percentOff: offPct,
      expiresAt: opts.codeExpiresAt,
      active: true,
      clientName: opts.clientName.trim() || undefined,
      note: `Lab studio · ${offPct}% off list · expires ${opts.codeExpiresAt}`,
    });
    toast.success(
      `Saved ${rec.code} · ${rec.percentOff}% off list · expires ${formatSheetDate(opts.codeExpiresAt)}`,
    );
    setOpts((o) => ({ ...o }));
  }

  function onPdf() {
    try {
      const name = downloadWholesalePdf(rows, opts);
      toast.success(`PDF saved · ${name}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not build PDF");
    }
  }

  function resetAll() {
    setOpts({ ...DEFAULT_PAMPHLET_OPTIONS, sheetDate: new Date().toISOString().slice(0, 10) });
    toast.message("Studio reset");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 print:max-w-none print:px-0 print:py-0">
      <div className="mb-6 space-y-4 print:hidden">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-[var(--color-fg-subtle)] uppercase">
              Lab · Pricing studio
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              Wholesale pricing studio
            </h1>
            <p className="mt-1 max-w-xl text-base text-[var(--color-fg-muted)]">
              Client name, partner code + expiry, manual prices. PDF includes 10-pack and single-vial
              charts. Saving the code makes expiry work at checkout in this browser.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={saveCodeToStore} className="gap-2">
              <Save className="h-4 w-4" strokeWidth={1.5} />
              Save code to store
            </Button>
            <Button size="sm" variant="secondary" onClick={onPdf} className="gap-2">
              <Download className="h-4 w-4" strokeWidth={1.5} />
              Download PDF
            </Button>
            <Button size="sm" variant="ghost" onClick={() => window.print()} className="gap-2">
              <Printer className="h-4 w-4" strokeWidth={1.5} />
              Print
            </Button>
            <Button size="sm" variant="ghost" onClick={clearOverrides}>
              Clear manual prices
            </Button>
            <Button size="sm" variant="ghost" onClick={resetAll} className="gap-2">
              <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
              Reset studio
            </Button>
          </div>
        </div>

        <div className="grid gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label htmlFor="clientName">Client / partner name</Label>
            <Input
              id="clientName"
              placeholder="e.g. Jason · Summit Research"
              value={opts.clientName}
              onChange={(e) => patch({ clientName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="partnerCode">Partner discount code</Label>
            <Input
              id="partnerCode"
              className="font-mono uppercase"
              placeholder="WHOLESALEJASON"
              value={opts.partnerCode}
              onChange={(e) => patch({ partnerCode: e.target.value.toUpperCase() })}
            />
            <p className="text-xs text-[var(--color-fg-subtle)]">{codeStatus}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="codeExpiresAt">Code expiry date</Label>
            <Input
              id="codeExpiresAt"
              type="date"
              value={opts.codeExpiresAt}
              onChange={(e) => patch({ codeExpiresAt: e.target.value })}
            />
            <p className="text-xs text-[var(--color-fg-subtle)]">
              After this date the store rejects the code.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sheetDate">Sheet date (PDF)</Label>
            <Input
              id="sheetDate"
              type="date"
              value={opts.sheetDate}
              onChange={(e) => patch({ sheetDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="listOff">Wholesale % off list ({offPct}%)</Label>
            <Input
              id="listOff"
              type="number"
              min={0}
              max={80}
              step={1}
              value={offPct}
              onChange={(e) =>
                patch({ listOff: Math.min(80, Math.max(0, Number(e.target.value) || 0)) / 100 })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roundMode">Default rounding</Label>
            <select
              id="roundMode"
              value={opts.roundMode}
              onChange={(e) =>
                patch({ roundMode: e.target.value === "dollar" ? "dollar" : "ten" })
              }
              className="flex h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-card)] px-3 text-sm"
            >
              <option value="ten">Nearest $10</option>
              <option value="dollar">Nearest $1</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={opts.contactEmail}
              onChange={(e) => patch({ contactEmail: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="nextShip">Next ship note</Label>
            <Input
              id="nextShip"
              value={opts.nextShipNote}
              onChange={(e) => patch({ nextShipNote: e.target.value })}
            />
          </div>
          <div className="flex flex-col justify-end gap-2">
            <Toggle
              checked={opts.printPartnerCode}
              onChange={(v) => patch({ printPartnerCode: v })}
              label="Print code on PDF (usually leave off — text it)"
            />
            <Toggle
              checked={opts.showMargin}
              onChange={(v) => patch({ showMargin: v })}
              label="Show margin columns"
            />
            <Toggle
              checked={opts.showTestingNote}
              onChange={(v) => patch({ showTestingNote: v })}
              label="Testing ordered note"
            />
            <Toggle
              checked={opts.showRuo}
              onChange={(v) => patch({ showRuo: v })}
              label="RUO disclaimer"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <p className="text-base font-medium text-[var(--color-fg)]">Manual prices for this client</p>
            <p className="text-sm text-[var(--color-fg-subtle)]">
              Blank = default math from % off list. Edits are for this sheet only (not the public
              catalog).
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-base">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs tracking-[0.08em] text-[var(--color-fg-subtle)] uppercase">
                  <th className="px-3 py-2 font-medium">Compound</th>
                  <th className="px-2 py-2 text-right font-medium">10-pack WS</th>
                  <th className="px-2 py-2 text-right font-medium">10-pack retail</th>
                  <th className="px-2 py-2 text-right font-medium">1 vial WS</th>
                  <th className="px-2 py-2 text-right font-medium">1 vial retail</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const ov = opts.overrides[r.baseSku] ?? {};
                  return (
                    <tr key={r.baseSku} className="border-b border-[var(--color-border)]">
                      <td className="px-3 py-2 font-medium text-[var(--color-fg)]">
                        {r.name}
                        <span className="mt-0.5 block font-mono text-xs font-normal text-[var(--color-fg-subtle)]">
                          {r.vialLabel}
                        </span>
                      </td>
                      <PriceCell
                        value={ov.kitWholesale}
                        placeholder={String(r.wholesale)}
                        onChange={(v) => setOverride(r.baseSku, "kitWholesale", v)}
                      />
                      <PriceCell
                        value={ov.kitRetail}
                        placeholder={String(r.suggestedRetail)}
                        onChange={(v) => setOverride(r.baseSku, "kitRetail", v)}
                      />
                      <PriceCell
                        value={ov.singleWholesale}
                        placeholder={String(r.singleWholesale)}
                        onChange={(v) => setOverride(r.baseSku, "singleWholesale", v)}
                      />
                      <PriceCell
                        value={ov.singleRetail}
                        placeholder={String(r.singleRetail)}
                        onChange={(v) => setOverride(r.baseSku, "singleRetail", v)}
                      />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Printable preview with Grael wordmark logo */}
      <article className="pamphlet space-y-0 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-soft)] print:rounded-none print:border-0 print:shadow-none">
        <section className="border-b border-[var(--color-border)] p-6 sm:p-8 print:p-6">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--color-border)] pb-6">
            <div>
              <GraelWordmark size="xl" withMark className="block" />
              <p className="mt-4 text-base tracking-[0.12em] text-[var(--color-primary)] uppercase">
                {opts.tagline}
              </p>
              {opts.clientName.trim() ? (
                <p className="mt-4 text-lg font-medium text-[var(--color-fg)]">
                  Prepared for · {opts.clientName.trim()}
                </p>
              ) : null}
              <p className="mt-2 text-base text-[var(--color-fg-muted)]">
                Sheet date · {formatSheetDate(opts.sheetDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-base font-medium text-[var(--color-fg)]">{SITE_HOST}</p>
              <p className="mt-1 font-mono text-sm font-medium text-[var(--color-primary)]">
                {opts.contactEmail}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-3 text-base">
            <p className="font-medium text-[var(--color-fg)]">Partner access</p>
            {opts.printPartnerCode && opts.partnerCode.trim() ? (
              <p className="mt-1 font-mono text-[var(--color-primary)]">
                Code · {opts.partnerCode.trim().toUpperCase()}
              </p>
            ) : (
              <p className="mt-1 text-[var(--color-fg-muted)]">
                Access code provided by text only — not printed on this sheet
              </p>
            )}
            {opts.codeExpiresAt ? (
              <p className="mt-1 text-[var(--color-fg-muted)]">
                Code valid through ·{" "}
                <span className="font-medium text-[var(--color-fg)]">
                  {formatSheetDate(opts.codeExpiresAt)}
                </span>
              </p>
            ) : null}
            <p className="mt-1 text-sm text-[var(--color-fg-subtle)]">
              Enter the code at checkout on {SITE_HOST}. After the expiry date it will not work.
            </p>
          </div>

          <p className="mt-4 text-base text-[var(--color-fg-muted)]">
            Default partner: {offPct}% off list ·{" "}
            <span className="font-medium text-[var(--color-fg)]">Recommended retail</span> = public
            catalog price. {opts.nextShipNote}
          </p>
          {opts.showTestingNote ? (
            <p className="mt-2 text-sm text-[var(--color-fg-subtle)]">{MAIL_ORDER.testingNote}</p>
          ) : null}
        </section>

        <section className="border-b border-[var(--color-border)] p-6 sm:p-8 print:break-inside-avoid print:p-6">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            10-vial pack pricing
          </h2>
          <p className="mt-1 text-base text-[var(--color-fg-muted)]">
            Your wholesale = what you pay us. Recommended retail = what customers pay online.
          </p>
          <PriceTable
            rows={rows.map((r) => ({
              key: r.baseSku,
              name: r.name,
              size: r.strength,
              wholesale: r.wholesale,
              retail: r.suggestedRetail,
              margin: r.margin,
            }))}
            showMargin={opts.showMargin}
            roundMode={opts.roundMode}
          />
        </section>

        <section className="p-6 sm:p-8 print:break-inside-avoid print:p-6">
          <h2 className="font-display text-3xl font-semibold tracking-tight">
            Single vial pricing
          </h2>
          <p className="mt-1 text-base text-[var(--color-fg-muted)]">
            Easy reference for one-vial orders when singles are available.
          </p>
          <PriceTable
            rows={rows.map((r) => ({
              key: `${r.baseSku}-v`,
              name: r.name,
              size: r.singleStrength,
              wholesale: r.singleWholesale,
              retail: r.singleRetail,
              margin: r.singleMargin,
            }))}
            showMargin={opts.showMargin}
            roundMode={opts.roundMode}
          />

          <div className="mt-8 grid gap-4 border-t border-[var(--color-border)] pt-5 text-sm text-[var(--color-fg-subtle)] sm:grid-cols-3">
            <p>
              <span className="font-medium text-[var(--color-fg-muted)]">Order online</span>
              <br />
              {SITE_URL}
            </p>
            <p>
              <span className="font-medium text-[var(--color-fg-muted)]">Invoice / cash</span>
              <br />
              {opts.contactEmail}
            </p>
            <p>
              <span className="font-medium text-[var(--color-fg-muted)]">Code expiry</span>
              <br />
              {opts.codeExpiresAt ? formatSheetDate(opts.codeExpiresAt) : "—"}
            </p>
          </div>
          {opts.showRuo ? (
            <p className="mt-4 text-center text-xs text-[var(--color-fg-subtle)]">{MAIL_ORDER.ruo}</p>
          ) : null}
        </section>
      </article>

      <p className="mt-4 text-center text-sm text-[var(--color-fg-subtle)] print:hidden">
        After <strong className="font-medium">Save code to store</strong>, partners enter the code
        at cart / checkout. Expired codes show “That code has expired.” Default inbox:{" "}
        {CONTACT.email}.
      </p>
    </main>
  );
}

function PriceTable({
  rows,
  showMargin,
  roundMode,
}: {
  rows: Array<{
    key: string;
    name: string;
    size: string;
    wholesale: number;
    retail: number;
    margin: number;
  }>;
  showMargin: boolean;
  roundMode: "ten" | "dollar";
}) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-left text-base">
        <thead>
          <tr className="border-b border-[var(--color-border-strong)] text-xs tracking-[0.08em] text-[var(--color-fg-subtle)] uppercase">
            <th className="py-2.5 pr-2 font-medium">Compound</th>
            <th className="py-2.5 pr-2 font-medium">Size</th>
            <th className="py-2.5 pr-2 text-right font-medium text-[var(--color-primary)]">
              Your wholesale
            </th>
            <th className="py-2.5 pr-2 text-right font-medium">Recommended retail</th>
            {showMargin ? <th className="py-2.5 text-right font-medium">Your margin</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-[var(--color-border)] text-[var(--color-fg)]">
              <td className="py-3 pr-2 font-medium">{r.name}</td>
              <td className="py-3 pr-2 font-mono text-sm text-[var(--color-fg-muted)]">{r.size}</td>
              <td className="py-3 pr-2 text-right font-medium tabular text-[var(--color-primary)]">
                {formatMoney(r.wholesale, roundMode)}
              </td>
              <td className="py-3 pr-2 text-right tabular text-[var(--color-fg-muted)]">
                {formatMoney(r.retail, roundMode)}
              </td>
              {showMargin ? (
                <td className="py-3 text-right tabular text-[var(--color-fg-muted)]">
                  {formatMoney(r.margin, roundMode)}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PriceCell({
  value,
  placeholder,
  onChange,
}: {
  value?: number;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <td className="px-2 py-1.5">
      <input
        type="number"
        step={1}
        min={0}
        className={cn(
          "h-10 w-full rounded-[var(--radius-sm)] border bg-[var(--color-bg)] px-2 text-right font-mono text-base tabular outline-none focus:border-[var(--color-primary)]",
          value !== undefined
            ? "border-[var(--color-primary)]/50 text-[var(--color-fg)]"
            : "border-[var(--color-border)] text-[var(--color-fg-muted)]",
        )}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </td>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-fg-muted)]">
      <input
        type="checkbox"
        className="h-4 w-4 accent-[var(--color-primary)]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={cn(checked && "text-[var(--color-fg)]")}>{label}</span>
    </label>
  );
}

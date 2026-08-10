import { createFileRoute } from "@tanstack/react-router";
import { Download, Printer, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
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
} from "@/lib/mail-order";
import { downloadWholesalePdf } from "@/lib/wholesale-pdf";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/lab/wholesale")({
  component: LabWholesalePage,
});

function LabWholesalePage() {
  const [opts, setOpts] = useState<PamphletOptions>({ ...DEFAULT_PAMPHLET_OPTIONS });
  const rows = useMemo(() => pamphletRows(opts), [opts]);

  function patch(p: Partial<PamphletOptions>) {
    setOpts((o) => ({ ...o, ...p }));
  }

  function onPdf() {
    try {
      const name = downloadWholesalePdf(rows, opts);
      toast.success(`PDF saved · ${name}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not build PDF");
    }
  }

  const offPct = Math.round(opts.listOff * 100);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 print:max-w-none print:px-0 print:py-0">
      {/* Controls — screen only */}
      <div className="mb-6 space-y-4 print:hidden">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] text-[var(--color-primary)] uppercase">
              Lab
            </p>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Wholesale partner sheet
            </h1>
            <p className="mt-1 max-w-xl text-sm text-[var(--color-fg-muted)]">
              Adjust options, preview the sheet, then download a PDF with the sheet date on it.
              Partner codes stay off the print — text them separately.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={onPdf} className="gap-2">
              <Download className="h-4 w-4" strokeWidth={1.5} />
              Download PDF
            </Button>
            <Button size="sm" variant="secondary" onClick={() => window.print()} className="gap-2">
              <Printer className="h-4 w-4" strokeWidth={1.5} />
              Print
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setOpts({ ...DEFAULT_PAMPHLET_OPTIONS })}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="sheetDate">Sheet date (on PDF)</Label>
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
            <Label htmlFor="roundMode">Price rounding</Label>
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
            <Label htmlFor="title">Sheet title</Label>
            <Input
              id="title"
              value={opts.title}
              onChange={(e) => patch({ title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={opts.tagline}
              onChange={(e) => patch({ tagline: e.target.value })}
            />
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
          <div className="flex flex-col justify-end gap-2 sm:col-span-2 lg:col-span-1">
            <Toggle
              checked={opts.includeSingles}
              onChange={(v) => patch({ includeSingles: v })}
              label="Include 1-vial columns"
            />
            <Toggle
              checked={opts.showMargin}
              onChange={(v) => patch({ showMargin: v })}
              label="Show margin column"
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
      </div>

      {/* Preview / print surface */}
      <article className="pamphlet space-y-0 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-soft)] print:rounded-none print:border-0 print:shadow-none">
        <section className="border-b border-[var(--color-border)] p-6 sm:p-8 print:break-inside-avoid print:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-border)] pb-5">
            <div>
              <p className="font-display text-4xl font-semibold tracking-tight text-[var(--color-fg)]">
                {opts.title}
              </p>
              <p className="mt-1 text-sm tracking-[0.16em] text-[var(--color-primary)] uppercase">
                {opts.tagline}
              </p>
              <p className="mt-3 text-sm font-medium text-[var(--color-fg)]">
                Sheet date · {formatSheetDate(opts.sheetDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-medium text-[var(--color-fg)]">{SITE_HOST}</p>
              <p className="text-xs text-[var(--color-fg-subtle)]">{SITE_URL}</p>
              <p className="mt-1 font-mono text-xs font-medium text-[var(--color-primary)]">
                {opts.contactEmail}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-primary)]/40 bg-[var(--color-primary)]/5 px-4 py-3">
              <p className="text-sm font-medium text-[var(--color-fg)]">Invoice contact</p>
              <p className="mt-1 font-mono text-sm text-[var(--color-primary)]">
                {opts.contactEmail}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3">
              <p className="text-sm font-medium text-[var(--color-fg)]">Terms</p>
              <ul className="mt-2 space-y-1 text-xs text-[var(--color-fg-muted)]">
                <li>
                  Partner: {offPct}% off list · round nearest $
                  {opts.roundMode === "ten" ? "10" : "1"}
                </li>
                <li>{MAIL_ORDER.shippingNote}</li>
                <li>{opts.nextShipNote}</li>
                <li>10-pack + singles when available · produced when you buy</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-3">
            <p className="text-sm text-[var(--color-fg-muted)]">{MAIL_ORDER.partnerCodeNote}</p>
            {opts.showTestingNote ? (
              <p className="mt-2 text-xs text-[var(--color-fg-subtle)]">{MAIL_ORDER.testingNote}</p>
            ) : null}
            {opts.showRuo ? (
              <p className="mt-1 text-xs text-[var(--color-fg-subtle)]">{MAIL_ORDER.ruo}</p>
            ) : null}
          </div>
        </section>

        <section className="p-6 sm:p-8 print:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {MAIL_ORDER.partnerLabel}
              </h2>
              <p className="text-sm text-[var(--color-fg-muted)]">
                {offPct}% off list · dated {formatSheetDate(opts.sheetDate)}
              </p>
            </div>
            <p className="text-xs text-[var(--color-fg-subtle)]">
              {opts.contactEmail} · {SITE_HOST}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border-strong)] text-[11px] tracking-[0.08em] text-[var(--color-fg-subtle)] uppercase">
                  <th className="py-2 pr-2 font-medium">Compound</th>
                  <th className="py-2 pr-2 font-medium">Size</th>
                  <th className="py-2 pr-2 text-right font-medium text-[var(--color-primary)]">
                    {opts.includeSingles ? "10-pack WS" : "Your wholesale"}
                  </th>
                  <th className="py-2 pr-2 text-right font-medium">
                    {opts.includeSingles ? "10-pack SR" : "Suggested retail"}
                  </th>
                  {opts.includeSingles ? (
                    <>
                      <th className="py-2 pr-2 text-right font-medium">1 vial WS</th>
                      <th className="py-2 text-right font-medium">1 vial SR</th>
                    </>
                  ) : opts.showMargin ? (
                    <th className="py-2 text-right font-medium">Your margin</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.baseSku}
                    className="border-b border-[var(--color-border)] text-[var(--color-fg)]"
                  >
                    <td className="py-2.5 pr-2 font-medium">{r.name}</td>
                    <td className="py-2.5 pr-2 font-mono text-xs text-[var(--color-fg-muted)]">
                      {r.strength}
                    </td>
                    <td className="py-2.5 pr-2 text-right font-medium tabular text-[var(--color-primary)]">
                      {formatMoney(r.wholesale, opts.roundMode)}
                    </td>
                    <td className="py-2.5 pr-2 text-right tabular text-[var(--color-fg-muted)]">
                      {formatMoney(r.suggestedRetail, opts.roundMode)}
                    </td>
                    {opts.includeSingles ? (
                      <>
                        <td className="py-2.5 pr-2 text-right tabular text-[var(--color-primary)]">
                          {formatMoney(r.singleWholesale ?? 0, opts.roundMode)}
                        </td>
                        <td className="py-2.5 text-right tabular text-[var(--color-fg-muted)]">
                          {formatMoney(r.singleRetail ?? 0, opts.roundMode)}
                        </td>
                      </>
                    ) : opts.showMargin ? (
                      <td className="py-2.5 text-right tabular text-[var(--color-fg-muted)]">
                        {formatMoney(r.margin, opts.roundMode)}
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 border-t border-[var(--color-border)] pt-5 text-xs text-[var(--color-fg-subtle)] sm:grid-cols-3">
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
              <span className="font-medium text-[var(--color-fg-muted)]">Sheet date</span>
              <br />
              {formatSheetDate(opts.sheetDate)}
            </p>
          </div>

          <p className="mt-6 text-center font-display text-lg tracking-wide text-[var(--color-fg)]">
            {SITE_HOST}
          </p>
          <p className="text-center font-mono text-sm text-[var(--color-primary)]">
            {opts.contactEmail}
          </p>
          {opts.showRuo ? (
            <p className="mt-1 text-center text-[11px] text-[var(--color-fg-subtle)]">
              {MAIL_ORDER.ruo}
            </p>
          ) : null}
        </section>
      </article>

      <p className="mt-4 text-center text-xs text-[var(--color-fg-subtle)] print:hidden">
        PDF filename includes the sheet date. Default inbox: {CONTACT.email}.
      </p>
    </main>
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

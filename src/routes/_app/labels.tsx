import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileImage, FileDown, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  downloadBlob,
  downloadSvg,
  LABEL_PRINT,
  labelFilename,
  renderLabelSvg,
  type LabelFields,
} from "@/lib/label-artwork";
import { products, type Product } from "@/lib/products";
import { requireBatch } from "@/lib/traceabl-batches";
import {
  appearanceForProductForm,
  getAppearance,
  VIAL_APPEARANCES,
} from "@/lib/vial-forms";
import { renderVialPhoto } from "@/lib/vial-render";

export const Route = createFileRoute("/_app/labels")({
  component: LabelStudioPage,
});

function fieldsFromProduct(p: Product): LabelFields {
  const batch = requireBatch(p.sku);
  const app = appearanceForProductForm(p.form);
  return {
    name: p.name,
    strength: p.vialLabel,
    formLine: app.formLine,
    sku: p.sku,
    lot: batch.batchId.replace(/^GRAEL-/, "").slice(0, 14),
    exp: "2027-08",
    batchId: batch.batchId,
    coaHint: "Traceabl.us",
  };
}

function LabelStudioPage() {
  const [sku, setSku] = useState(products[0]?.sku ?? "TR15");
  const product = products.find((p) => p.sku === sku) ?? products[0]!;
  const [fields, setFields] = useState<LabelFields>(() => fieldsFromProduct(product));
  const [appearanceId, setAppearanceId] = useState(
    () => appearanceForProductForm(product.form).id,
  );
  const appearance = getAppearance(appearanceId);

  const svg = useMemo(() => renderLabelSvg(fields), [fields]);
  const labelDataUrl = useMemo(
    () => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    [svg],
  );

  const [vialUrl, setVialUrl] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    setRendering(true);
    renderVialPhoto(fields, appearance, svg, 720)
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setVialUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setVialUrl(null);
      })
      .finally(() => {
        if (!cancelled) setRendering(false);
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fields, appearance, svg]);

  function loadSku(next: string) {
    const p = products.find((x) => x.sku === next);
    if (!p) return;
    setSku(next);
    setFields(fieldsFromProduct(p));
    setAppearanceId(appearanceForProductForm(p.form).id);
  }

  function setField<K extends keyof LabelFields>(key: K, value: LabelFields[K]) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function onAppearanceChange(id: string) {
    setAppearanceId(id);
    setFields((f) => ({ ...f, formLine: getAppearance(id).formLine }));
  }

  async function downloadVial() {
    try {
      const blob = await renderVialPhoto(fields, appearance, svg, 1200);
      downloadBlob(`grael-vial-${fields.sku.toLowerCase()}-${appearance.id}.jpg`, blob);
      toast.success("Vial mockup downloaded");
    } catch {
      toast.error("Could not render vial mockup");
    }
  }

  function downloadLabel() {
    downloadSvg(labelFilename(fields.sku, fields.batchId), svg);
    toast.success("Label SVG downloaded");
  }

  async function downloadPack() {
    downloadLabel();
    await downloadVial();
  }

  function downloadAllLabels() {
    for (const p of products) {
      const f = fieldsFromProduct(p);
      downloadSvg(labelFilename(f.sku, f.batchId), renderLabelSvg(f));
    }
    toast.success("All SKU labels queued");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 max-w-2xl space-y-2">
        <p className="text-xs font-medium tracking-[0.14em] text-[var(--color-primary)] uppercase">
          Label studio
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Label + vial template
        </h1>
        <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
          Master wrap label ({LABEL_PRINT.widthMm}×{LABEL_PRINT.heightMm} mm) and a quick vial
          mockup. Default is <strong className="text-[var(--color-fg)]">white powder</strong> —
          switch cream, yellow, blue, or solution when needed. Final store photos can come from a
          separate product-photo pass.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3">
              <p className="mb-2 text-[10px] font-medium tracking-[0.14em] text-[var(--color-fg-subtle)] uppercase">
                Print label (SVG)
              </p>
              <img
                src={labelDataUrl}
                alt={`Label ${fields.name}`}
                className="w-full bg-white shadow-[var(--shadow-soft)]"
              />
            </div>
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3">
              <p className="mb-2 text-[10px] font-medium tracking-[0.14em] text-[var(--color-fg-subtle)] uppercase">
                Vial mock {rendering ? "· rendering…" : ""}
              </p>
              {vialUrl ? (
                <img
                  src={vialUrl}
                  alt={`Vial mockup ${fields.name}`}
                  className="aspect-[4/5] w-full object-cover bg-white shadow-[var(--shadow-soft)]"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center bg-white text-sm text-[var(--color-fg-subtle)]">
                  Building preview…
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={downloadPack}>
              <Download className="h-3.5 w-3.5" />
              Download pack (label + mock)
            </Button>
            <Button size="sm" variant="secondary" onClick={downloadLabel}>
              <FileDown className="h-3.5 w-3.5" />
              Label SVG only
            </Button>
            <Button size="sm" variant="secondary" onClick={downloadVial}>
              <FileImage className="h-3.5 w-3.5" />
              Vial mock JPG
            </Button>
            <Button size="sm" variant="outline" onClick={downloadAllLabels}>
              All SKU labels
            </Button>
          </div>
        </div>

        <div className="space-y-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="space-y-2">
            <Label htmlFor="sku">Load from catalog</Label>
            <select
              id="sku"
              value={sku}
              onChange={(e) => loadSku(e.target.value)}
              className="h-10 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm"
            >
              {products.map((p) => (
                <option key={p.sku} value={p.sku}>
                  {p.name} · {p.vialLabel}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appearance">Contents appearance</Label>
            <select
              id="appearance"
              value={appearanceId}
              onChange={(e) => onAppearanceChange(e.target.value)}
              className="h-10 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm"
            >
              {VIAL_APPEARANCES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Compound name</Label>
            <Input id="name" value={fields.name} onChange={(e) => setField("name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="strength">Strength on label</Label>
            <Input
              id="strength"
              value={fields.strength}
              onChange={(e) => setField("strength", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="lot">LOT</Label>
              <Input id="lot" value={fields.lot} onChange={(e) => setField("lot", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp">EXP</Label>
              <Input id="exp" value={fields.exp} onChange={(e) => setField("exp", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batch">Batch ID</Label>
            <Input
              id="batch"
              value={fields.batchId}
              onChange={(e) => setField("batchId", e.target.value)}
              className="font-mono text-xs"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => {
              setFields(fieldsFromProduct(product));
              setAppearanceId(appearanceForProductForm(product.form).id);
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset from catalog
          </Button>
        </div>
      </div>

      <section className="mt-12 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-5 text-sm text-[var(--color-fg-muted)] leading-relaxed">
        <p className="font-medium text-[var(--color-fg)]">Labels vs product photos</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <strong className="text-[var(--color-fg)]">This page</strong> — print labels (SVG) +
            quick mockups for internal use.
          </li>
          <li>
            <strong className="text-[var(--color-fg)]">Store product photos</strong> — separate job
            (real photo or proper 3D). Upload approved JPGs when ready; they do not have to live in
            this studio.
          </li>
        </ul>
        <p className="mt-3">
          <Link to="/catalog" className="text-[var(--color-primary)] no-underline hover:underline">
            ← Shop
          </Link>
        </p>
      </section>
    </main>
  );
}

/**
 * Grael vial label — master print template.
 * One design language; variable name / strength / LOT / batch.
 */

export type LabelFields = {
  name: string;
  strength: string;
  formLine: string;
  sku: string;
  lot: string;
  exp: string;
  batchId: string;
  coaHint?: string;
};

export const LABEL_PRINT = {
  widthMm: 50,
  heightMm: 28,
  widthPx: 600,
  heightPx: 336,
  dpi: 300,
} as const;

function esc(s: string): string {
  const amp = String.fromCharCode(38);
  return s
    .replace(/&/g, amp + "amp;")
    .replace(/</g, amp + "lt;")
    .replace(/>/g, amp + "gt;")
    .replace(/"/g, amp + "quot;");
}

/** Clean production wrap label — white face, G mark, QR panel, RUO band */
export function renderLabelSvg(f: LabelFields): string {
  const w = LABEL_PRINT.widthPx;
  const h = LABEL_PRINT.heightPx;
  const name = esc(f.name);
  const strength = esc(f.strength);
  const formLine = esc(f.formLine);
  const sku = esc(f.sku);
  const lot = esc(f.lot || "________");
  const exp = esc(f.exp || "________");
  const batchId = esc(f.batchId);
  const coaHint = esc(f.coaHint || "Traceabl.us");
  const nameSize = name.length > 20 ? 20 : name.length > 14 ? 24 : 28;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f7f7f7"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#ffffff"/>
  <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="6" fill="url(#face)" stroke="#1a1a1a" stroke-width="1.25"/>

  <!-- Left brand column -->
  <text x="32" y="72" font-family="Georgia, 'Times New Roman', serif" font-size="58" font-weight="600" fill="#141414">G</text>
  <text x="92" y="48" font-family="Georgia, 'Times New Roman', serif" font-size="18" letter-spacing="4.5" fill="#141414">GRAEL</text>
  <text x="92" y="68" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="9" letter-spacing="1.8" fill="#6a6a6a">LAB TESTED · TRACEABLE</text>

  <!-- QR reserve (print real Traceabl QR here) -->
  <g transform="translate(498, 22)">
    <rect width="72" height="72" rx="3" fill="#141414"/>
    <rect x="9" y="9" width="20" height="20" fill="#ffffff"/>
    <rect x="43" y="9" width="20" height="20" fill="#ffffff"/>
    <rect x="9" y="43" width="20" height="20" fill="#ffffff"/>
    <rect x="36" y="36" width="16" height="16" fill="#ffffff"/>
    <rect x="43" y="52" width="7" height="7" fill="#ffffff"/>
    <rect x="52" y="43" width="7" height="7" fill="#ffffff"/>
  </g>
  <text x="534" y="108" text-anchor="middle" font-family="ui-monospace, monospace" font-size="8" fill="#6a6a6a">${coaHint}</text>

  <!-- Product block on solid white (no ghost text) -->
  <rect x="28" y="112" width="450" height="108" fill="#ffffff"/>
  <line x1="32" y1="116" x2="420" y2="116" stroke="#e8e8e8" stroke-width="1"/>
  <text x="32" y="148" font-family="Georgia, 'Times New Roman', serif" font-size="${nameSize}" font-weight="600" fill="#141414">${name}</text>
  <text x="32" y="178" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20" font-weight="500" fill="#141414">${strength}</text>
  <text x="32" y="200" font-family="ui-monospace, monospace" font-size="11" fill="#5a5a5a">${formLine}</text>
  <text x="32" y="218" font-family="ui-monospace, monospace" font-size="10" fill="#8a8a8a">SKU ${sku}</text>

  <text x="32" y="244" font-family="ui-monospace, monospace" font-size="11" fill="#5a5a5a">LOT ${lot}   EXP ${exp}   −20°C</text>
  <text x="32" y="262" font-family="ui-monospace, monospace" font-size="10" fill="#8a8a8a">BATCH ${batchId}</text>

  <rect x="28" y="276" width="544" height="26" rx="2" fill="#141414"/>
  <text x="40" y="294" font-family="ui-monospace, monospace" font-size="11" letter-spacing="0.5" fill="#ffffff">RESEARCH USE ONLY — NOT FOR HUMAN USE</text>
  <text x="32" y="322" font-family="ui-monospace, monospace" font-size="9" fill="#4d6b5c">COA via QR · integrity-registered result · Traceabl.us</text>
</svg>
`;
}

export function labelFilename(sku: string, batchId?: string): string {
  const base = sku.toLowerCase().replace(/[^a-z0-9-]/g, "");
  const lot = (batchId || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  return lot ? `grael-label-${base}-${lot}.svg` : `grael-label-${base}.svg`;
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadSvg(filename: string, svg: string) {
  downloadBlob(filename, new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
}

#!/usr/bin/env node
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function extractProducts(src) {
  const blocks = src.split(/\{\s*sku:/).slice(1);
  return blocks
    .map((block) => {
      const sku = block.match(/^\s*"([^"]+)"/)?.[1];
      const name = block.match(/name:\s*"([^"]+)"/)?.[1];
      const vialLabel = block.match(/vialLabel:\s*"([^"]+)"/)?.[1];
      const form = block.match(/form:\s*"([^"]+)"/)?.[1];
      return { sku, name, vialLabel, form };
    })
    .filter((p) => p.sku && p.name);
}

function extractBatches(src) {
  const map = new Map();
  const re = /sku:\s*"([^"]+)"[\s\S]*?batchId:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) map.set(m[1], m[2]);
  return map;
}

const FORM_LINE = {
  "lyophilized-white": "Lyophilized · RUO",
  "lyophilized-cream": "Lyophilized · RUO",
  "lyophilized-blue": "Lyophilized · RUO",
  "lyophilized-amber": "Lyophilized · RUO",
  "liquid-clear": "Solution · RUO",
};

function esc(s) {
  const amp = String.fromCharCode(38);
  return String(s)
    .replace(/&/g, amp + "amp;")
    .replace(/</g, amp + "lt;")
    .replace(/>/g, amp + "gt;")
    .replace(/"/g, amp + "quot;");
}

function renderLabelSvg({ name, strength, formLine, sku, lot, exp, batchId }) {
  const w = 600;
  const h = 336;
  const nameSize = name.length > 18 ? 22 : name.length > 12 ? 24 : 28;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#ffffff"/>
  <rect x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="8" fill="#ffffff" stroke="#141414" stroke-width="1.5"/>
  <text x="36" y="78" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="600" fill="#141414">G</text>
  <text x="100" y="52" font-family="Georgia, 'Times New Roman', serif" font-size="20" letter-spacing="5" fill="#141414">GRAEL</text>
  <text x="100" y="72" font-family="ui-monospace, monospace" font-size="9" letter-spacing="2" fill="#6a6a6a">LAB TESTED · TRACEABLE</text>
  <g transform="translate(500, 24)">
    <rect width="68" height="68" rx="2" fill="#141414"/>
    <rect x="8" y="8" width="18" height="18" fill="#ffffff"/>
    <rect x="42" y="8" width="18" height="18" fill="#ffffff"/>
    <rect x="8" y="42" width="18" height="18" fill="#ffffff"/>
    <rect x="34" y="34" width="14" height="14" fill="#ffffff"/>
    <rect x="42" y="50" width="6" height="6" fill="#ffffff"/>
    <rect x="50" y="42" width="6" height="6" fill="#ffffff"/>
  </g>
  <text x="534" y="108" text-anchor="middle" font-family="ui-monospace, monospace" font-size="8" fill="#6a6a6a">Traceabl.us</text>
  <circle cx="534" cy="124" r="11" fill="none" stroke="#4d6b5c" stroke-width="1.75"/>
  <path d="M528 124 l4 4.5 l9 -11" fill="none" stroke="#4d6b5c" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="32" y="118" width="450" height="100" fill="#ffffff"/>
  <text x="36" y="148" font-family="Georgia, 'Times New Roman', serif" font-size="${nameSize}" font-weight="600" fill="#141414">${esc(name)}</text>
  <text x="36" y="180" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="#141414">${esc(strength)}</text>
  <text x="36" y="204" font-family="ui-monospace, monospace" font-size="11" fill="#5a5a5a">${esc(formLine)}  ·  SKU ${esc(sku)}</text>
  <text x="36" y="232" font-family="ui-monospace, monospace" font-size="11" fill="#6a6a6a">LOT ${esc(lot)}    EXP ${esc(exp)}    −20°C</text>
  <text x="36" y="252" font-family="ui-monospace, monospace" font-size="10" fill="#8a8a8a">BATCH ${esc(batchId)}</text>
  <rect x="32" y="268" width="536" height="28" rx="3" fill="#141414"/>
  <text x="44" y="287" font-family="ui-monospace, monospace" font-size="11" fill="#ffffff">RESEARCH USE ONLY — NOT FOR HUMAN USE</text>
  <text x="36" y="318" font-family="ui-monospace, monospace" font-size="9" fill="#4d6b5c">Batch COA via QR · registered integrity result · Traceabl.us</text>
</svg>
`;
}

const products = extractProducts(readFileSync(join(root, "src/lib/products.ts"), "utf8"));
const batches = extractBatches(readFileSync(join(root, "src/lib/traceabl-batches.ts"), "utf8"));
const outDir = join(root, "public/labels");
const exportDir = join(outDir, "export");
mkdirSync(exportDir, { recursive: true });
const manifest = [];

for (const p of products) {
  const batchId = batches.get(p.sku) || `GRAEL-${p.sku}-PENDING`;
  const fields = {
    name: p.name,
    strength: p.vialLabel || "",
    formLine: FORM_LINE[p.form] || "Lyophilized · RUO",
    sku: p.sku,
    lot: batchId.replace(/^GRAEL-/, "").slice(0, 12),
    exp: "2027-08",
    batchId,
  };
  const svg = renderLabelSvg(fields);
  writeFileSync(join(outDir, `label-${p.sku.toLowerCase()}.svg`), svg);
  const exportName = `grael-label-${p.sku.toLowerCase()}-${batchId.toLowerCase()}.svg`;
  writeFileSync(join(exportDir, exportName), svg);
  manifest.push({ sku: p.sku, name: p.name, batchId, file: `export/${exportName}`, printSizeMm: "50 × 28" });
  console.log("wrote", p.sku);
}

writeFileSync(join(outDir, "label-template-blank.svg"), renderLabelSvg({
  name: "COMPOUND NAME", strength: "00 mg", formLine: "Lyophilized · RUO", sku: "SKU",
  lot: "________", exp: "________", batchId: "GRAEL-XXXX-YYYY-NNN",
}));
writeFileSync(join(exportDir, "manifest.json"), JSON.stringify({ generatedAt: new Date().toISOString(), labels: manifest }, null, 2));
console.log("Done", manifest.length);

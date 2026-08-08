# Grael vial labels — production system

## Workflow (repeatable)
1. Open **Labels** in the Grael site (Label studio).
2. Pick a catalog SKU **or** type a new compound name / strength / LOT / EXP / batch.
3. Preview updates live on the master design.
4. **Download this SVG** → send to label vendor **or** open in Illustrator → PDF/X @ 300 dpi.
5. Or batch-generate all SKUs: `node scripts/generate-labels.mjs` → files in `public/labels/export/`.

## Print size
- **50 mm × 28 mm** wrap for 2–3 ml vials
- Vector SVG (scales cleanly). Raster: 300 dpi PNG if required.

## Material
- White matte, freezer-safe permanent adhesive
- Corner radius ~2–3 mm

## Variable data each run
| Field | Source |
|-------|--------|
| Name / strength | Catalog or studio |
| LOT / EXP | After Traceabl result |
| Batch ID | `traceabl-batches.ts` |
| QR | Replace placeholder with live Traceabl QR |

## Files
| Path | Use |
|------|-----|
| `public/labels/export/grael-label-{sku}-{batch}.svg` | Upload pack |
| `public/labels/export/manifest.json` | Inventory of files |
| `public/labels/label-{sku}.svg` | Site previews |
| Label studio UI | Day-to-day edits |

## Legal line (required)
`RESEARCH USE ONLY — NOT FOR HUMAN USE`

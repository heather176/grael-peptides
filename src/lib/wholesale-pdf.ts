/**
 * Client-side PDF for Lab wholesale partner sheet.
 */
import { jsPDF } from "jspdf";
import {
  formatMoney,
  formatSheetDate,
  SITE_HOST,
  SITE_URL,
  type PamphletOptions,
  type PamphletRow,
} from "@/lib/mail-order";

export function downloadWholesalePdf(
  rows: PamphletRow[],
  opts: PamphletOptions,
  filename?: string,
) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = margin;

  const dateLabel = formatSheetDate(opts.sheetDate);
  const offPct = Math.round(opts.listOff * 100);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(opts.title, margin, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(opts.tagline, margin, y);
  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30);
  doc.text(`Sheet date: ${dateLabel}`, margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(90);
  doc.text(SITE_HOST, pageW - margin, y, { align: "right" });
  y += 12;
  doc.text(opts.contactEmail, pageW - margin, y, { align: "right" });
  y += 18;

  doc.setDrawColor(200);
  doc.line(margin, y, pageW - margin, y);
  y += 16;

  doc.setFontSize(9);
  doc.setTextColor(60);
  doc.text(
    `Partner wholesale: ${offPct}% off list · rounded to nearest $${opts.roundMode === "ten" ? "10" : "1"}`,
    margin,
    y,
  );
  y += 12;
  doc.text(opts.nextShipNote, margin, y);
  y += 12;
  doc.text(`US shipping · product minimum applies · ${SITE_URL}`, margin, y);
  y += 18;

  // Table header
  const cols = opts.includeSingles
    ? [
        { k: "name", w: 120, label: "Compound" },
        { k: "size", w: 90, label: "Size" },
        { k: "wh", w: 70, label: "10-pack WS", align: "right" as const },
        { k: "sr", w: 70, label: "10-pack SR", align: "right" as const },
        { k: "swh", w: 60, label: "1v WS", align: "right" as const },
        { k: "ssr", w: 60, label: "1v SR", align: "right" as const },
      ]
    : [
        { k: "name", w: 150, label: "Compound" },
        { k: "size", w: 110, label: "Size" },
        { k: "wh", w: 80, label: "Your wholesale", align: "right" as const },
        { k: "sr", w: 80, label: "Suggested retail", align: "right" as const },
        ...(opts.showMargin
          ? [{ k: "mg", w: 70, label: "Margin", align: "right" as const }]
          : []),
      ];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100);
  let x = margin;
  for (const c of cols) {
    doc.text(c.label, c.align === "right" ? x + c.w : x, y, {
      align: c.align === "right" ? "right" : "left",
    });
    x += c.w;
  }
  y += 6;
  doc.setDrawColor(180);
  doc.line(margin, y, pageW - margin, y);
  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30);

  for (const r of rows) {
    if (y > pageH - 72) {
      doc.addPage();
      y = margin;
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`${opts.title} · continued · ${dateLabel}`, margin, y);
      y += 18;
      doc.setFontSize(9);
      doc.setTextColor(30);
    }

    const cells = opts.includeSingles
      ? [
          r.name,
          r.strength,
          formatMoney(r.wholesale, opts.roundMode),
          formatMoney(r.suggestedRetail, opts.roundMode),
          formatMoney(r.singleWholesale ?? 0, opts.roundMode),
          formatMoney(r.singleRetail ?? 0, opts.roundMode),
        ]
      : [
          r.name,
          r.strength,
          formatMoney(r.wholesale, opts.roundMode),
          formatMoney(r.suggestedRetail, opts.roundMode),
          ...(opts.showMargin ? [formatMoney(r.margin, opts.roundMode)] : []),
        ];

    x = margin;
    cells.forEach((text, i) => {
      const c = cols[i]!;
      doc.text(String(text), c.align === "right" ? x + c.w : x, y, {
        align: c.align === "right" ? "right" : "left",
        maxWidth: c.w - 4,
      });
      x += c.w;
    });
    y += 14;
  }

  y += 16;
  if (y > pageH - 90) {
    doc.addPage();
    y = margin;
  }

  doc.setFontSize(8);
  doc.setTextColor(90);
  if (opts.showTestingNote) {
    doc.text(
      "Independent third-party testing has been ordered for all peptides and will be posted shortly.",
      margin,
      y,
      { maxWidth: pageW - margin * 2 },
    );
    y += 14;
  }
  doc.text("Partner code: by text only — never printed on this sheet.", margin, y);
  y += 12;
  if (opts.showRuo) {
    doc.setFontSize(7);
    doc.text(
      "Research use only. Not for human or veterinary use. Not a drug, food, or cosmetic.",
      margin,
      y,
      { maxWidth: pageW - margin * 2 },
    );
    y += 12;
  }

  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(
    `Generated ${dateLabel} · ${opts.contactEmail} · ${SITE_HOST}`,
    pageW / 2,
    pageH - 28,
    { align: "center" },
  );

  const safeDate = opts.sheetDate.replace(/-/g, "");
  const name = filename ?? `grael-wholesale-${safeDate}.pdf`;
  doc.save(name);
  return name;
}

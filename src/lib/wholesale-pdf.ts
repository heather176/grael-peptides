/**
 * Client-side PDF for Lab wholesale partner sheet.
 * Two charts: 10-pack + single vial. Client name + sheet date.
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

function drawTable(
  doc: jsPDF,
  y: number,
  headers: string[],
  rows: string[][],
  colW: number[],
  margin: number,
  pageW: number,
  pageH: number,
  footerDate: string,
  title: string,
): number {
  const ensureSpace = (need: number) => {
    if (y + need > pageH - 48) {
      doc.addPage();
      y = margin;
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`${title} · continued · ${footerDate}`, margin, y);
      y += 16;
    }
  };

  ensureSpace(40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100);
  let x = margin;
  headers.forEach((h, i) => {
    const right = i > 0;
    doc.text(h, right ? x + colW[i]! : x, y, { align: right ? "right" : "left" });
    x += colW[i]!;
  });
  y += 6;
  doc.setDrawColor(180);
  doc.line(margin, y, pageW - margin, y);
  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30);

  for (const cells of rows) {
    ensureSpace(16);
    x = margin;
    cells.forEach((text, i) => {
      const right = i > 0;
      doc.text(String(text), right ? x + colW[i]! : x, y, {
        align: right ? "right" : "left",
        maxWidth: colW[i]! - 4,
      });
      x += colW[i]!;
    });
    y += 13;
  }
  return y;
}

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
  const client = opts.clientName.trim();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(opts.title, margin, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(opts.tagline, margin, y);
  y += 14;

  if (client) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20);
    doc.text(`Prepared for: ${client}`, margin, y);
    y += 14;
  }

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30);
  doc.setFontSize(10);
  doc.text(`Sheet date: ${dateLabel}`, margin, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(90);
  doc.text(SITE_HOST, pageW - margin, y, { align: "right" });
  y += 12;
  doc.text(opts.contactEmail, pageW - margin, y, { align: "right" });
  y += 16;

  doc.setDrawColor(200);
  doc.line(margin, y, pageW - margin, y);
  y += 14;

  doc.setFontSize(9);
  doc.setTextColor(60);
  doc.text(
    `Partner wholesale: ${offPct}% off list (defaults) · round nearest $${opts.roundMode === "ten" ? "10" : "1"} · prices may be custom for this client`,
    margin,
    y,
    { maxWidth: pageW - margin * 2 },
  );
  y += 12;
  doc.text(opts.nextShipNote, margin, y);
  y += 12;
  doc.text(`${SITE_URL} · ${opts.contactEmail}`, margin, y);
  y += 14;

  // Partner code block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30);
  if (opts.printPartnerCode && opts.partnerCode.trim()) {
    doc.text(`Access code: ${opts.partnerCode.trim().toUpperCase()}`, margin, y);
    y += 12;
  } else {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.text("Access code: provided by text only — not printed on this sheet", margin, y);
    y += 12;
  }
  if (opts.codeExpiresAt) {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    const expLabel = formatSheetDate(opts.codeExpiresAt);
    doc.text(`Code valid through: ${expLabel}`, margin, y);
    y += 12;
  }
  y += 6;

  // —— 10-pack chart ——
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text("10-vial pack pricing", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100);
  y += 10;
  doc.text(
    "Your wholesale = what the partner pays · Recommended retail = public catalog price",
    margin,
    y,
  );
  y += 14;

  const packHeaders = opts.showMargin
    ? ["Compound", "Size", "Wholesale", "Rec. retail", "Margin"]
    : ["Compound", "Size", "Wholesale", "Rec. retail"];
  const packColW = opts.showMargin ? [140, 110, 80, 90, 70] : [150, 130, 100, 100];
  const packRows = rows.map((r) => {
    const base = [
      r.name,
      r.strength,
      formatMoney(r.wholesale, opts.roundMode),
      formatMoney(r.suggestedRetail, opts.roundMode),
    ];
    if (opts.showMargin) base.push(formatMoney(r.margin, opts.roundMode));
    return base;
  });
  y = drawTable(doc, y, packHeaders, packRows, packColW, margin, pageW, pageH, dateLabel, opts.title);

  y += 22;

  // —— Single vial chart ——
  if (y > pageH - 120) {
    doc.addPage();
    y = margin;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text("Single vial pricing", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100);
  y += 10;
  doc.text("Easy reference for partners who sell singles when stock allows.", margin, y);
  y += 14;

  const singleHeaders = opts.showMargin
    ? ["Compound", "Size", "Wholesale", "Rec. retail", "Margin"]
    : ["Compound", "Size", "Wholesale", "Rec. retail"];
  const singleColW = opts.showMargin ? [140, 110, 80, 90, 70] : [150, 130, 100, 100];
  const singleRows = rows.map((r) => {
    const base = [
      r.name,
      r.singleStrength,
      formatMoney(r.singleWholesale, opts.roundMode),
      formatMoney(r.singleRetail, opts.roundMode),
    ];
    if (opts.showMargin) base.push(formatMoney(r.singleMargin, opts.roundMode));
    return base;
  });
  y = drawTable(
    doc,
    y,
    singleHeaders,
    singleRows,
    singleColW,
    margin,
    pageW,
    pageH,
    dateLabel,
    opts.title,
  );

  y += 18;
  if (y > pageH - 80) {
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
    y += 12;
  }
  if (!opts.printPartnerCode) {
    doc.text("Partner code: by text only — never printed on this sheet.", margin, y);
    y += 12;
  }
  if (opts.showRuo) {
    doc.setFontSize(7);
    doc.text(
      "Research use only. Not for human or veterinary use. Not a drug, food, or cosmetic.",
      margin,
      y,
      { maxWidth: pageW - margin * 2 },
    );
  }

  doc.setFontSize(8);
  doc.setTextColor(120);
  const foot = client
    ? `Prepared for ${client} · ${dateLabel} · ${opts.contactEmail}`
    : `Generated ${dateLabel} · ${opts.contactEmail} · ${SITE_HOST}`;
  doc.text(foot, pageW / 2, pageH - 28, { align: "center" });

  const safeDate = opts.sheetDate.replace(/-/g, "");
  const safeClient = client
    ? `-${client.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32)}`
    : "";
  const name = filename ?? `grael-wholesale${safeClient}-${safeDate}.pdf`;
  doc.save(name);
  return name;
}

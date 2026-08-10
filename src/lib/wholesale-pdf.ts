/**
 * Client-side PDF for Lab wholesale partner sheet.
 * Two charts: 10-pack + single vial. Client name + sheet date.
 */
import { jsPDF } from "jspdf";
import {
  formatMoney,
  formatSheetDate,
  PARTNER_SELL_POINTS,
  roundStepLabel,
  shippingTermsLine,
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

  // Grael wordmark (Times approximates Cormorant Garamond on PDF)
  doc.setFont("times", "bold");
  doc.setFontSize(36);
  doc.setTextColor(28);
  doc.text("Grael", margin, y + 8);
  y += 28;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text("PEPTIDES", margin, y);
  y += 16;
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
    `Partner wholesale: ${offPct}% off list (defaults) · round nearest $${roundStepLabel(opts.roundMode)} · prices may be custom for this client`,
    margin,
    y,
    { maxWidth: pageW - margin * 2 },
  );
  y += 12;
  doc.text(opts.nextShipNote, margin, y);
  y += 12;
  doc.text(shippingTermsLine(opts), margin, y, { maxWidth: pageW - margin * 2 });
  y += 14;
  if (!opts.chargeShipping) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30);
    doc.text(
      "SHIPPING: NO CHARGE on this partner account — we are not charging for shipping.",
      margin,
      y,
      { maxWidth: pageW - margin * 2 },
    );
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(80);
    doc.text(
      "Cold-chain packaging still used when required; Grael covers ship cost on this sheet.",
      margin,
      y,
      { maxWidth: pageW - margin * 2 },
    );
    y += 14;
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30);
    doc.text(
      `SHIPPING: $${opts.shippingAmount || 100} flat US · cold-chain (charged on this account)`,
      margin,
      y,
    );
    y += 14;
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80);
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

  // —— Sell points for partner ——
  if (y > pageH - 160) {
    doc.addPage();
    y = margin;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text(PARTNER_SELL_POINTS.title, margin, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text(PARTNER_SELL_POINTS.subtitle, margin, y, { maxWidth: pageW - margin * 2 });
  y += 14;

  for (const pt of PARTNER_SELL_POINTS.points) {
    if (y > pageH - 56) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(25);
    doc.text(`• ${pt.title}`, margin, y);
    y += 11;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(60);
    const lines = doc.splitTextToSize(pt.body, pageW - margin * 2 - 8) as string[];
    for (const line of lines) {
      doc.text(line, margin + 8, y);
      y += 10;
    }
    y += 4;
  }

  if (y > pageH - 70) {
    doc.addPage();
    y = margin;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(25);
  doc.text("Quick talk track", margin, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(60);
  for (const t of PARTNER_SELL_POINTS.talkTrack) {
    doc.text(`– ${t}`, margin, y, { maxWidth: pageW - margin * 2 });
    y += 11;
  }
  y += 8;
  doc.setFontSize(7);
  doc.setTextColor(100);
  doc.text(PARTNER_SELL_POINTS.compliance, margin, y, { maxWidth: pageW - margin * 2 });
  y += 16;

  // How to order
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text("How to order", margin, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50);
  const steps = [
    `1. Go to ${SITE_HOST} → Shop. Product names match this sheet.`,
    "2. Choose Buy 1 vial or Buy 10-pack on each product; add to cart.",
    "3. At checkout enter your partner code (texted separately). Prices become the You pay column.",
    `4. Pay by card, or email ${opts.contactEmail} for an invoice (cash / wire / Zelle).`,
  ];
  for (const s of steps) {
    doc.text(s, margin, y, { maxWidth: pageW - margin * 2 });
    y += 12;
  }
  y += 6;
  doc.setTextColor(80);
  doc.text(
    "You pay = wholesale from Grael. Recommended retail = what to charge customers. Your margin = retail − you pay.",
    margin,
    y,
    { maxWidth: pageW - margin * 2 },
  );
  y += 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text("10-vial pack — what to buy", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100);
  y += 10;
  doc.text(
    "You pay = your cost from Grael · Recommended retail = for your customers",
    margin,
    y,
  );
  y += 14;

  const packHeaders = opts.showMargin
    ? ["Compound", "Size", "You pay", "Rec. retail", "Your margin"]
    : ["Compound", "Size", "You pay", "Rec. retail"];
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

  y += 20;

  // Research focus guide for partner selling
  if (y > pageH - 100) {
    doc.addPage();
    y = margin;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text("Research focus by compound (what to tell customers)", margin, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text(
    "Laboratory research context only — not medical claims. Use these lines when describing what each material is studied for.",
    margin,
    y,
    { maxWidth: pageW - margin * 2 },
  );
  y += 14;

  for (const r of rows) {
    if (y > pageH - 40) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(25);
    doc.text(r.name, margin, y);
    y += 11;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(55);
    const blurb = `${r.researchBlurb} · Research focus: ${r.researchFocus}`;
    const blines = doc.splitTextToSize(blurb, pageW - margin * 2) as string[];
    for (const line of blines) {
      doc.text(line, margin, y);
      y += 10;
    }
    y += 4;
  }
  y += 8;
  doc.setFontSize(7);
  doc.setTextColor(100);
  doc.text(
    "Research use only. Not for human or veterinary use. Do not claim personal health results or dosing.",
    margin,
    y,
    { maxWidth: pageW - margin * 2 },
  );
  y += 16;

  // —— Single vial chart ——
  if (y > pageH - 120) {
    doc.addPage();
    y = margin;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text("Single vial — what to buy", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100);
  y += 10;
  doc.text("Use Buy 1 vial on the site when you only need one unit of a compound.", margin, y);
  y += 14;

  const singleHeaders = opts.showMargin
    ? ["Compound", "Size", "You pay", "Rec. retail", "Your margin"]
    : ["Compound", "Size", "You pay", "Rec. retail"];
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

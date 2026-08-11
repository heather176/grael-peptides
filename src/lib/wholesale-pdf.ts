/**
 * Wholesale partner PDF — partners buy 10-packs only from Grael.
 * They may resell singles / small lots to their own customers.
 * Suggested sell (1 vial) = guide for their customer pricing, not a Grael SKU for them.
 */
import { jsPDF } from "jspdf";
import {
  formatMoney,
  formatSheetDate,
  PARTNER_SELL_POINTS,
  roundMoney,
  roundStepLabel,
  shippingTermsLine,
  SITE_HOST,
  SITE_URL,
  type PamphletOptions,
  type PamphletRow,
} from "@/lib/mail-order";

const CATALOG_URL = `${SITE_URL}/catalog`;
const CART_URL = `${SITE_URL}/cart`;
const LOGO_PATH = "/brand/grael-logo.png";

let logoDataUrl: Promise<string | null> | null = null;

function loadLogoDataUrl(): Promise<string | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (logoDataUrl) return logoDataUrl;
  logoDataUrl = (async () => {
    try {
      const res = await fetch(LOGO_PATH);
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  })();
  return logoDataUrl;
}

function mailtoUrl(email: string) {
  return `mailto:${email}?subject=${encodeURIComponent("Wholesale order — Grael Peptides")}`;
}

function drawLink(doc: jsPDF, label: string, url: string, x: number, y: number, size = 9) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(25, 90, 170);
  doc.textWithLink(label, x, y, { url });
  const w = doc.getTextWidth(label);
  doc.setDrawColor(25, 90, 170);
  doc.setLineWidth(0.45);
  doc.line(x, y + 1.2, x + w, y + 1.2);
  doc.setTextColor(35);
  return w;
}

type Col = { key: string; label: string; w: number; align: "left" | "right" };

function drawPriceTable(
  doc: jsPDF,
  y: number,
  title: string,
  subtitle: string,
  headers: Col[],
  body: string[][],
  margin: number,
  pageW: number,
  pageH: number,
  dateLabel: string,
): number {
  const ensure = (need: number) => {
    if (y + need > pageH - 48) {
      doc.addPage();
      y = margin;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(130);
      doc.text(`Grael Peptides · continued · ${dateLabel}`, margin, y);
      y += 16;
    }
  };

  ensure(50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(20);
  doc.text(title, margin, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90);
  doc.text(subtitle, margin, y, { maxWidth: pageW - margin * 2 });
  y += 14;

  ensure(24);
  doc.setFillColor(248, 248, 245);
  doc.rect(margin, y - 8, pageW - margin * 2, 20, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(80);
  let x = margin + 4;
  headers.forEach((h) => {
    if (h.align === "right") doc.text(h.label, x + h.w - 2, y, { align: "right" });
    else doc.text(h.label, x, y);
    x += h.w;
  });
  y += 10;
  doc.setDrawColor(190);
  doc.line(margin, y, pageW - margin, y);
  y += 12;

  for (const row of body) {
    ensure(28);
    x = margin + 4;
    row.forEach((cell, i) => {
      const h = headers[i]!;
      if (i === 0) {
        const parts = String(cell).split("\n");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(20);
        doc.text(parts[0] || "", x, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(100);
        if (parts[1]) doc.text(parts[1], x, y + 10, { maxWidth: h.w - 4 });
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(25);
        if (h.align === "right") doc.text(String(cell), x + h.w - 2, y + 3, { align: "right" });
        else doc.text(String(cell), x, y + 3, { maxWidth: h.w - 4 });
      }
      x += h.w;
    });
    y += 26;
    doc.setDrawColor(230);
    doc.line(margin, y - 8, pageW - margin, y - 8);
  }
  return y + 6;
}

export async function downloadWholesalePdf(
  rows: PamphletRow[],
  opts: PamphletOptions,
  filename?: string,
) {
  const logo = await loadLogoDataUrl();
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = margin;

  const dateLabel = formatSheetDate(opts.sheetDate);
  const offPct = Math.round(opts.listOff * 100);
  const client = opts.clientName.trim();
  const email = opts.contactEmail;
  const mail = mailtoUrl(email);

  const ensure = (need: number) => {
    if (y + need > pageH - 44) {
      doc.addPage();
      y = margin;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(130);
      doc.text(`Grael Peptides · continued · ${dateLabel}`, margin, y);
      y += 16;
    }
  };

  // Logo
  if (logo) {
    const logoW = 150;
    const logoH = 95;
    doc.addImage(logo, "PNG", (pageW - logoW) / 2, y, logoW, logoH);
    y += logoH + 8;
  } else {
    doc.setFont("times", "bold");
    doc.setFontSize(30);
    doc.setTextColor(20);
    doc.text("Grael", pageW / 2, y + 18, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(130);
    doc.text("PEPTIDES", pageW / 2, y + 32, { align: "center" });
    y += 44;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(25);
  doc.text("Wholesale pricing · 10-packs only (from Grael)", pageW / 2, y, {
    align: "center",
  });
  y += 14;

  if (client) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(20);
    doc.text(`Prepared for: ${client}`, pageW / 2, y, { align: "center" });
    y += 13;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50);
  doc.text(`Sheet date: ${dateLabel}`, margin, y);
  const hostW = doc.getTextWidth(SITE_HOST);
  drawLink(doc, SITE_HOST, SITE_URL, pageW - margin - hostW, y, 9);
  y += 12;
  const emailW = doc.getTextWidth(email);
  drawLink(doc, email, mail, pageW - margin - emailW, y, 9);
  y += 14;

  // Reseller how-to box
  ensure(78);
  doc.setFillColor(246, 246, 243);
  doc.roundedRect(margin, y - 2, pageW - margin * 2, 72, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20);
  doc.text("How to use this sheet", margin + 10, y + 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(50);
  const how = [
    "1. You buy only 10-vial packs from Grael — we do not sell you single vials wholesale.",
    "2. You pay = your cost for one full 10-pack. Cost / vial = You pay ÷ 10 (your floor if you resell vials).",
    "3. Suggested sell (1 vial) = guide for pricing to your customers (not a wholesale SKU from us).",
    "4. List (10-pack) = public list if you quote a full pack to a lab.",
  ];
  let hy = y + 26;
  for (const line of how) {
    doc.text(line, margin + 10, hy, { maxWidth: pageW - margin * 2 - 20 });
    hy += 11;
  }
  y += 82;

  // Links
  ensure(36);
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220);
  doc.roundedRect(margin, y - 2, pageW - margin * 2, 32, 3, 3, "S");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90);
  doc.text("Order online", margin + 10, y + 10);
  let lx = margin + 10;
  const ly = y + 24;
  lx += drawLink(doc, "Shop catalog", CATALOG_URL, lx, ly, 9) + 16;
  lx += drawLink(doc, "Cart / checkout", CART_URL, lx, ly, 9) + 16;
  drawLink(doc, "Email wholesale", mail, lx, ly, 9);
  y += 42;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(60);
  doc.text(
    `Partner wholesale: ${offPct}% off list · round nearest $${roundStepLabel(opts.roundMode)} · ${opts.nextShipNote}`,
    margin,
    y,
    { maxWidth: pageW - margin * 2 },
  );
  y += 11;
  doc.text(shippingTermsLine(opts), margin, y, { maxWidth: pageW - margin * 2 });
  y += 12;

  if (!opts.chargeShipping) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(20);
    doc.text("SHIPPING: NO CHARGE on this partner account.", margin, y);
    y += 12;
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(20);
    doc.text(`SHIPPING: $${opts.shippingAmount || 100} flat US · cold-chain`, margin, y);
    y += 12;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text(
    opts.printPartnerCode && opts.partnerCode.trim()
      ? `Access code: ${opts.partnerCode.trim().toUpperCase()}`
      : "Access code: provided by text only — not printed on this sheet",
    margin,
    y,
  );
  y += 11;
  if (opts.codeExpiresAt) {
    doc.text(`Code valid through: ${formatSheetDate(opts.codeExpiresAt)}`, margin, y);
    y += 14;
  } else {
    y += 6;
  }

  // Main pricing table — buy packs only from Grael
  const headers: Col[] = [
    { key: "name", label: "Compound", w: 118, align: "left" },
    { key: "pay", label: "You pay (10-pack)", w: 88, align: "right" },
    { key: "per", label: "Your cost / vial", w: 78, align: "right" },
    { key: "sell1", label: "Suggested sell (1 vial)", w: 100, align: "right" },
    { key: "list", label: "List (10-pack)", w: 80, align: "right" },
  ];

  const body = rows.map((r) => {
    const costPerVial = roundMoney(r.wholesale / 10, opts.roundMode === "ten" ? "dollar" : opts.roundMode);
    return [
      `${r.name}\n${r.strength}`,
      formatMoney(r.wholesale, opts.roundMode),
      formatMoney(costPerVial, "dollar"),
      formatMoney(r.singleRetail, opts.roundMode),
      formatMoney(r.listPrice, opts.roundMode),
    ];
  });

  y = drawPriceTable(
    doc,
    y,
    "10-pack wholesale (what you buy from Grael)",
    "Wholesale is 10-packs only. You pay = pack cost. Cost / vial = You pay ÷ 10 for your own resale math. Suggested sell (1 vial) is for your customers — not sold as wholesale singles by Grael.",
    headers,
    body,
    margin,
    pageW,
    pageH,
    dateLabel,
  );

  // Compact research reference (helps sales talk without cluttering prices)
  ensure(40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text("Research focus (for your customers — RUO only)", margin, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(55);
  for (const r of rows) {
    ensure(18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(25);
    doc.text(r.name, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(70);
    doc.text(` — ${r.researchBlurb}`, margin + doc.getTextWidth(r.name) + 2, y, {
      maxWidth: pageW - margin * 2 - doc.getTextWidth(r.name) - 4,
    });
    y += 11;
    doc.setTextColor(110);
    doc.text(`Research focus: ${r.researchFocus}`, margin + 6, y, {
      maxWidth: pageW - margin * 2 - 6,
    });
    y += 12;
  }

  y += 4;
  doc.setFontSize(7);
  doc.setTextColor(110);
  doc.text(
    "Research use only. Not for human or veterinary use. Do not claim personal health results or dosing.",
    margin,
    y,
    { maxWidth: pageW - margin * 2 },
  );
  y += 16;

  // Short sell points
  ensure(80);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text(PARTNER_SELL_POINTS.title, margin, y);
  y += 11;
  for (const pt of PARTNER_SELL_POINTS.points.slice(0, 4)) {
    ensure(22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(25);
    doc.text(`• ${pt.title}`, margin, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(60);
    const lines = doc.splitTextToSize(pt.body, pageW - margin * 2 - 6) as string[];
    for (const line of lines) {
      doc.text(line, margin + 8, y);
      y += 9;
    }
    y += 2;
  }
  y += 6;
  doc.setFontSize(7);
  doc.setTextColor(110);
  doc.text(PARTNER_SELL_POINTS.compliance, margin, y, { maxWidth: pageW - margin * 2 });
  y += 16;

  // How to order
  ensure(70);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text("How to order 10-packs (wholesale only)", margin, y);
  y += 13;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(40);
  doc.text("1. Open the shop: ", margin, y);
  drawLink(doc, CATALOG_URL, CATALOG_URL, margin + doc.getTextWidth("1. Open the shop: "), y, 9);
  y += 13;
  doc.setTextColor(40);
  doc.text("2. Choose Buy 10-pack only — do not order single vials on a wholesale account.", margin, y);
  y += 13;
  doc.text(
    "3. At checkout enter your partner code (texted separately). Prices become You pay.",
    margin,
    y,
    { maxWidth: pageW - margin * 2 },
  );
  y += 13;
  doc.text("4. Pay by card, crypto invoice, or email for invoice: ", margin, y);
  drawLink(
    doc,
    email,
    mail,
    margin + doc.getTextWidth("4. Pay by card, crypto invoice, or email for invoice: "),
    y,
    9,
  );
  y += 16;

  if (opts.showTestingNote) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(90);
    doc.text(
      "Independent medical-grade third-party testing has been ordered for all peptides and will be posted shortly.",
      margin,
      y,
      { maxWidth: pageW - margin * 2 },
    );
    y += 12;
  }
  if (opts.showRuo) {
    doc.setFontSize(7);
    doc.setTextColor(110);
    doc.text(
      "Research use only. Not for human or veterinary use. Not a drug, food, or cosmetic.",
      margin,
      y,
      { maxWidth: pageW - margin * 2 },
    );
  }

  doc.setFontSize(7);
  doc.setTextColor(130);
  const foot = client
    ? `Prepared for ${client} · ${dateLabel} · ${email}`
    : `Generated ${dateLabel} · ${email}`;
  doc.text(foot, pageW / 2, pageH - 28, { align: "center" });
  const urlW = doc.getTextWidth(SITE_URL);
  doc.setTextColor(25, 90, 170);
  doc.textWithLink(SITE_URL, (pageW - urlW) / 2, pageH - 16, { url: SITE_URL });

  const safeDate = opts.sheetDate.replace(/-/g, "");
  const safeClient = client
    ? `-${client
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 32)}`
    : "";
  const name = filename ?? `grael-wholesale${safeClient}-${safeDate}.pdf`;
  doc.save(name);
  return name;
}

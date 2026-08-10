/**
 * Wholesale partner PDF — logo image, clear tables (10-pack + single vial).
 * Our cost / Our margin never appear.
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

  // header
  ensure(24);
  doc.setFillColor(248, 248, 245);
  doc.rect(margin, y - 8, pageW - margin * 2, 18, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(80);
  let x = margin + 4;
  headers.forEach((h) => {
    if (h.align === "right") doc.text(h.label, x + h.w - 2, y, { align: "right" });
    else doc.text(h.label, x, y);
    x += h.w;
  });
  y += 8;
  doc.setDrawColor(190);
  doc.line(margin, y, pageW - margin, y);
  y += 12;

  for (const row of body) {
    ensure(34);
    x = margin + 4;
    row.forEach((cell, i) => {
      const h = headers[i]!;
      if (i === 0) {
        // compound name bold + size/focus on next lines already in cell with \n
        const parts = String(cell).split("\n");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(20);
        doc.text(parts[0] || "", x, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(100);
        if (parts[1]) doc.text(parts[1], x, y + 10, { maxWidth: h.w - 6 });
        if (parts[2]) doc.text(parts[2], x, y + 19, { maxWidth: h.w - 6 });
      } else if (i === 1 && headers[1]?.key === "focus") {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(55);
        const lines = doc.splitTextToSize(String(cell), h.w - 6) as string[];
        doc.text(lines.slice(0, 3), x, y);
      } else {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(25);
        if (h.align === "right") doc.text(String(cell), x + h.w - 2, y + 4, { align: "right" });
        else doc.text(String(cell), x, y + 4);
      }
      x += h.w;
    });
    y += 30;
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
  const margin = 42;
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

  // —— Logo (provided brand image) ——
  if (logo) {
    // Center logo, ~2.4" wide
    const logoW = 170;
    const logoH = 108;
    const logoX = (pageW - logoW) / 2;
    doc.addImage(logo, "PNG", logoX, y, logoW, logoH);
    y += logoH + 10;
  } else {
    doc.setFont("times", "bold");
    doc.setFontSize(32);
    doc.setTextColor(20);
    doc.text("Grael", pageW / 2, y + 20, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(130);
    doc.text("PEPTIDES", pageW / 2, y + 36, { align: "center" });
    y += 50;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(70);
  doc.text(opts.tagline, pageW / 2, y, { align: "center" });
  y += 16;

  if (client) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(20);
    doc.text(`Prepared for: ${client}`, pageW / 2, y, { align: "center" });
    y += 14;
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
  y += 16;

  // Link bar
  ensure(42);
  doc.setFillColor(246, 246, 243);
  doc.roundedRect(margin, y - 2, pageW - margin * 2, 36, 3, 3, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90);
  doc.text("Tap a link to open", margin + 12, y + 11);
  let lx = margin + 12;
  const ly = y + 26;
  lx += drawLink(doc, "Shop catalog", CATALOG_URL, lx, ly, 10) + 20;
  lx += drawLink(doc, "Cart / checkout", CART_URL, lx, ly, 10) + 20;
  drawLink(doc, "Email wholesale", mail, lx, ly, 10);
  y += 48;

  doc.setDrawColor(210);
  doc.line(margin, y, pageW - margin, y);
  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(55);
  doc.text(`Partner wholesale: ${offPct}% off list · round nearest $${roundStepLabel(opts.roundMode)}`, margin, y);
  y += 12;
  doc.text(opts.nextShipNote, margin, y);
  y += 12;
  doc.text(shippingTermsLine(opts), margin, y, { maxWidth: pageW - margin * 2 });
  y += 13;

  if (!opts.chargeShipping) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(20);
    doc.text("SHIPPING: NO CHARGE on this partner account.", margin, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(80);
    doc.text("We are not charging for shipping. Cold-chain used when required.", margin, y);
    y += 14;
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(20);
    doc.text(`SHIPPING: $${opts.shippingAmount || 100} flat US · cold-chain`, margin, y);
    y += 14;
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
    y += 4;
  }

  // —— 10-vial pack only: You pay + List (no margin, no singles) ——
  const kitHeaders: Col[] = [
    { key: "name", label: "Compound", w: 110, align: "left" },
    { key: "focus", label: "Research focus", w: 210, align: "left" },
    { key: "pay", label: "You pay (10-pack)", w: 90, align: "right" },
    { key: "list", label: "List", w: 80, align: "right" },
  ];

  const kitBody = rows.map((r) => [
    `${r.name}\n${r.strength}`,
    `${r.researchBlurb} · ${r.researchFocus}`,
    formatMoney(r.wholesale, opts.roundMode),
    formatMoney(r.listPrice, opts.roundMode),
  ]);

  y = drawPriceTable(
    doc,
    y,
    "10-vial pack pricing",
    "Order “Buy 10-pack” on the site. You pay = wholesale from Grael. List = public list price.",
    kitHeaders,
    kitBody,
    margin,
    pageW,
    pageH,
    dateLabel,
  );

  // —— Sell points (compact) ——
  ensure(90);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text(PARTNER_SELL_POINTS.title, margin, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text(PARTNER_SELL_POINTS.subtitle, margin, y, { maxWidth: pageW - margin * 2 });
  y += 12;

  for (const pt of PARTNER_SELL_POINTS.points) {
    ensure(26);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(25);
    doc.text(`• ${pt.title}`, margin, y);
    y += 11;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(60);
    const lines = doc.splitTextToSize(pt.body, pageW - margin * 2 - 6) as string[];
    for (const line of lines) {
      doc.text(line, margin + 8, y);
      y += 10;
    }
    y += 3;
  }

  ensure(48);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(25);
  doc.text("Quick talk track", margin, y);
  y += 11;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(60);
  for (const t of PARTNER_SELL_POINTS.talkTrack) {
    ensure(12);
    doc.text(`– ${t}`, margin, y, { maxWidth: pageW - margin * 2 });
    y += 11;
  }
  y += 6;
  doc.setFontSize(7);
  doc.setTextColor(110);
  doc.text(PARTNER_SELL_POINTS.compliance, margin, y, { maxWidth: pageW - margin * 2 });
  y += 16;

  // How to order
  ensure(72);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text("How to order", margin, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(40);
  doc.text("1. Open the shop: ", margin, y);
  drawLink(doc, CATALOG_URL, CATALOG_URL, margin + doc.getTextWidth("1. Open the shop: "), y, 9);
  y += 13;
  doc.setTextColor(40);
  doc.text("2. Choose Buy 1 vial or Buy 10-pack; add to cart.", margin, y);
  y += 13;
  doc.text(
    "3. At checkout enter your partner code (texted separately). Prices become You pay.",
    margin,
    y,
    { maxWidth: pageW - margin * 2 },
  );
  y += 13;
  doc.text("4. Pay by card, or email for invoice: ", margin, y);
  drawLink(
    doc,
    email,
    mail,
    margin + doc.getTextWidth("4. Pay by card, or email for invoice: "),
    y,
    9,
  );
  y += 18;

  ensure(36);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(20);
  doc.text("Quick links", margin, y);
  y += 12;
  let fx = margin;
  fx += drawLink(doc, "Shop catalog", CATALOG_URL, fx, y, 9) + 18;
  fx += drawLink(doc, "Cart / checkout", CART_URL, fx, y, 9) + 18;
  drawLink(doc, email, mail, fx, y, 9);
  y += 14;

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

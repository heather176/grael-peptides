/**
 * Wholesale partner PDF — Cormorant logo, combined pack table, clickable links.
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

let fontReady: Promise<string | null> | null = null;

/** Load Cormorant Garamond as base64 for jsPDF (browser). */
function loadCormorantBase64(): Promise<string | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (fontReady) return fontReady;
  fontReady = (async () => {
    try {
      const res = await fetch("/fonts/CormorantGaramond-SemiBold.ttf");
      if (!res.ok) return null;
      const buf = await res.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
      }
      return btoa(binary);
    } catch {
      return null;
    }
  })();
  return fontReady;
}

function registerBrandFont(doc: jsPDF, b64: string | null) {
  if (!b64) return false;
  try {
    doc.addFileToVFS("CormorantGaramond-SemiBold.ttf", b64);
    doc.addFont("CormorantGaramond-SemiBold.ttf", "Cormorant", "normal");
    doc.addFont("CormorantGaramond-SemiBold.ttf", "Cormorant", "bold");
    return true;
  } catch {
    return false;
  }
}

function mailtoUrl(email: string) {
  return `mailto:${email}?subject=${encodeURIComponent("Wholesale order — Grael Peptides")}`;
}

/** Clean blue link without broken letter-spacing */
function drawLink(
  doc: jsPDF,
  label: string,
  url: string,
  x: number,
  y: number,
  size = 9,
) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(25, 90, 170);
  doc.textWithLink(label, x, y, { url });
  const w = doc.getTextWidth(label);
  doc.setDrawColor(25, 90, 170);
  doc.setLineWidth(0.5);
  doc.line(x, y + 1.2, x + w, y + 1.2);
  doc.setTextColor(30);
  return w;
}

function drawLogo(doc: jsPDF, margin: number, y: number, hasCormorant: boolean) {
  const brand = "Grael";
  if (hasCormorant) {
    doc.setFont("Cormorant", "bold");
    doc.setFontSize(42);
  } else {
    doc.setFont("times", "bold");
    doc.setFontSize(36);
  }
  doc.setTextColor(20);
  doc.text(brand, margin, y + 10);
  const brandW = doc.getTextWidth(brand);

  // PEPTIDES centered under Grael
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(130);
  const sub = "PEPTIDES";
  const gap = 2.8;
  let subW = 0;
  for (let i = 0; i < sub.length; i++) {
    subW += doc.getTextWidth(sub[i]!);
    if (i < sub.length - 1) subW += gap;
  }
  let sx = margin + Math.max(0, (brandW - subW) / 2);
  const subY = y + 24;
  for (let i = 0; i < sub.length; i++) {
    doc.text(sub[i]!, sx, subY);
    sx += doc.getTextWidth(sub[i]!) + gap;
  }
  return subY + 14;
}

export async function downloadWholesalePdf(
  rows: PamphletRow[],
  opts: PamphletOptions,
  filename?: string,
) {
  const fontB64 = await loadCormorantBase64();
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const hasCormorant = registerBrandFont(doc, fontB64);

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
      doc.setTextColor(120);
      doc.text(`Grael Peptides · continued · ${dateLabel}`, margin, y);
      y += 16;
    }
  };

  // —— Header / logo ——
  y = drawLogo(doc, margin, y, hasCormorant);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
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

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(30);
  doc.text(`Sheet date: ${dateLabel}`, margin, y);
  // right-side links
  const hostW = doc.getTextWidth(SITE_HOST);
  drawLink(doc, SITE_HOST, SITE_URL, pageW - margin - hostW, y, 10);
  y += 13;
  const emailW = doc.getTextWidth(email);
  drawLink(doc, email, mail, pageW - margin - emailW, y, 9);
  y += 16;

  // Clean link bar
  ensure(48);
  doc.setFillColor(246, 246, 243);
  doc.roundedRect(margin, y - 2, pageW - margin * 2, 40, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(90);
  doc.text("Open the store (tap a link)", margin + 12, y + 12);
  let lx = margin + 12;
  const ly = y + 28;
  lx += drawLink(doc, "Shop catalog", CATALOG_URL, lx, ly, 10) + 18;
  lx += drawLink(doc, "Cart / checkout", CART_URL, lx, ly, 10) + 18;
  drawLink(doc, "Email wholesale", mail, lx, ly, 10);
  y += 50;

  doc.setDrawColor(210);
  doc.line(margin, y, pageW - margin, y);
  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(70);
  doc.text(
    `Partner wholesale: ${offPct}% off list · round nearest $${roundStepLabel(opts.roundMode)}`,
    margin,
    y,
  );
  y += 11;
  doc.text(opts.nextShipNote, margin, y);
  y += 11;
  doc.text(shippingTermsLine(opts), margin, y, { maxWidth: pageW - margin * 2 });
  y += 12;

  if (!opts.chargeShipping) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(20);
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
    y += 12;
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(20);
    doc.text(
      `SHIPPING: $${opts.shippingAmount || 100} flat US · cold-chain (charged on this account)`,
      margin,
      y,
    );
    y += 12;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80);
  if (opts.printPartnerCode && opts.partnerCode.trim()) {
    doc.setFont("helvetica", "bold");
    doc.text(`Access code: ${opts.partnerCode.trim().toUpperCase()}`, margin, y);
    y += 11;
  } else {
    doc.text("Access code: provided by text only — not printed on this sheet", margin, y);
    y += 11;
  }
  if (opts.codeExpiresAt) {
    doc.text(`Code valid through: ${formatSheetDate(opts.codeExpiresAt)}`, margin, y);
    y += 12;
  }

  // —— Combined pricing table: 1 vial + 10-pack + research ——
  ensure(80);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(20);
  doc.text("Pricing — 1 vial & 10-pack (what to buy)", margin, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90);
  doc.text(
    "You pay = your cost from Grael · Rec. retail = suggested customer price · Research focus = what to tell labs (RUO only)",
    margin,
    y,
    { maxWidth: pageW - margin * 2 },
  );
  y += 14;

  // Column layout (letter width ~612, margins 40 → ~532 usable)
  // Compound 78 | Focus 118 | 1 pay 48 | 1 ret 48 | 10 pay 52 | 10 ret 52 | marg 48 | size note
  const cols = {
    name: 72,
    focus: 130,
    pay1: 48,
    ret1: 48,
    pay10: 52,
    ret10: 52,
    marg: 48,
  };
  // Actually show size under name; research focus column

  const drawHead = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(100);
    let x = margin;
    const heads: [string, number, "left" | "right"][] = [
      ["Compound / size", cols.name + 8, "left"],
      ["Research focus (RUO)", cols.focus, "left"],
      ["1 vial\nYou pay", cols.pay1, "right"],
      ["1 vial\nRetail", cols.ret1, "right"],
      ["10-pack\nYou pay", cols.pay10, "right"],
      ["10-pack\nRetail", cols.ret10, "right"],
    ];
    if (opts.showMargin) heads.push(["10-pack\nmargin", cols.marg, "right"]);

    // single-line headers (compact)
    const labels = opts.showMargin
      ? ["Compound", "Research focus", "1·pay", "1·ret", "10·pay", "10·ret", "Margin"]
      : ["Compound", "Research focus", "1·pay", "1·ret", "10·pay", "10·ret"];
    const widths = opts.showMargin
      ? [cols.name + 8, cols.focus, cols.pay1, cols.ret1, cols.pay10, cols.ret10, cols.marg]
      : [cols.name + 8, cols.focus, cols.pay1, cols.ret1, cols.pay10, cols.ret10];

    x = margin;
    labels.forEach((h, i) => {
      const right = i >= 2;
      doc.text(h, right ? x + widths[i]! : x, y, { align: right ? "right" : "left" });
      x += widths[i]!;
    });
    y += 5;
    doc.setDrawColor(180);
    doc.line(margin, y, pageW - margin, y);
    y += 10;
    return widths;
  };

  let widths = drawHead();

  for (const r of rows) {
    ensure(36);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(20);
    let x = margin;
    // name + size
    doc.text(r.name, x, y, { maxWidth: widths[0]! - 2 });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(110);
    doc.text(r.vialLabel, x, y + 9, { maxWidth: widths[0]! - 2 });
    x += widths[0]!;

    // research focus (truncate carefully)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(50);
    const focus = `${r.researchBlurb}`;
    const focusLines = doc.splitTextToSize(focus, widths[1]! - 4) as string[];
    doc.text(focusLines.slice(0, 2), x, y);
    // second line research focus tag
    if (focusLines.length < 2) {
      doc.setTextColor(100);
      doc.text(r.researchFocus, x, y + 9, { maxWidth: widths[1]! - 4 });
    } else {
      doc.setTextColor(100);
      doc.text(r.researchFocus, x, y + 18, { maxWidth: widths[1]! - 4 });
    }
    x += widths[1]!;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(20);
    const nums = [
      formatMoney(r.singleWholesale, opts.roundMode),
      formatMoney(r.singleRetail, opts.roundMode),
      formatMoney(r.wholesale, opts.roundMode),
      formatMoney(r.suggestedRetail, opts.roundMode),
    ];
    if (opts.showMargin) nums.push(formatMoney(r.margin, opts.roundMode));
    nums.forEach((n, i) => {
      const wi = widths[i + 2]!;
      doc.text(n, x + wi, y + 4, { align: "right" });
      x += wi;
    });

    y += focusLines.length >= 2 || r.researchFocus ? 28 : 22;
    doc.setDrawColor(230);
    doc.line(margin, y - 6, pageW - margin, y - 6);
  }

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100);
  doc.text(
    "1·pay / 10·pay = You pay Grael · 1·ret / 10·ret = recommended retail · Margin = 10-pack retail − 10-pack you pay (before your shipping).",
    margin,
    y,
    { maxWidth: pageW - margin * 2 },
  );
  y += 16;

  // —— Sell points (compact) ——
  ensure(100);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text(PARTNER_SELL_POINTS.title, margin, y);
  y += 11;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80);
  doc.text(PARTNER_SELL_POINTS.subtitle, margin, y, { maxWidth: pageW - margin * 2 });
  y += 12;

  for (const pt of PARTNER_SELL_POINTS.points) {
    ensure(28);
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
      doc.text(line, margin + 6, y);
      y += 9;
    }
    y += 3;
  }

  ensure(50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(25);
  doc.text("Quick talk track", margin, y);
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(60);
  for (const t of PARTNER_SELL_POINTS.talkTrack) {
    ensure(12);
    doc.text(`– ${t}`, margin, y, { maxWidth: pageW - margin * 2 });
    y += 10;
  }
  y += 6;
  doc.setFontSize(7);
  doc.setTextColor(110);
  doc.text(PARTNER_SELL_POINTS.compliance, margin, y, { maxWidth: pageW - margin * 2 });
  y += 16;

  // —— How to order ——
  ensure(70);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20);
  doc.text("How to order", margin, y);
  y += 13;
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

  // Footer links
  ensure(40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(20);
  doc.text("Quick links", margin, y);
  y += 12;
  let fx = margin;
  fx += drawLink(doc, "Shop catalog", CATALOG_URL, fx, y, 9) + 16;
  fx += drawLink(doc, "Cart / checkout", CART_URL, fx, y, 9) + 16;
  drawLink(doc, email, mail, fx, y, 9);
  y += 14;

  if (opts.showTestingNote) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(90);
    doc.text(
      "Independent medical-grade third-party testing has been ordered for all peptides and will be posted shortly.",
      margin,
      y,
      { maxWidth: pageW - margin * 2 },
    );
    y += 11;
  }
  if (!opts.printPartnerCode) {
    doc.text("Partner code: by text only — never printed on this sheet.", margin, y);
    y += 11;
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

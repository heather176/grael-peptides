/**
 * Crypto checkout options for Grael.
 *
 * Stripe: enable Stablecoins (USDC) on Payment Links in Dashboard when eligible —
 * customers then see crypto at the same Stripe checkout (no code change required).
 *
 * BitPay: set bitpayCheckoutUrl (or VITE_BITPAY_CHECKOUT_URL) after you create a
 * BitPay merchant invoice / payment button for BTC + ETH (+ USDC if available).
 */

import { CONTACT } from "@/lib/mail-order";

export const CRYPTO_PAY = {
  label: "Crypto",
  /** Shown on cart / footer */
  methodsLabel: "USDC · BTC · ETH",
  shortNote: "Pay with crypto: USDC, Bitcoin, or Ethereum.",
  detail:
    "Card checkout stays on Stripe. For crypto, use BitPay when linked below, or email an order for a crypto invoice (USDC preferred; BTC and ETH accepted).",
  /** Prefer USDC for stable pricing */
  preferred: "USDC",
  also: ["BTC", "ETH"] as const,
  /**
   * BitPay hosted checkout or payment-button URL.
   * Leave empty until you create one at bitpay.com → paste the invoice/link here
   * or set env VITE_BITPAY_CHECKOUT_URL at build time.
   */
  bitpayCheckoutUrl:
    (typeof import.meta !== "undefined" &&
      (import.meta as { env?: Record<string, string> }).env?.VITE_BITPAY_CHECKOUT_URL) ||
    "",
  bitpayEnabled: false as boolean,
  invoiceEmail: CONTACT.email,
} as const;

// Recompute enabled from URL (mutable after config load)
export function bitpayIsReady() {
  const url = CRYPTO_PAY.bitpayCheckoutUrl?.trim();
  return Boolean(url && /^https?:\/\//i.test(url));
}

export type CryptoCartLine = {
  name: string;
  sku: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

/** Build mailto for crypto invoice request (works without BitPay yet). */
export function cryptoInvoiceMailto(input: {
  lines: CryptoCartLine[];
  productSubtotal: number;
  shipping: number;
  total: number;
  promoCode?: string | null;
  preferredAsset?: string;
}) {
  const preferred = input.preferredAsset || CRYPTO_PAY.preferred;
  const lines = input.lines
    .map(
      (l) =>
        `• ${l.qty}× ${l.name} (${l.sku}) @ $${l.unitPrice.toFixed(0)} = $${l.lineTotal.toFixed(0)}`,
    )
    .join("\n");
  const subject = `Crypto payment request · ${preferred} · Grael Peptides`;
  const body = [
    "Please send a crypto invoice for this order.",
    "",
    `Preferred asset: ${preferred} (also accept BTC / ETH)`,
    input.promoCode ? `Partner / promo code: ${input.promoCode}` : "Partner / promo code: (none)",
    "",
    "Items:",
    lines || "(see cart)",
    "",
    `Product subtotal: $${input.productSubtotal.toFixed(0)}`,
    `Shipping: $${input.shipping.toFixed(0)}`,
    `Order total (USD): $${input.total.toFixed(0)}`,
    "",
    "Ship-to address:",
    "(paste US shipping address)",
    "",
    "Contact email:",
    "(your email)",
  ].join("\n");

  return `mailto:${CRYPTO_PAY.invoiceEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

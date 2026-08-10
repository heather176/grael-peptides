import { createFileRoute, Link } from "@tanstack/react-router";
import { Bitcoin, ExternalLink, Minus, Package, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { DiscountCodeForm } from "@/components/discount-code-form";
import { PriceDisplay } from "@/components/price-display";
import { TraceablBadgeChip } from "@/components/traceabl-badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import {
  bitpayIsReady,
  CRYPTO_PAY,
  cryptoInvoiceMailto,
} from "@/lib/crypto-payments";
import { unitPriceForProduct, withPromoCode } from "@/lib/discount-codes";
import { useDiscount } from "@/lib/discount-store";
import { CONTACT } from "@/lib/mail-order";
import { LAUNCH, NEXT_SHIPMENT, ORDER, PRESALE, SHIPPING, STRIPE_MULTI_CHECKOUT } from "@/lib/products";
import { requireBatch } from "@/lib/traceabl-batches";
import { formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/_app/cart")({
  component: CartPage,
});

function CartPage() {
  const lines = useCart((s) => s.lines);
  const hydrated = useCart((s) => s.hydrated);
  const setHydrated = useCart((s) => s.setHydrated);
  const enriched = useCart((s) => s.enriched);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal);
  const def = useDiscount((s) => s.activeDef());
  const promoCode = def?.code ?? null;
  const wholesalePct = def?.percentOff ?? 0;

  useEffect(() => {
    if (useCart.persist.hasHydrated()) setHydrated(true);
    return useCart.persist.onFinishHydration(() => setHydrated(true));
  }, [setHydrated]);

  const ready = hydrated;
  const items = ready ? enriched() : [];
  const launchTotal = ready ? subtotal() : 0;
  const listTotal = items.reduce((n, i) => n + i.product.listPrice * i.qty, 0);
  const wholesaleTotal =
    wholesalePct > 0
      ? items.reduce(
          (n, i) => n + unitPriceForProduct(i.product, wholesalePct) * i.qty,
          0,
        )
      : launchTotal;
  const single = items.length === 1 ? items[0] : null;
  const meetsMin = wholesaleTotal >= ORDER.minProductSubtotal;
  const remainingToMin = Math.max(0, ORDER.minProductSubtotal - wholesaleTotal);
  const checkoutHref = single
    ? withPromoCode(single.product.paymentLink, promoCode)
    : withPromoCode(STRIPE_MULTI_CHECKOUT, promoCode);

  const shipAmt = SHIPPING.amount;
  const orderTotal = wholesaleTotal + shipAmt;
  const bitpayReady = bitpayIsReady();

  const cryptoMailto = useMemo(() => {
    if (!items.length) return CONTACT.emailMailto;
    return cryptoInvoiceMailto({
      lines: items.map((i) => {
        const unit = unitPriceForProduct(i.product, wholesalePct || null);
        return {
          name: i.product.name,
          sku: i.product.sku,
          qty: i.qty,
          unitPrice: unit,
          lineTotal: unit * i.qty,
        };
      }),
      productSubtotal: wholesaleTotal,
      shipping: shipAmt,
      total: orderTotal,
      promoCode,
      preferredAsset: CRYPTO_PAY.preferred,
    });
  }, [items, wholesaleTotal, shipAmt, orderTotal, promoCode, wholesalePct]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Cart</h1>
        <p className="text-sm text-[var(--color-fg-muted)]">
          {LAUNCH.active
            ? `${LAUNCH.suppliesLabel} · pay with card (Stripe) or crypto (${CRYPTO_PAY.methodsLabel}) · singles and 10-packs · or reserve next shipment (${NEXT_SHIPMENT.estimatedShipLabel}).`
            : "Pay with Stripe or crypto. Research use only."}
        </p>
      </div>

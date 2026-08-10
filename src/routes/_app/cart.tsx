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

      {!ready ? (
        <div className="space-y-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <div className="h-16 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)]" />
          <div className="h-16 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)]" />
        </div>
      ) : lines.length === 0 ? (
        <div className="space-y-4">
          <DiscountCodeForm />
          <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-card)] px-6 py-16 text-center">
            <p className="font-display text-lg font-semibold">Your cart is empty</p>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
              Add research products from the catalog to checkout.
            </p>
            <Button className="mt-6" asChild>
              <Link to="/catalog">Browse catalog</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <DiscountCodeForm />
          <ul className="space-y-3">
            {items.map(({ sku, qty, product }) => {
              const unit =
                wholesalePct > 0
                  ? unitPriceForProduct(product, wholesalePct)
                  : product.price;
              return (
                <li
                  key={sku}
                  className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <Link
                      to="/products/$sku"
                      params={{ sku }}
                      className="font-display text-base font-semibold text-[var(--color-fg)] no-underline hover:text-[var(--color-primary)]"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 font-mono text-xs text-[var(--color-fg-subtle)]">
                      {product.sku} · {product.strength}
                    </p>
                    <div className="mt-1.5">
                      <TraceablBadgeChip batch={requireBatch(product.sku)} />
                    </div>
                    <PriceDisplay product={product} size="sm" className="mt-1" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center rounded-[var(--radius-sm)] border border-[var(--color-border)]">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        aria-label="Decrease"
                        onClick={() => setQty(sku, qty - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-sm tabular">{qty}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        aria-label="Increase"
                        onClick={() => setQty(sku, qty + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="w-20 text-right font-semibold tabular">
                      {formatUsd(unit * qty)}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={withPromoCode(product.paymentLink, promoCode)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Pay
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Remove"
                      onClick={() => remove(sku)}
                    >
                      <Trash2 className="h-4 w-4 text-[var(--color-fg-subtle)]" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[var(--color-fg-muted)]">
                {wholesalePct > 0 ? `${def?.label} subtotal` : "Launch subtotal"}
              </span>
              <div className="text-right">
                <span className="font-display text-2xl font-semibold tabular">
                  {formatUsd(wholesaleTotal)}
                </span>
                {wholesalePct > 0 && wholesaleTotal < launchTotal ? (
                  <p className="text-xs text-[var(--color-fg-subtle)] line-through tabular">
                    {formatUsd(launchTotal)} launch
                  </p>
                ) : listTotal > launchTotal ? (
                  <p className="text-xs text-[var(--color-fg-subtle)] line-through tabular">
                    {formatUsd(listTotal)} list
                  </p>
                ) : null}
              </div>
            </div>
            <p className="mt-2 text-xs text-[var(--color-fg-subtle)]">
              {LAUNCH.suppliesLabel}. Pay now — packs ship after fulfillment. {SHIPPING.note}.
              Minimum product subtotal {formatUsd(ORDER.minProductSubtotal)}. Wholesale cash/wire:
              email{" "}
              <a
                href={CONTACT.emailMailto}
                className="font-medium text-[var(--color-primary)] underline-offset-2 hover:underline"
              >
                {CONTACT.email}
              </a>{" "}
              for an invoice
              {promoCode
                ? ` · Code ${promoCode} prefilled at Stripe (−${wholesalePct}%).`
                : "."}
            </p>
            <p className="mt-2 text-xs font-medium text-[var(--color-primary)]">
              {NEXT_SHIPMENT.reserveHeadline}. {NEXT_SHIPMENT.chargeWhen}
            </p>
            {!meetsMin && items.length > 0 ? (
              <p className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10 px-3 py-2 text-xs text-[var(--color-fg)]">
                Minimum product order is {formatUsd(ORDER.minProductSubtotal)} (shipping is{" "}
                {formatUsd(SHIPPING.amount)} extra). Add {formatUsd(remainingToMin)} more in vials to
                checkout.
              </p>
            ) : null}
            <div className="mt-6 flex flex-col gap-3">
              {single ? (
                meetsMin ? (
                  <Button className="w-full" size="lg" asChild>
                    <a href={checkoutHref} target="_blank" rel="noreferrer">
                      Checkout with Stripe — {single.product.name}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <Button className="w-full" size="lg" disabled>
                    Checkout · min {formatUsd(ORDER.minProductSubtotal)} product
                  </Button>
                )
              ) : (
                <>
                  {meetsMin ? (
                    <Button className="w-full" size="lg" asChild>
                      <a href={checkoutHref} target="_blank" rel="noreferrer">
                        Multi-product Stripe checkout
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button className="w-full" size="lg" disabled>
                      Checkout · min {formatUsd(ORDER.minProductSubtotal)} product
                    </Button>
                  )}
                  <p className="text-xs text-[var(--color-fg-muted)]">
                    Multi-product checkout opens the full Grael catalog in Stripe — set quantities for
                    the products you want (zero out the rest). Or use <strong>Pay</strong> on each
                    line above.
                  </p>
                </>
              )}
              {NEXT_SHIPMENT.active ? (
                <Button className="w-full" size="lg" variant="outline" asChild>
                  <Link to="/preorder">
                    <Package className="h-4 w-4" strokeWidth={1.5} />
                    Purchase next shipment (~{NEXT_SHIPMENT.estimatedShipLabel})
                  </Link>
                </Button>
              ) : null}

              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-4">
                <div className="flex items-start gap-3">
                  <Bitcoin
                    className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-fg-muted)]"
                    strokeWidth={1.5}
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-medium text-[var(--color-fg)]">
                      Pay with crypto · {CRYPTO_PAY.methodsLabel}
                    </p>
                    <p className="text-xs text-[var(--color-fg-muted)]">
                      Prefer{" "}
                      <strong className="font-medium text-[var(--color-fg)]">USDC</strong> for
                      stable pricing. Bitcoin and Ethereum also accepted.{" "}
                      {bitpayReady
                        ? "BitPay opens a hosted crypto invoice."
                        : "Request an invoice by email — we reply with payment instructions."}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  {bitpayReady && meetsMin ? (
                    <Button className="w-full" size="lg" variant="secondary" asChild>
                      <a
                        href={CRYPTO_PAY.bitpayCheckoutUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Pay with BitPay (BTC / ETH / USDC)
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  ) : null}
                  {meetsMin ? (
                    <Button
                      className="w-full"
                      size="lg"
                      variant={bitpayReady ? "outline" : "secondary"}
                      asChild
                    >
                      <a href={cryptoMailto}>Email crypto invoice · USDC / BTC / ETH</a>
                    </Button>
                  ) : (
                    <Button className="w-full" size="lg" variant="secondary" disabled>
                      Crypto · min {formatUsd(ORDER.minProductSubtotal)} product
                    </Button>
                  )}
                </div>
                <p className="mt-2 text-[11px] text-[var(--color-fg-subtle)]">
                  Include your ship-to address in the email. Order total shown:{" "}
                  {formatUsd(orderTotal)} (product + {formatUsd(shipAmt)} shipping). Research use
                  only.
                </p>
              </div>

              <Button className="w-full" size="lg" variant="secondary" asChild>
                <Link to="/catalog">Add more</Link>
              </Button>
            </div>
            {NEXT_SHIPMENT.active ? (
              <p className="mt-4 text-xs text-[var(--color-fg-muted)]">{NEXT_SHIPMENT.cartNote}</p>
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { PriceDisplay } from "@/components/price-display";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { PRESALE, STRIPE_MULTI_CHECKOUT } from "@/lib/products";
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

  useEffect(() => {
    if (useCart.persist.hasHydrated()) setHydrated(true);
    return useCart.persist.onFinishHydration(() => setHydrated(true));
  }, [setHydrated]);

  const ready = hydrated;
  const items = ready ? enriched() : [];
  const total = ready ? subtotal() : 0;
  const listTotal = items.reduce((n, i) => n + i.product.listPrice * i.qty, 0);
  const single = items.length === 1 ? items[0] : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Cart</h1>
        <p className="text-sm text-[var(--color-fg-muted)]">
          {PRESALE.active
            ? "Launch pre-sale prices · pay securely with Stripe · ships after Traceabl batch COA."
            : "Pay securely with Stripe. Research use only."}
        </p>
      </div>

      {!ready ? (
        <div className="space-y-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
          <div className="h-16 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)]" />
          <div className="h-16 animate-pulse rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)]" />
        </div>
      ) : lines.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-card)] px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold">Your cart is empty</p>
          <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
            Add research products from the catalog to checkout.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/catalog">Browse catalog</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <ul className="space-y-3">
            {items.map(({ sku, qty, product }) => (
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
                    {formatUsd(product.price * qty)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={product.paymentLink} target="_blank" rel="noreferrer">
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
            ))}
          </ul>

          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[var(--color-fg-muted)]">Pre-sale subtotal</span>
              <div className="text-right">
                <span className="font-display text-2xl font-semibold tabular">{formatUsd(total)}</span>
                {listTotal > total ? (
                  <p className="text-xs text-[var(--color-fg-subtle)] line-through tabular">
                    {formatUsd(listTotal)} list
                  </p>
                ) : null}
              </div>
            </div>
            <p className="mt-2 text-xs text-[var(--color-fg-subtle)]">
              Secure Stripe checkout. US shipping address collected at payment. Orders fulfill after
              Traceabl testing. Shipping may be billed separately if not included on the Stripe
              invoice.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {single ? (
                <Button className="w-full" size="lg" asChild>
                  <a href={single.product.paymentLink} target="_blank" rel="noreferrer">
                    Checkout with Stripe — {single.product.name}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <>
                  <Button className="w-full" size="lg" asChild>
                    <a href={STRIPE_MULTI_CHECKOUT} target="_blank" rel="noreferrer">
                      Multi-product Stripe checkout
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <p className="text-xs text-[var(--color-fg-muted)]">
                    Multi-product checkout opens the full Grael catalog in Stripe — set quantities for
                    the products you want (zero out the rest). Or use <strong>Pay</strong> on each
                    line above.
                  </p>
                </>
              )}
              <Button className="w-full" size="lg" variant="secondary" asChild>
                <Link to="/catalog">Add more</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

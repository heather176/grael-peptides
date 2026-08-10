import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { GraelWordmark } from "@/components/grael-wordmark";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/catalog" as const, label: "Shop" },
  { to: "/preorder" as const, label: "Next shipment" },
  { to: "/cart" as const, label: "Cart" },
  { to: "/about" as const, label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const count = useCart((s) => s.count());
  const hydrated = useCart((s) => s.hydrated);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6">
        <Link to="/" className="group flex items-baseline gap-2.5 no-underline">
          <GraelWordmark size="md" className="text-[1.85rem] sm:text-[2.15rem]" />
          <span className="hidden text-xs font-medium tracking-[0.2em] text-[var(--color-fg-subtle)] uppercase sm:inline">
            Peptides
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-[var(--radius-sm)] px-3 py-2 text-[0.975rem] text-[var(--color-fg-muted)] no-underline transition-colors hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild className="relative h-10 px-3">
            <Link to="/cart" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {hydrated && count > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-medium text-[var(--color-primary-fg)]">
                  {count}
                </span>
              ) : null}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-[var(--color-border)] bg-[var(--color-bg)] md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-[var(--radius-sm)] px-3 py-3 text-base text-[var(--color-fg-muted)] no-underline hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

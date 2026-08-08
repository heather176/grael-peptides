import { Outlet } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PRESALE } from "@/lib/products";

/** Single thin status strip — avoids stacked banners */
function StatusStrip() {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-0.5 px-4 py-2 text-center text-xs text-[var(--color-fg-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left">
        <p>
          <span className="font-medium text-[var(--color-fg)]">Research use only.</span> Not for
          human or animal use.
        </p>
        {PRESALE.active ? (
          <p>
            <span className="font-medium text-[var(--color-fg)]">{PRESALE.label}</span>
            {" · "}
            {PRESALE.discountLabel}. COA: 5–7 business days after receipt.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function SiteShell({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100dvh-var(--grok-banner-h,0px))] flex-col">
      <SiteHeader />
      <StatusStrip />
      <div className="flex-1">{children ?? <Outlet />}</div>
      <SiteFooter />
      <Toaster
        theme="light"
        position="bottom-right"
        toastOptions={{
          className:
            "!bg-[var(--color-bg-elevated)] !border-[var(--color-border)] !text-[var(--color-fg)]",
        }}
      />
    </div>
  );
}

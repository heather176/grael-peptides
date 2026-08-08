import { createFileRoute, Link } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <SiteShell>
      <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-16 sm:px-6">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-primary)]">
            <FlaskConical className="h-5 w-5" />
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Sign in to Grael</h1>
          <p className="text-sm text-[var(--color-fg-muted)]">
            Save preorders to your account and track fulfillment when inventory ships.
          </p>
        </div>

        <div className="space-y-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[var(--shadow-soft)]">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                variant="secondary"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/preorder" })}
              >
                Continue with {p.label}
              </Button>
            ))
          ) : (
            <p className="text-sm text-[var(--color-fg-muted)]">Sign-in is disabled in this environment.</p>
          )}
        </div>

        <p className="text-center text-sm text-[var(--color-fg-subtle)]">
          <Link to="/" className="text-[var(--color-primary)] no-underline hover:underline">
            Back to store
          </Link>
        </p>
      </main>
    </SiteShell>
  );
}

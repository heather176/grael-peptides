import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/lab")({
  component: LabLayout,
});

const labNav = [
  { to: "/lab" as const, label: "Lab home", exact: true },
  { to: "/lab/pricing" as const, label: "Pricing worksheet", exact: false },
  { to: "/labels" as const, label: "Vial labels", exact: false },
];

function LabLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-[70vh]">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <p className="text-[10px] font-medium tracking-[0.18em] text-[var(--color-fg-subtle)] uppercase">
              Internal
            </p>
            <p className="font-display text-lg font-semibold tracking-tight">Lab</p>
          </div>
          <nav className="flex flex-wrap gap-1">
            {labNav.map((item) => {
              const active = item.exact
                ? pathname === item.to || pathname === `${item.to}/`
                : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-[var(--radius-sm)] px-3 py-1.5 text-sm no-underline transition-colors",
                    active
                      ? "bg-[var(--color-fg)] text-[var(--color-bg)]"
                      : "text-[var(--color-fg-muted)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-fg)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

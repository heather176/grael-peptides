import { AlertTriangle } from "lucide-react";
import { TESTING_ORDERED } from "@/lib/products";

export function RuoBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--color-warning)]/25 bg-[var(--color-warning)]/8 px-3 py-2 text-xs text-[var(--color-fg-muted)]"
          : "flex items-start gap-3 border-b border-[var(--color-warning)]/20 bg-[var(--color-warning)]/8 px-4 py-2.5 text-xs sm:text-sm text-[var(--color-fg-muted)]"
      }
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-warning)]" strokeWidth={1.75} />
      <p className="leading-snug">
        <span className="font-semibold text-[var(--color-fg)]">Research Use Only.</span>{" "}
        Not for human or animal consumption, clinical treatment, or diagnostic use.{" "}
        {TESTING_ORDERED}
      </p>
    </div>
  );
}

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Show "PEPTIDES" lockup */
  withMark?: boolean;
  /** Size preset */
  size?: "sm" | "md" | "lg" | "xl" | "hero";
};

const sizeClass: Record<NonNullable<Props["size"]>, string> = {
  sm: "text-2xl",
  md: "text-3xl",
  lg: "text-4xl sm:text-5xl",
  xl: "text-5xl sm:text-6xl",
  hero: "text-6xl sm:text-7xl",
};

/**
 * Grael wordmark — Cormorant Garamond serif lockup (site logo font).
 */
export function GraelWordmark({ className, withMark = false, size = "md" }: Props) {
  return (
    <span
      className={cn(
        "font-display font-medium leading-none tracking-tight text-[var(--color-fg)] select-none",
        sizeClass[size],
        className,
      )}
      aria-label="Grael"
    >
      Grael
      {withMark ? (
        <span className="mt-1 block font-sans text-[0.28em] font-medium tracking-[0.28em] text-[var(--color-fg-subtle)] uppercase">
          Peptides
        </span>
      ) : null}
    </span>
  );
}

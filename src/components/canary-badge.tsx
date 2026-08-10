/**
 * Small Canary Projects mark — links to the nonprofit research site.
 * Educational / transparency only. Not a product endorsement or shop link.
 */

import { ExternalLink } from "lucide-react";
import {
  CANARY_LABEL,
  CANARY_RESEARCH_URL,
  CANARY_TAGLINE,
} from "@/lib/canary";
import { cn } from "@/lib/utils";

export type CanaryBadgeSize = "sm" | "md";

type Props = {
  size?: CanaryBadgeSize;
  className?: string;
  stopPropagation?: boolean;
};

function CanaryMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden
      className="shrink-0"
    >
      <circle cx="16" cy="16" r="15" fill="#1c1917" />
      <circle cx="16" cy="16" r="13.5" fill="none" stroke="#a8a29e" strokeWidth="0.75" />
      {/* Simple bird silhouette — abstract canary */}
      <path
        d="M9.5 18.5c1.2-3.2 3.6-5.4 6.8-6.2 1.4-.3 2.6.1 3.4 1.1.5.6.7 1.3.6 2.1-.2 1.4-1.1 2.4-2.4 3.1l-.8.4c1.1.2 2.1.7 2.8 1.5.4.5.3 1.1-.3 1.3-.5.2-1-.1-1.5-.5-.7-.6-1.5-1-2.4-1.1-1.6-.2-3.1.4-4.3 1.5-.4.4-1 .3-1.2-.2-.2-.5.1-1 .7-1.5.3-.3.5-.6.6-.9z"
        fill="#f5f5f4"
      />
      <circle cx="21.2" cy="13.8" r="0.9" fill="#1c1917" />
      <path
        d="M22.4 14.6c.7.2 1.4.1 2-.3.3-.2.3-.5 0-.6-.6-.2-1.2 0-1.8.2-.2.1-.3.4-.2.7z"
        fill="#d6d3d1"
      />
    </svg>
  );
}

const SIZE = {
  sm: {
    mark: 28,
    pad: "px-2.5 py-1.5",
    title: "text-[10px]",
    sub: "text-[9px]",
    gap: "gap-2",
  },
  md: {
    mark: 36,
    pad: "px-3 py-2",
    title: "text-xs",
    sub: "text-[10px]",
    gap: "gap-2.5",
  },
} as const;

export function CanaryBadge({
  size = "sm",
  className,
  stopPropagation = true,
}: Props) {
  const s = SIZE[size];

  return (
    <a
      href={CANARY_RESEARCH_URL}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
      }}
      className={cn(
        "inline-flex min-w-0 items-center rounded-[var(--radius-md)] border border-stone-200/90 bg-stone-50 text-left no-underline shadow-[0_1px_3px_rgba(28,25,23,0.04)] transition-colors hover:border-stone-300 hover:bg-stone-100/90",
        s.pad,
        s.gap,
        className,
      )}
      title={`${CANARY_LABEL} — ${CANARY_TAGLINE}`}
      data-canary-badge={size}
    >
      <CanaryMark size={s.mark} />
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "flex items-center gap-1 font-semibold tracking-[0.1em] text-stone-800 uppercase",
            s.title,
          )}
        >
          Canary
          <ExternalLink
            className="h-2.5 w-2.5 shrink-0 text-stone-400"
            strokeWidth={2}
            aria-hidden
          />
        </span>
        <span className={cn("block leading-snug text-stone-500", s.sub)}>
          {CANARY_TAGLINE}
        </span>
      </span>
    </a>
  );
}

/** Compact corner mark for image overlays */
export function CanaryMarkLink({
  className,
  stopPropagation = true,
}: {
  className?: string;
  stopPropagation?: boolean;
}) {
  return (
    <a
      href={CANARY_RESEARCH_URL}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
      }}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200/90 bg-white/95 shadow-sm no-underline transition-opacity hover:opacity-90",
        className,
      )}
      title={`${CANARY_LABEL} — ${CANARY_TAGLINE}`}
      aria-label={`${CANARY_LABEL}: ${CANARY_TAGLINE}`}
      data-canary-mark
    >
      <CanaryMark size={28} />
    </a>
  );
}

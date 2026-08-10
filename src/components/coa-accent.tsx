/**
 * COA accent panel — stone/silver visual language.
 * No brand naming beyond Grael / Traceabl.
 */

import { ExternalLink } from "lucide-react";
import type { BatchRecord } from "@/lib/traceabl-batches";
import { verifyUrlForBatch } from "@/lib/traceabl-batches";
import { cn } from "@/lib/utils";

const SCALLOPS = Array.from({ length: 28 }, (_, i) => {
  const a = (i / 28) * Math.PI * 2 - Math.PI / 2;
  return {
    cx: Number((100 + 94 * Math.cos(a)).toFixed(2)),
    cy: Number((100 + 94 * Math.sin(a)).toFixed(2)),
  };
});

export function SealAccent({
  monogram = "GRAEL",
  className,
  size = 88,
}: {
  monogram?: string;
  className?: string;
  size?: number;
}) {
  const label = monogram.slice(0, 9).toUpperCase();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={cn("shrink-0 seal-ring rounded-full", className)}
      aria-hidden
    >
      <defs>
        <path id="grael-seal-ring" d="M 100,100 m -72,0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0" />
      </defs>
      {SCALLOPS.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="5.5" fill="#3a3a36" />
      ))}
      <circle cx="100" cy="100" r="88" fill="#f0f0ec" stroke="#2a2a28" strokeWidth="3" />
      <circle cx="100" cy="100" r="74" fill="none" stroke="#c5c5bf" strokeWidth="1.25" />
      <text
        fill="#1c1c1a"
        fontSize="7"
        fontWeight="700"
        letterSpacing="1.4"
        fontFamily="ui-monospace, Menlo, monospace"
      >
        <textPath href="#grael-seal-ring" startOffset="0%">
          GRAEL · TRACEABL · INTEGRITY · RESEARCH ·{" "}
        </textPath>
      </text>
      <circle cx="78" cy="78" r="3.5" fill="#9a9a94" />
      <circle cx="100" cy="72" r="4.5" fill="#2a2a28" />
      <circle cx="122" cy="78" r="3.5" fill="#9a9a94" />
      <text
        x="100"
        y="108"
        textAnchor="middle"
        fill="#1c1c1a"
        fontSize={label.length > 6 ? 14 : 16}
        fontWeight="800"
        fontFamily="ui-monospace, Menlo, monospace"
      >
        {label}
      </text>
      <text
        x="100"
        y="128"
        textAnchor="middle"
        fill="#8a8a84"
        fontSize="7"
        fontWeight="700"
        letterSpacing="1.6"
        fontFamily="system-ui, sans-serif"
      >
        TRACEABL SEAL
      </text>
    </svg>
  );
}

export function CoaAccentPanel({
  batch,
  className,
}: {
  batch?: BatchRecord | null;
  className?: string;
}) {
  const live = batch?.status === "Verified" && batch.sampleId;
  const monogram = batch?.sealMonogram?.replace("·", "") ?? "GRAEL";

  const inner = (
    <div
      className={cn(
        "coa-card relative overflow-hidden rounded-[var(--radius-xl)] p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] text-[var(--color-fg-subtle)] uppercase">
            Certificate of analysis
          </p>
          <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--color-fg)]">
            {batch?.compound ?? "Grael · Traceabl"}
          </p>
          <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
            {live
              ? `Sample ${batch!.sampleId}`
              : "Independent third-party testing · results post on Traceabl"}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase",
            live
              ? "bg-[var(--color-traceabl)] text-white"
              : "border border-[var(--color-border-strong)] bg-[var(--color-parchment)] text-[var(--color-fg-muted)]",
          )}
        >
          {live ? "Pass" : "Pending"}
        </span>
      </div>

      {live ? (
        <div className="mt-5 flex flex-wrap items-end gap-3">
          <span className="font-display text-5xl font-semibold tabular tracking-tight text-[var(--color-fg)]">
            {batch!.purityPercent.toFixed(1)}%
          </span>
          <span className="mb-1.5 text-xs text-[var(--color-fg-muted)]">
            HPLC · {batch!.method}
          </span>
        </div>
      ) : (
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--color-fg-muted)]">
          Every Grael lot is bound for a Traceabl Sample ID, integrity seal, and public verify page
          when results are ready.
        </p>
      )}

      <div className="mt-6 flex items-end justify-between gap-4 border-t border-[var(--color-border)] pt-4">
        <SealAccent monogram={live ? monogram : "PEND"} size={72} />
        <div className="min-w-0 text-right">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--color-fg-subtle)] uppercase">
            Integrity seal
          </p>
          <p className="mt-1 font-mono text-xs text-[var(--color-fg)]">
            {live ? (batch!.sealMonogram ?? "Sealed") : "Awaiting result"}
          </p>
          {live ? (
            <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-traceabl)]">
              Verify on Traceabl
              <ExternalLink className="h-3 w-3" strokeWidth={2} />
            </p>
          ) : (
            <p className="mt-2 text-[11px] text-[var(--color-fg-subtle)]">RUO · Traceabl.us</p>
          )}
        </div>
      </div>
    </div>
  );

  if (live && batch) {
    return (
      <a
        href={verifyUrlForBatch(batch)}
        target="_blank"
        rel="noreferrer"
        className="block text-inherit no-underline transition-transform hover:-translate-y-0.5"
      >
        {inner}
      </a>
    );
  }
  return inner;
}

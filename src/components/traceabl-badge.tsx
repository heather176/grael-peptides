/**
 * Traceabl Integrity Seal badge for Grael product surfaces.
 *
 * Pending (testing ordered): status only — no live link yet.
 * Verified (Sample ID + seal): full link to browser COA on Traceabl.
 */

import { ExternalLink } from "lucide-react";
import type { BatchRecord } from "@/lib/traceabl-batches";
import {
  shortHash,
  TRACEABL_SITE,
  verifyUrlForBatch,
} from "@/lib/traceabl-batches";
import { cn } from "@/lib/utils";

export type TraceablBadgeSize = "sm" | "md" | "lg";

type Props = {
  batch: BatchRecord;
  size?: TraceablBadgeSize;
  className?: string;
  stopPropagation?: boolean;
};

const SIZE = {
  sm: {
    seal: 48,
    title: "text-[9px]",
    purity: "text-base",
    meta: "text-[10px]",
    pad: "rounded-[var(--radius-md)] p-2.5",
    bar: "h-9 text-xs",
  },
  md: {
    seal: 80,
    title: "text-[10px]",
    purity: "text-2xl",
    meta: "text-xs",
    pad: "rounded-[var(--radius-lg)] p-4",
    bar: "h-10 text-sm",
  },
  lg: {
    seal: 104,
    title: "text-[11px]",
    purity: "text-3xl",
    meta: "text-sm",
    pad: "rounded-[var(--radius-xl)] p-5",
    bar: "h-11 text-sm",
  },
} as const;

const SEAL = {
  fill: "#e8eee6",
  edge: "#1f3d30",
  ink: "#14281f",
  mid: "#2f5c45",
  dot: "#3d7a58",
  muted: "#5a7264",
  ring: "#c5d4c8",
};

function SealMark({
  seed,
  size,
  pending,
  monogram,
}: {
  seed: string;
  size: number;
  pending: boolean;
  monogram: string;
}) {
  const hex = (seed.replace(/[^0-9a-fA-F]/g, "") || "7A3F9C2D5A3F").toUpperCase();
  const ringText = pending
    ? "TRACEABL · TESTING ORDERED · RESULTS PENDING · "
    : `0X${hex.slice(0, 40).padEnd(40, "A")} · ON-CHAIN · `;
  const monoPretty =
    monogram.length >= 8 && !monogram.includes("·")
      ? `${monogram.slice(0, 4)}·${monogram.slice(4, 8)}`
      : monogram;

  const cx = 100;
  const cy = 100;
  const outerR = 96;
  const scallops = 28;
  const depth = 6;
  const pts: string[] = [];
  for (let i = 0; i < scallops * 2; i++) {
    const a = (i / (scallops * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : outerR - depth;
    pts.push(
      `${i === 0 ? "M" : "L"}${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`,
    );
  }
  const scallopPath = pts.join(" ") + " Z";

  const n = (i: number) => {
    const s = hex + hex;
    return parseInt(s.slice(i % 20, (i % 20) + 2) || "7a", 16);
  };
  const dots = Array.from({ length: 7 }, (_, i) => {
    const ang = (n(i * 3) / 255) * Math.PI * 1.2 - Math.PI * 0.55;
    const rad = 22 + (n(i * 3 + 1) % 18);
    return {
      x: 100 + rad * Math.cos(ang),
      y: 78 + rad * Math.sin(ang) * 0.55,
      r: 2.2 + (n(i) % 3) * 0.6,
      o: 0.55 + (n(i + 2) % 40) / 100,
    };
  });

  const ringId = `sr-${size}-${pending ? "p" : "v"}-${hex.slice(0, 4)}`;

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden className="shrink-0">
      <path d={scallopPath} fill={SEAL.fill} stroke={SEAL.edge} strokeWidth="3.5" />
      <circle cx="100" cy="100" r="78" fill="none" stroke={SEAL.ring} strokeWidth="1.25" />
      <defs>
        <path id={ringId} d="M 100,100 m -72,0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0" />
      </defs>
      <text
        fill={SEAL.ink}
        fontSize="7.5"
        fontWeight="700"
        letterSpacing="1.2"
        fontFamily="ui-monospace, Menlo, monospace"
      >
        <textPath href={`#${ringId}`} startOffset="0%">
          {ringText.repeat(2).slice(0, 80)}
        </textPath>
      </text>
      <text
        x="100"
        y="48"
        textAnchor="middle"
        fill={SEAL.mid}
        fontSize="7"
        fontWeight="800"
        letterSpacing="2"
        fontFamily="system-ui, sans-serif"
      >
        {pending ? "SEAL PENDING" : "ON-CHAIN SEAL"}
      </text>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={SEAL.dot} opacity={d.o} />
      ))}
      <circle cx="88" cy="72" r="3.2" fill={SEAL.mid} />
      <circle cx="100" cy="68" r="4" fill={SEAL.edge} />
      <circle cx="112" cy="72" r="3.2" fill={SEAL.mid} />
      <text
        x="100"
        y="108"
        textAnchor="middle"
        fill={SEAL.ink}
        fontSize="16"
        fontWeight="800"
        fontFamily="ui-monospace, Menlo, monospace"
      >
        {monoPretty}
      </text>
      <text
        x="100"
        y="128"
        textAnchor="middle"
        fill={SEAL.muted}
        fontSize="7"
        fontWeight="700"
        letterSpacing="1.4"
        fontFamily="system-ui, sans-serif"
      >
        TRACEABL · BASE
      </text>
      <text
        x="100"
        y="152"
        textAnchor="middle"
        fill={SEAL.ink}
        fontSize="6.5"
        fontWeight="600"
        fontFamily="ui-monospace, Menlo, monospace"
        opacity="0.85"
      >
        {pending ? "AWAITING RESULT" : "SEALED"}
      </text>
    </svg>
  );
}

function BadgeBody({
  batch,
  size,
}: {
  batch: BatchRecord;
  size: TraceablBadgeSize;
}) {
  const s = SIZE[size];
  const pending = batch.status === "Pending" || !batch.sampleId;
  const hash = batch.integrityHash;
  const short = hash ? shortHash(hash) : null;
  const sample = batch.sampleId ?? batch.batchId;
  const seed = hash ?? batch.batchId;
  const idLabel = batch.sampleId ? "Sample" : "Batch";
  const monogram =
    batch.sealMonogram ??
    (short ? short.replace(/[.…x0]/gi, "").slice(0, 8).toUpperCase() : "PEND");

  return (
    <>
      <div className="flex min-w-0 items-center gap-2.5">
        <SealMark seed={seed} size={s.seal} pending={pending} monogram={pending ? "PEND" : monogram} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={cn("font-semibold tracking-[0.12em] text-zinc-800 uppercase", s.title)}>
              Traceabl
            </span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 font-semibold tracking-wide uppercase",
                s.title,
                pending ? "bg-[#e8eee6] text-[#2f5c45]" : "bg-[#dce8df] text-[#1f3d30]",
              )}
            >
              {pending ? "Testing ordered" : "Verified"}
            </span>
          </div>
          {!pending ? (
            <div className="mt-0.5 flex flex-wrap items-baseline gap-1.5">
              <span
                className={cn("font-bold tabular-nums text-[#0f172a]", s.purity)}
                style={{ letterSpacing: "-0.03em" }}
              >
                {batch.purityPercent.toFixed(1)}%
              </span>
              <span className="rounded-full bg-[#2f6b4f] px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                Pass
              </span>
              {size !== "sm" ? (
                <span className={cn("text-zinc-600", s.meta)}>{batch.method}</span>
              ) : null}
            </div>
          ) : (
            <p className={cn("mt-0.5 leading-snug text-zinc-600", s.meta)}>
              Certificate posts when results are ready
            </p>
          )}
          <p className={cn("mt-0.5 truncate font-mono text-zinc-600", s.meta)}>
            <span className="text-zinc-500">{idLabel} </span>
            {sample}
          </p>
          {!pending && short && size !== "sm" ? (
            <p className={cn("mt-0.5 font-mono text-zinc-500", s.meta)} title={hash}>
              Seal {short}
              {batch.integrityChain ? " · On Base" : ""}
            </p>
          ) : null}
        </div>
      </div>

      {pending ? (
        <span
          data-traceabl-cta="pending"
          className={cn(
            "flex w-full shrink-0 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] border border-zinc-200/90 bg-zinc-100 font-semibold text-zinc-600",
            s.bar,
          )}
        >
          Testing ordered
        </span>
      ) : (
        <span
          data-traceabl-cta="live"
          className={cn(
            "flex w-full shrink-0 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] bg-[#2f5c45] font-semibold text-white",
            s.bar,
          )}
        >
          View certificate
          <ExternalLink className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
        </span>
      )}
    </>
  );
}

export function TraceablBadge({
  batch,
  size = "sm",
  className,
  stopPropagation = true,
}: Props) {
  const s = SIZE[size];
  const live = batch.status === "Verified" && Boolean(batch.sampleId);
  const href = verifyUrlForBatch(batch);
  const shell = cn(
    "flex w-full min-w-0 flex-col gap-2.5 border border-zinc-200/80 bg-[#f6f6f3] text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
    s.pad,
    className,
  );

  if (!live) {
    return (
      <div
        className={shell}
        data-traceabl-badge={size}
        data-traceabl-status="pending"
        data-sample-id={batch.sampleId ?? ""}
        title="Testing ordered · certificate link when results are ready"
      >
        <BadgeBody batch={batch} size={size} />
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
      }}
      className={cn(
        shell,
        "no-underline transition-colors hover:border-[#2f5c45]/40 active:bg-[#eef2ee]",
      )}
      title={`View certificate · ${batch.sampleId}`}
      data-traceabl-badge={size}
      data-traceabl-status="verified"
      data-sample-id={batch.sampleId}
    >
      <BadgeBody batch={batch} size={size} />
    </a>
  );
}

export function TraceablBadgeChip({
  batch,
  className,
}: {
  batch: BatchRecord;
  className?: string;
}) {
  const live = batch.status === "Verified" && Boolean(batch.sampleId);
  if (!live) {
    return (
      <span
        className={cn(
          "inline-flex min-h-8 items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-600",
          className,
        )}
      >
        Testing ordered
      </span>
    );
  }
  const href = verifyUrlForBatch(batch);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 rounded-full border border-zinc-200 bg-[#f6f6f3] px-3 py-1.5 text-[11px] font-semibold text-[#1f3d30] no-underline hover:border-[#2f5c45]/40",
        className,
      )}
    >
      View certificate
      <ExternalLink className="h-3 w-3 shrink-0" strokeWidth={2} />
    </a>
  );
}

export function TraceablBrandLink({ className }: { className?: string }) {
  return (
    <a
      href={TRACEABL_SITE}
      target="_blank"
      rel="noreferrer"
      className={cn("text-xs font-medium text-[#2f5c45] no-underline hover:underline", className)}
    >
      traceabl.us
    </a>
  );
}

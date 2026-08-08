import { CheckCircle2, ExternalLink } from "lucide-react";
import type { BatchRecord } from "@/lib/traceabl-batches";
import { cn } from "@/lib/utils";

/** Compact batch line for product cards */
export function BatchCoaLine({
  batch,
  className,
}: {
  batch: BatchRecord;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-xs", className)}>
      <span className="font-mono text-[var(--color-fg-muted)]">Batch {batch.batchId}</span>
      <span className="text-[var(--color-fg-subtle)]">·</span>
      <span className="tabular text-[var(--color-primary)]">{batch.purityPercent.toFixed(1)}%</span>
      <a
        href={batch.coaUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-0.5 font-medium text-[var(--color-primary)] no-underline hover:underline"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open(batch.coaUrl, "_blank", "noopener,noreferrer");
        }}
      >
        COA
        <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
      </a>
    </div>
  );
}

/** Product detail batch panel */
export function BatchCoaPanel({ batch }: { batch: BatchRecord }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium tracking-[0.14em] text-[var(--color-fg-subtle)] uppercase">
            Batch you are ordering
          </p>
          <p className="mt-1 font-mono text-sm font-medium text-[var(--color-fg)]">{batch.batchId}</p>
          <p className="mt-1 text-xs text-[var(--color-fg-muted)]">
            {batch.compound} · {batch.strength}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/8 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-[var(--color-primary)] uppercase">
          <CheckCircle2 className="h-3 w-3" />
          {batch.status}
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-[var(--color-fg-subtle)]">Purity</dt>
          <dd className="mt-0.5 font-semibold tabular text-[var(--color-primary)]">
            {batch.purityPercent.toFixed(1)}%
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--color-fg-subtle)]">Method</dt>
          <dd className="mt-0.5 font-medium text-[var(--color-fg)]">{batch.method}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--color-fg-subtle)]">Analyzed</dt>
          <dd className="mt-0.5 font-mono text-xs text-[var(--color-fg-muted)]">{batch.analyzedAt}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-[var(--color-fg-subtle)]">{batch.integrity}</p>
      <a
        href={batch.coaUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-xs font-medium text-[var(--color-fg)] no-underline hover:border-[var(--color-border-strong)]"
      >
        Open COA for this batch
        <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
      </a>
    </div>
  );
}

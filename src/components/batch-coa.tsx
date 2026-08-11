import { ExternalLink } from "lucide-react";
import { TraceablBadge } from "@/components/traceabl-badge";
import type { BatchRecord } from "@/lib/traceabl-batches";
import { shortHash, verifyUrlForBatch } from "@/lib/traceabl-batches";
import { cn } from "@/lib/utils";

/** Compact batch line (lists only). */
export function BatchCoaLine({
  batch,
  className,
}: {
  batch: BatchRecord;
  className?: string;
}) {
  const live = batch.status === "Verified" && Boolean(batch.sampleId);
  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-xs", className)}>
      <span className="font-mono text-[var(--color-fg-muted)]">
        {batch.sampleId ? `Sample ${batch.sampleId}` : `Batch ${batch.batchId}`}
      </span>
      <span className="text-[var(--color-fg-subtle)]">·</span>
      <span className="text-[var(--color-fg-subtle)]">
        {live ? `${batch.purityPercent.toFixed(1)}% verified` : "Testing pending"}
      </span>
    </div>
  );
}

/**
 * Product detail Traceabl block.
 * Pending → status only.
 * Verified → badge + open certificate (browser COA on Traceabl).
 */
export function BatchCoaPanel({ batch }: { batch: BatchRecord }) {
  const live = batch.status === "Verified" && Boolean(batch.sampleId);
  const coaUrl = verifyUrlForBatch(batch);
  const hash = batch.integrityHash ? shortHash(batch.integrityHash) : null;

  return (
    <div className="space-y-3">
      <TraceablBadge batch={batch} size="md" />

      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        <p className="text-sm font-medium text-[var(--color-fg)]">Lab certificate (Traceabl)</p>
        {live ? (
          <>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[11px] text-[var(--color-fg-subtle)]">Sample</dt>
                <dd className="mt-0.5 font-mono text-xs font-medium text-[var(--color-fg)]">
                  {batch.sampleId}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-[var(--color-fg-subtle)]">Purity</dt>
                <dd className="mt-0.5 font-semibold tabular text-[var(--color-primary)]">
                  {batch.purityPercent.toFixed(1)}% Pass
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-[var(--color-fg-subtle)]">Method</dt>
                <dd className="mt-0.5 font-medium text-[var(--color-fg)]">{batch.method}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-[var(--color-fg-subtle)]">Test date</dt>
                <dd className="mt-0.5 font-mono text-xs text-[var(--color-fg-muted)]">
                  {batch.analyzedAt}
                </dd>
              </div>
              {batch.sst ? (
                <div>
                  <dt className="text-[11px] text-[var(--color-fg-subtle)]">SST</dt>
                  <dd className="mt-0.5 font-medium text-[var(--color-fg)]">{batch.sst}</dd>
                </div>
              ) : null}
              {hash ? (
                <div>
                  <dt className="text-[11px] text-[var(--color-fg-subtle)]">Integrity seal</dt>
                  <dd className="mt-0.5 font-mono text-xs font-medium text-[var(--color-fg)]">
                    {batch.sealMonogram ?? hash}
                  </dd>
                </div>
              ) : null}
            </dl>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Opens the full browser COA on Traceabl (same page as the vial QR). PDF download is on
              that page.
            </p>
            <a
              href={coaUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[#2f5c45] px-4 text-sm font-semibold text-white no-underline hover:bg-[#1f3d30]"
            >
              View certificate on Traceabl
              <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </>
        ) : (
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            Testing pending. The certificate link will appear here when results are posted — same
            page a customer reaches from the vial QR.
          </p>
        )}
      </div>
    </div>
  );
}

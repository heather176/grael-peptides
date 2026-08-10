/**
 * Traceabl Product Chip v1 — partner storefront embed.
 * Art face may refine; URL contract is stable (Sample ID driven).
 * Seal edition: Integrity Seal v21
 */
import { cn } from "@/lib/utils";

export const TRACEABL_EMBED_ORIGIN = "https://www.traceabl.us";
export const PRODUCT_CHIP_NAME = "Traceabl Product Chip v1";
export const INTEGRITY_SEAL_NAME = "Traceabl Integrity Seal v21";

export function productChipEmbedSrc(opts: {
  sampleId: string;
  peptide?: string;
  mode?: "chip" | "mark" | "open";
  onChain?: boolean;
}): string {
  const u = new URL("/embed/product", TRACEABL_EMBED_ORIGIN);
  u.searchParams.set("id", opts.sampleId.trim().toUpperCase());
  if (opts.peptide) u.searchParams.set("peptide", opts.peptide);
  u.searchParams.set("mode", opts.mode ?? "chip");
  if (opts.onChain) u.searchParams.set("onChain", "1");
  return u.toString();
}

export function verifyUrlForSample(sampleId: string): string {
  return `${TRACEABL_EMBED_ORIGIN}/verify?id=${encodeURIComponent(sampleId.trim().toUpperCase())}`;
}

type Props = {
  sampleId: string;
  peptide?: string;
  mode?: "chip" | "mark" | "open";
  onChain?: boolean;
  className?: string;
  /** iframe height; chip default 88, mark 72 */
  height?: number;
};

/**
 * Live passthrough badge — loads seal from Traceabl when Sample ID is sealed.
 */
export function TraceablProductChip({
  sampleId,
  peptide,
  mode = "chip",
  onChain = false,
  className,
  height,
}: Props) {
  const h = height ?? (mode === "mark" ? 72 : 88);
  const src = productChipEmbedSrc({ sampleId, peptide, mode, onChain });
  const title =
    mode === "mark"
      ? `${INTEGRITY_SEAL_NAME} · ${sampleId}`
      : `${PRODUCT_CHIP_NAME} · ${peptide ?? sampleId}`;

  return (
    <div className={cn("w-full max-w-[340px]", className)}>
      <p className="mb-1.5 text-[10px] font-medium tracking-[0.12em] text-[var(--color-fg-subtle)] uppercase">
        {mode === "mark" ? INTEGRITY_SEAL_NAME : PRODUCT_CHIP_NAME}
      </p>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full max-w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-transparent"
        style={{ height: h, border: 0 }}
      />
      <p className="mt-1.5 text-[11px] text-[var(--color-fg-subtle)]">
        Independent lab seal ·{" "}
        <a
          href={verifyUrlForSample(sampleId)}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[var(--color-primary)] no-underline hover:underline"
        >
          Verify on Traceabl
        </a>
      </p>
    </div>
  );
}

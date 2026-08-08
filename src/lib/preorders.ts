import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  lookupDiscountCode,
  unitPriceForProduct,
} from "@/lib/discount-codes";
import { getProduct } from "@/lib/products";

const lineSchema = z.object({
  sku: z.string().min(1).max(32),
  qty: z.number().int().min(1).max(20),
});

const preorderSchema = z.object({
  email: z.string().email().max(200),
  fullName: z.string().min(2).max(120),
  institution: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
  researchAck: z.literal(true),
  lines: z.array(lineSchema).min(1).max(40),
  /** Optional wholesale / partner code — validated server-side */
  discountCode: z.string().max(64).optional(),
});

function makeId() {
  return `pre_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export const submitPreorder = createServerFn({ method: "POST" })
  .validator((input: unknown) => preorderSchema.parse(input))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");

    let discount: {
      code: string;
      label: string;
      percentOff: number;
      tier: string;
    } | null = null;

    if (data.discountCode?.trim()) {
      const result = lookupDiscountCode(data.discountCode);
      if (result.ok) {
        discount = {
          code: result.def.code,
          label: result.def.label,
          percentOff: result.def.percentOff,
          tier: result.def.tier,
        };
      }
      // Invalid/expired codes are ignored for reserve (don't block) — client should only send valid
    }

    const priced = data.lines.map((line) => {
      const product = getProduct(line.sku);
      if (!product) throw new Error(`Unknown SKU: ${line.sku}`);
      const launchPrice = product.price;
      const unitPrice = discount
        ? unitPriceForProduct(product, discount.percentOff)
        : launchPrice;
      return {
        sku: product.sku,
        name: product.name,
        strength: product.strength,
        qty: line.qty,
        unitPrice,
        launchUnitPrice: launchPrice,
        lineTotal: unitPrice * line.qty,
        discountCode: discount?.code ?? null,
        discountPercent: discount?.percentOff ?? 0,
      };
    });

    const subtotal = priced.reduce((s, l) => s + l.lineTotal, 0);
    const id = makeId();
    const sql = await getSql();

    const discountNote = discount
      ? `Discount ${discount.code} (${discount.label} −${discount.percentOff}%) applied to estimate`
      : null;
    const notesCombined = [data.notes?.trim(), discountNote].filter(Boolean).join(" · ") || null;

    await sql`
      INSERT INTO preorders (
        id, email, full_name, institution, notes, items_json, subtotal_cents, research_ack, status
      ) VALUES (
        ${id},
        ${data.email.trim().toLowerCase()},
        ${data.fullName.trim()},
        ${data.institution?.trim() || null},
        ${notesCombined},
        ${JSON.stringify({ lines: priced, discount })},
        ${Math.round(subtotal * 100)},
        ${true},
        ${"pending"}
      )
    `;

    return {
      id,
      subtotal,
      items: priced,
      discount,
      email: data.email.trim().toLowerCase(),
      fullName: data.fullName.trim(),
    };
  });

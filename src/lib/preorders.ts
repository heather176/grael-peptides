import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
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
});

function makeId() {
  return `pre_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export const submitPreorder = createServerFn({ method: "POST" })
  .validator((input: unknown) => preorderSchema.parse(input))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");

    const priced = data.lines.map((line) => {
      const product = getProduct(line.sku);
      if (!product) throw new Error(`Unknown SKU: ${line.sku}`);
      return {
        sku: product.sku,
        name: product.name,
        strength: product.strength,
        qty: line.qty,
        unitPrice: product.price,
        lineTotal: product.price * line.qty,
      };
    });

    const subtotal = priced.reduce((s, l) => s + l.lineTotal, 0);
    const id = makeId();
    const sql = await getSql();

    await sql`
      INSERT INTO preorders (
        id, email, full_name, institution, notes, items_json, subtotal_cents, research_ack, status
      ) VALUES (
        ${id},
        ${data.email.trim().toLowerCase()},
        ${data.fullName.trim()},
        ${data.institution?.trim() || null},
        ${data.notes?.trim() || null},
        ${JSON.stringify(priced)},
        ${Math.round(subtotal * 100)},
        ${true},
        ${"pending"}
      )
    `;

    return {
      id,
      subtotal,
      items: priced,
      email: data.email.trim().toLowerCase(),
      fullName: data.fullName.trim(),
    };
  });

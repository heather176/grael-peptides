export type ProductCategory =
  | "metabolic"
  | "healing"
  | "cellular"
  | "longevity"
  | "support";

export type Product = {
  sku: string;
  name: string;
  category: ProductCategory;
  strength: string;
  vials: number;
  /** Pre-sale / launch price charged at Stripe checkout */
  price: number;
  /** Full post-launch list price (shown struck through) */
  listPrice: number;
  short: string;
  description: string;
  researchFocus: string;
  researchNote: string;
  purityClaim: string;
  stripeProductId: string;
  stripePriceId: string;
  paymentLink: string;
  /** Physical form for correct vial photography */
  form: "lyophilized-white" | "lyophilized-cream" | "lyophilized-blue" | "lyophilized-amber" | "liquid-clear";
  image: string;
  /** Per-vial amount shown on label art */
  vialLabel: string;
  featured?: boolean;
  badge?: string;
};

/**
 * Launch sale (Aug 2026).
 * Current inventory: sell while supplies last.
 * Backorder path: next shipment ~10 days out.
 */
export const LAUNCH = {
  active: true,
  label: "Launch open",
  discountLabel: "15% off list",
  suppliesLabel: "While supplies last",
  note: "Launch pricing · while supplies last. Some SKUs may ship on the next wave.",
  coaNote: "Traceabl COA turnaround: target 5–7 business days after receipt.",
} as const;

/** Alias — existing components use PRESALE */
export const PRESALE = {
  active: LAUNCH.active,
  label: LAUNCH.label,
  discountLabel: LAUNCH.discountLabel,
  note: `${LAUNCH.suppliesLabel}. ${LAUNCH.note}`,
} as const;

/** Next fulfillment wave for back-ordered / reserved lines */
export const NEXT_SHIPMENT = {
  active: true,
  label: "Purchase next shipment",
  /** ISO date ~10 days from launch day 2026-08-08 */
  estimatedShipDate: "2026-08-18",
  estimatedShipLabel: "August 18, 2026",
  shortLabel: "Next ship ~Aug 18",
  daysEstimate: 10,
  note:
    "Reserve the next shipment wave. Your prices are locked at reserve — you are not charged today. When the next order goes out (~August 18, 2026), we charge the reserved total and place the supplier order.",
  cartNote:
    "Next shipment: prices reserved now · charged when the next order goes out (~Aug 18) · not charged today.",
  reserveHeadline: "Prices reserved · charged when next order goes out",
  chargeWhen:
    "Charged when the next order goes out — not today. Reserved prices (and any wholesale code) are locked at submit.",
  shortCharge: "Reserved price · charge on next order",
} as const;

export const STRIPE_MULTI_CHECKOUT =
  "https://buy.stripe.com/6oU5kD2a35mC7yL6jAfAc0C";

/**
 * Order economics:
 * - In-stock Buy now: pay first on Stripe → we place the supplier order.
 * - Next shipment reserve: prices locked now → charged when next order goes out.
 * - Flat US shipping $100 / order · $400 min product subtotal.
 */
export const ORDER = {
  payFirst: true,
  minProductSubtotal: 400,
  flowNote:
    "Pay first on in-stock checkout · next shipment prices reserved until the next order goes out",
} as const;

/** Flat US shipping charged at Stripe checkout ($100 / order). */
export const SHIPPING = {
  amount: 100,
  label: "US standard shipping",
  note: "US only · $100 flat per order · $400 min product subtotal · est. 3–7 business days after fulfillment",
  short: "+ $100 US shipping",
  stripePriceId: "price_1U2GImDi3y8Lwmj8sWNPzC0q",
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  metabolic: "Metabolic",
  healing: "Tissue Repair",
  cellular: "Cellular Energy",
  longevity: "Longevity",
  support: "Reconstitution",
};

export const products: Product[] = [
  {
    sku: "TR15",
    name: "Tirzepatide",
    category: "metabolic",
    strength: "15 mg × 10 vials",
    vials: 10,
    price: 164,
    listPrice: 193,
    short: "Dual GLP-1 / GIP receptor research compound",
    description:
      "Research-grade Tirzepatide for metabolic pathway studies. Dual agonist profile used in controlled laboratory models of energy balance and glycemic signaling.",
    researchFocus: "GLP-1 / GIP dual agonism, metabolic signaling",
    researchNote: "63% of 2026 research peptide interest is GLP-1 class",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_tr15",
    stripePriceId: "price_1U2EWIDi3y8Lwmj8ZAKN36yz",
    paymentLink: "https://buy.stripe.com/3cI14ndSL7uKaKX0ZgfAc0q",
    form: "lyophilized-cream",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "15 mg",
    featured: true,
    badge: "Core",
  },
  {
    sku: "SM15",
    name: "Semaglutide",
    category: "metabolic",
    strength: "15 mg × 10 vials",
    vials: 10,
    price: 142,
    listPrice: 168,
    short: "GLP-1 receptor agonist for metabolic research",
    description:
      "Lyophilized Semaglutide for in-vitro and preclinical metabolic research. Long-acting GLP-1 pathway reference standard.",
    researchFocus: "GLP-1 receptor signaling, appetite pathway models",
    researchNote: "Most-searched research peptide class in 2026",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_sm15",
    stripePriceId: "price_1U2EWNDi3y8Lwmj8mEnjM4XS",
    paymentLink: "https://buy.stripe.com/cNieVdbKD16m6uH9vMfAc0r",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "15 mg",
    featured: true,
    badge: "Core",
  },
  {
    sku: "RT10",
    name: "Retatrutide",
    category: "metabolic",
    strength: "10 mg × 10 vials",
    vials: 10,
    price: 208,
    listPrice: 245,
    short: "Triple agonist metabolic research compound",
    description:
      "Retatrutide (GLP-1 / GIP / glucagon) for advanced metabolic cascade research. High demand investigational research material.",
    researchFocus: "Triple receptor metabolic cascade models",
    researchNote: "Fastest-growing triple-agonist research requests",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_rt10",
    stripePriceId: "price_1U2EWQDi3y8Lwmj8Ci0LavTz",
    paymentLink: "https://buy.stripe.com/3cI7sLdSLaGW5qDbDUfAc0s",
    form: "lyophilized-cream",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "10 mg",
    featured: true,
    badge: "Rising",
  },
  {
    sku: "BC10",
    name: "BPC-157",
    category: "healing",
    strength: "10 mg × 10 vials",
    vials: 10,
    price: 109,
    listPrice: 128,
    short: "Body protection compound for tissue research",
    description:
      "BPC-157 for soft-tissue and angiogenesis pathway research. Stable research peptide widely studied in repair models.",
    researchFocus: "Tissue repair, angiogenesis signaling",
    researchNote: "Top tissue-repair compound in research demand",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_bc10",
    stripePriceId: "price_1U2EWSDi3y8Lwmj8FzjkgCZZ",
    paymentLink: "https://buy.stripe.com/eVqcN52a316mcT58rIfAc0t",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "10 mg",
    featured: true,
  },
  {
    sku: "BT5",
    name: "TB-500",
    category: "healing",
    strength: "5 mg × 10 vials",
    vials: 10,
    price: 131,
    listPrice: 154,
    short: "Thymosin Beta-4 fragment for recovery research",
    description:
      "TB-500 (Thymosin Beta-4 related) for cytoskeletal and recovery pathway research. Frequently paired with BPC-157.",
    researchFocus: "Actin regulation, recovery models",
    researchNote: "Often co-studied with BPC-157 in repair protocols",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_bt5",
    stripePriceId: "price_1U2EWVDi3y8Lwmj8v5yZmSzd",
    paymentLink: "https://buy.stripe.com/9B68wP4ibbL0g5h5fwfAc0u",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "5 mg",
  },
  {
    sku: "BB10",
    name: "BPC-157 + TB-500",
    category: "healing",
    strength: "5 mg + 5 mg × 10 vials",
    vials: 10,
    price: 175,
    listPrice: 206,
    short: "Dual repair blend for co-administration research",
    description:
      "Pre-combined BPC-157 and TB-500 blend for comparative dual-compound tissue research workflows.",
    researchFocus: "Combined repair pathway models",
    researchNote: "Most requested dual-blend in healing category",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_bb10",
    stripePriceId: "price_1U2EWYDi3y8Lwmj8R4WJSFvg",
    paymentLink: "https://buy.stripe.com/bJe8wP7un3eu2er37ofAc0v",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "5 mg + 5 mg",
    featured: true,
    badge: "Blend",
  },
  {
    sku: "MS10",
    name: "MOTS-c",
    category: "cellular",
    strength: "10 mg × 10 vials",
    vials: 10,
    price: 120,
    listPrice: 141,
    short: "Mitochondrial-derived peptide for metabolic research",
    description:
      "MOTS-c for mitochondrial and exercise-mimetic pathway research in cellular energy models.",
    researchFocus: "Mitochondrial signaling, AMPK-related models",
    researchNote: "Key mitochondrial research peptide (2026 demand cohort)",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_ms10",
    stripePriceId: "price_1U2EWaDi3y8Lwmj8d6iuCbuz",
    paymentLink: "https://buy.stripe.com/6oU5kD6qj9CS2er37ofAc0w",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "10 mg",
  },
  {
    sku: "NJ100",
    name: "NAD+",
    category: "cellular",
    strength: "100 mg × 10 vials",
    vials: 10,
    price: 87,
    listPrice: 103,
    short: "Nicotinamide adenine dinucleotide research stock",
    description:
      "NAD+ for cellular energy, redox, and sirtuin pathway laboratory research.",
    researchFocus: "Redox biology, NAD+ salvage pathways",
    researchNote: "High-volume cellular energy research staple",
    purityClaim: "Target ≥99% identity (Traceabl COA per batch)",
    stripeProductId: "grael_nj100",
    stripePriceId: "price_1U2EWdDi3y8Lwmj8kgpTjMET",
    paymentLink: "https://buy.stripe.com/cNi14n9CvaGW4mzazQfAc0x",
    form: "lyophilized-amber",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "100 mg",
  },
  {
    sku: "CU50",
    name: "GHK-Cu",
    category: "longevity",
    strength: "50 mg × 10 vials",
    vials: 10,
    price: 76,
    listPrice: 90,
    short: "Copper peptide for extracellular matrix research",
    description:
      "GHK-Cu for skin matrix, remodeling, and cosmetic-adjacent laboratory research models.",
    researchFocus: "ECM remodeling, copper peptide biology",
    researchNote: "Leading cosmetic / ECM research peptide",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_cu50",
    stripePriceId: "price_1U2EWfDi3y8Lwmj8EMNGSUrr",
    paymentLink: "https://buy.stripe.com/5kQ3cv3e77uK6uH0ZgfAc0y",
    form: "lyophilized-blue",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "50 mg",
  },
  {
    sku: "GTT600",
    name: "Glutathione",
    category: "cellular",
    strength: "600 mg × 10 vials",
    vials: 10,
    price: 98,
    listPrice: 116,
    short: "Master antioxidant tripeptide for redox research",
    description:
      "Reduced Glutathione for oxidative stress and detoxification pathway research.",
    researchFocus: "Redox balance, antioxidant defense",
    researchNote: "Core antioxidant in cellular research products",
    purityClaim: "Target ≥99% identity (Traceabl COA per batch)",
    stripeProductId: "grael_gtt600",
    stripePriceId: "price_1U2EWiDi3y8Lwmj8w7P8Teb7",
    paymentLink: "https://buy.stripe.com/7sY3cv5mf2aqdX99vMfAc0z",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "600 mg",
  },
  {
    sku: "ET10",
    name: "Epitalon",
    category: "longevity",
    strength: "10 mg × 10 vials",
    vials: 10,
    price: 65,
    listPrice: 76,
    short: "Tetrapeptide studied in telomere / aging models",
    description:
      "Epitalon for longevity and pineal peptide pathway laboratory research.",
    researchFocus: "Aging models, pineal peptide research",
    researchNote: "Classic longevity research tetrapeptide",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_et10",
    stripePriceId: "price_1U2EWlDi3y8Lwmj8riVosSMn",
    paymentLink: "https://buy.stripe.com/9B67sLdSL8yO5qD37ofAc0A",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "10 mg",
  },
  {
    sku: "WA3",
    name: "Bacteriostatic Water",
    category: "support",
    strength: "3 ml × 10 vials",
    vials: 10,
    price: 20,
    listPrice: 24,
    short: "0.9% benzyl alcohol bacteriostatic water",
    description:
      "Research reconstitution solvent. Pair with lyophilized peptides per laboratory protocol.",
    researchFocus: "Reconstitution support",
    researchNote: "Required companion for lyophilized vial research",
    purityClaim: "USP-grade research solvent",
    stripeProductId: "grael_wa3",
    stripePriceId: "price_1U2EWoDi3y8Lwmj8eYNG9aHN",
    paymentLink: "https://buy.stripe.com/bJe00j01VeXc5qD8rIfAc0B",
    form: "liquid-clear",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "3 ml",
    badge: "Support",
  },
];

export function getProduct(sku: string) {
  return products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
}

export function featuredProducts() {
  return products.filter((p) => p.featured);
}

export function productsByCategory(category: ProductCategory | "all") {
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
}

export function discountPercent(product: Product) {
  if (product.listPrice <= product.price) return 0;
  return Math.round(((product.listPrice - product.price) / product.listPrice) * 100);
}

export const FORM_LABELS: Record<Product["form"], string> = {
  "lyophilized-white": "Lyophilized powder",
  "lyophilized-cream": "Lyophilized powder",
  "lyophilized-blue": "Lyophilized copper peptide",
  "lyophilized-amber": "Lyophilized powder (amber)",
  "liquid-clear": "Clear liquid",
};

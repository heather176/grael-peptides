export type ProductCategory =
  | "metabolic"
  | "healing"
  | "cellular"
  | "longevity"
  | "support";

export type ProductPack = "kit10" | "vial";

export type Product = {
  sku: string;
  /** Family key shared by kit + single (e.g. TR15) */
  baseSku: string;
  pack: ProductPack;
  packLabel: string;
  name: string;
  category: ProductCategory;
  strength: string;
  vials: number;
  /** Launch / checkout unit price */
  price: number;
  /** Full list price (struck through; wholesale % off this) */
  listPrice: number;
  short: string;
  description: string;
  researchFocus: string;
  researchNote: string;
  purityClaim: string;
  stripeProductId: string;
  stripePriceId: string;
  paymentLink: string;
  form: "lyophilized-white" | "lyophilized-cream" | "lyophilized-blue" | "lyophilized-amber" | "liquid-clear";
  image: string;
  vialLabel: string;
  featured?: boolean;
  badge?: string;
};

export const LAUNCH = {
  active: true,
  label: "Launch open",
  discountLabel: "15% off list",
  suppliesLabel: "While supplies last",
  note: "Launch pricing · while supplies last. Choose 10-vial pack or single vial per compound.",
  coaNote: "Traceabl COA turnaround: target 5–7 business days after receipt.",
} as const;

export const PRESALE = {
  active: LAUNCH.active,
  label: LAUNCH.label,
  discountLabel: LAUNCH.discountLabel,
  note: `${LAUNCH.suppliesLabel}. ${LAUNCH.note}`,
} as const;

export const NEXT_SHIPMENT = {
  active: true,
  label: "Purchase next shipment",
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
  "https://buy.stripe.com/6oU7sL15Zg1gcT5bDUfAc0P";

export const ORDER = {
  payFirst: true,
  minProductSubtotal: 400,
  mailOrder: true,
  flowNote:
    "Mail-order: pay online (or partner invoice) → we place the supplier order → vials ship to you",
  flowDetail:
    "In-stock checkout charges now. Next shipment reserves prices and charges when the consolidated order goes out.",
} as const;

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

export const FORM_LABELS: Record<Product["form"], string> = {
  "lyophilized-white": "Lyophilized powder",
  "lyophilized-cream": "Lyophilized powder",
  "lyophilized-blue": "Lyophilized powder",
  "lyophilized-amber": "Lyophilized powder",
  "liquid-clear": "Liquid",
};

export const products: Product[] = [
  {
    sku: "TR15",
    baseSku: "TR15",
    pack: "kit10",
    packLabel: "10-vial pack",
    name: "Tirzepatide",
    category: "metabolic",
    strength: "15 mg × 10 vials",
    vials: 10,
    price: 699,
    listPrice: 822,
    short: "Dual GLP-1 / GIP receptor research compound",
    description:
      "Research-grade Tirzepatide for metabolic pathway studies. Dual agonist profile used in controlled laboratory models of energy balance and glycemic signaling.",
    researchFocus: "GLP-1 / GIP dual agonism, metabolic signaling",
    researchNote: "63% of 2026 research peptide interest is GLP-1 class",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_tr15",
    stripePriceId: "price_1U2GXcDi3y8Lwmj8wvvLRykz",
    paymentLink: "https://buy.stripe.com/3cIdR98yr7uKcT537ofAc0Q",
    form: "lyophilized-cream",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "15 mg",
    featured: true,
    badge: "Core",
  },
  {
    sku: "TR15V",
    baseSku: "TR15",
    pack: "vial",
    packLabel: "Single vial",
    name: "Tirzepatide",
    category: "metabolic",
    strength: "15 mg · single vial",
    vials: 1,
    price: 79,
    listPrice: 93,
    short: "Dual GLP-1 / GIP receptor research compound",
    description:
      "Research-grade Tirzepatide for metabolic pathway studies. Dual agonist profile used in controlled laboratory models of energy balance and glycemic signaling.",
    researchFocus: "GLP-1 / GIP dual agonism, metabolic signaling",
    researchNote: "63% of 2026 research peptide interest is GLP-1 class",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_tr15",
    stripePriceId: "price_1U2GXbDi3y8Lwmj8PD2dqOOs",
    paymentLink: "https://buy.stripe.com/dRm14ncOH02i3ivdM2fAc0R",
    form: "lyophilized-cream",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "15 mg",
    badge: "Single",
  },
  {
    sku: "SM15",
    baseSku: "SM15",
    pack: "kit10",
    packLabel: "10-vial pack",
    name: "Semaglutide",
    category: "metabolic",
    strength: "15 mg × 10 vials",
    vials: 10,
    price: 599,
    listPrice: 705,
    short: "GLP-1 receptor agonist for metabolic research",
    description:
      "Lyophilized Semaglutide for in-vitro and preclinical metabolic research. Long-acting GLP-1 pathway reference standard.",
    researchFocus: "GLP-1 receptor signaling, appetite pathway models",
    researchNote: "Most-searched research peptide class in 2026",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_sm15",
    stripePriceId: "price_1U2GXfDi3y8Lwmj8OAozWm3c",
    paymentLink: "https://buy.stripe.com/14AfZh8yr9CS9GT6jAfAc0S",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "15 mg",
    featured: true,
    badge: "Core",
  },
  {
    sku: "SM15V",
    baseSku: "SM15",
    pack: "vial",
    packLabel: "Single vial",
    name: "Semaglutide",
    category: "metabolic",
    strength: "15 mg · single vial",
    vials: 1,
    price: 69,
    listPrice: 81,
    short: "GLP-1 receptor agonist for metabolic research",
    description:
      "Lyophilized Semaglutide for in-vitro and preclinical metabolic research. Long-acting GLP-1 pathway reference standard.",
    researchFocus: "GLP-1 receptor signaling, appetite pathway models",
    researchNote: "Most-searched research peptide class in 2026",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_sm15",
    stripePriceId: "price_1U2GXeDi3y8Lwmj80bksXApu",
    paymentLink: "https://buy.stripe.com/14A7sL7un16m1an37ofAc0T",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "15 mg",
    badge: "Single",
  },
  {
    sku: "RT10",
    baseSku: "RT10",
    pack: "kit10",
    packLabel: "10-vial pack",
    name: "Retatrutide",
    category: "metabolic",
    strength: "10 mg × 10 vials",
    vials: 10,
    price: 849,
    listPrice: 999,
    short: "Triple agonist metabolic research compound",
    description:
      "Retatrutide (GLP-1 / GIP / glucagon) for advanced metabolic cascade research. High demand investigational research material.",
    researchFocus: "Triple receptor metabolic cascade models",
    researchNote: "Fastest-growing triple-agonist research requests",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_rt10",
    stripePriceId: "price_1U2GXiDi3y8Lwmj8nCuiMTm8",
    paymentLink: "https://buy.stripe.com/aFadR915Z6qG5qD0ZgfAc0U",
    form: "lyophilized-cream",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "10 mg",
    featured: true,
    badge: "Rising",
  },
  {
    sku: "RT10V",
    baseSku: "RT10",
    pack: "vial",
    packLabel: "Single vial",
    name: "Retatrutide",
    category: "metabolic",
    strength: "10 mg · single vial",
    vials: 1,
    price: 99,
    listPrice: 116,
    short: "Triple agonist metabolic research compound",
    description:
      "Retatrutide (GLP-1 / GIP / glucagon) for advanced metabolic cascade research. High demand investigational research material.",
    researchFocus: "Triple receptor metabolic cascade models",
    researchNote: "Fastest-growing triple-agonist research requests",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_rt10",
    stripePriceId: "price_1U2GXgDi3y8Lwmj80GcCWhu7",
    paymentLink: "https://buy.stripe.com/eVqcN52a3g1gbP1bDUfAc0V",
    form: "lyophilized-cream",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "10 mg",
    badge: "Single",
  },
  {
    sku: "BC10",
    baseSku: "BC10",
    pack: "kit10",
    packLabel: "10-vial pack",
    name: "BPC-157",
    category: "healing",
    strength: "10 mg × 10 vials",
    vials: 10,
    price: 399,
    listPrice: 469,
    short: "Body protection compound for tissue research",
    description:
      "BPC-157 for soft-tissue and angiogenesis pathway research. Stable research peptide widely studied in repair models.",
    researchFocus: "Tissue repair, angiogenesis signaling",
    researchNote: "Top tissue-repair compound in research demand",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_bc10",
    stripePriceId: "price_1U2GXnDi3y8Lwmj83f6PYPCM",
    paymentLink: "https://buy.stripe.com/eVqdR92a3bL0aKXdM2fAc0W",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "10 mg",
    featured: true,
  },
  {
    sku: "BC10V",
    baseSku: "BC10",
    pack: "vial",
    packLabel: "Single vial",
    name: "BPC-157",
    category: "healing",
    strength: "10 mg · single vial",
    vials: 1,
    price: 49,
    listPrice: 58,
    short: "Body protection compound for tissue research",
    description:
      "BPC-157 for soft-tissue and angiogenesis pathway research. Stable research peptide widely studied in repair models.",
    researchFocus: "Tissue repair, angiogenesis signaling",
    researchNote: "Top tissue-repair compound in research demand",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_bc10",
    stripePriceId: "price_1U2GXmDi3y8Lwmj8zBsu7JAw",
    paymentLink: "https://buy.stripe.com/3cI28rbKD5mC1angYefAc0X",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "10 mg",
    badge: "Single",
  },
  {
    sku: "BT5",
    baseSku: "BT5",
    pack: "kit10",
    packLabel: "10-vial pack",
    name: "TB-500",
    category: "healing",
    strength: "5 mg × 10 vials",
    vials: 10,
    price: 449,
    listPrice: 528,
    short: "Thymosin Beta-4 fragment for recovery research",
    description:
      "TB-500 (Thymosin Beta-4 related) for cytoskeletal and recovery pathway research. Frequently paired with BPC-157.",
    researchFocus: "Actin regulation, recovery models",
    researchNote: "Often co-studied with BPC-157 in repair protocols",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_bt5",
    stripePriceId: "price_1U2GXpDi3y8Lwmj8WeWId8Rx",
    paymentLink: "https://buy.stripe.com/14AfZheWP6qG1andM2fAc0Y",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "5 mg",
  },
  {
    sku: "BT5V",
    baseSku: "BT5",
    pack: "vial",
    packLabel: "Single vial",
    name: "TB-500",
    category: "healing",
    strength: "5 mg · single vial",
    vials: 1,
    price: 55,
    listPrice: 65,
    short: "Thymosin Beta-4 fragment for recovery research",
    description:
      "TB-500 (Thymosin Beta-4 related) for cytoskeletal and recovery pathway research. Frequently paired with BPC-157.",
    researchFocus: "Actin regulation, recovery models",
    researchNote: "Often co-studied with BPC-157 in repair protocols",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_bt5",
    stripePriceId: "price_1U2GXoDi3y8Lwmj8LVLj9e0V",
    paymentLink: "https://buy.stripe.com/00w4gzdSLdT87yL9vMfAc0Z",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "5 mg",
    badge: "Single",
  },
  {
    sku: "BB10",
    baseSku: "BB10",
    pack: "kit10",
    packLabel: "10-vial pack",
    name: "BPC-157 + TB-500",
    category: "healing",
    strength: "5 mg + 5 mg × 10 vials",
    vials: 10,
    price: 579,
    listPrice: 681,
    short: "Dual repair blend for co-administration research",
    description:
      "Pre-combined BPC-157 and TB-500 blend for comparative dual-compound tissue research workflows.",
    researchFocus: "Combined repair pathway models",
    researchNote: "Most requested dual-blend in healing category",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_bb10",
    stripePriceId: "price_1U2GXrDi3y8Lwmj8rtKJ1INO",
    paymentLink: "https://buy.stripe.com/5kQbJ17un8yObP10ZgfAc10",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "5 mg + 5 mg",
    featured: true,
    badge: "Blend",
  },
  {
    sku: "BB10V",
    baseSku: "BB10",
    pack: "vial",
    packLabel: "Single vial",
    name: "BPC-157 + TB-500",
    category: "healing",
    strength: "5 mg + 5 mg · single vial",
    vials: 1,
    price: 69,
    listPrice: 81,
    short: "Dual repair blend for co-administration research",
    description:
      "Pre-combined BPC-157 and TB-500 blend for comparative dual-compound tissue research workflows.",
    researchFocus: "Combined repair pathway models",
    researchNote: "Most requested dual-blend in healing category",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_bb10",
    stripePriceId: "price_1U2GXqDi3y8Lwmj8VCNRGrEE",
    paymentLink: "https://buy.stripe.com/3cI3cv6qj7uKbP1eQ6fAc11",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "5 mg + 5 mg",
    badge: "Single",
  },
  {
    sku: "MS10",
    baseSku: "MS10",
    pack: "kit10",
    packLabel: "10-vial pack",
    name: "MOTS-c",
    category: "cellular",
    strength: "10 mg × 10 vials",
    vials: 10,
    price: 399,
    listPrice: 469,
    short: "Mitochondrial-derived peptide for metabolic research",
    description:
      "MOTS-c for mitochondrial and exercise-mimetic pathway research in cellular energy models.",
    researchFocus: "Mitochondrial signaling, AMPK-related models",
    researchNote: "Key mitochondrial research peptide (2026 demand cohort)",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_ms10",
    stripePriceId: "price_1U2GXtDi3y8Lwmj8n9hJ24Jq",
    paymentLink: "https://buy.stripe.com/bJe00j3e702ibP16jAfAc12",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "10 mg",
  },
  {
    sku: "MS10V",
    baseSku: "MS10",
    pack: "vial",
    packLabel: "Single vial",
    name: "MOTS-c",
    category: "cellular",
    strength: "10 mg · single vial",
    vials: 1,
    price: 49,
    listPrice: 58,
    short: "Mitochondrial-derived peptide for metabolic research",
    description:
      "MOTS-c for mitochondrial and exercise-mimetic pathway research in cellular energy models.",
    researchFocus: "Mitochondrial signaling, AMPK-related models",
    researchNote: "Key mitochondrial research peptide (2026 demand cohort)",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_ms10",
    stripePriceId: "price_1U2GXsDi3y8Lwmj8M6R9fafr",
    paymentLink: "https://buy.stripe.com/bJeeVd9Cv5mCg5heQ6fAc13",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "10 mg",
    badge: "Single",
  },
  {
    sku: "NJ100",
    baseSku: "NJ100",
    pack: "kit10",
    packLabel: "10-vial pack",
    name: "NAD+",
    category: "cellular",
    strength: "100 mg × 10 vials",
    vials: 10,
    price: 279,
    listPrice: 328,
    short: "Nicotinamide adenine dinucleotide research stock",
    description:
      "NAD+ for cellular energy, redox, and sirtuin pathway laboratory research.",
    researchFocus: "Redox biology, NAD+ salvage pathways",
    researchNote: "High-volume cellular energy research staple",
    purityClaim: "Target ≥99% identity (Traceabl COA per batch)",
    stripeProductId: "grael_nj100",
    stripePriceId: "price_1U2GXyDi3y8Lwmj8OA8qocd6",
    paymentLink: "https://buy.stripe.com/dRm14n2a3g1g5qD9vMfAc14",
    form: "lyophilized-amber",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "100 mg",
  },
  {
    sku: "NJ100V",
    baseSku: "NJ100",
    pack: "vial",
    packLabel: "Single vial",
    name: "NAD+",
    category: "cellular",
    strength: "100 mg · single vial",
    vials: 1,
    price: 35,
    listPrice: 41,
    short: "Nicotinamide adenine dinucleotide research stock",
    description:
      "NAD+ for cellular energy, redox, and sirtuin pathway laboratory research.",
    researchFocus: "Redox biology, NAD+ salvage pathways",
    researchNote: "High-volume cellular energy research staple",
    purityClaim: "Target ≥99% identity (Traceabl COA per batch)",
    stripeProductId: "grael_nj100",
    stripePriceId: "price_1U2GXxDi3y8Lwmj8IntW9THg",
    paymentLink: "https://buy.stripe.com/28EbJ1cOH6qGcT59vMfAc15",
    form: "lyophilized-amber",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "100 mg",
    badge: "Single",
  },
  {
    sku: "CU50",
    baseSku: "CU50",
    pack: "kit10",
    packLabel: "10-vial pack",
    name: "GHK-Cu",
    category: "longevity",
    strength: "50 mg × 10 vials",
    vials: 10,
    price: 279,
    listPrice: 328,
    short: "Copper peptide for extracellular matrix research",
    description:
      "GHK-Cu for skin matrix, remodeling, and cosmetic-adjacent laboratory research models.",
    researchFocus: "ECM remodeling, copper peptide biology",
    researchNote: "Leading cosmetic / ECM research peptide",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_cu50",
    stripePriceId: "price_1U2GY1Di3y8Lwmj8vnqy504W",
    paymentLink: "https://buy.stripe.com/aFaaEX9Cv16mdX97nEfAc16",
    form: "lyophilized-blue",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "50 mg",
  },
  {
    sku: "CU50V",
    baseSku: "CU50",
    pack: "vial",
    packLabel: "Single vial",
    name: "GHK-Cu",
    category: "longevity",
    strength: "50 mg · single vial",
    vials: 1,
    price: 35,
    listPrice: 41,
    short: "Copper peptide for extracellular matrix research",
    description:
      "GHK-Cu for skin matrix, remodeling, and cosmetic-adjacent laboratory research models.",
    researchFocus: "ECM remodeling, copper peptide biology",
    researchNote: "Leading cosmetic / ECM research peptide",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_cu50",
    stripePriceId: "price_1U2GXzDi3y8Lwmj8wn5viNac",
    paymentLink: "https://buy.stripe.com/7sY9ATeWPeXc9GTgYefAc17",
    form: "lyophilized-blue",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "50 mg",
    badge: "Single",
  },
  {
    sku: "GTT600",
    baseSku: "GTT600",
    pack: "kit10",
    packLabel: "10-vial pack",
    name: "Glutathione",
    category: "cellular",
    strength: "600 mg × 10 vials",
    vials: 10,
    price: 329,
    listPrice: 387,
    short: "Master antioxidant tripeptide for redox research",
    description:
      "Reduced Glutathione for oxidative stress and detoxification pathway research.",
    researchFocus: "Redox balance, antioxidant defense",
    researchNote: "Core antioxidant in cellular research products",
    purityClaim: "Target ≥99% identity (Traceabl COA per batch)",
    stripeProductId: "grael_gtt600",
    stripePriceId: "price_1U2GY3Di3y8Lwmj8DfEja04J",
    paymentLink: "https://buy.stripe.com/fZudR901V3eug5hfUafAc18",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "600 mg",
  },
  {
    sku: "GTT600V",
    baseSku: "GTT600",
    pack: "vial",
    packLabel: "Single vial",
    name: "Glutathione",
    category: "cellular",
    strength: "600 mg · single vial",
    vials: 1,
    price: 39,
    listPrice: 46,
    short: "Master antioxidant tripeptide for redox research",
    description:
      "Reduced Glutathione for oxidative stress and detoxification pathway research.",
    researchFocus: "Redox balance, antioxidant defense",
    researchNote: "Core antioxidant in cellular research products",
    purityClaim: "Target ≥99% identity (Traceabl COA per batch)",
    stripeProductId: "grael_gtt600",
    stripePriceId: "price_1U2GY2Di3y8Lwmj81mq4vFt8",
    paymentLink: "https://buy.stripe.com/cNicN5g0T7uK9GTbDUfAc19",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "600 mg",
    badge: "Single",
  },
  {
    sku: "ET10",
    baseSku: "ET10",
    pack: "kit10",
    packLabel: "10-vial pack",
    name: "Epitalon",
    category: "longevity",
    strength: "10 mg × 10 vials",
    vials: 10,
    price: 279,
    listPrice: 328,
    short: "Tetrapeptide studied in telomere / aging models",
    description:
      "Epitalon for longevity and pineal peptide pathway laboratory research.",
    researchFocus: "Aging models, pineal peptide research",
    researchNote: "Classic longevity research tetrapeptide",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_et10",
    stripePriceId: "price_1U2GY6Di3y8Lwmj8YGI2vUv9",
    paymentLink: "https://buy.stripe.com/14A6oHg0T3eu5qDeQ6fAc1a",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "10 mg",
  },
  {
    sku: "ET10V",
    baseSku: "ET10",
    pack: "vial",
    packLabel: "Single vial",
    name: "Epitalon",
    category: "longevity",
    strength: "10 mg · single vial",
    vials: 1,
    price: 35,
    listPrice: 41,
    short: "Tetrapeptide studied in telomere / aging models",
    description:
      "Epitalon for longevity and pineal peptide pathway laboratory research.",
    researchFocus: "Aging models, pineal peptide research",
    researchNote: "Classic longevity research tetrapeptide",
    purityClaim: "Target ≥99% HPLC identity (Traceabl COA per batch)",
    stripeProductId: "grael_et10",
    stripePriceId: "price_1U2GY5Di3y8Lwmj85hB9FfMD",
    paymentLink: "https://buy.stripe.com/cNi9AT3e74iy5qDfUafAc1b",
    form: "lyophilized-white",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "10 mg",
    badge: "Single",
  },
  {
    sku: "WA3",
    baseSku: "WA3",
    pack: "kit10",
    packLabel: "10-vial pack",
    name: "Bacteriostatic Water",
    category: "support",
    strength: "3 ml × 10 vials",
    vials: 10,
    price: 99,
    listPrice: 116,
    short: "0.9% benzyl alcohol bacteriostatic water",
    description:
      "Research reconstitution solvent. Pair with lyophilized peptides per laboratory protocol.",
    researchFocus: "Reconstitution support",
    researchNote: "Required companion for lyophilized vial research",
    purityClaim: "USP-grade research solvent",
    stripeProductId: "grael_wa3",
    stripePriceId: "price_1U2GY9Di3y8Lwmj8zE3XBVbK",
    paymentLink: "https://buy.stripe.com/dRmeVdg0T16mg5heQ6fAc1c",
    form: "liquid-clear",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "3 ml",
    badge: "Support",
  },
  {
    sku: "WA3V",
    baseSku: "WA3",
    pack: "vial",
    packLabel: "Single vial",
    name: "Bacteriostatic Water",
    category: "support",
    strength: "3 ml · single vial",
    vials: 1,
    price: 14,
    listPrice: 16,
    short: "0.9% benzyl alcohol bacteriostatic water",
    description:
      "Research reconstitution solvent. Pair with lyophilized peptides per laboratory protocol.",
    researchFocus: "Reconstitution support",
    researchNote: "Required companion for lyophilized vial research",
    purityClaim: "USP-grade research solvent",
    stripeProductId: "grael_wa3",
    stripePriceId: "price_1U2GY7Di3y8Lwmj8ZKMp2QEw",
    paymentLink: "https://buy.stripe.com/6oU7sLg0TdT8g5hgYefAc1d",
    form: "liquid-clear",
    image: "/products/vial-unlabeled.jpg",
    vialLabel: "3 ml",
    badge: "Support",
  }
];

export function getProduct(sku: string) {
  return products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
}

/** Primary catalog cards: one per compound (10-vial pack). */
export function catalogProducts() {
  return products.filter((p) => p.pack === "kit10");
}

export function featuredProducts() {
  return products.filter((p) => p.featured && p.pack === "kit10");
}

export function siblingPacks(product: Product) {
  return products.filter((p) => p.baseSku === product.baseSku);
}

export function vialPack(baseSku: string) {
  return products.find((p) => p.baseSku === baseSku && p.pack === "vial");
}

export function kitPack(baseSku: string) {
  return products.find((p) => p.baseSku === baseSku && p.pack === "kit10");
}

export function discountPercent(product: Product) {
  if (product.listPrice <= product.price) return 0;
  return Math.round((1 - product.price / product.listPrice) * 100);
}

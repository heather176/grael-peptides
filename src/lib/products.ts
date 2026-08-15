export type ProductCategory =
  | "metabolic"
  | "healing"
  | "cellular"
  | "longevity";

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
  /** Full list price (struck through when discounted) */
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

export const TESTING_ORDERED =
  "Independent medical-grade third-party testing is pending for all peptides and will be posted shortly.";

export const LAUNCH = {
  active: true,
  label: "Launch open",
  discountLabel: "",
  suppliesLabel: "While supplies last",
  note: "Single vial default · 10-pack available · while supplies last.",
  coaNote: TESTING_ORDERED,
} as const;

export const PRESALE = {
  active: false,
  label: LAUNCH.label,
  discountLabel: "",
  note: `${LAUNCH.suppliesLabel}. ${LAUNCH.note}`,
} as const;

export const NEXT_SHIPMENT = {
  active: true,
  label: "Purchase next shipment",
  estimatedShipDate: "2026-08-12",
  estimatedShipLabel: "August 12, 2026",
  shortLabel: "Next ship Aug 12",
  daysEstimate: 2,
  note:
    "Reserve the next shipment wave. Your prices are locked at reserve — you are not charged today. When the next shipment goes out (August 12, 2026), we charge the reserved total and fulfill your packs.",
  cartNote:
    "Next shipment: prices reserved now · charged when the next shipment goes out (Aug 12) · not charged today.",
  reserveHeadline: "Prices reserved · charged when next shipment goes out",
  chargeWhen:
    "Charged when the next shipment goes out — not today. Reserved prices are locked at submit.",
  shortCharge: "Reserved price · charge on next shipment",
} as const;

export const STRIPE_MULTI_CHECKOUT =
  "https://buy.stripe.com/00waEX15ZaGW6uHcHYfAc1e";

export const ORDER = {
  payFirst: true,
  minProductSubtotal: 400,
  mailOrder: true,
  flowNote:
    "Mail-order: pay online (or partner invoice) → we produce your packs → vials ship to you",
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
};

export const FORM_LABELS: Record<Product["form"], string> = {
  "lyophilized-white": "Lyophilized powder",
  "lyophilized-cream": "Lyophilized powder",
  "lyophilized-blue": "Lyophilized powder",
  "lyophilized-amber": "Lyophilized powder",
  "liquid-clear": "Liquid",
};

/** Launch: single vial + 10-vial pack per compound (default display = single). */
export const SELL_SINGLES = true;

export const products: Product[] = [
  {
    sku: "TR15",
    baseSku: "TR15",
    pack: "kit10",
    packLabel: "10-vial pack",
    name: "Tirzepatide",
    category: "metabolic",
    strength: "10-vial × 15 mg",
    vials: 10,
    price: 700,
    listPrice: 820,
    short: "Dual GLP-1 / GIP receptor research compound",
    description:
      "Research-grade Tirzepatide for metabolic pathway studies. Dual agonist profile used in controlled laboratory models of energy balance and glycemic signaling.",
    researchFocus: "GLP-1 / GIP dual agonism, metabolic signaling",
    researchNote: "63% of 2026 research peptide interest is GLP-1 class",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_tr15",
    stripePriceId: "price_1U2GXcDi3y8Lwmj8wvvLRykz",
    paymentLink: "https://buy.stripe.com/3cIdR98yr7uKcT537ofAc0Q",
    form: "lyophilized-cream",
    image: "/products/vial-bpc.jpg",
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
    strength: "1-vial × 15 mg",
    vials: 1,
    price: 80,
    listPrice: 90,
    short: "Dual GLP-1 / GIP receptor research compound",
    description:
      "Research-grade Tirzepatide for metabolic pathway studies. Dual agonist profile used in controlled laboratory models of energy balance and glycemic signaling.",
    researchFocus: "GLP-1 / GIP dual agonism, metabolic signaling",
    researchNote: "63% of 2026 research peptide interest is GLP-1 class",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_tr15",
    stripePriceId: "price_1U2GXbDi3y8Lwmj8PD2dqOOs",
    paymentLink: "https://buy.stripe.com/dRm14ncOH02i3ivdM2fAc0R",
    form: "lyophilized-cream",
    image: "/products/vial-bpc.jpg",
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
    strength: "10-vial × 15 mg",
    vials: 10,
    price: 600,
    listPrice: 700,
    short: "GLP-1 receptor agonist for metabolic research",
    description:
      "Lyophilized Semaglutide for in-vitro and preclinical metabolic research. Long-acting GLP-1 pathway reference standard.",
    researchFocus: "GLP-1 receptor signaling, appetite pathway models",
    researchNote: "Most-searched research peptide class in 2026",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_sm15",
    stripePriceId: "price_1U2GXfDi3y8Lwmj8OAozWm3c",
    paymentLink: "https://buy.stripe.com/14AfZh8yr9CS9GT6jAfAc0S",
    form: "lyophilized-white",
    image: "/products/vial-bpc.jpg",
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
    strength: "1-vial × 15 mg",
    vials: 1,
    price: 70,
    listPrice: 80,
    short: "GLP-1 receptor agonist for metabolic research",
    description:
      "Lyophilized Semaglutide for in-vitro and preclinical metabolic research. Long-acting GLP-1 pathway reference standard.",
    researchFocus: "GLP-1 receptor signaling, appetite pathway models",
    researchNote: "Most-searched research peptide class in 2026",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_sm15",
    stripePriceId: "price_1U2GXeDi3y8Lwmj80bksXApu",
    paymentLink: "https://buy.stripe.com/14A7sL7un16m1an37ofAc0T",
    form: "lyophilized-white",
    image: "/products/vial-bpc.jpg",
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
    strength: "10-vial × 10 mg",
    vials: 10,
    price: 850,
    listPrice: 1000,
    short: "Triple agonist metabolic research compound",
    description:
      "Retatrutide (GLP-1 / GIP / glucagon) for advanced metabolic cascade research. High demand investigational research material.",
    researchFocus: "Triple receptor metabolic cascade models",
    researchNote: "Fastest-growing triple-agonist research requests",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_rt10",
    stripePriceId: "price_1U2GXiDi3y8Lwmj8nCuiMTm8",
    paymentLink: "https://buy.stripe.com/aFadR915Z6qG5qD0ZgfAc0U",
    form: "lyophilized-cream",
    image: "/products/vial-bpc.jpg",
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
    strength: "1-vial × 10 mg",
    vials: 1,
    price: 100,
    listPrice: 120,
    short: "Triple agonist metabolic research compound",
    description:
      "Retatrutide (GLP-1 / GIP / glucagon) for advanced metabolic cascade research. High demand investigational research material.",
    researchFocus: "Triple receptor metabolic cascade models",
    researchNote: "Fastest-growing triple-agonist research requests",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_rt10",
    stripePriceId: "price_1U2GXgDi3y8Lwmj80GcCWhu7",
    paymentLink: "https://buy.stripe.com/eVqcN52a3g1gbP1bDUfAc0V",
    form: "lyophilized-cream",
    image: "/products/vial-bpc.jpg",
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
    strength: "10-vial × 10 mg",
    vials: 10,
    price: 400,
    listPrice: 470,
    short: "Body protection compound for tissue research",
    description:
      "BPC-157 for soft-tissue and angiogenesis pathway research. Stable research peptide widely studied in repair models.",
    researchFocus: "Tissue repair, angiogenesis signaling",
    researchNote: "Top tissue-repair compound in research demand",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_bc10",
    stripePriceId: "price_1U2GXnDi3y8Lwmj83f6PYPCM",
    paymentLink: "https://buy.stripe.com/eVqdR92a3bL0aKXdM2fAc0W",
    form: "lyophilized-white",
    image: "/products/vial-bpc.jpg",
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
    strength: "1-vial × 10 mg",
    vials: 1,
    price: 50,
    listPrice: 60,
    short: "Body protection compound for tissue research",
    description:
      "BPC-157 for soft-tissue and angiogenesis pathway research. Stable research peptide widely studied in repair models.",
    researchFocus: "Tissue repair, angiogenesis signaling",
    researchNote: "Top tissue-repair compound in research demand",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_bc10",
    stripePriceId: "price_1U2GXmDi3y8Lwmj8zBsu7JAw",
    paymentLink: "https://buy.stripe.com/3cI28rbKD5mC1angYefAc0X",
    form: "lyophilized-white",
    image: "/products/vial-bpc.jpg",
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
    strength: "10-vial × 5 mg",
    vials: 10,
    price: 450,
    listPrice: 530,
    short: "Thymosin Beta-4 fragment for recovery research",
    description:
      "TB-500 (Thymosin Beta-4 related) for cytoskeletal and recovery pathway research. Frequently paired with BPC-157.",
    researchFocus: "Actin regulation, recovery models",
    researchNote: "Often co-studied with BPC-157 in repair protocols",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_bt5",
    stripePriceId: "price_1U2GXpDi3y8Lwmj8WeWId8Rx",
    paymentLink: "https://buy.stripe.com/14AfZheWP6qG1andM2fAc0Y",
    form: "lyophilized-white",
    image: "/products/vial-bpc.jpg",
    vialLabel: "5 mg",
  },
  {
    sku: "BT5V",
    baseSku: "BT5",
    pack: "vial",
    packLabel: "Single vial",
    name: "TB-500",
    category: "healing",
    strength: "1-vial × 5 mg",
    vials: 1,
    price: 60,
    listPrice: 70,
    short: "Thymosin Beta-4 fragment for recovery research",
    description:
      "TB-500 (Thymosin Beta-4 related) for cytoskeletal and recovery pathway research. Frequently paired with BPC-157.",
    researchFocus: "Actin regulation, recovery models",
    researchNote: "Often co-studied with BPC-157 in repair protocols",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_bt5",
    stripePriceId: "price_1U2GXoDi3y8Lwmj8LVLj9e0V",
    paymentLink: "https://buy.stripe.com/00w4gzdSLdT87yL9vMfAc0Z",
    form: "lyophilized-white",
    image: "/products/vial-bpc.jpg",
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
    strength: "10-vial × 5 mg + 5 mg",
    vials: 10,
    price: 580,
    listPrice: 680,
    short: "Dual repair blend for co-administration research",
    description:
      "Pre-combined BPC-157 and TB-500 blend for comparative dual-compound tissue research workflows.",
    researchFocus: "Combined repair pathway models",
    researchNote: "Most requested dual-blend in healing category",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_bb10",
    stripePriceId: "price_1U2GXrDi3y8Lwmj8rtKJ1INO",
    paymentLink: "https://buy.stripe.com/5kQbJ17un8yObP10ZgfAc10",
    form: "lyophilized-white",
    image: "/products/vial-bpc.jpg",
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
    strength: "1-vial × 5 mg + 5 mg",
    vials: 1,
    price: 70,
    listPrice: 80,
    short: "Dual repair blend for co-administration research",
    description:
      "Pre-combined BPC-157 and TB-500 blend for comparative dual-compound tissue research workflows.",
    researchFocus: "Combined repair pathway models",
    researchNote: "Most requested dual-blend in healing category",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_bb10",
    stripePriceId: "price_1U2GXqDi3y8Lwmj8VCNRGrEE",
    paymentLink: "https://buy.stripe.com/3cI3cv6qj7uKbP1eQ6fAc11",
    form: "lyophilized-white",
    image: "/products/vial-bpc.jpg",
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
    strength: "10-vial × 10 mg",
    vials: 10,
    price: 400,
    listPrice: 470,
    short: "Mitochondrial-derived peptide for metabolic research",
    description:
      "MOTS-c for mitochondrial and exercise-mimetic pathway research in cellular energy models.",
    researchFocus: "Mitochondrial signaling, AMPK-related models",
    researchNote: "Key mitochondrial research peptide (2026 demand cohort)",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_ms10",
    stripePriceId: "price_1U2GXtDi3y8Lwmj8n9hJ24Jq",
    paymentLink: "https://buy.stripe.com/bJe00j3e702ibP16jAfAc12",
    form: "lyophilized-white",
    image: "/products/vial-bpc.jpg",
    vialLabel: "10 mg",
  },
  {
    sku: "MS10V",
    baseSku: "MS10",
    pack: "vial",
    packLabel: "Single vial",
    name: "MOTS-c",
    category: "cellular",
    strength: "1-vial × 10 mg",
    vials: 1,
    price: 50,
    listPrice: 60,
    short: "Mitochondrial-derived peptide for metabolic research",
    description:
      "MOTS-c for mitochondrial and exercise-mimetic pathway research in cellular energy models.",
    researchFocus: "Mitochondrial signaling, AMPK-related models",
    researchNote: "Key mitochondrial research peptide (2026 demand cohort)",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_ms10",
    stripePriceId: "price_1U2GXsDi3y8Lwmj8M6R9fafr",
    paymentLink: "https://buy.stripe.com/bJeeVd9Cv5mCg5heQ6fAc13",
    form: "lyophilized-white",
    image: "/products/vial-bpc.jpg",
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
    strength: "10-vial × 100 mg",
    vials: 10,
    price: 280,
    listPrice: 330,
    short: "Nicotinamide adenine dinucleotide research stock",
    description:
      "NAD+ for cellular energy, redox, and sirtuin pathway laboratory research.",
    researchFocus: "Redox biology, NAD+ salvage pathways",
    researchNote: "High-volume cellular energy research staple",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_nj100",
    stripePriceId: "price_1U2GXyDi3y8Lwmj8OA8qocd6",
    paymentLink: "https://buy.stripe.com/dRm14n2a3g1g5qD9vMfAc14",
    form: "lyophilized-amber",
    image: "/products/vial-bpc.jpg",
    vialLabel: "100 mg",
  },
  {
    sku: "NJ100V",
    baseSku: "NJ100",
    pack: "vial",
    packLabel: "Single vial",
    name: "NAD+",
    category: "cellular",
    strength: "1-vial × 100 mg",
    vials: 1,
    price: 40,
    listPrice: 50,
    short: "Nicotinamide adenine dinucleotide research stock",
    description:
      "NAD+ for cellular energy, redox, and sirtuin pathway laboratory research.",
    researchFocus: "Redox biology, NAD+ salvage pathways",
    researchNote: "High-volume cellular energy research staple",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_nj100",
    stripePriceId: "price_1U2GXxDi3y8Lwmj8IntW9THg",
    paymentLink: "https://buy.stripe.com/28EbJ1cOH6qGcT59vMfAc15",
    form: "lyophilized-amber",
    image: "/products/vial-bpc.jpg",
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
    strength: "10-vial × 50 mg",
    vials: 10,
    price: 280,
    listPrice: 330,
    short: "Copper peptide for extracellular matrix research",
    description:
      "GHK-Cu for skin matrix, remodeling, and cosmetic-adjacent laboratory research models.",
    researchFocus: "ECM remodeling, copper peptide biology",
    researchNote: "Leading cosmetic / ECM research peptide",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_cu50",
    stripePriceId: "price_1U2GY1Di3y8Lwmj8vnqy504W",
    paymentLink: "https://buy.stripe.com/aFaaEX9Cv16mdX97nEfAc16",
    form: "lyophilized-blue",
    image: "/products/vial-bpc.jpg",
    vialLabel: "50 mg",
  },
  {
    sku: "CU50V",
    baseSku: "CU50",
    pack: "vial",
    packLabel: "Single vial",
    name: "GHK-Cu",
    category: "longevity",
    strength: "1-vial × 50 mg",
    vials: 1,
    price: 40,
    listPrice: 50,
    short: "Copper peptide for extracellular matrix research",
    description:
      "GHK-Cu for skin matrix, remodeling, and cosmetic-adjacent laboratory research models.",
    researchFocus: "ECM remodeling, copper peptide biology",
    researchNote: "Leading cosmetic / ECM research peptide",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_cu50",
    stripePriceId: "price_1U2GXzDi3y8Lwmj8wn5viNac",
    paymentLink: "https://buy.stripe.com/7sY9ATeWPeXc9GTgYefAc17",
    form: "lyophilized-blue",
    image: "/products/vial-bpc.jpg",
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
    strength: "10-vial × 600 mg",
    vials: 10,
    price: 330,
    listPrice: 390,
    short: "Master antioxidant tripeptide for redox research",
    description:
      "Reduced Glutathione for oxidative stress and detoxification pathway research.",
    researchFocus: "Redox balance, antioxidant defense",
    researchNote: "Core antioxidant in cellular research products",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_gtt600",
    stripePriceId: "price_1U2GY3Di3y8Lwmj8DfEja04J",
    paymentLink: "https://buy.stripe.com/fZudR901V3eug5hfUafAc18",
    form: "lyophilized-white",
    image: "/products/vial-bpc.jpg",
    vialLabel: "600 mg",
  },
  {
    sku: "GTT600V",
    baseSku: "GTT600",
    pack: "vial",
    packLabel: "Single vial",
    name: "Glutathione",
    category: "cellular",
    strength: "1-vial × 600 mg",
    vials: 1,
    price: 40,
    listPrice: 50,
    short: "Master antioxidant tripeptide for redox research",
    description:
      "Reduced Glutathione for oxidative stress and detoxification pathway research.",
    researchFocus: "Redox balance, antioxidant defense",
    researchNote: "Core antioxidant in cellular research products",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_gtt600",
    stripePriceId: "price_1U2GY2Di3y8Lwmj81mq4vFt8",
    paymentLink: "https://buy.stripe.com/cNicN5g0T7uK9GTbDUfAc19",
    form: "lyophilized-white",
    image: "/products/vial-bpc.jpg",
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
    strength: "10-vial × 10 mg",
    vials: 10,
    price: 280,
    listPrice: 330,
    short: "Tetrapeptide studied in telomere / aging models",
    description:
      "Epitalon for longevity and pineal peptide pathway laboratory research.",
    researchFocus: "Aging models, pineal peptide research",
    researchNote: "Classic longevity research tetrapeptide",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_et10",
    stripePriceId: "price_1U2GY6Di3y8Lwmj8YGI2vUv9",
    paymentLink: "https://buy.stripe.com/14A6oHg0T3eu5qDeQ6fAc1a",
    form: "lyophilized-white",
    image: "/products/vial-bpc.jpg",
    vialLabel: "10 mg",
  },
  {
    sku: "ET10V",
    baseSku: "ET10",
    pack: "vial",
    packLabel: "Single vial",
    name: "Epitalon",
    category: "longevity",
    strength: "1-vial × 10 mg",
    vials: 1,
    price: 40,
    listPrice: 50,
    short: "Tetrapeptide studied in telomere / aging models",
    description:
      "Epitalon for longevity and pineal peptide pathway laboratory research.",
    researchFocus: "Aging models, pineal peptide research",
    researchNote: "Classic longevity research tetrapeptide",
    purityClaim: "Medical-grade testing · Traceabl COA per batch",
    stripeProductId: "grael_et10",
    stripePriceId: "price_1U2GY5Di3y8Lwmj85hB9FfMD",
    paymentLink: "https://buy.stripe.com/cNi9AT3e74iy5qDfUafAc1b",
    form: "lyophilized-white",
    image: "/products/vial-bpc.jpg",
    vialLabel: "10 mg",
    badge: "Single",
  },
];

export function getProduct(sku: string) {
  const found = products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
  if (!found) return undefined;
  // Singles not sold at launch — resolve to the 10-pack
  if (!SELL_SINGLES && found.pack === "vial") {
    return products.find((p) => p.baseSku === found.baseSku && p.pack === "kit10") ?? found;
  }
  return found;
}

/** Primary catalog cards: one per compound (card price leads with single vial). */
export function catalogProducts() {
  return products.filter((p) => p.pack === "kit10");
}

export function featuredProducts() {
  return products.filter((p) => p.featured && p.pack === "kit10");
}

/** Pack options: single vial first, then 10-pack. */
export function siblingPacks(product: Product) {
  const sibs = products.filter((p) => p.baseSku === product.baseSku);
  const list = !SELL_SINGLES ? sibs.filter((p) => p.pack === "kit10") : sibs;
  return [...list].sort((a, b) => {
    if (a.pack === "vial" && b.pack !== "vial") return -1;
    if (b.pack === "vial" && a.pack !== "vial") return 1;
    return 0;
  });
}

export function vialPack(baseSku: string) {
  if (!SELL_SINGLES) return undefined;
  return products.find((p) => p.baseSku === baseSku && p.pack === "vial");
}

export function kitPack(baseSku: string) {
  return products.find((p) => p.baseSku === baseSku && p.pack === "kit10");
}

export function sellableProducts() {
  return SELL_SINGLES ? products : products.filter((p) => p.pack === "kit10");
}

export function packPurchaseLabel(product: Product) {
  if (product.pack === "vial") return `Buy 1 vial · $${product.price}`;
  return `Buy 10-pack · $${product.price}`;
}

export function packShortLabel(product: Product) {
  return product.pack === "vial" ? "1 vial" : "10-pack";
}

export function discountPercent(product: Product) {
  if (product.listPrice <= product.price) return 0;
  // Public catalog shows flat launch prices (no pre-sale callout)
  if (!PRESALE.active) return 0;
  return Math.round((1 - product.price / product.listPrice) * 100);
}

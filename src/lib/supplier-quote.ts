/**
 * Digested supplier wholesale quote (1 box = 10 vials).
 * Source: peptide wholesale price list provided Aug 2026.
 */

export type SupplierQuoteRow = {
  sku: string;
  name: string;
  /** Label e.g. 15mg*10vials */
  packLabel: string;
  /** Your cost for 1 box (10 vials) from supplier */
  boxCost: number;
  /** Maps to Grael catalog baseSku when we sell this strength */
  catalogBaseSku?: string;
};

/** Full quote — 1 box prices as provided */
export const SUPPLIER_QUOTE: SupplierQuoteRow[] = [
  // Tirzepatide
  { sku: "TR5", name: "Tirzepatide", packLabel: "5mg × 10 vials", boxCost: 49 },
  { sku: "TR10", name: "Tirzepatide", packLabel: "10mg × 10 vials", boxCost: 67 },
  { sku: "TR15", name: "Tirzepatide", packLabel: "15mg × 10 vials", boxCost: 83, catalogBaseSku: "TR15" },
  { sku: "TR20", name: "Tirzepatide", packLabel: "20mg × 10 vials", boxCost: 110 },
  { sku: "TR30", name: "Tirzepatide", packLabel: "30mg × 10 vials", boxCost: 155 },
  { sku: "TR40", name: "Tirzepatide", packLabel: "40mg × 10 vials", boxCost: 200 },
  { sku: "TR50", name: "Tirzepatide", packLabel: "50mg × 10 vials", boxCost: 215 },
  { sku: "TR60", name: "Tirzepatide", packLabel: "60mg × 10 vials", boxCost: 232 },
  // Semaglutide
  { sku: "SM5", name: "Semaglutide", packLabel: "5mg × 10 vials", boxCost: 42 },
  { sku: "SM10", name: "Semaglutide", packLabel: "10mg × 10 vials", boxCost: 60 },
  { sku: "SM15", name: "Semaglutide", packLabel: "15mg × 10 vials", boxCost: 81, catalogBaseSku: "SM15" },
  { sku: "SM20", name: "Semaglutide", packLabel: "20mg × 10 vials", boxCost: 90 },
  // Retatrutide
  { sku: "RT5", name: "Retatrutide", packLabel: "5mg × 10 vials", boxCost: 91 },
  { sku: "RT10", name: "Retatrutide", packLabel: "10mg × 10 vials", boxCost: 130, catalogBaseSku: "RT10" },
  { sku: "RT15", name: "Retatrutide", packLabel: "15mg × 10 vials", boxCost: 160 },
  { sku: "RT20", name: "Retatrutide", packLabel: "20mg × 10 vials", boxCost: 207 },
  { sku: "RT30", name: "Retatrutide", packLabel: "30mg × 10 vials", boxCost: 270 },
  { sku: "RT40", name: "Retatrutide", packLabel: "40mg × 10 vials", boxCost: 370 },
  { sku: "RT50", name: "Retatrutide", packLabel: "50mg × 10 vials", boxCost: 430 },
  { sku: "RT60", name: "Retatrutide", packLabel: "60mg × 10 vials", boxCost: 550 },
  // Cagrilintide
  { sku: "CGL5", name: "Cagrilintide", packLabel: "5mg × 10 vials", boxCost: 117 },
  { sku: "CGL1", name: "Cagrilintide", packLabel: "10mg × 10 vials", boxCost: 227 },
  { sku: "KLOW", name: "Klow (TB+BPC+GHK+KPV)", packLabel: "80mg × 10 vials", boxCost: 240 },
  { sku: "LC216", name: "Lipo-c", packLabel: "10ml × 10 vials", boxCost: 80 },
  { sku: "BBG70", name: "Glow (TB+BPC+GHK)", packLabel: "70mg × 10 vials", boxCost: 227 },
  // TB-500
  { sku: "BT5", name: "TB-500", packLabel: "5mg × 10 vials", boxCost: 89, catalogBaseSku: "BT5" },
  { sku: "BT10", name: "TB-500", packLabel: "10mg × 10 vials", boxCost: 168 },
  // BPC-157
  { sku: "BC5", name: "BPC-157", packLabel: "5mg × 10 vials", boxCost: 48 },
  { sku: "BC10", name: "BPC-157", packLabel: "10mg × 10 vials", boxCost: 70, catalogBaseSku: "BC10" },
  // BPC + TB blends
  { sku: "BB10", name: "BPC 5mg + TB 5mg", packLabel: "10mg × 10 vials", boxCost: 117, catalogBaseSku: "BB10" },
  { sku: "BB20", name: "BPC 10mg + TB 10mg", packLabel: "20mg × 10 vials", boxCost: 196 },
  { sku: "BB30", name: "BPC 15mg + TB 15mg", packLabel: "30mg × 10 vials", boxCost: 305 },
  // NAD+
  { sku: "NJ100", name: "NAD+", packLabel: "100mg × 10 vials", boxCost: 45, catalogBaseSku: "NJ100" },
  { sku: "NJ500", name: "NAD+", packLabel: "500mg × 10 vials", boxCost: 90 },
  { sku: "NJ1000", name: "NAD+", packLabel: "1000mg × 10 vials", boxCost: 169 },
  // AOD
  { sku: "5AD", name: "AOD9604", packLabel: "5mg × 10 vials", boxCost: 101 },
  { sku: "10AD", name: "AOD9604", packLabel: "10mg × 10 vials", boxCost: 185 },
  // L-carnitine
  { sku: "LC600", name: "L-carnitine", packLabel: "600mg × 10 vials", boxCost: 40 },
  { sku: "LC1200", name: "L-carnitine", packLabel: "1200mg × 10 vials", boxCost: 50 },
  // SS / CJC
  { sku: "2S10", name: "SS-31", packLabel: "10mg × 10 vials", boxCost: 105 },
  { sku: "2S50", name: "SS-31", packLabel: "50mg × 10 vials", boxCost: 410 },
  { sku: "CND2", name: "CJC-1295 no DAC", packLabel: "2mg × 10 vials", boxCost: 41 },
  { sku: "CND5", name: "CJC-1295 no DAC", packLabel: "5mg × 10 vials", boxCost: 95 },
  { sku: "CND10", name: "CJC-1295 no DAC", packLabel: "10mg × 10 vials", boxCost: 185 },
  { sku: "CD2", name: "CJC-1295 with DAC", packLabel: "2mg × 10 vials", boxCost: 72 },
  { sku: "CD5", name: "CJC-1295 with DAC", packLabel: "5mg × 10 vials", boxCost: 172 },
  { sku: "CP10", name: "CJC no DAC + IPA", packLabel: "10mg × 10 vials", boxCost: 115 },
  // Melanotan / KPV
  { sku: "MT1", name: "Melanotan I", packLabel: "10mg × 10 vials", boxCost: 62 },
  { sku: "ML5", name: "Melanotan II", packLabel: "5mg × 10 vials", boxCost: 54 },
  { sku: "ML10", name: "Melanotan II", packLabel: "10mg × 10 vials", boxCost: 62 },
  { sku: "KP5", name: "KPV", packLabel: "5mg × 10 vials", boxCost: 54 },
  { sku: "KP10", name: "KPV", packLabel: "10mg × 10 vials", boxCost: 69 },
  // Water / acetic
  { sku: "WA10", name: "Bacteriostatic water", packLabel: "10ml × 10 vials", boxCost: 11 },
  { sku: "AA3", name: "Acetic acid solution", packLabel: "3ml × 10 vials", boxCost: 10 },
  { sku: "AA10", name: "Acetic acid solution", packLabel: "10ml × 10 vials", boxCost: 11 },
  // Sermorelin / Tesamorelin
  { sku: "SMO5", name: "Sermorelin", packLabel: "5mg × 10 vials", boxCost: 70 },
  { sku: "SMO10", name: "Sermorelin", packLabel: "10mg × 10 vials", boxCost: 142 },
  { sku: "TSM5", name: "Tesamorelin", packLabel: "5mg × 10 vials", boxCost: 112 },
  { sku: "TSM10", name: "Tesamorelin", packLabel: "10mg × 10 vials", boxCost: 220 },
  { sku: "TSM20", name: "Tesamorelin", packLabel: "20mg × 10 vials", boxCost: 430 },
  // Combos / IGF
  { sku: "CS10", name: "Cagrilintide + Semaglutide", packLabel: "10mg × 10 vials", boxCost: 167 },
  { sku: "IG001", name: "IGF-1 LR3", packLabel: "10mcg × 10 vials", boxCost: 29 },
  { sku: "IG01", name: "IGF-1 LR3", packLabel: "0.1mg × 10 vials", boxCost: 45 },
  { sku: "IG1", name: "IGF-1 LR3", packLabel: "1mg × 10 vials", boxCost: 220 },
  { sku: "10AM", name: "10-amino-1mq", packLabel: "10mg × 10 vials", boxCost: 158 },
  { sku: "5AM", name: "5-amino-1mq", packLabel: "5mg × 10 vials", boxCost: 110 },
  { sku: "50AM", name: "5-amino-1mq", packLabel: "50mg × 10 vials", boxCost: 230 },
  { sku: "LB", name: "Lemon Bottle", packLabel: "10ml × 10 vials", boxCost: 72 },
  // Epitalon / Mazdutide / etc
  { sku: "ET10", name: "Epitalon", packLabel: "10mg × 10 vials", boxCost: 35, catalogBaseSku: "ET10" },
  { sku: "ET50", name: "Epitalon", packLabel: "50mg × 10 vials", boxCost: 162 },
  { sku: "MDT10", name: "Mazdutide", packLabel: "10mg × 10 vials", boxCost: 195 },
  { sku: "SUR10", name: "Survodutide", packLabel: "10mg × 10 vials", boxCost: 296 },
  { sku: "IP5", name: "Ipamorelin", packLabel: "5mg × 10 vials", boxCost: 38 },
  { sku: "IP10", name: "Ipamorelin", packLabel: "10mg × 10 vials", boxCost: 72 },
  { sku: "DS5", name: "DSIP", packLabel: "5mg × 10 vials", boxCost: 40 },
  { sku: "DS10", name: "DSIP", packLabel: "10mg × 10 vials", boxCost: 82 },
  { sku: "P41", name: "PT-141", packLabel: "10mg × 10 vials", boxCost: 65 },
  // MOTS-c etc
  { sku: "MS10", name: "MOTS-c", packLabel: "10mg × 10 vials", boxCost: 68, catalogBaseSku: "MS10" },
  { sku: "MS20", name: "MOTS-c", packLabel: "20mg × 10 vials", boxCost: 188 },
  { sku: "MS40", name: "MOTS-c", packLabel: "40mg × 10 vials", boxCost: 225 },
  { sku: "AP5", name: "Adipotide", packLabel: "5mg × 10 vials", boxCost: 140 },
  { sku: "XA5", name: "Semax", packLabel: "5mg × 10 vials", boxCost: 44 },
  { sku: "XA10", name: "Semax", packLabel: "10mg × 10 vials", boxCost: 72 },
  { sku: "SK5", name: "Selank", packLabel: "5mg × 10 vials", boxCost: 45 },
  { sku: "SK10", name: "Selank", packLabel: "10mg × 10 vials", boxCost: 72 },
  { sku: "RA10", name: "ARA-290", packLabel: "10mg × 10 vials", boxCost: 72 },
  { sku: "HX5", name: "Hexarelin", packLabel: "5mg × 10 vials", boxCost: 87 },
  { sku: "OT2", name: "Oxytocin", packLabel: "2mg × 10 vials", boxCost: 36 },
  { sku: "OT5", name: "Oxytocin", packLabel: "5mg × 10 vials", boxCost: 62 },
  { sku: "OT10", name: "Oxytocin", packLabel: "10mg × 10 vials", boxCost: 110 },
  { sku: "TA5", name: "Thymosin alpha-1", packLabel: "5mg × 10 vials", boxCost: 100 },
  { sku: "TA10", name: "Thymosin alpha-1", packLabel: "10mg × 10 vials", boxCost: 168 },
  { sku: "TY10", name: "Thymalin", packLabel: "10mg × 10 vials", boxCost: 63 },
  { sku: "AR50", name: "AICAR", packLabel: "50mg × 10 vials", boxCost: 60 },
  { sku: "G25", name: "GHRP-2", packLabel: "5mg × 10 vials", boxCost: 27 },
  { sku: "G210", name: "GHRP-2", packLabel: "10mg × 10 vials", boxCost: 54 },
  { sku: "G65", name: "GHRP-6", packLabel: "5mg × 10 vials", boxCost: 27 },
  { sku: "G610", name: "GHRP-6", packLabel: "10mg × 10 vials", boxCost: 54 },
  // Glutathione / GHK
  { sku: "GTT600", name: "Glutathione", packLabel: "600mg × 10 vials", boxCost: 59, catalogBaseSku: "GTT600" },
  { sku: "GTT1500", name: "Glutathione", packLabel: "1500mg × 10 vials", boxCost: 89 },
  { sku: "NP810", name: "Snap-8", packLabel: "10mg × 10 vials", boxCost: 41 },
  { sku: "VP10", name: "VIP", packLabel: "10mg × 10 vials", boxCost: 178 },
  { sku: "F410", name: "FOXO4", packLabel: "10mg × 10 vials", boxCost: 360 },
  { sku: "FM2", name: "MGF", packLabel: "2mg × 10 vials", boxCost: 62 },
  { sku: "FMP2", name: "PEG-MGF", packLabel: "2mg × 10 vials", boxCost: 90 },
  { sku: "G5K", name: "HCG", packLabel: "5000iu × 10 vials", boxCost: 88 },
  { sku: "G10K", name: "HCG", packLabel: "10000iu × 10 vials", boxCost: 156 },
  { sku: "G75", name: "HMG", packLabel: "75iu × 10 vials", boxCost: 62 },
  { sku: "PIN5", name: "Pinealon", packLabel: "5mg × 10 vials", boxCost: 80 },
  { sku: "PIN10", name: "Pinealon", packLabel: "10mg × 10 vials", boxCost: 150 },
  { sku: "PIN20", name: "Pinealon", packLabel: "20mg × 10 vials", boxCost: 300 },
  { sku: "KS5", name: "Kisspeptin-10", packLabel: "5mg × 10 vials", boxCost: 60 },
  { sku: "KS10", name: "Kisspeptin-10", packLabel: "10mg × 10 vials", boxCost: 117 },
  { sku: "CU50", name: "GHK-Cu", packLabel: "50mg × 10 vials", boxCost: 33, catalogBaseSku: "CU50" },
  { sku: "CU100", name: "GHK-Cu", packLabel: "100mg × 10 vials", boxCost: 59 },
];

export function quoteBySku(sku: string) {
  return SUPPLIER_QUOTE.find((r) => r.sku === sku);
}

export function catalogQuoteRows() {
  return SUPPLIER_QUOTE.filter((r) => r.catalogBaseSku);
}

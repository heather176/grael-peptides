# Grael Peptides

Research peptide storefront — launch pre-sale, Traceabl batch COAs, Stripe checkout.

## Stack
- TanStack Start + React 19 + Vite 8
- Tailwind v4
- Stripe Payment Links
- Deploy target: Vercel (Nitro preset)

## Develop
```bash
npm install
npm run dev    # http://0.0.0.0:8080
npm run typecheck
npm run build
```

## Label production
```bash
node scripts/generate-labels.mjs
# or use /labels in the app — download SVG for print vendor
```

## Product images
Place approved photos in `public/products/vial-*.jpg` matching paths in `src/lib/products.ts`.

## Research use only
Not for human or animal consumption.

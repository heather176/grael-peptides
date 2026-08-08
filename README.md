# Grael Peptides

Research peptide storefront — launch pre-sale, Traceabl batch COAs, Stripe checkout.

**Version:** v1.2.0  
**Primary domain:** [graelpeptides.com](https://graelpeptides.com) (point DNS → Vercel)  
**Live shop (Vercel):** [grael-peptides-traceabl-lab-portal.vercel.app](https://grael-peptides-traceabl-lab-portal.vercel.app)  
**Repo:** [heather176/grael-peptides](https://github.com/heather176/grael-peptides)

## Stack
- TanStack Start + React 19 + Vite 8 (full app in `src/`)
- Tailwind v4, Zustand cart, Stripe Payment Links
- Production interim catalog: `production-site/` (static, deploys reliably on Vercel)
- Deploy target: Vercel (Traceabl team · project `grael-peptides`)

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

## Production (Vercel + custom domain)

### App project
- Team: **Traceabl** (`traceabl-lab-portal`)
- Project: **grael-peptides**
- Git: `heather176/grael-peptides` → `main` (connected)
- No env vars required for the shop (Stripe links are in app)

### Point graelpeptides.com at Vercel
Domain is currently on **Squarespace** (“Coming Soon”). To serve this shop on the custom domain:

1. Vercel → **grael-peptides** → **Settings → Domains** → add:
   - `graelpeptides.com`
   - `www.graelpeptides.com`
2. In **Squarespace DNS** (Domains → DNS settings), set:

| Type | Host | Value |
|------|------|--------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

3. Remove old Squarespace site/A/CNAME records that conflict.
4. Wait for DNS (often minutes; up to 48h). Vercel issues SSL automatically.

Until DNS is updated, the shop is live on the Vercel production URL above.

### Full TanStack app vs production catalog
- **`src/`** — full shop (catalog, cart, Traceabl, labels). Source of truth.
- **`production-site/`** — polished static catalog with all Stripe links; used for production when the full SSR build is blocked or oversized for file deploy.

Optional later: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=https://graelpeptides.com`.

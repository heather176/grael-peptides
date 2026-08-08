# Grael Peptides

Research peptide storefront — launch pre-sale, Traceabl batch COAs, Stripe checkout.

**Version:** v1.1.0  
**Primary domain:** [graelpeptides.com](https://graelpeptides.com) (DNS → Vercel)  
**Vercel project:** [grael-peptides.vercel.app](https://grael-peptides.vercel.app)  
**Repo:** [heather176/grael-peptides](https://github.com/heather176/grael-peptides)

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

## Production (Vercel + custom domain)

### App project
- Team: **Traceabl**
- Project: **grael-peptides**
- Build: `npm run build`
- Install: `npm install`
- No env vars required for shop (Stripe links are in app; PGLite if no `DATABASE_URL`)

### Connect Git
Vercel → Project → Settings → Git → install GitHub app → connect `heather176/grael-peptides` (`main`).

### Point graelpeptides.com at Vercel
Domain is currently on **Squarespace**. To serve this app on the custom domain:

1. Vercel → **grael-peptides** → **Settings → Domains** → add:
   - `graelpeptides.com`
   - `www.graelpeptides.com`
2. In **Squarespace DNS** (or wherever DNS is managed), set:

| Type | Host | Value |
|------|------|--------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

3. Remove old Squarespace site records that conflict.
4. Wait for DNS (often minutes; up to 48h). Vercel will issue SSL automatically.

Optional later: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=https://graelpeptides.com`.

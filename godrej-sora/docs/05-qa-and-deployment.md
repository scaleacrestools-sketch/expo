# Deliverable 7 & 8 — QA report and deployment

## QA performed (21 Oct 2026, production build) — superseded by `08-final-test-results.md` for the final package

| Check | Result |
|---|---|
| `next build` | Passes; home page 62.7 kB route JS, 199 kB first-load JS; static prerender |
| `tsc --noEmit` | Clean |
| `next lint` | No warnings or errors |
| Playwright e2e (`npm run test:e2e`), desktop 1440 + mobile 390 | 8/8 passed: all 19 sections render, RERA + disclosures in footer, drawer validation + submission + Escape, lightbox keyboard nav, configuration tabs |
| Lead API (curl) | 422 with field errors on bad input; 200 + stored on valid; `duplicate: true` on repeat phone+magnet; honeypot accepted silently without storing; 429 after limit |
| Accessibility sanity (scripted) | 0 images without alt, 0 unnamed buttons, exactly one `h1`, logical h1→h2→h3 order, skip link, dialogs with `aria-modal`, tabs with roles, focus rings, reduced-motion respected |
| Responsive | No horizontal overflow at 390 / 768 / 1440; sticky mobile action bar; drawer usable at 390 |
| Console errors | None at any viewport |

Screenshots: `docs/screenshots/` (hero, drawer and full page at 1440, 768 and 390).

Not yet measurable here: Core Web Vitals with real imagery (no assets loaded) and Lighthouse (no Chrome DevTools network in this sandbox). Re-run Lighthouse after assets are in place; images already use `next/image` with AVIF/WebP, `priority` on the hero only, and responsive `sizes`.

## Configuration before go-live

1. Copy `.env.example` → `.env.local`; fill advertiser identity, sales contact, analytics IDs and at least one lead target (`CRM_WEBHOOK_URL`, Supabase, or Resend). Without a target, leads are appended to `.data/leads.ndjson`.
2. Load approved images (see `03-image-usage.md`), then `npm run assets:optimize && npm run assets:check`.
3. Update `content/project.ts`: price, possession, areas, walkthrough id, any brochure corrections.
4. If Supabase is used, create the table:
   ```sql
   create table leads (id uuid primary key, created_at timestamptz, magnet text, source text, name text, phone text, email text,
     configuration text, budget text, timeline text, visit_date date, visit_slot text, message text, attribution jsonb,
     consent jsonb, duplicate_of uuid, ip text, user_agent text);
   ```
5. The in-memory rate limiter and duplicate cache are per-instance; on multi-instance hosting move them to Redis/Upstash (both live in `lib/lead-store.ts`).

## Deploy

```bash
cd godrej-sora
npm ci
npm run build
npm start            # or deploy to Vercel / Netlify (Next.js runtime) / any Node host
```

- Node 20+. The `/api/leads` route needs the Node runtime (file writes, crypto).
- Set `NEXT_PUBLIC_SITE_URL` so canonical, OpenGraph and sitemap resolve.
- Security headers are set in `next.config.ts`; add a CSP once the analytics domains are final.

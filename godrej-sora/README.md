# Godrej Sora — Sector 53, Gurugram · Landing page

Ultra-luxury, single-page marketing site for **Godrej Sora** (Japanese-inspired residences by Godrej Properties), built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, GSAP ScrollTrigger and self-hosted Manrope / Instrument Serif.

```bash
npm install
cp .env.example .env.local   # fill contact, advertiser, analytics, CRM targets
npm run dev                  # http://localhost:3000
npm run build && npm start
npm run test:e2e             # Playwright (expects a server on :3100)
npm run assets:check         # which official images are still missing
```

## Structure

- `content/project.ts` — every project fact with its source and `verified` flag. Edit price, configurations, possession, walkthrough here.
- `content/assets.ts` — image manifest (id, brochure page, kind, approval). `lib/assets.server.ts` resolves ids to files; missing files render a branded placeholder, never a substitute photo.
- `content/leads.ts` — lead magnets, fields and CTA labels. `content/site.ts` — env-driven contact/analytics.
- `components/sections/*` — the 19 sections in page order. `components/forms/*` — drawer + form. `app/api/leads/route.ts` — validation, spam, duplicates, delivery.
- `docs/` — source audit, design system, image usage, unverified list, QA + deployment, screenshots.

## Compliance notes

RERA registration, imagery, pricing and general disclaimers render in the footer and under each relevant section. If this is a channel-partner page, set `NEXT_PUBLIC_ADVERTISER_NAME` and `NEXT_PUBLIC_ADVERTISER_RERA`; the footer then states that it is not Godrej Properties' official site. Use the official logo and renders only with written permission.

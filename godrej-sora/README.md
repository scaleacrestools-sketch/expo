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

## Official imagery

All 39 project images under `public/images/godrej-sora/` were cropped from the official 64-page Godrej Sora brochure supplied by the client, classified per the brochure's own disclosures (artist's impression / stock / AI generated) and optimised to AVIF, WebP and JPG. See `docs/03-image-usage.md`. To re-run: place the brochure at `assets-source/godrej-sora-brochure.pdf`, then `npm run assets:extract && npm run assets:optimize && npm run assets:report`. Still needed from the official website or sales team: master plan, 3 BHK and 4 BHK floor plans, and vector logos (`assets-source/logo/*.svg`).

## Compliance notes

RERA registration, imagery, pricing and general disclaimers render in the footer and under each relevant section. If this is a channel-partner page, set `NEXT_PUBLIC_ADVERTISER_NAME` and `NEXT_PUBLIC_ADVERTISER_RERA`; the footer then states that it is not Godrej Properties' official site. Use the official logo and renders only with written permission.

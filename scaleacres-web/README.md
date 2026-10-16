# ScaleAcres® website (Next.js)

Premium redesign for ScaleAcres, a real estate marketing, creative, digital and technology agency. It is built **SEO-preservation-first**: every existing URL keeps its path, and pages that have not been migrated keep being served unchanged from WordPress.

**Stack:** Next.js App Router · TypeScript · Tailwind CSS v4 (tokens in `app/globals.css`) · Outfit via `next/font` · GSAP + ScrollTrigger (scoped, reduced-motion aware, never required to read content).

## Quick start

```bash
npm install
cp .env.example .env.local      # optional
npm run dev                     # http://localhost:3000
npm run build && npm start      # production build
```

## Documentation

| Doc | What it covers |
|---|---|
| `docs/seo-parity-report.md` | Old vs new SEO parity, homepage before/after comparison, URL-level PASS / REVIEW / FAILED table, audit procedure |
| `docs/launch-readiness.md` | Completed interactions, missing assets, approval checklist, file structure |
| `docs/deployment-netlify.md` | Local preview, Netlify staging, proxy-mode parity run, cut-over and rollback plan |
| `docs/higgsfield-showreel-brief.md` | Shot-by-shot showreel prompts, generated clip IDs, edit, grade, sound and export specs |
| `docs/asset-checklist.md` | Where each real asset goes and where it was found |
| `docs/brand-tokens.md` | Official black/blue palette and usage |

## SEO tooling

```bash
npm run seo:baseline                                     # crawl live scaleacres.com
CANDIDATE_URL=https://<staging> npm run seo:candidate    # crawl staging for the same URLs
npm run seo:compare                                      # seo/parity-report.md + .csv
```

## Key environment variables

| Variable | Purpose |
|---|---|
| `PRODUCTION_HOSTS` | Hosts allowed to be indexed (default `scaleacres.com,www.scaleacres.com`). Every other host is noindex. |
| `WORDPRESS_ORIGIN` | **Build-time.** Origin that keeps serving WordPress. Protected pages marked `wordpress` and all unknown paths are proxied to it. Leave it unset on design-review staging. |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` / `CONTACT_WEBHOOK_URL` | Contact form delivery. With none set, the form reports that it isn't connected and never shows a fake success. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 (optional). |

The live site must not be changed without explicit approval. No guarantee of unchanged rankings is implied; the migration is designed to minimise risk and must be monitored after launch.

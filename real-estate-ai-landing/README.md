# [Product Name] — AI Real Estate Sales Landing Page

A static, Netlify-ready marketing site for an AI-powered real estate sales operating system: AI voice agents, lead qualification, site visit booking, database reactivation, omnichannel follow-up and CRM sync.

Built with React 18, TypeScript, Vite 6, Tailwind CSS 3, Motion for React, Lucide icons and hand-built SVG charts. No database, paid API, auth or telephony is required. All product data on the page is demonstration data and is labelled as such.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ on http://localhost:4173
npm test           # Playwright functional + responsive tests (uses the preview server)
```

Node 22 is recommended (Netlify is pinned to 22 in `netlify.toml`).

## Deploying to Netlify

**Git deploy:** connect the repo, set the base directory to `real-estate-ai-landing`. Build command and publish directory come from `netlify.toml` (`npm run build` → `dist`).

**Drag and drop:** unzip `netlify-preview.zip` and drop the folder on https://app.netlify.com/drop. No build is needed.

After the first deploy, open *Site configuration → Forms* in Netlify and confirm the `demo-request` form was detected. Add an email notification there to receive enquiries.

## Changing the brand

Everything brand-related lives in `src/config/brand.ts`:

| Field | Effect |
|---|---|
| `productName`, `companyName`, `tagline` | Used across the site, `<title>`, Open Graph tags, JSON-LD and footer |
| `siteUrl` | Canonical URL, OG URLs, generated `robots.txt` and `sitemap.xml` |
| `contactEmail`, `contactPhone`, `social.*` | Shown in the footer only when filled in |
| `loginUrl` | Target of **Sign In**. Empty = opens the demo form |
| `demoBookingUrl` | If set, every **Book a Demo** button opens this URL instead of the built-in form |

Then rebuild. The HTML head is rendered from the same config by a small Vite plugin in `vite.config.ts`.

### Logo and favicon
- Header/footer logo mark: `src/components/ui/Logo.tsx` (inline SVG, so it inherits the theme). Replace `LogoMark`'s SVG or render an `<img src="/assets/svg/logo.svg">`.
- Static files: `public/favicon.svg`, `public/assets/svg/logo.svg`, `public/assets/svg/logo-mark.svg`.
- Social preview image: `public/assets/images/og-image.png` (1200 × 630).

### Colours
Design tokens are CSS variables at the top of `src/styles/globals.css` (`--brand-primary`, `--dark-*`, `--light-*` …). If you change `--brand-primary`/`--brand-secondary`, also update the matching `--brand-primary-rgb` / `--brand-secondary-rgb` channel values (used for translucent tints) and `brand.colors` in `brand.ts`.

## Editing content
- Copy for every section: `src/data/content.ts`
- Voice call scripts (English + Hinglish + TTS text): `src/data/voice-conversations.json`
- Demo numbers, tables and charts: `src/data/demo-data.ts`
- Integrations and their status (`Planned` / `Available`): `src/data/integrations.ts`
- Client logos for the Trusted By marquee: add `logo: '/assets/images/clients/name.svg'` to items in `trusted.items` once you have written permission.

Sections live in `src/sections/` (one file per section, in page order in `src/App.tsx`).

## Media

| Asset | Location | Regenerate |
|---|---|---|
| Sample call audio (8 files, EN + Hinglish) | `public/assets/audio/` | `npm run media:audio` (needs `ffmpeg` with libflite and `espeak-ng`) |
| Walkthrough video (30 s, 1080p, MP4 + WebM, captions VTT, poster) | `public/assets/videos/` | `npm run build && npm run preview`, then `npm run media:video` |
| Hero animation (14 s, MP4 + WebM) | `public/assets/videos/` | same as above |
| GIF demos | `public/assets/gifs/` | after `media:video`, run `npm run media:gifs` |
| Section screenshots | `preview/screenshots/` | `npm run media:screenshots` |

The video is rendered deterministically: `/?render=walkthrough` and `/?render=hero` show a time-driven composition built from the real product components, and the script sets the time for each frame before capturing it. To replace with a professionally produced video, overwrite the files with the same names.

**Better voices:** the bundled audio uses open-source TTS (Flite for English, eSpeak NG for Hindi) and sounds synthetic. For production, regenerate the eight clips with a licensed neural TTS voice and keep the file names; then update the timings in `src/data/audio-timings.json` (start/end of each line in seconds).

## Forms
The demo form posts to Netlify Forms (`demo-request`). A hidden static copy of the form in `index.html` lets Netlify detect it at deploy time. Spam protection: Netlify honeypot field plus a minimum fill-time check.

When the site runs on `localhost`, submissions are **not** sent and the form says so ("Local preview: enquiry not sent"). On a deployed site, success is shown only after Netlify answers with HTTP 2xx; otherwise an error is shown.

## Adding real integrations later
1. Flip the item's `status` to `Available` in `src/data/integrations.ts`.
2. Replace the monogram tile with the partner's official logo **only** if their brand guidelines allow it.
3. Update FAQ and comparison wording in `content.ts` from "planned" to the real state.

## Project structure

```
public/            static assets (svg, audio, video, gifs, images), favicon, _redirects
src/config/        brand.ts
src/data/          content, demo data, integrations, voice scripts, audio timings
src/components/    ui, dashboards, charts, illustrations, animations, forms
src/sections/      the 18 page sections
src/render/        video render surface (code-split, only loaded with ?render=)
scripts/           render-video, generate-gifs, generate-audio, capture-screenshots
tests/             Playwright specs
```

# STFE 2027 — Smart Trade Fair & Expo website

Exhibitor-first website for **STFE 2027**, 15–17 January 2027, Soor Sadan Auditorium, Agra.
Organised by **Smart Vision Event & Promotions**.
It is a static site built with Vite 6, using plain HTML, CSS and one ES module. Forms use Netlify Forms.

## Source assets

The organiser's bundle is in `source-assets/`. It contains the approved logo, the original brochure and the previous walkthrough.
`npm run ingest`, which runs `scripts/ingest_assets.py`, turns it into web assets. It only extracts, trims and resizes. Artwork is never redrawn or recoloured.

| Output | From |
|---|---|
| `public/assets/brand/stfe-2027-logo*.png/.webp` | Approved logo, with white margins trimmed only |
| `src/brand-tokens.css` | Colours sampled from the logo: navy `#1b2656`, orange `#ec5d24`, teal `#27bdc5`, blue `#1262ae`, crimson `#c81f3f` and yellow `#fdce18` |
| `public/assets/brand/stfe-globe.png`, favicons | STFE globe image layer, brochure page 1 |
| `public/assets/institutional/*.png` | MSME, Make in India and Digital India image layers, brochure page 1 |
| `public/assets/venue/soor-sadan-auditorium-cutout.webp` | Venue photograph layer, brochure page 1 |
| `public/assets/floor-plans/ground-floor.png`, `first-floor.png` | Vector plans from brochure page 3, background art removed, rendered at 400 dpi |
| `public/assets/brochure/brochure-page-*.webp` | Page previews |
| `public/downloads/STFE-2027-Brochure.pdf` | The original PDF, byte-identical |

## Commands

```bash
npm install
npm run dev            # dev server (shows institutional strip, as a preview)
npm run build          # PRODUCTION build → dist/  (institutional marks withheld until authorised)
npm run build:preview  # REVIEW build → dist-preview/ (marks shown with "pending authorisation" badge)
npm run ingest         # re-extract assets from source-assets/ (needs Python 3 + PyMuPDF + Pillow + numpy)
```

`npm run build` regenerates the pricing-guide PDF. It then verifies that every local file the page references exists, that all three forms are present and that no prohibited wording appears. It also checks that the marks are absent from production.

### Local QA

```bash
QA_DIST=dist-preview node scripts/qa-server.mjs &               # serves the build, saves form POSTs to qa-output/leads.jsonl
QA_DIST=dist-preview QA_FAIL=1 PORT=4322 node scripts/qa-server.mjs &   # simulated backend outage
npm run qa                                                      # automated checks
bash scripts/finalize.sh ../STFE-2027-DELIVERY/redesign          # build, QA, screenshots, videos, contact sheet, comparison, ZIP
node scripts/record-walkthroughs.cjs                            # desktop + mobile recordings
```

## Government / institutional marks — action required before going live

The MSME / Government of India, Make in India and Digital India marks appear on page 1 of the brochure.
Their presence there does not establish sponsorship or endorsement.
The marks are therefore shown only in the preview build, labelled "Preview · marks pending authorisation".
The production `dist/` build leaves them out.

To publish them, first obtain written confirmation of authorised use and the exact relationship wording. Then:
1. Set `institutionalMarksApproved: true` in `site.config.js`.
2. If the authority approved a relationship line, add it to the strip in `index.html`. Never write "Government Approved", "Official Sponsor" or similar unless that is the approved wording.
3. Run `npm run build` and redeploy.

## Photography

- `public/assets/photos/u-*.webp` are the eight images the organiser asked to be taken from their earlier STFE page (gleeful-caramel-7c566c.netlify.app). Originals are in `source-assets/user-site/originals/`. They carry no credit or metadata, so their usage rights must be confirmed by the organiser. They are labelled "Illustrative image" on the site and are never described as photographs of a previous STFE edition. Most are about 1,000 px wide, so the hero is soft on large screens; supply higher-resolution originals if available.
- `public/assets/photos/credits-user.json` (and `credits.json` for any Wikimedia Commons photos) drive the footer credit list and the contact sheet.
- Photo slots are written as `<!--PHOTO:slug-->…<!--/PHOTO-->`. The build keeps a slot only if `slug.webp` and `slug-1200.webp` exist, so a missing photo never leaves an empty frame. The Gallery section and its menu link appear only when `gallery-1…6` photos exist.
- The venue photograph and floor plans come from the official brochure.

## Deploying to Netlify (not deployed — requires your approval)

1. Import the repository in Netlify. Set **Base directory** to `stfe-2027`. The build settings come from `netlify.toml`.
2. After the first deploy, open **Forms**. Confirm that `exhibitor-enquiry`, `callback-request` and `visitor-registration` were detected, enabling form detection if prompted.
3. Add form notifications to the organiser's inbox, and optionally a webhook to a CRM.
4. Submit one test enquiry on the live URL and confirm it appears under **Forms**.
5. Update `<link rel="canonical">` to the final domain.

Each submission carries the form fields, `consent`, `enquiry_type`, UTM source, medium, campaign, content and term, `landing_page`, `page_url`, `referrer` and `submitted_at`.
A `lead_submitted` dataLayer event fires only after the backend confirms the save.

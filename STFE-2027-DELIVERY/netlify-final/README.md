# STFE 2027 — Smart Trade Fair & Expo website

**Single-page exhibitor lead-generation landing page.** The visual system follows the UP International Trade Show reference, with colours sampled from its live computed styles: a plum `#8f1d6d` → indigo `#36315f` gradient top bar and navigation, orange `#f07a3f` → lilac `#9c6bb3` CTAs, two-tone uppercase headings, and white / pale-plum `#f6edf3` section rhythm. Fonts are Outfit for headings and Manrope for body text. No UPITS images, logos or code are used.

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
npm run qa                                                      # 67 automated checks
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

The site uses 12 photographs: 8 licensed real photos from Wikimedia Commons and 4 images from the organiser's earlier STFE page. Every one is listed, with source and licence, in `public/assets/photos/credits.json` (Commons) and `credits-user.json` (organiser page). Both lists are rendered automatically on `/credits.html`, which is linked from the footer and the photo captions. `IMAGE-CREDITS.md` gives the same list in Markdown.

- **Wikimedia Commons (8).** CC BY 3.0, CC BY 4.0, CC BY-SA 3.0/4.0 or public domain. Attribution is required for every CC file and is printed in the footer. They are representative trade-fair photographs, not past STFE events. The site labels them that way.
- **Organiser's earlier page (4: B2B, workshop, awards, hall).** These came from gleeful-caramel-7c566c.netlify.app. They carry no credit or metadata, so their **usage rights are unconfirmed**. Confirm them before going live, or replace them.
- **Rejected organiser images (4: hero, networking, aisle, experts).** Three look AI-generated, and the fourth (experts) is too weak a subject. The audit notes are in `credits-user.json`. Their originals remain in `source-assets/user-site/originals/` but are not deployed.
- **Venue.** Only the Soor Sadan photograph from the official brochure is used.
- **AI-generated images: none.** Generation was attempted via the connected Higgsfield image tool. The account has 0.51 credits on the free plan, and the cheapest image costs 0.75, so nothing was generated. No awards-ceremony photo was found on Wikimedia Commons either, so the awards card uses the organiser-supplied image.

To add or replace a photo: put a `<slug>.webp` (≤2400 px) and a `<slug>-1200.webp` in `public/assets/photos/`, reference it inside `<!--PHOTO:slug-->…<!--/PHOTO-->`, and add a credits entry.

## Deploying to Netlify (not deployed — requires your approval)

1. Import the repository in Netlify. Set **Base directory** to `stfe-2027`. The build settings come from `netlify.toml`.
2. After the first deploy, open **Forms**. Confirm that `exhibitor-enquiry`, `callback-request` and `visitor-registration` were detected, enabling form detection if prompted.
3. Add form notifications to the organiser's inbox, and optionally a webhook to a CRM.
4. Submit one test enquiry on the live URL and confirm it appears under **Forms**.
5. Update `<link rel="canonical">` to the final domain.

Each submission carries the form fields, `consent`, `enquiry_type`, UTM source, medium, campaign, content and term, `landing_page`, `page_url`, `referrer` and `submitted_at`.
A `lead_submitted` dataLayer event fires only after the backend confirms the save.

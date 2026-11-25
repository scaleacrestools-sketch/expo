# STFE 2027 — Smart Trade Fair & Expo website

Exhibitor-first landing page for **STFE 2027**, 15–17 January 2027, Soor Sadan Auditorium, Agra.
Organised by **Smart Vision Event & Promotions**.

- Static site built with **Vite 6** (plain HTML, CSS and one ES module, no framework).
- Forms use **Netlify Forms** (exhibitor enquiry, callback request, visitor registration).
- Fonts are self-hosted: IBM Plex Sans and IBM Plex Sans Devanagari (SIL Open Font License).

## Commands

```bash
npm install
npm run dev        # local development server
npm run build      # pricing-guide PDF → Vite build → postbuild checks
npm run preview    # serve dist/ (note: Netlify Forms only work on Netlify)
```

`npm run build` fails if a promised file is missing, if a feature flag is on without its asset,
if any Netlify form is absent from the built HTML, or if wording implies GST is added on top.

### Local functional QA

```bash
node scripts/qa-server.mjs &                    # serves dist/, saves form POSTs to qa-output/leads.jsonl
QA_FAIL=1 PORT=4322 node scripts/qa-server.mjs & # simulated backend outage
npm run qa                                      # 56 automated checks
node scripts/record-walkthroughs.cjs            # desktop + mobile walkthrough recordings (WebM)
```

## Assets the organiser must supply (and how to switch them on)

All gated in `site.config.js`. Nothing below is faked while it is missing.

| Asset | Put it at | Then set |
|---|---|---|
| Approved STFE 2027 logo (original file, unmodified) | `public/assets/brand/stfe-2027-logo.png` | nothing; it is used automatically. A plain text name shows until then. |
| Original 3-page brochure PDF | `public/downloads/STFE-2027-Brochure.pdf` | `brochureAvailable: true` |
| Original ground and first floor schematics | `public/assets/floor-plans/ground-floor.png`, `first-floor.png` | `floorPlansAvailable: true` |
| Approved partner logos | `public/assets/partners/<slug>.png` (slugs listed in `index.html`) | `partnerLogosAvailable: true` |
| Licensed or organiser-owned photography | `public/assets/photos/attraction-b2b.jpg`, `attraction-workshops.jpg`, `attraction-experts.jpg`, `attraction-awards.jpg` (1600×1200) | `photographyAvailable: true`, and record the licence in `ASSET-LICENCES.md` |
| Government identity marks (MSME, Make in India, Digital India) | `public/assets/institutional/` | see below |

Until the brochure is supplied, every "Download Exhibitor Brochure" button becomes **"Request Exhibitor Brochure"**.
That button opens WhatsApp to the organiser. It is never a broken link.
The pricing guide is regenerated on each build, and uses the logo automatically once it is present.

### Government / institutional marks — authorisation required

The brochure shows MSME / Government of India, Make in India and Digital India marks. Their presence
does not prove an authorised relationship, so **they are not published**. The header already contains the
institutional strip (Level 1). To enable it, only after written confirmation of the relationship and
permission to use the marks, add to `site.config.js`:

```js
institutionalMarksApproved: true,
institutionalMarks: [
  { src: '/assets/institutional/msme.png', alt: 'Ministry of Micro, Small & Medium Enterprises, Government of India' },
  { src: '/assets/institutional/make-in-india.png', alt: 'Make in India' },
  { src: '/assets/institutional/digital-india.png', alt: 'Digital India' },
],
institutionalLabel: '', // use only the exact relationship wording the authority has approved
```

## Deploying to Netlify (not deployed — requires your approval)

1. Push this folder to a Git repository, or use the ZIP contents.
2. In Netlify, choose **Add new site → Import an existing project**, and select the repo.
   If the site lives in a sub-folder, set **Base directory** to `stfe-2027`.
3. The build settings come from `netlify.toml` (`npm run build`, publish `dist`, Node 22).
4. Deploy, then open **Site configuration → Forms** and confirm three forms were detected:
   `exhibitor-enquiry`, `callback-request` and `visitor-registration`.
   Enable form detection if prompted, then redeploy.
5. Under **Forms → Form notifications**, add email notifications to the organiser's inbox.
   Optionally add an outgoing webhook to a CRM such as TeleCRM, Pabbly or Zapier.
6. Submit one test enquiry on the live URL and confirm it appears under **Forms**.
7. Update `<link rel="canonical">` in `index.html` to the final domain.

### Lead data captured with every submission

`form-name`, `enquiry_type`, the form fields, `consent`, `utm_source`, `utm_medium`, `utm_campaign`,
`utm_content`, `utm_term`, `landing_page`, `page_url`, `referrer` and `submitted_at` (ISO time).
UTMs persist for the browsing session. Mobile numbers are normalised, for example `+919876543210`.
A `dataLayer` event `lead_submitted` fires only after a successful save. It is ready for GTM, Meta Pixel or a CAPI bridge.
No credentials are in the frontend.

## Structure

```
index.html            landing page (all sections)
privacy.html          privacy notice linked from every form
site.config.js        organiser details + asset/authorisation flags
src/styles.css        design system
src/main.js           behaviour: gating, nav, floor-plan viewer, forms, attribution
public/               static assets copied as-is (downloads, brand, plans, og-image)
scripts/              PDF guide, build checks, QA server, QA suite, recordings, OG image
```

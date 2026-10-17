# ScaleAcres premium homepage: delivery report

**Staging only.** Nothing has been deployed, and production, WordPress and DNS were not touched. Staging sends `noindex` on every non-production host.

## 1. What changed

| # | Section | Notes |
|---|---|---|
| — | Brand system | Official Brand Guidelines v1.0 tokens: Royal `#1D4ED8`, Royal Deep `#142E8C`, Sky `#38BDF8`, Brand Black `#0B0D0D`, Royal Navy, Graphite, Steel, Line, Mist. The signature gradient appears only on the logo, short rules, the rising bars and the primary CTA accents. All experimental themes (red, midnight, olive) and the theme lab were removed. Accent text on dark backgrounds automatically uses Sky (9.1:1), per the guidelines. |
| — | Logo | Official kit SVGs. The header uses the reversed no-strapline version, because the full lockup needs at least 240 px. The footer uses the full reversed lockup. Favicon and Apple icon come from the kit. The Organization schema logo now points to `/brand/scaleacres-logo-primary.png`. |
| 01 | Hero | Unchanged structure: video playlist, timed statements, protected H1, 11 s vertical ticker. Colours updated: Royal CTA, Sky accents. The header is near-opaque Brand Black once scrolled. |
| 02 | Editorial intro | Regular-weight Outfit paragraph. Words turn from pale grey to Brand Black as you scroll, and key phrases resolve to Royal. Plain server HTML: without JS or with reduced motion the text shows fully revealed. |
| 03 | Eight services | 4 × 2 editorial grid with dividers. Selecting a service shows its four offerings, the CTA and its studio film in one panel; on mobile the details open in place. Only the selected service's video is mounted and loaded. |
| 04 | Our work | Filters: All Work, Websites, Branding, Social Media, Campaigns, Videos, Real Estate. Full-width features plus a two-column grid with rounded images, title left and category right. Leads to "Explore all our work". |
| 05 | How we work | Black section. The headline, progress rule and a step-matched studio film stay pinned while five steps scroll past, with numbers outlined until active. Mobile uses a stacked timeline. |
| 06 | Clients | "Brands we've built with." Logo wall in the official white style (see missing assets). |
| 07 | The thinking behind the work | Asymmetric bento: principle (black, with rising bars), capabilities (links to all eight services), brief-to-delivery workflow (labelled **Illustrative**) and real impact (published case-study wording only, no figures). |
| 08 | Real estate | Royal Navy editorial split with the architecture film as the hero image. Protected SEO copy and the five legacy service links are kept verbatim. |
| 09 | FAQs | Eight numbered, keyboard-accessible accordion rows. Answers use only approved information. FAQPage JSON-LD is generated from the same visible text; rich results are not promised. |
| 10 | Closing CTA + footer | Brand Black, "Let's build something that matters." with supporting line and a Royal "Let's Talk ↗". Full reversed logo, positioning, verified contacts, services, explore links, socials, privacy policy and copyright. The giant cropped wordmark is gone. |

The homepage no longer carries the Creative Studio tabs, the case-study list, the Insights teaser or the inline contact form. Their pages are unchanged and still linked from the menu and footer: `/creative-studio/`, `/case-studies/`, `/insights/`, `/contact-us/`. The contact form, with honest delivery status, is on `/contact-us/`.

## 2. Responsive and functional testing

Automated with Playwright at 1440 × 900 (desktop) and 390 × 844 (mobile) on the production build: **50 checks pass, 0 fail.**

- **Hero:** video plays and the H1 is visible.
- **Menu:** opens, has seven links and all eight services, and closes with Escape. The mobile services list expands.
- **Services:** 8 services. Selecting one opens its panel with the correct four offerings, and only one service video loads. On mobile, details open in place.
- **Intro:** words reveal on scroll.
- **How we work:** five steps.
- **FAQ:** opens and closes, including by keyboard. Structured data matches the eight visible questions.
- **Work filters:** filters with no projects are disabled; Real Estate shows 5 projects.
- **Section order:** all nine sections in the briefed order.
- **Pages:** 13 key inner pages return 200, and the homepage has no dead internal links.
- **Contact page:** the form shows field errors, and a submission without delivery configured is reported honestly instead of faking success.
- **Layout:** no horizontal overflow on mobile, and no page errors.

**Lighthouse** (production build, no CDN video in the sandbox):

| | Performance | Accessibility | Best practices | LCP | CLS | TBT |
|---|---|---|---|---|---|---|
| Mobile | 91–94 | 96 | 96 | 2.7–3.0 s | 0 | 120–270 ms |
| Desktop | 100 | 96 | 96 | 0.7 s | 0.001 | 0 ms |

- **Accessibility flag:** the only one is the intentionally pale "not yet revealed" words in the intro. Visitors who prefer reduced motion get full contrast.
- **SEO 69:** reflects the deliberate staging `noindex`.

## 3. Missing assets (please supply)

| Needed for | Exact files | Where they go |
|---|---|---|
| **Client logo wall** | SVG, or transparent PNG ≥ 400 px: `yugen-infra.svg`, `one-goa.svg`, `prominent-realty.svg`, `hometrust-realty.svg`. Then set `logoReady: true` in `content/clients.ts` | `public/brand/clients/` |
| Client logos found in your Google Drive, **not shown until you confirm permission** | DTC Capital City Crest (`DTC Capital City Crest Logo - PNG.png`), Rajyog Projects (`Rajyog_Projects logo.jpg`), BBD (`BBD Logo.jpg`), ELIVAAS (`ELIVAAS Updt Logo-White.svg` / `-Black.png`), TRG The Mall (`trg-the-mall-logo (1).png`), Alaya Stays (`Alaya Stays-Current Black LOGO.jpeg`) | Tell me which are approved clients |
| **Portfolio images** for each published project | Hero image 2400 × 1500, 2–3 campaign creatives, and a website screenshot for `yugen-goa`, `one-goa`, `prominent-realty`, `hometrust-realty` | `public/images/projects/<slug>/` |
| **Websites / Branding / Social Media / Campaigns filters** (currently "soon") | Screenshots of delivered websites, brand identity boards, approved social creatives and ad creatives, each with client approval | as above |
| **Social and ad videos** | Approved reels in your Drive (Auriga 9, DTC Stillwaters, DTC Crest Club Atlas, La Wisteria, Codename Flow KIADB, BPTP), exported to MP4 at ≤ 8 MB, once each client clears them | `public/videos/studio/` |
| **Self-hosted showreel + posters** | The six Higgsfield clips downloaded. Then `npm run showreel -- ./clips` writes the web MP4/WebM files and posters; set `postersReady = true` | `public/videos`, `public/images/posters` |
| Brief-to-delivery card (optional) | Real team or process photography | `public/images/about/` |
| SEO parity (launch blocker) | Live crawl export: meta description and schema of the current homepage | `seo/baseline.json` via `npm run seo:baseline` |
| Large-format print (optional) | Original vector logo master (AI or EPS) | — |

Projects without approved visuals show a clearly labelled "Project visuals pending" cover. No stock, mock-up or borrowed imagery is used anywhere.

## 4. SEO parity report

`scripts/seo-check-known.mjs` result: **PASS 46 · UNVERIFIED 5 · MISSING 2 · FAIL 0**. This is identical to the result before this redesign.

| Item | Status |
|---|---|
| Homepage URL `/`, canonical | Unchanged |
| Title tag | Unchanged (protected value) |
| Meta description | Uses existing homepage body copy. **The live value has not been captured yet (MISSING).** |
| H1 | Unchanged, visible in the hero |
| Protected copy (positioning, intro, boilerplate) | Unchanged, visible as server HTML in the real-estate section |
| Legacy service headings + 5 internal links | Unchanged, same URLs, in the real-estate section |
| Service, location and blog URLs, redirects, sitemap, robots | Unchanged |
| Organization schema | Kept. Logo URL changed to the new official PNG. |
| New indexable content | Editorial intro, eight-service descriptions, How we work, bento copy, 8 FAQs and FAQPage schema |
| New H2s | Who we are (label), What we do / What we deliver, Our work / Our signature, From the first idea to measurable growth, Brands we've built with, The thinking behind the work, Real estate marketing / Reimagined, Good questions / Clear answers |
| Removed from the homepage (pages unchanged) | Creative Studio tabs, case-study list, Insights article teasers, inline contact form. Internal links to these pages remain in the menu and footer. **Review:** if the live homepage links to specific blog posts, consider keeping a compact Insights row. |
| Staging indexing | `noindex` on all non-production hosts |

The comparison against the live site is not complete. scaleacres.com cannot be reached from this environment, so the live meta description, schema and on-page links could not be diffed. **No claim of zero SEO risk is made.** Run `npm run seo:baseline` and `npm run seo:compare` against the live site before any launch.

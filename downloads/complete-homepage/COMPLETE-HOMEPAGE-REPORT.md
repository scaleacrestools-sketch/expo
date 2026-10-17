# ScaleAcres complete homepage: preview report (staging only)

Nothing was deployed. scaleacres.com, WordPress, hosting and DNS were only **read** (a fetch of public pages). Staging stays `noindex`.

**Netlify Drop:** unzip `scaleacres-complete-homepage-static.zip` and drag the folder **`scaleacres-complete-homepage`** onto app.netlify.com/drop.

## Section order (as approved)
1 Hero · 2 Who we are · 3 Eight services · 4 Creative showcase (sections 1–4 unchanged since Milestone A)
5 How we work · 6 Client logo wall · 7 Client video testimonials · 8 FAQs · 9 Image-led contact CTA · 10 Black footer

## Assets used
| Section | Asset | Source | Hosting |
|---|---|---|---|
| 5 How we work | 5 stage images (Discover, Strategize, Create, Launch, Optimize & Scale) | **AI concept visuals** (Higgsfield), labelled "Concept visual" on the page | self-hosted `/images/process/` |
| 6 Clients | 20 logos: Adani Realty, Tata Realty, M3M, Signature Global, Elan, ATS, Bhutani Infra, Smartworld, Birla Navya, Hero Realty, Trehan Luxury Floors, The Islands by Gaurs, Yugen Infra, Hometrust, RPS Rudrom, SeaBreeze Villas, Bric-X Infra, Raksha Towers, SHF Square, Mi Casa | the "Loved and Trusted by" strip on live scaleacres.com, recoloured to one ink tone | self-hosted sprite `/brand/clients/clients-sprite.webp` |
| 7 Testimonials | 4 client videos: Sunita Bishnoi / Let's Movin, NRG India, IPD (International Property Deal), TimesPro | the Wistia videos on live scaleacres.com | posters self-hosted; **MP4s streamed from the Higgsfield CDN (temporary)** |
| 9 Contact CTA | Blue-hour towers banner + mobile crop | **AI concept visual**, labelled | self-hosted `/images/contact/` |
| 1, 3, 4 | Showreel films (unchanged) | Higgsfield studio films | Higgsfield CDN (as before) |

The only names shown are those the clients say on screen (Sunita Bishnoi). The other three show the company only. No quotes or statistics were written for the page.

## Still pending
| Item | Status | Where it goes |
|---|---|---|
| 4 testimonial MP4s, self-hosted | Play from the CDN today; posters are local. To do after approval. | `public/videos/testimonials/` (720×720 H.264, 1.5–2.5 MB each) |
| 6 showreel films + posters | Still on the Higgsfield CDN | `public/videos`, `public/images/posters` |
| Colour (original) client logo files | Only white/mono versions exist on the live site, so hover goes steel → black instead of to colour | SVG or PNG ≥ 400 px each, `public/brand/clients/` |
| Client permission for the logo wall | Logos are as already published on scaleacres.com; please confirm they are still approved | — |
| Names/roles for NRG India, IPD and TimesPro speakers | Not shown, because they are not verified | Supply the exact name and title to add them |
| Real process / team photography (optional) | Concept visuals used for now | `public/images/process/` |
| Portfolio images for case studies | Unchanged from the Milestone A list | `public/images/projects/<slug>/` |

## Functional tests (extracted static ZIP, Chromium, 1440×900 and 390×844): 46 pass, 0 fail
- **Order and layout:** sections 2–9 in the exact order with the footer last. 5 stages render. The STRATEGY outline word sits inside the viewport. No horizontal overflow, no page errors, no broken local files.
- **Client wall:** 20 logos and the sprite load. Yugen and Hometrust link to their case studies.
- **Testimonials:** next/previous and thumbnails work. No video element exists until Play is pressed. Play opens a modal with one video. Escape closes it and removes the video.
- **FAQ:** 8 new questions. Rows open and close. Answers are in the server HTML. FAQPage JSON-LD matches the 8 visible questions; rich results are not promised.
- **Footer:** 4 columns, 3 social icons, contact CTA, copyright strip.

## SEO preservation
`seo-check-known`: **PASS 48 · UNVERIFIED 4 · MISSING 1 · FAIL 0** (was 46 · 5 · 2 · 0).
- **Meta description:** now captured from the live homepage and used verbatim. Previously MISSING, now PASS.
- **Title:** identical to live. Re-verified 17 Oct 2026.
- **Protected copy:** the intro now sits in section 5. The boilerplate is the answer to FAQ 2. "India's Real Estate Marketing Specialist" is the section 6 eyebrow. "Real Estate Lead Generation & Branding Services" and the 5 legacy service links are at the end of section 5. All are server HTML.
- **H1 (open item):** the live H1 is "India's Real Estate Marketing Specialist". The staging hero H1 is "We Don't Create Brands. We Create Market Leaders.", which is an H2 on the live site. This needs your decision before launch. The hero was not changed.
- **Not yet compared:** the full-site live crawl vs. staging. **No claim of SEO safety is made yet.**
- Removed from the homepage (files kept, nothing deleted): AdvantageBento and RealEstateDNA. Secondary pages and routes are unchanged.

## Performance notes
- Section 5/7/9 images are WebP (23–140 KB), lazy-loaded, with fixed dimensions (no layout shift).
- The 20 logos are one 117 KB sprite instead of 20 requests.
- Testimonial videos load only when Play is pressed.
- Lighthouse was not re-run for this delivery.

## Known cosmetic item (not changed, per your instruction)
The footer SCALEACRES outline shows the font's internal letter-overlap strokes. A filled low-opacity version would be cleaner. This waits for your approval.

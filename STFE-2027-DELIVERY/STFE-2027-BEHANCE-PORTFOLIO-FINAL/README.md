# STFE 2027 — Behance Portfolio (Final)

STFE 2027 · Smart Trade Fair & Expo · 15–17 January 2027 · Soor Sadan Auditorium, Agra
Organised by Smart Vision Event & Promotions.

This is a long-form Behance case study covering the brand identity, the exhibition applications, the campaign, the complete desktop landing page and the mobile experience. It is a separate document from the brand guidelines (`06-BRAND-GUIDELINES/`).

## Folders
| Folder | Contents |
|---|---|
| `01-COVER/` | Behance cover in three forms: an editable SVG, a PNG and a JPG at 1616 × 1264, plus a larger PNG at 2020 × 1580. |
| `02-CONTINUOUS-BEHANCE-PRESENTATION/` | 27 numbered JPGs, each 2000 px wide (1600 px artwork at 1.25×). They join edge to edge with no gaps between panels. Also includes `STFE-2027-BEHANCE-COMPLETE-SCROLL.png` (1200 × 38,117), a 1600 px JPG version of the full scroll, and the contact sheet. |
| `03-EDITABLE-SVG/` | One SVG per composition (27 panels plus the 1616 × 1264 cover). `graphic-assets/` holds the vector elements (ornament, cube texture, skyline, momentum bands, Portal motif) and the final logo as raster files. |
| `04-WEBSITE-SHOWCASE/` | `desktop-1440/`: the full-page desktop capture, the first viewport and 14 section captures. `mobile-390/`: the full-page mobile capture, 4 screen captures with the sticky bar, and 13 section captures. `presentation-compositions/`: panels 14–25. |
| `05-BRAND-APPLICATIONS/` | Panels 10–13 (entrance, floor and signage, badges and print, campaign). `individual-creatives/` holds 9 social posts, a story, a 970 × 250 banner, a lead ad, badges, the brochure cover and the stall sheet, each as an SVG and a PNG. |
| `06-BRAND-GUIDELINES/` | `STFE-2027-BRAND-GUIDELINES.pdf` (26 pages) plus an SVG and a PNG for each page. Covers logo usage, clear space, colours, fonts, graphic elements, photography, layout and applications. |
| `07-PDF/` | `STFE-2027-BEHANCE-CASE-STUDY.pdf`: the 27 panels in order as 27 pages, with selectable text. |
| `08-PREVIEW/` | Portfolio contact sheet, cover preview, a 404 × 316 thumbnail check and a website-section overview. |

## Behance upload order
Set the Behance project width to full width with no spacing between modules. Upload the files from `02-CONTINUOUS-BEHANCE-PRESENTATION/` in this order. The panels' top and bottom edge colours match, so they read as one continuous scroll.

1. `01-BEHANCE-COVER.jpg`
2. `02-BRAND-INTRO.jpg`
3. `03-BRAND-VISION.jpg`
4. `04-FINAL-LOGO.jpg`
5. `05-LOGO-SYSTEM.jpg`
6. `06-COLOUR-SYSTEM.jpg`
7. `07-TYPOGRAPHY.jpg`
8. `08-GRAPHIC-LANGUAGE.jpg`
9. `09-PHOTOGRAPHY-DIRECTION.jpg`
10. `10-EVENT-ENTRANCE.jpg`
11. `11-BOOTH-AND-SIGNAGE.jpg`
12. `12-BADGES-AND-PRINT.jpg`
13. `13-SOCIAL-AND-DIGITAL-ADS.jpg`
14. `14-DIGITAL-EXPERIENCE.jpg`
15. `15-WEBSITE-HEADER-AND-HERO.jpg`
16. `16-WEBSITE-FULL-OVERVIEW.jpg`
17. `17-WEBSITE-ABOUT-TRUST-BENEFITS.jpg`
18. `18-WEBSITE-CATEGORIES-PRICING-FLOORPLANS.jpg`
19. `19-WEBSITE-GALLERY-ATTRACTIONS-PROGRAMME.jpg`
20. `20-WEBSITE-RESOURCES-FORMS.jpg`
21. `21-WEBSITE-VENUE-FAQ-FOOTER.jpg`
22. `22-WEBSITE-UI-DETAILS.jpg`
23. `23-MOBILE-EXPERIENCE.jpg`
24. `26-BRANDING-ACROSS-TOUCHPOINTS.jpg`
25. `27-CLOSING.jpg`

Use `01-COVER/STFE-2027-BEHANCE-COVER.jpg` (1616 × 1264) as the project cover image.

## Final logo
- Every logo in this package is the final approved logo, supplied as `STFE-Logo-JPG.jpg.jpeg`: the geometric multicolour STFE with the orange 2027, the globe and the swoosh. An audit of every image the generator embeds confirmed that the old serif logo is not used anywhere.
- **The logo is raster, not vector.** It was supplied as a 1323 × 492 image on white and is used unaltered. The only change is that the white margin was trimmed (to 978 × 460). It has not been traced, recoloured or redrawn. Because it has a white background, it always sits on white or on a white plate.
- If a vector master (AI, EPS, PDF or SVG) exists, replace the embedded `<image id="approved-...">` elements with it.

## Website captures
- The screenshots are real Chromium captures of the latest production build of the STFE 2027 landing page. Desktop is 1440 px wide at 2×; mobile is 390 px wide at 3×.
- For these captures, the final logo was placed into a **local copy** of the site, along with the pricing-guide thumbnail regenerated from that build. **The live website and Netlify were not modified or deployed.** The live site still shows the old logo until you approve an update.
- In the production build, the government marks (MSME, Make in India, Digital India) are withheld until authorised. They do not appear in the site header captures or anywhere in the portfolio artwork.
- **One exception:** the Brochure and Lead Magnets section shows a small thumbnail of the organiser's own printed exhibitor brochure. That brochure still uses the earlier serif wordmark and shows the three marks at very small size. It is the organiser's existing document, not part of this identity, so it was not altered. Before publishing, either confirm that showing it is fine or replace the brochure with an updated version.

## What is editable and what is raster
- **Editable vector:** all headings and body text (live `<text>` in Rajdhani and Manrope, 1,226 text elements in total), colour fields, gradients, the ornament, the cube texture `<pattern>`, momentum bands, the skyline, badges, the brochure, the stall sheet, the invitation, the letterhead, the social posts, the banner, the entrance arch, hanging banners, the shell-scheme stall, the totem, and the browser and phone frames.
- **Raster (replaceable `<image>` elements):** the final logo, photography, the Soor Sadan venue photograph and all website screenshots. These are embedded images, not vector artwork.
- Named layers in every SVG: `Background`, `Artwork`, and in the guidelines also `Folio`. All files are tested as valid XML. They open in Illustrator and Inkscape. Drop shadows are SVG filters.

## Fonts (not included)
- Rajdhani 500/600/700: https://fonts.google.com/specimen/Rajdhani
- Manrope 400–700: https://fonts.google.com/specimen/Manrope

Both are under the SIL Open Font License. Install them before editing the SVGs.

## Sources and permissions
- **Photography:** five images supplied by the organiser, plus hall images already used on the site. They are illustrative and are **not photographs of a previous STFE edition**. See `stfe-2027/IMAGE-CREDITS.md`. The rights for organiser-supplied images marked "unknown" must be confirmed before public use.
- **Venue photograph and facts:** taken from the official STFE 2027 brochure. The facts are the dates, venue, the price (₹69,030 including GST, ₹7,670 per m²), the stall sizes and the contact details.
- **Concepts:** the entrance arch, hanging banners, stall fascia, totem, badges, print pieces and ad creatives are design concepts. They are labelled as concepts and have not been built, printed or run as ads.
- **Placeholders:** names, companies, stall numbers and QR codes are placeholders. No testimonials, endorsements or past-edition claims are made.

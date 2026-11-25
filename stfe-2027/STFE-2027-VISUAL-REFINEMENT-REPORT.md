# STFE 2027 — Visual refinement report

## Typography
- **Headings:** Rajdhani (500, 600 and 700) for the hero, section titles, navigation, forms, attractions, programme, footer headings and statistics. It includes a Devanagari subset.
- **Body:** Manrope (400, 500 and 600) for paragraphs, labels, inputs, contact details and FAQ answers.
- **Type scale:** CSS variables set H1 at 37–66 px, H2 at 30–46 px, H3 at 22–29 px and body at 15–17 px. Fonts are self-hosted, so there are no third-party requests.

## Colour
- Colours are sampled from the reference site and your screenshots:
  - Plum `#8f1d6d` and indigo `#36315f`, which also form the contact-panel gradient (`#871f6b` → `#363160`).
  - Warm orange `#f07a3f` for CTAs, with hover `#d9622f`.
  - Ornament and skyline gradient `#e97541` → `#b13f85`.
  - Deep purple `#4b325f` for the copyright bar.
  - Neutral `#f7f7f7` for sections.
- Primary buttons are now solid warm orange rather than a gradient.
- The STFE logo is unchanged.

## Background patterns (all original SVG or CSS)
- **A · Geometric cube texture** at about 4–6 % contrast, on About, Resources and FAQ.
- **B · Ornamental strip:** a lattice-and-drop repeat masked over an orange → magenta gradient. It sits above the enquiry split, behind the footer contact panels and under the skyline.
- **C · Photo-overlay split:** "Who should exhibit" pairs a purple-tinted photo and headline with an orange-tinted photo carrying the 17 categories as rows.
- **D · Dividers:** fine gradient accent rules on section kickers and subtitles.

## Hero
- **Layout:** two columns. Event identity, headline, tagline, dates, venue, price and CTAs sit on the left. A compact "Get Stall Details" card (360 px) sits on the right, with Full Name, Mobile and an optional Company/Brand field, consent and the CTA.
- **Mobile order:** copy, then the form, then visitor access.
- **Photo:** replaced, at your request, with the bright Amritpex 2023 aisle at Pragati Maidan (Wikimedia Commons, CC BY-SA 4.0). The overlay is lighter.

## Footer components
1. Ornamental top strip.
2. Two floating contact panels: Exhibitor Enquiries (+91 96341 26260, WhatsApp) and Visitor Registration & Assistance (+91 96341 26260, Register Free).
3. Five columns: Organised By (logo, organiser, credentials), Exhibitors, Visitors, Contact with icons, and Quick Enquiry (brochure, pricing guide, callback, WhatsApp).
4. An illustrated skyline: Agra fort gateway, Taj-style mausoleum, exhibition pavilion, factory, cargo crane, business towers, wind turbines, metro train, truck, aeroplane, tractor, solar array, robotic arm and retail cart. It has an orange → magenta gradient and the ornament band beneath it.
   - **Your own footer artwork:** save it as `public/assets/brand/footer-skyline-licensed.webp` and the build uses it instead. Your file was not available in this session as a file.
5. Deep-purple copyright bar with Privacy Policy, Terms & Conditions, Brochure, Contact and Image Credits.
6. A floating WhatsApp button on desktop. It is hidden over the hero, the forms and the footer. On mobile, the sticky bar provides Enquire for a Stall, WhatsApp and Call.

## Responsive
- **Header:** the same structure is kept. Navigation is in Rajdhani at 17 px with an animated underline.
- **Mobile:** the menu is compact, the contact panels stack, footer columns regroup, and the skyline crops to its centre.
- **Overflow:** none at 375, 390, 430, 768, 1024 or 1440 px.

## Functional tests — 86/86 passed
Tested against a local server that mimics Netlify Forms. Saved records are written to `qa-output/leads.jsonl`.
- **Forms:** the hero form, exhibitor enquiry (with validation, a duplicate-click guard, UTMs and a normalised mobile number), the callback modal and visitor registration all save records.
- **Errors:** a simulated backend outage shows an error, never a success.
- **Downloads:** brochure and pricing guide.
- **Floor plans:** tabs, zoom, enlarge and Escape.
- **FAQ, links and navigation:** FAQ, WhatsApp, phone, email, Maps, Privacy and Terms, in-page anchors and the mobile menu.
- **Controls:** the sticky bar and the floating WhatsApp button.
- **Fonts:** Rajdhani and Manrope are confirmed loaded.
- **Errors and images:** no console errors and no broken images.

Live Netlify capture can be confirmed only after deployment.

## Release blockers
- **Government marks:** MSME/Government of India, Make in India and Digital India appear in the preview build only. Production leaves them out until `institutionalMarksApproved` in `site.config.js` is set after written authorisation and approved relationship wording. The visible warning badge has been removed.
- **Organiser images:** the `u-*` images (B2B, workshop, awards, hall) still have unconfirmed usage rights.
- **Footer artwork:** your supplied footer artwork is not yet in the project. See Footer component 4.

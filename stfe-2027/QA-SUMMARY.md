# STFE 2027 — QA summary (redesign)

**73 of 73 automated checks passed.** They ran in Chromium against the preview build; the production-build gate was checked too. Raw results are in `QA-RESULTS.json`.

- **Layout.** No horizontal overflow and no JS errors at 375, 390, 430, 768, 1024 and 1440px. Tap targets are 40px or larger on mobile.
- **Brand.** The approved logo image renders in the header on desktop and mobile. The brochure tagline is present.
- **Institutional marks.** The preview build shows the three brochure marks with a pending-authorisation badge. The production build contains none.
- **Images.** All trade-exhibition images on the page load, and each has a credits entry with source and licence status. The hero uses an exhibition image. Credits are listed in the footer.
- **Content.** ₹69,030 and ₹7,670 per sq. m; 17 categories, 6 benefits, 6 inclusions, 3×5 programme items, 4 attractions, 12 FAQs. No "plus GST" or endorsement wording.
- **Downloads.** The original brochure (byte-identical) and the pricing guide download. The calendar file has the correct dates and venue. Privacy and terms pages load.
- **Floor plans.** Ground and first-floor plans load and differ. Tabs, zoom, reset and enlarged view work.
- **Forms.** Invalid input saves nothing. A valid exhibitor enquiry is saved exactly once with UTMs, landing page, stall configuration and consent. Success shows only after the backend confirms. Callback and visitor forms save separately. A 503 shows an error.
- **Links.** WhatsApp (+91 9634126260, pre-filled), phone, email, website and Maps links work; every in-page anchor resolves.

**Limits.** Saving was proven against a local server that mimics Netlify Forms; live capture can be confirmed only after deployment. The Google Maps embed is blocked in the sandbox.

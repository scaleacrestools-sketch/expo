# STFE 2027 — QA summary

**82 of 82 automated checks passed.** They ran in Chromium against the preview build.
The production-build gate was also checked. Raw results are in `QA-RESULTS.json`.

- **Layout.** No horizontal overflow and no JS errors at 375, 390, 430, 768, 1024 or 1440px. Tap targets are 40px or larger on mobile.
- **Brand.** The approved logo image renders in the header on desktop and mobile, not as text. The brochure tagline is present. There are no engineering notes in the hero.
- **Institutional marks.** The preview build shows exactly three marks with a pending-authorisation badge. The production build contains none.
- **Content.** Pricing is ₹69,030 and ₹7,670 per sq. m. All 17 categories, 6 benefits, 6 inclusions, 3×5 programme items, 4 attractions and 12 FAQs are present. There is no "plus GST" or endorsement wording.
- **Downloads.** The original brochure is a byte-identical 13,339,333-byte PDF and triggers a real browser download. The pricing guide PDF also downloads.
- **Floor plans.** The ground plan is 1468×884 and the first-floor plan is 1468×832. They are different images. Tabs, zoom, reset and the enlarged view all work.
- **Forms.** Empty or invalid input saves nothing. A valid exhibitor enquiry is saved exactly once, even on a double click. It carries UTMs, landing page, normalised mobile, stall configuration and consent. Success shows only after the backend confirms, and no error appears after a confirmed save. Callback and visitor forms save separately. A 503 response shows an error and re-enables the button.
- **Links.** WhatsApp uses +91 9634126260 with a pre-filled message. Phone, email, website and Maps links work, and every in-page anchor resolves.

**Bug found and fixed during QA.** Each form has a field called `name`, so `form.name` returned that input instead of the form's name.
As a result, a successfully saved enquiry showed "could not be sent". The code now reads the attribute, and a check guards against regressions.

**Limits.** Saving was proven against a local server that mimics Netlify Forms. Live capture can be confirmed only after deployment.
The Google Maps embed is blocked in the sandbox, but the directions link is correct.

**UPITS landing-page redesign checks (added).** These cover the navigation gradient (plum/indigo, no navy), the orange-gradient primary CTA, and a footer under 320 px. The hero form saves a lead with UTMs, and the callback modal opens and saves. The mobile sticky bar is hidden on the first screen, shows Enquire, WhatsApp and Call after the hero, and hides while the enquiry form or the footer is on screen. Image credits are listed on `/credits.html`.

# STFE 2027 — Functional QA summary

**Result: 56 of 56 automated checks passed.** Raw results are in `QA-RESULTS.json`.
They were run with Playwright on Chromium against the production build in `dist/`.

## What was tested

| Area | Checks |
|---|---|
| Responsive layout | No horizontal overflow and no JS errors at 375, 390, 430, 768, 1024 and 1440px |
| Content accuracy | ₹69,030 and ₹7,670/sq. m shown; 17 categories, 6 benefits, 6 inclusions, 3×5 programme items, 4 attractions, 12 FAQs; no "plus GST" wording; no endorsement wording; government marks not shown |
| Links | WhatsApp (+91 9634126260, pre-filled message), tel, mailto, organiser website, Google Maps directions, every in-page anchor resolves |
| Downloads | Pricing guide is a valid PDF and triggers a real browser download; brochure button is never a broken link; privacy page loads |
| Exhibitor form | Empty submit flags required fields and saves nothing. An invalid mobile or email is rejected and saves nothing. A valid enquiry is saved by the backend exactly once, even on a double click. The saved lead carries all four UTMs, landing page, enquiry type, normalised mobile, stall configuration and consent. Success shows only after the save. |
| Callback and visitor forms | Each saves its own lead with the correct enquiry type |
| Failure handling | With the backend returning 503, the form shows an error, never a success, and the button re-enables |
| UX | Pricing CTA pre-selects the stall configuration. The mobile menu opens, and closes after navigating. Floor-plan tabs switch. The enlarged view opens and closes with Escape. All tap targets are at least 40px. |

## Limits of this QA

- Form saving was proven against a local server that mimics Netlify Forms. It is `scripts/qa-server.mjs`, which writes `qa-output/leads.jsonl`.
  Live Netlify Forms capture can only be confirmed after deployment. Follow step 6 of the README.
- Zoom and pan on the floor plans could not be tested on real plans, because the original schematics were not supplied.
  The controls and enlarged view were tested on the empty viewer.
- The Google Maps embed did not load in the sandbox. The directions link is correct.
- The brochure, logo, floor plans, partner logos and photography were not available.
  The site shows the honest fallbacks described in the README.

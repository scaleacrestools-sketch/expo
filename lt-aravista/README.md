# L&T Realty Aravista – lntgurgaonproject.com

Source for the L&T Realty Aravista (Sector 86, Gurugram) channel-partner landing page.

The original site was only available as a compiled build, so this project rebuilds it as
readable source. The production stylesheet's design tokens and custom CSS are carried over
verbatim (see `src/index.css`), so the design, fonts, colours, spacing and animations match
the existing site. Content has been updated to the latest Aravista brochure.

## Commands

```bash
npm install
npm run dev      # local dev server; /save.php is answered by a dev-only stub
npm run lint
npm run build    # outputs dist/
npm run preview  # serves dist/ locally (no /save.php stub)
```

## Deploying

1. Run `npm run build`.
2. Upload the contents of `dist/` to the web root of lntgurgaonproject.com.
3. **Keep the existing `save.php` on the server.** It receives every lead and ad-click
   event and is not part of this repository. Do not delete it when replacing files.
4. Keep the SPA fallback (all routes serve `index.html`) so `/thank-you`,
   `/privacy-policy` and `/disclaimer` keep working.

Nothing in this project deploys automatically.

## What is preserved from the existing site

- Google Tag Manager `GTM-MDJ6R6HD` (Meta Pixel, Google Ads and GA are loaded through GTM).
- Landing-query capture script, UTM / gclid capture and storage keys.
- Lead payload, field names and `form_name` values posted to `/save.php`.
- Once-per-session ad-click tracking posted to `/save.php`.
- `/thank-you` redirect and the `lead_thank_you` dataLayer event.
- Phone, WhatsApp number and agent RERA number of the channel partner.
- Domain, canonical URL, routes, `robots.txt`, `sitemap.xml` and favicon.

## Where to edit content

| What | File |
| --- | --- |
| Project name, price, phone, WhatsApp, RERA numbers, developer disclaimer | `src/config/site.js` |
| Residence collections, areas, prices, plan images | `src/config/residences.js` |
| Image registry and hero slides | `src/config/images.js` |
| Navigation links | `src/config/routes.js` |
| SEO meta, Open Graph, structured data | `index.html` |

Unit floor plans are shown openly with zoom. To return to the old blurred,
enquiry-gated plans, set `GATE_UNIT_PLANS = true` in `src/sections/FloorPlans.jsx`.

## Image sources

All project images come from the official L&T Realty Aravista brochure
(Sector 86 Gurugram OpDeck). The master plan uses the higher-resolution copy of the same
drawing published on lntaravista.co. Renders are artistic impressions.

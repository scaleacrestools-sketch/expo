# SEO preservation & parity report — OLD WordPress vs NEW Next.js

**Status: NOT SIGNED OFF. Launch is blocked.**
The production baseline crawl has not been captured, because scaleacres.com is unreachable from the build environment (network policy). Every protected value below that is not marked verified comes from the search index or the ScaleAcres Brand Kit v1.0, which was compiled from scaleacres.com in Sep 2026. All of it must be confirmed by the crawl before launch.

## 1. How existing SEO is protected

| Signal | Protection in the build |
|---|---|
| URLs | Every known production URL is served at the **same path** with the **same trailing slash** (`trailingSlash: true`). There are **no redirects**. The earlier 301 map was removed. |
| Pages not yet migrated | Every protected URL marked `serveFrom: "wordpress"` in `content/seo/pages.ts` is **proxied unchanged from WordPress** when `WORDPRESS_ORIGIN` is set at build time. This covers inner pages, all location pages, the blog, tag archives, feeds and `/wp-content/` uploads. Verified locally against a stand-in origin. |
| Unknown URLs | Any path the new app does not implement falls through to WordPress (pages keep their trailing slash, files keep their extension), so nothing that exists today returns 404. |
| Homepage title | Bound to the indexed title "Best Real Estate Digital Marketing Agency in India" (`content/seo/homepage.ts`). |
| Homepage H1 | Keeps the live H1 "We Don't Create Brands. We Create Market Leaders." as the semantic `<h1>`. The new creative line "We build brands. We drive growth." is supplementary `<p>` copy, not a heading. |
| Homepage body copy | The live positioning line, intro paragraph, boilerplate and service headings render as server-side HTML in the hero and the "Real estate is in our DNA" section. Nothing is visually hidden. |
| Canonicals | Self-referencing absolute canonicals on every Next.js page (`https://scaleacres.com/<path>/`). Proxied pages keep WordPress' own canonical tags. |
| Robots | Host-based: only `scaleacres.com` / `www.scaleacres.com` are indexable. Every other host (Netlify previews, staging, localhost) gets `X-Robots-Tag: noindex, nofollow` and a disallow-all robots.txt. A missing env var cannot noindex production. |
| Sitemaps | `/sitemap.xml` lists the Next.js routes. robots.txt also references WordPress' `/sitemap_index.xml`, which keeps serving through the proxy. |
| Structured data | `Organization` on every page, `BreadcrumbList` on service pages. WordPress pages keep their schema via the proxy. The homepage schema must be diffed against the crawl, and any missing types must be added back. |
| Crawlability | All content is server-rendered. Reveal animations only hide content after JavaScript has booted (`.js` class), and with JavaScript disabled every heading and section is visible (QA verified). Collapsed accordion panels are present in the HTML. |
| Performance | The hero video gets no sources until after the `load` event plus idle time (`preload="none"`), so it never competes with the LCP headline. Posters are around 28 KB and the web video around 0.4–1.3 MB. |

## 2. Homepage — before vs after content comparison

| Element | OLD (live, per brand kit / index) | NEW | Verdict |
|---|---|---|---|
| `<title>` | Best Real Estate Digital Marketing Agency in India | identical | PASS (verify exact string incl. separators/suffix in crawl) |
| Meta description | **not captured** | temporarily the live intro paragraph | **FAILED until replaced with the exact live value** |
| H1 | We Don't Create Brands. We Create Market Leaders. | identical, semantic `<h1>` | REVIEW REQUIRED (unverified source) |
| Positioning line | India's Real Estate Marketing Specialist | visible in hero lead and as eyebrow of "Real estate is in our DNA" | REVIEW REQUIRED |
| Intro paragraph | "We're a seasoned real estate marketing agency…" | identical, visible | REVIEW REQUIRED |
| Boilerplate | "ScaleAcres PromoTech is a 360° real estate branding…" | identical, visible | REVIEW REQUIRED |
| Service headings | Targeted Lead Generation, Real Estate Branding, Real Estate Website Development, SEO, Social Media Marketing | identical H3s linking to the live service URLs | REVIEW REQUIRED |
| Other live sections (stats, testimonials, FAQs, location links, case-study teasers) | **unknown** | not present | **FAILED until the crawl lists them and they are carried over** |
| New creative copy | — | "We build brands. We drive growth.", positioning strip, services accordion, studio, process, brand statement | Additive only |

New homepage heading outline (from the staging build):

```
H1  We Don't Create Brands. We Create Market Leaders.
H2  Brands that trust our work. / We think big. We build bigger. / Big ideas. Built into action. /
    Proof is in the work. / Made to be seen. / Real estate is in our DNA. / Think. Create. Build. Scale. /
    Work that makes a difference. / Create different. Build smarter. Scale further. /
    Ideas worth exploring. / Got a big idea? Let's make it happen.
H3  8 service categories · 5 legacy service headings · 4 process steps · case study · 3 articles
```

## 3. URL-level report (registry vs staging build)

Generated by `node scripts/parity-from-registry.mjs seo/candidate-staging.json`.

| URL | Type | Served in production | Verdict | Notes |
|---|---|---|---|---|
| `/` | home | Rendered by Next.js (redesign) | **REVIEW REQUIRED** | Title matches indexed title<br>H1: "We Don't Create Brands. We Create Market Leaders." (from brand kit, unverified)<br>Meta description, full body copy, schema and internal links need the baseline crawl |
| `/about-us/` | page | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN.<br>Redesign preview ready: title matches, 320 words. Needs content export before switching to next. |
| `/our-team/` | page | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN.<br>Redesign preview ready: title matches, 106 words. Needs content export before switching to next. |
| `/our-services/` | page | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN.<br>Redesign preview ready: title matches, 514 words. Needs content export before switching to next. |
| `/contact-us/` | page | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN.<br>Redesign preview ready: title matches, 152 words. Needs content export before switching to next. |
| `/case-studies/` | page | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN.<br>Redesign preview ready: title matches, 394 words. Needs content export before switching to next. |
| `/real-estate-web-development/` | service | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN.<br>Redesign preview ready: title matches, 247 words. Needs content export before switching to next. |
| `/real-estate-branding-agency/` | service | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN.<br>Redesign preview ready: title matches, 288 words. Needs content export before switching to next. |
| `/real-estate-ppc-service/` | service | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN.<br>Redesign preview ready: title matches, 352 words. Needs content export before switching to next. |
| `/real-estate-marketing-delhi/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/real-estate-marketing-mumbai/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/real-estate-marketing-pune/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/real-estate-marketing-bangalore/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/real-estate-digital-marketing-agency-in-ghaziabad/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/real-estate-digital-marketing-agency-in-ahmedabad/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/us/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/us/digital-marketing-company-for-real-estate-in-miami/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/us/digital-marketing-company-for-real-estate-in-new-york/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/us/digital-marketing-company-for-real-estate-in-texas/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/uae/real-estate-digital-marketing-agency-in-dubai/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/sa/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/sa/digital-marketing-company-for-real-estate-in-jeddah/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/au/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/au/digital-marketing-company-for-real-estate-in-sydney/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/nz/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/vn/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/ph/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/id/digital-marketing-company-for-real-estate-in-bali/` | location | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/blog/` | archive | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/blog/tag/digital-marketing-for-real-estate/` | archive | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/blog/why-your-ad-budget-is-wasted-if-your-website-loads-slow/` | blog | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/blog/custom-vs-template-real-estate-websites/` | blog | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/blog/how-to-create-high-converting-real-estate-landing-pages/` | blog | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/blog/step-by-step-guide-to-building-a-real-estate-website/` | blog | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/blog/a-detailed-guide-to-real-estate-website-development/` | blog | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/blog/how-real-estate-developers-can-use-website-analytics-for-better-sales-decisions/` | blog | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/blog/seo-strategy-for-property-developers/` | blog | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/blog/why-real-estate-websites-should-include-testimonials-reviews-and-rera-information/` | blog | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/blog/key-features-to-include-in-a-real-estate-website-for-maximum-lead-conversion/` | blog | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/blog/what-is-nap-consistency-and-why-does-it-matter-for-real-estate-seo/` | blog | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/blog/how-to-create-and-optimize-google-my-business-profile-for-real-estate/` | blog | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/blog/common-mistakes-to-avoid-in-local-seo-for-real-estate-business/` | blog | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |
| `/blog/common-challenges-in-real-estate-digital-marketing/` | blog | Proxied unchanged from WordPress | **PASS (pending proxy check)** | Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN. |

**New URLs introduced by the redesign** (no prior ranking; need sign-off as additions):

| URL | Status | Title |
|---|---|---|
| `/creative-studio/` | 200 | Creative Studio | ScaleAcres |
| `/insights/` | 200 | Insights | ScaleAcres |
| `/privacy-policy/` | 200 | Privacy Policy | ScaleAcres |
| `/services/search-engine-optimization/` | 200 | Search Engine Optimization | ScaleAcres |
| `/services/social-media-marketing/` | 200 | Social Media Marketing | ScaleAcres |
| `/services/video-creative-production/` | 200 | Video & Creative Production | ScaleAcres |
| `/services/ecommerce-solutions/` | 200 | Ecommerce Solutions | ScaleAcres |
| `/services/custom-applications-software/` | 200 | Custom Applications & Software | ScaleAcres |
| `/case-studies/yugen-goa/` | 200 | Yugen, North Goa — Performance Marketing · Branding | ScaleAcres |
| `/case-studies/one-goa/` | 200 | One Goa — Digital Campaigns | ScaleAcres |
| `/case-studies/prominent-realty/` | 200 | Prominent Realty — Lead Generation · Web | ScaleAcres |
| `/case-studies/hometrust-realty/` | 200 | Hometrust Realty — Branding · Performance | ScaleAcres |

## 4. Mandatory pre-launch audit (not yet possible from this environment)

Run these from any machine that can reach scaleacres.com:

```bash
npm run seo:baseline                                   # crawl every sitemap URL + linked pages
npm run build && npm start &                           # or point CANDIDATE_URL at the Netlify staging URL
WORDPRESS_ORIGIN=https://<wp-origin> npm run build     # staging build that proxies protected pages
CANDIDATE_URL=https://<staging>.netlify.app npm run seo:candidate
npm run seo:compare                                    # writes seo/parity-report.md + .csv with PASS / REVIEW REQUIRED / FAILED
```

For every URL the baseline records: status and redirect chain, title, meta description, meta robots, X-Robots-Tag, canonical, H1/H2/H3, JSON-LD types, internal links, image `src` and `alt`, word count and a body-text fingerprint. `compare` fails a URL on any title, meta, H1, canonical, status, noindex, lost-schema or >10% body-copy change, and flags missing H2/H3, internal links and alt text for review.

Still required by hand:
- [ ] Google Search Console: export queries, clicks, impressions, positions (16 months) and Page indexing coverage. Mark the top URLs by clicks as "critical" in `content/seo/pages.ts`.
- [ ] Export analytics and conversion tracking: GA4 property, Google Ads conversion tags, Meta Pixel, form-submit events, call-click events. Mirror them in the new build before launch. Only GA4 is wired today (`NEXT_PUBLIC_GA_MEASUREMENT_ID`).
- [ ] Export all WordPress content: WP All Export or WP-CLI, plus Yoast/RankMath meta, as the source for migrating any page from `wordpress` to `next`.
- [ ] Mobile rendering check on staging: Lighthouse and Search Console URL Inspection "live test" for the homepage.

## 5. Rules for switching a page from WordPress to Next.js

A page moves from `serveFrom: "wordpress"` to `"next"` only when all of these hold:
1. Its title, meta description, canonical, H1, H2/H3 text, body copy, image alt text, schema and internal links are reproduced from the baseline export.
2. `seo:compare` shows **PASS** for it, or REVIEW items have written approval.
3. The change is shipped alone, and the URL is monitored for 2–4 weeks before the next batch.

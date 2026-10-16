# SEO migration plan — WordPress → Next.js

Goal: protect existing organic performance. Nothing indexed is removed for visual reasons.

## 1. URL inventory (from live site / search index — complete from the WordPress export before launch)

### Replaced by new routes (301s configured in `lib/redirects.ts`)
| Legacy URL | New URL |
|---|---|
| `/about-us/` | `/about` |
| `/our-team/` | `/about#team` |
| `/our-services/` | `/services` |
| `/contact-us/` | `/contact` |
| `/case-studies/` | `/work` |
| `/real-estate-web-development/` | `/services/website-design-development` |
| `/real-estate-branding-agency/` | `/services/branding-creative-design` |
| `/real-estate-ppc-service/` | `/services/performance-marketing` |

### Preserved at their existing URLs (NOT redirected — keep serving)
- **Blog**: `/blog/`, `/blog/<slug>/`, `/blog/tag/<tag>/` (dozens of ranking articles, e.g. the 2026 SEO strategy and website-development guides).
- **Location / market landing pages** — India: `/real-estate-marketing-{delhi,mumbai,pune,bangalore}/`, `/real-estate-digital-marketing-agency-in-{ghaziabad,ahmedabad}/`, plus Hyderabad, Chandigarh, Noida variants; International: `/us/`, `/us/digital-marketing-company-for-real-estate-in-{miami,new-york,texas}/`, `/uae/real-estate-digital-marketing-agency-in-dubai/`, `/sa/`, `/sa/…jeddah/`, `/au/`, `/au/…sydney/`, `/nz/`, `/vn/`, `/ph/`, `/id/…bali/`.

Options for serving preserved content:
1. **Phased cut-over (recommended):** proxy `/blog/*` and the location pages to the WordPress origin via `rewrites()` in `next.config.ts` until they are migrated into the `content/` layer as MDX. Zero URL change, zero ranking risk.
2. Migrate them into `app/(seo)/…` route groups with the same slugs, generated from the WordPress export (titles, meta descriptions, H1s, body, images, publish dates).

## 2. Pre-launch checklist
- [ ] Export all posts/pages with Yoast/RankMath metadata (title, description, canonical, focus keyword, OG image).
- [ ] Crawl the live site (Screaming Frog) → save the full URL list; diff against the Next.js sitemap.
- [ ] Verify every legacy URL resolves 200 or 301 (no 404s) on staging with the crawl list.
- [ ] Keep heading hierarchy: one `<h1>` per page (done in templates), section titles as `<h2>`.
- [ ] Structured data: `Organization` (global, `lib/seo.ts`), `BreadcrumbList` on service pages; add `Article` to migrated posts, `Service` to service pages once copy is final.
- [ ] `sitemap.xml` (`app/sitemap.ts`) and `robots.txt` (`app/robots.ts`) generated; add preserved legacy URLs to the sitemap when they are served from this app.
- [ ] GA4 via `NEXT_PUBLIC_GA_MEASUREMENT_ID`; add Search Console verification file; confirm GTM/pixels from the WordPress site are carried over.
- [ ] Core Web Vitals: hero video ≤ 6 MB with poster, `preload="metadata"`, fonts via `next/font` (self-hosted, swap), images through `next/image` once real assets replace SVG placeholders.
- [ ] Mobile rendering checked on 320/375/414/768 widths (see `docs/qa-screenshots/`).

## 3. Launch / post-launch
- [ ] Deploy behind the same domain; switch DNS; keep WordPress reachable on an origin hostname for rewrites.
- [ ] Submit the new sitemap in Search Console; monitor Coverage and "Page with redirect" reports for 4 weeks.
- [ ] Watch top-20 ranking URLs weekly; any drop → check the redirect/rewrite for that URL first.

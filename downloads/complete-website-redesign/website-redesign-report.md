# ScaleAcres complete website redesign: report

**Staging only.** The live WordPress site, hosting, DNS and production SEO settings were not touched. Every preview URL serves `X-Robots-Tag: noindex, nofollow`.

## 1. What changed

Every existing page now uses the premium design system of the approved homepage, not only Delhi. Shared system:

- Outfit typography with the homepage's display and heading scale.
- The official palette: Royal Blue, Royal Deep, Sky, Brand Black, Royal Navy, Mist and White.
- The homepage header, menu, eyebrow labels, buttons, scroll reveals, closing CTA and black footer.

The old generic band layout has been retired. Each page is composed section by section by a section composer (`components/legacy/Composer.tsx`). It recognises what each live section is and renders it with a purpose-built component:

| Component | Used for |
|---|---|
| Premium hero | Original H1 at display size, label + breadcrumb, intro, CTA, the page's own photography, the working enquiry form in a dark glass card |
| Client logo wall | Equal greyscale tiles, colour on hover (never cropped or blown up) |
| Client stories rail | Founder cards (photo, name, company logo) with previous/next controls |
| Editorial statement | Big heading left; lead copy, key figure and CTA right |
| Key-figures band | Royal Navy band with large numeric headings (15cr+, 33+, 2.5Lacs+…) |
| Branding showcase | One lead image, two beside it, rows that always fill edge to edge |
| Funnel / process | Stage cards with outline numbers; "Step 1 / 2 / 3" processes as grouped rows |
| Interactive offering rows | Numbered service list with hover motion and a sticky title |
| Website portfolio | Two lead projects large, the rest in a consistent grid; hover scrolls the full screenshot |
| Results | Campaign screenshots in browser frames |
| Image-and-content splits | Editorial copy in a readable column beside the image; card details in a dark panel |
| Team / highlight cards | Photo cards with name and role |
| Culture grid | Photos in their natural proportions (artwork with text in it is never cropped) |
| Trust badges | Certificates and partner badges on white tiles, shown whole |
| Film reel | Video grid with titles |
| Callout | Royal Navy strip with the heading and CTA |
| FAQ | Two-column accordion; all answers in the HTML |
| Legal | Dark header with a reading column |

Blog articles keep their editorial template: dark header, featured image and a 46-rem reading column. Blog listings, categories, tags, authors and date archives keep the card grid. Creative Studio keeps its three-tab video page.

### Page types

Each type shares the brand language but gets a composition suited to its content.

| Page type | Pages | Composition |
|---|---|---|
| Location / city SEO pages | 89 | Hero with form, logo wall, client stories, statement, showcase, funnel, results, website portfolio, awards, culture, reasons, creatives, FAQ. Each page keeps its own copy. |
| Individual service pages | 7 | Hero with form, logo wall, stories, splits, reasons, offering rows, step process, FAQ |
| Services overview | 1 | Hero, key-figures band, callout, service cards, FAQ |
| About Us / Our Team / Careers | 3 | Hero with founders photo, banner, key figures, journey, team cards, culture, FAQ |
| Our Work | 1 | Hero with kicker, branding showcase, website portfolio, creatives, film reel |
| Case studies | 3 | Hero, case cards (uncropped), video, results, FAQ |
| Contact Us | 1 | Hero, contact details, trust badges, working form, map |
| Legal | 2 | Reading template |
| Blog articles | 96 | Editorial article template |
| Blog listing and archives | 122 | Card grid (blog, 9 categories, 17 tags, 2 authors, 93 date archives) |
| Creative Studio | 1 | AI / Social / Ad video tabs |

## 2. Content and SEO preservation

The check is `scripts/seo-parity.py`. It compares each page in the build with the verbatim capture of the live page. Full results are in `seo-parity-report.md/.csv` and `seo-parity-details.json`.

| Check | PASS | REVIEW | FAILED |
|---|---|---|---|
| CONTENT | 331 | 1 | 0 |
| META | 332 | 0 | 0 |
| LINK | 330 | 2 | 0 |
| SEO | 331 | 1 | 0 |

**The REVIEW rows are not regressions:**
- **Homepage:** this is the approved homepage. Title and description are identical; the H1 decision is still yours.
- **`/case-studies/`:** the live link `/casestudy/our-case-one-goa/` returns 404, so it now points to the working `/blog/casestudy/our-case-one-goa/`. The capture also listed a link to `/case-studies` that the new page doesn't have; it comes from the page's popup button, which now opens `/contact-us/`.

**Stricter block-level check:** every heading, paragraph, list, FAQ question and image of every composed page was looked for in the new build. **0 pages are missing any block.**

**Unchanged:**
- URLs, titles, meta descriptions, canonicals (emitted verbatim), robots, H1–H3 text and tags.
- JSON-LD (byte-identical).
- Image src and alt.
- Internal links.

**Display-only change:** where the live page repeats the same heading for another breakpoint, it is shown once. Both copies stay in the HTML.

## 3. Testing

| Test | Result |
|---|---|
| All 344 generated pages at 390 px | 0 horizontal overflow, 0 page errors |
| Functional checks (desktop + mobile) | 16/16 pass: menu with locations, Escape closes, FAQ, server-rendered answers, contact form and validation, contact details, article author/date, Creative Studio tabs (7/10/22 videos) |
| One working enquiry form per page | Verified on every page (later form blocks link to it) |
| Lint, TypeScript, production build | Clean |

**Performance (static build):**

| Measure | Result |
|---|---|
| Median page HTML | 150 KB (about 42 KB gzipped for the longest location page) |
| Shared JavaScript | About 259 KB gzipped (framework, motion), cached across pages |
| Images | Lazy-loaded below the fold (138 of 141 on the Delhi page) |
| Videos | Load only when played |

## 4. Screenshots

Real-image screenshots were taken in an external sandbox, because this build environment cannot reach scaleacres.com, where the images live.

**Delivered so far:** the Delhi page.

**Reviewed but not yet exported:** About Us, Our Team, Our Services, the PPC service page, Our Work, Contact and Case Studies, reviewed on the previous build with real images.

**Not yet captured:** desktop and mobile screenshots for every page type on this final build. That run was stopped when the sandbox was declined. In your browser, the preview ZIP shows every page with the live images.

## 5. Missing or weak original assets

Nothing was invented, and no unrelated image is presented as client work.

1. **Portfolio project names.** The live pages show only a logo and a category/platform line, so no names were added.
2. **Dedicated hero photography or video** for location and service pages. The heroes use each page's own editorial image.
3. **Full-resolution website screenshots.** The live files are WordPress "-scaled" versions, about 700 × 2,560 px.
4. **Client testimonial videos.** Live client stories are photos. The homepage testimonial MP4s are still on the Higgsfield CDN.
5. **Duplicate "Proven Results" image** on location pages: `2026/06` and `2026/08` `Google-ads-result.png`.
6. **Alt text.** Several alts describe a different image, and many images have empty alt. Both are kept unchanged until you approve edits.
7. **One portfolio entry** has a logo but no screenshot.
8. **Noida content on the Delhi page,** kept as published.
9. **`Website-video.gif`.** An MP4/WebM version would load faster.

## 6. Still needed from you

1. Homepage H1 decision.
2. Contact form keys (`RESEND_API_KEY` + `CONTACT_FROM_EMAIL`, or `CONTACT_WEBHOOK_URL`).
3. Image origin for production (keep WordPress as media origin, or copy the uploads folder).
4. Review `/insights/` against `/blog/`, and the new case-study pages against the live ones.
5. Approval to correct mismatched or empty alt text.

# ScaleAcres complete website redesign: migration, build and testing report

**Staging only.** Nothing was deployed. The live WordPress site, hosting, domain and DNS were not touched; scaleacres.com was only **read** (public pages fetched once to capture them). Every staging and preview host serves `noindex`.

## 1. Approach: change the design, not the content

1. **Audit (Phase 1).**
   - `scripts/legacy-extract.mjs` opened every live URL in a real browser.
   - It recorded the metadata (title, meta description, robots, canonical, Open Graph, Twitter, JSON-LD, breadcrumbs, article dates and author).
   - It recorded the complete main content as ordered blocks: headings with their original tag, paragraphs, lists, tables, images with their src and alt text, buttons, FAQs, videos and forms.
   - Inline links and emphasis were kept verbatim. The result is stored in `content/legacy/` and nothing in it is edited by hand.
2. **Design system (Phase 2).**
   - The approved homepage tokens are used everywhere: Royal, Royal Deep, Sky, Brand Black, Royal Navy, Graphite and Mist.
   - Typography is Outfit, with the same editorial scale, labels and buttons as the homepage.
   - The header and footer are the approved ones. The menu now carries the live service, city and country links, and the footer carries the live Quick Links, Top Cities, Country, legal links, address and GST number. This keeps the site-wide internal linking.
3. **Pages (Phases 3–6).**
   - One catch-all route (`app/[...slug]`) generates **every live URL at its exact path**, with its live metadata, emitted verbatim.
   - `components/legacy/` holds the templates. They decide presentation only:

| Template | Used for | Layout |
|---|---|---|
| Main informational page | About, Our Team, Careers | Dark hero band, then alternating white/Mist bands; stats on Royal Navy |
| Service overview | Our Services | Band layout; service groups as an editorial grid |
| Individual service page | 7 service pages | Hero (with the live enquiry form), editorial rows/grids, client logo wall, testimonial cards, step cards, FAQ accordion |
| Location SEO landing page | 89 city/country pages | Same system; each page keeps its own unique copy, headings, FAQs and links |
| Portfolio listing | Our Work | Image-led gallery of the live portfolio images |
| Case study page | Case Studies, Yugen, One Goa | Band layout with project imagery |
| Blog listing / archive | Blog, 9 categories, 17 tags, 2 authors, 93 date archives | Editorial card grid (image, title, excerpt, author/date, read more) |
| Blog article | 96 posts | Dark header (breadcrumb, category, H1, author, date), featured image, 46 rem reading column |
| Contact page | Contact Us | Live contact details plus the working enquiry form |
| Legal page | Privacy Policy, Terms & Conditions | Band layout, no closing CTA |

   - Heading tags and text are never changed; only their visual size is set by role.
   - Each page's first form block becomes the site's working enquiry form; later ones link to it.
   - Elementor popup buttons (which only work inside WordPress) now open the page's enquiry form.
4. **Creative Studio.** It has exactly three tabs: AI VIDEOS (7), SOCIAL MEDIA VIDEOS (10) and AD VIDEOS (22). These are the real ScaleAcres YouTube Shorts from the live site's video tabs. The player loads only when Play is pressed.

## 2. Results

| | Result |
|---|---|
| URLs discovered | **334** (209 from sitemaps + 125 found only through internal links) |
| Live pages recreated at the same path | **331** (+ approved homepage) |
| Live 404 URLs (not recreated) | 2: `/casestudy/our-case-one-goa/`, `/how-ai-chatbots-can-qualify-leads-on-your-real-estate-website/` |
| SEO parity (`seo-parity-report.md`) | CONTENT 331 PASS · META 332 PASS · LINK 330 PASS / 2 REVIEW · SEO 331 PASS / 1 REVIEW (homepage) · 0 FAILED |
| Broken internal links in the new build | 1 inside a blog article. It is broken on the live site too, and the article text is kept as written |
| Mobile (390 px), all 344 generated pages | 0 horizontal overflow, 0 page errors |
| Functional checks (desktop + mobile) | 16/16 pass: menu with locations, Escape closes, FAQ open/close and server-rendered answers, contact form validation, contact details, article author/date, Creative Studio tabs |
| Homepage checks | 46/46 pass (unchanged approved homepage) |

**What the parity check compares, per URL:**
- the URL exists
- title, meta description, canonical and robots
- H1, H2 and H3 (as sets of text)
- main-content wording: at least 99.5% of the captured words must render
- every image src + alt pair
- every internal link from the live main content
- each JSON-LD block, byte for byte

**Metadata preservation details:**
- Canonicals are emitted exactly as live, including the 9 that have no trailing slash.
- The 93 date archives keep their live `noindex`.
- `sitemap.xml` lists every indexable, self-canonical live URL. `/sitemap_index.xml`, the Yoast URL known to Search Console, still exists and points to it.

## 3. Missing, unverified or needing your decision

| Item | Status |
|---|---|
| **Homepage content** | The approved homepage replaces the live homepage body. Title and meta description are identical. Live homepage H2s no longer on the homepage: Real Estate Success, Loved and Trusted by, Real Estate Marketing Case Studies, Why ScaleAcres ?, Solutions We Provide, Client Success Stories, Our Creative Magic, Awards & Recognitions, Proud Moment, Website Design, Real Estate Videos That Drive Growth, Everything You Need to Know !. **Your decision.** |
| **Homepage H1** | Live: "India’s Real Estate Marketing Specialist". New hero: "We Don't Create Brands. We Create Market Leaders." **Your decision.** |
| Pages whose capture covered under 95% of their visible words | /blog/, /careers/, /contact-us/, /our-team/, /our-work/, /real-estate-web-development/, /yugen-case-study/, /blog/casestudy/our-case-one-goa/, 2 menu fragments. The gap is form labels, sliders and widget chrome. Please eye-check these pages. |
| Blog pagination | /blog/ lists the posts shown on its first page. No `/blog/page/N/` URLs were found in sitemaps or links. **UNVERIFIED** whether the live site paginates. |
| Broken live link | `/casestudy/our-case-one-goa/` (404 on live) is used on 64 pages. The case-study card now points to the working `/blog/casestudy/our-case-one-goa/`. |
| Images | They keep their exact `/wp-content/uploads/...` paths and alt text. In the preview they load from scaleacres.com. For production, either keep WordPress as the media origin (`WORDPRESS_ORIGIN`, already proxied by `next.config.ts`) or copy the uploads folder. |
| New URLs not on the live site | /creative-studio/, /insights/, /services/{search-engine-optimization, social-media-marketing, video-creative-production, ecommerce-solutions, custom-applications-software}/, /case-studies/{yugen-goa, one-goa, prominent-realty, hometrust-realty}/. Please review /insights/ against /blog/, and the new case-study pages against the live case studies (possible duplication). |
| Contact form | Validation, honeypot, time trap and rate limit are in place. It shows success only after the server confirms. Needs `RESEND_API_KEY` + `CONTACT_FROM_EMAIL` (or `CONTACT_WEBHOOK_URL`) in production. In the static preview it reports honestly that sending is not configured. |
| Testimonial MP4s, showreel films | Still on the Higgsfield CDN (from the homepage milestone). |
| Visual review with live images | My build environment cannot load scaleacres.com images, so the visual review here covered layout and typography; images could not be checked. In the static preview they load in your browser. **Please review image-heavy pages.** |

## 4. Production launch checklist (not done; awaiting approval)
1. Approve the design and make the homepage H1/content decisions.
2. Configure the contact form environment variables.
3. Decide the image origin (WordPress origin or copied uploads).
4. Re-run `scripts/legacy-extract.mjs` just before launch, so posts published after 19 Oct 2026 are included.
5. Re-run `python3 scripts/seo-parity.py`.
6. Deploy behind a staging host, run the parity check against it, then switch DNS. **DNS is not touched until you approve.**

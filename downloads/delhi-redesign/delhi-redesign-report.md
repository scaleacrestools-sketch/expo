# Real Estate Marketing Delhi: Stage A redesign report

**Page:** `/real-estate-marketing-delhi/`
**Status:** Stage A complete. **Waiting for your approval (Stage B).** No other page uses the new system yet.
**Staging only.** WordPress, hosting, DNS and production SEO settings were not touched. The preview ZIP serves `X-Robots-Tag: noindex, nofollow` on every URL.

## Files in this folder

| File | What it is |
|---|---|
| `delhi-after-desktop.jpg` | Full-page desktop screenshot of the redesign (1440 px wide), with the real live images loaded |
| `delhi-after-mobile.jpg` | Full-page mobile screenshot of the redesign (390 px wide) |
| `delhi-before-after.jpg` | Before/after comparison: the rejected design next to the redesign, section by section |
| `scaleacres-delhi-redesign-static-preview.zip` | Netlify drag-and-drop preview. Drop the folder on Netlify, then open `/real-estate-marketing-delhi/` |
| `scaleacres-delhi-redesign-source.zip` | Next.js source. `npm ci && npm run build:static-preview` rebuilds the preview |

## 1. Visual audit of the rejected page

I could not see the three screenshots you attached, so this audit was made from the rejected build captured with all live images loaded.

| Problem | What was wrong |
|---|---|
| Weak hierarchy | One generic band template stacked the content top to bottom. The H1 was no bigger than the section titles, and every section opened the same way. |
| Excessive length | The page was **63,401 px tall on desktop and 77,159 px on mobile**. Nothing was grouped, so long image lists ran one after another. |
| Poor image treatment | 14 branding images, 19 website screenshots and 5 creatives were shown in uniform small grids with no lead image. The 2,560 px-tall website screenshots were either cropped at random or shown at full length. |
| Logo handling | Client logos sat in plain grey cells of uneven size. Logos and photos were mixed in the same grids. |
| Generic cards | Testimonials, process stages and reasons were all the same white card. Nothing was emphasised. |
| Repetitive rhythm | White and Mist bands simply alternated. The page had none of the homepage's dark showcase sections or its editorial split layouts. |
| Hero | Small heading, no imagery, form card out of style with the homepage. |
| Reading width | Several SEO paragraphs ran across the full container width. |

## 2. What the redesign does

The page is now composed from the homepage design system: Outfit, the official palette, the `container-x` gutters, the homepage's eyebrow labels, buttons, scroll reveals and black footer. Each section gets a layout matched to what its content actually is, instead of one band template for everything.

| # | Live section (content unchanged) | New treatment |
|---|---|---|
| 1 | H1 "Real Estate Digital Marketing Agency in Delhi" + sub-title + Book a call + enquiry form | Dark hero. The original H1 is set at display size. A breadcrumb and a Royal Blue label sit above it. The page's own Delhi NCR image is used as a dimmed backdrop. The live enquiry form is in a dark glass card. |
| 2 | "We have been growing 200+ consumer brands globally." + 25 client logos | Bordered logo wall with equal tiles, greyscale, colour on hover |
| 3 | Client stories (6 founders) | Scrolling rail of portrait cards (photo, name, company logo), with previous/next buttons. Every card stays in the HTML. |
| 4 | "Converting Curious Visitors…" + 1500+ stat | Editorial statement: large heading on the left; lead text, stat and button on the right |
| 5 | "We Don't Create Brands. We Create Market Leaders." + 14 branding images | Dark showcase: one large lead image with two beside it, then the rest in rows that always fill edge to edge |
| 6 | Noida section with M3M project cards | Editorial split with a dark card panel for the project cards |
| 7 | End-to-end funnel (3 stages) | Funnel: intro, then three stage cards with large outline numbers, the live stage images and lists |
| 8 | "Proven Results That Speak" + 4 result screenshots | Screenshots in browser frames, two by two |
| 9 | "Website Design" + 19 website projects | Dark portfolio. The first two projects lead large. The rest follow in a three-column grid (two-up on phones) in a tall frame; hovering scrolls the screenshot from top to bottom. Each card keeps its live logo and category/platform line. |
| 10 | "Our Successful Delhi Projects" logo collage | Full-width collage (desktop and mobile artwork as on live) |
| 11 | Awards & Recognitions | Image-and-content split |
| 12 | Our Culture of Growth | Sticky text column beside a photo grid |
| 13 | "Grow Faster…" (H3) + 2 SEO paragraphs | Editorial split; paragraphs kept to a readable column |
| 14 | "Why Work with Our Real Estate Marketing Agency in South Delhi?" | Dark numbered rows (01 to 03) with a sticky title |
| 15 | "Why Digital Marketing for Real Estate in Delhi NCR Works" | Mirrored split |
| 16 | "Our Creative Magic" + 5 creatives | Staggered portrait strip on black. Wide artwork is shown whole, not cropped. |
| 17 | FAQ (6 questions) | Two-column FAQ. Questions use native details/summary; every answer is in the HTML and the first one is open. |
| 18 | — | Homepage closing CTA, then the official black footer |

**Before → after:** desktop page height **63,401 → 26,249 px**, mobile **77,159 → 32,145 px**, with all of the same content still on the page.

## 3. Content-unchanged confirmation

This was checked with `scripts/seo-parity.py`, which compares the new build page by page against the verbatim capture of the live page.

| Check | Live | New | Result |
|---|---|---|---|
| Title | Real Estate Digital Marketing Agency in Delhi NCR | identical | PASS |
| Meta description | "Top digital marketing company for real estate in Delhi NCR…" | identical | PASS |
| Canonical | https://scaleacres.com/real-estate-marketing-delhi/ | identical | PASS |
| Robots meta | index, follow, max-image-preview:large… | identical | PASS |
| H1 | 1 | 1 (same text) | PASS |
| H2 | 23 | 23 (same text) | PASS |
| H3 | 1 | 1 (same text) | PASS |
| Main-content words | 100% of captured words | 100% | PASS |
| Images (src + alt pairs) | 138 | 138 | PASS |
| Internal links in main content | 1 | 1 | PASS |
| JSON-LD | 1 block | byte-identical | PASS |

**Not changed:**
- No text was rewritten, shortened, removed or hidden.
- No SEO content was placed inside a collapsed element only to shorten the page. The FAQ uses an accordion, as it does on the live page.
- No alt text was changed.
- Headings keep their original tags; only their visual size changed.

**Capture coverage note:** the live-page capture recorded 96.6% of the visible words on scaleacres.com. The remaining 3.4% is form labels and widget chrome, not SEO copy.

**Rest of the site:** every page still passes the full-site parity check (CONTENT 331 PASS, META 332 PASS, LINK 330 PASS / 2 REVIEW, SEO 331 PASS / 1 REVIEW for the homepage, 0 FAILED).

## 4. SEO preservation status

**Preserved for this page:** URL, title, description, canonical, robots, H1–H3, all 138 image src/alt pairs, internal links and JSON-LD. Comparison is against the live-page capture, as above.

The preview is staging only: the whole preview is `noindex, nofollow` through `_headers`.

## 5. Missing or weak original assets

Nothing was invented to fill these gaps, and no unrelated image is presented as client work.

| # | Asset | Why it matters |
|---|---|---|
| 1 | **Project names for the 19 website screenshots** | The live page gives only a logo plus a category/platform line, so no names were added. Send approved project names if you want them shown. |
| 2 | **Dedicated Delhi hero photograph or video** | The hero uses the page's own illustrative Delhi NCR image as a dimmed backdrop. A real Delhi campaign photo or short video would be stronger. |
| 3 | **Full-resolution website screenshots** | The live screenshots are WordPress "-scaled" files (about 700 × 2,560 px). They look sharp at normal size but slightly soft in the two large lead cards on high-density screens. |
| 4 | **Client testimonial videos** | The client-stories section on the live page has photos only. The homepage testimonial MP4s are still hosted on the Higgsfield CDN. |
| 5 | **Distinct "Proven Results" screenshot** | `2026/06/Google-ads-result.png` and `2026/08/Google-ads-result.png` look like the same image. Both are kept as on live. |
| 6 | **Alt text that matches the branding images** | Several live alt texts describe a different image (for example, a brochure mockup labelled "Outdoor advertising and hoarding design"), and 48 of 138 images have empty alt. Both are kept unchanged pending your approval. The mismatched alts are not shown as visible captions, so visitors don't see wrong labels. |
| 7 | **Screenshot for one portfolio entry** | One project on the live page has a logo but no screenshot. It is shown as a small logo chip after the grid. |
| 8 | **Noida content on the Delhi page** | Section 6 ("Real Estate Digital Marketing in Noida – Why It Works", M3M projects) is Noida content on the live Delhi page. It is kept as is; you may want to review it. |
| 9 | **"Website-video" animation** | `Website-video.gif` is a GIF. An MP4/WebM version would load faster. |

## 6. Testing

- **Desktop 1440 and mobile 390:** 0 horizontal overflow, 0 page errors.
- **Page checks:** the enquiry form renders, all 6 FAQ answers are present, and the H1, title and canonical are correct. This was checked from the extracted preview ZIP.
- **Images:** full-page captures were taken with every live image loaded (0 unloaded).
- **Source ZIP:** extracted, typechecked and built cleanly.
- **Lint and TypeScript:** clean.

## 7. Next step: your decision

Stage B is your call. When you approve this page (or send changes), I will apply the same system across the other internal pages in Stage C. Each page type will get its own composition (service, location, portfolio, case study, blog, contact, legal), not one identical template. Nothing else has been changed yet.

# ScaleAcres homepage: Neiden-inspired direction (for review)

This is one new homepage concept, built after inspecting https://neiden.framer.media/ in a real browser on desktop and mobile. I reviewed:
- the intro;
- 64 desktop scroll positions;
- the mobile layout;
- the menu.

What changed:
- **Homepage only:** internal pages keep their current header and footer.
- **Staging only:** the preview is `noindex`. Production, WordPress, DNS and hosting are untouched.
- **Previous homepage kept:** it is recoverable from git `1a7a591a`, and its components remain unchanged in `components/home/`.

## Files

| File | What it is |
|---|---|
| `scaleacres-neiden-homepage-desktop.mp4` | 1440 × 900, 83 s real-browser recording. It shows the hero intro, the menu opening and closing, every service with hover, the expanding website previews, the video tabs, the branding cursor preview, selected work, the process cards, the testimonial switcher, contact and the footer. |
| `scaleacres-neiden-homepage-mobile.mp4` | 390 × 844, 67 s recording of the same journey on a phone. |
| `scaleacres-neiden-homepage-desktop-fullpage.jpg` | Full page, 1440 × 20796. |
| `scaleacres-neiden-homepage-mobile-fullpage.jpg` | Full page, 390 px at 2× (780 × 45320). |
| `scaleacres-neiden-homepage-netlify-preview.zip` | Static build. Drag it onto Netlify Drop. |
| `scaleacres-neiden-homepage-source.zip` | Next.js source. Run `npm ci && npm run build:static-preview`. |

## What was taken from Neiden, adapted to ScaleAcres

| Neiden principle | ScaleAcres implementation |
|---|---|
| Hairline column grid across every section | 3 columns with 1 px rules: 2 on tablet, edges only on phones. Light sections use Mist, dark sections use Brand Black. |
| Minimal header | Official logo on the left and a single **Menu** button on the far right. No links in the header. The bar tucks away when you scroll down; the Menu button stays. |
| Menu panel over a blurred page | A Brand Black panel opens with a wipe. It holds numbered navigation links that rise in turn, contact details and a Start a project button. Esc, Close or the overlay closes it, and focus stays inside the panel while it is open. |
| Oversized wordmark hero over a monochrome texture | "Built to stand out. / Designed to scale." set edge to edge, with the second line set right and "scale." in Sky. Behind it sits a monochrome, grained backdrop with a discipline row, a Royal CTA bar and a client-logo strip. |
| Statement that fills in word by word as you scroll | "Who we are", with two inline work images, followed by facts and the portfolio overview. |
| Sticky "What We Build" beside a stack of disciplines | All 8 ScaleAcres services. Each shows its own work, description, inclusions and service link. |
| "Case studies" heading marquee, then large reveals | "Website design." marquee, then three live sites in browser frames that widen as they scroll in, then a "More websites" list. |
| "Highlights" index with hover preview | Branding index with a preview that follows the cursor (thumbnails on phones). |
| "From brief to launch" cards | Four ScaleAcres steps; the current step turns Brand Black as you scroll. |
| "True stories" and the logo wall | Four genuine video testimonials, plus the client logo wall from scaleacres.com. |
| "Let's Talk" and the giant footer wordmark | "Let's talk." with real contact details, a strip of genuine work, and the footer with the full name set edge to edge. |

The type is Outfit only:
- **Display:** weight 600, tracked −0.045 to −0.06 em.
- **Labels:** 14 px bold uppercase, as in Neiden but never smaller than 14 px.
- **Body:** 16–20 px.

The palette is the seven brand colours only, with Royal as the single accent and Sky used sparingly on dark backgrounds.

**Not copied:** Neiden's logo, text, photography, statistics, pricing, team or client names.

## Media: every item is genuine and relevant

- **Websites:** 2× first-screen captures of the live client sites:
  - SID Realtech;
  - Subata Realty (the ScaleAcres build);
  - Imperial Sky Realty;
  - Research Capital;
  - Finsckool;
  - Jina Cosmetics;
  - MW&B.
- **Services, each with its own work:**
  - **Websites:** Imperial Sky on desktop and Subata on a phone.
  - **SEO:** search-ranking results.
  - **Performance:** a TRG ad creative and Meta Ads results.
  - **Branding:** the SID brand guideline and the Ellington 86 hoarding.
  - **Social:** JBBR and Intech creatives.
  - **Video:** an ad film and an AI video, each tagged.
  - **Ecommerce:** the MW&B store on desktop and phone.
  - **Software:** the Finsckool platform on desktop and phone.
- **Videos:** 6 per category from the ScaleAcres YouTube channel. AI videos are tagged "AI" and the AI tab carries an "AI-generated" label.
- **Hero backdrop:** a monochrome still from a ScaleAcres concept film, labelled on the page.

**Not available, so not invented.** Each stand-in is labelled on the page, under the service's images:
1. **Custom Applications:** there are no genuine CRM, dashboard or back-office screens. The page says: "Shown: the Finsckool learning platform, built by ScaleAcres. CRM and dashboard projects to be added when available."
2. **Performance Marketing:** there are no ad-platform previews (feed or story mock-ups). The page says: "Shown: a TRG campaign creative and Meta Ads results from ScaleAcres campaigns. Ad-platform previews to be added."
3. There is no founding year, team photography or project statistics, so none appear on the page.

## Video playback

These hosts are blocked in this build environment:
- YouTube;
- the testimonial CDN (`d2ol7oe51mr4n9.cloudfront.net`).

The recordings therefore show the video thumbnails and the dialog opening, but not playback. I checked every source from an environment that can reach them:
- All 25 YouTube videos used on the page resolve (oEmbed 200), and the youtube-nocookie embed responds 200.
- All 4 testimonial videos return HTTP 200 `video/mp4`.

On Netlify or any normal network, they play when clicked.

## Performance and checks

Measured on a throttled connection (10 Mbps, 40 ms latency; 4× CPU slowdown on mobile):

| Device | LCP | CLS |
|---|---|---|
| Desktop | 0.77 s | 0 |
| Mobile | 0.71 s | 0 |

How the page stays fast:
- Images are WebP, with AVIF for the hero, and every image has a `srcset` and explicit dimensions.
- Media below the fold loads lazily, and branding previews load on first hover.
- Videos load only when a visitor presses Play.

**Automated checks:** 63 of 63 pass on desktop, tablet, mobile, reduced motion and keyboard, both on the local build and on the extracted Netlify ZIP. They cover:
- the header containing only the logo and Menu;
- the menu opening, holding focus and closing with Esc;
- section order;
- 8 services with media;
- every reveal completing;
- images loading in WebP or AVIF;
- the video tabs and dialog;
- the testimonial switcher;
- no horizontal overflow;
- no console errors;
- no 4xx responses;
- reduced motion.

The source ZIP builds cleanly from a fresh extract.

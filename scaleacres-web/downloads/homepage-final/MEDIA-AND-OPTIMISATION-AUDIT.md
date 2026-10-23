# ScaleAcres homepage: corrections, media audit and optimisation

This is a staging preview only. Search engines are kept out by two measures:
- `X-Robots-Tag: noindex, nofollow` in `_headers`;
- `robots.txt` set to `Disallow: /`.

Nothing has been published to production. Live WordPress, DNS and hosting are untouched, and no Higgsfield credits were used.

## What changed in this round

| Request | Change |
|---|---|
| 1. Restore the earlier hero | Back to the approved Arpeggio-style composition (commit `b9c71f6e`): the monochrome light-sweep still, the staircase reveal, letters rising, the crosshair grid, pointer depth, and the frame contracting on scroll. The rejected full-screen montage film has been removed from the site. Beside the headline, genuine work now opens one piece at a time, each with its own display line: *Websites that sell* (SID Realtech site), *Brands people remember* (SID brand system), *Content that connects* (JBBR, SID, TRG creatives), *Campaigns that perform* (Meta and Google Ads results), *Films that move buyers* (ScaleAcres ad films). |
| Hero typography | The headline is larger and bold (fluid sizing, about 7.25 rem maximum), with tighter tracking and leading. The supporting copy is white at 1.06–1.5 rem. The wordmark is sized to fit the frame and is never cropped (checked in QA at 1440, 1280 and 390 px). Readability gradients and a Royal glow sit behind the work. |
| Hero speed | The intro finishes in about 0.9 s (it took about 1.6 s before) and the first piece of work appears at 0.42 s. Each piece shows for 3.2 s with a 0.65 s transition, and there are no blank frames. Visitors can pause the showcase or jump to any piece. |
| 2. Faster motion | Scroll animations follow the scroll more closely (lag cut from 1.0–1.2 to 0.3–0.5), and their trigger ranges are shorter. Headline reveals take 0.8 s (was 1.25 s), with a 0.04 s stagger (was 0.06). The hero scroll runs 150 svh (was 175) and the "Who we are" section 160–200 svh (was 200–270). The branding strip follows the scroll more closely. Website switching takes 0.7 s (was 1.1 s) and auto-advances every 4.5 s (was 7 s). Video cards appear in 0.5 s (was 0.9 s). |
| 3. Header | On the homepage, the logo sits on the left. On the right are the About, Services, Our Work and Creative Studio links, a "Let's talk" button and the menu button. Phones show the logo and the menu button. QA confirms the menu sits at the right edge and above the H1. Internal pages keep their current header until you approve this one. |
| 4. Website Design | The tall, blurry full-page captures and the "Full page" overlay are gone. There is now one 16:10 browser frame showing the live site's first screen. Each capture is 1600 × 1000, taken from the real client site in a browser at 1440 × 900. The frame is cropped from the top, never stretched or scrolled, and projects change with a 0.7 s wipe. Project names are bold, at 1.5–2.1 rem. |
| 5. Service media | Every card shows its own genuine work (see below), and each has a hover effect: devices separate, posters fan out, the pair spreads and the caption turns Royal. |
| 6. Typography | All section titles use one bold, fluid display scale, `clamp(2.6rem, 0.9rem + 6vw, 8rem)` at weight 700. Service titles are bold, fluid and balanced. On the homepage, the minimum is 0.875 rem for labels and 0.9375 rem for notes. The font is Outfit throughout. |
| 7. Colour | Every homepage colour is one of the seven brand colours or a tint of them. Secondary text, divider and surface colours are now mixed from Royal Navy, Brand Black and Mist, and no longer use off-brand greys. |

## Service media (relevance review)

| Service | Media now | Source |
|---|---|---|
| Website Design & Development | Subata Realty website, desktop and mobile | Live site capture |
| Search Engine Optimization | Search rankings from ScaleAcres SEO campaigns | scaleacres.com |
| Performance Marketing | TRG ad creative beside Meta Ads results | scaleacres.com |
| Branding & Creative Design | SID Realtech brand identity system | scaleacres.com |
| Social Media Marketing | JBBR Group, SID Realtech and Intech Developers creatives | scaleacres.com |
| Video & Creative Production | Ad film, social video and AI video, each tagged; the AI video is labelled | ScaleAcres YouTube |
| Ecommerce Solutions | MW&B online store, desktop and mobile | Live site capture |
| Custom Applications & Software | Finsckool learning platform, desktop and mobile | Live site capture |

No architecture image is reused, and no concept footage appears in any service.

**Not available** (reported rather than invented):
1. No genuine CRM, dashboard or back-office screens exist for Custom Applications. Finsckool, a real platform ScaleAcres built, stands in until you supply screens.
2. No ad-platform previews (feed or story mock-ups) exist for Performance Marketing. The genuine TRG campaign creative and the real results screenshots are used instead.

## Website Design: project list

Six sites, each checked against the ScaleAcres portfolio capture before use:
1. SID Realtech
2. Subata Realty (the ScaleAcres build, at subata-x-web.vercel.app)
3. Imperial Sky Realty
4. Research Capital
5. Finsckool
6. Jina Cosmetics

Left out, and why:
- **JBBR Group:** its live domain can't be verified (the candidates are parked or blocked).
- **Let's Movin:** the live site currently shows PHP warnings at the top.
- **Nirvana Grand:** the domain now belongs to an unrelated hotel.
- **Intech Developers:** the domain redirects to another company.

## Remaining media notes

- **Hero backdrop:** a monochrome frame from ScaleAcres' AI concept film "Light sweep", used as abstract atmosphere. It is never presented as client work.
- **Image resolution:** portfolio slides (924 px) and YouTube covers (540 px) come from scaleacres.com and YouTube at those sizes. Larger originals would sharpen the branding strip and video rails.
- **Live captures:** some still show the client's own WhatsApp button, as on the live site.
- **Load on demand:** YouTube players and testimonial videos load only when a visitor presses Play. No third-party images or video load with the page (checked in QA).

## Performance (local throttled run: 10 Mbps, 40 ms latency; 4× CPU slowdown on mobile)

| Device | LCP | FCP | CLS |
|---|---|---|---|
| Desktop | 0.84–0.89 s | 0.84–0.89 s | 0 |
| Mobile | 1.0–1.5 s | 0.81–0.86 s | 0 |

How the hero stays fast:
- Hero images are WebP copies sized for display, about 460 KB in total (was about 1.1 MB).
- Only the current and next pieces load.
- The first piece is in the HTML and starts its reveal in CSS, so it doesn't wait for JavaScript.
- The website previews load lazily.

## Checks

- 75 of 75 automated checks pass on the local build and again on the extracted Netlify ZIP, at desktop, mobile, reduced motion and keyboard.
- The checks cover:
  - section order;
  - the eight services;
  - the hero showcase (five genuine scenes);
  - the pause control;
  - the menu position;
  - the wordmark fitting the frame;
  - website switching;
  - video tabs and dialogs;
  - no outside media requests;
  - no 4xx errors;
  - no page errors;
  - no horizontal overflow.
- Under reduced motion there is no intro mask, no cycling, no sticky stage and no video playback.

## Files

| File | What it is |
|---|---|
| `scaleacres-full-homepage-desktop-preview.mp4` | 1440 × 900, 114 s real-browser recording. Covers the full hero cycle, every service card with hover, five project switches, video tabs, branding, work, clients, testimonials, CTA and footer. |
| `scaleacres-full-homepage-mobile-preview.mp4` | 390 × 844, 94 s recording. |
| `scaleacres-hero-desktop-animation.mp4` | The first 18 s of the desktop recording: the hero intro and all five pieces of work. |
| `scaleacres-full-homepage-desktop.jpg` | Full-page screenshot, 1440 × 21755. |
| `scaleacres-full-homepage-mobile.jpg` | Full-page screenshot, 780 × 49390 (390 px at 2×). |
| `scaleacres-homepage-netlify-preview.zip` | Drag onto Netlify Drop. |
| `scaleacres-homepage-source.zip` | The `scaleacres-web` source. Run `npm ci && npm run build:static-preview`. |

The full-page screenshots use reduced motion so the sticky and pinned sections lie flat. The recordings use full motion.

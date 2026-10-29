# ScaleAcres internal pages: v3, hero redesign

Every internal page now opens with its own hero visual, and every visual is genuine ScaleAcres work. The design system is unchanged (Outfit, Brand Black, Royal accents, header, black footer).

## Files

| File | What it is |
| --- | --- |
| `internal-heroes-1.jpg`, `internal-heroes-2.jpg` | Overview of 18 page heroes at 1440 × 900. |
| `scaleacres-internal-pages-v3-desktop-1440x900.mp4` | Desktop walkthrough, 2 min 19 s, 13 pages. |
| `scaleacres-internal-pages-v3-mobile-390x844.mp4` | Mobile walkthrough, 2 min 30 s, 14 pages. |
| `scaleacres-internal-pages-v3-screenshots.zip` | Full-page screenshots: 28 pages on desktop, 28 on mobile, 10 on tablet. |
| `scaleacres-internal-pages-v3-preview.zip` | Staging preview. Every page is noindex. |
| `scaleacres-internal-pages-v3-source.zip` | Next.js source. |

## What was fixed

### 1. Hero banners
Every hero is now split: the headline on the left and a page-specific composition on the right, all above the fold. The layers drift gently as you scroll on desktop, and the motion switches off for visitors who prefer reduced motion.

| Page | Hero visual (all genuine ScaleAcres material) |
| --- | --- |
| About us | Delhi studio photo, the founders, and the JBBR Group brand-identity cover |
| Our team | Montage of the celebration, studio, office and founders photos |
| Our services | The ScaleAcres motion reel, playing, plus chips for each capability |
| Our work | Covers for JBBR Group, TRG, SID Realtech and Intech Developers |
| Case studies | Yugen Infra results card, One Goa render, and the live campaign dashboard |
| Careers | Celebration, team-spirit and studio-leadership photos |
| Blog, Insights and category archives | The latest featured article plus two more, from the real posts |
| Creative studio | Playable posters: one ad film, one social video, one AI video |
| Contact | Studio photo plus a map card (links to the map section); the contact details sit beside them |
| Website design | SID Realtech website playing its scroll capture in a browser frame, plus the Subata Realty mobile site |
| SEO | SEO work, plus first-page ranking and Google search captures |
| PPC, Lead generation | Performance work, plus Google Ads captures and the TRG The Mall campaign creative |
| Facebook ads | Performance work, plus Meta Ads results and the TRG The Mall campaign creative |
| Branding | Brand work, the SID Realtech Ellington 86 hoarding, and the JBBR cover |
| Social media | Social work, plus JBBR and Intech campaign creatives |
| Video production | Three playable ScaleAcres film posters |
| Ecommerce | MW&B store on desktop and mobile |
| Custom applications | Finsckool platform on desktop and mobile |
| Location pages (92) | Montage of four service visuals: websites, performance, branding, social |
| Case-study details | Client logo, the published results card and the result figure |

### 2. Video presentation
Every video tile shows its real poster. The player dialog shows that poster with a loading spinner until the video loads, and it has a "Watch on YouTube / Vimeo" link as a fallback, so it is never an empty black box.

The black frame in the v2 walkthrough happened because our test machine cannot reach YouTube or Vimeo. That is also why videos are not played in these recordings. I confirmed separately that all 28 YouTube and 8 Vimeo videos used on these pages load in an embedded player. The dialogs were tested in Chromium: they open, request the correct video and close.

### 3. Spacing and typography
- Hero headlines resize to fit their half-width column.
- Leads are larger and higher-contrast.
- The live site's manual line breaks no longer break sentences awkwardly. One case that joined two words together ("growthsolutions") is fixed.
- The blog hero list stacks on phones.

### 4. Bug fixed
On phones, the website grid on Our Work was wider than the screen, which forced the page to zoom out. It now fits.

## Browser verification (Chromium, actually run)

- **Layout:** 28 pages at desktop (1440), tablet (820) and mobile (390). None has horizontal overflow, broken local images or console errors.
- **Links:** all 170 internal links on those pages return 200. Menu and footer links work, and Map goes to `/contact-us/#map`.
- **Video dialogs:** checked on Creative studio, Our Work, the Yugen case study and the Video service page.
- **Screenshots:** every one was captured from the rendered pages.

## Remaining asset gaps
- **Team photos:** professional headshots would lift the Team page; some portraits are phone photos.
- **Case-study images:** the Yugen and One Goa results cards are only 536 px wide, so they are shown small. Higher-resolution originals would help.
- **Two case studies:** Prominent Realty and Hometrust Realty still need material.
- **Your confirmation needed** (open from v2):
  - case-study figures;
  - team size and years;
  - the studio address.

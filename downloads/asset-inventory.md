# Asset inventory — what exists, what is used, what to upload

Audit date: 16 Oct 2026. Every file in the project and every media reference was checked.

## 1. Assets that exist and are in use

| Asset | Type | Where it is used | Status |
|---|---|---|---|
| Showreel clip 01 "Blue-hour tower" (16:9 + 9:16) | AI video, Higgsfield | Hero showreel, Real Estate background, Studio → AI Videos | Streams from Higgsfield's CDN |
| Showreel clip 02 "Identity systems" (16:9 + 9:16) | AI video | Hero, About (portrait), Services 04, Studio | Streams from CDN |
| Showreel clip 03 "Digital experiences" | AI video | Hero, Services 01, Studio | Streams from CDN |
| Showreel clip 04 "Performance in motion" | AI video | Hero, Services 03, Studio | Streams from CDN |
| Showreel clip 05 "Studio production" | AI video | Hero, About (landscape), Services 06, Studio | Streams from CDN |
| Showreel clip 06 "Light sweep" | AI video | Hero, Contact background, Studio | Streams from CDN |
| `public/brand/scaleacres-logo.png` / `.webp` | **Official logo** (supplied file, trimmed only, 884 × 277) | Light grounds, Organization schema logo | In use |
| `public/brand/scaleacres-logo-white.png` / `.webp` | Official logo, black artwork recoloured white (blue symbol and shapes untouched) | Header, menu, footer | In use |
| `app/icon.png`, `app/apple-icon.png` | Symbol from the official logo on white | Favicon, home-screen icon | In use |

The CDN addresses and Higgsfield job IDs are in `content/media.ts`. All of these are concept films commissioned by ScaleAcres. None of them is presented as client work.

## 2. Assets that do NOT exist in the project yet

Upload them on GitHub into the listed path on branch `claude/funny-pascal-2vnisf` (**Add file → Upload files**), or attach them in the chat. Keep exactly these filenames, and the code picks them up after a one-line switch.

### Brand (recommended)
The supplied logo is 884 px wide, which is sharp at header size on retina screens. An **SVG** or ≥ 2000 px PNG of the same artwork (plus an official reversed version, if one exists) would make the footer and social-share uses razor-sharp. Same filenames, then update `width`/`height` in `content/brand.ts`.

### Hero video (recommended before launch)
The clips play today from Higgsfield's CDN. For production, download the 12 clips from Higgsfield, rename them as listed in `docs/higgsfield-showreel-brief.md`, and either run `npm run showreel -- ./clips` or upload:
| Filename | Spec | Section |
|---|---|---|
| `public/videos/showreel.mp4` + `showreel.webm` | 1920 × 1080, 15–20 s loop, no audio, ≤ 6 MB | Hero (desktop) |
| `public/videos/showreel-portrait.mp4` + `.webm` | 1080 × 1920, ≤ 4 MB | Hero (mobile) |
| `public/images/hero-poster.jpg` | 1920 × 1080, first frame | Hero poster / reduced motion |
| `public/images/hero-poster-mobile.jpg` | 1080 × 1920 | Hero poster on phones |
| `public/images/posters/<clip>-landscape.webp` / `-portrait.webp` | First frame of each clip, written by the same script | Poster on every video; set `postersReady = true` in `content/media.ts` |

The CDN cannot be reached from the build sandbox, so the posters and self-hosted files could not be produced here. Until then videos sit on the brand black while the first frame loads (no broken boxes).

### Client logos (section 03 shows a labelled "Logo pending" tile with the expected filename until each file exists; set `logoReady: true` in `content/clients.ts`)
| Filename | Spec |
|---|---|
| `public/brand/clients/yugen-infra.svg` | SVG preferred, or PNG ≥ 400 px wide, transparent |
| `public/brand/clients/one-goa.svg` | same |
| `public/brand/clients/prominent-realty.svg` | same |
| `public/brand/clients/hometrust-realty.svg` | same |
| Any other client, e.g. `public/brand/clients/<client-name>.svg` | Only with that client's consent |

### Project visuals (Our Work and Case Studies)
For each project, 3–6 images. Name them `public/images/projects/<slug>/<nn>.webp`:
| Slug | Needed | Recommended size |
|---|---|---|
| `yugen-goa` | Hero image (campaign key visual or site photo), 2–3 ad creatives, landing page screenshot | 2400 × 1500 (hero), 1600 × 2000 (portrait creatives) |
| `one-goa` | Key visual, campaign creatives | same |
| `prominent-realty` | Project creatives or website screenshots | same |
| `hometrust-realty` | Brand / campaign visuals | same |
Plus the full case-study copy from scaleacres.com/case-studies/: challenge, scope, creative and published figures.

### Creative Studio
| Folder | Content | Spec |
|---|---|---|
| `public/videos/studio/social/` | Approved reels (Drive: Auriga 9, DTC Stillwaters, DTC Crest Club Atlas, La Wisteria, Codename Flow KIADB, BPTP Truekeey) | 1080 × 1920 MP4, ≤ 8 MB each, plus `<name>.jpg` poster |
| `public/videos/studio/ads/` | Approved ad films | 16:9 or 9:16 MP4, ≤ 8 MB each, plus poster |

### About / team (optional)
| Filename | Spec |
|---|---|
| `public/images/about/team-01.webp` … | 2000 px wide, real team or studio photographs |

### Insights
| Filename | Spec |
|---|---|
| `public/images/insights/<article-slug>.webp` | The article's existing featured image from WordPress, 1600 × 900 |

The insights section is currently typography-only, so missing images do not leave empty boxes.

## 3. Placeholder patterns removed
Orange circles, grey bars, fake thumbnails, fake video cards, the gradient "showreel", the geometric About image and text-only client names are all gone. The only remaining stand-ins are clearly labelled:
- project covers ("Project visuals pending");
- the Social and Ad tabs ("awaiting approved files").

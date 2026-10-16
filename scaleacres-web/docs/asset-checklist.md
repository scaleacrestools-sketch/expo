# Asset checklist — what to drop in before launch

Everything marked **Dev placeholder** in the UI (grey badge, top-left of media) maps to a row here.
Replace the file at the given path; no code changes needed unless noted.

## Brand
| Asset | Path in this repo | Source identified |
|---|---|---|
| Primary logo (colour, light grounds) | `public/brand/scaleacres-logo.webp` + update `components/ui/Logo.tsx` to use it | WordPress: `/wp-content/uploads/2025/04/Scaleacres-Logo-1024x333.webp` (in the Updraft `uploads.zip` backups, Drive folder "Scaleacres Website Updraft Backup(19-02-2026)") |
| Reversed logo (white) | `public/brand/scaleacres-logo-white.webp` | WordPress: `/wp-content/uploads/2025/03/Scaleacres-Logo-White-1024x333.webp` |
| Favicon / mark | `app/icon.svg` (placeholder in place; replace with the official mark) | WordPress: `/wp-content/uploads/2025/04/cropped-ScaleAcres-icon-32x32.png` |
| OG share image (1200×630) | `public/images/og-image.(png/jpg)` and reference it in `app/layout.tsx` metadata | Design from the new hero frame |

Vector masters (SVG/AI) are not on the current site — request from the original designer (noted in the brand kit).

## Hero showreel
| Asset | Path | Source identified |
|---|---|---|
| Landscape showreel, MP4 (H.264, ≤ 6 MB, 1920×1080, 10–20 s loop, no audio track needed) | `public/videos/showreel.mp4` | Drive: `Scaleacres Vid 1 Finalll_1.mp4` (206 MB — needs a compressed, trimmed export) |
| Landscape showreel, WebM (VP9/AV1) | `public/videos/showreel.webm` | same export |
| Portrait cut for mobile (1080×1920) | `public/videos/showreel-portrait.mp4` | same export, reframed |
| Poster frames | `public/images/hero-poster.jpg`, `public/images/hero-poster-mobile.jpg` | first frame of the export |

Then edit `heroMedia` in `app/page.tsx`: point `sources` / `mobileSources` / posters at the new files and set `placeholder: false`.

## Creative Studio videos (`content/studio.ts`)
Approved ScaleAcres video work found in Drive (owner: scaleacres@gmail.com / prem.gupta@scaleacres.com). Confirm client permission before publishing each one:

- `Auriga 9 by Bhatia Reel [P]_3 (2).mp4` — social / project launch reel
- `DTC Stillwaters Reel [P].mp4` — social reel
- `DTC - CREST - CLUB ATLAS REEL - 04-12-25_3.mp4` — social reel
- `La Wisteria Eng Reel.mp4` — social reel
- `Codename Flow KIADB Reel [P].mp4` — social reel
- `BPTP (Truekeey) Reel [P]_1.mp4` — social / ad reel
- `mwb *.mp4` (several) — short-form reels

Export each to ≤ 8 MB MP4 (plus a JPG poster), place under `public/videos/studio/` and `public/images/studio/`, then update the matching `StudioVideo` entry (`src`, `poster`, `title`, `category`, `placeholder: false`). AI Videos and Ad Videos tabs need approved assets identified — none were found in Drive under those names.

## Client logos (`content/clients.ts`)
Clients currently named publicly on scaleacres.com: Yugen Infra, One Goa, Prominent Realty, Hometrust Realty. Add each approved logo as monochrome SVG/PNG under `public/brand/clients/` and set `logo` on the entry. Additional clients may be added **only** with written consent.

## Selected Work / Case Studies (`content/projects.ts`, `content/caseStudies.ts`)
Replace the SVG placeholders under `public/images/projects/` with approved visuals (web screenshots, brand boards, campaign creatives). Add `outcomes` to a case study **only** when a campaign report backs each figure.

## Insights (`content/insights.ts`)
Three real articles from scaleacres.com/blog are linked. Replace the SVG placeholders under `public/images/insights/` with each article's featured image and set exact publication dates from the WordPress export.

## About / Team
Add a studio or team photograph at `public/images/about/studio.(jpg)` and update `components/AboutIntro.tsx`. Publish team profiles on `/about#team` only with each person's approval.

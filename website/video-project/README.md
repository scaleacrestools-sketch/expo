# Assetz hero film: video assets and edit project

## What is in this package

| Folder / file | What it is |
|---|---|
| `web-ready/assetz-hero-desktop.mp4` | Website playback file, 1920×1080, 19.9 s seamless loop, H.264 High, no audio, `faststart` (≈5.8 MB) |
| `web-ready/assetz-hero-mobile.mp4` | Website playback file, 1080×1920 (9:16), 17.8 s loop, H.264 High, no audio, `faststart` |
| `web-ready/assetz-hero-desktop.webm`, `…-mobile.webm` | VP9 versions. Browsers that support WebM use these first; the MP4 is the fallback |
| `web-ready/assetz-hero-poster.webp`, `…-mobile-poster.webp` | First-frame posters shown instantly while the video loads, and as the fallback when video is off |
| `edit-project/build-hero.sh` | **The editable project.** The film was cut and graded with FFmpeg, so this script *is* the edit: shot list (in-points and durations), colour grade, crossfades, crop and export settings |
| `edit-project/edit-decision-list.csv` | The same edit as a readable table: every shot, its source in-point, duration and timeline position |
| `edit-project/edl/assetz-hero-desktop.edl`, `assetz-hero-mobile.edl` | CMX 3600 EDLs (cuts only) of the same edit. They import into Premiere Pro, DaVinci Resolve and Avid; relink to the files in `source-footage/` |
| `edit-project/source-footage/` | The two source reels the film was cut from, as published by Assetz on assetzproperty.com |
| `edit-project/shots-desktop.jpg`, `shots-mobile.jpg` | Contact sheets of the shots, in timeline order |
| `edit-project/masters/` | High-quality intermediate masters (H.264 CRF 16) of the finished edit. Re-encode from these instead of re-encoding the web files |

There is no Premiere, Final Cut or After Effects project file: the edit was never made in a timeline editor. The script and the EDLs are the editable sources. An MP4 is a playback file, not an editable project.

## Rebuild or change the film

Requirements: FFmpeg with libx264, libvpx-vp9 and libwebp, plus Python 3.

```bash
cd edit-project
bash build-hero.sh
```

This re-cuts every shot from `source-footage/`, rebuilds `masters/`, and writes new web files to `web/`. Running it reproduces the delivered desktop MP4 byte for byte (5,786,695 bytes).

You can change these settings in `build-hero.sh`:

- `DESKTOP_SHOTS` / `MOBILE_SHOTS`: each entry is `"in-point duration"` in seconds of the source reel. Reorder, remove or add shots here.
- `GRADE`: saturation, gamma, contrast, warm colour balance and vignette.
- `XF`: crossfade length (0.45 s).
- `crf`: export quality. Lower means higher quality and a larger file.

To edit in Premiere Pro or Resolve instead, import the `.edl`, relink to `source-footage/`, and re-apply these effects:

- a 0.45 s cross-dissolve at every cut;
- a 0.5 s fade in and fade out;
- the grade above;
- for mobile, a 759×1350 crop at x = 160, scaled to 1080×1920.

The EDL timecodes use 30 fps NDF; the source reels are 29.97 fps.

## Replace the video on the website

1. Export new files with exactly these names: `assetz-hero-desktop.mp4`, `assetz-hero-mobile.mp4`, `assetz-hero-poster.webp` and `assetz-hero-mobile-poster.webp`. The `.webm` files are optional; if you drop them, also remove the `data-*-webm` attributes in `src/templates/home.js`.
2. Copy them into `website/assets/video/`.
3. Run `node build.js` and deploy `dist/`.

Recommended specs:

| | Desktop | Mobile |
|---|---|---|
| Resolution | 1920×1080 | 1080×1920 |
| Length | 15–25 s, seamless loop | 15–25 s, seamless loop |
| Codec | H.264 High, yuv420p, `-movflags +faststart` | same |
| Audio | none | none |
| Target size | 3–6 MB | 3–6 MB |

The site picks the file by screen width (≤ 767 px plays mobile). It attaches the video only after the page has painted, so the poster shows first. It plays muted and inline. It does not load video at all for visitors with *reduced motion* or *Save-Data* turned on.

## Source footage and rights

The footage belongs to Assetz Property Group: the homepage reel `homepagevideosecond.mp4` and the residential & commercial reel `residentialandcommercial.mp4`, both published on assetzproperty.com. Confirm usage rights with Assetz before public launch.

Other reels published on the official site (`homepagevideofirst`, `commonarea`, and the brand campaign films) were reviewed but not used.

Assets that would improve the film, if Assetz can supply them:

- original camera files (higher bitrate than the web reels);
- drone footage of each of the five projects;
- golden-hour exteriors and interior walk-throughs;
- a licensed music bed, if a sound version is ever needed (the website version is silent by design).

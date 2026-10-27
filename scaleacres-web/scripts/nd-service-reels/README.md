# Homepage service visuals

These are eight short motion loops, one per service card. Each is an 8 s seamless loop at 1440 × 960 and 30 fps. All motion is periodic, so the loops repeat with no visible seam.

`svc.html?s=<service-slug>` stages one composition in 3D and draws it with `render(t)`. The compositions use only genuine ScaleAcres work:

- live-site captures;
- campaign and analytics screenshots from the scaleacres.com media library;
- SID and Nirvana branding pieces;
- launch and social creatives;
- ad-film frames;
- for the video card, a darkened backdrop of the ScaleAcres AI concept "production" film.

## Rendering

1. Render the frames: `node frames.mjs <slug> all out/<slug>`. Use `keys` instead of `all` to render only four key frames.
2. Encode each loop at 1200 × 800:
   - VP9 WebM at CRF 38;
   - H.264 MP4 at CRF 27 with `+faststart`.
3. Save frame 0 as the poster at 720 px and 1200 px, as WebP.

Paths in `svc.html` (`A`, `ND`, `SV`) are absolute to the machine the loops were rendered on. Update them before re-rendering.

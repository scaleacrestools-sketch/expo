# ScaleAcres hero reel

The reel is an original motion piece rendered from code. It is an 18 s seamless loop in six chapters:

1. Brand identity
2. Real estate marketing
3. Website design
4. Performance marketing
5. Video production
6. ScaleAcres finale

- `reel.html` holds the deterministic timeline. `render(t)` draws the frame at second `t`, and `?fmt=p` switches to the separately composed 1080 × 1920 cut.
- `frames.mjs` drives Playwright to capture the frames at 30 fps:
  - `node frames.mjs l all out-l` renders every landscape frame into `out-l`;
  - `node frames.mjs p keys keys-p` renders only the key frames of the portrait cut.
- Encode the frames with ffmpeg. The commit that added this folder used:
  - H.264 MP4, CRF 26/27, with `+faststart`;
  - VP9 WebM, CRF 37/38.

## Sources

- **ScaleAcres brand.** The logos (`public/brand`), the Outfit font and the official colours.
- **Genuine client work.**
  - Launch creatives: SID, TRG, JBBR and Intech.
  - The SID hoarding.
  - Live-site captures: SID, Subata and Imperial Sky.
  - Frames from ScaleAcres ad films.
- **Backdrop footage.** The architecture, production and light-sweep backdrops are frames from ScaleAcres AI concept films.

Paths in `reel.html` are absolute to the machine the reel was rendered on. Update the `A`, `ND`, `BR` and `SV` constants before re-rendering.

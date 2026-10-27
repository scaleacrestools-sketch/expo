# Service images (light editorial)

There are eight 3:2 stills, one per service card, saved to `public/images/nd/services/<slug>-{800,1200,1800}.webp`.

- `compose.html?s=<slug>` lays out each scene at 1200 × 800 on a white base.
- `shot.mjs` renders each scene at 2× with Playwright.
- `esrgan_np.py` runs Real-ESRGAN `realesr-general-x4v3` in NumPy, with no PyTorch, and upscales pieces cut from the profile by 4×. Run it as `python3 esrgan_np.py realesr-general-x4v3.pth in/ out/`. The upscaled result is blended 78/22 with a bicubic version.

## Sources (genuine ScaleAcres work only)

- **scaleacres.com:**
  - live-site captures and full-page captures;
  - Search Console and ranking screenshots;
  - Google search ads;
  - Meta Ads results;
  - launch creatives;
  - ad-film frames.
- **ScaleAcres company profile (PDF, 614 × 345 px per page).** Only individual pieces were cut out, never a whole slide, heading or background:
  - Ottimo, Karyan, Aarize, TRG, JBBR and Intech identity work;
  - JBBR, SID and Intech social feeds;
  - the Rhomes influencer reels.
- **Cost-per-lead figures.** These are re-typeset from the profile's Meta Ads results:
  - Rhomes Miraabilis: ₹1,300 → ₹800;
  - Sea Breeze Villas: ₹478 → ₹298;
  - Aarize: ₹666 → ₹320.

  The percentage labels on the slides are left out, because two of them don't match the figures.

Paths in `compose.html` are absolute to the machine the images were rendered on. Update them before re-rendering.

# Section 05 covers (Creative Showcase)

The covers are portfolio images rendered in Blender 5.2 with Cycles. Everything in a scene is built by its script: geometry, materials, lighting and camera. The only images used are genuine ScaleAcres client work, applied as unmodified textures. No stock images or AI-generated pictures are used, and no Higgsfield generation.

- **Website screens** are emissive at strength 1 under the Khronos PBR Neutral view transform, so UI colours stay true.
- **Print** (posters, hoardings and stationery) is lit like paper or vinyl.
- **Logos** are foiled or printed exactly as supplied.

## Covers

| File | Project | Category | Genuine sources (`src/`) |
|---|---|---|---|
| `intech.py` | Intech Developers | Website Design & Development | Live ScaleAcres build at intech-developers.vercel.app ("Discover Modern Living in Udupi", matching profile slide 10): desktop 1440 × 900 at 2× (`intech-web-desktop.png`), mobile 390 × 844 at 3× (`intech-web-mobile.png`), captured 27 Oct 2026 |
| `sid.py` | SID Realtech | Branding & Outdoor Campaign | Ellington 86 "Coming Soon" launch creative, 1350 × 1688, from the scaleacres.com media library (`sid-post.jpg`) |
| `jbbr.py` | JBBR Group | Brand Identity & Creative Design | Official JBBR logo, the 1095 × 834 raster embedded in jbbr.co.in/images/logo.svg (`jbbr-logo.png`); "We don't just hand over keys" creative, 1350 × 1688, from scaleacres.com (`jbbr-post.jpg`) |
| `trg.py` | TRG | Launch Campaign & Event Experience | TRG The Mall "15 Years of Income" creative, 1297 × 1621, from scaleacres.com (`trg-post.jpg`). The TRG and TRG The Mall logos are cut from it unchanged |

### What each scene shows

These are presentation mockups of genuine artwork, not photographs of installations.

- **SID:** the creative on a hoarding.
- **JBBR:** the logo foiled on a box and cards, with the creative as a print.
- **TRG:** a launch gate restaged around the real gate's layout, with both logos on the header (profile p. 4). The gate's original print files were not available, so its side panels carry the campaign creative.

## Not built yet: originals needed

- **Rhomes (Social Media).** The Rhomes Miraabilis posts exist only inside the 614 × 345 profile pages (pp. 20 and 41), which are far too small. Instagram (@rhomesmiraabilis) needs a login. The 1080 px post exports are needed.
- **SeaBreeze Villas (Website / Digital Experience).** No SeaBreeze Villas website could be found; seabreeze.vercel.app is an unrelated placeholder. The profile shows only influencer reels (p. 43) and an Analytics chart (p. 38). A website URL or design files are needed, or the reel and post originals for a social cover.

## Run

```bash
python -m venv bl && bl/bin/pip install bpy==5.2.3 pillow fonttools brotli
bl/bin/python intech.py -- --out=renders          # 2400 × 1500, 160 samples (about 15 min on 4 cores)
bl/bin/python sid.py -- --w=960 --h=600 --samples=16 --out=renders   # quick preview
bl/bin/python export.py renders previews Outfit.ttf  # JPEG previews + contact sheet
```

To get `Outfit.ttf`, convert the site's Outfit woff2 with fontTools (`TTFont(woff2).flavor = None`).

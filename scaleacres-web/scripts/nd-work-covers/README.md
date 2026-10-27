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

## Interim covers: original files needed

The ScaleAcres profile PDF stores every page as a single 614 × 345 px JPEG. These two covers are built from individual pieces cut out of those pages. Each piece was perspective-corrected where needed and enlarged 4× with Lanczos only.

Real-ESRGAN was tried and rejected because it corrupts the small campaign text: it turns "Great Moves Don't Wait" into "Creat Moves", mangles "La Fioreza" and changes "Phase 1 Sold Out". Both covers are therefore soft at 2400 × 1500, and are shown for layout approval only.

| File | Project | Category | Pieces used (`src/…`) | Native size | Originals needed |
|---|---|---|---|---|---|
| `rhomes.py` | Rhomes (Miraabilis) | Social Media & Creative Campaign | Reels "Miraabilis Luxury Residences" and "Kayaking" (p. 22); posts "Great Moves Don't Wait", chess, and La Fioreza "A Signature Experience", interior and "A Finely Balanced Social Space" (p. 21) | Reels about 100 × 216 px; posts 102 × 119 px | The 1080 × 1350 post exports and 1080 × 1920 reel covers or frames |
| `seabreeze.py` | SeaBreeze Villas | Brand Identity & Campaign | Roll-up artwork "Luxury Villas in the Heart of Goa", and hoarding artwork "More Than a Home. A Way of Life." (p. 19) | Roll-up 94 × 229 px; hoarding 256 × 96 px | The roll-up and hoarding print files (PDF/AI), the logo (SVG/AI), and the stationery artwork |

No SeaBreeze Villas website could be found (seabreeze.vercel.app is an unrelated placeholder), so the SeaBreeze cover presents the brand and campaign instead.

## Run

```bash
python -m venv bl && bl/bin/pip install bpy==5.2.3 pillow fonttools brotli
bl/bin/python intech.py -- --out=renders          # 2400 × 1500, 160 samples (about 15 min on 4 cores)
bl/bin/python sid.py -- --w=960 --h=600 --samples=16 --out=renders   # quick preview
bl/bin/python export.py renders previews Outfit.ttf  # JPEG previews + contact sheet
```

To get `Outfit.ttf`, convert the site's Outfit woff2 with fontTools (`TTFont(woff2).flavor = None`).

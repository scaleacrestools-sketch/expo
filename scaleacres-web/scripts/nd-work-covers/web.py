"""Web sizes for the Section 05 covers: public/images/nd/work/<slug>-{640,960,1280,1600}.{avif,webp}.
    python web.py <renders_dir> <public/images/nd/work>"""
import os, sys
from PIL import Image
R, OUT = sys.argv[1:3]
os.makedirs(OUT, exist_ok=True)
for slug in ("jbbr-group", "trg-the-mall", "intech-developers", "sid-realtech"):
    im = Image.open(os.path.join(R, f"{slug}.png")).convert("RGB")
    for w in (640, 960, 1280, 1600):
        r = im.resize((w, w * 10 // 16), Image.LANCZOS)
        r.save(os.path.join(OUT, f"{slug}-{w}.webp"), quality=82, method=6)
        r.save(os.path.join(OUT, f"{slug}-{w}.avif"), quality=58)
    print(slug, {w: os.path.getsize(os.path.join(OUT, f"{slug}-{w}.avif")) // 1024 for w in (640, 1600)})

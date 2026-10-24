"""Responsive WebP (and AVIF for the hero) for the Neiden-direction homepage.
Sources are genuine ScaleAcres work (scaleacres.com, the ScaleAcres YouTube channel and live
client-site captures) plus one labelled ScaleAcres concept-film still for the hero backdrop.
Usage: python3 scripts/build-nd-images.py <extra-source-dir>"""
import json, os, sys
from PIL import Image

EXTRA = sys.argv[1]
W, L = "public/images/home/work", "public/images/home/live"
OUT = "public/images/nd"
STEPS = [480, 800, 1200, 1600, 2400]

def src(p):
    return p if os.path.exists(p) else os.path.join(EXTRA, os.path.basename(p))

JOBS = {
    # hero backdrop (concept film still): monochrome, AVIF + WebP
    "hero": (f"{EXTRA}/film-arch-l.jpg", "mono"), "hero-p": (f"{EXTRA}/film-arch-p.jpg", "mono"),
    # websites (live first-screen captures, 2400 × 1500)
    **{f"web-{n}": (f"{EXTRA}/live2x-{n}.jpg", None) for n in ["sid", "subata", "imperial", "research", "finsckool", "jina", "mwb"]},
    **{f"m-{n}": (f"{L}/live-{n}-m.jpg", None) for n in ["subata", "mwb", "finsckool"]},
    # results, creatives, branding, portfolio slides
    "seo": (f"{W}/result-seo.jpg", None), "meta": (f"{W}/result-meta.jpg", None), "google": (f"{W}/result-google.jpg", None),
    **{f"cr-{n}": (f"{W}/creative-{n}.jpg", None) for n in ["sid", "jbbr", "intech", "trg"]},
    **{f"slide-{n}": (f"{W}/slide-{n}.jpg", None) for n in [1, 2, 3, 4, 5, 6, 9, 10, 12, 13, 14, 15]},
}
YT = ["vgsUylyADPY", "fRnzr1dSYMg", "0NmdVrMelSQ", "Z1ez2sINaao", "vODoeG2QEKQ", "QkCSgbRHJ0g", "HXVFHKSOmVE", "Hh6lSEZ0WyY", "nRFeRCMZG3E", "9GUSJ8zlvRA",
      "hU-pHCMCKqo", "tdXNax-PUNQ", "gRVdTT7lOPk", "MdluDjATzgA", "8_U_WnEdVjA", "Mqaa4zG7KoM", "3QHjnPGdrWc", "yILr4FpP2bc",
      "1ZXNwVLM7T4", "O1FJdO2yZOY", "z37JFVVNIYk", "5Pm2Z6WszRc", "FxO_2KVX4zA", "ZQa0XNGiN7Y", "TyFCnkRBg_I"]
for y in YT: JOBS[f"yt-{y}"] = (f"{W}/yt-{y}.jpg", None)

manifest = {}
for name, (path, mode) in JOBS.items():
    im = Image.open(src(path)).convert("RGB")
    if mode == "mono":
        from PIL import ImageOps, ImageEnhance
        im = ImageEnhance.Contrast(ImageOps.grayscale(im).convert("RGB")).enhance(1.12)
    w0, h0 = im.size
    widths = sorted({w for w in STEPS if w < w0} | {min(w0, 2400)})
    for w in widths:
        r = im if w == w0 else im.resize((w, round(h0 * w / w0)), Image.LANCZOS)
        r.save(f"{OUT}/{name}-{w}.webp", "WEBP", quality=78 if w >= 1600 else 80, method=6)
        if mode == "mono": r.save(f"{OUT}/{name}-{w}.avif", "AVIF", quality=55)
    manifest[name] = {"w": w0 if w0 <= 2400 else 2400, "h": round(h0 * min(w0, 2400) / w0), "widths": widths, "avif": mode == "mono"}
open("content/nd-images.json", "w").write(json.dumps(manifest, indent=0))
tot = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT))
print(len(manifest), "images", len(os.listdir(OUT)), "files", round(tot / 1e6, 1), "MB")

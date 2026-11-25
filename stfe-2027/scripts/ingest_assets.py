"""Ingest the organiser's source bundle into web-ready assets.

Run:  python3 -I scripts/ingest_assets.py  (from the stfe-2027 folder)

Source (organiser supplied, see source-assets/README):
  source-assets/extracted/stfe-2027/source-assets/STFE-2027-Approved-Logo.png
  source-assets/extracted/stfe-2027/source-assets/STFE-2027-Original-Brochure.pdf

Everything here is extracted, trimmed or resized only. Artwork is never redrawn or recoloured.
"""
import json, shutil
from pathlib import Path
import numpy as np
import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'source-assets/extracted/stfe-2027/source-assets'
if not SRC.exists():  # packaged layout
    SRC = ROOT / 'source-assets/original'
LOGO = SRC / 'STFE-2027-Approved-Logo.png'
PDF = SRC / 'STFE-2027-Original-Brochure.pdf'
if not PDF.exists():  # packaged layout: the original ships byte-identical as the public download
    PDF = ROOT / 'public/downloads/STFE-2027-Brochure.pdf'
PUB = ROOT / 'public'
out = lambda p: (PUB / p).parent.mkdir(parents=True, exist_ok=True) or PUB / p
report = {}


def trim(im, bg=(255, 255, 255), tol=12, pad=0):
    """Crop uniform margins only (white or transparent). Pixels inside are untouched."""
    a = np.asarray(im.convert('RGBA')).astype(int)
    opaque = a[..., 3] > 8
    nonbg = opaque & (np.abs(a[..., :3] - np.array(bg)).max(axis=2) > tol)
    ys, xs = np.where(nonbg)
    box = (max(xs.min() - pad, 0), max(ys.min() - pad, 0), min(xs.max() + 1 + pad, im.width), min(ys.max() + 1 + pad, im.height))
    return im.crop(box), box


def save_webp(im, path, width=None, q=86):
    if width and im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(out(path), 'WEBP', quality=q, method=6)
    return im.size


# 1. Approved logo — margin trim only ------------------------------------------------
logo = Image.open(LOGO).convert('RGBA')
logo_t, box = trim(logo, pad=18)
logo_t.save(out('assets/brand/stfe-2027-logo.png'), optimize=True)
save_webp(logo_t, 'assets/brand/stfe-2027-logo-640.webp', 640)
save_webp(logo_t, 'assets/brand/stfe-2027-logo-1280.webp', 1280)
# original logo kept in source-assets/ (not shipped to public)
report['logo'] = {'source_size': logo.size, 'trim_box': box, 'trimmed_size': logo_t.size}

# 2. Brand colours sampled from the logo artwork -----------------------------------------
arr = np.asarray(logo.convert('RGB')).astype(int)
W, H = logo.size


def dominant(region, pred):
    x0, y0, x1, y1 = region
    px = arr[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)].reshape(-1, 3)
    px = px[[pred(p) for p in px]]
    med = np.median(px, axis=0).astype(int)
    return '#%02x%02x%02x' % tuple(med), len(px)


navy = dominant((0.08, 0.38, 0.44, 0.68), lambda p: p.max() < 110 and p[2] > p[0])          # "STFE" lettering
orange = dominant((0.46, 0.38, 0.82, 0.68), lambda p: p[0] > 200 and 70 < p[1] < 140 and p[2] < 80)  # "2027" numerals
teal = dominant((0.80, 0.25, 0.97, 0.75), lambda p: p[2] > 150 and p[1] > 150 and p[0] < 110)      # ribbon cyan
blue = dominant((0.80, 0.25, 0.97, 0.90), lambda p: p[2] > 150 and p[1] < 120 and p[0] < 80)       # ribbon blue
red = dominant((0.75, 0.10, 0.97, 0.50), lambda p: p[0] > 170 and p[1] < 60 and p[2] < 90)        # ribbon crimson
yellow = dominant((0.45, 0.05, 0.75, 0.45), lambda p: p[0] > 230 and p[1] > 180 and p[2] < 90)    # ribbon yellow
palette = {'navy': navy[0], 'orange': orange[0], 'teal': teal[0], 'blue': blue[0], 'crimson': red[0], 'yellow': yellow[0]}
report['palette'] = {k: {'hex': v[0], 'samples': int(v[1])} for k, v in zip(palette, [navy, orange, teal, blue, red, yellow])}

# 3. Brochure: original PDF (unmodified) + page previews -----------------------------------
if PDF.resolve() != (PUB / 'downloads/STFE-2027-Brochure.pdf').resolve():
    shutil.copy(PDF, out('downloads/STFE-2027-Brochure.pdf'))
doc = pymupdf.open(PDF)
for p in doc:
    pix = p.get_pixmap(dpi=150)
    im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
    save_webp(im, f'assets/brochure/brochure-page-{p.number + 1}.webp', 900, 84)

# 4. Brochure page-1 raster layers: institutional marks, globe, venue photograph --------------
p1 = doc[0]


def layer(xref):
    pix = pymupdf.Pixmap(doc, xref)
    smask = [i[1] for i in p1.get_images(full=True) if i[0] == xref][0]
    if smask:
        pix = pymupdf.Pixmap(pix, pymupdf.Pixmap(doc, smask))
    if pix.n - pix.alpha >= 4:
        pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
    return Image.frombytes('RGBA' if pix.alpha else 'RGB', (pix.width, pix.height), pix.samples).convert('RGBA')


def trim_alpha(im, pad=2):
    a = np.asarray(im)[..., 3]
    ys, xs = np.where(a > 10)
    return im.crop((max(xs.min() - pad, 0), max(ys.min() - pad, 0), min(xs.max() + 1 + pad, im.width), min(ys.max() + 1 + pad, im.height)))


by_size = {}
for img in p1.get_images(full=True):
    info = doc.extract_image(img[0])
    by_size[(info['width'], info['height'])] = img[0]
marks = {
    'msme-ministry-of-msme': by_size[(221, 102)],
    'digital-india': by_size[(175, 95)],
    'make-in-india': by_size[(320, 240)],
}
for name, xref in marks.items():
    im = trim_alpha(layer(xref))
    im.save(out(f'assets/institutional/{name}.png'), optimize=True)
    report.setdefault('institutional', {})[name] = im.size

globe = trim_alpha(layer(by_size[(220, 243)]))
globe.save(out('assets/brand/stfe-globe.png'), optimize=True)
for s in (32, 180, 512):
    c = Image.new('RGBA', (s, s), (255, 255, 255, 0))
    g = globe.copy(); g.thumbnail((s, s), Image.LANCZOS)
    c.alpha_composite(g, ((s - g.width) // 2, (s - g.height) // 2))
    c.save(out(f'favicon-{s}.png' if s != 180 else 'apple-touch-icon.png'))

venue_layers = [i[0] for i in p1.get_images(full=True) if doc.extract_image(i[0])['width'] == 2480]
venue = None
for xref in venue_layers:
    im = layer(xref)
    a = np.asarray(im)[..., 3]
    cover = (a > 10).mean()
    if 0.02 < cover < 0.25:  # the building cut-out occupies a small part of the full-page layer
        venue = trim_alpha(im, 0)
if venue is None:
    raise SystemExit('venue cut-out layer not found')
(ROOT / 'source-assets/review').mkdir(parents=True, exist_ok=True)
venue.save(ROOT / 'source-assets/review/soor-sadan-auditorium-cutout-full.png')
save_webp(venue, 'assets/venue/soor-sadan-auditorium-cutout.webp', 1200, 88)
report['venue'] = venue.size

# 5. Floor plans (page 3, vector) — background artwork removed, drawings rendered at high DPI ---
plan_doc = pymupdf.open(PDF)
p3 = plan_doc[2]
for img in p3.get_images(full=True):
    p3.delete_image(img[0])
clips = {
    'ground-floor': pymupdf.Rect(30, 436, 294, 596),
    'first-floor': pymupdf.Rect(302, 436, 566, 596),
}
for name, r in clips.items():
    pix = p3.get_pixmap(dpi=400, clip=r, alpha=False)
    im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
    im, _ = trim(im, pad=40)
    im.save(out(f'assets/floor-plans/{name}.png'), optimize=True)
    save_webp(im, f'assets/floor-plans/{name}-preview.webp', 900, 86)
    report.setdefault('floor_plans', {})[name] = im.size

(ROOT / 'src').mkdir(exist_ok=True)
(ROOT / 'src/brand-tokens.css').write_text(
    '/* Generated by scripts/ingest_assets.py from the approved logo artwork. Do not edit by hand. */\n:root {\n'
    + ''.join(f'  --logo-{k}: {v};\n' for k, v in palette.items()) + '}\n')
(ROOT / 'source-assets/ingest-report.json').write_text(json.dumps(report, indent=2, default=str))
print(json.dumps(report, indent=2, default=str))

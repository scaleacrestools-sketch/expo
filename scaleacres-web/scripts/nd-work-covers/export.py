"""Approval previews for the Section 05 covers: full-size JPEGs and a contact sheet laid out like the
Creative Showcase grid (two columns, name + category under each cover).

    python export.py <renders_dir> <out_dir> <Outfit.ttf>
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont

R, OUT, FONT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)

COVERS = [
    ("intech-developers", "Intech Developers", "Website Design & Development"),
    ("sid-realtech", "SID Realtech", "Branding & Outdoor Campaign"),
    ("jbbr-group", "JBBR Group", "Brand Identity & Creative Design"),
    ("rhomes", "Rhomes", "Social Media & Creative Campaign"),
    ("seabreeze-villas", "SeaBreeze Villas", "Website Design & Digital Experience"),
    ("trg-the-mall", "TRG", "Launch Campaign & Event Experience"),
]
INK, MUTED, PAPER, ROYAL = (11, 13, 13), (95, 99, 104), (247, 246, 242), (29, 78, 216)


def font(size, weight):
    f = ImageFont.truetype(FONT, size)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass
    return f


def rounded(im, r):
    m = Image.new("L", im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, im.width - 1, im.height - 1), r, fill=255)
    out = Image.new("RGBA", im.size)
    out.paste(im, (0, 0), m)
    return out


# full-size previews
for slug, *_ in COVERS:
    p = os.path.join(R, f"{slug}.png")
    if os.path.exists(p):
        im = Image.open(p).convert("RGB")
        im.save(os.path.join(OUT, f"{slug}.jpg"), quality=92, optimize=True, progressive=True)

# contact sheet
W, M, G = 2400, 96, 48
CW = (W - 2 * M - G) // 2
CH = CW * 10 // 16
LBL = 150
H = M + 3 * (CH + LBL) + 2 * 40 + M
sheet = Image.new("RGB", (W, H), PAPER)
d = ImageDraw.Draw(sheet)
f_name, f_cat, f_link, f_ph, f_ph2 = font(40, 600), font(21, 500), font(21, 500), font(34, 500), font(24, 400)
for i, (slug, name, cat) in enumerate(COVERS):
    x = M + (i % 2) * (CW + G)
    y = M + (i // 2) * (CH + LBL + 40)
    p = os.path.join(R, f"{slug}.png")
    if os.path.exists(p):
        im = Image.open(p).convert("RGB").resize((CW, CH), Image.LANCZOS)
        sheet.paste(rounded(im, 18), (x, y), rounded(im, 18))
    else:
        ph = Image.new("RGB", (CW, CH), (232, 230, 224))
        pd = ImageDraw.Draw(ph)
        pd.rounded_rectangle((24, 24, CW - 25, CH - 25), 14, outline=(200, 197, 189), width=2)
        t1, t2 = "Awaiting original artwork", "Hi-res source files are needed before this cover is built"
        pd.text(((CW - pd.textlength(t1, font=f_ph)) / 2, CH / 2 - 40), t1, font=f_ph, fill=INK)
        pd.text(((CW - pd.textlength(t2, font=f_ph2)) / 2, CH / 2 + 12), t2, font=f_ph2, fill=MUTED)
        sheet.paste(rounded(ph, 18), (x, y), rounded(ph, 18))
    d.text((x, y + CH + 26), name, font=f_name, fill=INK)
    cy = y + CH + 84
    cx = x
    for ch in cat.upper():  # letter-spaced category
        d.text((cx, cy), ch, font=f_cat, fill=MUTED)
        cx += d.textlength(ch, font=f_cat) + 4
    link = "VIEW PROJECT"
    ax = x + CW - 18  # arrow drawn as lines (Outfit has no arrow glyph)
    d.line((ax - 11, cy + 20, ax + 3, cy + 6), fill=INK, width=3)
    d.line((ax - 7, cy + 6, ax + 3, cy + 6), fill=INK, width=3)
    d.line((ax + 3, cy + 6, ax + 3, cy + 16), fill=INK, width=3)
    lx = ax - 30
    for ch in reversed(link):
        lx -= d.textlength(ch, font=f_link) + 3
    for ch in link:
        d.text((lx, cy), ch, font=f_link, fill=INK)
        lx += d.textlength(ch, font=f_link) + 3
sheet.save(os.path.join(OUT, "contact-sheet.jpg"), quality=90, optimize=True, progressive=True)
print("ok", sheet.size)

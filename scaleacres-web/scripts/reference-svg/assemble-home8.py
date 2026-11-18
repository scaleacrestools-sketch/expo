"""Builds one editable SVG from <SVG_OUT, default out-home8>/ops.json: live text, vector shapes and icons, and every
picture as its own named, replaceable <image> layer. Groups follow the page's sections.

    python3 -I assemble.py <out.svg> [--embed-fonts]
"""
import base64, io, json, os, re, sys
from html import escape
from PIL import Image

OUT = sys.argv[1]
EMBED_FONTS = "--embed-fonts" in sys.argv
OUTDIR = os.environ.get("SVG_OUT", "out-home8")
d = json.load(open(OUTDIR + "/ops.json"))
W, H = d["W"], d["H"]
ids = {}


def uid(label):
    s = re.sub(r"[^a-z0-9]+", "-", (label or "layer").lower()).strip("-")[:40] or "layer"
    ids[s] = ids.get(s, 0) + 1
    return s if ids[s] == 1 else f"{s}-{ids[s]}"


def n(v):
    return f"{v:.2f}".rstrip("0").rstrip(".")


def rgb(c):
    return f"rgb({c['r']},{c['g']},{c['b']})"


defs = []
clips = {}


def clip_id(c, rad=0):
    if not c:
        return None
    k = (round(c["x"], 1), round(c["y"], 1), round(c["w"], 1), round(c["h"], 1), round(rad, 1))
    if k not in clips:
        cid = f"clip-{len(clips) + 1}"
        clips[k] = cid
        defs.append(f'<clipPath id="{cid}"><rect x="{n(c["x"])}" y="{n(c["y"])}" width="{n(c["w"])}" height="{n(c["h"])}" rx="{n(rad)}"/></clipPath>')
    return clips[k]


def inter(a, b):
    x, y = max(a["x"], b["x"]), max(a["y"], b["y"])
    x2, y2 = min(a["x"] + a["w"], b["x"] + b["w"]), min(a["y"] + a["h"], b["y"] + b["h"])
    return {"x": x, "y": y, "w": max(0, x2 - x), "h": max(0, y2 - y)}


def encode_raster(path, disp_w, max_scale=2.0):
    im = Image.open(path)
    alpha = im.mode in ("RGBA", "LA", "P") and (im.convert("RGBA").getextrema()[3][0] < 255)
    im = im.convert("RGBA" if alpha else "RGB")
    target = int(max(1, disp_w) * max_scale)
    if im.width > target:
        im = im.resize((target, max(1, round(im.height * target / im.width))), Image.LANCZOS)
    buf = io.BytesIO()
    if alpha:
        im.save(buf, "PNG", optimize=True)
        mime = "image/png"
    else:
        im.save(buf, "JPEG", quality=86, optimize=True, progressive=True)
        mime = "image/jpeg"
    return f"data:{mime};base64,{base64.b64encode(buf.getvalue()).decode()}", im.size


filters = {}


def filter_id(f):
    if not f or f == "none":
        return None
    sat = 1.0
    m = re.search(r"grayscale\(([\d.]+)\)", f)
    if m:
        sat = 1 - float(m.group(1))
    m = re.search(r"saturate\(([\d.]+)\)", f)
    if m:
        sat *= float(m.group(1))
    br = float((re.search(r"brightness\(([\d.]+)\)", f) or [0, 1])[1])
    co = float((re.search(r"contrast\(([\d.]+)\)", f) or [0, 1])[1])
    ds = re.search(r"drop-shadow\(rgba?\(([^)]+)\)\s+([-\d.]+)px\s+([-\d.]+)px\s+([\d.]+)px\)", f)
    key = (round(sat, 3), round(br, 3), round(co, 3), ds.group(0) if ds else "")
    if key in filters:
        return filters[key]
    fid = f"fx-{len(filters) + 1}"
    filters[key] = fid
    parts = []
    src = "SourceGraphic"
    if sat != 1:
        parts.append(f'<feColorMatrix in="{src}" type="saturate" values="{n(sat)}" result="s"/>'); src = "s"
    if br != 1 or co != 1:
        slope, icpt = br * co, (1 - co) / 2 * br
        fn = f'type="linear" slope="{n(slope)}" intercept="{n(icpt)}"'
        parts.append(f'<feComponentTransfer in="{src}" result="b"><feFuncR {fn}/><feFuncG {fn}/><feFuncB {fn}/></feComponentTransfer>'); src = "b"
    if ds:
        c = [float(x) for x in re.split(r"[\s,]+", ds.group(1).strip())]
        a = c[3] if len(c) > 3 else 1
        parts.append(f'<feDropShadow in="{src}" dx="{ds.group(2)}" dy="{ds.group(3)}" stdDeviation="{n(float(ds.group(4)) / 2)}" flood-color="rgb({int(c[0])},{int(c[1])},{int(c[2])})" flood-opacity="{n(a)}"/>')
    defs.append(f'<filter id="{fid}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">{"".join(parts)}</filter>')
    return fid


def fam(f):
    f = f.replace('"', "'")
    if "ui-monospace" in f:
        return "'IBM Plex Mono', ui-monospace, Menlo, monospace"
    return f


def rect_path(x, y, w, h, r):
    tl, tr, br, bl = r
    return (f"M{n(x + tl)},{n(y)} H{n(x + w - tr)} A{n(tr)},{n(tr)} 0 0 1 {n(x + w)},{n(y + tr)} V{n(y + h - br)} "
            f"A{n(br)},{n(br)} 0 0 1 {n(x + w - br)},{n(y + h)} H{n(x + bl)} A{n(bl)},{n(bl)} 0 0 1 {n(x)},{n(y + h - bl)} "
            f"V{n(y + tl)} A{n(tl)},{n(tl)} 0 0 1 {n(x + tl)},{n(y)} Z")


def wrap(el, o):
    attrs = []
    if o.get("clip"):
        attrs.append(f'clip-path="url(#{clip_id(o["clip"], o["clip"].get("rad", 0))})"')
    return f'<g {" ".join(attrs)}>{el}</g>' if attrs else el


def draw(o):
    k = o["k"]
    op = o.get("op", 1)
    if k == "rect":
        r = o.get("rad", [0, 0, 0, 0])
        same = len(set(round(v, 1) for v in r)) == 1
        lab = uid(o.get("label"))
        if o.get("stroke"):
            sw = o["sw"]
            x, y, w, h = o["x"] + sw / 2, o["y"] + sw / 2, o["w"] - sw, o["h"] - sw
            paint = f'fill="none" stroke="{rgb(o["stroke"])}" stroke-width="{n(sw)}"' + (f' stroke-opacity="{n(o["stroke"]["a"] * op)}"' if o["stroke"]["a"] * op < 1 else "") + (' stroke-dasharray="4 4"' if o.get("dash") else "")
            r = [max(0, v - sw / 2) for v in r]
        else:
            x, y, w, h = o["x"], o["y"], o["w"], o["h"]
            a = o["fill"]["a"] * op
            paint = f'fill="{rgb(o["fill"])}"' + (f' fill-opacity="{n(a)}"' if a < 1 else "")
        if same:
            el = f'<rect id="{lab}" x="{n(x)}" y="{n(y)}" width="{n(w)}" height="{n(h)}"' + (f' rx="{n(r[0])}"' if r[0] else "") + f" {paint}/>"
        else:
            el = f'<path id="{lab}" d="{rect_path(x, y, w, h, r)}" {paint}/>'
        return wrap(el, o)
    if k == "text":
        fill = o["fill"]
        a = (fill["a"] if fill else 0) * op
        attrs = [f'x="{n(o["x"])}"', f'y="{n(o["y"])}"', f'font-family="{fam(o["fam"])}"', f'font-size="{n(o["size"])}"']
        if o["weight"] not in ("400", "normal"):
            attrs.append(f'font-weight="{o["weight"]}"')
        if o["style"] == "italic":
            attrs.append('font-style="italic"')
        if o["ls"]:
            attrs.append(f'letter-spacing="{n(o["ls"])}"')
        attrs.append(f'fill="{rgb(fill)}"' if fill and fill["a"] > 0 else 'fill="none"')
        if fill and 0 < a < 1:
            attrs.append(f'fill-opacity="{n(a)}"')
        if o.get("stroke") and o.get("sw"):
            attrs.append(f'stroke="{rgb(o["stroke"])}" stroke-width="{n(o["sw"])}"')
            if o["stroke"]["a"] * op < 1:
                attrs.append(f'stroke-opacity="{n(o["stroke"]["a"] * op)}"')
        if o.get("deco"):
            attrs.append(f'text-decoration="{o["deco"]}"')
        return f'<text id="{uid("text " + o["s"][:28])}" {" ".join(attrs)} xml:space="preserve">{escape(o["s"])}</text>'
    if k in ("img", "snap"):
        if k == "img":
            src = d["images"].get(o["src"])
            if not src:
                return ""
        else:
            src = f"{OUTDIR}/snap/{o['id']}.png"
        if src.endswith(".svg"):
            # vector file: nest it as live vector layers, ids prefixed so copies don't clash
            raw = open(src).read()
            raw = re.sub(r"<\?xml[^>]*>", "", raw).strip()
            pre = uid("logo")
            raw = re.sub(r'id="([^"]+)"', lambda m: f'id="{pre}-{m.group(1)}"', raw)
            raw = re.sub(r'url\(#([^)]+)\)', lambda m: f"url(#{pre}-{m.group(1)})", raw)
            raw = re.sub(r'href="#([^"]+)"', lambda m: f'href="#{pre}-{m.group(1)}"', raw)
            head, rest = raw.split(">", 1)
            head = re.sub(r'\s(width|height|x|y)="[^"]*"', "", head)
            head = head.replace("<svg", f'<svg id="{pre}" x="{n(o["x"])}" y="{n(o["y"])}" width="{n(o["w"])}" height="{n(o["h"])}" preserveAspectRatio="xMidYMid meet"', 1)
            return head + ">" + rest
        href, _ = encode_raster(src, o["w"])
        par = "none"
        if k == "img":
            fit = o.get("fit", "fill")
            pos = (o.get("pos") or "50% 50%").split()
            def al(v, ax):
                v = float(v.rstrip("%")) if v.endswith("%") else 50
                return f"{ax}Min" if v < 25 else f"{ax}Max" if v > 75 else f"{ax}Mid"
            if fit in ("cover", "contain"):
                par = f'{al(pos[0], "x")}{al(pos[1] if len(pos) > 1 else "50%", "Y")} {"slice" if fit == "cover" else "meet"}'
            if src.endswith(".svg"):
                par = "xMidYMid meet"
        clip = o.get("clip")
        rect = {"x": o["x"], "y": o["y"], "w": o["w"], "h": o["h"]}
        c = inter(rect, clip) if clip else rect
        rad = o.get("rad") or (clip or {}).get("rad", 0) or 0
        cid = clip_id(c, rad) if (clip or rad or par.endswith("slice")) else None
        fx = filter_id(o.get("filter")) if k == "img" else None
        name = ("image " + o.get("label", "")) if k == "img" else o.get("label", "graphic")
        el = (f'<image id="{uid(name)}" x="{n(o["x"])}" y="{n(o["y"])}" width="{n(o["w"])}" height="{n(o["h"])}" preserveAspectRatio="{par}" xlink:href="{href}"'
              + (f' filter="url(#{fx})"' if fx else "") + (f' opacity="{n(op)}"' if op < 1 else "") + "/>")
        return f'<g id="{uid(name + " frame")}"' + (f' clip-path="url(#{cid})"' if cid else "") + f">{el}</g>"
    if k == "svg":
        m = o["markup"]
        if 'xmlns="' not in m[:200]:
            m = m.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"', 1)
        head, rest = m.split(">", 1)
        head = re.sub(r'\s(id|class|style)="[^"]*"', "", head)
        m = head.replace("<svg", f'<svg id="{uid("icon " + o.get("label", ""))}"', 1) + ">" + rest
        el = f'<g opacity="{n(op)}">{m}</g>' if op < 1 else m
        return wrap(el, o)
    return ""


body = []
# page ground
body.append(f'<rect id="page-background" x="0" y="0" width="{W}" height="{H}" fill="{rgb(d["pageBg"])}"/>')
for g in d["groups"]:
    gid = uid("section " + g["name"])
    parts = []
    hero = None
    if g["name"] == "filmstage":
        href, _ = encode_raster("out/hero-bg.jpg", 1440, 1.0)
        hero = f'<image id="image-hero-film-frame" x="0" y="0" width="1440" height="900" preserveAspectRatio="xMidYMid slice" xlink:href="{href}"/>'
    for o in d["ops"][g["from"]:g["to"]]:
        # the film frame sits on the hero's own ground, under the scrim and copy
        if hero and not (o["k"] == "rect" and o["w"] >= 1400 and o["h"] >= 880):
            parts.append(hero); hero = None
        parts.append(draw(o))
    body.append(f'<g id="{gid}">' + "\n".join(p for p in parts if p) + "</g>")

style = ""
if EMBED_FONTS:
    ff = []
    A = "/home/user/expo/scaleacres-web/design/home-v8/assets/fonts/"
    for name, f, w, st in (("Clash Display", A + "clash-display-600.woff2", "600", "normal"), ("Satoshi", A + "satoshi-400.woff2", "400", "normal"), ("Satoshi", A + "satoshi-500.woff2", "500", "normal"), ("Satoshi", A + "satoshi-700.woff2", "600 900", "normal")):
        ff.append(f"@font-face{{font-family:'{name}';font-weight:{w};font-style:{st};src:url(data:font/woff2;base64,{base64.b64encode(open(f, 'rb').read()).decode()}) format('woff2')}}")
    style = f"<style>{''.join(ff)}</style>"

svg = (f'<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{W}" height="{H}" viewBox="0 0 {W} {H}">\n'
       f'<title>Homepage layout (1440 wide) — editable</title>\n{style}<defs>{"".join(defs)}</defs>\n' + "\n".join(body) + "\n</svg>\n")
open(OUT, "w").write(svg)
print(OUT, len(svg) // 1024, "KB", "layers:", sum(ids.values()))

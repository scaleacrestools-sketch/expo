#!/usr/bin/env python3
"""Generates editable-svg-assets/ : vector logos (from the official vector lockup), every site icon,
UI elements and section graphics, in the approved palette. Run from the website/ folder:
    python3 scripts/make-svg-assets.py
Outputs plain SVG (paths, shapes, live <text>), no embedded raster images."""
import os, re, json, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'editable-svg-assets')
C = {'brand': '#AA7761', 'brand-dark': '#2C191F', 'brand-light': '#D4A48C', 'white': '#FFFFFF', 'black': '#000000', 'whatsapp': '#25D366'}

def w(rel, svg):
    p = os.path.join(OUT, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w').write(svg.strip() + '\n')

# ---------- Logos (official vector lockup, recoloured) ----------
src = open(os.path.join(ROOT, 'assets/img/assetz-logo-footer.svg')).read()
for name, col in [('brand-dark', C['brand-dark']), ('white', C['white']), ('brand', C['brand']), ('black', C['black'])]:
    lock = src.replace('#dbd9d9', col)
    lock = lock.replace('<svg ', f'<svg role="img" aria-label="Assetz Life Reimagined" ', 1)
    w(f'logos/assetz-lockup-life-reimagined-{name}.svg', f'<!-- Assetz lockup, vector paths. Colour: {col} -->\n' + lock)
    # wordmark only: drop the divider and the "Life Reimagined" paths, crop the viewBox
    wm = re.sub(r'<path d="M1646\.483[^>]*/>', '', lock)
    wm = re.sub(r'<path d="[^"]*" aria-label="Life Reimagined"[^>]*/>', '', wm)
    wm = re.sub(r'width="[^"]*" height="[^"]*" viewBox="[^"]*"', 'width="284.8" height="138" viewBox="0 0 71.2 34.5"', wm, count=1)
    wm = wm.replace('aria-label="Assetz Life Reimagined"', 'aria-label="Assetz"')
    w(f'logos/assetz-wordmark-{name}.svg', f'<!-- Assetz wordmark, vector paths. Colour: {col} -->\n' + wm)

# ---------- Icons (same geometry as the website, src/templates/helpers.js) ----------
icons = json.loads(subprocess.check_output(['node', '-e', "process.stdout.write(JSON.stringify(require('./src/templates/helpers').ICONS))"], cwd=ROOT).decode())
FILLED = {'instagram', 'facebook', 'linkedin', 'youtube', 'play'}
sprite = []
for n, svg in icons.items():
    vb = re.search(r'viewBox="([^"]+)"', svg).group(1)
    inner = re.sub(r'^<svg[^>]*>|</svg>$', '', svg)
    size = vb.split()[2]
    if n in FILLED:
        body = f'<g fill="{C["brand-dark"]}">{inner}</g>'
    else:
        sw = '1.8' if size == '24' else '2'
        body = f'<g fill="none" stroke="{C["brand-dark"]}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">{inner}</g>'
    w(f'icons/{n}.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="{vb}"><title>{n}</title>{body}</svg>')
    sprite.append(f'<symbol id="icon-{n}" viewBox="{vb}">{inner}</symbol>')
w('icons/_sprite.svg', '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n<!-- Use: <svg><use href="_sprite.svg#icon-arrow"/></svg>, set fill or stroke with CSS -->\n' + '\n'.join(sprite) + '\n</svg>')

WA = 'M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z'
ARROW_R = '<path d="M5 12h14M13 6l6 6-6 6"/>'
ARROW_L = '<path d="M19 12H5M11 6l-6 6 6 6"/>'

# ---------- UI elements ----------
w('ui/whatsapp-button.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><title>WhatsApp floating button</title><circle cx="30" cy="30" r="30" fill="{C["whatsapp"]}"/><g transform="translate(15 15) scale(1.25)"><path fill="{C["white"]}" d="{WA}"/></g></svg>')
w('ui/whatsapp-glyph.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>WhatsApp glyph</title><path fill="{C["brand-dark"]}" d="{WA}"/></svg>')
for name, path in [('next', ARROW_R), ('prev', ARROW_L)]:
    w(f'ui/slider-arrow-{name}.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"><title>Slider arrow ({name})</title><circle cx="22" cy="22" r="21.5" fill="{C["white"]}" stroke="{C["brand"]}" stroke-opacity=".35"/><g transform="translate(14 14) scale(.6667)" fill="none" stroke="{C["brand-dark"]}" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round">{path}</g></svg>')
    w(f'ui/slider-arrow-{name}-hover.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44"><title>Slider arrow ({name}, hover)</title><circle cx="22" cy="22" r="22" fill="{C["brand"]}"/><g transform="translate(14 14) scale(.6667)" fill="none" stroke="{C["white"]}" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round">{path}</g></svg>')
w('ui/project-go-arrow.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><title>Collection slide arrow</title><circle cx="18" cy="18" r="17.25" fill="none" stroke="{C["white"]}" stroke-width="1.5"/><g transform="translate(11 11) scale(.5833)" fill="none" stroke="{C["white"]}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">{ARROW_R}</g></svg>')
w('ui/video-pause.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><title>Hero video pause</title><circle cx="18" cy="18" r="17.5" fill="#000" fill-opacity=".2" stroke="{C["white"]}" stroke-opacity=".7"/><path fill="{C["white"]}" d="M14.5 12.5h2.6v11h-2.6zM18.9 12.5h2.6v11h-2.6z"/></svg>')
w('ui/video-play.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><title>Hero video play</title><circle cx="18" cy="18" r="17.5" fill="#000" fill-opacity=".2" stroke="{C["white"]}" stroke-opacity=".7"/><path fill="{C["white"]}" d="M15 12.5v11l8.5-5.5z"/></svg>')
w('ui/finder-pill.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="280" height="56" viewBox="0 0 280 56"><title>Finder select pill (on video)</title><rect x=".5" y=".5" width="279" height="55" rx="27.5" fill="#000" fill-opacity=".28" stroke="{C["white"]}" stroke-opacity=".9"/><text x="30" y="34" fill="{C["white"]}" font-family="Figtree, Arial, sans-serif" font-size="17" font-weight="500">Location</text><path d="M246 23l6 6 6-6" fill="none" stroke="{C["white"]}" stroke-width="2"/></svg>')
w('ui/finder-search-button.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="180" height="56" viewBox="0 0 180 56"><title>Finder search button</title><rect width="180" height="56" rx="28" fill="{C["brand"]}"/><text x="90" y="34" text-anchor="middle" fill="{C["white"]}" font-family="Figtree, Arial, sans-serif" font-size="17" font-weight="500">Search</text></svg>')
w('ui/button-primary.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="221" height="45" viewBox="0 0 221 45"><title>Primary pill button</title><rect width="221" height="45" rx="22.5" fill="{C["brand"]}"/><text x="110.5" y="28" text-anchor="middle" fill="{C["white"]}" font-family="Figtree, Arial, sans-serif" font-size="15" font-weight="500">Discover Our Story</text></svg>')
w('ui/button-outline.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="140" height="43" viewBox="0 0 140 43"><title>Outline pill button</title><rect x=".5" y=".5" width="139" height="42" rx="21" fill="none" stroke="{C["brand"]}"/><text x="70" y="26.5" text-anchor="middle" fill="{C["brand-dark"]}" font-family="Figtree, Arial, sans-serif" font-size="14" font-weight="500">View More</text></svg>')
w('ui/faq-plus.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><title>FAQ expand</title><path d="M0 7h14M7 0v14" stroke="{C["brand"]}" stroke-width="1"/></svg>')
w('ui/faq-minus.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><title>FAQ collapse</title><path d="M0 7h14" stroke="{C["brand"]}" stroke-width="1"/></svg>')
w('ui/success-check.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><title>Thank-you check</title><circle cx="32" cy="32" r="31.25" fill="none" stroke="{C["brand-dark"]}" stroke-width="1.5"/><path d="M22 33l7 7 14-15" fill="none" stroke="{C["brand-dark"]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')
w('ui/rail-mail-button.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><title>Floating enquiry button</title><circle cx="20" cy="20" r="20" fill="{C["brand-dark"]}"/><g transform="translate(12 12) scale(.6667)" fill="none" stroke="{C["white"]}" stroke-width="2.4"><path d="M4 5h16v14H4z"/><path d="M4 7l8 6 8-6"/></g></svg>')
w('ui/check-chip.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><title>Checklist chip (project facts)</title><circle cx="16" cy="16" r="15.5" fill="{C["white"]}" stroke="{C["brand"]}" stroke-opacity=".25"/><path d="M11 16.5l3.5 3.5 7-8" fill="none" stroke="{C["brand-dark"]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')
w('ui/number-badge.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><title>Highlight number badge</title><circle cx="20" cy="20" r="20" fill="{C["brand"]}" fill-opacity=".1"/><text x="20" y="27" text-anchor="middle" fill="{C["brand-dark"]}" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="20" font-weight="700">1</text></svg>')

# ---------- Section graphics ----------
w('graphics/section-heading-bar.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="96" height="3" viewBox="0 0 96 3"><title>Project section underline</title><rect width="96" height="3" fill="{C["brand-dark"]}"/></svg>')
w('graphics/eyebrow-line.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="220" height="20" viewBox="0 0 220 20"><title>Eyebrow with leading rule</title><rect y="9.25" width="48" height="1.5" fill="{C["brand"]}"/><text x="60" y="15" fill="{C["brand"]}" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="14" font-weight="600" letter-spacing="2">PROJECT DETAILS</text></svg>')
w('graphics/guide-book-cover.svg', f'''<svg xmlns="http://www.w3.org/2000/svg" width="360" height="480" viewBox="0 0 360 480"><title>Homebuyer's Guide cover (lead magnet)</title>
<defs><filter id="sh" x="-20%" y="-20%" width="150%" height="150%"><feDropShadow dx="20" dy="24" stdDeviation="24" flood-color="#000" flood-opacity=".22"/></filter></defs>
<rect x="20" y="20" width="300" height="400" fill="{C["brand-dark"]}" filter="url(#sh)"/>
<rect x="20" y="20" width="8" height="400" fill="{C["brand"]}"/>
<text x="56" y="80" fill="{C["white"]}" font-family="Figtree, Arial, sans-serif" font-size="13" letter-spacing="3" font-weight="600">ASSETZ · 2026 EDITION</text>
<text fill="{C["white"]}" font-family="Libre Caslon Display, Georgia, serif" font-size="30"><tspan x="56" y="300">Bengaluru</tspan><tspan x="56" y="338">Premium</tspan><tspan x="56" y="376">Homebuyer's Guide</tspan></text>
<rect x="56" y="250" width="60" height="2" fill="{C["brand-light"]}"/></svg>''')
w('graphics/emi-ring.svg', f'''<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><title>EMI principal / interest ring (48% principal shown)</title>
<circle cx="80" cy="80" r="70" fill="none" stroke="{C["brand-light"]}" stroke-width="20"/>
<circle cx="80" cy="80" r="70" fill="none" stroke="{C["brand-dark"]}" stroke-width="20" stroke-dasharray="211.1 439.8" transform="rotate(-90 80 80)"/>
<text x="80" y="76" text-anchor="middle" fill="{C["brand-dark"]}" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="10">Total payable</text>
<text x="80" y="96" text-anchor="middle" fill="{C["brand-dark"]}" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="16" font-weight="700">₹3,12,41,636</text></svg>''')
w('graphics/counter-divider.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="1" height="180" viewBox="0 0 1 180"><title>Counter column rule</title><rect width="1" height="180" fill="{C["brand"]}" fill-opacity=".35"/></svg>')
w('graphics/hero-shade.svg', '''<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><title>Hero video legibility gradient</title><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-opacity=".38"/><stop offset=".22" stop-opacity="0"/><stop offset=".5" stop-opacity="0"/><stop offset="1" stop-opacity=".45"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#g)"/></svg>''')
w('graphics/location-pin.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><title>Location pin</title><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" fill="{C["brand"]}"/><circle cx="12" cy="9" r="2.5" fill="{C["white"]}"/></svg>')

# ---------- Palette ----------
sw = ''.join(f'<g transform="translate({i*150} 0)"><rect width="130" height="130" rx="8" fill="{v}" stroke="#2C191F" stroke-opacity=".15"/><text x="0" y="156" font-family="Figtree, Arial, sans-serif" font-size="14" font-weight="700" fill="#2C191F">{k}</text><text x="0" y="176" font-family="Figtree, Arial, sans-serif" font-size="13" fill="#2C191F">{v}</text></g>' for i, (k, v) in enumerate(C.items()))
w('palette/assetz-colour-palette.svg', f'<svg xmlns="http://www.w3.org/2000/svg" width="{len(C)*150}" height="190" viewBox="0 0 {len(C)*150} 190"><title>Approved colour palette (from the client Hostinger reference)</title>{sw}</svg>')
print('SVG assets written to', OUT)

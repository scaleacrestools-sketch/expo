#!/usr/bin/env python3
"""Build dist/gulati-bundle.html: both pages in one self-contained HTML file.

Used for Netlify's "import from URL" deploy path, which accepts a single HTML
document with every asset inlined. The multi-page source in the folder root
stays the canonical site; run this after changing it.
"""
import base64, mimetypes, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

def data_uri(path):
    mime = mimetypes.guess_type(path)[0] or "application/octet-stream"
    if path.endswith(".woff2"):
        mime = "font/woff2"
    with open(path, "rb") as fh:
        return f"data:{mime};base64,{base64.b64encode(fh.read()).decode()}"

def read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()

home = read("index.html")
locs = read("locations/index.html")

# ---- CSS with fonts and images inlined -----------------------------------
fonts_css = re.sub(r"url\('([^']+)'\)", lambda m: f"url({data_uri('assets/fonts/' + m.group(1))})", read("assets/fonts/fonts.css"))
style = read("assets/css/style.css")
style = re.sub(r'url\("\.\./img/([^"]+)"\)', lambda m: f'url("{data_uri("assets/img/" + m.group(1))}")', style)
style += "\n/* bundle routing */\n[data-view][hidden] { display: none !important; }\n"

# ---- Pieces ---------------------------------------------------------------
def between(s, start, end):
    i = s.index(start); j = s.index(end, i) + len(end)
    return s[i:j]

head = home[: home.index("</head>")]
head = re.sub(r'\s*<link rel="preload"[^>]*>', "", head)
head = re.sub(r'\s*<link rel="stylesheet" href="/assets/fonts/fonts.css">', "", head)
head = head.replace('<link rel="stylesheet" href="/assets/css/style.css">', f"<style>\n{fonts_css}\n{style}\n</style>")
head = head.replace('href="/assets/img/roundel.png"', f'href="{data_uri("assets/img/roundel.png")}"')

header = between(home, '<header class="site-header">', "</nav>")
main_home = between(home, "<main>", "</main>")
main_locs = between(locs, "<main>", "</main>")
footer = between(home, '<div class="band"', "</footer>")

js = read("assets/js/main.js")
router = """
/* ---- Bundle router: one document, two views ---- */
(function () {
  var views = { home: document.querySelector('[data-view="home"]'), locations: document.querySelector('[data-view="locations"]') };
  function route() {
    var h = location.hash || '#/';
    var isLoc = h.indexOf('#/locations') === 0;
    views.home.hidden = isLoc;
    views.locations.hidden = !isLoc;
    var target = (!isLoc && h.length > 1 && h.charAt(1) !== '/') ? document.getElementById(h.slice(1)) : null;
    if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    else if (h === '#/' || isLoc) { window.scrollTo({ top: 0, behavior: 'auto' }); }
    document.title = isLoc ? 'Our Locations — Gulati' : 'Gulati — Great Indian Food, New Delhi & Gurugram | Since 1959';
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      var r = el.getBoundingClientRect(); if (r.top < window.innerHeight) el.classList.add('in');
    });
  }
  window.addEventListener('hashchange', route);
  route();
})();
"""

def rewrite_links(s):
    s = s.replace('href="/locations/"', 'href="#/locations"')
    s = s.replace('href="/#', 'href="#')
    s = s.replace('href="/"', 'href="#/"')
    return s

body = rewrite_links(header + "\n" +
    '<div data-view="home"><main>' + main_home[len("<main>"):-len("</main>")] + "</main></div>\n" +
    '<div data-view="locations" hidden><main>' + main_locs[len("<main>"):-len("</main>")] + "</main></div>\n" +
    footer)

# inline every image
body = re.sub(r'src="/assets/img/([^"]+)"', lambda m: f'src="{data_uri("assets/img/" + m.group(1))}"', body)
body = body.replace('<script src="/assets/js/main.js" defer></script>', "")

html = head + "</head>\n<body>\n" + body + "\n<script>\n" + js + router + "</script>\n</body>\n</html>\n"
os.makedirs("dist", exist_ok=True)
with open("dist/gulati-bundle.html", "w", encoding="utf-8") as fh:
    fh.write(html)
print("dist/gulati-bundle.html", f"{len(html.encode())/1e6:.1f} MB")

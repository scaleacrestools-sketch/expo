#!/usr/bin/env python3
"""Full URL inventory of the live site from the read-only capture (content/legacy). Writes CSV + Markdown."""
import csv, gzip, json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
d = json.load(gzip.open(ROOT / "content/legacy/content.json.gz"))
audit = {a["path"]: a for a in json.load(gzip.open(ROOT / "content/legacy/audit.json.gz"))}
src = {}
for line in open(ROOT / "content/legacy/urls.tsv"):
    parts = line.rstrip("\n").split("\t")
    if len(parts) >= 2: src[parts[1].replace("https://scaleacres.com", "")] = parts[0]

def kind(p):
    path, bc = p["path"], p["bodyClass"]
    if p["status"] != 200: return "error"
    if path == "/": return "home"
    if "single-post" in bc: return "post"
    if re.match(r"^/blog/(category|tag|author)/", path) or re.match(r"^/blog/\d{4}/", path) or path == "/blog/": return "archive"
    if "elementskit-content" in path: return "fragment"
    if path in ("/privacy-policy/", "/terms-conditions/"): return "legal"
    if path == "/contact-us/": return "contact"
    if path in ("/case-studies/", "/yugen-case-study/") or path.startswith("/blog/casestudy/"): return "case"
    if path == "/our-work/": return "work"
    if path in ("/about-us/", "/our-team/", "/careers/"): return "company"
    if path == "/our-services/": return "services"
    if re.search(r"(ppc-service|facebook-ads-agency|social-media-marketing-agency|web-development|lead-generation-agency|branding-agency|seo-service)/$", path): return "service"
    return "location"
TEMPLATE = {"home": "Approved homepage", "post": "Blog article", "archive": "Blog / archive listing", "fragment": "Main informational page (menu fragment)", "legal": "Legal page", "contact": "Contact page", "case": "Case study page", "work": "Portfolio listing", "company": "Main informational page", "services": "Service overview", "service": "Individual service page", "location": "Location SEO landing page", "error": "— (live 404, not recreated)"}

def types(raws):
    t = []
    for r in raws:
        try:
            j = json.loads(r); g = j.get("@graph", [j])
            for n in g: t += [n.get("@type")] if isinstance(n.get("@type"), str) else (n.get("@type") or [])
        except Exception: t.append("unparsed")
    return sorted(set(t))

rows = []
for p in sorted(d["pages"], key=lambda x: x["path"]):
    a = audit.get(p["path"], {})
    h = p.get("headings") or {"h1": [], "h2": [], "h3": []}
    robots = p.get("robots") or ""
    k = kind(p)
    rows.append({
        "url": "https://scaleacres.com" + p["path"],
        "discovered_via": src.get(p["path"], "internal link"),
        "status": p["status"],
        "title": p.get("title"),
        "meta_description": p.get("metaDescription") or "",
        "h1": " | ".join(h["h1"]),
        "h2_count": len(h["h2"]), "h3_count": len(h["h3"]),
        "h2": " | ".join(dict.fromkeys(h["h2"])), "h3": " | ".join(dict.fromkeys(h["h3"])),
        "word_count_visible": (p.get("coverage") or {}).get("visibleWords"),
        "capture_coverage": (p.get("coverage") or {}).get("ratio"),
        "images": len([i for i in a.get("images", []) if not i.get("decorative")]),
        "images_missing_alt": len([i for i in a.get("images", []) if not i.get("decorative") and not (i.get("alt") or "").strip()]),
        "internal_links": len({l["href"] for l in a.get("links", []) if l["href"].startswith("/")}),
        "canonical": p.get("canonical") or "",
        "robots": robots,
        "indexable": "no" if ("noindex" in robots or p["status"] != 200) else ("canonicalised elsewhere" if p.get("canonical") and p["canonical"] != "https://scaleacres.com" + p["path"] else "yes"),
        "structured_data": ", ".join(types(p.get("jsonld", []))),
        "breadcrumbs": " > ".join(c["name"] for c in (p.get("breadcrumbs") or [])),
        "published": (p.get("article") or {}).get("datePublished") or "",
        "author": (p.get("article") or {}).get("author") or "",
        "current_template": p.get("template") + " / " + " ".join(c for c in p["bodyClass"].split() if c.startswith(("page-template", "single", "archive", "category", "tag", "author", "date"))),
        "proposed_template": TEMPLATE[k],
        "new_url": "—" if p["status"] != 200 else p["path"],
    })
cols = list(rows[0].keys())
with open(out / "url-inventory.csv", "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=cols); w.writeheader(); w.writerows(rows)
from collections import Counter
c = Counter(r["proposed_template"] for r in rows)
md = ["# URL inventory — scaleacres.com (captured read-only, %s)" % d["capturedAt"], "",
      f"Total URLs discovered: **{len(rows)}** (sitemaps: {sum(1 for r in rows if r['discovered_via']!='internal link')}, internal links only: {sum(1 for r in rows if r['discovered_via']=='internal link')})", "",
      "| Proposed template | URLs |", "|---|---|"] + [f"| {k} | {v} |" for k, v in c.most_common()] + ["",
      "Full per-URL data (title, meta description, H1, H2/H3, word count, images, alt gaps, internal links, canonical, robots, indexability, structured data, breadcrumbs, dates, templates): `url-inventory.csv`.", "",
      "| URL | Status | Indexable | Title | H1 | Proposed template |", "|---|---|---|---|---|---|"]
for r in rows: md.append(f"| {r['url']} | {r['status']} | {r['indexable']} | {(r['title'] or '').replace('|','/')} | {r['h1'].replace('|','/')[:80]} | {r['proposed_template']} |")
(out / "url-inventory.md").write_text("\n".join(md))
print(len(rows), c)

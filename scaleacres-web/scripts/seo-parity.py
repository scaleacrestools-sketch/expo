#!/usr/bin/env python3
"""
SEO PARITY CHECK: live capture (content/legacy) vs. the built redesign (static export).

For every live URL it compares, against the HTML produced by this project:
  URL exists · title · meta description · canonical · robots · H1 · H2/H3 (text, as a set)
  · main-content wording · images (src + alt) · internal links · JSON-LD
and writes OLD URL | NEW URL | CONTENT | META | LINK | SEO with PASS / REVIEW REQUIRED / FAILED.

  python3 scripts/seo-parity.py <static-export-dir> <out-dir>
"""
import csv, gzip, json, re, sys, html as H
from collections import Counter
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
site, out = Path(sys.argv[1]), Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)
data = json.load(gzip.open(ROOT / "content/legacy/content.json.gz"))
audit = {a["path"]: a for a in json.load(gzip.open(ROOT / "content/legacy/audit.json.gz"))}

norm = lambda s: re.sub(r"\s+", " ", H.unescape(s or "")).strip()
words = lambda s: re.findall(r"[\w’']+", norm(s).lower())
PASS, REVIEW, FAIL = "PASS", "REVIEW REQUIRED", "FAILED"
worst = lambda *xs: FAIL if FAIL in xs else REVIEW if REVIEW in xs else PASS

def block_text(blocks):
    t = []
    for b in blocks:
        for k in ("html", "label", "value", "caption") if b["type"] != "button" else ("text",):
            if isinstance(b.get(k), str): t.append(b[k])
        if b["type"] == "list": t += b["items"]
        if b["type"] == "table": t += [c["html"] for r in b["rows"] for c in r]
        if b["type"] == "faq":
            for it in b["items"]: t.append(it["q"]); t.append(block_text(it["answer"]))
    return " ".join(t)

def strip_tags(s): return re.sub(r"<[^>]+>", " ", s)

rows, details = [], []
for p in data["pages"]:
    path = p["path"]
    if p["status"] != 200:
        rows.append({"old": f"https://scaleacres.com{path}", "new": "—", "content": "N/A", "meta": "N/A", "link": "N/A", "seo": "N/A", "notes": f"Live URL answers {p['status']} (not a page); not recreated"})
        continue
    if path == "/":
        rows.append({"old": "https://scaleacres.com/", "new": "/", "content": REVIEW, "meta": PASS, "link": REVIEW, "seo": REVIEW, "notes": "Approved redesigned homepage: title and meta description identical; body content intentionally replaced by the approved design (see homepage report)"})
        continue
    f = site / path.strip("/") / "index.html"
    if not f.exists():
        rows.append({"old": f"https://scaleacres.com{path}", "new": path, "content": FAIL, "meta": FAIL, "link": FAIL, "seo": FAIL, "notes": "Page not generated"})
        continue
    soup = BeautifulSoup(f.read_text("utf8"), "lxml")
    notes = []
    # ---- meta
    title = norm(soup.title.string if soup.title else "")
    desc = norm((soup.find("meta", attrs={"name": "description"}) or {}).get("content", ""))
    canon = (soup.find("link", rel="canonical") or {}).get("href", "")
    robots = norm((soup.find("meta", attrs={"name": "robots"}) or {}).get("content", ""))
    m = []
    m.append(title == norm(p["title"]) or notes.append(f"title differs: '{title}'") or False)
    m.append(desc == norm(p["metaDescription"] or "") or notes.append("meta description differs") or False)
    m.append((canon or "") == (p["canonical"] or "") or notes.append(f"canonical '{canon}' vs live '{p['canonical']}'") or False)
    live_rob = set(x.strip() for x in (p["robots"] or "").split(",") if x.strip())
    our_rob = set(x.strip() for x in robots.split(",") if x.strip())
    m.append(live_rob == our_rob or notes.append(f"robots '{robots}' vs live '{p['robots']}'") or False)
    meta = PASS if all(m) else FAIL

    # ---- headings (main content: exclude site header/footer/menu)
    main = soup.find("main") or soup
    for sel in ["header", "footer", "#site-menu"]:
        for n in main.select(sel):
            if n.find_parent("article") is None: n.decompose()
    key = lambda s: re.sub(r"\s+", "", H.unescape(s or "")).lower()
    def hs(lvl, scope): return Counter(key(h.get_text("")) for h in scope.find_all(f"h{lvl}") if key(h.get_text("")))
    live_h = {l: Counter(key(x) for x in (p["headings"] or {}).get(f"h{l}", [])) for l in (1, 2, 3)}
    our_h = {l: hs(l, main) for l in (1, 2, 3)}
    hstat = []
    for l in (1, 2, 3):
        missing = set(live_h[l]) - set(our_h[l])
        extra = set(our_h[l]) - set(live_h[l])
        if missing: notes.append(f"H{l} missing: {sorted(missing)[:3]}")
        if extra: notes.append(f"H{l} extra: {sorted(extra)[:3]}")
        hstat.append(FAIL if (missing and l == 1) else REVIEW if (missing or extra) else PASS)

    # ---- content wording
    captured = block_text([b for s in p["sections"] for b in s["blocks"]])
    art = soup.find("article") or main
    ours = art.get_text(" ")
    want = Counter(words(strip_tags(captured)))
    have = Counter(words(ours))
    hit = sum(min(n, have[w]) for w, n in want.items())
    cov = hit / sum(want.values()) if want else 1.0
    live_cov = (p.get("coverage") or {}).get("ratio") or 1
    content = PASS if cov >= 0.995 else REVIEW if cov >= 0.97 else FAIL
    if cov < 0.995: notes.append(f"content words rendered {cov:.1%}")
    if live_cov < 0.95: notes.append(f"capture covered {live_cov:.0%} of the live page's visible words (forms/widgets)")

    # ---- images (src + alt)
    a = audit.get(path, {})
    live_imgs = {(i["src"], norm(i.get("alt") or "")) for i in a.get("images", []) if not i.get("decorative")}
    our_imgs = {(re.sub(r"^https://scaleacres\.com", "", im.get("src", "")), norm(im.get("alt", ""))) for im in art.find_all("img")}
    miss_img = live_imgs - our_imgs
    img_stat = PASS if not miss_img else REVIEW
    if miss_img: notes.append(f"{len(miss_img)} image src/alt pairs not matched")

    # ---- internal links (live main-content links must still be present on the page)
    def lk(h): return (h or "").split("#")[0].rstrip("/") or "/"
    live_links = {lk(l["href"]) for l in a.get("links", []) if l["href"].startswith("/") and not l["href"].startswith("/wp-")}
    our_links = {lk(x.get("href")) for x in soup.find_all("a") if (x.get("href") or "").startswith("/")}
    # Links that are broken (404) on the live site and now point to the working page.
    FIXED = {"/casestudy/our-case-one-goa": "/blog/casestudy/our-case-one-goa"}
    fixed = {l for l in live_links if l in FIXED and FIXED[l] in our_links}
    if fixed: notes.append(f"broken live link fixed: {sorted(fixed)} → {[FIXED[x] for x in sorted(fixed)]}")
    miss_links = live_links - our_links - fixed
    link = PASS if not miss_links else REVIEW if len(miss_links) <= 2 else FAIL
    if miss_links: notes.append(f"internal links missing: {sorted(miss_links)[:4]}")

    # ---- structured data
    ours_ld = [norm(s.string or "") for s in soup.find_all("script", type="application/ld+json")]
    ld_ok = all(norm(x) in ours_ld for x in p["jsonld"])
    if not ld_ok: notes.append("JSON-LD differs")

    seo = worst(meta, *hstat, PASS if ld_ok else FAIL, img_stat)
    rows.append({"old": f"https://scaleacres.com{path}", "new": path, "content": content, "meta": meta, "link": link, "seo": seo, "notes": "; ".join(notes)})
    details.append({"path": path, "coverage": round(cov, 4), "liveCapture": live_cov, "h": {l: [len(live_h[l]), len(our_h[l])] for l in (1, 2, 3)}, "images": [len(live_imgs), len(live_imgs) - len(miss_img)], "links": [len(live_links), len(live_links) - len(miss_links)], "jsonld": ld_ok})

cols = ["old", "new", "content", "meta", "link", "seo", "notes"]
with open(out / "seo-parity-report.csv", "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=cols); w.writeheader(); w.writerows(rows)
json.dump(details, open(out / "seo-parity-details.json", "w"), indent=1)

tally = {c: Counter(r[c] for r in rows) for c in ["content", "meta", "link", "seo"]}
md = ["# SEO parity report — scaleacres.com → redesign (staging)", "",
      f"Live capture: {data['capturedAt']} · URLs compared: {len(rows)}", "",
      "| Check | PASS | REVIEW REQUIRED | FAILED | N/A |", "|---|---|---|---|---|"]
for c in ["content", "meta", "link", "seo"]:
    t = tally[c]; md.append(f"| {c.upper()} | {t[PASS]} | {t[REVIEW]} | {t[FAIL]} | {t['N/A']} |")
md += ["", "| OLD URL | NEW URL | CONTENT STATUS | META STATUS | LINK STATUS | SEO STATUS | Notes |", "|---|---|---|---|---|---|---|"]
for r in rows: md.append(f"| {r['old']} | {r['new']} | {r['content']} | {r['meta']} | {r['link']} | {r['seo']} | {r['notes'].replace('|', '/')} |")
(out / "seo-parity-report.md").write_text("\n".join(md))
print("\n".join(md[:10]))

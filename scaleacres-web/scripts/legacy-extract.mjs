#!/usr/bin/env node
/**
 * LEGACY CONTENT EXTRACTOR (read-only)
 * ------------------------------------------------------------------
 * Opens every live scaleacres.com URL in headless Chromium and records, verbatim:
 *  - status, redirects, title, meta description, robots, canonical, Open Graph, Twitter,
 *    JSON-LD (raw), breadcrumbs, article dates/author, body template classes
 *  - the main content (header, footer, popups and mega-menus excluded) as ordered blocks:
 *    heading, paragraph, list, table, image, button, faq, video, quote, stat, form
 *    grouped by the page's own top-level sections
 *  - every image (src + alt) and internal link inside the main content
 *  - a coverage figure: share of the visible main-content words captured in blocks
 * Nothing is rewritten. Inline markup keeps only a, strong, b, em, i, u, br, sup, sub.
 *
 *   node scripts/legacy-extract.mjs --urls urls.txt --out legacy/ [--concurrency 4]
 *
 * Writes one JSON file per URL (slugified path) into --out.
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : d);
const urls = (await readFile(opt("urls", "urls.txt"), "utf8")).split(/\s+/).filter(Boolean);
const out = opt("out", "legacy");
const conc = +opt("concurrency", "4");
await mkdir(out, { recursive: true });

const pw = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const browser = await pw.chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36 ScaleAcresMigrationAudit" });

const fileFor = (path) => (path === "/" ? "index" : path.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "__")) + ".json";

async function extract(url) {
  const page = await ctx.newPage();
  const redirects = [];
  page.on("response", (r) => {
    if (r.request().isNavigationRequest() && r.request().frame() === page.mainFrame() && [301, 302, 307, 308].includes(r.status()))
      redirects.push({ from: r.url(), status: r.status(), to: r.headers()["location"] });
  });
  let res;
  try {
    res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForLoadState("load", { timeout: 20000 }).catch(() => {});
    // Trigger lazy content.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);
  } catch (e) {
    await page.close();
    return { url, error: String(e).slice(0, 300) };
  }
  const headers = res ? await res.allHeaders() : {};
  const data = await page.evaluate(EXTRACT);
  await page.close();
  return {
    url,
    status: res?.status() ?? 0,
    finalUrl: data.finalUrl,
    redirects,
    xRobotsTag: headers["x-robots-tag"] ?? null,
    ...data,
  };
}

/* Runs inside the page. Must be self-contained. */
const EXTRACT = () => {
  const host = location.host;
  const abs = (u) => { try { return new URL(u, location.href); } catch { return null; } };
  const rel = (u) => {
    const x = abs(u);
    if (!x) return u;
    if (x.host === host || x.host === "www." + host) return x.pathname + x.search + x.hash;
    return x.href;
  };
  const meta = (sel) => document.querySelector(sel)?.getAttribute("content") ?? null;
  const metasBy = (attr, prefix) => Object.fromEntries([...document.querySelectorAll(`meta[${attr}^="${prefix}"]`)].map((m) => [m.getAttribute(attr), m.getAttribute("content")]));

  const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent.trim());
  let breadcrumbs = null, article = null;
  for (const raw of jsonld) {
    try {
      const j = JSON.parse(raw);
      const graph = j["@graph"] ?? [j];
      for (const n of graph) {
        if (n["@type"] === "BreadcrumbList") breadcrumbs = (n.itemListElement ?? []).map((i) => ({ name: i.name, url: i.item ? rel(typeof i.item === "string" ? i.item : i.item["@id"]) : null }));
        const t = [].concat(n["@type"]);
        if (t.includes("Article") || t.includes("BlogPosting") || t.includes("NewsArticle")) article = { headline: n.headline, datePublished: n.datePublished, dateModified: n.dateModified, author: n.author?.name ?? null, image: n.image?.url ?? (typeof n.image === "string" ? n.image : null), section: n.articleSection ?? null, keywords: n.keywords ?? null, wordCount: n.wordCount ?? null };
      }
    } catch {}
  }

  // ---------- main content root
  const EXCLUDE = [
    "header", "footer", "nav", "[data-elementor-type='header']", "[data-elementor-type='footer']", "[data-elementor-type='popup']",
    ".elementor-location-header", ".elementor-location-footer", ".elementskit-megamenu-panel", ".ekit-template-content-header",
    ".ekit-template-content-footer", "#wpadminbar", ".site-header", ".site-footer", "script", "style", "noscript", "template", "link",
    ".swiper-slide-duplicate", ".slick-cloned", "#cookie-notice", ".cky-consent-container", ".ast-mobile-popup-drawer",
  ].join(",");
  // The page's own Elementor document carries its post id (body class page-id-N / postid-N).
  const pid = document.body.className.match(/(?:page-id|postid)-(\d+)/)?.[1];
  const notChrome = (el) => !el.closest("header, footer, [data-elementor-type='header'], [data-elementor-type='footer'], [data-elementor-type='popup'], .elementskit-megamenu-panel, nav");
  const docs = [...document.querySelectorAll("[data-elementor-type]")].filter((d) => notChrome(d) && !["header", "footer", "popup"].includes(d.getAttribute("data-elementor-type")));
  const largest = docs.sort((a, b) => (b.innerText?.length ?? 0) - (a.innerText?.length ?? 0))[0];
  const root =
    (pid && document.querySelector(`[data-elementor-id="${pid}"]`)) ||
    (largest && (largest.innerText?.length ?? 0) > 200 ? largest : null) ||
    document.querySelector("main, #main, #primary, #content, .site-main, article") ||
    document.body;
  const isHidden = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return true;
    return false;
  };
  const inCollapsible = (el) => !!el.closest(".elementor-accordion, .elementor-toggle, .e-n-accordion, .elementskit-accordion, .elementor-tabs, .e-n-tabs, details, .ekit-wid-con .elementskit-faq, .wp-block-details");

  const INLINE_OK = new Set(["A", "STRONG", "B", "EM", "I", "U", "BR", "SUP", "SUB", "SPAN", "MARK", "SMALL", "CODE", "ABBR", "TIME", "LABEL", "FONT"]);
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (node) => {
    let h = "";
    for (const c of node.childNodes) {
      if (c.nodeType === 3) { h += esc(c.nodeValue); continue; }
      if (c.nodeType !== 1) continue;
      const t = c.tagName;
      if (c.matches(EXCLUDE) || t === "SVG" || t === "IMG" || t === "I" && !c.textContent.trim()) continue;
      if (t === "BR") { h += "<br>"; continue; }
      const inner = inline(c);
      if (t === "A") { const href = c.getAttribute("href"); h += href ? `<a href="${esc(rel(href))}"${c.target === "_blank" ? ' target="_blank"' : ""}>${inner}</a>` : inner; continue; }
      if (t === "STRONG" || t === "B") { h += inner.trim() ? `<strong>${inner}</strong>` : inner; continue; }
      if (t === "EM" || (t === "I" && inner.trim())) { h += `<em>${inner}</em>`; continue; }
      if (t === "U" || t === "SUP" || t === "SUB" || t === "CODE") { const k = t.toLowerCase(); h += `<${k}>${inner}</${k}>`; continue; }
      h += inner;
    }
    return h;
  };
  const clean = (h) => h.replace(/\s+/g, " ").replace(/(<br>\s*)+$/g, "").trim();
  const txt = (el) => (el.innerText ?? el.textContent ?? "").replace(/\s+/g, " ").trim();
  const imgSrc = (img) => {
    const cands = [img.getAttribute("data-src"), img.getAttribute("data-lazy-src"), img.currentSrc, img.getAttribute("src")].filter((s) => s && !s.startsWith("data:"));
    const ss = img.getAttribute("data-srcset") || img.getAttribute("srcset");
    if (ss) {
      const best = ss.split(",").map((p) => p.trim().split(/\s+/)).map(([u, w]) => [u, parseInt(w) || 0]).sort((a, b) => b[1] - a[1])[0];
      if (best?.[0]) return rel(best[0]);
    }
    return cands[0] ? rel(cands[0]) : null;
  };

  const BLOCKY = "P,H1,H2,H3,H4,H5,H6,UL,OL,TABLE,IMG,FIGURE,BLOCKQUOTE,IFRAME,VIDEO,FORM,DIV,SECTION,ARTICLE,HEADER,FOOTER,ASIDE,DL,PRE,HR,DETAILS,NAV,MAIN,PICTURE";
  const isBlockEl = (el) => BLOCKY.split(",").includes(el.tagName);
  const hasBlockChild = (el) => [...el.children].some((c) => isBlockEl(c) && !c.matches(EXCLUDE) && (txt(c) || c.querySelector("img,iframe,video")));

  const images = [];
  const pushImg = (img, blocks) => {
    const src = imgSrc(img);
    if (!src) return;
    const w = img.naturalWidth || +img.getAttribute("width") || 0;
    const h = img.naturalHeight || +img.getAttribute("height") || 0;
    const r = img.getBoundingClientRect();
    if ((w && w < 40 && h < 40) || (r.width && r.width < 28 && r.height < 28)) { images.push({ src, alt: img.getAttribute("alt") ?? null, decorative: true }); return; }
    const cap = img.closest("figure")?.querySelector("figcaption");
    images.push({ src, alt: img.getAttribute("alt") ?? null });
    blocks.push({ type: "image", src, alt: img.getAttribute("alt") ?? "", width: w || null, height: h || null, caption: cap ? clean(inline(cap)) : undefined });
  };

  function faqFrom(el) {
    const items = [];
    const sels = [
      [".elementor-accordion-item, .elementor-toggle-item", ".elementor-tab-title", ".elementor-tab-content"],
      [".e-n-accordion-item", ".e-n-accordion-item-title", "[role='region'], .e-con"],
      [".elementskit-accordion .elementskit-card, .elementskit-card", ".elementskit-card-header, .ekit-accordion--toggler", ".elementskit-card-body, .ekit-accordion--content"],
      ["details", "summary", null],
    ];
    for (const [item, q, a] of sels) {
      const its = el.querySelectorAll(item);
      if (!its.length) continue;
      for (const it of its) {
        const qe = it.querySelector(q);
        if (!qe) continue;
        const qText = txt(qe);
        const body = a ? it.querySelector(a) : it;
        const answer = [];
        if (body) walk(body, answer, true, qe);
        items.push({ q: qText, qTag: qe.querySelector("h1,h2,h3,h4,h5,h6")?.tagName.toLowerCase() ?? (/^H\d$/.test(qe.tagName) ? qe.tagName.toLowerCase() : null), answer });
      }
      if (items.length) break;
    }
    return items;
  }

  function walk(el, blocks, forceVisible = false, skip = null) {
    for (const c of el.children) {
      if (c === skip || c.matches(EXCLUDE)) continue;
      if (!forceVisible && !inCollapsible(c) && isHidden(c)) continue;
      const t = c.tagName;
      // Widgets with special handling
      if (c.matches(".elementor-widget-accordion, .elementor-widget-toggle, .elementor-widget-n-accordion, .elementor-widget-elementskit-accordion, .elementor-widget-elementskit-faq")) {
        const items = faqFrom(c);
        if (items.length) { blocks.push({ type: "faq", items }); continue; }
      }
      if (c.matches(".elementor-widget-counter, .elementor-counter")) {
        const n = c.querySelector(".elementor-counter-number-wrapper") ?? c.querySelector(".elementor-counter-number");
        const ti = c.querySelector(".elementor-counter-title");
        const pre = c.querySelector(".elementor-counter-number-prefix")?.textContent ?? "";
        const num = c.querySelector(".elementor-counter-number");
        const suf = c.querySelector(".elementor-counter-number-suffix")?.textContent ?? "";
        blocks.push({ type: "stat", value: `${pre}${num?.getAttribute("data-to-value") ?? (n ? txt(n) : "")}${suf}`.trim(), label: ti ? txt(ti) : "" });
        continue;
      }
      if (c.matches(".elementor-icon-list-items, .elementor-icon-list-items ~ *") && t === "UL") {
        const items = [...c.querySelectorAll(":scope > li")].map((li) => clean(inline(li))).filter(Boolean);
        if (items.length) blocks.push({ type: "list", ordered: false, items, variant: "icon" });
        continue;
      }
      if (/^H[1-6]$/.test(t)) { const h = clean(inline(c)); if (h) blocks.push({ type: "heading", level: +t[1], html: h, text: txt(c) }); continue; }
      if (t === "P") { const h = clean(inline(c)); if (h) blocks.push({ type: "paragraph", html: h }); c.querySelectorAll("img").forEach((i) => pushImg(i, blocks)); continue; }
      if (t === "UL" || t === "OL") {
        const items = [...c.querySelectorAll(":scope > li")].map((li) => {
          const nested = li.querySelector("ul,ol");
          let h = clean(inline(li));
          return h;
        }).filter(Boolean);
        if (items.length) blocks.push({ type: "list", ordered: t === "OL", items });
        continue;
      }
      if (t === "TABLE") {
        const rows = [...c.querySelectorAll("tr")].map((tr) => [...tr.children].map((td) => ({ h: td.tagName === "TH", html: clean(inline(td)) })));
        if (rows.length) blocks.push({ type: "table", rows });
        continue;
      }
      if (t === "IMG") { pushImg(c, blocks); continue; }
      if (t === "PICTURE") { const i = c.querySelector("img"); if (i) pushImg(i, blocks); continue; }
      if (t === "IFRAME") { const s = c.getAttribute("src") || c.getAttribute("data-src") || c.getAttribute("data-lazy-src"); if (s) blocks.push({ type: "video", embed: s, title: c.title || "" }); continue; }
      if (t === "VIDEO") { const s = c.currentSrc || c.getAttribute("src") || c.querySelector("source")?.getAttribute("src"); if (s) blocks.push({ type: "video", src: rel(s), poster: c.poster ? rel(c.poster) : null }); continue; }
      if (t === "BLOCKQUOTE") { const h = clean(inline(c)); if (h) blocks.push({ type: "quote", html: h }); continue; }
      if (t === "HR") { blocks.push({ type: "rule" }); continue; }
      if (t === "FORM" || c.matches(".wpforms-container, .elementor-widget-form, .wpcf7")) {
        const fields = [...c.querySelectorAll("label, input[placeholder], textarea[placeholder], select")].map((f) => (f.tagName === "LABEL" ? txt(f) : f.getAttribute("placeholder") || f.getAttribute("name"))).filter(Boolean);
        blocks.push({ type: "form", fields: [...new Set(fields)].slice(0, 20) });
        continue;
      }
      if (c.matches(".elementor-widget-video, .elementor-widget-wistia, .wistia_embed, .wistia_responsive_padding")) {
        let set = {}; try { set = JSON.parse(c.getAttribute("data-settings") || "{}"); } catch {}
        const yt = set.youtube_url || set.vimeo_url || set.hosted_url?.url;
        const w = c.querySelector("[class*='wistia_async_']")?.className.match(/wistia_async_(\w+)/)?.[1];
        if (yt || w) { blocks.push({ type: "video", embed: yt || `https://fast.wistia.net/embed/iframe/${w}` }); continue; }
      }
      if (t === "A" && (c.matches(".elementor-button, .elementor-button-link, .wp-block-button__link, .ekit-btn, .elementskit-btn, .btn, [class*='button']"))) {
        const label = txt(c);
        if (label) blocks.push({ type: "button", href: rel(c.getAttribute("href") || "#"), text: label });
        continue;
      }
      // Generic containers
      if (hasBlockChild(c) || c.querySelector("img,iframe,video")) {
        if (!hasBlockChild(c) && txt(c)) {
          // inline text plus an image (e.g. icon + text)
          c.querySelectorAll("img").forEach((i) => pushImg(i, blocks));
          const h = clean(inline(c));
          if (h) blocks.push(t === "A" ? { type: "button", href: rel(c.getAttribute("href") || "#"), text: txt(c) } : { type: "paragraph", html: h, loose: true });
          continue;
        }
        walk(c, blocks, forceVisible);
        continue;
      }
      const h = clean(inline(c));
      if (h) {
        if (t === "A") blocks.push({ type: "button", href: rel(c.getAttribute("href") || "#"), text: txt(c) });
        else blocks.push({ type: "paragraph", html: h, loose: true });
      }
    }
  }

  // ---------- sections
  let sectionEls = [...root.querySelectorAll(":scope > .e-parent, :scope > .elementor-section, :scope > .elementor-top-section, :scope > div > .e-parent, :scope > .elementor-inner > .elementor-section-wrap > .elementor-section, :scope > .elementor-section-wrap > .elementor-section")];
  if (!sectionEls.length) sectionEls = [root];
  const sections = [];
  for (const s of sectionEls) {
    if (s.matches(EXCLUDE) || isHidden(s)) continue;
    const blocks = [];
    walk(s, blocks);
    if (!blocks.length) continue;
    const cs = getComputedStyle(s);
    const bgImg = cs.backgroundImage && cs.backgroundImage !== "none" ? (cs.backgroundImage.match(/url\("?([^")]+)"?\)/)?.[1] ?? null) : null;
    sections.push({ id: s.id || null, bg: cs.backgroundColor, bgImage: bgImg ? rel(bgImg) : null, blocks });
  }

  // Dedupe consecutive identical text blocks (responsive duplicates)
  const seen = new Set();
  for (const s of sections) {
    s.blocks = s.blocks.filter((b) => {
      const k = b.type + ":" + (b.html ?? b.text ?? b.src ?? b.embed ?? JSON.stringify(b.items ?? b.rows ?? ""));
      if ((b.type === "paragraph" || b.type === "heading" || b.type === "image") && seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  // ---------- coverage
  const words = (s) => (s.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []);
  const rootText = (() => {
    const clone = root.cloneNode(true);
    clone.querySelectorAll(EXCLUDE).forEach((n) => n.remove());
    return root.innerText ?? clone.textContent;
  })();
  const blockText = JSON.stringify(sections).replace(/<[^>]+>/g, " ");
  const bag = new Map();
  for (const w of words(blockText)) bag.set(w, (bag.get(w) ?? 0) + 1);
  const vis = words(rootText);
  let hit = 0;
  for (const w of vis) { const n = bag.get(w); if (n) { hit++; bag.set(w, n - 1); } }

  const links = [...root.querySelectorAll("a[href]")].filter((a) => !a.closest(EXCLUDE)).map((a) => ({ href: rel(a.getAttribute("href")), text: txt(a).slice(0, 120) }));
  const hs = (n) => [...document.querySelectorAll(`h${n}`)].filter((h) => !h.closest("header, footer, [data-elementor-type='header'], [data-elementor-type='footer'], [data-elementor-type='popup'], .elementskit-megamenu-panel")).map(txt).filter(Boolean);
  const allH = (n) => [...document.querySelectorAll(`h${n}`)].map(txt).filter(Boolean);

  return {
    finalUrl: location.href,
    lang: document.documentElement.lang,
    title: document.title,
    metaDescription: meta('meta[name="description"]'),
    robots: meta('meta[name="robots"]'),
    canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
    og: metasBy("property", "og:"),
    articleMeta: metasBy("property", "article:"),
    twitter: metasBy("name", "twitter:"),
    jsonld,
    breadcrumbs,
    article,
    bodyClass: document.body.className,
    template: root.getAttribute("data-elementor-type") ?? root.tagName.toLowerCase(),
    headings: { h1: hs(1), h2: hs(2), h3: hs(3), h4: hs(4), h5: hs(5), h6: hs(6) },
    headingsAll: { h1: allH(1), h2: allH(2), h3: allH(3) },
    sections,
    images,
    links,
    coverage: { visibleWords: vis.length, captured: hit, ratio: vis.length ? +(hit / vis.length).toFixed(3) : 1 },
  };
};

let i = 0, done = 0;
const results = [];
async function worker() {
  while (i < urls.length) {
    const u = urls[i++];
    const r = await extract(u);
    r.path = (() => { try { return new URL(u).pathname; } catch { return u; } })();
    r.textHash = createHash("sha1").update(JSON.stringify(r.sections ?? "")).digest("hex").slice(0, 12);
    await writeFile(`${out}/${fileFor(r.path)}`, JSON.stringify(r));
    results.push({ path: r.path, status: r.status, title: r.title, coverage: r.coverage?.ratio, sections: r.sections?.length, error: r.error });
    done++;
    if (done % 10 === 0) console.log(`${done}/${urls.length}`);
  }
}
await Promise.all(Array.from({ length: conc }, worker));
await writeFile(`${out}/_index.json`, JSON.stringify(results.sort((a, b) => a.path.localeCompare(b.path)), null, 1));
await browser.close();
console.log(`done ${done}`);

#!/usr/bin/env node
/**
 * ScaleAcres SEO baseline + parity tool (no dependencies, Node 18+).
 *
 *   # 1. Capture the protected baseline from the live WordPress site
 *   node scripts/seo-audit.mjs crawl --base https://scaleacres.com --out seo/baseline.json
 *
 *   # 2. Crawl the candidate (staging / local) for the same URL list
 *   node scripts/seo-audit.mjs crawl --base http://localhost:3000 --urls-from seo/baseline.json --out seo/candidate.json
 *
 *   # 3. Compare → PASS / REVIEW REQUIRED / FAILED per URL
 *   node scripts/seo-audit.mjs compare seo/baseline.json seo/candidate.json --out seo/parity-report.md --csv seo/parity-report.csv
 *
 * The crawl reads every sitemap listed in robots.txt (and /sitemap.xml, /sitemap_index.xml),
 * then follows same-host links up to --max pages. Per URL it records: final status, redirect
 * chain, title, meta description, meta robots, X-Robots-Tag, canonical, H1/H2/H3, JSON-LD
 * @types, internal links, image src+alt, visible word count and a body-text fingerprint.
 */
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { createHash } from "node:crypto";

const args = process.argv.slice(2);
const cmd = args[0];
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const UA = "ScaleAcres-SEO-Parity/1.0 (+migration audit)";

// ---------- HTML helpers (regex-based; adequate for server-rendered WordPress/Next HTML)
const decode = (s = "") =>
  s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#x27;/g, "'").replace(/&#8217;|&rsquo;/g, "’").replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—").replace(/&nbsp;|&#160;/g, " ").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n));
const strip = (s = "") => decode(s.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? decode(m[2] ?? m[3] ?? m[4] ?? "") : undefined;
};
const metaContent = (html, key, val) => {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) if ((attr(tag, key) ?? "").toLowerCase() === val) return attr(tag, "content");
  return undefined;
};
const headings = (html, level) => [...html.matchAll(new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)<\\/h${level}>`, "gi"))].map((m) => strip(m[1])).filter(Boolean);

function extract(html, url) {
  const u = new URL(url);
  const body = html.match(/<body\b[\s\S]*<\/body>/i)?.[0] ?? html;
  const main = body.replace(/<(header|nav|footer)\b[\s\S]*?<\/\1>/gi, " ");
  const text = strip(main);
  const canonicalTag = (html.match(/<link\b[^>]*rel\s*=\s*["']?canonical["']?[^>]*>/i) ?? [])[0];
  const links = new Set();
  for (const m of body.matchAll(/<a\b[^>]*href\s*=\s*("([^"]*)"|'([^']*)')/gi)) {
    try {
      const href = new URL(decode(m[2] ?? m[3]), url);
      if (href.host === u.host) links.add(href.pathname + (href.search || ""));
    } catch {}
  }
  const images = [...body.matchAll(/<img\b[^>]*>/gi)].map((m) => ({ src: attr(m[0], "src") ?? "", alt: attr(m[0], "alt") ?? null }));
  const schema = [];
  for (const m of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = (n) => {
        if (Array.isArray(n)) return n.forEach(walk);
        if (n && typeof n === "object") {
          if (n["@type"]) schema.push(...[].concat(n["@type"]));
          if (n["@graph"]) walk(n["@graph"]);
        }
      };
      walk(JSON.parse(m[1]));
    } catch { schema.push("INVALID_JSON_LD"); }
  }
  return {
    title: strip((html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) ?? [])[1] ?? ""),
    metaDescription: metaContent(html, "name", "description") ?? null,
    metaRobots: metaContent(html, "name", "robots") ?? null,
    canonical: canonicalTag ? attr(canonicalTag, "href") ?? null : null,
    ogTitle: metaContent(html, "property", "og:title") ?? null,
    h1: headings(html, 1), h2: headings(html, 2), h3: headings(html, 3),
    schema: [...new Set(schema)].sort(),
    internalLinks: [...links].sort(),
    images,
    wordCount: text ? text.split(" ").length : 0,
    text,
    textHash: createHash("sha1").update(text).digest("hex").slice(0, 12),
  };
}

async function fetchFollow(url, max = 10) {
  const chain = [];
  let current = url;
  for (let i = 0; i < max; i++) {
    const res = await fetch(current, { redirect: "manual", headers: { "User-Agent": UA } });
    chain.push({ url: current, status: res.status });
    const loc = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && loc) { current = new URL(loc, current).toString(); continue; }
    return { res, chain, finalUrl: current, xRobots: res.headers.get("x-robots-tag") };
  }
  throw new Error(`Redirect loop: ${url}`);
}

async function sitemapUrls(base) {
  const seen = new Set(), urls = new Set();
  const queue = [];
  try {
    const robots = await (await fetch(`${base}/robots.txt`, { headers: { "User-Agent": UA } })).text();
    for (const m of robots.matchAll(/^sitemap:\s*(\S+)/gim)) queue.push(m[1]);
  } catch {}
  queue.push(`${base}/sitemap.xml`, `${base}/sitemap_index.xml`);
  while (queue.length) {
    const sm = queue.shift();
    if (seen.has(sm)) continue;
    seen.add(sm);
    try {
      const r = await fetch(sm, { headers: { "User-Agent": UA } });
      if (!r.ok) continue;
      const xml = await r.text();
      const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => decode(m[1]));
      if (/<sitemapindex/i.test(xml)) queue.push(...locs);
      else locs.forEach((l) => urls.add(l));
    } catch {}
  }
  return { sitemaps: [...seen], urls: [...urls] };
}

async function crawl() {
  const base = opt("base").replace(/\/$/, "");
  const out = opt("out", "seo/crawl.json");
  const max = +opt("max", "2000");
  let paths;
  let sitemaps = [];
  const urlsFrom = opt("urls-from");
  if (urlsFrom) {
    paths = JSON.parse(await readFile(urlsFrom, "utf8")).pages.map((p) => p.path);
  } else {
    const sm = await sitemapUrls(base);
    sitemaps = sm.sitemaps;
    paths = sm.urls.map((u) => { const x = new URL(u); return x.pathname + x.search; });
    if (!paths.includes("/")) paths.unshift("/");
  }
  const queue = [...new Set(paths)];
  const seen = new Set();
  const pages = [];
  const follow = !urlsFrom;
  while (queue.length && pages.length < max) {
    const path = queue.shift();
    if (seen.has(path)) continue;
    seen.add(path);
    try {
      const { res, chain, finalUrl, xRobots } = await fetchFollow(base + path);
      const type = res.headers.get("content-type") ?? "";
      const page = { path, status: chain[0].status, finalStatus: res.status, redirectChain: chain.length > 1 ? chain : [], finalPath: new URL(finalUrl).pathname, xRobotsTag: xRobots ?? null };
      if (type.includes("text/html")) {
        const data = extract(await res.text(), finalUrl);
        Object.assign(page, data);
        if (follow) for (const l of data.internalLinks) {
          const clean = l.split("#")[0];
          if (!seen.has(clean) && !/\.(jpg|jpeg|png|webp|gif|svg|pdf|zip|mp4|css|js)(\?|$)/i.test(clean) && !clean.startsWith("/wp-")) queue.push(clean);
        }
      }
      pages.push(page);
      process.stdout.write(`\r${pages.length} crawled  ${path.slice(0, 80).padEnd(80)}`);
    } catch (e) {
      pages.push({ path, status: 0, error: String(e) });
    }
  }
  process.stdout.write("\n");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, JSON.stringify({ base, crawledAt: new Date().toISOString(), sitemaps, pages }, null, 2));
  console.log(`Wrote ${pages.length} pages to ${out}`);
}

// ---------- compare
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const norm = (u, base) => { try { const x = new URL(u, base); return x.pathname; } catch { return u; } };

function judge(o, n, oldBase, newBase) {
  const issues = [], reviews = [];
  if (!n) return { verdict: "FAILED", issues: ["Not crawled on candidate"], reviews };
  if (o.finalStatus === 200 && n.finalStatus !== 200) issues.push(`Status ${o.finalStatus} → ${n.finalStatus}`);
  if (n.redirectChain.length > 2) issues.push(`Redirect chain of ${n.redirectChain.length - 1} hops`);
  if (o.redirectChain.length === 0 && n.redirectChain.length) reviews.push(`New redirect to ${n.finalPath}`);
  if (o.finalPath !== n.finalPath && !(n.redirectChain.length)) issues.push(`Final path changed ${o.finalPath} → ${n.finalPath}`);
  if (o.title !== n.title) issues.push(`Title changed: "${o.title}" → "${n.title}"`);
  if ((o.metaDescription ?? "") !== (n.metaDescription ?? "")) issues.push("Meta description changed");
  if (!same(o.h1, n.h1)) issues.push(`H1 changed: ${JSON.stringify(o.h1)} → ${JSON.stringify(n.h1)}`);
  if (norm(o.canonical, oldBase) !== norm(n.canonical, newBase)) issues.push(`Canonical changed: ${o.canonical} → ${n.canonical}`);
  const noindex = (p) => /noindex/i.test(`${p.metaRobots ?? ""} ${p.xRobotsTag ?? ""}`);
  if (!noindex(o) && noindex(n)) issues.push("Became noindex");
  const lostSchema = (o.schema ?? []).filter((t) => !(n.schema ?? []).includes(t));
  if (lostSchema.length) issues.push(`Schema types lost: ${lostSchema.join(", ")}`);
  const lostH2 = (o.h2 ?? []).filter((h) => !(n.h2 ?? []).includes(h));
  const lostH3 = (o.h3 ?? []).filter((h) => !(n.h3 ?? []).includes(h));
  if (lostH2.length) reviews.push(`H2 missing (${lostH2.length}): ${lostH2.slice(0, 5).join(" | ")}`);
  if (lostH3.length) reviews.push(`H3 missing (${lostH3.length}): ${lostH3.slice(0, 5).join(" | ")}`);
  const lostLinks = (o.internalLinks ?? []).filter((l) => !(n.internalLinks ?? []).includes(l));
  if (lostLinks.length) reviews.push(`Internal links missing (${lostLinks.length}): ${lostLinks.slice(0, 8).join(", ")}`);
  if (o.wordCount && n.wordCount < o.wordCount * 0.9) issues.push(`Body copy shrank ${o.wordCount} → ${n.wordCount} words`);
  else if (o.textHash !== n.textHash) reviews.push(`Body text differs (${o.wordCount} → ${n.wordCount} words)`);
  const oldAlts = new Map((o.images ?? []).map((i) => [i.src.split("/").pop(), i.alt]));
  const missingAlt = (n.images ?? []).filter((i) => i.alt === null).length;
  if (missingAlt) reviews.push(`${missingAlt} images without alt attribute`);
  const altLost = [...oldAlts].filter(([, alt]) => alt && !(n.images ?? []).some((i) => i.alt === alt)).length;
  if (altLost) reviews.push(`${altLost} image alt texts not present on candidate`);
  return { verdict: issues.length ? "FAILED" : reviews.length ? "REVIEW REQUIRED" : "PASS", issues, reviews };
}

async function compare() {
  const [oldFile, newFile] = args.slice(1, 3);
  const out = opt("out", "seo/parity-report.md");
  const csv = opt("csv");
  const old = JSON.parse(await readFile(oldFile, "utf8"));
  const cand = JSON.parse(await readFile(newFile, "utf8"));
  const byPath = new Map(cand.pages.map((p) => [p.path, p]));
  const rows = old.pages.filter((p) => p.finalStatus === 200 || p.redirectChain?.length).map((o) => ({ o, n: byPath.get(o.path), ...judge(o, byPath.get(o.path), old.base, cand.base) }));
  const count = (v) => rows.filter((r) => r.verdict === v).length;
  let md = `# SEO parity report\n\nBaseline: ${old.base} (${old.crawledAt})\nCandidate: ${cand.base} (${cand.crawledAt})\n\n| Verdict | URLs |\n|---|---|\n| PASS | ${count("PASS")} |\n| REVIEW REQUIRED | ${count("REVIEW REQUIRED")} |\n| FAILED | ${count("FAILED")} |\n\n`;
  md += `| URL | Old status | New status | Verdict | Blocking issues | Review notes |\n|---|---|---|---|---|---|\n`;
  for (const r of rows) md += `| \`${r.o.path}\` | ${r.o.finalStatus} | ${r.n?.finalStatus ?? "—"} | **${r.verdict}** | ${r.issues.join("<br>") || "—"} | ${r.reviews.join("<br>") || "—"} |\n`;
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, md);
  if (csv) {
    const esc = (s) => `"${String(s).replace(/"/g, '""')}"`;
    const lines = ["url,old_status,new_status,verdict,issues,reviews", ...rows.map((r) => [r.o.path, r.o.finalStatus, r.n?.finalStatus ?? "", r.verdict, r.issues.join(" | "), r.reviews.join(" | ")].map(esc).join(","))];
    await writeFile(csv, lines.join("\n"));
  }
  console.log(`PASS ${count("PASS")} · REVIEW ${count("REVIEW REQUIRED")} · FAILED ${count("FAILED")} → ${out}`);
  if (count("FAILED")) process.exitCode = 1;
}

if (cmd === "crawl") await crawl();
else if (cmd === "compare") await compare();
else console.log("Usage: seo-audit.mjs crawl --base <url> [--urls-from baseline.json] [--out file] [--max n]\n       seo-audit.mjs compare <baseline.json> <candidate.json> [--out report.md] [--csv report.csv]");

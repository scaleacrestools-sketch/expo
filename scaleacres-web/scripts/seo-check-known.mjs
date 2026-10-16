#!/usr/bin/env node
/**
 * Checks the rendered site against every SEO value we already hold
 * (content/seo/pages.ts + content/seo/homepage.ts). It does NOT replace the live-site
 * comparison (`npm run seo:compare`): unknown values are reported as MISSING, never guessed.
 *
 *   node scripts/seo-check-known.mjs http://localhost:3000
 */
import { readFile } from "node:fs/promises";
import http from "node:http";

/** GET with an explicit Host header (fetch() ignores custom Host headers). */
function get(url, host) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const req = http.request({ hostname: u.hostname, port: u.port, path: u.pathname + u.search, method: "GET", headers: { host } }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve({ status: res.statusCode, headers: { get: (k) => res.headers[k.toLowerCase()] ?? null }, text: async () => body }));
    });
    req.on("error", () => resolve(null));
    req.end();
  });
}

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const PROD = "https://scaleacres.com";
const root = new URL("..", import.meta.url);
const pagesSrc = await readFile(new URL("content/seo/pages.ts", root), "utf8");
const homeSrc = await readFile(new URL("content/seo/homepage.ts", root), "utf8");

const registry = [...pagesSrc.matchAll(/\{ path: "([^"]+)", title: "([^"]+)", type: "([^"]+)", serveFrom: "([^"]+)"(?:, nextRoute: "([^"]+)")?/g)]
  .map((m) => ({ path: m[1], title: m[2], type: m[3], serveFrom: m[4], nextRoute: m[5] }));

const field = (name) => {
  const block = homeSrc.match(new RegExp(`\\b${name}: \\{([\\s\\S]*?)\\n  \\},`))?.[1] ?? "";
  const value = block.match(/value:\s*\n?\s*"((?:[^"\\]|\\.)*)"/)?.[1] ?? null;
  const verified = /verified:\s*true/.test(block);
  return { value: value?.replace(/\\"/g, '"'), verified };
};
const home = Object.fromEntries(["title", "metaDescription", "h1", "positioning", "intro", "boilerplate", "servicesHeading"].map((k) => [k, field(k)]));

const decode = (s) => s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const text = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");

const rows = [];
let failures = 0;
const add = (scope, check, status, detail = "") => {
  if (status === "FAIL") failures++;
  rows.push({ scope, check, status, detail });
};

for (const p of registry.filter((r) => r.nextRoute)) {
  const res = await get(base + p.nextRoute, "scaleacres.com");
  if (!res) { add(p.path, "reachable", "FAIL", "request failed"); continue; }
  add(p.path, "HTTP 200 at same path", res.status === 200 ? "PASS" : "FAIL", String(res.status));
  if (res.status !== 200) continue;
  const html = await res.text();
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  add(p.path, "title = indexed title", title === p.title ? "PASS" : "FAIL", title === p.title ? "" : `"${title}" ≠ "${p.title}"`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  add(p.path, "self canonical", canonical === PROD + p.path ? "PASS" : "FAIL", canonical ?? "missing");
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1]).trim());
  add(p.path, "exactly one H1", h1s.length === 1 ? "PASS" : "FAIL", h1s.join(" | "));
  const robotsMeta = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] ?? "";
  const xr = res.headers.get("x-robots-tag") ?? "";
  add(p.path, "indexable on production host", /noindex/.test(robotsMeta + xr) ? "FAIL" : "PASS", robotsMeta || xr);
  if (p.serveFrom === "wordpress") add(p.path, "served from WordPress in production", "INFO", "Body, meta description, headings and schema stay WordPress' own until migrated");

  if (p.path === "/") {
    const body = text(html);
    for (const k of ["h1", "positioning", "intro", "boilerplate", "servicesHeading"]) {
      const f = home[k];
      if (!f.value) { add("/", `${k} present`, "MISSING", "not captured from live site"); continue; }
      const present = body.includes(f.value) || (k === "h1" && h1s[0] === f.value);
      add("/", `${k} rendered as visible HTML`, present ? (f.verified ? "PASS" : "UNVERIFIED") : "FAIL", f.verified ? "" : "value not yet confirmed against the live site");
    }
    const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
    add("/", "meta description = live value", home.metaDescription.value ? (desc === home.metaDescription.value ? "PASS" : "FAIL") : "MISSING", home.metaDescription.value ? "" : `live value not captured; currently "${desc.slice(0, 60)}…"`);
    const types = [...html.matchAll(/"@type":"([A-Za-z]+)"/g)].map((m) => m[1]);
    add("/", "schema types vs live", "MISSING", `rendered: ${[...new Set(types)].join(", ")}; live types not captured`);
  }
}

// Staging protection: a non-production host must be noindex.
const stg = await get(base + "/", "preview.example.netlify.app");
if (stg) add("staging host", "X-Robots-Tag noindex", /noindex/.test(stg.headers.get("x-robots-tag") ?? "") ? "PASS" : "FAIL");

const count = (s) => rows.filter((r) => r.status === s).length;
console.log(`| Scope | Check | Result | Detail |\n|---|---|---|---|`);
for (const r of rows) console.log(`| \`${r.scope}\` | ${r.check} | **${r.status}** | ${r.detail.replace(/\|/g, "/")} |`);
console.log(`\nPASS ${count("PASS")} · UNVERIFIED ${count("UNVERIFIED")} · MISSING ${count("MISSING")} · FAIL ${count("FAIL")}`);
if (failures) process.exitCode = 1;

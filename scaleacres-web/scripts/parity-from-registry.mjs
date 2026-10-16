#!/usr/bin/env node
/**
 * Builds the URL-level parity table from the protected URL registry and a candidate crawl,
 * for use before the live baseline crawl is available. Once seo/baseline.json exists,
 * `npm run seo:compare` produces the authoritative report.
 *   node scripts/parity-from-registry.mjs seo/candidate-staging.json > docs/seo-url-table.md
 */
import { readFile } from "node:fs/promises";
const src = await readFile(new URL("../content/seo/pages.ts", import.meta.url), "utf8");
const pages = [...src.matchAll(/\{ path: "([^"]+)", title: "([^"]+)", type: "([^"]+)", serveFrom: "([^"]+)"(?:, nextRoute: "([^"]+)")?/g)].map((m) => ({ path: m[1], title: m[2], type: m[3], serveFrom: m[4], nextRoute: m[5] }));
const cand = JSON.parse(await readFile(process.argv[2], "utf8"));
const byPath = new Map(cand.pages.map((p) => [p.path, p]));
const rows = [];
for (const p of pages) {
  const c = byPath.get(p.nextRoute ?? "");
  let verdict, prod, notes = [];
  if (p.serveFrom === "wordpress") {
    prod = "Proxied unchanged from WordPress";
    verdict = "PASS (pending proxy check)";
    notes.push("Same WordPress HTML, title, meta, headings, schema and links. Confirm with seo:compare on a staging build that sets WORDPRESS_ORIGIN.");
    if (c) notes.push(`Redesign preview ready: title ${c.title === p.title ? "matches" : "DIFFERS"}, ${c.wordCount} words. Needs content export before switching to next.`);
  } else {
    prod = "Rendered by Next.js (redesign)";
    if (!c) { verdict = "FAILED"; notes.push("Not crawled"); }
    else {
      const titleOk = c.title === p.title;
      notes.push(`Title ${titleOk ? "matches indexed title" : `differs: "${c.title}"`}`);
      notes.push(`H1: "${(c.h1 || [])[0] ?? "—"}" (from brand kit, unverified)`);
      notes.push("Meta description, full body copy, schema and internal links need the baseline crawl");
      verdict = titleOk ? "REVIEW REQUIRED" : "FAILED";
    }
  }
  rows.push(`| \`${p.path}\` | ${p.type} | ${prod} | **${verdict}** | ${notes.join("<br>")} |`);
}
console.log("| URL | Type | Served in production | Verdict | Notes |\n|---|---|---|---|---|\n" + rows.join("\n"));
const newOnes = cand.pages.filter((c) => !pages.some((p) => p.nextRoute === c.path));
console.log("\n**New URLs introduced by the redesign** (no prior ranking; need sign-off as additions):\n");
console.log("| URL | Status | Title |\n|---|---|---|\n" + newOnes.map((c) => `| \`${c.path}\` | ${c.finalStatus} | ${c.title} |`).join("\n"));

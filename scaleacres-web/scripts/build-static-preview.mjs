#!/usr/bin/env node
/**
 * Builds a static, non-indexable review copy of the site for Netlify drag-and-drop.
 *
 *   npm run build:static-preview
 *   → dist/scaleacres-static-preview/          (drag this folder onto app.netlify.com/drop)
 *   → dist/scaleacres-static-preview.zip
 *
 * The full site (contact API, host-based noindex, WordPress proxy) needs the regular
 * Netlify build; this preview is for visual review only.
 */
import { cpSync, rmSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
// Built inside the project so node_modules resolves from the parent folder.
const work = join(root, ".preview-build");
const outDir = join(root, "dist", "scaleacres-static-preview");

console.log("→ copying project to", work);
rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });
const skip = new Set(["node_modules", ".next", "dist", "out", ".git", ".preview-build", "seo"]);
for (const entry of readdirSync(root)) {
  if (skip.has(entry)) continue;
  cpSync(join(root, entry), join(work, entry), { recursive: true });
}

// Server-only features are removed from the preview copy.
rmSync(join(work, "app", "api"), { recursive: true, force: true });
rmSync(join(work, "proxy.ts"), { force: true });
writeFileSync(
  join(work, "app", "robots.ts"),
  `import type { MetadataRoute } from "next";
export const dynamic = "force-static";
/** Static preview: never indexable. */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
`,
);

console.log("→ next build (static export)");
try {
execSync("npx next build", {
  cwd: work,
  stdio: "inherit",
  env: { ...process.env, TURBOPACK_ROOT: root, STATIC_PREVIEW: "1", NEXT_PUBLIC_STATIC_PREVIEW: "1", NEXT_TELEMETRY_DISABLED: "1" },
});
} catch (e) {
  rmSync(work, { recursive: true, force: true });
  throw e;
}

// Netlify reads _headers from the deploy root: block indexing on every path.
writeFileSync(
  join(work, "out", "_headers"),
  `/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n`,
);
// Netlify 404 page.
if (existsSync(join(work, "out", "404.html")) === false && existsSync(join(work, "out", "_not-found", "index.html"))) {
  cpSync(join(work, "out", "_not-found", "index.html"), join(work, "out", "404.html"));
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(join(root, "dist"), { recursive: true });
cpSync(join(work, "out"), outDir, { recursive: true });
rmSync(join(root, "dist", "scaleacres-static-preview.zip"), { force: true });
execSync(`cd "${outDir}" && zip -qr ../scaleacres-static-preview.zip .`);
rmSync(work, { recursive: true, force: true });
console.log(`✓ Static preview: ${outDir}\n✓ Zip: ${join(root, "dist", "scaleacres-static-preview.zip")}`);

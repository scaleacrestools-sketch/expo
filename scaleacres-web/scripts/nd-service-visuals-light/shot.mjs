import { chromium } from "playwright";
import fs from "node:fs";
const slugs = ["website-design-development","search-engine-optimization","performance-marketing","branding-creative-design","social-media-marketing","video-creative-production","ecommerce-solutions","custom-applications-software"];
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--allow-file-access-from-files"] });
const ctx = await b.newContext({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 2 });
fs.mkdirSync("svcl", { recursive: true });
for (const s of slugs) { const p = await ctx.newPage(); await p.goto("file://" + process.cwd() + "/light.html?s=" + s); const broken = await p.evaluate(() => window.ready()); await p.waitForTimeout(200); await p.screenshot({ path: `svcl/${s}.png` }); console.log(s, broken); await p.close(); }
await b.close();

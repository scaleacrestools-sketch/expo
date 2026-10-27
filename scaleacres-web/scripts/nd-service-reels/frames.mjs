import { chromium } from "playwright";
import fs from "node:fs";
const [slug, mode, outDir] = process.argv.slice(2);
const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--allow-file-access-from-files"] });
const pg = await br.newPage({ viewport: { width: 1440, height: 960 } });
const errs = []; pg.on("pageerror", (e) => errs.push(String(e)));
await pg.goto("file://" + process.cwd() + "/svc.html?s=" + slug);
const info = await pg.evaluate(() => window.ready());
fs.mkdirSync(outDir, { recursive: true });
const ts = mode === "keys" ? [0, 2, 4, 6] : Array.from({ length: 240 }, (_, i) => i / 30);
for (const [k, t] of ts.entries()) { await pg.evaluate((t) => window.render(t), t); await pg.screenshot({ path: mode === "keys" ? `${outDir}/${slug}-${t}.jpg` : `${outDir}/${String(k).padStart(4, "0")}.jpg`, type: "jpeg", quality: mode === "keys" ? 75 : 93 }); }
console.log(slug, JSON.stringify(info), errs);
await br.close();

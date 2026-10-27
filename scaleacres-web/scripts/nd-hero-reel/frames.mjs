import { chromium } from "playwright";
import fs from "node:fs";
const [fmt, mode, outDir, a, b] = process.argv.slice(2);   // mode: keys | all
const P = fmt === "p"; const W = P ? 1080 : 1920, H = P ? 1920 : 1080;
const br = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--allow-file-access-from-files"] });
const pg = await br.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const errs = []; pg.on("pageerror", (e) => errs.push(String(e))); pg.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
await pg.goto("file://" + process.cwd() + "/reel.html?fmt=" + fmt);
const info = await pg.evaluate(() => window.ready());
fs.mkdirSync(outDir, { recursive: true });
const times = mode === "keys" ? [0, .5, 1.6, 2.9, 4.2, 5.8, 7.2, 8.9, 10.5, 11.7, 13.2, 14.5, 15.6, 16.6, 17.6, 17.99] : null;
if (times) { for (const t of times) { await pg.evaluate((t) => window.render(t), t); await pg.screenshot({ path: `${outDir}/k-${t.toFixed(2)}.jpg`, quality: 80, type: "jpeg" }); } }
else { const fps = 30, n = Math.round(info.D * fps); const s = +(a ?? 0), e = +(b ?? n);
  for (let i = s; i < e; i++) { await pg.evaluate((t) => window.render(t), i / fps); await pg.screenshot({ path: `${outDir}/${String(i).padStart(4, "0")}.jpg`, quality: 92, type: "jpeg" }); } }
console.log(JSON.stringify(info), errs.slice(0, 5));
await br.close();

// node render.mjs <A|B|C> <fps> <seconds> [stillAt]
import { chromium } from "playwright";
import path from "node:path";
const [o, fps = 25, secs = 16, still] = [process.argv[2], ...process.argv.slice(3).map(Number)];
const here = path.dirname(new URL(import.meta.url).pathname);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1800, height: 1200 } });
const errs = []; p.on("pageerror", (e) => errs.push(e.message));
await p.goto("file://" + path.join(here, "options.html") + "?o=" + o);
await p.evaluate(() => window.ready);
if (!isNaN(still)) { await p.evaluate((t) => window.render(t), still); await p.waitForTimeout(150); await p.screenshot({ path: path.join(here, `still-${o}-${still}.jpg`), type: "jpeg", quality: 88 }); }
else { const n = Math.round(fps * secs); for (let i = 0; i < n; i++) { await p.evaluate((t) => window.render(t), i / fps); await p.screenshot({ path: path.join(here, "f" + o, `${String(i).padStart(4, "0")}.jpg`), type: "jpeg", quality: 90 }); } }
if (errs.length) console.log("ERR", errs);
await b.close();

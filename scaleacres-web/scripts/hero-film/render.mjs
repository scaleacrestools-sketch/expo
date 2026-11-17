// node render.mjs <fps> <seconds> [stillAt]
import { chromium } from "playwright";
import path from "node:path";
const [fps = 25, secs = 48, still] = process.argv.slice(2).map(Number);
const here = path.dirname(new URL(import.meta.url).pathname);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await p.goto("file://" + path.join(here, "wall.html"));
await p.evaluate(() => window.ready);
if (!isNaN(still)) { await p.evaluate((t) => window.render(t), still); await p.waitForTimeout(150); await p.screenshot({ path: path.join(here, `still-${still}.jpg`), type: "jpeg", quality: 88 }); }
else {
  const n = Math.round(fps * secs);
  for (let i = 0; i < n; i++) {
    await p.evaluate((t) => window.render(t), i / fps);
    await p.screenshot({ path: path.join(here, "frames", `${String(i).padStart(4, "0")}.jpg`), type: "jpeg", quality: 90 });
    if (i % 200 === 0) console.log("frame", i, "/", n);
  }
}
await b.close();

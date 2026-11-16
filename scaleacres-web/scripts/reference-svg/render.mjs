import { chromium } from "playwright";
import path from "node:path";
const [html, prefix] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 2000 } });
await p.goto("file://" + path.resolve(html));
await p.waitForFunction(() => document.images[0].complete && document.images[0].naturalWidth > 0, null, { timeout: 120000 });
await p.waitForTimeout(1500);
const H = await p.evaluate(() => document.images[0].getBoundingClientRect().height);
for (let y = 0, i = 0; y < H; y += 2000, i++) {
  await p.evaluate((t) => scrollTo(0, t), y); await p.waitForTimeout(400);
  const real = await p.evaluate(() => scrollY);
  await p.screenshot({ path: `${prefix}-${String(i).padStart(2, "0")}.png`, clip: { x: 0, y: y - real, width: 1440, height: Math.min(2000, H - y) }, timeout: 120000 });
}
console.log("H", H);
await b.close();

// Records a smooth scroll-through of the homepage at 1440 × 900.
import { chromium } from "playwright";
const URL = "file:///home/user/expo/scaleacres-web/design/home-v8/index.html";
const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
// warm the cache so nothing pops in during the take
{ const c = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await c.newPage(); await p.goto(URL); await p.waitForTimeout(1500); await c.close(); }
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: "rec-home8", size: { width: 1440, height: 900 } } });
const p = await ctx.newPage();
await p.goto(URL);
await p.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
const glide = (y, pxs) => p.evaluate(async ([y, pxs]) => {
  const y0 = scrollY, d = y - y0, T = Math.max(400, Math.abs(d) / pxs * 1000), t0 = performance.now();
  await new Promise((res) => { const f = (n) => { const k = Math.min(1, (n - t0) / T); const e = k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2; scrollTo(0, y0 + d * e); k < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); });
}, [y, pxs]);
await p.waitForTimeout(5200); // hero: words rise, reel plays
const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
const svcTop = await p.evaluate(() => Math.round(document.querySelector("#services").getBoundingClientRect().top + scrollY));
let clicked = false;
for (let y = 620; y < H; y += 620) {
  const slow = y > svcTop - 900 && y < svcTop + 300;             // services: slower so the scroll-driven heading reads
  await glide(Math.min(y, H), slow ? 360 : 620); await p.waitForTimeout(slow ? 700 : 950);
  if (!clicked && y >= svcTop + 100) {
    clicked = true;
    for (const i of [3, 6]) { await p.click(`#acc details:nth-child(${i}) summary`); await p.waitForTimeout(1300); }
  }
}
await glide(H, 900); await p.waitForTimeout(2200);
await p.close(); await ctx.close(); await b.close();

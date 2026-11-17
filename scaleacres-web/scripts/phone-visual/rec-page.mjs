// Records a smooth scroll-through of any design/home-v8 page at 1440 × 900: node rec-page.mjs <page.html> <outdir>
import { chromium } from "playwright";
const URL = "file:///home/user/expo/scaleacres-web/design/home-v8/" + process.argv[2];
const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
{ const c = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await c.newPage(); await p.goto(URL); await p.waitForTimeout(1500); await c.close(); }
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: process.argv[3], size: { width: 1440, height: 900 } } });
const p = await ctx.newPage(); await p.goto(URL);
await p.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
const glide = (y, pxs) => p.evaluate(async ([y, pxs]) => { const y0 = scrollY, d = y - y0, T = Math.max(400, Math.abs(d) / pxs * 1000), t0 = performance.now();
  await new Promise((res) => { const f = (n) => { const k = Math.min(1, (n - t0) / T); const e = k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2; scrollTo(0, y0 + d * e); k < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); }); }, [y, pxs]);
await p.waitForTimeout(4200);
const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
for (let y = 620; y < H; y += 620) { await glide(Math.min(y, H), 620); await p.waitForTimeout(950); }
await glide(H, 900); await p.waitForTimeout(2000);
await p.close(); await ctx.close(); await b.close();

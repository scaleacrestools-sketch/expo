// Records the v8 hero on a phone (390 × 844): headline, then a slow scroll to the form.
import { chromium } from "playwright";
const URL = "file:///home/user/expo/scaleacres-web/design/home-v8/" + (process.argv[2] || "index.html");
const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
{ const c = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await c.newPage(); await p.goto(URL); await p.waitForTimeout(2500); await c.close(); }
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, recordVideo: { dir: process.argv[3] || "rec-hero8-phone", size: { width: 390, height: 844 } } });
const p = await ctx.newPage();
await p.goto(URL);
await p.waitForTimeout(5000);
const end = await p.evaluate(() => document.querySelector("#enquire").getBoundingClientRect().top + scrollY - 70);
for (let i = 0; i <= 120; i++) { const k = i / 120, e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; await p.evaluate((y) => scrollTo(0, y), end * e); await p.waitForTimeout(33); }
await p.waitForTimeout(5000);
await p.close(); await ctx.close(); await b.close();

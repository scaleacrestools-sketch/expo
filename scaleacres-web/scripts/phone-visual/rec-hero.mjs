// Records the hero (film wall) on its own: 1440 × 900, ~18 s.
import { chromium } from "playwright";
const URL = "file:///home/user/expo/scaleacres-web/design/home-v6/index.html";
const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
{ const c = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await c.newPage(); await p.goto(URL); await p.waitForTimeout(2500); await c.close(); }
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: "rec-hero", size: { width: 1440, height: 900 } } });
const p = await ctx.newPage();
await p.goto(URL);
await p.waitForTimeout(19500);
await p.close(); await ctx.close(); await b.close();

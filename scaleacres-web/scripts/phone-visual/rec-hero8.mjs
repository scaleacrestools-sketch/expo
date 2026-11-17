// Records the v8 hero on its own: 1440 × 900, ~19 s (copy left, enquiry form right, AI film wall).
import { chromium } from "playwright";
const URL = "file:///home/user/expo/scaleacres-web/design/home-v8/index.html";
const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
{ const c = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await c.newPage(); await p.goto(URL); await p.waitForTimeout(2500); await c.close(); }
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: "rec-hero8", size: { width: 1440, height: 900 } } });
const p = await ctx.newPage();
await p.goto(URL);
await p.waitForTimeout(19500);
await p.close(); await ctx.close(); await b.close();

// Renders scene.html frame by frame: node render.mjs <fps> <seconds> [stillAt]
import { chromium } from "playwright";
import path from "node:path";
const [fps = 30, secs = 18, still] = process.argv.slice(2).map(Number);
const here = path.dirname(new URL(import.meta.url).pathname);
const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const p = await b.newPage({ viewport: { width: 1800, height: 1200 } });
await p.goto("file://" + path.join(here, "scene.html"));
await p.evaluate(() => window.ready);
if (!isNaN(still)) {
  await p.evaluate((t) => window.render(t), still); await p.waitForTimeout(100);
  await p.screenshot({ path: path.join(here, `still-${still}.png`) });
} else {
  const n = Math.round(fps * secs);
  for (let i = 0; i < n; i++) {
    await p.evaluate((t) => window.render(t), i / fps);
    await p.screenshot({ path: path.join(here, "frames", `${String(i).padStart(4, "0")}.jpg`), type: "jpeg", quality: 93 });
    if (i % 90 === 0) console.log("frame", i, "/", n);
  }
}
await b.close();

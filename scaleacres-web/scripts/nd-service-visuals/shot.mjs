import { chromium } from "playwright";
import fs from "node:fs";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.5 });
fs.mkdirSync("out", { recursive: true });
for (const f of fs.readdirSync("html")) {
  const p = await ctx.newPage(); await p.goto("file://" + process.cwd() + "/html/" + f); await p.waitForLoadState("load"); await p.waitForTimeout(300);
  await p.screenshot({ path: "out/" + f.replace(".html", ".png") }); await p.close();
}
await b.close();

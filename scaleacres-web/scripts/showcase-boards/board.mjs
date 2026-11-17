import { chromium } from "playwright";
const V = "/tmp/claude-0/-home-user-expo/769b79d7-5227-592b-b40b-8d6f12481340/scratchpad/cw/v2/";
const ks = (process.argv[2] || "seabreeze,sid,aarize,intech,trg,jbbr,sohom,dtc,bhatia,yugen").split(",");
const b = await chromium.launch();
for (const k of ks) { const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto("file://" + V + "b.html#" + k); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(async () => Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))));
  await p.waitForTimeout(300); await p.screenshot({ path: V + "o-" + k + ".png" }); await p.close(); }
await b.close();

import { chromium } from "playwright"; import fs from "node:fs";
const W = "/tmp/claude-0/-home-user-expo/769b79d7-5227-592b-b40b-8d6f12481340/scratchpad/cw/";
const boards = JSON.parse(fs.readFileSync(W + "boards.json", "utf8"));
const only = process.argv[2];
const b = await chromium.launch();
for (const [name, cfg] of Object.entries(boards)) {
  if (only && !only.split(",").includes(name)) continue;
  const fix = (p) => (p.startsWith("/") ? "file://" + p : "file://" + W + p);
  const c = { ...cfg, bg: fix(cfg.bg), items: cfg.items.map((i) => ({ ...i, src: fix(i.src) })) };
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await p.goto("file://" + W + "board.html#" + encodeURIComponent(JSON.stringify(c)));
  await p.evaluate(() => document.fonts.ready); await p.evaluate(async () => Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r)))));
  await p.waitForTimeout(300); await p.screenshot({ path: W + "out-" + name + ".png" }); await p.close(); console.log(name);
}
await b.close();

import { chromium } from "playwright";
const O = "/tmp/claude-0/-home-user-expo/769b79d7-5227-592b-b40b-8d6f12481340/scratchpad/showcase/";
const B = [
  ["bhatia-auriga9", { bg: "bg-au.jpg", k: "Bhatia Group · Rajyog", t: "Auriga 9", s: "Borivali West, Mumbai", c: "Launch campaign|Reels & ads|Floor-plan creatives", p1: "au-a.jpg", p2: "au-b.jpg", p3: "au-c.jpg" }],
  ["dtc-sojon", { bg: "bg-dt.jpg", k: "DTC Group", t: "Sojon", s: "Joka, South Kolkata", c: "AI ad films|Launch campaign|Social creatives", p1: "dt-a.jpg", p2: "dt-b.jpg", p3: "dt-c.jpg" }],
  ["sohom-pravya", { bg: "bg-pv.jpg", k: "Soham Group × DTC Group", t: "Pravya", s: "Rajarhat New Town, Kolkata", c: "Launch film|Reels & ads|Project branding", p1: "pv-a.jpg", p2: "pv-b.jpg", p3: "pv-c.jpg" }],
];
const b = await chromium.launch();
for (const [name, q] of B) {
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const u = new URLSearchParams(Object.fromEntries(Object.entries(q).map(([k, v]) => [k, /\.jpg$/.test(v) ? "file://" + O + v : v])));
  await p.goto("file://" + O + "board.html?" + u); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  await p.screenshot({ path: O + name + ".png" }); await p.close(); console.log(name);
}
await b.close();

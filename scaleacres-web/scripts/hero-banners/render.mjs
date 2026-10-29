// Renders every banner scene to desktop (2400×1350) and mobile (1080×1620) WebP files in public/images/heroes.
// Usage: node scripts/hero-banners/render.mjs [name ...]   (needs Playwright; CHROMIUM_PATH picks a browser)
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import { scenes, page } from "./scenes.mjs";

const here = path.dirname(new URL(import.meta.url).pathname);
const PUBLIC = path.resolve(here, "../../public");
const OUT = path.join(PUBLIC, "images/heroes");
const PNG = path.join(process.env.TMPDIR ?? "/tmp", "hero-banners-png");
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(PNG, { recursive: true });

const S = scenes;
// Mobile compositions keep the visual in the upper part of the frame; the headline sits over the dark base.
const lift = (h, by) => `<div style="position:absolute;left:0;right:0;top:${-by}px;height:1620px">${h}</div>`;
const base = (from = 40) => `<div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(0deg,#0b0d0d 0,#0b0d0d ${from - 22}%,rgba(11,13,13,.7) ${from - 6}%,rgba(11,13,13,0) ${from + 14}%)"></div>`;
const Z = (fn, k, o) => (W, H) => `<div style="position:absolute;inset:0;transform:scale(${k});transform-origin:${o}">${fn(W, H, false)}</div>`;
const M = (fn, by = 0, from = 40) => (W, H) => (by ? lift(fn(W, 1620, true), by) : fn(W, H, true)) + base(from);

export const BANNERS = {
  about: [Z(S.about, 1.35, "50% 55%"), M(S.about, 380)],
  team: [(W, H) => S.team(W, H, false), (W, H) => S.team(W, H, true)],
  work: [(W, H) => S.work(W, H, false), (W, H) => S.work(W, H, true)],
  cases: [Z(S.cases, 1.28, "50% 62%"), (W, H) => S.cases(W, H, true)],
  contact: [(W, H) => S.contact(W, H, false), (W, H) => S.contact(W, H, true)],
  web: [Z(S.web, 1.22, "88% 45%"), M(S.web, 420)],
  seo: [Z(S.seo, 1.12, "88% 45%"), M(S.seo, 440)],
  ppc: [(W, H) => S.performance(W, H, false, "ppc"), M((W, H, m) => S.performance(W, H, m, "ppc"), 420)],
  leadgen: [(W, H) => S.performance(W, H, false, "leadgen"), M((W, H, m) => S.performance(W, H, m, "leadgen"), 420)],
  facebook: [(W, H) => S.performance(W, H, false, "facebook"), M((W, H, m) => S.performance(W, H, m, "facebook"), 420)],
  branding: [Z(S.branding, 1.1, "90% 45%"), M(S.branding, 420)],
  social: [(W, H) => S.social(W, H, false), M(S.social, 420)],
  video: [(W, H) => S.video(W, H, false), (W, H) => S.video(W, H, true)],
  ecommerce: [Z(S.ecommerce, 1.3, "88% 42%"), M(S.ecommerce, 420)],
  apps: [Z(S.apps, 1.3, "88% 42%"), M(S.apps, 420)],
  location: [(W, H) => S.location(W, H, false), (W, H) => S.location(W, H, true)],
  yugen: [Z(S.yugen, 1.4, "84% 50%"), M(S.yugen, 520)],
  onegoa: [Z(S.onegoa, 1.25, "84% 50%"), M(S.onegoa, 480)],
  "careers-fill": [(W, H) => S.careersFill(W, H), null, [2400, 900]],
  "careers-strip": [(W, H) => S.careersStrip(W, H), null, [3200, 760]],
};

const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split("?")[0]);
  if (u.startsWith("/__scene/")) { res.writeHead(200, { "Content-Type": "text/html" }); return res.end(pending.get(u)); }
  const f = path.join(PUBLIC, u);
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": f.endsWith(".webp") ? "image/webp" : f.endsWith(".jpg") ? "image/jpeg" : "image/png" });
  fs.createReadStream(f).pipe(res);
}).listen(3710);
const pending = new Map();

const want = process.argv.slice(2);
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await browser.newContext({ deviceScaleFactor: 1 });
const pg = await ctx.newPage();
const shot = async (name, html, W, H) => {
  const key = `/__scene/${name}`; pending.set(key, html);
  await pg.setViewportSize({ width: W, height: H });
  await pg.goto(`http://127.0.0.1:3710${key}`, { waitUntil: "load" });
  const bad = await pg.evaluate(() => [...document.images].filter((i) => !i.complete || !i.naturalWidth).map((i) => i.src));
  if (bad.length) console.log("  BROKEN", name, bad);
  const file = path.join(PNG, `${name}.png`);
  await pg.screenshot({ path: file, clip: { x: 0, y: 0, width: W, height: H } });
  return file;
};
for (const [name, [desk, mob, size]] of Object.entries(BANNERS)) {
  if (want.length && !want.includes(name)) continue;
  const [W, H] = size ?? [2400, 1350];
  const d = await shot(`${name}-desktop`, page(desk(W, H), W, H), W, H);
  if (size) {
    await sharp(d).webp({ quality: 80 }).toFile(`${OUT}/${name}.webp`);
    await sharp(d).resize(Math.round(W * 0.6)).webp({ quality: 80 }).toFile(`${OUT}/${name}-sm.webp`);
  } else {
    await sharp(d).webp({ quality: 78 }).toFile(`${OUT}/${name}-2400.webp`);
    await sharp(d).resize(1600).webp({ quality: 80 }).toFile(`${OUT}/${name}-1600.webp`);
  }
  if (mob) {
    const m = await shot(`${name}-mobile`, page(mob(1080, 1620), 1080, 1620), 1080, 1620);
    await sharp(m).webp({ quality: 78 }).toFile(`${OUT}/${name}-mobile-1080.webp`);
    await sharp(m).resize(720).webp({ quality: 80 }).toFile(`${OUT}/${name}-mobile-720.webp`);
  }
  console.log("ok", name);
}
await browser.close(); server.close();

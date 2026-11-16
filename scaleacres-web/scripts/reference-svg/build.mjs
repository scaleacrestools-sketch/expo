// Flattens the reference homepage and records every layer: ops.json + raster snaps + downloaded images.
import fs from "node:fs";
import { open, flatten } from "./prep.mjs";

fs.mkdirSync("out/snap", { recursive: true });
fs.mkdirSync("out/img", { recursive: true });
const { b, p, heroBg } = await open();
fs.writeFileSync("out/hero-bg.jpg", heroBg);

// light every word of the word-by-word reveal, then freeze its colours
await p.evaluate(() => { const s = document.querySelector(".about-reveal"); scrollTo(0, s.getBoundingClientRect().top + scrollY - 40); });
await p.waitForTimeout(1500);
for (let k = 0; k < 6; k++) { await p.evaluate(() => scrollBy(0, 60)); await p.waitForTimeout(300); }
await p.evaluate(() => document.querySelectorAll(".about-reveal .aw").forEach((w) => w.style.setProperty("color", getComputedStyle(w).color, "important")));

await flatten(p);
await p.addStyleTag({ content: `
  .site-header{position:absolute!important} .side-rail{position:absolute!important}
  .fab-quote{position:absolute!important;top:822px!important;bottom:auto!important}
  .signoff img{transform:none!important}
  .flip__stack{transform:none!important;animation:none!important;transition:none!important}
` });
await p.evaluate(() => { for (const e of document.querySelectorAll("body *")) if (getComputedStyle(e).position === "sticky") e.style.setProperty("position", "relative", "important"); });
await p.evaluate(() => scrollTo(0, 0));
await p.waitForTimeout(1200);

// turn ::before/::after boxes into real elements so they become layers
await p.evaluate(() => {
  let n = 0; const css = [];
  const SKIPTAGS = new Set(["IMG", "INPUT", "BR", "VIDEO", "CANVAS", "IFRAME", "TEXTAREA", "SELECT", "SCRIPT", "STYLE"]);
  for (const e of [...document.querySelectorAll("body *")]) {
    if (SKIPTAGS.has(e.tagName) || e.closest("svg")) continue;
    for (const ps of ["::before", "::after"]) {
      const cs = getComputedStyle(e, ps);
      if (cs.content === "none" || cs.content === "normal" || cs.display === "none") continue;
      const el = document.createElement("rdm-ps");
      for (const prop of cs) el.style.setProperty(prop, cs.getPropertyValue(prop));
      const m = cs.content.match(/^"(.*)"$/); el.textContent = m ? m[1] : "";
      const key = ps.slice(2), id = "p" + (++n);
      e.setAttribute("data-ps-" + key, id);
      css.push(`[data-ps-${key}="${id}"]${ps}{content:none!important}`);
      if (ps === "::before") e.prepend(el); else e.append(el);
    }
  }
  const st = document.createElement("style"); st.textContent = css.join("\n"); document.head.append(st);
});
await p.waitForTimeout(600);

const collect = fs.readFileSync(new URL("./collect.js", import.meta.url), "utf8");
const data = await p.evaluate(`(${collect})(${JSON.stringify({
  roots: ["#main > section", "#site-footer", ".side-rail", ".site-header", ".fab-quote"],
  snapAll: [".side-rail", ".cta-astro"],
  skip: [".filmbed", ".grain", ".nav-panel", "dialog", ".fall-cue", ".film-open", "noscript", "script"],
})})`);
console.log("ops", data.ops.length, "H", data.H, "groups", data.groups.map((g) => `${g.name}:${g.to - g.from}`).join(" | "));

// rasterise snaps: only the target painted, page background transparent
const snaps = data.ops.filter((o) => o.k === "snap");
for (const s of snaps) {
  const w = Math.max(1, Math.ceil(s.w)), h = Math.max(1, Math.ceil(s.h));
  const tag = await p.addStyleTag({ content: `html,body{background:transparent!important} body *{visibility:hidden!important} [data-snap="${s.id}"]${s.all ? `,[data-snap="${s.id}"] *` : ""}{visibility:visible!important}` });
  await p.screenshot({ path: `out/snap/${s.id}.png`, fullPage: true, omitBackground: true, clip: { x: Math.floor(s.x), y: Math.floor(s.y), width: w, height: h } });
  await tag.evaluate((n) => n.remove());
}
console.log("snaps", snaps.length);

// download images (the page's own files)
const imgs = [...new Set(data.ops.filter((o) => o.k === "img").map((o) => o.src))];
const map = {};
let n = 0;
for (const u of imgs) {
  try {
    const r = await p.request.get(u);
    if (!r.ok()) { console.log("img fail", r.status(), u); continue; }
    const ext = (u.split("?")[0].match(/\.(\w+)$/) || [, "bin"])[1].toLowerCase();
    const f = `out/img/${++n}.${ext}`; fs.writeFileSync(f, await r.body()); map[u] = f;
  } catch (e) { console.log("img err", u, e.message); }
}
console.log("images", Object.keys(map).length, "/", imgs.length);
fs.writeFileSync("out/ops.json", JSON.stringify({ ...data, images: map }));

// reference render of the flattened page for comparison
await p.screenshot({ path: "out/flat.png", fullPage: true });
await b.close();

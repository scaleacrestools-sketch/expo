// Records the ScaleAcres v8 homepage (static mode) as layers: out-home8/ops.json + snaps.
import fs from "node:fs";
import { chromium } from "playwright";
const PAGE = "file:///home/user/expo/scaleacres-web/design/home-v8/index.html?static=1";
fs.mkdirSync("out-home8/snap", { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(PAGE, { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);
await p.evaluate(async () => { document.querySelectorAll('img').forEach((i) => (i.loading = "eager")); await Promise.all([...document.images].map((i) => i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))); });
// hold each film on a strong frame
await p.evaluate(async () => {
  const set = (v, t) => new Promise((res) => { v.addEventListener("seeked", res, { once: true }); v.currentTime = t; });
  const vs = [...document.querySelectorAll("video")];
  await Promise.all(vs.map((v) => new Promise((r) => (v.readyState >= 2 ? r() : v.addEventListener("loadeddata", r, { once: true })))));
  for (const v of vs) await set(v, v.id === "heroFilm" ? 6 : 5);
});
await p.waitForTimeout(800);
// ::before/::after become real elements so they are layers too
await p.evaluate(() => {
  let n = 0; const css = [];
  const SKIP = new Set(["IMG", "INPUT", "BR", "VIDEO", "CANVAS", "IFRAME", "SCRIPT", "STYLE"]);
  for (const e of [...document.querySelectorAll("body *")]) {
    if (SKIP.has(e.tagName) || e.closest("svg")) continue;
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
await p.waitForTimeout(500);
// form fields: hidden accessibility labels are dropped, and every input/select becomes a lookalike box
// carrying its placeholder or selected text, so the SVG shows the fields as they look on screen
await p.evaluate(() => {
  for (const sp of document.querySelectorAll("label > span")) { const cs = getComputedStyle(sp); if (cs.position === "absolute" && parseFloat(cs.width) <= 1) sp.remove(); }
  for (const el of document.querySelectorAll("input:not([type=checkbox]):not([type=hidden]), select")) {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect(); if (!r.width) continue;
    const box = document.createElement("div");
    for (const k of ["boxSizing","width","height","paddingLeft","paddingRight","borderTop","borderRight","borderBottom","borderLeft","borderRadius","backgroundColor","backgroundImage","backgroundRepeat","backgroundPosition","backgroundSize","fontFamily","fontSize","fontWeight","letterSpacing","boxShadow"]) box.style[k] = cs[k];
    box.style.display = "flex"; box.style.alignItems = "center"; box.style.whiteSpace = "nowrap"; box.style.overflow = "hidden";
    let txt, col;
    if (el.tagName === "SELECT") { txt = el.options[el.selectedIndex]?.text || ""; col = cs.color; }
    else { txt = el.value || el.placeholder || ""; col = el.value ? cs.color : getComputedStyle(el, "::placeholder").color; }
    box.textContent = txt; box.style.color = col;
    el.replaceWith(box);
  }
});
await p.waitForTimeout(200);
const collect = fs.readFileSync(new URL("./collect.js", import.meta.url), "utf8");
const data = await p.evaluate(`(${collect})(${JSON.stringify({
  roots: ["main > section", "footer", ".rail", ".hdr", ".fab"],
  snapAll: [".rail", ".marquee"],
  skip: ["script", "noscript"],
})})`);
console.log("ops", data.ops.length, "H", data.H, data.groups.map((g) => `${g.name}:${g.to - g.from}`).join(" | "));
for (const s of data.ops.filter((o) => o.k === "snap")) {
  const w = Math.max(1, Math.ceil(s.w)), h = Math.max(1, Math.ceil(s.h));
  const tag = await p.addStyleTag({ content: `html,body{background:transparent!important} body *{visibility:hidden!important} [data-snap="${s.id}"]${s.all ? `,[data-snap="${s.id}"] *` : ""}{visibility:visible!important}` });
  await p.screenshot({ path: `out-home8/snap/${s.id}.png`, fullPage: true, omitBackground: true, clip: { x: Math.floor(s.x), y: Math.floor(s.y), width: w, height: h } });
  await tag.evaluate((n) => n.remove());
}
const images = {};
for (const o of data.ops.filter((o) => o.k === "img")) images[o.src] = decodeURIComponent(o.src.replace(/^file:\/\//, "").split("?")[0]);
fs.writeFileSync("out-home8/ops.json", JSON.stringify({ ...data, images }));
await p.screenshot({ path: "out-home8/flat.png", fullPage: true });
await b.close();

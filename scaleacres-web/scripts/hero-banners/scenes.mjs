// Banner compositions for the ScaleAcres internal pages, built only from genuine ScaleAcres
// material (client creatives, website captures, brand pieces, film posters, studio and team photos).
// No headline text is baked in: every heading is live HTML on the page.
import fs from "node:fs";

const A = JSON.parse(fs.readFileSync(new URL("./assets.json", import.meta.url)));
const I = (p) => `/images/nd/${p}`;
export const SRC = {
  covers: ["work/jbbr-group-1600.webp", "work/trg-the-mall-1600.webp", "work/sid-realtech-1600.webp", "work/intech-developers-1600.webp"].map(I),
  creatives: ["selected/sid-ellington86-1200.webp", "selected/intech-creates-value-1200.webp", "selected/jbbr-campaign-1200.webp", "selected/trg-the-mall-1200.webp"].map(I),
  webs: ["web-sid-2400.webp", "web-subata-2400.webp", "web-imperial-2400.webp", "web-research-2400.webp", "web-finsckool-2400.webp", "web-jina-2400.webp", "web-mwb-2400.webp"].map(I),
  webSel: ["selected/web-miraabilis-1800.webp"].map(I),
  phones: { subata: I("m-subata-720.webp"), mwb: I("m-mwb-720.webp"), finsckool: I("m-finsckool-720.webp") },
  brand: ["brand/board-applications-1800.webp", "brand/board-intech-1800.webp", "brand/intech-identity-960.webp", "brand/jbbr-brand-kit-960.webp", "brand/ottimo-identity-960.webp", "brand/ottimo-billboard-960.webp", "brand/sid-hoarding-900.webp", "brand/karyan-signage-480.webp", "brand/trg-merchandise-480.webp", "brand/aarize-stationery-480.webp"].map(I),
  svc: (s) => I(`svc-${s}-2400.webp`),
  seo: I("seo-1400.webp"), google: I("google-1192.webp"), meta: I("meta-1400.webp"),
  yt: ["vgsUylyADPY", "fRnzr1dSYMg", "0NmdVrMelSQ", "Z1ez2sINaao", "vODoeG2QEKQ", "QkCSgbRHJ0g", "HXVFHKSOmVE", "Hh6lSEZ0WyY", "9GUSJ8zlvRA", "FxO_2KVX4zA", "TyFCnkRBg_I", "ZQa0XNGiN7Y", "nRFeRCMZG3E", "MdluDjATzgA", "1ZXNwVLM7T4", "O1FJdO2yZOY", "z37JFVVNIYk", "5Pm2Z6WszRc"].map((v) => I(`yt-${v}-540.webp`)),
  studio: I("studio/studio-team-1000.webp"), leaders: I("studio/studio-founders-1000.webp"),
  founders: "/media/wp/2025__04__Rectangle-7060.webp",
  people: A.people, culture: A.culture,
  map: "/media/ext/map.webp",
  yugen: ["/media/ext/yt-4n3NBVqmEt4.webp", "/media/ext/yt-NlnTP3IcdZU.webp", "/media/ext/yt-ZI5Vdcbzk3o.webp"],
  onegoa: { render: "/media/wp/2025__04__Group-2147223992-1997x2048.webp", posters: ["/media/ext/yt-nV8-zq5aRYI.webp", "/media/ext/yt-9qwSclZWaag.webp"] },
  dash: ["/media/wp/2025__04__1742295015784.webp", "/media/wp/2025__04__1742294996270.webp"],
  vimeo: ["1096842100", "1096842029", "1096841907", "1096841806", "1096841691", "1096841538"].map((v) => `/media/ext/vm-${v}.webp`),
};

const BASE = `*{box-sizing:border-box;margin:0;padding:0}html,body{width:100%;height:100%;overflow:hidden;background:#0b0d0d}
.s{position:absolute;inset:0;overflow:hidden}
.i{position:absolute;overflow:hidden;border-radius:14px;background:#15191b;box-shadow:0 40px 90px -30px rgba(0,0,0,.85),0 0 0 1px rgba(255,255,255,.06)}
.i>img{width:100%;height:100%;object-fit:cover;display:block}
.ph{position:absolute;border-radius:44px;background:#0e1112;padding:12px;box-shadow:0 50px 100px -30px rgba(0,0,0,.9),0 0 0 1.5px rgba(255,255,255,.12) inset}
.ph>img{width:100%;height:100%;object-fit:cover;object-position:top;border-radius:34px;display:block}
.br{position:absolute;border-radius:12px;background:#fff;overflow:hidden;box-shadow:0 50px 110px -30px rgba(0,0,0,.9),0 0 0 1px rgba(255,255,255,.08)}
.br .bar{height:4.2%;min-height:22px;background:#eef0f3;display:flex;align-items:center;gap:7px;padding:0 14px;border-bottom:1px solid #dde1e6}
.br .bar b{width:10px;height:10px;border-radius:50%;background:#cfd4da}
.br>img{width:100%;height:95.8%;object-fit:cover;object-position:top;display:block}
.grain:after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.07;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.glow{position:absolute;border-radius:50%;filter:blur(120px);pointer-events:none}`;

const img = (src, x, y, w, h, o = {}) => `<div class="i" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${o.r ? `transform:rotate(${o.r}deg);` : ""}${o.z ? `z-index:${o.z};` : ""}${o.rad != null ? `border-radius:${o.rad}px;` : ""}${o.f ? `filter:${o.f};` : ""}${o.op != null ? `opacity:${o.op};` : ""}"><img src="${src}" style="object-position:${o.pos ?? "50% 50%"}"></div>`;
const phone = (src, x, y, w, o = {}) => `<div class="ph" style="left:${x}px;top:${y}px;width:${w}px;height:${Math.round(w * 2.06)}px;${o.r ? `transform:rotate(${o.r}deg);` : ""}${o.z ? `z-index:${o.z};` : ""}"><img src="${src}" style="object-position:${o.pos ?? "50% 0%"}"></div>`;
const browser = (src, x, y, w, o = {}) => `<div class="br" style="left:${x}px;top:${y}px;width:${w}px;height:${Math.round(w * (o.ar ?? 0.62))}px;${o.t ? `transform:${o.t};` : ""}${o.z ? `z-index:${o.z};` : ""}"><div class="bar"><b></b><b></b><b></b></div><img src="${src}"></div>`;
const post = (src, x, y, w, o = {}) => img(src, x, y, w, Math.round(w * 1.25), { rad: 12, ...o });
const glow = (x, y, s, c, a = 0.35) => `<div class="glow" style="left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;background:rgba(${c},${a})"></div>`;
const shade = (css) => `<div style="position:absolute;inset:0;pointer-events:none;${css}"></div>`;
const ROYAL = "29,78,216", SKY = "56,189,248";

/* --------------------------------------------------------------- scenes
   Each returns HTML for a W×H canvas. `m` = mobile composition (1080×1620). */

export const scenes = {
  // About: a flowing river of the studio, its people and its work across the frame (ALET-like depth),
  // with the dark upper band left free for the headline.
  about: (W, H, m) => {
    const S = SRC; let h = "";
    h += img(S.studio, -40, -40, W + 80, H + 80, { f: "blur(28px) brightness(.32) saturate(.8)", rad: 0 });
    h += glow(W * 0.7, H * 0.6, 900, ROYAL, 0.28);
    if (!m) {
      const y = H * 0.44;
      const row = [
        [S.creatives[0], 70, y - 40, 280, 350, -4], [S.covers[0], 300, y + 10, 460, 288, 2], [S.studio, 700, y - 120, 520, 554, 0, "50% 35%"],
        [S.founders, 1150, y - 10, 300, 404, -2, "50% 25%"], [S.webs[0], 1390, y + 40, 520, 325, 3, "50% 0%"], [S.covers[2], 1840, y - 30, 420, 263, -3],
        [S.creatives[1], 2190, y + 30, 260, 325, 4],
      ];
      row.forEach(([src, x, yy, w, hh, r, pos], k) => { h += img(src, x, yy, w, hh, { r, pos, z: k === 2 ? 5 : 3 + (k % 2) }); });
    } else {
      [[S.studio, 120, 560, 840, 620, 0, "50% 35%"], [S.creatives[0], 40, 960, 360, 450, -5], [S.covers[0], 520, 1060, 520, 325, 4], [S.founders, 700, 470, 300, 400, 5, "50% 25%"]]
        .forEach(([src, x, y, w, hh, r, pos], k) => { h += img(src, x, y, w, hh, { r, pos, z: k + 2 }); });
    }
    h += shade(`background:linear-gradient(180deg,rgba(11,13,13,.92) 0%,rgba(11,13,13,.35) ${m ? 30 : 36}%,transparent 55%,rgba(11,13,13,.55) 100%)`);
    return h;
  },

  // Team: an editorial wall of the real team, every photo the same crop.
  team: (W, H, m) => {
    const cols = m ? 4 : 10, rows = m ? 6 : 4, g = 8;
    const tw = (W - g * (cols + 1)) / cols, th = (H - g * (rows + 1)) / rows;
    let h = ""; let k = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const src = SRC.people[k++ % SRC.people.length];
      h += img(src, g + c * (tw + g), g + r * (th + g), tw, th, { rad: 10, pos: "50% 22%", f: "saturate(.9) contrast(1.02)" });
    }
    h += shade(`background:radial-gradient(ellipse at 50% ${m ? 42 : 52}%,rgba(11,13,13,.82) 0%,rgba(11,13,13,.55) 38%,rgba(11,13,13,.2) 70%,rgba(11,13,13,.45) 100%)`);
    return h;
  },

  // Our work: the portfolio as a tilted, endless wall in perspective.
  work: (W, H, m) => {
    const pieces = [SRC.covers[0], SRC.creatives[0], SRC.webs[0], SRC.covers[1], SRC.brand[0], SRC.creatives[2], SRC.webs[1], SRC.covers[2], SRC.creatives[1], SRC.webs[2], SRC.brand[1], SRC.covers[3], SRC.creatives[3], SRC.webs[4], SRC.brand[6], SRC.webSel[0], SRC.brand[3], SRC.webs[3]];
    const cols = m ? 3 : 6, cw = m ? 420 : 520, gap = 26; let h = `<div style="position:absolute;left:50%;top:50%;width:${cols * (cw + gap)}px;transform:translate(-50%,-50%) perspective(2400px) rotateX(24deg) rotateZ(-14deg) scale(${m ? 1.25 : 1.18});transform-style:preserve-3d;display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:${gap}px">`;
    for (let k = 0; k < (m ? 18 : 30); k++) {
      const src = pieces[k % pieces.length]; const tall = /selected\/(sid|intech|jbbr|trg)/.test(src);
      h += `<div class="i" style="position:relative;width:${cw}px;height:${tall ? cw * 1.25 : cw * 0.625}px;margin-top:${(k % cols) % 2 ? 60 : 0}px"><img src="${src}" style="object-position:50% 0%"></div>`;
    }
    h += `</div>` + shade(`background:radial-gradient(ellipse at 50% 50%,rgba(11,13,13,.78) 0%,rgba(11,13,13,.45) 45%,rgba(11,13,13,.25) 100%)`);
    return h;
  },

  // Case studies: a diptych of the two campaigns, each with its own films and visuals.
  cases: (W, H, m) => {
    const S = SRC; let h = "";
    if (!m) {
      h += `<div class="s" style="right:50%;background:linear-gradient(160deg,#10231a,#0b0d0d 70%)"></div><div class="s" style="left:50%;background:linear-gradient(200deg,#2a1f12,#0b0d0d 70%)"></div>`;
      h += glow(W * 0.25, H * 0.55, 800, "52,140,90", 0.22) + glow(W * 0.75, H * 0.55, 800, "190,140,70", 0.2);
      S.yugen.forEach((p, k) => { h += phone(p, 150 + k * 300, 330 + (k % 2) * 80, 290, { r: (k - 1) * 4, z: 3 }); });
      h += img(S.onegoa.render, W / 2 + 140, 300, 600, 615, { r: 2, z: 2 });
      h += phone(S.onegoa.posters[0], W / 2 + 680, 380, 290, { r: 5, z: 4 });
      h += `<div style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(255,255,255,.14)"></div>`;
    } else {
      h += `<div class="s" style="bottom:50%;background:linear-gradient(160deg,#10231a,#0b0d0d)"></div><div class="s" style="top:50%;background:linear-gradient(200deg,#2a1f12,#0b0d0d)"></div>`;
      S.yugen.slice(0, 2).forEach((p, k) => { h += phone(p, 140 + k * 430, 330 + k * 40, 330, { r: (k ? 5 : -5) }); });
      h += img(S.onegoa.render, 120, 1130, 520, 533, { r: -2 }) + phone(S.onegoa.posters[0], 640, 1040, 300, { r: 6 });
    }
    h += shade(`background:linear-gradient(180deg,rgba(11,13,13,.85) 0%,rgba(11,13,13,.15) 32%,transparent 60%,rgba(11,13,13,.7) 100%)`);
    return h;
  },

  // Careers: the culture collage used as the fill of the oversized headline.
  careersFill: (W, H) => {
    const c = SRC.culture; const w = W / 4;
    return [c[1], c[0], c[4], c[2]].map((src, k) => img(src, k * w, 0, w + 2, H, { rad: 0, pos: "50% 40%" })).join("");
  },
  careersStrip: (W, H) => {
    const c = SRC.culture.concat([SRC.studio, SRC.leaders]); const w = 520, g = 18; let h = "";
    for (let k = 0; k < 6; k++) h += img(c[[0, 1, 5, 2, 12, 6][k]], k * (w + g), 0, w, H, { rad: 16, pos: "50% 45%" });
    return h;
  },

  // Contact: the studio's real map location, set in Brand Black and Royal.
  contact: (W, H, m) => `${img(SRC.map, 0, 0, W, H, { rad: 0, f: "grayscale(1) contrast(1.15) brightness(.55)", pos: m ? "52% 50%" : "50% 50%" })}${shade("background:linear-gradient(120deg,rgba(11,13,13,.96) 20%,rgba(20,46,140,.55) 75%,rgba(11,13,13,.9));mix-blend-mode:multiply")}${shade(`background:radial-gradient(circle at ${m ? "50% 66%" : "72% 52%"},rgba(${SKY},.35) 0,rgba(${SKY},0) 140px)`)}`,

  // Service pages, each a different composition of that service's own work.
  web: (W, H, m) => {
    const S = SRC; let h = glow(W * 0.62, H * 0.5, 1100, ROYAL, 0.3);
    const st = `position:absolute;left:${m ? 0 : W * 0.3}px;top:${m ? 560 : 120}px;width:${m ? W : W * 0.8}px;height:${H}px;transform:perspective(2200px) rotateY(-24deg) rotateX(8deg);transform-style:preserve-3d`;
    h += `<div style="${st}">`;
    const list = [S.webs[0], S.webs[1], S.webs[2], S.webs[3], S.webs[4]];
    list.forEach((src, k) => { h += browser(src, (m ? 80 : 60) + k * (m ? 70 : 230), (m ? 40 : 60) + k * (m ? 150 : 130), m ? 800 : 980, { z: 10 - k, ar: 0.6 }); });
    h += `</div>` + phone(S.phones.subata, m ? 700 : W * 0.78, m ? 1160 : 640, m ? 300 : 270, { r: 4, z: 20 });
    h += shade(`background:linear-gradient(90deg,rgba(11,13,13,.92) 0%,rgba(11,13,13,.4) 35%,transparent 60%),linear-gradient(0deg,rgba(11,13,13,.75),transparent 40%)`);
    return h;
  },
  seo: (W, H, m) => {
    const S = SRC; let h = glow(W * 0.6, H * 0.45, 1000, ROYAL, 0.3) + glow(W * 0.85, H * 0.8, 600, SKY, 0.15);
    const box = (src, x, y, w, ar, t, z) => `<div class="i" style="left:${x}px;top:${y}px;width:${w}px;height:${w * ar}px;transform:${t};z-index:${z};background:#fff"><img src="${src}" style="object-fit:contain;background:#fff"></div>`;
    if (!m) { h += box(S.svc("search-engine-optimization"), 760, 140, 1300, 0.667, "perspective(2000px) rotateY(-14deg) rotateX(6deg)", 2) + box(S.seo, 1480, 760, 760, 0.572, "rotate(3deg)", 4) + box(S.google, 560, 820, 700, 0.575, "rotate(-4deg)", 5); }
    else { h += box(S.svc("search-engine-optimization"), 60, 560, 960, 0.667, "rotate(-3deg)", 2) + box(S.seo, 300, 1120, 720, 0.572, "rotate(4deg)", 4); }
    h += shade(`background:linear-gradient(90deg,rgba(11,13,13,.95) 0%,rgba(11,13,13,.45) ${m ? 0 : 32}%,transparent 60%),linear-gradient(0deg,rgba(11,13,13,.7),transparent 35%)`);
    return h;
  },
  performance: (W, H, m, variant = "ppc") => {
    const S = SRC; let h = glow(W * 0.65, H * 0.5, 1100, ROYAL, 0.28);
    const cap = variant === "facebook" ? S.meta : variant === "leadgen" ? S.dash[0] : S.google;
    const ar = variant === "leadgen" ? 0.532 : variant === "facebook" ? 0.572 : 0.573;
    const order = variant === "facebook" ? [S.creatives[2], S.creatives[3], S.creatives[1], S.creatives[0]] : variant === "leadgen" ? [S.creatives[0], S.creatives[1], S.creatives[3], S.creatives[2]] : [S.creatives[3], S.creatives[2], S.creatives[0], S.creatives[1]];
    if (!m) {
      h += `<div class="i" style="left:${W * 0.3}px;top:90px;width:1500px;height:${1500 * ar}px;background:#fff;transform:perspective(2400px) rotateY(-12deg) rotateX(4deg);z-index:2"><img src="${cap}" style="object-fit:cover;object-position:0 0"></div>`;
      if (variant === "leadgen") h += `<div class="i" style="left:${W * 0.62}px;top:560px;width:760px;height:${760 * ar}px;background:#fff;transform:rotate(3deg);z-index:3"><img src="${S.dash[1]}" style="object-fit:cover;object-position:0 0"></div>`;
      order.forEach((src, k) => { h += post(src, W * 0.36 + k * 370, 640 + (k % 2) * 90 - (k === 3 ? 40 : 0), 350, { r: (k - 1.5) * 3, z: 5 + k }); });
    } else {
      h += `<div class="i" style="left:40px;top:470px;width:1000px;height:${1000 * ar}px;background:#fff;z-index:2"><img src="${cap}" style="object-fit:cover;object-position:0 0"></div>`;
      order.slice(0, 3).forEach((src, k) => { h += post(src, 40 + k * 340, 900 + (k % 2) * 70, 330, { r: (k - 1) * 4, z: 5 + k }); });
    }
    h += shade(`background:linear-gradient(90deg,rgba(11,13,13,.95) 0%,rgba(11,13,13,.4) ${m ? 0 : 28}%,transparent 55%),linear-gradient(0deg,rgba(11,13,13,.7),transparent 30%)`);
    return h;
  },
  branding: (W, H, m) => {
    const S = SRC; let h = `<div class="s" style="background:radial-gradient(ellipse at 65% 45%,#1b2024,#0b0d0d 70%)"></div>`;
    const lay = m
      ? [[S.brand[0], 40, 520, 1000, 563, -3], [S.brand[6], 80, 1020, 560, 278, 4], [S.brand[3], 600, 1080, 440, 337, -5], [S.brand[8], 60, 1300, 300, 307, 6]]
      : [[S.brand[0], 900, 120, 1180, 664, -3], [S.brand[1], 1520, 690, 780, 439, 4], [S.brand[6], 760, 720, 640, 318, -5], [S.brand[3], 1980, 220, 380, 291, 8], [S.brand[9], 1340, 980, 300, 341, -7], [S.brand[7], 2120, 960, 240, 272, 5]];
    lay.forEach(([src, x, y, w, hh, r], k) => { h += img(src, x, y, w, hh, { r, z: k + 2 }); });
    h += shade(`background:linear-gradient(90deg,rgba(11,13,13,.95) 0%,rgba(11,13,13,.4) ${m ? 0 : 30}%,transparent 58%),linear-gradient(0deg,rgba(11,13,13,.6),transparent 30%)`);
    return h;
  },
  social: (W, H, m) => {
    const S = SRC; let h = glow(W * 0.66, H * 0.55, 1000, ROYAL, 0.3) + glow(W * 0.9, H * 0.3, 500, SKY, 0.15);
    // Short-form films in phones, campaign posts as 4:5 feed cards, fanned like a feed.
    const items = m
      ? [["p", S.yt[9], 20, 520, 300, -8], ["c", S.creatives[2], 300, 470, 470, 0], ["p", S.yt[11], 760, 520, 300, 8], ["c", S.creatives[1], 80, 1060, 380, -5], ["c", S.creatives[0], 600, 1080, 380, 5]]
      : [["p", S.yt[9], 820, 230, 330, -10], ["c", S.creatives[2], 1130, 170, 520, -3], ["p", S.yt[11], 1600, 150, 340, 4], ["c", S.creatives[1], 1910, 260, 440, 8], ["c", S.creatives[0], 960, 860, 360, 5], ["p", S.yt[13], 2180, 760, 300, 12]];
    items.forEach(([t, src, x, y, w, r], k) => { h += t === "p" ? phone(src, x, y, w, { r, z: 4 + k, pos: "50% 30%" }) : post(src, x, y, w, { r, z: 4 + k }); });
    h += shade(`background:linear-gradient(90deg,rgba(11,13,13,.95) 0%,rgba(11,13,13,.4) ${m ? 0 : 30}%,transparent 58%),linear-gradient(0deg,rgba(11,13,13,.75),transparent 34%)`);
    return h;
  },
  video: (W, H, m) => {
    const S = SRC; const cols = m ? 4 : 8, w = m ? 300 : 330;
    let h = `<div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) perspective(2400px) rotateX(18deg) rotateY(-12deg) rotateZ(-6deg);display:grid;grid-template-columns:repeat(${cols},${w}px);gap:22px">`;
    for (let k = 0; k < cols * 2; k++) h += `<div class="i" style="position:relative;width:${w}px;height:${w * 1.78}px;margin-top:${k % 2 ? 90 : 0}px"><img src="${S.yt[k % S.yt.length]}"></div>`;
    h += `</div>` + shade(`background:radial-gradient(ellipse at 30% 60%,rgba(11,13,13,.9),rgba(11,13,13,.35) 60%,rgba(11,13,13,.2)),linear-gradient(0deg,rgba(11,13,13,.7),transparent 35%)`);
    return h;
  },
  ecommerce: (W, H, m) => {
    const S = SRC; let h = glow(W * 0.62, H * 0.5, 1000, "200,170,120", 0.18) + glow(W * 0.8, H * 0.7, 700, ROYAL, 0.2);
    h += m ? browser(S.webs[6], 60, 560, 960, { ar: 0.62, t: "rotate(-2deg)" }) + phone(S.phones.mwb, 640, 980, 320, { r: 5, z: 3 })
      : browser(S.webs[6], 880, 170, 1240, { ar: 0.62, t: "perspective(2200px) rotateY(-12deg)" }) + phone(S.phones.mwb, 1900, 560, 300, { r: 4, z: 3 });
    h += shade(`background:linear-gradient(90deg,rgba(11,13,13,.95) 0%,rgba(11,13,13,.4) ${m ? 0 : 32}%,transparent 60%),linear-gradient(0deg,rgba(11,13,13,.6),transparent 30%)`);
    return h;
  },
  apps: (W, H, m) => {
    const S = SRC; let h = glow(W * 0.62, H * 0.5, 1000, "210,170,60", 0.14) + glow(W * 0.75, H * 0.4, 900, ROYAL, 0.22);
    h += m ? browser(S.webs[4], 60, 560, 960, { ar: 0.62, t: "rotate(2deg)" }) + phone(S.phones.finsckool, 640, 980, 320, { r: -5, z: 3 })
      : browser(S.webs[4], 880, 170, 1240, { ar: 0.62, t: "perspective(2200px) rotateY(-12deg)" }) + phone(S.phones.finsckool, 1900, 560, 300, { r: -4, z: 3 });
    h += shade(`background:linear-gradient(90deg,rgba(11,13,13,.95) 0%,rgba(11,13,13,.4) ${m ? 0 : 32}%,transparent 60%),linear-gradient(0deg,rgba(11,13,13,.6),transparent 30%)`);
    return h;
  },
  // City and country pages: a wide band of all eight services' work.
  location: (W, H, m) => {
    const list = ["website-design-development", "performance-marketing", "branding-creative-design", "social-media-marketing", "search-engine-optimization", "video-creative-production"].map(SRC.svc);
    const cols = m ? 2 : 3, w = m ? 520 : 760;
    let h = `<div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) perspective(2600px) rotateX(20deg) rotateZ(-8deg);display:grid;grid-template-columns:repeat(${cols},${w}px);gap:26px">`;
    list.forEach((src, k) => { h += `<div class="i" style="position:relative;width:${w}px;height:${w * 0.667}px;background:#fff;margin-top:${k % 2 ? 60 : 0}px"><img src="${src}"></div>`; });
    h += `</div>` + shade(`background:radial-gradient(ellipse at 50% 50%,rgba(11,13,13,.85),rgba(11,13,13,.5) 55%,rgba(11,13,13,.35))`);
    return h;
  },
  yugen: (W, H, m) => {
    const S = SRC; let h = `<div class="s" style="background:linear-gradient(160deg,#0f2318,#0b0d0d 70%)"></div>` + glow(W * 0.7, H * 0.5, 900, "52,140,90", 0.25);
    const w = m ? 300 : 330;
    S.yugen.forEach((p, k) => { h += phone(p, (m ? 60 : W * 0.5) + k * (m ? 330 : 380), (m ? 700 : 260) + (k % 2) * 90, w, { r: (k - 1) * 4, z: 3 }); });
    h += shade(`background:linear-gradient(90deg,rgba(11,13,13,.92) 0%,rgba(11,13,13,.35) ${m ? 0 : 38}%,transparent 60%),linear-gradient(0deg,rgba(11,13,13,.7),transparent 30%)`);
    return h;
  },
  onegoa: (W, H, m) => {
    const S = SRC; let h = img(S.onegoa.render, -40, -40, W + 80, H + 80, { rad: 0, f: "blur(18px) brightness(.4)" }) + glow(W * 0.7, H * 0.5, 900, "190,140,70", 0.2);
    h += m ? img(S.onegoa.render, 140, 620, 800, 820, { r: -2, z: 2 }) + phone(S.onegoa.posters[0], 660, 1040, 300, { r: 5, z: 4 })
      : img(S.onegoa.render, W * 0.5, 170, 760, 780, { r: -2, z: 2 }) + phone(S.onegoa.posters[0], W * 0.5 + 640, 360, 320, { r: 5, z: 4 });
    h += shade(`background:linear-gradient(90deg,rgba(11,13,13,.92) 0%,rgba(11,13,13,.35) ${m ? 0 : 38}%,transparent 60%),linear-gradient(0deg,rgba(11,13,13,.7),transparent 30%)`);
    return h;
  },
};

export const page = (body, W, H) => `<!doctype html><html><head><meta charset="utf-8"><style>${BASE}</style></head><body><div class="s grain" style="width:${W}px;height:${H}px">${body}</div></body></html>`;

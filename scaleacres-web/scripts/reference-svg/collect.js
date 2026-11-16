// Runs in the page. Walks the rendered DOM and returns drawing operations in paint order:
// rects (backgrounds, borders), text lines, images, inline SVGs, and "snap" regions that the
// caller rasterises (gradients, background images, canvas, video, rotated chrome).
(opts) => {
  const ops = [];
  let snapId = 0;
  const SNAP_ALL = opts.snapAll || [];
  const SKIP = opts.skip || [];
  const box = (r) => ({ x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height });
  const col = (c) => {
    if (!c) return null;
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const inter = (a, b) => {
    const x = Math.max(a.x, b.x), y = Math.max(a.y, b.y);
    const x2 = Math.min(a.x + a.w, b.x + b.w), y2 = Math.min(a.y + a.h, b.y + b.h);
    return { x, y, w: Math.max(0, x2 - x), h: Math.max(0, y2 - y) };
  };
  const clipOf = (e) => {
    let c = null, rad = 0;
    for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.overflowX !== "visible" || cs.overflowY !== "visible") {
        const r = box(n.getBoundingClientRect());
        if (!c) rad = parseFloat(cs.borderTopLeftRadius) || 0;
        c = c ? inter(c, r) : r;
      }
    }
    return c ? { ...c, rad } : null;
  };
  const opac = (e) => { let o = 1; for (let n = e; n && n.nodeType === 1; n = n.parentElement) o *= +getComputedStyle(n).opacity; return o; };
  const label = (e) => {
    const t = (e.getAttribute("aria-label") || e.getAttribute("alt") || e.id || String(e.className?.baseVal ?? e.className).split(" ")[0] || e.tagName).trim();
    return t.slice(0, 48);
  };
  const ctx = document.createElement("canvas").getContext("2d");
  const metrics = {};
  const fontMetrics = (cs) => {
    const k = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if (!metrics[k]) { ctx.font = k; const m = ctx.measureText("Hg"); metrics[k] = { a: m.fontBoundingBoxAscent, d: m.fontBoundingBoxDescent }; }
    return metrics[k];
  };
  const tx = (s, cs) => cs.textTransform === "uppercase" ? s.toUpperCase() : cs.textTransform === "lowercase" ? s.toLowerCase() : cs.textTransform === "capitalize" ? s.replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : s;

  const SHAPES = new Set(["path", "rect", "circle", "ellipse", "line", "polyline", "polygon", "g", "text", "tspan", "use", "svg"]);
  const svgOp = (e, r) => {
    const clone = e.cloneNode(true);
    const src = [e, ...e.querySelectorAll("*")], dst = [clone, ...clone.querySelectorAll("*")];
    src.forEach((s, i) => {
      const d = dst[i]; if (!d || !SHAPES.has(s.tagName.toLowerCase())) return;
      const cs = getComputedStyle(s);
      for (const p of ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "fill-opacity", "stroke-opacity", "opacity", "fill-rule"]) {
        const v = cs.getPropertyValue(p); if (v && v !== "normal") d.setAttribute(p, v);
      }
      if (cs.display === "none" || cs.visibility === "hidden") d.setAttribute("display", "none");
      d.removeAttribute("class"); d.removeAttribute("style");
    });
    // pull in sprite symbols referenced by <use>
    const defs = [];
    clone.querySelectorAll("use").forEach((u) => {
      const id = (u.getAttribute("href") || u.getAttribute("xlink:href") || "").replace(/^#/, "");
      const t = id && document.getElementById(id);
      if (t && !defs.includes(id)) { defs.push(id); const c = t.cloneNode(true); clone.insertBefore(Object.assign(document.createElementNS("http://www.w3.org/2000/svg", "defs"), {}), clone.firstChild).appendChild(c); }
    });
    if (!clone.getAttribute("viewBox")) clone.setAttribute("viewBox", `0 0 ${r.w} ${r.h}`);
    clone.setAttribute("x", r.x); clone.setAttribute("y", r.y); clone.setAttribute("width", r.w); clone.setAttribute("height", r.h);
    clone.removeAttribute("class"); clone.removeAttribute("style");
    ops.push({ k: "svg", label: label(e), markup: clone.outerHTML, op: opac(e), clip: clipOf(e) });
  };

  const textNode = (t) => {
    const el = t.parentElement; const cs = getComputedStyle(el);
    if (cs.visibility === "hidden") return;
    const o = opac(el); if (o < 0.02) return;
    const fill = col(cs.webkitTextFillColor) ?? col(cs.color);
    const sw = parseFloat(cs.webkitTextStrokeWidth) || 0;
    const stroke = sw ? col(cs.webkitTextStrokeColor) : null;
    if ((!fill || fill.a === 0) && !stroke) return;
    const fm = fontMetrics(cs);
    const re = /\S+/g; let m; const words = [];
    const range = document.createRange();
    while ((m = re.exec(t.data))) {
      range.setStart(t, m.index); range.setEnd(t, m.index + m[0].length);
      const rs = range.getClientRects(); if (!rs.length) continue;
      const r = rs[0]; if (r.width === 0) continue;
      words.push({ s: m[0], x: r.left + scrollX, y: r.top + scrollY, h: r.height, w: r.width });
    }
    const lines = [];
    for (const w of words) {
      const L = lines[lines.length - 1];
      if (L && Math.abs(L.y - w.y) < 3 && w.x >= L.x2 - 2) { L.s += " " + w.s; L.x2 = w.x + w.w; }
      else lines.push({ s: w.s, x: w.x, y: w.y, h: w.h, x2: w.x + w.w });
    }
    const fam = cs.fontFamily;
    const clip = clipOf(el);
    for (const L of lines) {
      if (clip) { const i = inter(clip, { x: L.x, y: L.y, w: L.x2 - L.x, h: L.h }); if (i.w * i.h < 0.5 * (L.x2 - L.x) * L.h) continue; }
      const base = L.y + (L.h - (fm.a + fm.d)) / 2 + fm.a;
      ops.push({
        k: "text", s: tx(L.s, cs), x: L.x, y: base, w: L.x2 - L.x, fam, size: parseFloat(cs.fontSize), weight: cs.fontWeight, style: cs.fontStyle,
        ls: cs.letterSpacing === "normal" ? 0 : parseFloat(cs.letterSpacing) || 0, fill, stroke, sw, op: o,
        deco: cs.textDecorationLine.includes("underline") ? "underline" : cs.textDecorationLine.includes("line-through") ? "line-through" : "",
        label: el.closest("h1,h2,h3,h4,p,a,button,li,span")?.tagName.toLowerCase() || "text",
      });
    }
  };

  const walk = (e) => {
    if (SKIP.some((s) => e.matches(s))) return;
    const cs = getComputedStyle(e);
    if (cs.display === "none") return;
    if (+cs.opacity < 0.02) return;
    const tag = e.tagName.toLowerCase();
    const r = box(e.getBoundingClientRect());
    const vis = cs.visibility !== "hidden";
    if (SNAP_ALL.some((s) => e.matches(s)) || ((tag === "canvas" || tag === "video" || tag === "iframe") && r.w > 0)) {
      const id = ++snapId; e.setAttribute("data-snap", id);
      ops.push({ k: "snap", id, all: true, ...r, label: label(e), clip: clipOf(e) });
      return;
    }
    if (vis && r.w > 0 && r.h > 0) {
      const bg = col(cs.backgroundColor);
      const rad = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomRightRadius, cs.borderBottomLeftRadius].map((v) => Math.min(parseFloat(v) || 0, r.w / 2, r.h / 2));
      if (bg && bg.a > 0) ops.push({ k: "rect", ...r, fill: bg, rad, op: opac(e), label: label(e), clip: clipOf(e) });
      if (cs.backgroundImage !== "none" && tag !== "img") {
        const id = ++snapId; e.setAttribute("data-snap", id);
        ops.push({ k: "snap", id, all: false, ...r, label: label(e) + (cs.backgroundImage.includes("url(") ? " image" : " gradient"), clip: clipOf(e) });
      }
      const sides = ["Top", "Right", "Bottom", "Left"].map((s) => ({ w: parseFloat(cs[`border${s}Width`]) || 0, c: col(cs[`border${s}Color`]), st: cs[`border${s}Style`] }));
      const vs = sides.filter((s) => s.w > 0 && s.st !== "none" && s.c && s.c.a > 0);
      if (vs.length === 4 && sides.every((s) => s.w === sides[0].w && JSON.stringify(s.c) === JSON.stringify(sides[0].c))) {
        ops.push({ k: "rect", ...r, stroke: sides[0].c, sw: sides[0].w, dash: sides[0].st === "dashed", rad, op: opac(e), label: label(e) + " border", clip: clipOf(e) });
      } else if (vs.length) {
        const o = opac(e);
        sides.forEach((s, i) => {
          if (!(s.w > 0 && s.st !== "none" && s.c && s.c.a > 0)) return;
          const g = [{ x: r.x, y: r.y, w: r.w, h: s.w }, { x: r.x + r.w - s.w, y: r.y, w: s.w, h: r.h }, { x: r.x, y: r.y + r.h - s.w, w: r.w, h: s.w }, { x: r.x, y: r.y, w: s.w, h: r.h }][i];
          ops.push({ k: "rect", ...g, fill: s.c, rad: [0, 0, 0, 0], op: o, label: "rule", clip: clipOf(e) });
        });
      }
    }
    if (tag === "img") {
      if (!vis || r.w === 0 || r.h === 0) return;
      ops.push({ k: "img", src: e.currentSrc || e.src, ...r, fit: cs.objectFit, pos: cs.objectPosition, filter: cs.filter, op: opac(e), clip: clipOf(e), rad: parseFloat(cs.borderTopLeftRadius) || 0, label: (e.alt || "image").slice(0, 60), nw: e.naturalWidth, nh: e.naturalHeight });
      return;
    }
    if (tag === "svg") { if (vis && r.w > 0) svgOp(e, r); return; }
    let kids = tag === "details" && !e.open ? [...e.children].filter((c) => c.tagName === "SUMMARY") : [...e.childNodes];
    // paint order: negative z-index first, then normal flow, then positioned children with a positive z-index
    const z = (c) => { if (c.nodeType !== 1) return 0; const cs = getComputedStyle(c); const v = parseInt(cs.zIndex); return cs.position !== "static" && !isNaN(v) ? Math.sign(v) * (1 + Math.abs(v)) : 0; };
    kids = kids.map((c, i) => [c, z(c), i]).sort((a, b) => a[1] - b[1] || a[2] - b[2]).map((x) => x[0]);
    for (const c of kids) {
      if (c.nodeType === 3 && c.data.trim()) textNode(c);
      else if (c.nodeType === 1) walk(c);
    }
  };

  // sections become top-level groups
  const roots = opts.roots.flatMap((s) => [...document.querySelectorAll(s)]);
  const groups = [];
  for (const root of roots) {
    const start = ops.length;
    walk(root);
    const h = root.querySelector("h1,h2,.t-hero,[class*=title]");
    const nm = (root.id || (h && h.textContent.trim().replace(/\s+/g, " ").slice(0, 40)) || String(root.className).split(" ")[0] || root.tagName).toLowerCase();
    groups.push({ name: nm, from: start, to: ops.length });
  }
  return { ops, groups, H: document.documentElement.scrollHeight, W: document.documentElement.clientWidth, pageBg: col(getComputedStyle(document.body).backgroundColor) };
}

/**
 * Runs inside the page (via Playwright page.evaluate). Walks the rendered DOM and emits an
 * editable SVG: backgrounds/borders as <rect>, text as <text> (one per rendered line),
 * inline <svg> (Lucide icons, Recharts) copied as native SVG, grouped with <g data-name>.
 *
 * Limitations (documented in README): box-shadows, backdrop blur, CSS gradients and
 * native form-control chrome are approximated; text uses alphabetic baselines estimated from
 * line boxes.
 */
export function domToSvg(opts) {
  const { width, height, title } = opts;
  const out = [];
  const defs = [];
  let clipSeq = 0;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const num = (n) => Math.round(n * 100) / 100;

  const parseColor = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return c === 'transparent' ? null : { css: c, a: 1 };
    const parts = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    const [r, g, b, a = 1] = parts;
    if (a === 0) return null;
    const hex = '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
    return { css: hex, a };
  };
  const colorAttrs = (prefix, c) => {
    const p = parseColor(c);
    if (!p) return `${prefix}="none"`;
    return `${prefix}="${p.css}"${p.a < 1 ? ` ${prefix}-opacity="${num(p.a)}"` : ''}`;
  };

  const isHidden = (el, cs) =>
    cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0 ||
    (cs.position === 'absolute' && cs.clip === 'rect(0px, 0px, 0px, 0px)');

  const rectOf = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
  };

  function emitBox(el, cs, r) {
    const bg = parseColor(cs.backgroundColor);
    const radius = parseFloat(cs.borderTopLeftRadius) || 0;
    const rx = Math.min(radius, r.w / 2, r.h / 2);
    const sides = ['Top', 'Right', 'Bottom', 'Left'].map((s) => ({
      w: parseFloat(cs[`border${s}Width`]) || 0,
      c: parseColor(cs[`border${s}Color`]),
      style: cs[`border${s}Style`],
    }));
    const visible = sides.filter((s) => s.w > 0 && s.c && s.style !== 'none');
    const uniform = visible.length === 4 && sides.every((s) => s.w === sides[0].w && s.c?.css === sides[0].c?.css && s.c?.a === sides[0].c?.a);
    if (bg || uniform) {
      const sw = uniform ? sides[0].w : 0;
      const stroke = uniform ? `${colorAttrs('stroke', cs.borderTopColor)} stroke-width="${sw}"${sides[0].style === 'dashed' ? ' stroke-dasharray="4 3"' : ''}` : '';
      out.push(`<rect x="${num(r.x + sw / 2)}" y="${num(r.y + sw / 2)}" width="${num(Math.max(0, r.w - sw))}" height="${num(Math.max(0, r.h - sw))}" rx="${num(Math.max(0, rx - sw / 2))}" ${bg ? colorAttrs('fill', cs.backgroundColor) : 'fill="none"'} ${stroke}/>`);
    }
    if (!uniform && visible.length) {
      const [t, rt, b, l] = sides;
      if (t.w && t.c) out.push(`<rect x="${num(r.x)}" y="${num(r.y)}" width="${num(r.w)}" height="${num(t.w)}" ${colorAttrs('fill', cs.borderTopColor)}/>`);
      if (b.w && b.c) out.push(`<rect x="${num(r.x)}" y="${num(r.y + r.h - b.w)}" width="${num(r.w)}" height="${num(b.w)}" ${colorAttrs('fill', cs.borderBottomColor)}/>`);
      if (l.w && l.c) out.push(`<rect x="${num(r.x)}" y="${num(r.y)}" width="${num(l.w)}" height="${num(r.h)}" rx="${num(Math.min(rx, l.w))}" ${colorAttrs('fill', cs.borderLeftColor)}/>`);
      if (rt.w && rt.c) out.push(`<rect x="${num(r.x + r.w - rt.w)}" y="${num(r.y)}" width="${num(rt.w)}" height="${num(r.h)}" ${colorAttrs('fill', cs.borderRightColor)}/>`);
    }
  }

  function textAttrs(cs) {
    const family = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    const ls = parseFloat(cs.letterSpacing);
    return `font-family="${esc(family)}, Inter, system-ui, sans-serif" font-size="${num(parseFloat(cs.fontSize))}" font-weight="${cs.fontWeight}" ${colorAttrs('fill', cs.color)}${ls ? ` letter-spacing="${num(ls)}"` : ''}${cs.fontStyle !== 'normal' ? ` font-style="${cs.fontStyle}"` : ''}`;
  }

  function transformText(s, cs) {
    if (cs.textTransform === 'uppercase') return s.toUpperCase();
    if (cs.textTransform === 'capitalize') return s.replace(/\b\w/g, (c) => c.toUpperCase());
    return s;
  }

  /** Emit one <text> per rendered line of a text node, truncating with … when ellipsised. */
  function emitTextNode(node, cs, clipRight) {
    const raw = node.textContent ?? '';
    if (!raw.trim()) return;
    const range = document.createRange();
    const lines = [];
    let cur = null;
    for (let i = 0; i < raw.length; i++) {
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const rects = range.getClientRects();
      if (!rects.length) continue;
      const rc = rects[0];
      if (rc.width === 0 && /\s/.test(raw[i])) continue;
      const top = Math.round(rc.top);
      if (!cur || Math.abs(cur.top - top) > 2) {
        cur = { top, left: rc.left, right: rc.right, height: rc.height, text: '', clipped: false };
        lines.push(cur);
      }
      if (clipRight !== null && rc.right > clipRight + 0.5) {
        cur.clipped = true;
        continue;
      }
      cur.text += raw[i];
      cur.right = rc.right;
      cur.height = Math.max(cur.height, rc.height);
    }
    for (const ln of lines) {
      let text = ln.text.replace(/\s+/g, ' ');
      if (ln.clipped) text = text.replace(/\s+$/, '').slice(0, -1) + '…';
      if (!text.trim()) continue;
      const baseline = ln.top + window.scrollY + ln.height * 0.8;
      out.push(`<text x="${num(ln.left + window.scrollX)}" y="${num(baseline)}" ${textAttrs(cs)} xml:space="preserve">${esc(transformText(text, cs))}</text>`);
    }
  }

  function emitInlineSvg(el, cs, r) {
    const clone = el.cloneNode(true);
    const color = parseColor(cs.color)?.css ?? '#000';
    clone.removeAttribute('class');
    clone.removeAttribute('style');
    clone.setAttribute('x', num(r.x));
    clone.setAttribute('y', num(r.y));
    clone.setAttribute('width', num(r.w));
    clone.setAttribute('height', num(r.h));
    if (!clone.getAttribute('viewBox')) clone.setAttribute('viewBox', `0 0 ${num(r.w)} ${num(r.h)}`);
    if (!clone.getAttribute('preserveAspectRatio')) clone.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    // Resolve CSS variables and currentColor used by Recharts / Lucide into literal values.
    const resolve = (node, live) => {
      for (const attr of ['fill', 'stroke', 'color']) {
        const v = node.getAttribute(attr);
        if (!v) continue;
        if (v === 'currentColor') node.setAttribute(attr, color);
        else if (v.startsWith('var(')) {
          const computed = live ? getComputedStyle(live)[attr === 'color' ? 'color' : attr] : null;
          node.setAttribute(attr, parseColor(computed ?? '')?.css ?? color);
        }
      }
      const st = node.getAttribute('style');
      if (st) {
        const live2 = live ? getComputedStyle(live) : null;
        if (live2) {
          if (/fill/.test(st)) node.setAttribute('fill', parseColor(live2.fill)?.css ?? color);
          if (/font-size/.test(st)) node.setAttribute('font-size', num(parseFloat(live2.fontSize)));
          if (/font-weight/.test(st)) node.setAttribute('font-weight', live2.fontWeight);
        }
        node.removeAttribute('style');
      }
      if (node.tagName === 'text' || node.tagName === 'tspan') {
        node.setAttribute('font-family', 'Inter, system-ui, sans-serif');
        if (live && !node.getAttribute('font-size')) node.setAttribute('font-size', num(parseFloat(getComputedStyle(live).fontSize)));
        if (live && !node.getAttribute('fill')) node.setAttribute('fill', parseColor(getComputedStyle(live).fill)?.css ?? color);
      }
      const kids = node.children;
      const liveKids = live ? live.children : [];
      for (let i = 0; i < kids.length; i++) resolve(kids[i], liveKids[i] ?? null);
    };
    resolve(clone, el);
    clone.querySelectorAll('title').forEach((t) => t.remove());
    out.push(clone.outerHTML);
  }

  function formControlText(el, cs, r) {
    let value = '';
    let placeholder = false;
    if (el.tagName === 'SELECT') value = el.selectedOptions[0]?.textContent ?? '';
    else if (el.tagName === 'INPUT') {
      if (el.type === 'checkbox') {
        out.push(`<rect x="${num(r.x + 0.5)}" y="${num(r.y + 0.5)}" width="${num(r.w - 1)}" height="${num(r.h - 1)}" rx="3" fill="${el.checked ? '#3b5bdb' : '#fff'}" stroke="#6b7280"/>`);
        if (el.checked) out.push(`<path d="M${num(r.x + 3.5)} ${num(r.y + r.h / 2)} l${num(r.w * 0.22)} ${num(r.h * 0.22)} l${num(r.w * 0.4)} -${num(r.h * 0.42)}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`);
        return;
      }
      value = el.value;
      if (!value && el.placeholder) { value = el.placeholder; placeholder = true; }
      if (el.type === 'date' && el.value) {
        const [y, m, d] = el.value.split('-');
        value = `${d}/${m}/${y}`;
      }
    }
    if (!value) return;
    const pl = parseFloat(cs.paddingLeft) || 0;
    const fs = parseFloat(cs.fontSize);
    const color = placeholder ? '#6b7280' : parseColor(cs.color)?.css ?? '#111827';
    const family = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    out.push(`<text x="${num(r.x + pl)}" y="${num(r.y + r.h / 2 + fs * 0.35)}" font-family="${esc(family)}, Inter, system-ui, sans-serif" font-size="${num(fs)}" font-weight="${cs.fontWeight}" fill="${color}">${esc(value)}</text>`);
  }

  const groupName = (el) => {
    const explicit = el.getAttribute('data-export-group');
    if (explicit) return explicit;
    const tag = el.tagName.toLowerCase();
    if (['section', 'article', 'header', 'footer', 'nav', 'aside', 'main', 'form', 'table', 'thead', 'tbody', 'tr', 'ul', 'ol', 'li', 'button', 'figure', 'dialog'].includes(tag)) {
      const label = el.getAttribute('aria-label') || el.querySelector?.(':scope > h1, :scope > h2, :scope > h3, :scope > header h2')?.textContent?.trim();
      return label ? `${tag}: ${label.slice(0, 60)}` : tag;
    }
    if (el.getAttribute('role') === 'dialog') return 'dialog';
    return null;
  };

  function walk(el, clipRight) {
    if (!(el instanceof Element)) return;
    const cs = getComputedStyle(el);
    if (isHidden(el, cs)) return;
    const r = rectOf(el);
    if (el.tagName.toLowerCase() === 'svg') {
      if (r.w > 0 && r.h > 0) emitInlineSvg(el, cs, r);
      return;
    }
    const name = groupName(el);
    if (name) out.push(`<g data-name="${esc(name)}">`);
    let pushedClip = false;
    if (r.w > 0 && r.h > 0) {
      emitBox(el, cs, r);
      const overflowHidden = ['hidden', 'auto', 'scroll', 'clip'].includes(cs.overflowX) || ['hidden', 'auto', 'scroll', 'clip'].includes(cs.overflowY);
      if (overflowHidden && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) && cs.textOverflow !== 'ellipsis') {
        const id = `clip-${++clipSeq}`;
        const rx = parseFloat(cs.borderTopLeftRadius) || 0;
        defs.push(`<clipPath id="${id}"><rect x="${num(r.x)}" y="${num(r.y)}" width="${num(r.w)}" height="${num(r.h)}" rx="${num(rx)}"/></clipPath>`);
        out.push(`<g clip-path="url(#${id})">`);
        pushedClip = true;
      }
    }
    if (['SELECT', 'INPUT'].includes(el.tagName)) {
      formControlText(el, cs, r);
    } else {
      const ellipsis = cs.textOverflow === 'ellipsis' && cs.overflowX !== 'visible' ? r.x + r.w - (parseFloat(cs.paddingRight) || 0) : clipRight;
      for (const child of el.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) emitTextNode(child, cs, ellipsis);
        else walk(child, ellipsis);
      }
    }
    if (pushedClip) out.push('</g>');
    if (name) out.push('</g>');
  }

  const bodyBg = parseColor(getComputedStyle(document.body).backgroundColor)?.css ?? '#ffffff';
  out.push(`<rect x="0" y="0" width="${width}" height="${height}" fill="${bodyBg}" data-name="page background"/>`);
  walk(document.getElementById('root'), null);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="Inter, system-ui, sans-serif">
<title>${esc(title)}</title>
<desc>Editable SVG export of the Pipeline CRM practice prototype (AI-assisted, not an assessment submission). Supplied metrics exact; opportunity records are illustrative demo data.</desc>
${defs.length ? `<defs>${defs.join('')}</defs>` : ''}
${out.join('\n')}
</svg>`;
}

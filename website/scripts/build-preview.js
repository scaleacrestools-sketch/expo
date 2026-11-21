#!/usr/bin/env node
/* Builds a relative-path copy of dist/ for hosting in a sub-folder or static preview (no /api/lead available). */
const fs = require('fs'); const path = require('path');
const DIST = path.join(__dirname, '..', 'dist'); const OUT = process.argv[2] || path.join(__dirname, '..', 'preview');
fs.rmSync(OUT, { recursive: true, force: true });
const skip = f => /\.webm$|e-brochure\.pdf$|_redirects$|404\.html$/.test(f);
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const notice = `<div style="position:fixed;left:0;right:0;top:0;z-index:200;background:#aa7761;color:#ffffff;font:600 12px/1.4 Figtree,Arial,sans-serif;text-align:center;padding:6px 12px">Preview build: enquiry forms submit only on the deployed site with the lead API. Everything else is fully interactive.</div>`;
for (const f of walk(DIST)) {
  const rel = path.relative(DIST, f); if (skip(rel)) continue;
  const dest = path.join(OUT, rel); fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (!rel.endsWith('.html')) { fs.copyFileSync(f, dest); continue; }
  const depth = rel.split(path.sep).length - 1; const pre = depth ? '../'.repeat(depth) : './';
  let h = fs.readFileSync(f, 'utf8');
  h = h.replace(/(\s(?:href|src|srcset|poster|action|data-[a-z-]+))="\/(?!\/)([^"]*)"/g, (m, a, p) => {
    const [pathPart, hash = ''] = p.split('#'); const [pp, q = ''] = pathPart.split('?');
    let out = pp === '' ? 'index.html' : (pp.endsWith('/') ? pp + 'index.html' : pp);
    return `${a}="${pre}${out}${q ? '?' + q : ''}${hash ? '#' + hash : ''}"`;
  });
  h = h.replace('window.SITE={', `window.SITE={root:${JSON.stringify(pre)},index:"index.html",`);
  h = h.replace('<a class="skip"', notice + '<a class="skip"');
  h = h.replace(/data-desktop-webm="[^"]*"|data-mobile-webm="[^"]*"/g, '');
  h = h.replace('href="../assets/downloads/assetz-muse-and-maison-e-brochure.pdf"', 'href="https://www.assetzproperty.com/museandmaison/"');
  if (rel === 'index.html') { // the artifact host wraps the main page in its own document skeleton
    const head = h.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<meta charset[^>]*>\s*/, '').replace(/<meta name="viewport"[^>]*>\s*/, '');
    const body = h.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];
    h = '<meta name="claude:viewport-fit-sides" content="cover">\n' + head + '\n' + body;
  }
  fs.writeFileSync(dest, h);
}
const files = walk(OUT); const size = files.reduce((s, f) => s + fs.statSync(f).size, 0);
console.log(`Preview: ${files.length} files, ${(size / 1048576).toFixed(1)} MB → ${OUT}`);

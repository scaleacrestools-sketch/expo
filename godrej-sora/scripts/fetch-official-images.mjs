// Run on a machine that can reach godrejproperties.com. Downloads every image referenced by the official project
// page and its gallery into _masters/official/ with a report of URL, size and alt text, for manual mapping to manifest ids.
import fs from 'node:fs';
import path from 'node:path';

const pages = [
  'https://www.godrejproperties.com/gurugram/residential/godrej-sora',
  'https://www.godrejproperties.com/gurugram/residential/godrej-sora/gallery',
];
const out = path.resolve('public/images/godrej-sora/_masters/official');
fs.mkdirSync(out, { recursive: true });
const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/128 Safari/537.36';
const report = [];
for (const page of pages) {
  const html = await (await fetch(page, { headers: { 'user-agent': ua } })).text();
  const imgs = new Set();
  for (const m of html.matchAll(/<img[^>]+>/gi)) {
    const tag = m[0];
    const src = /(?:data-src|src)=["']([^"']+)["']/i.exec(tag)?.[1];
    const alt = /alt=["']([^"']*)["']/i.exec(tag)?.[1] || '';
    if (src && !/\.svg$|logo|icon|sprite/i.test(src)) imgs.add(JSON.stringify({ src: new URL(src, page).href, alt }));
  }
  for (const m of html.matchAll(/https?:\/\/[^"'\s)]+\.(?:jpe?g|png|webp)(?:\?[^"'\s)]*)?/gi)) imgs.add(JSON.stringify({ src: m[0], alt: '' }));
  for (const j of imgs) {
    const { src, alt } = JSON.parse(j);
    const name = path.basename(new URL(src).pathname).replace(/[^\w.-]/g, '_');
    const dest = path.join(out, name);
    try {
      const res = await fetch(src, { headers: { 'user-agent': ua, referer: page } });
      if (!res.ok) throw new Error(String(res.status));
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      report.push({ file: name, src, alt, bytes: fs.statSync(dest).size, page });
      console.log('saved', name);
    } catch (e) { report.push({ file: name, src, alt, error: String(e), page }); }
  }
}
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
console.log(`\n${report.filter((r) => !r.error).length} files saved to ${out}. Map them to manifest ids by renaming to ../<id>.jpg, then npm run assets:optimize.`);

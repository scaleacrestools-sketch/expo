// Generates docs/03-image-usage.md from content/assets.ts + the files present on disk.
import fs from 'node:fs';
import path from 'node:path';
const src = fs.readFileSync('content/assets.ts', 'utf8');
const rows = [...src.matchAll(/A\(\{ id: '([^']+)', title: '((?:[^'\\]|\\.)*)', kind: '([^']+)', source: '([^']+)', approval: '([^']+)', section: '([^']+)'/g)]
  .map((m) => ({ id: m[1], title: m[2].replace(/\\'/g, "'"), kind: m[3], source: m[4], approval: m[5], section: m[6] }));
const root = 'public/images/godrej-sora';
const ext = ['avif', 'webp', 'jpg', 'png', 'svg'];
const kindLabel = { 'artist-impression': "Artist's impression (not an actual site image)", stock: 'Stock image for representation purpose only', 'ai-generated': 'AI-generated image', brand: 'Brand artwork', plan: 'Indicative plan', map: 'Indicative map (not to scale)', photograph: 'Photograph' };
let present = 0;
const lines = rows.map((r) => {
  const f = ext.find((e) => fs.existsSync(path.join(root, `${r.id}.${e}`)));
  if (f) present++;
  let dims = '';
  try { const j = JSON.parse(fs.readFileSync(path.join(root, `${r.id}.json`), 'utf8')); dims = `${j.width}×${j.height}`; } catch {}
  return `| ${r.section} | \`${r.id}\` | ${r.title} | ${r.source} | ${kindLabel[r.kind] || r.kind} | ${r.approval} | ${f ? `✔ ${f}${dims ? ` (${dims})` : ''}` : '✖ placeholder'} |`;
});
const out = `# Image library and section-by-section image usage

Generated ${new Date().toISOString().slice(0, 10)} by \`npm run assets:report\`. **${present} of ${rows.length}** manifest assets present on disk.

Source of every file: the official 64-page Godrej Sora brochure (Godrej Properties Limited, "Opp Doc", Sept 2025), rendered at 220 dpi and cropped per \`content/brochure-map.ts\`. Classification follows the brochure's own per-page disclosure line (stock / artist's impression / AI generated). Each rendered image carries the matching disclosure chip on the page.

**Approval status:** \`pending\` = asset supplied by the client from the official brochure; written republication permission from Godrej Properties / the channel-partner agreement must be filed before go-live, then set \`approval: 'approved'\` in \`content/assets.ts\`.

| Section | Asset id | Title | Brochure source | Classification | Approval | File |
|---|---|---|---|---|---|---|
${lines.join('\n')}

Not supplied by the brochure (still placeholders): floor plans, master plan, website gallery renders and the vector logos. Floor plans and the master plan must come from the official website or the sales team; the Godrej Sora and Godrej Properties logos should be supplied as vector files (\`assets-source/logo/\`) — the current logo is a raster crop of brochure p.10.
`;
fs.writeFileSync('docs/03-image-usage.md', out);
console.log(`docs/03-image-usage.md written — ${present}/${rows.length} present`);

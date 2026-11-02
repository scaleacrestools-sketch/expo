// Exports editable SVGs (and PNG previews) of the running app at 1440 / 768 / 390 px plus the
// opportunity-drawer interaction state. Usage: node scripts/export-svg.mjs (expects preview on :4173)
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL ?? 'http://localhost:4173/';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SVG_DIR = path.join(ROOT, 'exports/svg');
const PNG_DIR = path.join(ROOT, 'exports/previews');
const serializerSource = await readFile(path.join(ROOT, 'scripts/dom-to-svg.js'), 'utf8');
// Turn the ES module into a plain function body usable by page.evaluate.
const serializerFn = serializerSource.replace('export function domToSvg', 'function domToSvg');

const targets = [
  { file: 'crm-dashboard-desktop', title: 'CRM Dashboard — Desktop 1440', width: 1440, height: 900 },
  { file: 'crm-dashboard-tablet', title: 'CRM Dashboard — Tablet 768', width: 768, height: 1024 },
  { file: 'crm-dashboard-mobile', title: 'CRM Dashboard — Mobile 390', width: 390, height: 844 },
];

await mkdir(SVG_DIR, { recursive: true });
await mkdir(PNG_DIR, { recursive: true });
const browser = await chromium.launch();

async function freshPage(width, height) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return page;
}

async function serialize(page, { width, height, title }) {
  return page.evaluate(({ src, width, height, title }) => {
    const domToSvg = new Function(`${src}; return domToSvg;`)();
    return domToSvg({ width, height, title });
  }, { src: serializerFn, width, height, title });
}

const report = [];

for (const t of targets) {
  const page = await freshPage(t.width, t.height);
  const fullHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  // Resize the viewport to the full page so sticky/fixed elements sit in document coordinates.
  await page.setViewportSize({ width: t.width, height: fullHeight });
  await page.waitForTimeout(300);
  const svg = await serialize(page, { ...t, height: fullHeight });
  const svgPath = path.join(SVG_DIR, `${t.file}.svg`);
  await writeFile(svgPath, svg);
  await page.screenshot({ path: path.join(PNG_DIR, `${t.file}.png`), fullPage: true });
  report.push({ file: svgPath, width: t.width, height: fullHeight, bytes: svg.length, texts: (svg.match(/<text /g) ?? []).length });
  await page.close();
}

// Interaction state: at-risk drawer open on desktop with annotations in a side panel.
{
  const width = 1440;
  const height = 900;
  const page = await freshPage(width, height);
  await page.locator('[data-export-group="overdue-followups"] li button').first().click();
  await page.getByRole('dialog').waitFor();
  await page.waitForTimeout(300);
  const inner = await serialize(page, { width, height, title: 'CRM Opportunity Interaction — at-risk detail drawer' });
  await page.screenshot({ path: path.join(PNG_DIR, 'crm-opportunity-interaction.png'), fullPage: false });

  // Annotation panel appended to the right of the captured viewport.
  const panelW = 420;
  const totalW = width + panelW;
  const callouts = [
    { n: 1, x: 1404, y: 84, title: 'Select an at-risk opportunity', body: 'The Overdue follow-ups queue lists illustrative demo records, highest priority first. Clicking a row opens the detail drawer (role="dialog", focus trapped, Escape closes).' },
    { n: 2, x: 1404, y: 300, title: 'Review opportunity context', body: 'Owner, stage, unweighted deal value, due date, risk context, suggested next actions and recent activity are shown. Values are fictional and labelled as such.' },
    { n: 3, x: 1404, y: 850, title: 'Choose an action', body: '"Schedule follow-up" opens an inline date + note form; "Update stage" opens a stage select. Validation errors appear inline with role="alert".' },
    { n: 4, x: 1404, y: 588, title: 'Updated state and confirmation', body: 'On confirm the demo record updates immediately (due date or stage), activity log gains an entry, a success toast appears, and a rescheduled record leaves the overdue queue.' },
  ];
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const wrap = (text, max = 44) => {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    for (const w of words) {
      if ((line + ' ' + w).trim().length > max) { lines.push(line.trim()); line = w; } else line += ' ' + w;
    }
    if (line.trim()) lines.push(line.trim());
    return lines;
  };
  let y = 72;
  const ann = [];
  ann.push(`<rect x="${width}" y="0" width="${panelW}" height="${height}" fill="#ffffff"/>`);
  ann.push(`<rect x="${width}" y="0" width="1" height="${height}" fill="#e5e8ec"/>`);
  ann.push(`<text x="${width + 32}" y="40" font-size="16" font-weight="700" fill="#111827">At-risk opportunity interaction</text>`);
  ann.push(`<text x="${width + 32}" y="60" font-size="12" fill="#5b6472">Annotated state — desktop 1440 px, drawer open</text>`);
  for (const c of callouts) {
    ann.push(`<g data-name="callout ${c.n}">`);
    ann.push(`<circle cx="${c.x}" cy="${c.y}" r="14" fill="#3b5bdb" stroke="#ffffff" stroke-width="2"/>`);
    ann.push(`<text x="${c.x}" y="${c.y + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="#ffffff">${c.n}</text>`);
    ann.push(`<circle cx="${width + 44}" cy="${y + 8}" r="12" fill="#3b5bdb"/>`);
    ann.push(`<text x="${width + 44}" y="${y + 12.5}" text-anchor="middle" font-size="12" font-weight="700" fill="#ffffff">${c.n}</text>`);
    ann.push(`<text x="${width + 66}" y="${y + 13}" font-size="13" font-weight="600" fill="#111827">${esc(c.title)}</text>`);
    let ly = y + 32;
    for (const line of wrap(c.body, 52)) {
      ann.push(`<text x="${width + 66}" y="${ly}" font-size="12" fill="#374151">${esc(line)}</text>`);
      ly += 17;
    }
    ann.push('</g>');
    y = ly + 18;
  }
  ann.push(`<text x="${width + 32}" y="${height - 56}" font-size="11" fill="#6b7280">AI-assisted practice prototype. Fictional records are labelled as demo data.</text>`);
  ann.push(`<text x="${width + 32}" y="${height - 40}" font-size="11" fill="#6b7280">Not eligible as an independently designed assessment submission.</text>`);

  const svg = inner
    .replace(`width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"`, `width="${totalW}" height="${height}" viewBox="0 0 ${totalW} ${height}"`)
    .replace(/<\/svg>\s*$/, `<g data-name="annotations">\n${ann.join('\n')}\n</g>\n</svg>`);
  const svgPath = path.join(SVG_DIR, 'crm-opportunity-interaction.svg');
  await writeFile(svgPath, svg);
  report.push({ file: svgPath, width: totalW, height, bytes: svg.length, texts: (svg.match(/<text /g) ?? []).length });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));

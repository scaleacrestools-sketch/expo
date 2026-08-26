/**
 * Bundles the homepage into ONE self-contained HTML file.
 *
 * Used to publish a shareable preview. Styles, scripts and all 35 vector
 * mockups are inlined; the only external request left is Google Fonts.
 * Images are deduplicated into a data-URI map (133 <img> tags reference 35
 * unique files), which keeps the bundle around a quarter of the size that
 * inlining each tag separately would produce.
 *
 * Run:  node tools/build-artifact.mjs   →   dist/scaleacres-homepage.html
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(resolve(ROOT, p), 'utf8');

const html = read('index.html');
const css = read('assets/css/style.css');
const content = read('assets/js/content.js');
const main = read('assets/js/main.js');

/* ------------------------------------------------- image data-URI map --- */
const imgDir = resolve(ROOT, 'assets/img');
// referenced from index.html, and from the poster fields in content.js
const used = new Set([
  ...[...html.matchAll(/assets\/img\/([\w.-]+\.svg)/g)].map((m) => m[1]),
  ...[...content.matchAll(/poster:\s*'([\w.-]+\.svg)'/g)].map((m) => m[1]),
]);
const map = {};
for (const name of readdirSync(imgDir)) {
  if (!used.has(name)) continue;
  map[name] = 'data:image/svg+xml;base64,' + readFileSync(resolve(imgDir, name)).toString('base64');
}

/* ------------------------------------------- extract the body markup ---- */
let body = html.slice(html.indexOf('>', html.indexOf('<body')) + 1, html.lastIndexOf('</body>'));

// swap every img src for a lookup key resolved before first paint
body = body.replace(/src="assets\/img\/([\w.-]+\.svg)"/g, 'data-img="$1"');
// the module tags are inlined below instead
body = body.replace(/<script src="assets\/js\/[\w.-]+" defer><\/script>\s*/g, '');
// content.js stores bare filenames, so it needs no rewriting
const contentInlined = content;
// main.js builds card and modal markup by concatenating the image directory
const mainInlined = main.split("assets/img/' + item.poster + '").join("' + SA_IMG(item.poster) + '");

/* The artifact wrapper owns <head>, so this file cannot declare a charset.
   Escape every non-ASCII character instead — HTML entities in markup, \uXXXX
   in script and style — so the bundle renders identically whatever encoding
   the host serves it with. */
const escHtml = (s) => s.replace(/[^\x00-\x7F]/g, (c) => '&#x' + c.codePointAt(0).toString(16) + ';');
const escJs = (s) =>
  s.replace(/[^\x00-\x7F]/g, (c) => '\\u' + c.codePointAt(0).toString(16).padStart(4, '0'));

const title = 'ScaleAcres Homepage';

const out = `<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap">
<style>
${escJs(css)}
</style>
<script>
document.documentElement.className += " js";
var SA_IMAGES = ${JSON.stringify(map)};
function SA_IMG(n) { return SA_IMAGES[n] || ""; }
</script>
${escHtml(body)}
<script>
// resolve inlined artwork before first paint
(function () {
  var els = document.querySelectorAll('[data-img]');
  for (var i = 0; i < els.length; i++) {
    var k = els[i].getAttribute('data-img');
    if (SA_IMAGES[k]) els[i].src = SA_IMAGES[k];
  }
})();
</script>
<script>
${escJs(contentInlined)}
</script>
<script>
${escJs(mainInlined)}
</script>
`;

mkdirSync(resolve(ROOT, 'dist'), { recursive: true });
writeFileSync(resolve(ROOT, 'dist/scaleacres-homepage.html'), out);
console.log(
  `wrote dist/scaleacres-homepage.html — ${(Buffer.byteLength(out) / 1024).toFixed(0)} KB, ` +
    `${Object.keys(map).length} inlined images`
);

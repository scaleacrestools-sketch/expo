// Lists which manifest assets are present under public/images/godrej-sora and which are missing.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve('public/images/godrej-sora');
const manifestSrc = fs.readFileSync(path.resolve('content/assets.ts'), 'utf8');
const ids = [...manifestSrc.matchAll(/id: '([^']+)'/g)].map((m) => m[1]);
const ext = ['avif', 'webp', 'jpg', 'jpeg', 'png', 'svg'];
let present = 0;
for (const id of ids) {
  const found = ext.find((e) => fs.existsSync(path.join(root, `${id}.${e}`)));
  console.log(`${found ? '✔' : '✖'} ${id}${found ? `.${found}` : '   (missing → placeholder renders)'}`);
  if (found) present++;
}
console.log(`\n${present}/${ids.length} assets present. Drop approved files at ${pathToFileURL(root).pathname}/<id>.<ext>`);

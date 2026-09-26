// Downloads the media assets listed in media-sources.json into public/,
// skipping files that already exist (e.g. when they are committed to the
// repo). Runs before the production build; requires network access to the
// source CDNs, so in restricted environments commit the fetched files
// instead of running this.
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sources = createRequire(import.meta.url)(join(root, 'media-sources.json'));

let failures = 0;

for (const [localPath, source] of Object.entries(sources)) {
  const target = join(root, 'public', localPath);
  try {
    await access(target);
    console.log(`skip   ${localPath} (already present)`);
    continue;
  } catch {
    // not present — fetch below
  }

  const candidates = Array.isArray(source) ? source : [source];
  let saved = false;
  for (const url of candidates) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const bytes = Buffer.from(await res.arrayBuffer());
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, bytes);
      console.log(`fetch  ${localPath} <- ${url} (${(bytes.length / 1024).toFixed(0)} KB)`);
      saved = true;
      break;
    } catch (err) {
      console.warn(`retry  ${localPath}: ${url} failed (${err.message ?? err})`);
    }
  }
  if (!saved) {
    failures += 1;
    console.error(`FAIL   ${localPath}: no candidate URL succeeded`);
  }
}

if (failures > 0) {
  console.error(`${failures} asset(s) could not be fetched`);
  process.exit(1);
}
console.log('all media assets present');

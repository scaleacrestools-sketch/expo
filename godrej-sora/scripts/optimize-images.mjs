// Converts any .jpg/.png master in public/images/godrej-sora/_masters/<id>.<ext>
// into responsive AVIF + WebP + JPG variants next to the manifest id, and writes a .json sidecar with dimensions.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const masters = path.resolve('public/images/godrej-sora/_masters');
const out = path.resolve('public/images/godrej-sora');
if (!fs.existsSync(masters)) {
  console.log('No _masters directory. Place originals at public/images/godrej-sora/_masters/<id>.<jpg|png>');
  process.exit(0);
}
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
for (const file of walk(masters).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
  const rel = path.relative(masters, file).replace(/\.(jpe?g|png)$/i, '');
  const target = path.join(out, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const img = sharp(file).rotate();
  const meta = await img.metadata();
  const width = Math.min(meta.width ?? 2560, 2560);
  await img.clone().resize({ width, withoutEnlargement: true }).avif({ quality: 55 }).toFile(`${target}.avif`);
  await img.clone().resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${target}.webp`);
  await img.clone().resize({ width, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(`${target}.jpg`);
  const scale = width / (meta.width ?? width);
  fs.writeFileSync(`${target}.json`, JSON.stringify({ width, height: Math.round((meta.height ?? width) * scale) }));
  console.log('optimized', rel);
}

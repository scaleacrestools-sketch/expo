#!/usr/bin/env node
/**
 * Generates optimized GIF demos.
 *  - From rendered video frames (.cache/frames, created by scripts/render-video): hero, calling, qualification, site visit.
 *  - Captured live from the running site: omnichannel workflow, database reactivation, full landing-page scroll preview.
 * Usage: node scripts/generate-gifs/generate.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const base = process.argv[2] || 'http://localhost:4173/';
const out = join(root, 'public/assets/gifs');
const previewDir = join(root, 'preview');
const cache = join(root, '.cache');
mkdirSync(out, { recursive: true }); mkdirSync(previewDir, { recursive: true });
const ff = (args) => execFileSync('ffmpeg', ['-y', '-v', 'error', ...args]);

/** Two-pass palette GIF from an image sequence or concat list. */
function toGif(inputArgs, file, { width = 960, fps = 12, speed = 1 } = {}) {
  const vf = `setpts=PTS/${speed},fps=${fps},scale=${width}:-1:flags=lanczos`;
  const pal = join(cache, 'palette.png');
  ff([...inputArgs, '-vf', `${vf},palettegen=max_colors=160:stats_mode=diff`, pal]);
  ff([...inputArgs, '-i', pal, '-lavfi', `${vf} [x]; [x][1:v] paletteuse=dither=sierra2_4a:diff_mode=rectangle`, '-loop', '0', file]);
  console.log('gif', file);
}

// 1) From rendered frames
const frames = (m) => join(cache, 'frames', m, 'f%05d.jpg');
if (existsSync(join(cache, 'frames/walkthrough'))) {
  // -t must precede -i so it limits this input (not the palette input added later).
  const clip = (start, dur) => ['-framerate', '30', '-start_number', String(Math.round(start * 30)), '-t', String(dur), '-i', frames('walkthrough')];
  toGif(clip(3.75, 7.5), join(out, 'ai-calling.gif'), { width: 800, fps: 10 });
  toGif(clip(7.5, 7.5), join(out, 'lead-qualification.gif'), { width: 800, fps: 10 });
  toGif(clip(18.75, 7.5), join(out, 'site-visit-booking.gif'), { width: 800, fps: 10 });
}
if (existsSync(join(cache, 'frames/hero'))) {
  toGif(['-framerate', '30', '-i', frames('hero')], join(out, 'hero-dashboard.gif'), { width: 800, speed: 1.5, fps: 10 });
}

// 2) Live captures
const browser = await chromium.launch();
async function captureElement(selector, seconds, file, { width = 1440, height = 900, gifWidth = 960 } = {}) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '[data-testid="navbar"]{display:none!important}' });
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const dir = join(cache, 'live', file.replace('.gif', ''));
  rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const list = []; const t0 = Date.now(); let i = 0; let last = t0;
  while (Date.now() - t0 < seconds * 1000) {
    const p = join(dir, `f${String(i).padStart(4, '0')}.png`);
    await el.screenshot({ path: p });
    const now = Date.now();
    if (i > 0) list.push(`duration ${((now - last) / 1000).toFixed(3)}`);
    list.push(`file '${p}'`); last = now; i++;
  }
  list.push('duration 0.1');
  const lf = join(dir, 'list.txt'); writeFileSync(lf, list.join('\n'));
  await page.close();
  toGif(['-f', 'concat', '-safe', '0', '-i', lf], join(out, file), { width: gifWidth, fps: 10 });
}
await captureElement('[data-testid="omnichannel"]', 12, 'omnichannel-workflow.gif');
await captureElement('#problem article:nth-of-type(1) >> nth=2', 7, 'database-reactivation.gif', { gifWidth: 520 });

// 3) Landing page scroll preview (GIF + MP4) from the actual rendered site.
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const H = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);
  const dir = join(cache, 'live', 'scroll'); rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const step = 36; let i = 0;
  for (let y = 0; y <= H; y += step) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await page.waitForTimeout(y === 0 ? 1200 : 60);
    await page.screenshot({ path: join(dir, `f${String(i++).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 85 });
  }
  for (let k = 0; k < 20; k++) await page.screenshot({ path: join(dir, `f${String(i++).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 85 });
  await page.close();
  const seq = ['-framerate', '30', '-i', join(dir, 'f%04d.jpg')];
  ff([...seq, '-vf', 'scale=1440:-2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-movflags', '+faststart', join(previewDir, 'landing-page-preview.mp4')]);
  toGif(seq, join(previewDir, 'landing-page-preview.gif'), { width: 640, fps: 10, speed: 1.2 });
  execFileSync('cp', [join(previewDir, 'landing-page-preview.gif'), join(out, 'landing-page-preview.gif')]);
  console.log('scroll preview frames', i);
}
await browser.close();

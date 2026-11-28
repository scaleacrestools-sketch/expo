#!/usr/bin/env node
/**
 * Renders the product walkthrough and hero animation videos frame by frame.
 * The page /?render=walkthrough|hero exposes window.__setTime(t); every frame is set explicitly,
 * screenshotted at 1920x1080 and encoded with FFmpeg (H.264 MP4 + VP9 WebM).
 * Usage: node scripts/render-video/render.mjs [baseUrl] [fps] [only]
 */
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const base = process.argv[2] || 'http://localhost:4173/';
const fps = +(process.argv[3] || 30);
const only = process.argv[4];
const outDir = join(root, 'public/assets/videos');
mkdirSync(outDir, { recursive: true });
export const framesRoot = join(root, '.cache/frames');

const browser = await chromium.launch();
for (const mode of ['walkthrough', 'hero']) {
  if (only && only !== mode) continue;
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(`${base}?render=${mode}`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__renderReady === true);
  await page.evaluate(() => document.fonts.ready);
  const duration = await page.evaluate(() => window.__duration);
  const dir = join(framesRoot, mode);
  rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const total = Math.round(duration * fps);
  for (let f = 0; f < total; f++) {
    await page.evaluate((t) => new Promise((r) => { window.__setTime(t); requestAnimationFrame(() => requestAnimationFrame(r)); }), f / fps);
    await page.screenshot({ path: join(dir, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 92 });
    if (f % 60 === 0) console.log(mode, f, '/', total);
  }
  await page.close();
  const name = mode === 'hero' ? 'hero-animation' : 'product-walkthrough';
  const input = ['-y', '-v', 'error', '-framerate', String(fps), '-i', join(dir, 'f%05d.jpg')];
  execFileSync('ffmpeg', [...input, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '22', '-preset', 'slow', '-movflags', '+faststart', '-an', join(outDir, `${name}.mp4`)]);
  execFileSync('ffmpeg', [...input, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '36', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '4', '-an', join(outDir, `${name}.webm`)]);
  console.log('encoded', name);
  if (mode === 'walkthrough') {
    // Poster from the dashboard scene.
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', join(dir, `f${String(Math.round(29 * fps)).padStart(5, '0')}.jpg`), '-vf', 'scale=1280:-1', '-quality', '82', join(outDir, 'video-poster.webp')]);
  }
}
await browser.close();

// WebVTT captions generated from the scene list.
const { walkthroughScenes, SCENE_LEN } = await import(join(root, '.cache/scenes.mjs')).catch(() => ({}));
if (walkthroughScenes) {
  const ts = (s) => `00:00:${String(Math.floor(s)).padStart(2, '0')}.${String(Math.round((s % 1) * 1000)).padStart(3, '0')}`;
  const vtt = ['WEBVTT', '', ...walkthroughScenes.flatMap((s, i) => [`${i + 1}`, `${ts(i * SCENE_LEN)} --> ${ts((i + 1) * SCENE_LEN - 0.05)}`, `${s.title}: ${s.caption}`, ''])].join('\n');
  writeFileSync(join(outDir, 'product-walkthrough.vtt'), vtt);
  console.log('wrote captions');
}

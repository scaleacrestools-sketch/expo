#!/usr/bin/env node
/**
 * Real-time review recordings of the landing page (NOT part of the site bundle).
 * Captures Chrome's compositor frames via CDP Page.startScreencast with their real timestamps, then
 * FFmpeg rebuilds a constant 30 fps video with each frame held for exactly as long as it was on screen.
 * Nothing is sped up. A visible cursor (desktop) / tap ripple (mobile) is injected only during recording.
 * Usage: node scripts/record-preview/record.mjs desktop|mobile [baseUrl]
 * Output: preview/landing-page-desktop-preview-v3.mp4 · preview/landing-page-mobile-preview-v3.mp4
 */
import { chromium, devices } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const mode = process.argv[2] || 'desktop';
const base = process.argv[3] || 'http://localhost:4173/';
const mobile = mode === 'mobile';
const W = mobile ? 390 : 1920, H = mobile ? 844 : 1080, DSF = mobile ? 2 : 1;
const frameDir = join(root, `.cache/rec-${mode}`);
rmSync(frameDir, { recursive: true, force: true }); mkdirSync(frameDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext(mobile ? { ...devices['iPhone 13'], deviceScaleFactor: DSF } : { viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(base, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({ content: `
  #rec-cursor{position:fixed;left:0;top:0;width:22px;height:22px;z-index:2147483647;pointer-events:none;transition:transform .7s cubic-bezier(.22,1,.36,1);transform:translate(960px,700px)}
  #rec-cursor svg{filter:drop-shadow(0 2px 4px rgba(0,0,0,.5))}
  .rec-tap{position:fixed;z-index:2147483647;pointer-events:none;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(164,139,255,.45);border:2px solid rgba(255,255,255,.85);animation:rec-tap .6s ease-out forwards}
  @keyframes rec-tap{from{transform:scale(.4);opacity:1}to{transform:scale(1.4);opacity:0}}
  html{scroll-behavior:auto!important}` });
if (!mobile) await page.evaluate(() => { const d = document.createElement('div'); d.id = 'rec-cursor'; d.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#111" stroke-width="1.5" stroke-linejoin="round"/></svg>'; document.body.appendChild(d); });

const wait = (ms) => page.waitForTimeout(ms);
const scrollY = (y, ms = 1400) => page.evaluate(([y, ms]) => new Promise((r) => {
  const s = window.scrollY, d = y - s, t0 = performance.now();
  const f = (n) => { const k = Math.min(1, (n - t0) / ms); const e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; window.scrollTo(0, s + d * e); k < 1 ? requestAnimationFrame(f) : r(); };
  requestAnimationFrame(f);
}), [y, ms]);
const topOf = (sel) => page.evaluate((sel) => { const e = document.querySelector(sel); return e ? e.getBoundingClientRect().top + window.scrollY : null; }, sel);
const heightOf = (sel) => page.evaluate((sel) => document.querySelector(sel)?.getBoundingClientRect().height ?? 0, sel);
/** Scroll to a section, then step through it so tall sections are fully shown. */
async function visit(sel, holdMs = 4000, opts = {}) {
  const off = mobile ? 60 : 70;
  const y = await topOf(sel); if (y == null) { console.warn('missing', sel); return; }
  await scrollY(Math.max(0, y - off), opts.ms ?? 1500); await wait(holdMs);
  if (opts.walk === false) return;
  const h = await heightOf(sel); let pos = y - off;
  while (pos + H < y + h - 40) { pos = Math.min(pos + H * 0.75, y + h - H); await scrollY(pos, 1200); await wait(opts.step ?? 2600); }
}
async function point(loc) {
  await loc.scrollIntoViewIfNeeded().catch(() => {});
  const b = await loc.boundingBox(); if (!b) return null;
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  if (!mobile) { await page.evaluate(([x, y]) => { document.getElementById('rec-cursor').style.transform = `translate(${x - 4}px,${y - 2}px)`; }, [x, y]); await wait(750); await page.mouse.move(x, y); }
  return { x, y };
}
async function click(sel, after = 2500) {
  const loc = page.locator(sel).filter({ visible: true }).first();
  const p = await point(loc); if (!p) { console.warn('no target', sel); return; }
  if (mobile) await page.evaluate(([x, y]) => { const t = document.createElement('div'); t.className = 'rec-tap'; t.style.left = x + 'px'; t.style.top = y + 'px'; document.body.appendChild(t); setTimeout(() => t.remove(), 700); }, [p.x, p.y]);
  await loc.click(); await wait(after);
}
async function hover(sel, after = 2500) { const p = await point(page.locator(sel).filter({ visible: true }).first()); if (p) await wait(after); }

// Start capturing.
const cdp = await ctx.newCDPSession(page);
const frames = []; let n = 0;
cdp.on('Page.screencastFrame', async (f) => {
  const file = join(frameDir, `f${String(n++).padStart(6, '0')}.jpg`);
  writeFileSync(file, Buffer.from(f.data, 'base64')); frames.push({ t: f.metadata.timestamp, file });
  await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
});
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: W * DSF, maxHeight: H * DSF, everyNthFrame: 1 });
const t0 = Date.now();

if (!mobile) {
  await wait(7000);                                         // hero cycle
  await hover('[data-testid="hero-demo"]', 1200);
  await click('[data-testid="hero-video"]', 1800);          // demo modal
  await click('[data-testid="video-play-overlay"]', 6000);
  await page.keyboard.press('Escape'); await wait(1200);
  await visit('#trusted', 3500, { walk: false });
  await visit('#problem', 4500);
  await visit('#funnel', 2500, { walk: false });
  await click('[data-testid="funnel-manual"]', 3000); await click('[data-testid="funnel-ai"]', 3000);
  await visit('#performance', 3500, { walk: false });
  await hover('[data-testid="performance-dashboard"] svg', 2500);
  await visit('#how-it-works', 3000, { walk: false });
  await click('[data-testid="step-2"]', 4000);
  await visit('#voice-agents', 2500, { walk: false });
  await click('[data-testid="voice-tab-1"]', 2000); await click('[data-testid="voice-lang-hi"]', 1500);
  await click('[data-testid="voice-play"]', 5000); await click('[data-testid="voice-play"]', 1500);
  await visit('#omnichannel', 7000, { walk: false });
  await visit('#features', 3500, { step: 3200 });
  await visit('#use-cases', 2500, { walk: false });
  await click('[data-testid="uc-tab-1"]', 3000); await click('[data-testid="uc-tab-3"]', 3000);
  await visit('#qualification', 7000);
  await visit('#integrations', 4500, { walk: false });
  await hover('[data-testid="integration-card"] >> nth=8', 3000); await hover('[data-testid="integration-engine"]', 3500);
  await visit('#mobile', 2500, { walk: false });
  await click('[data-testid="mobile-tab-1"]', 3000); await click('[data-testid="mobile-tab-2"]', 3000);
  await visit('#compare', 3000);
  await visit('#faq', 2000, { walk: false });
  await click('[data-testid="faq-q-1"]', 3000); await click('[data-testid="faq-q-3"]', 3000);
  await visit('#cta', 3000, { walk: false });
  await hover('[data-testid="cta-demo"]', 2000);
  await scrollY(await page.evaluate(() => document.body.scrollHeight - innerHeight), 1800); await wait(5000);  // full footer
} else {
  await wait(5000);
  await click('[data-testid="mobile-menu-button"]', 2500);  // nav open
  await click('[data-testid="mobile-menu-button"]', 1500);  // nav close
  await wait(6000);                                         // hero story
  await visit('#top', 2500, { step: 4000 });
  await visit('#trusted', 3000, { walk: false });
  await visit('#problem', 3000);
  await visit('#funnel', 2500);
  await click('[data-testid="funnel-manual"]', 2500); await click('[data-testid="funnel-ai"]', 2000);
  await visit('#performance', 3000);
  await visit('#how-it-works', 3000, { walk: false });
  await click('[data-testid="step-m-2"]', 3500); await click('[data-testid="step-m-3"]', 3500);
  await visit('#voice-agents', 2500, { walk: false });
  await click('[data-testid="voice-tab-2"]', 1800); await click('[data-testid="voice-lang-hinglish"]', 1500);
  await click('[data-testid="voice-play"]', 4500); await click('[data-testid="voice-play"]', 1000);
  await visit('#voice-agents', 1500, { ms: 600 });
  await visit('#omnichannel', 5000);
  await visit('#features', 2500, { step: 2600 });
  await visit('#use-cases', 2500, { walk: false });
  await click('[data-testid="uc-tab-1"]', 3000);
  await visit('#use-cases', 1000, { ms: 600 });
  await visit('#qualification', 5000);
  await visit('#integrations', 4000);
  await visit('#mobile', 2500);
  await click('[data-testid="mobile-tab-1"]', 3000);
  await visit('#compare', 2500, { walk: false });
  await click('[data-testid="compare-vs-2"]', 2500);
  await visit('#compare', 1500, { ms: 600 });
  await visit('#faq', 2000, { walk: false });
  await click('[data-testid="faq-q-1"]', 3000);
  await visit('#faq', 1500, { ms: 600 });
  await visit('#cta', 2500, { walk: false });
  await click('[data-testid="cta-demo"]', 3500);             // demo modal
  await page.keyboard.press('Escape'); await wait(1500);
  await scrollY(await page.evaluate(() => document.body.scrollHeight - innerHeight), 1800); await wait(5000);
}
await cdp.send('Page.stopScreencast');
const realSecs = (Date.now() - t0) / 1000;
await browser.close();

// Rebuild a constant-frame-rate video from the real frame timestamps (no speed change).
const list = frames.map((f, i) => `file '${f.file}'\nduration ${Math.max(0.001, ((frames[i + 1]?.t ?? f.t + 1) - f.t)).toFixed(4)}`).join('\n') + `\nfile '${frames.at(-1).file}'\n`;
writeFileSync(join(frameDir, 'list.txt'), list);
mkdirSync(join(root, 'preview'), { recursive: true });
const out = join(root, `preview/landing-page-${mode}-preview-v3.mp4`);
const scale = mobile ? 'scale=780:1688:flags=lanczos' : 'scale=1920:1080:flags=lanczos';
execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', join(frameDir, 'list.txt'), '-vf', `${scale},fps=30,format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-movflags', '+faststart', '-r', '30', out]);
console.log(mode, 'frames', frames.length, 'wall-clock', realSecs.toFixed(1), 's →', out);

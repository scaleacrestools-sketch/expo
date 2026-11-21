#!/usr/bin/env node
/* QA: visits every route (dist/routes.txt) at desktop + phone, collects console errors, failed requests, horizontal overflow and broken internal links. */
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const BASE = process.env.BASE || 'http://localhost:4173';
const OUT = process.argv[2] || 'qa-shots';
(async () => {
  const routes = (await (await fetch(BASE + '/routes.txt')).text()).split('\n').filter(Boolean); // written by build.js
  routes.push('/404/');
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(); const links = new Set(); const report = [];
  for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
    const ctx = await b.newContext({ viewport: size });
    for (const r of routes) {
      const p = await ctx.newPage(); const errs = []; const fails = [];
      p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)); });
      p.on('requestfailed', q => { const u = q.url(); if (u.startsWith(BASE)) fails.push(u.replace(BASE, '')); });
      p.on('response', s => { if (s.url().startsWith(BASE) && s.status() >= 400 && !s.url().endsWith('/404/')) fails.push(s.status() + ' ' + s.url().replace(BASE, '')); });
      await p.goto(BASE + r, { waitUntil: 'load' }); await p.waitForTimeout(400);
      const info = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: innerWidth, h1: document.querySelectorAll('h1').length, title: document.title, desc: (document.querySelector('meta[name=description]') || {}).content || '', links: [...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href').split('#')[0].split('?')[0]), deadButtons: [...document.querySelectorAll('a[href="#"], a:not([href])')].length }));
      info.links.forEach(l => links.add(l));
      if (vp === 'desktop' || r === '/' || r.startsWith('/projects/assetz-mizu')) { await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); document.querySelectorAll('.reveal').forEach(e => e.classList.remove('pre')); document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager'); }); await p.waitForTimeout(1200); await p.screenshot({ path: path.join(OUT, `${vp}${r.replace(/\//g, '_') || '_'}.png`), fullPage: true }); }
      report.push({ vp, r, overflow: info.sw > info.w, h1: info.h1, titleLen: info.title.length, descLen: info.desc.length, errs, fails: [...new Set(fails)], dead: info.deadButtons });
      await p.close();
    }
    await ctx.close();
  }
  const broken = [];
  for (const l of links) { const res = await fetch(BASE + l); if (res.status >= 400) broken.push(res.status + ' ' + l); }
  await b.close();
  const bad = report.filter(x => x.overflow || x.h1 !== 1 || x.errs.length || x.fails.length || x.dead);
  console.log(`Routes: ${routes.length} × 2 viewports. Internal links checked: ${links.size}. Broken: ${broken.length}`);
  broken.forEach(x => console.log('BROKEN', x));
  bad.forEach(x => console.log('ISSUE', JSON.stringify(x)));
  if (!bad.length && !broken.length) console.log('All checks passed.');
})();

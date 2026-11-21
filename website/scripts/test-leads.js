#!/usr/bin/env node
/* End-to-end lead tests: API validation + browser submissions for each form type. */
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://localhost:4173';
const post = b => fetch(BASE + '/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: BASE }, body: JSON.stringify(b) }).then(async r => [r.status, await r.json()]);
(async () => {
  const ok = { name: 'Test Buyer', countryCode: '+91', phone: '9876543210', email: 'test.buyer@example.com', project: 'Trees & Tandem', consent: 'on', type: 'Enquiry', utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'qa' };
  const results = [];
  results.push(['valid enquiry', ...(await post(ok))]);
  results.push(['missing consent', ...(await post({ ...ok, consent: '' }))]);
  results.push(['bad phone', ...(await post({ ...ok, phone: '12345' }))]);
  results.push(['bad email', ...(await post({ ...ok, email: 'nope' }))]);
  results.push(['unknown project', ...(await post({ ...ok, project: 'Some Other Project' }))]);
  results.push(['honeypot', ...(await post({ ...ok, website: 'spam.example' }))]);
  results.push(['guide', ...(await post({ ...ok, type: 'Guide', phone: '9876500001' }))]);
  results.push(['brochure muse', ...(await post({ ...ok, type: 'Brochure', project: 'Muse & Maison', phone: '9876500002' }))]);
  results.push(['nri +971', ...(await post({ ...ok, type: 'NRI', countryCode: '+971', phone: '501234567', phone2: 1 }))]);
  results.push(['duplicate', ...(await post(ok))]);
  for (const r of results) console.log(r[0].padEnd(18), r[1], JSON.stringify(r[2]));

  // Browser flows: homepage enquiry, project brochure popup, guide download
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const fill = async (sel) => { await p.fill(`${sel} [name=name]`, 'Browser Tester'); await p.fill(`${sel} [name=phone]`, '9123456780'); await p.fill(`${sel} [name=email]`, 'browser@example.com'); const s = await p.$(`${sel} [name=project]`); if (await s.inputValue() === '') await s.selectOption({ index: 2 }); await p.check(`${sel} [name=consent]`); };
  await p.goto(BASE + '/?utm_source=meta&utm_campaign=launch'); await p.click('#cookie-accept');
  await p.goto(BASE + '/projects/assetz-mizumi-reserve/');
  await p.click('#hero-form button[type=submit]'); console.log('empty submit msg:', await p.textContent('#hero-form .status'));
  await fill('#hero-form'); await Promise.all([p.waitForURL('**/thank-you/**'), p.click('#hero-form button[type=submit]')]); console.log('project hero enquiry →', new URL(p.url()).pathname + new URL(p.url()).search);
  await p.goto(BASE + '/'); await p.click('.header .enq-link'); await p.waitForTimeout(300); console.log('header enquire popup title:', await p.textContent('#popup-title'));
  await p.goto(BASE + '/projects/assetz-muse-and-maison/'); await p.click('#overview .enq-open[data-type="Brochure"]'); await p.waitForTimeout(300);
  console.log('popup title:', await p.textContent('#popup-title'), '| project preselected:', await p.inputValue('#popup-form [name=project]'));
  await fill('#popup-form'); await Promise.all([p.waitForURL('**/thank-you/**'), p.click('#popup-form button[type=submit]')]);
  console.log('brochure → download visible:', await p.isVisible('#ty-download'), await p.getAttribute('#ty-download', 'href'));
  await p.goto(BASE + '/'); await fill('#guide-form'); await Promise.all([p.waitForURL('**/thank-you/**'), p.click('#guide-form button[type=submit]')]);
  console.log('guide → download visible:', await p.isVisible('#ty-download'), await p.getAttribute('#ty-download', 'href'), '| msg:', (await p.textContent('#ty-msg')).slice(0, 50));
  const dl = await fetch(BASE + (await p.getAttribute('#ty-download', 'href'))); console.log('guide PDF:', dl.status, dl.headers.get('content-type'), (await dl.arrayBuffer()).byteLength, 'bytes');
  // finder → filtered listing
  await p.goto(BASE + '/'); await p.selectOption('#finder [name=location]', 'Hoskote'); await Promise.all([p.waitForURL('**/projects/**'), p.click('#finder button[type=submit]')]);
  console.log('finder Hoskote →', new URL(p.url()).search, '| visible cards:', await p.$$eval('#results .card:not([hidden]) h3', els => els.map(e => e.textContent.trim())));
  await p.selectOption('#filters [name=configuration]', '4 BHK'); console.log('Hoskote + 4 BHK → empty state shown:', await p.isVisible('#empty'));
  await p.click('#clear-filters'); console.log('cleared → count:', await p.textContent('#result-count'));
  await b.close();
})();

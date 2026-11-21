/* Assetz website — client behaviour (header, menus, hero, sliders, forms, tracking) */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ROOT = (window.SITE && window.SITE.root) || '/'; const IDX = (window.SITE && window.SITE.index) || '';
  const route = r => ROOT + r + (r.endsWith('/') ? IDX : '');
  const track = (event, data) => { try { window.dataLayer.push(Object.assign({ event }, data || {})); } catch (e) {} };

  /* Toast */
  const toast = $('#toast'); let toastTimer;
  const say = msg => { if (!toast) return; toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3200); };

  /* Header solid on scroll + back to top */
  const header = $('#header'), toTop = $('#to-top'), hero = $('.hero');
  const threshold = hero ? Math.max(80, hero.offsetHeight - 90) : 40;
  const onScroll = () => {
    if (header && !header.classList.contains('always-solid')) header.classList.toggle('solid', window.scrollY > threshold);
    if (toTop) toTop.classList.toggle('show', window.scrollY > 700);
  };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* Overlays */
  function overlay(el, openers, closer, onOpen) {
    if (!el) return { open() {}, close() {} };
    let last = null;
    const open = () => { last = document.activeElement; el.classList.add('open'); el.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; const f = el.querySelector('input, button, a'); if (f) setTimeout(() => f.focus(), 50); onOpen && onOpen(); };
    const close = () => { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; if (last && last.focus) last.focus(); };
    openers.forEach(b => b && b.addEventListener('click', e => { e.preventDefault(); open(); }));
    closer && closer.addEventListener('click', close);
    el.addEventListener('click', e => { if (e.target === el) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && el.classList.contains('open')) close(); });
    return { open, close };
  }
  const mega = overlay($('#mega'), [$('#mega-open')], $('#mega-close'));
  const megaBtn = $('#mega-open'); if (megaBtn) { megaBtn.addEventListener('click', () => megaBtn.setAttribute('aria-expanded', 'true')); const c = $('#mega-close'); c && c.addEventListener('click', () => megaBtn.setAttribute('aria-expanded', 'false')); }
  $$('#mega a[href]').forEach(a => a.addEventListener('click', mega.close));
  const popup = overlay($('#popup'), $$('.enq-open'), $('#popup-close'));
  $$('.enq-open').forEach(b => b.addEventListener('click', () => {
    const f = $('#popup-form'); if (!f) return;
    const t = b.dataset.type; const p = b.dataset.project;
    const tt = t || 'Enquiry'; f.dataset.type = tt; f.querySelector('[name=type]').value = tt;
    const h = $('#popup-title'); if (h) h.textContent = tt === 'Brochure' ? 'Request Brochure' : tt === 'Site Visit' ? 'Book a Site Visit' : 'Get in Touch with us';
    if (p) { const s = f.querySelector('[name=project]'); if (s) s.value = p; }
    track('enquiry_open', { source: b.dataset.source || 'button', enquiry_type: t || 'Enquiry' });
  }));
  overlay($('#search'), [$('#search-open')], $('#search-close'));
  const sIn = $('#search-input');
  if (sIn) sIn.addEventListener('input', () => { const q = sIn.value.trim().toLowerCase(); $$('#search-results a').forEach(a => { a.hidden = q && !a.dataset.text.includes(q); }); });

  /* Hero video: lazy source, poster fallback, pause/play */
  const video = $('#hero-video');
  if (video) {
    const toggle = $('#hero-toggle');
    const setSrc = () => {
      const mobile = window.matchMedia('(max-width: 767px)').matches;
      const want = mobile ? video.dataset.mobile : video.dataset.desktop;
      const wantWebm = mobile ? video.dataset.mobileWebm : video.dataset.desktopWebm;
      if (video.dataset.current === want) return;
      video.dataset.current = want; video.innerHTML = '';
      if (wantWebm) { const s1 = document.createElement('source'); s1.src = wantWebm; s1.type = 'video/webm'; video.appendChild(s1); }
      const s2 = document.createElement('source'); s2.src = want; s2.type = 'video/mp4'; video.appendChild(s2);
      video.load(); const p = video.play(); if (p && p.catch) p.catch(() => {});
    };
    const saveData = navigator.connection && navigator.connection.saveData;
    if (!reduce && !saveData) { setSrc(); window.addEventListener('resize', setSrc); }
    video.addEventListener('playing', () => video.classList.add('ready'));
    if (toggle) toggle.addEventListener('click', () => {
      if (!video.dataset.current) { setSrc(); toggle.dataset.paused = 'false'; return; }
      if (video.paused) { video.play(); toggle.dataset.paused = 'false'; toggle.setAttribute('aria-label', 'Pause video'); }
      else { video.pause(); toggle.dataset.paused = 'true'; toggle.setAttribute('aria-label', 'Play video'); }
    });
    if (reduce || saveData) { toggle && (toggle.dataset.paused = 'true'); }
    // subtle parallax on hero media
    if (!reduce) window.addEventListener('scroll', () => { const y = window.scrollY; if (y < window.innerHeight) video.style.transform = `translateY(${y * 0.18}px)`; }, { passive: true });
  }

  /* Property finder → /projects/?filters */
  const finder = $('#finder');
  if (finder) finder.addEventListener('submit', e => {
    e.preventDefault(); const q = new URLSearchParams();
    $$('select', finder).forEach(s => { if (s.value) q.set(s.name, s.value); });
    track('finder_search', Object.fromEntries(q.entries()));
    window.location.href = route('projects/') + (q.toString() ? '?' + q.toString() : '');
  });

  /* Counters */
  const counters = $$('[data-count]');
  const runCounter = el => {
    const target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.decimals || '0', 10), sfx = el.dataset.suffix || '';
    const start = performance.now(), dur = reduce ? 0 : 1800;
    const frame = now => { const p = dur ? Math.min(1, (now - start) / dur) : 1; const e = 1 - Math.pow(1 - p, 3); el.textContent = (target * e).toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + sfx; if (p < 1) requestAnimationFrame(frame); };
    requestAnimationFrame(frame);
  };
  if (counters.length) {
    if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { runCounter(en.target); io.unobserve(en.target); } }), { threshold: 0.5 }); counters.forEach(c => io.observe(c)); }
    else counters.forEach(runCounter);
  }

  /* Reveal on scroll (content readable at rest) */
  const reveals = $$('.reveal');
  if (reveals.length && 'IntersectionObserver' in window && !reduce) {
    reveals.forEach(el => { if (el.getBoundingClientRect().top > window.innerHeight) el.classList.add('pre'); });
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.remove('pre'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* Sliders: arrows + dots, swipe comes free from scroll-snap */
  $$('[data-slider]').forEach(sl => {
    const trackEl = $('.track', sl), slides = $$('.slide, .post, .card', trackEl); if (!trackEl || !slides.length) return;
    const dots = $('.dots', sl);
    if (dots) slides.forEach((s, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Go to slide ' + (i + 1)); b.addEventListener('click', () => trackEl.scrollTo({ left: s.offsetLeft - trackEl.offsetLeft, behavior: reduce ? 'auto' : 'smooth' })); dots.appendChild(b); });
    const update = () => { if (!dots) return; const idx = Math.round(trackEl.scrollLeft / (slides[0].offsetWidth + 20)); $$('button', dots).forEach((b, i) => b.setAttribute('aria-current', String(i === idx))); };
    update(); trackEl.addEventListener('scroll', update, { passive: true });
    $$('[data-dir]', sl).forEach(b => b.addEventListener('click', () => trackEl.scrollBy({ left: (slides[0].offsetWidth + 20) * parseInt(b.dataset.dir, 10), behavior: reduce ? 'auto' : 'smooth' })));
    let timer; const auto = sl.dataset.auto;
    if (auto && !reduce) { const next = () => { const max = trackEl.scrollWidth - trackEl.clientWidth; if (trackEl.scrollLeft >= max - 4) trackEl.scrollTo({ left: 0, behavior: 'smooth' }); else trackEl.scrollBy({ left: slides[0].offsetWidth + 20, behavior: 'smooth' }); }; timer = setInterval(next, parseInt(auto, 10)); sl.addEventListener('mouseenter', () => clearInterval(timer)); sl.addEventListener('mouseleave', () => { timer = setInterval(next, parseInt(auto, 10)); }); }
  });

  /* Horizontal tracks with external arrows (awards, collection, journal) */
  const step = el => { const c = el.firstElementChild; if (!c) return el.clientWidth; const gap = parseFloat(getComputedStyle(el).columnGap) || 0; return c.getBoundingClientRect().width + gap; };
  $$('[data-scroll]').forEach(group => {
    const trackEl = document.getElementById(group.dataset.scroll); if (!trackEl) return;
    $$('[data-dir]', group).forEach(b => b.addEventListener('click', () => {
      const dir = parseInt(b.dataset.dir, 10); const max = trackEl.scrollWidth - trackEl.clientWidth;
      if (dir > 0 && trackEl.scrollLeft >= max - 4) trackEl.scrollTo({ left: 0, behavior: reduce ? 'auto' : 'smooth' });
      else if (dir < 0 && trackEl.scrollLeft <= 4) trackEl.scrollTo({ left: max, behavior: reduce ? 'auto' : 'smooth' });
      else trackEl.scrollBy({ left: step(trackEl) * dir, behavior: reduce ? 'auto' : 'smooth' });
    }));
  });

  /* Collection slider: active slide drives the progress bar, autoplay every 7 s */
  const iconic = $('#iconic-track');
  if (iconic) {
    const slides = $$('.slide', iconic);
    const setActive = () => { const x = iconic.scrollLeft; let best = 0, d = Infinity; slides.forEach((s, k) => { const dd = Math.abs(s.offsetLeft - iconic.offsetLeft - parseFloat(getComputedStyle(iconic).paddingLeft || 0) - x); if (dd < d) { d = dd; best = k; } }); slides.forEach((s, k) => s.classList.toggle('is-active', k === best)); };
    let t; iconic.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(setActive, 80); }, { passive: true });
    if (!reduce) { let timer = setInterval(() => { const max = iconic.scrollWidth - iconic.clientWidth; if (iconic.scrollLeft >= max - 4) iconic.scrollTo({ left: 0, behavior: 'smooth' }); else iconic.scrollBy({ left: step(iconic), behavior: 'smooth' }); }, 7000);
      iconic.addEventListener('pointerenter', () => clearInterval(timer)); }
  }

  /* Philosophy accordion */
  const accs = $$('.acc');
  const accSet = p => accs.forEach(x => x.classList.toggle('active', x === p));
  accs.forEach(p => { p.addEventListener('click', () => accSet(p)); p.addEventListener('focusin', () => accSet(p)); if (window.matchMedia('(hover: hover)').matches) p.addEventListener('mouseenter', () => accSet(p)); });

  /* Project hero slides */
  const slidesEl = $$('#pdp-slides img');
  if (slidesEl.length) {
    let i = 0; const count = $('#g-count');
    const show = n => { i = (n + slidesEl.length) % slidesEl.length; slidesEl.forEach((g, k) => g.classList.toggle('active', k === i)); if (count) count.textContent = (i + 1) + ' / ' + slidesEl.length; };
    $('#g-prev') && $('#g-prev').addEventListener('click', () => show(i - 1));
    $('#g-next') && $('#g-next').addEventListener('click', () => show(i + 1));
    if (!reduce) setInterval(() => show(i + 1), 6000);
  }

  /* Read more (line-clamped text) */
  $$('[data-clamp]').forEach(b => {
    const el = document.getElementById(b.dataset.clamp); if (!el) return;
    if (el.scrollHeight <= el.clientHeight + 2) { b.hidden = true; return; }
    b.addEventListener('click', () => { const open = el.classList.toggle('open'); b.firstChild.textContent = open ? 'Read less ' : 'Read more '; });
  });

  /* Floor-plan carousel */
  const fpTrack = $('#fp-track');
  if (fpTrack) {
    const items = $$('.fp', fpTrack); const thumbs = $$('[data-fp-go]'); const cnt = $('#fp-count');
    const cur = () => Math.round(fpTrack.scrollLeft / step(fpTrack));
    const sync = () => { const k = Math.min(items.length - 1, cur()); thumbs.forEach((t, j) => t.setAttribute('aria-current', String(j === k))); if (cnt) cnt.textContent = (k + 1) + ' / ' + items.length; };
    const go = k => fpTrack.scrollTo({ left: step(fpTrack) * Math.max(0, Math.min(items.length - 1, k)), behavior: reduce ? 'auto' : 'smooth' });
    $$('[data-fp-dir]').forEach(b => b.addEventListener('click', () => go(cur() + parseInt(b.dataset.fpDir, 10))));
    thumbs.forEach(t => t.addEventListener('click', () => go(parseInt(t.dataset.fpGo, 10))));
    fpTrack.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  }

  /* EMI calculator (illustrative) */
  const emi = $('#emi');
  if (emi) {
    const amt = $('#emi-amt'), rate = $('#emi-rate'), yrs = $('#emi-yrs');
    const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
    const calc = () => {
      const P = parseFloat(amt.value.replace(/[^\d.]/g, '')) || 0, r = parseFloat(rate.value) / 1200, n = parseInt(yrs.value, 10) * 12;
      const m = r ? P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : P / n; const total = m * n;
      $('#emi-rate-o').textContent = parseFloat(rate.value).toFixed(2) + '%'; $('#emi-yrs-o').textContent = yrs.value + ' yrs';
      $('#emi-out').textContent = inr(m); $('#emi-total').textContent = inr(total);
      $('#emi-ring').style.setProperty('--p', (total ? (P / total) * 100 : 50).toFixed(1) + '%');
    };
    amt.addEventListener('input', () => { const d = amt.value.replace(/\D/g, ''); amt.value = d ? parseInt(d, 10).toLocaleString('en-IN') : ''; calc(); });
    rate.addEventListener('input', calc); yrs.addEventListener('input', calc); calc();
  }

  /* Project page: reading progress + active section anchor */
  const prog = $('#pdp-progress');
  if (prog) {
    const anchors = $$('.pdp-header .anchors a'); const secs = anchors.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    const upd = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight; prog.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
      let on = null; secs.forEach(s => { if (s.getBoundingClientRect().top < 120) on = s.id; });
      anchors.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + on));
    };
    upd(); window.addEventListener('scroll', upd, { passive: true });
  }
  const lb = $('#lightbox'); const lbImg = $('#lb-img'); const lbCap = $('#lb-cap'); let lbList = [], lbIdx = 0;
  const lbShow = n => { lbIdx = (n + lbList.length) % lbList.length; lbImg.src = lbList[lbIdx].src; lbImg.alt = lbList[lbIdx].cap; lbCap.textContent = lbList[lbIdx].cap; };
  const lbOpen = (list, idx) => { lbList = list; lbShow(idx); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
  const lbClose = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
  if (lb) {
    $('#lb-close').addEventListener('click', lbClose); $('#lb-prev').addEventListener('click', () => lbShow(lbIdx - 1)); $('#lb-next').addEventListener('click', () => lbShow(lbIdx + 1));
    lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });
    document.addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') lbClose(); if (e.key === 'ArrowLeft') lbShow(lbIdx - 1); if (e.key === 'ArrowRight') lbShow(lbIdx + 1); });
    $$('[data-lightbox-single]').forEach(b => b.addEventListener('click', () => lbOpen([{ src: b.dataset.src, cap: b.dataset.cap || '' }], 0)));
    $$('[data-lightbox]').forEach(group => { const items = $$('[data-src]', group); items.forEach((it, k) => it.addEventListener('click', e => { e.preventDefault(); lbOpen(items.map(x => ({ src: x.dataset.src, cap: x.dataset.cap || '' })), k); })); });
  }

  /* Tabs (floor plans / FAQ categories / blog categories) */
  $$('[data-tabs]').forEach(group => {
    const tabs = $$('.tab', group); const panels = $$('[data-panel]', document);
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => x.setAttribute('aria-selected', String(x === t)));
      const key = t.dataset.tab; const scope = group.dataset.tabs;
      $$(`[data-panel][data-scope="${scope}"]`).forEach(p => { const on = key === 'all' || p.dataset.panel === key; p.classList.toggle('active', on); if (p.hasAttribute('data-filterable')) p.hidden = !on; });
    }));
  });

  /* FAQ search */
  const fs = $('#faq-search');
  if (fs) fs.addEventListener('input', () => { const q = fs.value.trim().toLowerCase(); $$('.faq-list details').forEach(d => { d.hidden = q && !d.textContent.toLowerCase().includes(q); }); });

  /* Projects listing filters */
  const filters = $('#filters');
  if (filters) {
    const cards = $$('#results .card'); const empty = $('#empty'); const countEl = $('#result-count');
    const params = new URLSearchParams(window.location.search);
    $$('select', filters).forEach(s => { if (params.get(s.name)) s.value = params.get(s.name); });
    const apply = () => {
      const f = {}; $$('select', filters).forEach(s => f[s.name] = s.value);
      let n = 0;
      cards.forEach(c => {
        const d = c.dataset; let ok = true;
        if (f.location && d.location !== f.location) ok = false;
        if (f.type && d.type !== f.type) ok = false;
        if (f.configuration && !d.configurations.split('|').includes(f.configuration)) ok = false;
        if (f.budget && d.budget !== f.budget && d.budget !== 'any') ok = false;
        if (f.status && d.status !== f.status) ok = false;
        c.hidden = !ok; if (ok) n++;
      });
      if (empty) empty.hidden = n > 0; if (countEl) countEl.textContent = n + (n === 1 ? ' project' : ' projects');
      const q = new URLSearchParams(); Object.entries(f).forEach(([k, v]) => v && q.set(k, v)); history.replaceState(null, '', window.location.pathname + (q.toString() ? '?' + q : ''));
    };
    $$('select', filters).forEach(s => s.addEventListener('change', apply));
    $('#clear-filters') && $('#clear-filters').addEventListener('click', () => { $$('select', filters).forEach(s => s.value = ''); apply(); });
    $('#empty-clear') && $('#empty-clear').addEventListener('click', () => { $$('select', filters).forEach(s => s.value = ''); apply(); });
    apply();
  }

  /* Lead forms: validation, loading, server submit, confirmation */
  // Attribution: persist first-touch UTM parameters for the session so later page views keep them
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const qs = new URLSearchParams(window.location.search); let stored = {};
  try { stored = JSON.parse(sessionStorage.getItem('assetz-utm') || '{}'); } catch (e) {}
  if (utmKeys.some(k => qs.get(k))) { stored = {}; utmKeys.forEach(k => { if (qs.get(k)) stored[k] = qs.get(k); }); try { sessionStorage.setItem('assetz-utm', JSON.stringify(stored)); } catch (e) {} }
  const utm = { get: k => stored[k] || '' };
  // Netlify Forms (works on any Netlify deploy, including drag-and-drop, once form detection is enabled).
  // The detection page carries a marker: if it comes back, the POST was served as a static file, i.e. NOT stored.
  const NF_FIELDS = ['type', 'sourcePage', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'name', 'countryCode', 'phone', 'email', 'project', 'purpose', 'preferredTime', 'category', 'message', 'consent', 'submittedAt'];
  async function netlifyForms(data) {
    if (location.hostname.indexOf('.') === -1 || /^[\d.]+$/.test(location.hostname) || location.protocol === 'file:') return false; // local preview: no Netlify
    const body = new URLSearchParams({ 'form-name': 'lead' });
    NF_FIELDS.forEach(k => { if (data[k] != null && data[k] !== '') body.set(k, k === 'consent' ? 'yes' : String(data[k])); });
    try {
      const r = await fetch(ROOT + 'forms/lead.html', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
      if (!r.ok) return false;
      const t = await r.text();
      return t.indexOf('assetz-form-detection-page') === -1;
    } catch (e) { return false; }
  }
  const DOWNLOADS = { Guide: '/assets/downloads/bengaluru-premium-homebuyers-guide.pdf', 'Muse & Maison': '/assets/downloads/assetz-muse-and-maison-e-brochure.pdf' };
  const downloadFor = d => d.type === 'Guide' ? DOWNLOADS.Guide : (d.type === 'Brochure' && DOWNLOADS[d.project]) || '';
  $$('form.form').forEach(form => {
    form.querySelector('[name=sourcePage]') && (form.querySelector('[name=sourcePage]').value = window.location.href);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(k => { const i = form.querySelector(`[name=${k}]`); if (i && utm.get(k)) i.value = utm.get(k); });
    const setErr = (name, bad) => { const el = form.querySelector(`[name=${name}]`); if (!el) return; const wrap = el.closest('.field, .consent'); wrap && wrap.classList.toggle('error', bad); };
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries()); let bad = false;
      const req = (name, test) => { const ok = test(data[name] || ''); setErr(name, !ok); if (!ok) bad = true; };
      req('name', v => v.trim().length >= 2);
      req('phone', v => v.replace(/\D/g, '').length >= 8 && v.replace(/\D/g, '').length <= 15);
      req('email', v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v));
      if (form.querySelector('[name=project]')) req('project', v => !!v);
      req('consent', () => !!form.querySelector('[name=consent]').checked);
      const status = form.querySelector('.status'); const btn = form.querySelector('button[type=submit]');
      if (bad) { status.textContent = 'Please check the highlighted fields.'; status.className = 'status err'; return; }
      status.textContent = ''; btn.disabled = true; btn.classList.add('loading');
      try {
        Object.assign(data, { submittedAt: new Date().toISOString(), userAgent: navigator.userAgent });
        // 1) Serverless lead API (Netlify Function / Vercel / local server). 2) If it is not deployed, or has no
        // durable destination (no CRM configured), store the lead with Netlify Forms. Success is shown only when
        // one of the two confirms the lead was recorded.
        let out = {}; let res = null;
        try {
          res = await fetch(window.SITE.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
          out = await res.json().catch(() => ({}));
        } catch (e) { res = null; }
        if (res && res.status === 422 && out.fields) { Object.keys(out.fields).forEach(k => setErr(k, true)); throw new Error(out.error || 'Please check the highlighted fields.'); }
        if (res && res.status === 429) throw new Error(out.error || 'Too many submissions');
        if (!(res && res.ok && out.ok && out.recorded)) {
          if (out.id === 'ignored') { out.recorded = true; } else {
            const nf = await netlifyForms(data);
            if (!nf) throw new Error('No lead destination available');
            out = Object.assign({ ok: true, id: out.id || 'nf-' + Date.now().toString(36) }, out, { recorded: true });
          }
        }
        if (!out.download) out.download = downloadFor(data);
        track('lead_submit', { enquiry_type: data.type, project: data.project || '', lead_id: out.id || '' });
        if (data.type === 'Guide') { track('guide_download', { project: data.project || '' }); }
        if (data.type === 'Brochure') track('brochure_request', { project: data.project || '' });
        if (data.type === 'Site Visit') track('site_visit_request', { project: data.project || '' });
        status.textContent = 'Thank you. Redirecting…'; status.className = 'status ok';
        const q = new URLSearchParams({ type: data.type, project: data.project || '' });
        if (out.download) q.set('download', out.download);
        setTimeout(() => { window.location.href = route('thank-you/') + '?' + q.toString(); }, 600);
      } catch (err) {
        status.textContent = /^Please check|Too many/.test(err.message) ? (err.message.indexOf('Too many') === 0 ? 'Too many submissions. Please try again in a few minutes, or call ' + (window.SITE.phone || 'us') + '.' : err.message) : 'We could not send your enquiry right now. Please try again, or call ' + (window.SITE.phone || 'us') + '.'; status.className = 'status err';
        btn.disabled = false; btn.classList.remove('loading');
        track('lead_error', { enquiry_type: data.type, message: String(err.message).slice(0, 120) });
      }
    });
  });

  /* Share links always use the live page URL */
  $$('[data-share]').forEach(a => { a.href = a.dataset.share.replace('{u}', encodeURIComponent(location.href)); });

  /* Click tracking: call + WhatsApp */
  $$('a[href^="tel:"]').forEach(a => a.addEventListener('click', () => track('click_to_call', { href: a.getAttribute('href') })));
  $$('a[href*="wa.me"]').forEach(a => a.addEventListener('click', () => track('whatsapp_click', { href: a.getAttribute('href') })));

  /* Cookie consent (per-viewer) */
  const cookie = $('#cookie');
  if (cookie) {
    let c = null; try { c = localStorage.getItem('assetz-consent'); } catch (e) {}
    if (c) cookie.hidden = true;
    if (c === 'granted') track('consent_granted');
    const set = v => { try { localStorage.setItem('assetz-consent', v); } catch (e) {} cookie.hidden = true; track(v === 'granted' ? 'consent_granted' : 'consent_denied'); };
    $('#cookie-accept').addEventListener('click', () => set('granted'));
    $('#cookie-decline').addEventListener('click', () => set('denied'));
  }

  /* Thank-you page: show download link + context */
  const ty = $('#thanks');
  if (ty) {
    const p = new URLSearchParams(window.location.search); const dl = p.get('download'); const t = p.get('type');
    if (dl && /^\/assets\/downloads\/[a-z0-9-]+\.pdf$/.test(dl)) {
      const a = $('#ty-download'); a.href = ROOT + dl.slice(1); a.hidden = false;
      if (t === 'Guide') { a.textContent = "Open the Homebuyer's Guide (PDF)"; $('#ty-msg').textContent = 'Your guide is ready. Use the button below to open it. An Assetz advisor may follow up if you asked us to.'; }
      else { a.textContent = 'Open the project brochure (PDF)'; $('#ty-msg').textContent = 'Your brochure is ready below. An Assetz advisor will also be in touch to answer your questions.'; }
    }
    else if (t === 'Brochure') $('#ty-msg').textContent = 'Your brochure request has been received. An Assetz advisor will share the brochure and answer your questions shortly.';
    else if (t === 'Site Visit') $('#ty-msg').textContent = 'Your site visit request has been received. Our team will call to confirm a convenient slot.';
  }
})();

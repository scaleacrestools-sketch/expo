/* Scale Acres — homepage interactions */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header shadow on scroll */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const burger = $('#burger'), mobile = $('#mobile-nav');
  burger.addEventListener('click', () => {
    const open = mobile.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('a', mobile).forEach(a => a.addEventListener('click', () => { mobile.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }));

  /* Toast */
  const toast = $('#toast'); let toastTimer;
  function say(msg) { toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3200); }

  /* Project filtering (tabs + finder) */
  const cards = $$('#project-grid .card'); const tabs = $$('.tab'); const noRes = $('#no-results');
  function applyFilter(f) {
    let shown = 0;
    cards.forEach(c => {
      const ok = (f.status === 'all' || c.dataset.status === f.status)
        && (!f.loc || c.dataset.loc === f.loc)
        && (!f.type || c.dataset.type === f.type);
      c.classList.toggle('hidden', !ok); if (ok) shown++;
    });
    noRes.hidden = shown > 0;
  }
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.setAttribute('aria-selected', String(x === t)));
    applyFilter({ status: t.dataset.filter });
  }));
  $('#finder').addEventListener('submit', e => {
    e.preventDefault();
    const loc = $('#f-loc').value, type = $('#f-type').value, status = $('#f-status').value.toLowerCase();
    const f = { status: status.startsWith('any') ? 'all' : status, loc: loc.startsWith('Any') ? '' : loc, type: type.startsWith('Any') ? '' : type };
    tabs.forEach(x => x.setAttribute('aria-selected', String(x.dataset.filter === f.status)));
    applyFilter(f);
    $('#projects').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  /* Animated counters */
  const nums = $$('.stat .num');
  function runCounter(el) {
    const target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.decimals || '0', 10);
    const sup = el.querySelector('sup'); const supHTML = sup ? sup.outerHTML : '';
    const start = performance.now(), dur = reduce ? 0 : 1400;
    function frame(now) {
      const p = dur ? Math.min(1, (now - start) / dur) : 1; const e = 1 - Math.pow(1 - p, 3);
      el.innerHTML = (target * e).toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + supHTML;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* Reveal on scroll (content stays visible if IntersectionObserver is missing) */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    reveals.forEach(el => { const r = el.getBoundingClientRect(); if (r.top > window.innerHeight) el.classList.add('pre'); });
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.remove('pre'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
    const cio = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); } }), { threshold: 0.4 });
    nums.forEach(n => cio.observe(n));
  } else { nums.forEach(runCounter); }

  /* Testimonials */
  const slides = $$('.testi-slide'); let idx = 0;
  function show(i) { idx = (i + slides.length) % slides.length; slides.forEach((s, k) => s.classList.toggle('active', k === idx)); }
  $('#testi-prev').addEventListener('click', () => show(idx - 1));
  $('#testi-next').addEventListener('click', () => show(idx + 1));
  if (!reduce) setInterval(() => show(idx + 1), 7000);

  /* Enquiry form (front-end only in this draft) */
  const form = $('#enquiry-form'), note = $('#form-note');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#e-name').value.trim(), phone = $('#e-phone').value.trim();
    if (!name || phone.replace(/\D/g, '').length < 10) { say('Please add your name and a 10-digit phone number.'); return; }
    if (!$('#e-consent').checked) { say('Please tick the consent box so we can call you.'); return; }
    note.hidden = false; say('Request received. We will call you shortly.'); form.reset();
  });
  $('#newsletter').addEventListener('submit', e => { e.preventDefault(); const v = $('#nl-email').value.trim(); say(v.includes('@') ? 'You are on the list.' : 'Please enter a valid email.'); if (v.includes('@')) $('#nl-email').value = ''; });

  /* Active nav link */
  const sections = ['top', 'about', 'projects', 'blog', 'enquire'].map(id => document.getElementById(id)).filter(Boolean);
  const links = $$('.nav a');
  const sio = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => sio.observe(s));
})();

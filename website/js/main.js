/* M3M homepage replica — interactions (front-end only in this draft) */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Toast */
  const toast = $('#toast'); let toastTimer;
  const say = msg => { toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3000); };

  /* Header: transparent over hero, solid after scroll */
  const header = $('#header'), hero = $('.hero'), toTop = $('#to-top');
  const onScroll = () => {
    const past = window.scrollY > (hero ? hero.offsetHeight - 80 : 80);
    header.classList.toggle('solid', past);
    toTop.classList.toggle('show', window.scrollY > 600);
  };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  /* Overlays */
  function overlay(el, openBtns, closeBtn) {
    const open = () => { el.classList.add('open'); el.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
    const close = () => { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
    openBtns.forEach(b => b && b.addEventListener('click', e => { e.preventDefault(); open(); }));
    closeBtn && closeBtn.addEventListener('click', close);
    el.addEventListener('click', e => { if (e.target === el) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    return { open, close };
  }
  const mega = overlay($('#mega'), [$('#mega-open')], $('#mega-close'));
  $('#mega-open').addEventListener('click', () => $('#mega-open').setAttribute('aria-expanded', 'true'));
  $('#mega-close').addEventListener('click', () => $('#mega-open').setAttribute('aria-expanded', 'false'));
  $$('#mega a[href^="#"]').forEach(a => a.addEventListener('click', mega.close));
  $$('#mega .primary [role="tab"]').forEach(t => t.addEventListener('click', () => {
    $$('#mega .primary [role="tab"]').forEach(x => x.setAttribute('aria-selected', String(x === t)));
    $$('#mega .panel').forEach(p => p.classList.toggle('active', p.dataset.panel === t.dataset.panel));
  }));
  overlay($('#popup'), $$('.enq-open'), $('#popup-close'));
  overlay($('#search'), [$('#search-open')], $('#search-close'));

  /* Search (static index for the draft) */
  const index = ['M3M Altitude · Residential · Sector 65, Gurugram', 'M3M Mansion · Residential · Sector 113, Delhi NCR', 'M3M The Cullinan · Residential · Sector 94, Noida', 'M3M Jewel · Retail · MG Road, Gurugram', 'M3M Crown · Residential · Sector 111, Gurugram', 'M3M Golf Hills · Residential · Sector 79, Gurugram', 'M3M Capital Walk · Retail · Sector 113, Gurugram', 'M3M IFC · Offices · Sector 66, Gurugram', 'M3M 57Suites · Serviced Apartments · Sector 57, Gurugram', 'M3M City of Dreams · Residential · Panipat'];
  const sIn = $('#search-input'), sOut = $('#search-results');
  sIn.addEventListener('input', () => {
    const q = sIn.value.trim().toLowerCase(); sOut.innerHTML = '';
    if (!q) return;
    const hits = index.filter(x => x.toLowerCase().includes(q));
    if (!hits.length) { sOut.innerHTML = '<li style="color:#5f5f5f">No results. Try a project name or sector.</li>'; return; }
    hits.forEach(h => { const li = document.createElement('li'); const a = document.createElement('a'); a.href = '#iconic'; a.textContent = h; a.addEventListener('click', () => $('#search-close').click()); li.appendChild(a); sOut.appendChild(li); });
  });

  /* Hero finder dropdowns */
  const finder = $('#finder'); const picks = {};
  $$('.sel', finder).forEach(sel => {
    const btn = $(':scope > button', sel), opts = $$('.options button', sel);
    btn.addEventListener('click', e => { e.stopPropagation(); const was = sel.classList.contains('open'); $$('.sel', finder).forEach(s => s.classList.remove('open')); if (!was) sel.classList.add('open'); });
    opts.forEach(o => o.addEventListener('click', () => {
      picks[sel.dataset.key] = o.textContent; $('.val', sel).textContent = o.textContent; sel.classList.remove('open');
      const next = sel.nextElementSibling; if (next && next.classList.contains('sel')) { $('.hint', next).hidden = true; $$('.options button', next).forEach(b => b.hidden = false); }
    }));
  });
  document.addEventListener('click', () => $$('.sel', finder).forEach(s => s.classList.remove('open')));
  finder.addEventListener('submit', e => {
    e.preventDefault();
    if (!picks.looking) return say('Please choose what you are looking for.');
    say(`Showing ${picks.looking}${picks.city ? ' in ' + picks.city : ''}${picks.price ? ', ' + picks.price : ''}.`);
    $('#iconic').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  /* Counters */
  const counters = $$('.counter');
  function runCounter(el) {
    const target = parseInt(el.dataset.target, 10), suffix = el.dataset.suffix || ''; const start = performance.now(), dur = reduce ? 0 : 2200;
    const frame = now => { const p = dur ? Math.min(1, (now - start) / dur) : 1; const e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(target * e).toLocaleString('en-IN') + suffix; if (p < 1) requestAnimationFrame(frame); };
    requestAnimationFrame(frame);
  }
  if ('IntersectionObserver' in window) { const cio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { counters.forEach(runCounter); cio.disconnect(); } }), { threshold: 0.4 }); cio.observe($('#counter-section')); }
  else counters.forEach(runCounter);

  /* Arrow-nav scrollers */
  $$('[data-scroll]').forEach(b => b.addEventListener('click', () => {
    const track = $(b.dataset.scroll); const item = track.firstElementChild; const step = item ? item.getBoundingClientRect().width + 20 : 400;
    track.scrollBy({ left: step * parseInt(b.dataset.dir, 10), behavior: reduce ? 'auto' : 'smooth' });
  }));

  /* Verticals accordion */
  const verts = $$('#verticals-acc .vert');
  verts.forEach(v => { ['mouseenter', 'focus'].forEach(ev => v.addEventListener(ev, () => verts.forEach(x => x.classList.toggle('active', x === v)))); });

  /* Fade-in */
  const fades = $$('.fade');
  if ('IntersectionObserver' in window && !reduce) {
    fades.forEach(el => { if (el.getBoundingClientRect().top > window.innerHeight) el.classList.add('pre'); });
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.remove('pre'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -10% 0px' });
    fades.forEach(el => io.observe(el));
  }

  /* Forms (validation + success states; wire to CRM/email later) */
  const emailOk = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  function mark(id, bad) { const f = document.getElementById(id); if (f) f.closest('.field').classList.toggle('error', bad); return bad; }
  function handle(formId, rules, okId, msg) {
    const form = document.getElementById(formId); if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault(); let bad = false;
      for (const [id, test, m] of rules) { const v = (document.getElementById(id).value || '').trim(); const b = !test(v, document.getElementById(id)); mark(id, b); if (b && !bad) { bad = true; say(m); } }
      if (bad) return;
      document.getElementById(okId).hidden = false; say(msg); form.reset();
    });
  }
  const consent = (v, el) => el.checked;
  handle('enquiry-form', [['e-first', v => v.length > 1, 'Please enter your first name.'], ['e-email', emailOk, 'Please enter a valid email.'], ['e-phone', v => v.replace(/\D/g, '').length >= 10, 'Please enter a valid phone number.'], ['e-consent', consent, 'Please accept the privacy policy.']], 'e-ok', 'Enquiry received. We will call you shortly.');
  handle('popup-form', [['p-first', v => v.length > 1, 'Please enter your first name.'], ['p-email', emailOk, 'Please enter a valid email.'], ['p-phone', v => v.replace(/\D/g, '').length >= 10, 'Please enter a valid phone number.'], ['p-consent', consent, 'Please accept the privacy policy.']], 'p-ok', 'Enquiry received. We will call you shortly.');
  handle('footer-form', [['f-first', v => v.length > 1, 'Please enter your first name.'], ['f-email', emailOk, 'Please enter a valid email.'], ['f-phone', v => v.replace(/\D/g, '').length >= 10, 'Please enter a valid phone number.']], 'f-ok', 'Enquiry received.');
  handle('lead-form', [['l-name', v => v.length > 1, 'Please enter your name.'], ['l-phone', v => v.replace(/\D/g, '').length >= 10, 'Please enter a valid phone number.'], ['l-email', emailOk, 'Please enter a valid email so we can send the guide.'], ['l-consent', consent, 'Please tick the consent box to receive the guide.']], 'l-ok', 'The guide is on its way to your inbox.');
  $$('#enq-types button').forEach(b => b.addEventListener('click', () => $$('#enq-types button').forEach(x => x.classList.toggle('active', x === b))));

  /* Cookie notice (per-viewer convenience only) */
  const cookie = $('#cookie');
  try { if (localStorage.getItem('m3m-cookie') === '1') cookie.hidden = true; } catch (e) {}
  ['cookie-accept', 'cookie-close'].forEach(id => $('#' + id).addEventListener('click', () => { cookie.hidden = true; try { localStorage.setItem('m3m-cookie', '1'); } catch (e) {} }));
})();

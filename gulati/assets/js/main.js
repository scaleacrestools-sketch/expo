/* Gulati — motion system
   preloader · inertial scroll · masked text reveals · clip image reveals ·
   parallax · sticky header · navigation curtain · page transitions · forms
   Everything honours prefers-reduced-motion. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var html = document.documentElement;
  html.classList.add('js');
  if (reduce) html.classList.add('reduce');

  /* ---------------------------------------------------------------- utils */
  function qs(s, c) { return (c || document).querySelector(s); }
  function qsa(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ------------------------------------------------- split text into words */
  function splitWords(el) {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    var nodes = Array.prototype.slice.call(el.childNodes);
    el.textContent = '';
    nodes.forEach(function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { el.appendChild(document.createTextNode(' ')); return; }
          var m = document.createElement('span'); m.className = 'w';
          var i = document.createElement('span'); i.className = 'wi'; i.textContent = part;
          m.appendChild(i); el.appendChild(m);
        });
      } else if (n.nodeName === 'BR') {
        el.appendChild(document.createElement('br'));
      } else {
        el.appendChild(n);
      }
    });
    qsa('.wi', el).forEach(function (w, i) { w.style.transitionDelay = (Math.min(i, 24) * 32) + 'ms'; });
  }

  /* --------------------------------------------------------- preloader */
  var loader = qs('.loader');
  var showLoader = loader && !reduce && !sessionStorage.getItem('gulati-seen');
  function finishLoad() {
    html.classList.remove('is-loading');
    html.classList.add('is-loaded');
    try { sessionStorage.setItem('gulati-seen', '1'); } catch (e) {}
    if (loader) window.setTimeout(function () { loader.remove(); }, 1100);
  }
  if (showLoader) {
    html.classList.add('is-loading');
    var hero = qs('.hero__media');
    var ready = new Promise(function (res) {
      if (!hero || hero.complete) return res();
      hero.addEventListener('load', res); hero.addEventListener('error', res);
    });
    var minimum = new Promise(function (res) { window.setTimeout(res, 450); });
    var fontsReady = document.fonts ? Promise.race([document.fonts.ready, new Promise(function (res) { window.setTimeout(res, 900); })]) : null;
    Promise.all([ready, minimum, fontsReady]).then(finishLoad);
  } else {
    if (loader) loader.remove();
    window.setTimeout(function () { html.classList.add('is-loaded'); }, 60);
  }

  /* -------------------------------------------- reveals (IntersectionObserver) */
  qsa('[data-split]').forEach(splitWords);
  var revealables = qsa('.reveal, [data-split], .img-reveal, .orn-reveal');
  var pending = revealables.slice();
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); var k = pending.indexOf(en.target); if (k > -1) pending.splice(k, 1); }
      });
    }, { rootMargin: '0px 0px -4% 0px', threshold: 0.05 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* --------------------------------------------------------- parallax */
  var plx = qsa('[data-parallax]').map(function (el) {
    return { el: el, amt: parseFloat(el.dataset.parallax) || 0.12 };
  });
  var pins = qsa('[data-pin-scroll]').map(function (img) { return { img: img, section: img.closest('.banner') }; });
  var header = qs('.site-bar');
  var heroEl = qs('.hero');
  var ticking = false;
  function onFrame() {
    ticking = false;
    var vh = window.innerHeight, y = window.scrollY;
    plx.forEach(function (p) {
      var wrap = p.el.closest('.img-reveal');
      if (wrap && !wrap.classList.contains('in')) return;
      var r = p.el.parentElement.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;
      var progress = (r.top + r.height / 2 - vh / 2) / vh; /* -1..1 through viewport */
      p.el.style.transform = 'translate3d(0,' + (progress * -p.amt * 100).toFixed(2) + '%,0) scale(' + (1 + p.amt * 2).toFixed(3) + ')';
    });
    if (header && heroEl) {
      header.classList.toggle('is-visible', y > heroEl.offsetHeight - 80);
    }
    /* pinned scene: image travels while the section is stuck */
    pins.forEach(function (p) {
      var r = p.section.getBoundingClientRect();
      var total = r.height - vh; if (total <= 0) return;
      var t = clamp(-r.top / total, 0, 1);
      var travel = p.img.offsetHeight * 0.32;
      p.img.style.transform = 'translate3d(0,' + ((0.5 - t) * travel).toFixed(1) + 'px,0) scale(1.34)';
    });
    /* belt-and-braces reveal for anything IntersectionObserver missed */
    for (var i = pending.length - 1; i >= 0; i--) {
      var el = pending[i], rr = el.getBoundingClientRect();
      if (rr.top < vh * 0.96 && rr.bottom > 0) { el.classList.add('in'); pending.splice(i, 1); }
    }
  }
  function requestFrame() { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } }
  if (!reduce) {
    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', requestFrame);
    onFrame();
  } else if (header) {
    window.addEventListener('scroll', function () { header.classList.toggle('is-visible', window.scrollY > 400); }, { passive: true });
  }

  /* ------------------------------------------------------ navigation */
  var nav = qs('#nav');
  var openBtns = qsa('[data-nav-open]');
  var closeBtn = qs('[data-nav-close]');
  var lastFocus = null;
  function openNav() {
    lastFocus = document.activeElement;
    nav.classList.add('is-open');
    nav.setAttribute('aria-hidden', 'false');
    openBtns.forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    document.body.classList.add('nav-open');
    window.setTimeout(function () { closeBtn.focus(); }, 400);
  }
  function closeNav() {
    nav.classList.remove('is-open');
    nav.setAttribute('aria-hidden', 'true');
    openBtns.forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    document.body.classList.remove('nav-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (nav && closeBtn) {
    openBtns.forEach(function (b) { b.addEventListener('click', openNav); });
    closeBtn.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
    });
  }

  /* ------------------------------------------------- page transitions */
  var curtain = qs('.curtain');
  function samePageAnchor(a) {
    var url = new URL(a.href, location.href);
    return url.pathname === location.pathname && url.hash;
  }
  qsa('a[href]').forEach(function (a) {
    var url;
    try { url = new URL(a.href, location.href); } catch (e) { return; }
    if (url.origin !== location.origin || a.target === '_blank' || a.hasAttribute('download')) return;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (samePageAnchor(a)) {
        var t = qs(url.hash);
        if (!t) return;
        e.preventDefault();
        if (nav && nav.classList.contains('is-open')) closeNav();
        var top = t.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
        return;
      }
      if (reduce || !curtain) return;
      e.preventDefault();
      if (nav && nav.classList.contains('is-open')) closeNav();
      html.classList.add('is-leaving');
      window.setTimeout(function () { location.href = a.href; }, 650);
    });
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted) html.classList.remove('is-leaving'); });


  /* ----------------------------------------------------- custom cursor */
  if (finePointer && !reduce) {
    var dot = document.createElement('div'), ring = document.createElement('div');
    dot.className = 'cursor'; ring.className = 'cursor__ring';
    document.body.appendChild(dot); document.body.appendChild(ring);
    html.classList.add('has-cursor', 'cursor-out');
    var mx = 0, my = 0, rx = 0, ry = 0, cursorRaf = null, cursorLink = false;
    function cursorTick() {
      rx = lerp(rx, mx, 0.18); ry = lerp(ry, my, 0.18);
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      if (Math.abs(rx - mx) > 0.2 || Math.abs(ry - my) > 0.2) cursorRaf = requestAnimationFrame(cursorTick); else cursorRaf = null;
    }
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      if (html.classList.contains('cursor-out')) html.classList.remove('cursor-out');
      var overLink = !!(e.target.closest && e.target.closest('a, button, input, textarea, label'));
      if (overLink !== cursorLink) { cursorLink = overLink; html.classList.toggle('cursor-link', overLink); }
      if (!cursorRaf) cursorRaf = requestAnimationFrame(cursorTick);
    }, { passive: true });
    document.addEventListener('mouseleave', function () { html.classList.add('cursor-out'); });
    document.addEventListener('mouseenter', function () { html.classList.remove('cursor-out'); });
  }

  /* ------------------------------------------------------- contact form */
  var form = qs('form[data-netlify]');
  if (form) {
    var note = qs('.form__note', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = qs('button[type="submit"]', form);
      btn.disabled = true;
      note.textContent = 'Sending…';
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        form.reset();
        note.textContent = 'Thank you. We will be in touch shortly.';
      }).catch(function () {
        note.textContent = 'Something went wrong. Please call us or try again.';
      }).finally(function () { btn.disabled = false; });
    });
  }
})();

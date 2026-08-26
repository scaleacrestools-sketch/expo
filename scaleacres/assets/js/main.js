/* ============================================================================
   ScaleAcres — homepage behaviour
   ----------------------------------------------------------------------------
   Design rules honoured throughout:
   • Every animation is transform/opacity only (GPU friendly, no layout thrash).
   • All scroll-driven work runs through ONE requestAnimationFrame ticker.
   • Off-screen sections are unsubscribed from the ticker.
   • prefers-reduced-motion disables motion entirely and leaves content visible.
   • No content is hidden behind an animation — reveals only change transform
     and opacity of already-rendered text.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------- helpers */
  var qs = function (s, c) { return (c || document).querySelector(s); };
  var qsa = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var mqMobile = window.matchMedia('(max-width: 760px)');
  var reduced = function () { return mqReduce.matches; };

  /* ------------------------------------------------- single rAF ticker --- */
  var jobs = [];
  var ticking = false;
  function addJob(fn) { if (jobs.indexOf(fn) < 0) jobs.push(fn); start(); }
  function removeJob(fn) { var i = jobs.indexOf(fn); if (i > -1) jobs.splice(i, 1); }
  function start() { if (!ticking) { ticking = true; requestAnimationFrame(tick); } }
  function tick(t) {
    // iterate a snapshot: a job may unsubscribe itself (or another) mid-frame
    var run = jobs.slice();
    for (var i = 0; i < run.length; i++) {
      if (jobs.indexOf(run[i]) > -1) run[i](t);
    }
    if (jobs.length) requestAnimationFrame(tick); else ticking = false;
  }

  /* ------------------------------------------------------- smooth scroll */
  /* Damped wheel scrolling on top of the real scroll position, so sticky
     sections, anchors and the browser scrollbar all keep working.           */
  var Scroller = (function () {
    var on = false, target = 0, current = 0, running = false;

    function max() {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }
    function loop() {
      var m = max();
      target = clamp(target, 0, m);
      var d = target - current;
      if (Math.abs(d) < 0.35) { current = target; running = false; removeJob(loop); }
      else { current += d * 0.115; }
      current = clamp(current, 0, m);
      // options form: never inherit a CSS scroll-behavior of smooth
      window.scrollTo({ top: current, behavior: 'instant' });
    }
    function kick() { if (!running) { running = true; addJob(loop); } }

    function scrollable(el) {
      while (el && el !== document.body && el !== document.documentElement) {
        if (el.nodeType === 1) {
          if (el.hasAttribute('data-native-scroll')) return true;
          var st = getComputedStyle(el);
          var oy = st.overflowY, ox = st.overflowX;
          if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) return true;
          if ((ox === 'auto' || ox === 'scroll') && el.scrollWidth > el.clientWidth + 1) return true;
        }
        el = el.parentNode;
      }
      return false;
    }

    function onWheel(e) {
      if (!on || e.ctrlKey || e.metaKey) return;
      if (scrollable(e.target)) return;
      e.preventDefault();
      var d = e.deltaY;
      if (e.deltaMode === 1) d *= 18;
      else if (e.deltaMode === 2) d *= window.innerHeight;
      target = clamp(target + d, 0, max());
      kick();
    }

    /* The scroll event fires asynchronously, so a "we did this" flag set around
       window.scrollTo() is already stale by the time it arrives — it would make
       the scroller cancel its own damping on every frame. Compare positions
       instead: anything more than a rounding error apart came from the user
       (scrollbar, keyboard, find-in-page), so hand control back. */
    function onScroll() {
      if (Math.abs(window.scrollY - current) > 2) { current = target = window.scrollY; }
    }

    function enable() {
      if (on || reduced() || !mqFine.matches) return;
      on = true; current = target = window.scrollY;
      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    function disable() {
      if (!on) return;
      on = false; removeJob(loop); running = false;
      window.removeEventListener('wheel', onWheel, { passive: false });
      window.removeEventListener('scroll', onScroll);
    }

    return {
      init: function () {
        enable();
        mqReduce.addEventListener('change', function () { reduced() ? disable() : enable(); });
        mqFine.addEventListener('change', function () { mqFine.matches ? enable() : disable(); });
      },
      by: function (dy) {
        if (!on) { window.scrollBy(0, dy); return; }
        target = clamp(target + dy, 0, max()); kick();
      },
      to: function (y) {
        y = clamp(y, 0, max());
        if (!on) { window.scrollTo({ top: y, behavior: reduced() ? 'auto' : 'smooth' }); return; }
        target = y; kick();
      },
      active: function () { return on; },
    };
  })();

  /* ------------------------------------------------------- anchor links */
  function initAnchors() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var el = qs(id);
      if (!el) return;
      e.preventDefault();
      var hdr = qs('[data-hdr]');
      var off = (hdr ? hdr.offsetHeight : 0) + 12;
      Scroller.to(el.getBoundingClientRect().top + window.scrollY - off);
      closeMenu();
      if (history.replaceState) history.replaceState(null, '', id);
    });
  }

  /* -------------------------------------------------------------- header */
  function initHeader() {
    var hdr = qs('[data-hdr]');
    if (!hdr) return;
    var last = null;
    function update() {
      var stuck = window.scrollY > 40;
      if (stuck !== last) { hdr.classList.toggle('is-stuck', stuck); last = stuck; }
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  var menuOpen = false;
  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    var hdr = qs('[data-hdr]'), b = qs('.burger'), n = qs('#mobnav');
    hdr.classList.remove('is-menu');
    b.setAttribute('aria-expanded', 'false');
    b.setAttribute('aria-label', 'Open menu');
    n.hidden = true;
    document.body.classList.remove('is-locked');
  }
  function initMenu() {
    var b = qs('.burger'), n = qs('#mobnav'), hdr = qs('[data-hdr]');
    if (!b || !n) return;
    b.addEventListener('click', function () {
      menuOpen = !menuOpen;
      hdr.classList.toggle('is-menu', menuOpen);
      b.setAttribute('aria-expanded', String(menuOpen));
      b.setAttribute('aria-label', menuOpen ? 'Close menu' : 'Open menu');
      n.hidden = !menuOpen;
      document.body.classList.toggle('is-locked', menuOpen);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ------------------------------------------------- text splitting ----- */
  /* Words are wrapped, measured, then regrouped into lines so each visual
     line can be masked. Text stays in the DOM and readable at all times.    */
  function splitLines(el) {
    if (!el.dataset.origHtml) el.dataset.origHtml = el.innerHTML;
    var html = el.dataset.origHtml;

    var tmp = document.createElement('div');
    tmp.innerHTML = html;

    // tokenise: whitespace, and also directly after an em/en dash so a phrase
    // like "Attention—and" can break onto the next line cleanly
    var tokens = [];   // { text, space } — space = a space follows this token
    var nodes = [];    // parallel list of measurable elements / <br>
    var frag = document.createDocumentFragment();

    function pushToken(text, space) {
      var s = document.createElement('span');
      s.className = 'sp-w';
      s.textContent = text;
      frag.appendChild(s);
      if (space) frag.appendChild(document.createTextNode(' '));
      tokens.push({ text: text, space: space });
      nodes.push(s);
    }
    function pushWord(w) {
      var parts = w.replace(/([\u2014\u2013])/g, '$1\u0000').split('\u0000').filter(Boolean);
      parts.forEach(function (pt, i) { pushToken(pt, i === parts.length - 1); });
    }

    Array.prototype.forEach.call(tmp.childNodes, function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/\s+/).forEach(function (w) { if (w) pushWord(w); });
      } else if (node.nodeName === 'BR') {
        var br = document.createElement('br');
        frag.appendChild(br);
        tokens.push(null);
        nodes.push(br);
      } else {
        pushWord(node.textContent || '');
      }
    });

    el.innerHTML = '';
    el.appendChild(frag);

    // group tokens by the visual line they landed on
    var lines = [], cur = null, top = null;
    for (var i = 0; i < nodes.length; i++) {
      if (tokens[i] === null) { cur = null; top = null; continue; }
      var t = nodes[i].offsetTop;
      if (cur === null || Math.abs(t - top) > 3) { cur = []; lines.push(cur); top = t; }
      cur.push(i);
    }
    if (!lines.length) { el.innerHTML = html; return; }

    var esc = function (v) { return v.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    el.innerHTML = lines.map(function (idxs, li) {
      var text = idxs.map(function (i) {
        return tokens[i].text + (tokens[i].space ? ' ' : '');
      }).join('').replace(/\s+$/, '');
      return '<span class="s-line" style="--d:' + li * 85 + 'ms"><span>' + esc(text) + '</span></span>';
    }).join('');
    el.dataset.split = 'done';
  }

  function splitWords(el) {
    if (el.dataset.wordsDone) return;
    var text = el.textContent;
    el.innerHTML = text.split(/\s+/).filter(Boolean).map(function (w) {
      return '<span class="w-word">' + w.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>';
    }).join(' ');
    el.dataset.wordsDone = '1';
  }

  function initSplits() {
    var heads = qsa('[data-split]');
    function run() {
      if (reduced()) return;
      heads.forEach(splitLines);
    }
    run();
    var w = window.innerWidth, t;
    window.addEventListener('resize', function () {
      if (Math.abs(window.innerWidth - w) < 40) return;
      w = window.innerWidth;
      clearTimeout(t);
      t = setTimeout(function () {
        heads.forEach(function (el) {
          var wasIn = el.classList.contains('is-in');
          splitLines(el);
          if (wasIn) el.classList.add('is-in');
        });
      }, 160);
    });
  }

  /* ------------------------------------------------------------- reveals */
  function initReveals() {
    var items = qsa('[data-reveal], [data-split], [data-mask], .collage__it');
    if (!('IntersectionObserver' in window) || reduced()) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    items.forEach(function (el) {
      var d = el.getAttribute('data-reveal-delay');
      if (d) el.style.setProperty('--rd', d + 'ms');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
        setTimeout(function () { e.target.classList.add('is-done'); }, 1400);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------------------------- intro timing */
  function initIntro() {
    var go = function () {
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-ready');
      setTimeout(function () { document.body.classList.add('is-intro-done'); }, reduced() ? 0 : 1800);
    };
    if (document.fonts && document.fonts.ready) {
      var done = false;
      var fire = function () { if (!done) { done = true; requestAnimationFrame(go); } };
      document.fonts.ready.then(fire);
      setTimeout(fire, 900); // never let a slow font block the intro
    } else { requestAnimationFrame(go); }
  }

  /* ------------------------------------------------------------ marquees */
  function initMarquee(el) {
    var track = qs('.mq__track', el);
    var grp = qs('.mq__grp', track);
    if (!track || !grp || !grp.children.length) return;

    var speed = parseFloat(el.getAttribute('data-speed')) || 30; // px/s
    var dir = parseFloat(el.getAttribute('data-dir')) || -1;
    var w = 0, x = 0, lastT = 0, paused = false, visible = false;

    function measure() {
      w = grp.scrollWidth;
      if (!w) return;
      // duplicate until the track covers twice the viewport width
      while (track.scrollWidth < el.clientWidth * 2 + w) {
        track.appendChild(grp.cloneNode(true));
        if (track.children.length > 12) break;
      }
      if (dir > 0 && x === 0) x = -w;
    }

    function frame(t) {
      if (!lastT) lastT = t;
      var dt = Math.min(64, t - lastT); lastT = t;
      if (!paused) {
        x += dir * speed * (dt / 1000);
        if (dir < 0 && x <= -w) x += w;
        if (dir > 0 && x >= 0) x -= w;
        track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      }
    }

    measure();
    if (!w) return;

    el.addEventListener('pointerenter', function () { paused = true; });
    el.addEventListener('pointerleave', function () { paused = false; });
    el.addEventListener('focusin', function () { paused = true; });
    el.addEventListener('focusout', function () { paused = false; });

    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !visible) { visible = true; lastT = 0; addJob(frame); }
        else if (!e.isIntersecting && visible) { visible = false; removeJob(frame); }
      });
    }, { rootMargin: '160px' });
    io.observe(el);

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { x = 0; measure(); }, 200);
    });
  }

  function initMarquees() {
    if (reduced()) return;
    qsa('[data-marquee]').forEach(initMarquee);
  }

  /* ---------------------------------------------------- hero composition */
  function initHero() {
    var scene = qs('[data-parallax-scene]');
    var hero = qs('.hero');
    if (!scene || !hero || reduced()) return;

    var mocks = qsa('.mock', scene).map(function (el) {
      return {
        el: el,
        depth: parseFloat(el.getAttribute('data-depth')) || 10,
        amp: parseFloat(el.getAttribute('data-float')) || 6,
        phase: Math.random() * Math.PI * 2,
        rot: el.style.getPropertyValue('--rot') || '0deg',
      };
    });

    var mx = 0, my = 0, tx = 0, ty = 0, sp = 0, visible = true, ready = false;

    hero.addEventListener('pointermove', function (e) {
      if (!mqFine.matches) return;
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    hero.addEventListener('pointerleave', function () { tx = 0; ty = 0; });

    function frame(t) {
      if (!visible) return;
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      var r = hero.getBoundingClientRect();
      sp = clamp(-r.top / Math.max(1, r.height), 0, 1); // scroll progress out of hero
      for (var i = 0; i < mocks.length; i++) {
        var m = mocks[i];
        var f = Math.sin(t / (2600 + m.amp * 190) + m.phase) * m.amp;
        var px = mx * m.depth;
        var py = my * m.depth * 0.6 + f + sp * m.depth * -3.2;
        m.el.style.transform =
          'translate3d(' + px.toFixed(2) + 'px,' + py.toFixed(2) + 'px,0) rotate(' + m.rot + ')';
      }
    }

    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        visible = e.isIntersecting;
        if (visible && ready) addJob(frame); else removeJob(frame);
      });
    }, { rootMargin: '120px' });
    io.observe(hero);

    // start only once the staggered intro has landed, so it doesn't fight the
    // CSS entrance transforms
    setTimeout(function () { ready = true; if (visible) addJob(frame); }, 1900);
  }

  /* ---------------------------------------------- approach word reveal --- */
  function initWords() {
    var el = qs('[data-words]');
    if (!el) return;
    if (reduced()) { el.classList.add('is-in'); return; }
    splitWords(el);
    var words = qsa('.w-word', el);
    var active = false;

    function frame() {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = clamp((vh * 0.86 - r.top) / (r.height + vh * 0.34), 0, 1);
      var n = words.length;
      for (var i = 0; i < n; i++) {
        var s = i / n;
        var o = clamp((p - s * 0.82) / 0.16, 0, 1);
        words[i].style.setProperty('--o', (0.16 + o * 0.84).toFixed(3));
      }
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !active) { active = true; addJob(frame); }
        else if (!e.isIntersecting && active) { active = false; removeJob(frame); }
      });
    }, { rootMargin: '30% 0px' });
    io.observe(el);
    frame();
  }

  /* ------------------------------------------------------ approach stages */
  function initStages() {
    var wrapEl = qs('[data-stages]');
    if (!wrapEl) return;
    var prog = qs('[data-stage-prog]', wrapEl);
    var stages = qsa('[data-stage]', wrapEl);
    if (reduced()) { stages.forEach(function (s) { s.classList.add('is-on'); }); if (prog) prog.style.setProperty('--p', 1); return; }

    var active = false;
    function frame() {
      var r = wrapEl.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = clamp((vh * 0.82 - r.top) / (r.height * 0.72 + vh * 0.1), 0, 1);
      if (prog) prog.style.setProperty('--p', p.toFixed(3));
      var idx = Math.floor(p * stages.length + 0.35);
      stages.forEach(function (s, i) { s.classList.toggle('is-on', i < idx || (i === 0 && p > 0.02)); });
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !active) { active = true; addJob(frame); }
        else if (!e.isIntersecting && active) { active = false; removeJob(frame); }
      });
    }, { rootMargin: '25% 0px' });
    io.observe(wrapEl);
    frame();
  }

  /* -------------------------------------- portfolio scroll scale + drift */
  function initWorkMotion() {
    if (reduced()) return;
    var imgs = qsa('[data-scale]');
    var drifts = qsa('[data-drift]');
    if (!imgs.length && !drifts.length) return;
    var live = [];

    function frame() {
      var vh = window.innerHeight;
      for (var i = 0; i < live.length; i++) {
        var el = live[i];
        var r = el.getBoundingClientRect();
        var p = clamp((vh - r.top) / (vh + r.height), 0, 1); // 0 entering → 1 leaving
        if (el.hasAttribute('data-scale')) {
          el.style.setProperty('--sc', (1.005 + (1 - Math.abs(p - 0.5) * 2) * 0.05).toFixed(4));
        } else {
          var k = parseFloat(el.getAttribute('data-drift')) || 1;
          el.style.transform = 'translate3d(0,' + ((0.5 - p) * 26 * k).toFixed(2) + 'px,0)';
        }
      }
      if (!live.length) removeJob(frame);
    }

    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var i = live.indexOf(e.target);
        if (e.isIntersecting && i < 0) { live.push(e.target); addJob(frame); }
        else if (!e.isIntersecting && i > -1) { live.splice(i, 1); }
      });
    }, { rootMargin: '15% 0px' });
    imgs.concat(drifts).forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------- horizontal project (04) --- */
  function initHScroll() {
    var sec = qs('[data-hscroll]');
    if (!sec) return;
    var row = qs('[data-hscroll-row]', sec);
    var pin = qs('.hscroll__pin', sec);
    if (!row || !pin) return;

    function isPinned() { return !reduced() && !mqMobile.matches; }

    var span = 0, active = false;
    function measure() {
      if (!isPinned()) { sec.style.height = ''; row.style.transform = ''; return; }
      span = Math.max(0, row.scrollWidth - window.innerWidth);
      sec.style.height = (window.innerHeight + span) + 'px';
    }

    function frame() {
      if (!isPinned()) return;
      var r = sec.getBoundingClientRect();
      var p = clamp(-r.top / Math.max(1, sec.offsetHeight - window.innerHeight), 0, 1);
      row.style.transform = 'translate3d(' + (-p * span).toFixed(2) + 'px,0,0)';
    }

    measure();
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !active) { active = true; addJob(frame); }
        else if (!e.isIntersecting && active) { active = false; removeJob(frame); }
      });
    }, { rootMargin: '10% 0px' });
    io.observe(sec);

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt); rt = setTimeout(function () { measure(); frame(); }, 180);
    });

    /* drag to advance — dragging the row drives the page scroll, which both
       moves the strip and pauses the scroll-linked motion while held */
    var dragging = false, lastX = 0, id = null;
    row.addEventListener('pointerdown', function (e) {
      if (!isPinned() || e.button !== 0) return;
      dragging = true; lastX = e.clientX; id = e.pointerId;
      row.setPointerCapture(id);
      row.classList.add('is-drag');
    });
    row.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX; lastX = e.clientX;
      Scroller.by(-dx * 1.15);
      frame();
    });
    var stop = function () {
      if (!dragging) return;
      dragging = false; row.classList.remove('is-drag');
      if (id !== null && row.hasPointerCapture && row.hasPointerCapture(id)) row.releasePointerCapture(id);
      id = null;
    };
    row.addEventListener('pointerup', stop);
    row.addEventListener('pointercancel', stop);
    row.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }

  /* -------------------------------------------------------- story cards */
  function storyCard(item, i) {
    var img = '<div class="card__media"><img src="assets/img/' + item.poster + '" alt="" ' +
      'width="1600" height="900" loading="lazy" decoding="async">' +
      (item.kind === 'story' ? '<span class="card__play" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24"><use href="#i-play"/></svg></span>' : '') +
      '</div>';

    if (item.kind !== 'story') {
      var f = document.createElement('figure');
      f.className = 'card';
      f.innerHTML = img + '<figcaption class="card__cap">' + item.caption + '</figcaption>';
      return f;
    }
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'card';
    b.setAttribute('data-story', i);
    b.innerHTML = img +
      '<span class="card__body">' +
        '<span class="card__name">' + item.name + '</span>' +
        '<span class="card__role">' + item.role + ', ' + item.company + '</span>' +
        '<span class="card__proj">' + item.project + '</span>' +
        '<span class="card__go">Watch Story <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-arrow"/></svg></span>' +
      '</span>';
    return b;
  }

  function initStories() {
    var data = (window.SCALEACRES && window.SCALEACRES.stories) || [];
    if (!data.length) return;
    var groups = qsa('[data-story-group]');
    var rows = ['top', 'mid', 'bot'];
    groups.forEach(function (g, gi) {
      data.forEach(function (item, i) {
        if (item.row !== rows[gi]) return;
        g.appendChild(storyCard(item, i));
      });
    });
    // mobile carousel gets the testimonial cards only
    var swipe = qs('[data-story-swipe]');
    if (swipe) {
      swipe.setAttribute('data-native-scroll', '');
      data.forEach(function (item, i) {
        if (item.kind === 'story') swipe.appendChild(storyCard(item, i));
      });
    }
  }

  /* -------------------------------------------------------------- modal */
  var Modal = (function () {
    var el, box, stage, nameEl, roleEl, projEl, lastFocus = null;

    function build() {
      el = qs('[data-modal]');
      if (!el) return;
      box = qs('.modal__box', el);
      stage = qs('[data-modal-stage]', el);
      nameEl = qs('.modal__name', el);
      roleEl = qs('.modal__role', el);
      projEl = qs('.modal__proj', el);
      box.setAttribute('data-native-scroll', '');
      qsa('[data-modal-close]', el).forEach(function (b) {
        b.addEventListener('click', close);
      });
      document.addEventListener('keydown', function (e) {
        if (!el || el.hidden) return;
        if (e.key === 'Escape') { close(); return; }
        if (e.key === 'Tab') trap(e);
      });
    }

    function trap(e) {
      var f = qsa('button, [href], video, iframe, [tabindex]:not([tabindex="-1"])', box)
        .filter(function (n) { return n.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    function open(item) {
      if (!el || !item) return;
      lastFocus = document.activeElement;
      nameEl.textContent = item.name || '';
      roleEl.textContent = [item.role, item.company].filter(Boolean).join(', ');
      projEl.textContent = item.project || '';

      if (item.video) {
        // never autoplay audio: muted start, controls exposed for the viewer
        stage.innerHTML = '<video controls playsinline preload="none" ' +
          'poster="assets/img/' + item.poster + '" src="' + item.video + '"></video>';
      } else {
        var note = (window.SCALEACRES && window.SCALEACRES.videoPendingNote) || 'Video not yet connected.';
        stage.innerHTML = '<div class="modal__pending">' +
          '<img src="assets/img/' + item.poster + '" alt="" loading="lazy" decoding="async">' +
          '<p class="modal__note">' + note + '</p></div>';
      }

      el.hidden = false;
      document.body.classList.add('is-locked');
      requestAnimationFrame(function () {
        el.classList.add('is-open');
        var x = qs('.modal__x', el); if (x) x.focus();
      });
    }

    function close() {
      if (!el || el.hidden) return;
      el.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      setTimeout(function () {
        el.hidden = true;
        stage.innerHTML = ''; // stops and unloads any media
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }, reduced() ? 0 : 420);
    }

    return { build: build, open: open, close: close };
  })();

  function initStoryModal() {
    Modal.build();
    var data = (window.SCALEACRES && window.SCALEACRES.stories) || [];
    document.addEventListener('click', function (e) {
      var card = e.target.closest ? e.target.closest('[data-story]') : null;
      if (card) { Modal.open(data[+card.getAttribute('data-story')]); return; }
      if (e.target.closest && e.target.closest('[data-open-first]')) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].kind === 'story') { Modal.open(data[i]); return; }
        }
      }
    });
  }

  /* ------------------------------------------------------- capabilities */
  function initCaps() {
    var list = qs('[data-accordion]');
    if (!list) return;
    var caps = qsa('[data-cap]', list);
    if (!caps.length) return;

    function openCap(cap, only) {
      if (only !== false) {
        caps.forEach(function (c) {
          if (c === cap) return;
          c.classList.remove('is-open');
          qs('.cap__hd', c).setAttribute('aria-expanded', 'false');
        });
      }
      cap.classList.add('is-open');
      qs('.cap__hd', cap).setAttribute('aria-expanded', 'true');
    }
    function closeCap(cap) {
      cap.classList.remove('is-open');
      qs('.cap__hd', cap).setAttribute('aria-expanded', 'false');
    }

    caps.forEach(function (cap) {
      var hd = qs('.cap__hd', cap);
      hd.addEventListener('click', function () {
        cap.classList.contains('is-open') ? closeCap(cap) : openCap(cap, !mqMobile.matches);
      });
      cap.addEventListener('mouseenter', function () {
        if (mqFine.matches && !reduced()) openCap(cap);
      });
      hd.addEventListener('focus', function () {
        if (mqFine.matches) openCap(cap);
      });
    });

    // desktop: keep one panel open so the section never reads as empty
    function sync() {
      if (mqMobile.matches) caps.forEach(closeCap);
      else if (!caps.some(function (c) { return c.classList.contains('is-open'); })) openCap(caps[0]);
    }
    sync();
    mqMobile.addEventListener('change', sync);
  }

  /* --------------------------------------------------------- case study */
  function initCase() {
    var root = qs('[data-case]');
    if (!root) return;
    var steps = qsa('[data-case-step]', root);
    var frames = qsa('.cs__frame', root);
    var prog = qs('[data-case-prog]', root);
    if (!steps.length) return;

    if (reduced()) {
      steps.forEach(function (s) { s.classList.add('is-on'); });
      if (prog) prog.style.setProperty('--p', 1);
      return;
    }

    var active = false, cur = -1;
    function frame() {
      var vh = window.innerHeight;
      var best = 0, bestD = Infinity;
      steps.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        var d = Math.abs(r.top + r.height / 2 - vh * 0.48);
        if (d < bestD) { bestD = d; best = i; }
        s.classList.toggle('is-on', r.top < vh * 0.72 && r.bottom > vh * 0.16);
      });
      if (best !== cur) {
        cur = best;
        frames.forEach(function (f, i) { f.classList.toggle('is-on', i === best); });
      }
      var rr = root.getBoundingClientRect();
      var p = clamp((vh * 0.62 - rr.top) / Math.max(1, rr.height * 0.8), 0, 1);
      if (prog) prog.style.setProperty('--p', p.toFixed(3));
    }

    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !active) { active = true; addJob(frame); }
        else if (!e.isIntersecting && active) { active = false; removeJob(frame); }
      });
    }, { rootMargin: '20% 0px' });
    io.observe(root);
    frame();
  }

  /* ------------------------------------------------ growth active row --- */
  function initGrowth() {
    var rows = qsa('.gs__row');
    if (!rows.length || reduced()) return;
    var active = false, cur = -1;

    function frame() {
      var vh = window.innerHeight, best = -1, bestD = vh * 0.42;
      rows.forEach(function (r, i) {
        var b = r.getBoundingClientRect();
        var d = Math.abs(b.top + b.height / 2 - vh * 0.5);
        if (d < bestD) { bestD = d; best = i; }
      });
      if (best !== cur) {
        cur = best;
        rows.forEach(function (r, i) { r.classList.toggle('is-active', i === best); });
      }
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !active) { active = true; addJob(frame); }
        else if (!e.isIntersecting && active) { active = false; removeJob(frame); }
      });
    }, { rootMargin: '10% 0px' });
    io.observe(qs('.growth'));
    frame();
  }

  /* ---------------------------------------------------- collage parallax */
  function initCollage() {
    if (reduced() || mqMobile.matches) return;
    var items = qsa('[data-para]');
    if (!items.length) return;
    var root = qs('.about');
    var active = false;

    function frame() {
      var vh = window.innerHeight;
      items.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var p = (vh - r.top) / (vh + r.height) - 0.5;
        var k = parseFloat(el.getAttribute('data-para')) || 0;
        el.style.transform = 'translate3d(0,' + (p * k).toFixed(2) + 'px,0)';
      });
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !active) { active = true; addJob(frame); }
        else if (!e.isIntersecting && active) { active = false; removeJob(frame); }
      });
    }, { rootMargin: '20% 0px' });
    io.observe(root);
    frame();
  }

  /* ------------------------------------------------------------- bootstrap */
  function boot() {
    Scroller.init();
    initAnchors();
    initHeader();
    initMenu();
    initSplits();
    initReveals();
    initStories();
    initStoryModal();
    initCaps();
    initMarquees();
    initHero();
    initWords();
    initStages();
    initWorkMotion();
    initHScroll();
    initCase();
    initGrowth();
    initCollage();
    initIntro();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

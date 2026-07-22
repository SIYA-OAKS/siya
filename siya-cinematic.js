/* ============================================================================
   SIYA — cinematic experience layer (v2)
   Adds, without touching the original engine in siya.js:
     • Cinematic intro (once per session)
     • Chapter rail — click any chapter to glide there; active follows scroll
     • Scene step controls — clickable pips + prev/next to jump inside pinned scenes
     • Card focus lightbox — click a card to view it large; ←/→ to browse
     • Word-by-word headline reveals
     • Magnetic CTAs + eased programmatic scrolling for all in-page anchors
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer:fine)').matches;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var NAV_H = 74;

  var SVG = {
    prev: '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    expand: '<svg viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>'
  };

  /* =====================================================================
     1. EASED PROGRAMMATIC SCROLL  +  anchor interception
     ===================================================================== */
  var scrolling = false;
  function easeScrollTo(toY, dur) {
    var maxY = document.documentElement.scrollHeight - window.innerHeight;
    toY = clamp(toY, 0, maxY);
    var fromY = window.scrollY;
    var dist = toY - fromY;
    if (reduce || Math.abs(dist) < 2) { window.scrollTo(0, toY); return; }
    dur = dur || clamp(Math.abs(dist) * 0.5, 460, 1100);
    var start = null;
    scrolling = true;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; /* easeInOutCubic */
      window.scrollTo(0, fromY + dist * e);
      if (p < 1) requestAnimationFrame(step); else scrolling = false;
    }
    requestAnimationFrame(step);
  }
  function scrollToEl(el, dur) {
    if (!el) return;
    var isScene = el.classList.contains('scene');
    var top = el.getBoundingClientRect().top + window.scrollY;
    easeScrollTo(isScene ? top : top - NAV_H, dur);
  }
  /* intercept same-page anchor links (nav, footer, hero CTAs) */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    if (!id) { e.preventDefault(); easeScrollTo(0); return; }
    if (id === 'top') { e.preventDefault(); easeScrollTo(0); return; }
    var target = document.getElementById(id);
    if (target) { e.preventDefault(); scrollToEl(target); history.replaceState(null, '', '#' + id); }
  });

  /* =====================================================================
     2. CHAPTER RAIL
     ===================================================================== */
  var chapterSecs = [].slice.call(document.querySelectorAll('section[data-chapter]'));
  var rail, railItems = [], spineFill;
  function buildRail() {
    if (!chapterSecs.length) return;
    rail = document.createElement('nav');
    rail.className = 'chapter-rail';
    rail.setAttribute('aria-label', 'Chapters');
    var spine = document.createElement('span');
    spine.className = 'crl-spine';
    spineFill = document.createElement('i');
    spine.appendChild(spineFill);
    rail.appendChild(spine);
    chapterSecs.forEach(function (sec, i) {
      var b = document.createElement('button');
      b.className = 'crl';
      b.type = 'button';
      b.setAttribute('aria-label', sec.getAttribute('data-chapter'));
      b.innerHTML = '<span class="crl-label">' + sec.getAttribute('data-chapter') + '</span><span class="crl-dot"></span>';
      b.addEventListener('click', function () { scrollToEl(sec); });
      rail.appendChild(b);
      railItems.push(b);
    });
    document.body.appendChild(rail);
    requestAnimationFrame(function () { rail.classList.add('ready'); });
  }

  /* =====================================================================
     3. SCENE STEP CONTROLS (only for pinned scenes that contain a .pin)
     ===================================================================== */
  var stepScenes = [];
  function sceneStepY(scene, i) {
    var steps = parseInt(scene.getAttribute('data-steps') || '1', 10);
    var range = scene.offsetHeight - window.innerHeight;
    if (range < 1) range = 1;
    var top = scene.getBoundingClientRect().top + window.scrollY;
    return top + ((i + 0.5) / steps) * range;
  }
  function buildSceneSteps() {
    [].slice.call(document.querySelectorAll('.scene[data-steps]')).forEach(function (scene) {
      var pin = scene.querySelector('.pin');
      if (!pin) return; /* only tall pinned scenes get controls */
      var steps = parseInt(scene.getAttribute('data-steps') || '0', 10);
      if (steps < 2) return;
      var bar = document.createElement('div');
      bar.className = 'scene-steps';
      var prev = document.createElement('button');
      prev.type = 'button'; prev.className = 'ss-arrow ss-prev'; prev.innerHTML = SVG.prev; prev.setAttribute('aria-label', 'Previous step');
      var next = document.createElement('button');
      next.type = 'button'; next.className = 'ss-arrow ss-next'; next.innerHTML = SVG.next; next.setAttribute('aria-label', 'Next step');
      var pips = document.createElement('div');
      pips.className = 'ss-pips';
      for (var i = 0; i < steps; i++) {
        (function (i) {
          var p = document.createElement('button');
          p.type = 'button'; p.className = 'ss-pip'; p.setAttribute('data-i', i);
          p.textContent = ('0' + (i + 1)).slice(-2);
          p.addEventListener('click', function () { easeScrollTo(sceneStepY(scene, i), 700); });
          pips.appendChild(p);
        })(i);
      }
      prev.addEventListener('click', function () { gotoStep(scene, -1); });
      next.addEventListener('click', function () { gotoStep(scene, 1); });
      bar.appendChild(prev); bar.appendChild(pips); bar.appendChild(next);
      pin.appendChild(bar);
      stepScenes.push(scene);
    });
  }
  function curStep(scene) { return parseInt(scene.getAttribute('data-step') || '0', 10); }
  function gotoStep(scene, dir) {
    var steps = parseInt(scene.getAttribute('data-steps') || '1', 10);
    var i = clamp(curStep(scene) + dir, 0, steps - 1);
    easeScrollTo(sceneStepY(scene, i), 700);
  }
  /* ←/→ steps the currently pinned scene */
  document.addEventListener('keydown', function (e) {
    if (overlay && overlay.classList.contains('open')) return; /* overlay owns arrows */
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var active = stepScenes.filter(function (s) { return s.classList.contains('pinned'); })[0];
    if (!active) return;
    e.preventDefault();
    gotoStep(active, e.key === 'ArrowRight' ? 1 : -1);
  });

  /* =====================================================================
     4. CARD FOCUS LIGHTBOX
     ===================================================================== */
  var FOCUS_GROUPS = [
    ['.device.device-rise', 'reports'],
    ['.aud-card', 'audience'],
    ['.test-card', 'testimonials'],
    ['.reveal-card', 'reveals'],
    ['.comm-card', 'community'],
    ['.insight-card', 'insight']
  ];
  var overlay, foStage, foPrev, foNext;
  var foGroup = [], foIndex = 0, lastFocused = null;
  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'focus-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.hidden = true;
    foStage = document.createElement('div'); foStage.className = 'fo-stage';
    var close = document.createElement('button'); close.type = 'button'; close.className = 'fo-close'; close.innerHTML = SVG.close; close.setAttribute('aria-label', 'Close');
    foPrev = document.createElement('button'); foPrev.type = 'button'; foPrev.className = 'fo-nav fo-prev'; foPrev.innerHTML = SVG.prev; foPrev.setAttribute('aria-label', 'Previous');
    foNext = document.createElement('button'); foNext.type = 'button'; foNext.className = 'fo-nav fo-next'; foNext.innerHTML = SVG.next; foNext.setAttribute('aria-label', 'Next');
    var hint = document.createElement('div'); hint.className = 'fo-hint';
    hint.innerHTML = '<span><kbd>Esc</kbd> close</span><span><kbd>&larr;</kbd> <kbd>&rarr;</kbd> browse</span>';
    overlay.appendChild(foStage); overlay.appendChild(close); overlay.appendChild(foPrev); overlay.appendChild(foNext); overlay.appendChild(hint);
    document.body.appendChild(overlay);

    close.addEventListener('click', closeFocus);
    foPrev.addEventListener('click', function () { stepFocus(-1); });
    foNext.addEventListener('click', function () { stepFocus(1); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeFocus(); });
    document.addEventListener('keydown', function (e) {
      if (overlay.hidden) return;
      if (e.key === 'Escape') closeFocus();
      else if (e.key === 'ArrowLeft') stepFocus(-1);
      else if (e.key === 'ArrowRight') stepFocus(1);
    });
  }
  function tagFocusables() {
    FOCUS_GROUPS.forEach(function (g) {
      [].slice.call(document.querySelectorAll(g[0])).forEach(function (el) {
        el.classList.add('focusable');
        el.setAttribute('data-focus', g[1]);
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        var badge = document.createElement('span');
        badge.className = 'fo-badge'; badge.innerHTML = SVG.expand;
        el.appendChild(badge);
        el.addEventListener('click', function (e) {
          if (e.target.closest('a, button')) return;
          openFocus(el);
        });
        el.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFocus(el); }
        });
      });
    });
  }
  function renderFocus(el) {
    var clone = el.cloneNode(true);
    clone.classList.remove('focusable', 'r', 'in');
    clone.removeAttribute('tabindex'); clone.removeAttribute('role'); clone.removeAttribute('data-tilt'); clone.removeAttribute('style');
    var b = clone.querySelector('.fo-badge'); if (b) b.remove();
    foStage.innerHTML = '';
    foStage.appendChild(clone);
    foStage.scrollTop = 0;
  }
  function openFocus(el) {
    var group = el.getAttribute('data-focus');
    foGroup = [].slice.call(document.querySelectorAll('[data-focus="' + group + '"]'));
    foIndex = foGroup.indexOf(el);
    lastFocused = el;
    renderFocus(el);
    var multi = foGroup.length > 1;
    foPrev.classList.toggle('hidden', !multi);
    foNext.classList.toggle('hidden', !multi);
    overlay.hidden = false;
    document.documentElement.classList.add('fo-lock');
    void overlay.offsetWidth; /* commit the opacity:0 start state before transitioning */
    requestAnimationFrame(function () { overlay.classList.add('open'); });
  }
  function stepFocus(dir) {
    if (foGroup.length < 2) return;
    foIndex = (foIndex + dir + foGroup.length) % foGroup.length;
    var el = foGroup[foIndex];
    foStage.firstChild && foStage.firstChild.animate &&
      foStage.firstChild.animate([{ opacity: 1 }, { opacity: 0.25 }], { duration: 120, easing: 'ease-out' });
    setTimeout(function () { renderFocus(el); }, 110);
  }
  function closeFocus() {
    overlay.classList.remove('open');
    document.documentElement.classList.remove('fo-lock');
    setTimeout(function () { overlay.hidden = true; foStage.innerHTML = ''; }, 380);
    if (lastFocused) lastFocused.focus({ preventScroll: true });
  }

  /* =====================================================================
     5. WORD-BY-WORD HEADLINE REVEALS (section h2.campaign)
     ===================================================================== */
  var wordEls = [];
  function splitWords() {
    if (reduce) return;
    [].slice.call(document.querySelectorAll('section h2.campaign')).forEach(function (h) {
      if (h.closest('.hero') || h.__split) return;
      h.__split = true;
      var nodes = [].slice.call(h.childNodes);
      h.innerHTML = '';
      var idx = 0;
      nodes.forEach(function (node) {
        if (node.nodeType === 3) {
          var words = node.textContent.split(/(\s+)/);
          words.forEach(function (w) {
            if (/^\s+$/.test(w)) { h.appendChild(document.createTextNode(w)); return; }
            if (!w) return;
            h.appendChild(makeWord(w, idx++));
          });
        } else if (node.nodeType === 1) {
          /* keep element (e.g. .grad-word) intact as a single animated unit */
          var wln = document.createElement('span'); wln.className = 'wln';
          node.style.transitionDelay = (idx * 0.05) + 's';
          node.style.display = 'inline-block';
          wln.appendChild(wrapInner(node, idx++));
          h.appendChild(wln);
        } else {
          h.appendChild(node);
        }
      });
      h.classList.add('reveal-words');
      wordEls.push(h);
    });
  }
  function makeWord(text, idx) {
    var wln = document.createElement('span'); wln.className = 'wln';
    var inner = document.createElement('span');
    inner.textContent = text;
    inner.style.setProperty('--wd', (idx * 0.05) + 's');
    wln.appendChild(inner);
    return wln;
  }
  function wrapInner(el, idx) {
    /* el becomes the animated inner span */
    el.style.setProperty('--wd', (idx * 0.05) + 's');
    el.style.transitionDelay = (idx * 0.05) + 's';
    return el;
  }

  /* =====================================================================
     6. MAGNETIC CTAs
     ===================================================================== */
  function initMagnetic() {
    if (!fine || reduce) return;
    [].slice.call(document.querySelectorAll('.btn-lg.btn-primary, .btn-lg.btn-on-dark, .nav-cta')).forEach(function (el) {
      el.classList.add('magnetic');
      var r;
      el.addEventListener('pointerenter', function () { r = el.getBoundingClientRect(); });
      el.addEventListener('pointermove', function (e) {
        if (!r) r = el.getBoundingClientRect();
        var mx = (e.clientX - (r.left + r.width / 2)) / r.width;
        var my = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = 'translate(' + (mx * 10).toFixed(1) + 'px,' + (my * 8 - 2).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; r = null; });
    });
  }

  /* =====================================================================
     7. SCROLL-DRIVEN UPDATES (rail active, spine, word reveals)
     ===================================================================== */
  var rafPending = false;
  function onScroll() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      rafPending = false;
      var vh = window.innerHeight, mid = window.scrollY + vh / 2;
      var maxY = document.documentElement.scrollHeight - vh; if (maxY < 1) maxY = 1;
      /* rail active = chapter whose centre is nearest viewport centre */
      var bestI = 0, bestD = 1e9;
      for (var i = 0; i < chapterSecs.length; i++) {
        var s = chapterSecs[i];
        var top = s.getBoundingClientRect().top + window.scrollY;
        var c = top + s.offsetHeight / 2;
        var d = Math.abs(c - mid);
        if (d < bestD) { bestD = d; bestI = i; }
      }
      if (rail) {
        for (var j = 0; j < railItems.length; j++) railItems[j].classList.toggle('active', j === bestI);
        rail.classList.toggle('on-dark', chapterSecs[bestI].classList.contains('dark'));
        if (spineFill) spineFill.style.height = (clamp(window.scrollY / maxY, 0, 1) * 100).toFixed(2) + '%';
      }
      /* word reveals — replay each time the headline re-enters view */
      if (wordEls.length) {
        for (var w = 0; w < wordEls.length; w++) {
          var wel = wordEls[w];
          var wr = wel.getBoundingClientRect();
          if (wr.top < vh - 60 && wr.bottom > 0) wel.classList.add('in');
          else if (wr.bottom < -60 || wr.top > vh + 60) wel.classList.remove('in');
        }
      }
    });
  }

  /* =====================================================================
     8. CINEMATIC INTRO
     ===================================================================== */
  function runIntro(after) {
    if (reduce || sessionStorage.getItem('siya_intro_v2')) { after(); return; }
    sessionStorage.setItem('siya_intro_v2', '1');
    var intro = document.createElement('div');
    intro.className = 'intro';
    intro.innerHTML =
      '<div class="intro-inner">' +
        '<img class="intro-mascot" src="assets/siya-wave-bowtie.png" alt="">' +
        '<img class="intro-logo" src="assets/siya-logo-lavender.png" alt="Siya">' +
        '<p class="intro-tag">Make Time for What Matters.</p>' +
      '</div>' +
      '<button class="intro-skip" type="button">Skip ' + SVG.next + '</button>';
    document.body.appendChild(intro);
    document.documentElement.classList.add('fo-lock');
    var done = false;
    function finish() {
      if (done) return; done = true;
      intro.classList.add('lift');
      document.documentElement.classList.remove('fo-lock');
      after();
      setTimeout(function () { intro.remove(); }, 1000);
    }
    intro.querySelector('.intro-skip').addEventListener('click', finish);
    ['wheel', 'touchstart', 'keydown'].forEach(function (ev) {
      window.addEventListener(ev, finish, { once: true, passive: true });
    });
    setTimeout(finish, 2100);
  }

  /* =====================================================================
     INIT
     ===================================================================== */
  buildRail();
  buildSceneSteps();
  splitWords();
  initMagnetic();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
})();

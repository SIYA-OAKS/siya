/* ============================================================================
   SIYA — cinematic scroll engine
   - persistent rAF loop, lerp-smoothed decorative parallax
   - rect-based pinned scenes expose --p (0..1) + data-step (no IntersectionObserver:
     it does not fire reliably in some preview iframes)
   - directional reveals, scrubbed bars, count-up, 3D tilt, scroll progress
   ========================================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  var nav = document.getElementById('nav');
  var bar = document.getElementById('progress');

  /* ---- collect targets ---- */
  var scenes = [].slice.call(document.querySelectorAll('[data-scene]'));
  var parallax = [].slice.call(document.querySelectorAll('[data-depth]'));
  var heroLayers = [].slice.call(document.querySelectorAll('[data-hs]'));
  var reveals = [].slice.call(document.querySelectorAll('.r'));
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  var bars = [].slice.call(document.querySelectorAll('[data-bar]'));

  var raw = window.scrollY || 0;
  var smooth = raw;
  var winH = window.innerHeight;
  var docH = document.documentElement.scrollHeight;

  function measure() { winH = window.innerHeight; docH = document.documentElement.scrollHeight; }
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('load', measure);

  /* ---- count-up ---- */
  function countUp(el) {
    if (el.__c) return; el.__c = true;
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var fmt = function (v) { return dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-IN'); };
    if (reduce) { el.textContent = fmt(target); return; }
    var dur = 1600, start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick); else el.textContent = fmt(target);
    }
    requestAnimationFrame(tick);
  }
  function fillBar(el) { if (el.__b) return; el.__b = true; el.style.width = el.getAttribute('data-bar') + '%'; }

  function inView(el, m) {
    var r = el.getBoundingClientRect();
    return r.top < winH - (m || 0) && r.bottom > 0;
  }

  /* ---- scene progress ---- */
  function updateScenes() {
    for (var i = 0; i < scenes.length; i++) {
      var el = scenes[i];
      var r = el.getBoundingClientRect();
      var total = el.offsetHeight - winH;
      if (total < 1) total = 1;
      var p = clamp(-r.top / total, 0, 1);
      el.style.setProperty('--p', p.toFixed(4));
      var steps = parseInt(el.getAttribute('data-steps') || '0', 10);
      if (steps > 0) {
        var idx = Math.min(steps - 1, Math.floor(p * steps - 0.0001));
        if (idx < 0) idx = 0;
        if (el.__step !== idx) { el.__step = idx; el.setAttribute('data-step', idx); }
        // substep progress 0..1 within the active step
        var sp = clamp(p * steps - idx, 0, 1);
        el.style.setProperty('--sp', sp.toFixed(4));
      }
      var on = r.top <= 1 && r.bottom >= winH;
      el.classList.toggle('pinned', on);
    }
  }

  /* ---- main render ---- */
  function render() {
    // progress bar
    if (bar) {
      var max = docH - winH; if (max < 1) max = 1;
      bar.style.transform = 'scaleX(' + clamp(raw / max, 0, 1).toFixed(4) + ')';
    }
    if (nav) nav.classList.toggle('scrolled', raw > 24);

    // smoothed value for decorative parallax
    smooth = reduce ? raw : lerp(smooth, raw, 0.14);

    // scenes track real scroll (must match the pin exactly)
    updateScenes();

    // decorative parallax (in-flow, distance from viewport centre)
    if (!reduce) {
      for (var i = 0; i < parallax.length; i++) {
        var el = parallax[i];
        var r = el.getBoundingClientRect();
        var centre = r.top + r.height / 2 - winH / 2;
        var d = parseFloat(el.getAttribute('data-depth'));
        el.style.transform = 'translate3d(0,' + (centre * -d).toFixed(2) + 'px,0)';
      }
      // hero layered parallax + fade as it scrolls away
      var hp = clamp(raw / (winH * 0.9), 0, 1);
      for (var j = 0; j < heroLayers.length; j++) {
        var h = heroLayers[j];
        var s = parseFloat(h.getAttribute('data-hs'));
        var fade = h.hasAttribute('data-hf');
        h.style.transform = 'translate3d(0,' + (raw * s).toFixed(2) + 'px,0)';
        if (fade) h.style.opacity = (1 - hp).toFixed(3);
      }
    }

    // reveals
    if (reveals.length) {
      reveals = reveals.filter(function (el) {
        if (inView(el, 70)) { el.classList.add('in'); return false; }
        return true;
      });
    }
    if (counters.length) counters = counters.filter(function (el) { if (inView(el, 0)) { countUp(el); return false; } return true; });
    if (bars.length) bars = bars.filter(function (el) { if (inView(el, 0)) { fillBar(el); return false; } return true; });

    requestAnimationFrame(render);
  }

  window.addEventListener('scroll', function () { raw = window.scrollY || 0; }, { passive: true });
  measure();
  requestAnimationFrame(render);

  /* ---- safety: never leave content hidden ---- */
  setTimeout(function () {
    document.querySelectorAll('.r').forEach(function (el) { el.classList.add('in'); el.style.animation = 'none'; el.style.opacity = '1'; el.style.transform = 'none'; });
    document.querySelectorAll('[data-count]').forEach(countUp);
    document.querySelectorAll('[data-bar]').forEach(fillBar);
  }, 6000);

  /* ---- 3D tilt ---- */
  if (!reduce && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.getAttribute('data-tilt')) || 6;
      el.style.transformStyle = 'preserve-3d';
      el.style.transition = 'transform .3s var(--ease-out)';
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transition = 'transform .08s linear';
        el.style.transform = 'perspective(900px) rotateX(' + (-py * max).toFixed(2) + 'deg) rotateY(' + (px * max).toFixed(2) + 'deg)';
      });
      el.addEventListener('pointerleave', function () {
        el.style.transition = 'transform .5s var(--ease-out)';
        el.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
      });
    });
  }

  /* ---- nav ---- */
  var burger = document.getElementById('burger');
  if (burger && nav) {
    burger.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.querySelectorAll('.nav-link').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); }); });
  }
  var navLinks = {};
  document.querySelectorAll('.nav-link').forEach(function (a) {
    var h = a.getAttribute('href') || '';
    if (h.charAt(0) === '#') navLinks[h.slice(1)] = a;
  });
  var spied = ['how', 'whom', 'results', 'testimonials', 'contact'].map(function (id) { return document.getElementById(id); }).filter(Boolean);
  setInterval(function () {
    var best = null, bestD = 1e9;
    spied.forEach(function (s) { var t = s.getBoundingClientRect().top; if (t < 140 && Math.abs(t) < bestD) { bestD = Math.abs(t); best = s.id; } });
    Object.keys(navLinks).forEach(function (k) { navLinks[k].style.color = (k === best) ? 'var(--primary-700)' : ''; });
  }, 300);
})();

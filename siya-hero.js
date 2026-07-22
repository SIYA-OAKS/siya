/* ============================================================================
   SIYA — theme toggle + hero intro orchestration
     • Light / dark theme (persisted; respects system pref via the <head> init)
     • Hero intro: rough answer sheet → Siya scans → insight, mascot moves in,
       then the titles roll. Failsafe: the base (no .hero-play) state IS the
       final composition, and .hero-play is force-removed after the sequence,
       so nothing can ever stay hidden.
   ========================================================================== */
(function () {
  'use strict';
  var root = document.documentElement;

  /* ---- THEME ---- */
  var btn = document.getElementById('themeToggle');
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('siya-theme', t); } catch (e) {}
    // Re-resolve scroll-reveal states so nothing is left frozen mid-fade
    // after a theme switch: anything already past its trigger snaps to shown.
    var wh = window.innerHeight;
    [].forEach.call(document.querySelectorAll('.r'), function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < wh - 70 && r.bottom > 0) el.classList.add('in');
    });
  }
  if (btn) {
    btn.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---- HERO INTRO ---- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = document.getElementById('hero');

  /* Scale the fixed 1080×1080 "scan to insight" stage to its container */
  var scene = document.querySelector('.scan-scene');
  var stage = scene && scene.querySelector('.scan-stage');
  if (scene && stage) {
    var fit = function () { stage.style.setProperty('--scan-scale', scene.clientWidth / 1080); };
    fit();
    if (window.ResizeObserver) { new ResizeObserver(fit).observe(scene); }
    else { window.addEventListener('resize', fit); }
  }

  if (hero && !reduce) {
    // (re)start the whole hero entrance — pull off .hero-play, force a reflow
    // so the CSS animations rewind, then re-add it.
    var play = function () {
      hero.classList.remove('hero-play');
      hero.classList.remove('hero-skip');
      void hero.offsetWidth; // reflow → animations restart from frame 0
      hero.classList.add('hero-play');
    };

    if ('IntersectionObserver' in window) {
      // Replay every time the hero scrolls back into view (with hysteresis so
      // it doesn't retrigger on tiny scroll jitter), and on first landing.
      var inView = false;
      var io = new IntersectionObserver(function (entries) {
        var ratio = entries[0].intersectionRatio;
        if (!inView && ratio >= 0.4) { inView = true; play(); }
        else if (inView && ratio < 0.12) { inView = false; hero.classList.remove('hero-play'); }
      }, { threshold: [0, 0.12, 0.4, 0.7] });
      io.observe(hero);
    } else {
      // No observer support: just play once on load.
      requestAnimationFrame(function () { requestAnimationFrame(play); });
    }
  }
})();

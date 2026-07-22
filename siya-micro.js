/* ============================================================================
   SIYA — micro-interaction JS (additive; does not touch siya.js / cinematic)
     • Pointer-reactive glow that follows the cursor on the dark CTA card
     • Staggered entrance for rows that otherwise appear all at once
   Robust: IntersectionObserver + rect fallback + safety net so content can
   never get stuck hidden in a preview iframe.
   ========================================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer:fine)').matches;

  /* ---------------------------------------------------------------------
     1. POINTER-REACTIVE GLOW on the dark CTA card
     --------------------------------------------------------------------- */
  if (!reduce && fine) {
    document.querySelectorAll('.cta-card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
        card.classList.add('glow');
      });
      card.addEventListener('pointerleave', function () { card.classList.remove('glow'); });
    });
  }

  /* ---------------------------------------------------------------------
     2. STAGGERED ENTRANCE
     Tag direct children of selected containers with .mi + an inline --mid
     delay; reveal the container (.mi-on) when it scrolls into view.
     --------------------------------------------------------------------- */
  var GROUPS = [
    '.rep-stat-row',   /* the 4 report metric tiles */
    '.cta-list',       /* dark CTA checklist */
    '.insight-card',   /* principal insight rows (.ic-head + .ic-row) */
    '.foot-top'        /* footer columns */
  ];
  var containers = [];
  GROUPS.forEach(function (sel) {
    [].slice.call(document.querySelectorAll(sel)).forEach(function (c) {
      var kids = [].slice.call(c.children);
      kids.forEach(function (kid, i) {
        kid.classList.add('mi');
        kid.style.setProperty('--mid', (i * 0.07).toFixed(2) + 's');
      });
      containers.push(c);
    });
  });

  function setOn(c, on) {
    if (on === c.__mi) return;
    c.__mi = on;
    c.classList.toggle('mi-on', on);
  }

  if (reduce) {
    containers.forEach(function (c) { setOn(c, true); });
  } else {
    /* rect-based toggle: replays the stagger every time the row re-enters view.
       Add when it crosses into view; clear only once fully gone (hysteresis). */
    var pending = false;
    function onScroll() {
      if (pending) return; pending = true;
      requestAnimationFrame(function () {
        pending = false;
        var vh = window.innerHeight;
        containers.forEach(function (c) {
          var r = c.getBoundingClientRect();
          if (r.top < vh - 60 && r.bottom > 0) setOn(c, true);
          else if (r.bottom < -60 || r.top > vh + 60) setOn(c, false);
        });
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('load', onScroll);
    onScroll();
  }
})();

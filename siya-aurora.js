/* ============================================================================
   SIYA — Aurora layer interactions
   Click a number in the Experience rail (or a die facet) → the die rolls to
   that step automatically. Works WITH the scroll engine by smooth-scrolling
   the pinned scene to the position that maps to the chosen step, so the drum
   rotation, active-facet styling and rail state all stay in sync.
   ========================================================================== */
(function () {
  'use strict';

  var scene = document.getElementById('experience');
  if (!scene) return;

  var STEPS = parseInt(scene.getAttribute('data-steps') || '5', 10);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFlat = function () { return window.matchMedia('(max-width: 1000px)').matches; };

  function rollTo(i) {
    i = Math.max(0, Math.min(STEPS - 1, i));

    if (isFlat()) {
      // unpinned: just bring the matching face into view
      var face = scene.querySelector('.exp-face[data-s="' + i + '"]');
      if (face) {
        var fy = face.getBoundingClientRect().top + window.scrollY - (window.innerHeight * 0.22);
        window.scrollTo({ top: fy, behavior: reduce ? 'auto' : 'smooth' });
      }
      return;
    }

    // pinned: land in the centre of step i's scroll band
    var rectTop = scene.getBoundingClientRect().top + window.scrollY;
    var total = scene.offsetHeight - window.innerHeight;
    if (total < 1) total = 1;
    var p = (i + 0.5) / STEPS;
    var top = Math.round(rectTop + p * total);
    window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
  }

  // wire the rail numbers
  var dots = [].slice.call(scene.querySelectorAll('.exp-dot'));
  dots.forEach(function (dot) {
    var i = parseInt(dot.getAttribute('data-s'), 10);
    dot.setAttribute('role', 'button');
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-label', 'Roll to step ' + (i + 1));
    dot.addEventListener('click', function () { rollTo(i); });
    dot.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); rollTo(i); }
    });
  });
})();

/* ============================================================================
   SIYA — testimonial carousel.
   A vertical "dice-roll" drum (same spirit as the Experience die): each click
   of the arrows (or a dot) tumbles the card to the next school-leader
   testimonial. Gentle autoplay, pause on hover/focus, keyboard + swipe.
   ========================================================================== */
(function () {
  var root = document.getElementById('tcar');
  if (!root) return;

  var die   = document.getElementById('tcarDie');
  var faceA = document.getElementById('tcarA');
  var faceB = document.getElementById('tcarB');
  var dotsWrap = document.getElementById('tcarDots');
  var slides = [].slice.call(root.querySelectorAll('.tcar-src .ts-card')).map(function (el) { return el.outerHTML; });
  var names  = [].slice.call(root.querySelectorAll('.tcar-src .ts-card')).map(function (el) { return el.getAttribute('data-name') || ''; });
  var N = slides.length;
  if (!N) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FRONT = 'rotateX(0deg) translateZ(var(--tz))';
  var TOP   = 'rotateX(90deg) translateZ(var(--tz))';
  var BOTTOM= 'rotateX(-90deg) translateZ(var(--tz))';

  var idx = 0, busy = false, autoTimer = null;

  faceA.innerHTML = slides[0];
  faceA.style.transform = FRONT;
  faceB.style.transform = TOP;
  faceB.style.visibility = 'hidden';

  /* dots */
  var dots = [];
  for (var i = 0; i < N; i++) {
    (function (i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'tcar-dot';
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', names[i] || ('Testimonial ' + (i + 1)));
      d.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(d);
      dots.push(d);
    })(i);
  }
  function paintDots() { dots.forEach(function (d, i) { d.classList.toggle('is-on', i === idx); }); }
  paintDots();

  function go(dir) {
    if (busy || N < 2) return;
    var next = (idx + dir + N) % N;
    if (reduce) { idx = next; faceA.innerHTML = slides[idx]; paintDots(); return; }
    busy = true;

    faceB.innerHTML = slides[next];
    faceB.style.transform = dir > 0 ? TOP : BOTTOM;
    faceB.style.visibility = 'visible';
    void die.offsetWidth;                             // reflow before animating
    die.style.transition = '';
    die.style.transform = dir > 0 ? 'rotateX(-90deg)' : 'rotateX(90deg)';

    var done = false;
    function commit() {
      if (done) return; done = true;
      idx = next;
      faceA.innerHTML = slides[idx];
      faceA.style.transform = FRONT;
      die.style.transition = 'none';
      die.style.transform = 'none';
      faceB.style.visibility = 'hidden';
      void die.offsetWidth;
      die.style.transition = '';
      busy = false;
      paintDots();
    }
    die.addEventListener('transitionend', commit, { once: true });
    setTimeout(commit, 900);                          // safety net
  }
  function goTo(target) {
    if (target === idx || busy) return;
    go(target > idx ? 1 : -1);
    // for multi-step jumps, chain remaining steps
    var steps = Math.abs(target - idx);
    // (single-step drums read cleaner; we just move one toward target)
  }

  /* controls */
  [].slice.call(root.querySelectorAll('.tcar-arrow')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      go(parseInt(btn.getAttribute('data-dir'), 10));
      restart();
    });
  });

  /* keyboard when focused within the carousel */
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(1); restart(); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(-1); restart(); }
  });

  /* touch swipe (vertical or horizontal) */
  var sx = 0, sy = 0;
  root.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  root.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 40) return;
    if (Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1); else go(dy < 0 ? 1 : -1);
    restart();
  }, { passive: true });

  /* gentle autoplay, only while the carousel is on screen and not hovered */
  var hovered = false, visible = false;
  function tick() { if (visible && !hovered && !busy) go(1); }
  function start() { if (reduce || autoTimer) return; autoTimer = setInterval(tick, 7000); }
  function stop() { clearInterval(autoTimer); autoTimer = null; }
  function restart() { stop(); start(); }
  root.addEventListener('mouseenter', function () { hovered = true; });
  root.addEventListener('mouseleave', function () { hovered = false; });
  root.addEventListener('focusin', function () { hovered = true; });
  root.addEventListener('focusout', function () { hovered = false; });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible = en.isIntersecting; visible ? start() : stop(); });
    }, { threshold: 0.25 }).observe(root);
  } else { visible = true; start(); }
})();

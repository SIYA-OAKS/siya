/* ============================================================================
   SIYA — testimonial spotlight.
   One school leader at a time, big, on the brand's charcoal editorial surface.
   A soft vertical selector swaps the featured voice with a gentle fade-in.
   Gentle autoplay, pause on hover, respects reduced motion.
   ========================================================================== */
(function () {
  var root = document.getElementById('results');
  if (!root) return;
  var src = root.querySelector('.sp-src');
  var listEl = document.getElementById('spList');
  var stageEl = root.querySelector('.sp-stage');
  if (!src || !listEl || !stageEl) return;

  var items = [].slice.call(src.querySelectorAll('article')).map(function (a) {
    var q = a.querySelector('blockquote');
    return {
      name: a.getAttribute('data-name') || '',
      role: a.getAttribute('data-role') || '',
      face: a.getAttribute('data-face') || '',
      logo: a.getAttribute('data-logo') || '',
      logoCls: a.getAttribute('data-logo-cls') || '',
      quote: q ? q.innerHTML : ''
    };
  });
  var N = items.length;
  if (!N) return;

  var quoteEl = document.getElementById('spQuote');
  var faceEl  = document.getElementById('spFace');
  var nameEl  = document.getElementById('spName');
  var roleEl  = document.getElementById('spRole');
  var logoEl  = document.getElementById('spLogo');
  var numEl   = document.getElementById('spNum');
  var reduce  = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* build the selector tabs */
  var tabs = items.map(function (it, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'sp-tab';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', it.name);
    b.innerHTML =
      '<img class="sp-tab-face" src="' + it.face + '" alt="" aria-hidden="true">' +
      '<span class="sp-tab-who">' +
        '<span class="sp-tab-name">' + it.name + '</span>' +
        '<span class="sp-tab-role">' + it.role + '</span>' +
      '</span>' +
      '<img class="sp-tab-logo" src="' + it.logo + '" alt="" aria-hidden="true">';
    b.addEventListener('click', function () { show(i); restart(); });
    listEl.appendChild(b);
    return b;
  });

  var idx = -1;

  function show(i) {
    if (i === idx) return;
    idx = i;
    var it = items[i];
    quoteEl.innerHTML = it.quote;
    faceEl.src = it.face; faceEl.alt = it.name;
    nameEl.textContent = it.name;
    roleEl.textContent = it.role;
    logoEl.src = it.logo;
    logoEl.className = 'sp-logo' + (it.logoCls ? ' sp-logo-' + it.logoCls : '');
    numEl.textContent = pad(i + 1);
    tabs.forEach(function (t, ti) {
      t.classList.toggle('is-on', ti === i);
      t.setAttribute('aria-selected', ti === i ? 'true' : 'false');
    });
    if (!reduce) {
      stageEl.classList.remove('sp-anim');
      void stageEl.offsetWidth;
      stageEl.classList.add('sp-anim');
    }
  }

  /* gentle autoplay while in view & not hovered */
  var hovered = false, visible = false, timer = null;
  function next() { show((idx + 1) % N); }
  function tick() { if (visible && !hovered) next(); }
  function start() { if (reduce || timer) return; timer = setInterval(tick, 6500); }
  function stop() { clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  root.addEventListener('mouseenter', function () { hovered = true; });
  root.addEventListener('mouseleave', function () { hovered = false; });
  root.addEventListener('focusin', function () { hovered = true; });
  root.addEventListener('focusout', function () { hovered = false; });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible = en.isIntersecting; visible ? start() : stop(); });
    }, { threshold: 0.2 }).observe(root);
  } else { visible = true; start(); }

  show(0);
})();

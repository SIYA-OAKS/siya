/* ============================================================================
   SIYA — "Why we built Siya" cinematic note.

   Choreography, every time you land on the fold:
     1. the fold gently glides itself to the centre of the screen
     2. once placed, a paper note is "pasted" in (drop + settle + tape)
     3. the mascot climbs up the note, peeks over the corner and smiles
     4. the note writes itself, stroke by stroke, in handwriting
          · primary: Vara.js draws true SVG pen-strokes
          · fallback: a Caveat clip-reveal with a pen-nib (if Vara is offline)
     5. re-arms when the fold fully leaves, so it replays on the next visit

   Respects prefers-reduced-motion (shows it finished, never auto-scrolls).
   ========================================================================== */
(function () {
  var fold   = document.getElementById('belief');
  var stage  = document.getElementById('noteStage');
  var note   = document.getElementById('paperNote');
  var mascot = document.getElementById('climbMascot');
  var target = document.getElementById('varaNote');
  var fb     = fold && fold.querySelector('.note-fallback');
  if (!fold || !note || !target || !fb) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var LINES = (fb.getAttribute('data-lines') || '').split('|')
                .map(function (s) { return s.trim(); }).filter(Boolean);

  var VARA_FONT = (window.__resources && window.__resources.varaFont) || 'https://cdn.jsdelivr.net/gh/akzhy/Vara@master/fonts/Satisfy/SatisfySL.json';
  function inkColor() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? '#CDBBF7' : '#6D50C6';
  }

  /* ---------- 4a · primary writer: Vara stroke animation ---------- */
  var varaInstance = null;
  function drawVara(onFail) {
    if (!window.Vara) { onFail(); return; }
    try {
      target.innerHTML = '';
      fb.classList.remove('show');
      var data = LINES.map(function (t, i) {
        return { text: t, fontSize: (i === LINES.length - 1) ? 21 : 27, y: null };
      });
      var started = false;
      varaInstance = new Vara(target, VARA_FONT, data, {
        strokeWidth: 1.5,
        color: inkColor(),
        fontSize: 26,
        textAlign: 'center',
        letterSpacing: 0,
        duration: 3600,
        autoAnimation: true
      });
      if (varaInstance.ready) varaInstance.ready(function () { started = true; });
      // if no <svg> ever appears, the font/script failed → use fallback
      setTimeout(function () {
        if (!target.querySelector('svg')) onFail();
      }, 4200);
    } catch (e) { onFail(); }
  }

  /* ---------- 4b · fallback writer: Caveat clip-reveal + pen ---------- */
  var STAGGER = 0.9, DUR = 1.1;
  function buildFallback() {
    if (fb.dataset.built) return;
    fb.dataset.built = '1';
    fb.textContent = '';
    LINES.forEach(function (text, i) {
      var line = document.createElement('span'); line.className = 'mh-line';
      line.style.setProperty('--d', (i * STAGGER) + 's');
      line.style.setProperty('--dur', DUR + 's');
      var wrap = document.createElement('span'); wrap.className = 'mh-wrap';
      var ink = document.createElement('span'); ink.className = 'mh-ink'; ink.textContent = text;
      var pen = document.createElement('span'); pen.className = 'mh-pen'; pen.setAttribute('aria-hidden', 'true');
      wrap.appendChild(ink); wrap.appendChild(pen); line.appendChild(wrap); fb.appendChild(line);
    });
    fb.style.setProperty('--total', ((LINES.length - 1) * STAGGER + DUR + 0.1) + 's');
  }
  function runFallback() {
    target.style.display = 'none';
    buildFallback();
    fb.classList.add('show');
    if (reduce) { fb.classList.add('written'); return; }
    fb.classList.remove('is-writing'); void fb.offsetWidth; fb.classList.add('is-writing');
  }

  function beginWrite() {
    if (reduce) { runFallback(); return; }
    drawVara(runFallback);
  }
  function resetWrite() {
    if (varaInstance) { try { target.innerHTML = ''; } catch (e) {} varaInstance = null; }
    fb.classList.remove('is-writing', 'show', 'written');
  }

  /* ---------- reduced-motion: show everything finished, no auto-scroll ---------- */
  if (reduce) {
    note.classList.add('pasted');
    if (mascot) mascot.classList.add('climbed');
    runFallback();
    return;
  }

  /* ---------- state machine ---------- */
  var state = 'armed';         // armed → snapping → paste → climb → live (loops)
  var stopTimer = null, snapWatch = null, seq = [], loopTimer = null;
  var WRITE_MS = 4700, HOLD_MS = 2600;   // write time + pause before it replays
  function clearSeq() { seq.forEach(clearTimeout); seq = []; }

  function winH() { return window.innerHeight; }
  function centreDelta() {
    var r = fold.getBoundingClientRect();
    return (r.top + r.height / 2) - winH() / 2;
  }
  function inBand() {
    var r = fold.getBoundingClientRect();
    return r.top < winH() * 0.8 && r.bottom > winH() * 0.2;
  }
  function fullyOut() {
    var r = fold.getBoundingClientRect();
    return r.bottom < -60 || r.top > winH() + 60;
  }

  function playFrom() {              // paste → climb → write
    state = 'paste';
    clearSeq();
    note.classList.add('pasted');
    seq.push(setTimeout(function () {
      if (mascot) mascot.classList.add('climbed');
    }, 520));
    seq.push(setTimeout(function () {
      state = 'live';
      beginWrite();   // writes once, then stays; re-arms only when the fold leaves
    }, 1320));
  }

  /* keep the note writing itself, again and again, while the fold is in view */
  function scheduleLoop() {
    clearTimeout(loopTimer);
    loopTimer = setTimeout(function () {
      if (state !== 'live' || !inBand()) return;
      resetWrite();
      seq.push(setTimeout(function () {
        if (state === 'live' && inBand()) { beginWrite(); scheduleLoop(); }
      }, 380));
    }, WRITE_MS + HOLD_MS);
  }

  function glideToCentre() {
    var top = window.scrollY + centreDelta();
    var max = document.documentElement.scrollHeight - winH();
    top = Math.max(0, Math.min(top, max));
    window.scrollTo({ top: top, behavior: 'smooth' });
    var settles = 0, lastY = -1, started = Date.now();
    clearInterval(snapWatch);
    snapWatch = setInterval(function () {
      var y = window.scrollY;
      var done = Math.abs(centreDelta()) < 8 || (y === lastY && ++settles > 2) || (Date.now() - started > 1200);
      lastY = y;
      if (done) { clearInterval(snapWatch); if (state === 'snapping') playFrom(); }
    }, 80);
  }

  function reArm() {
    state = 'armed';
    clearSeq(); clearInterval(snapWatch); clearTimeout(loopTimer);
    note.classList.remove('pasted');
    if (mascot) mascot.classList.remove('climbed');
    resetWrite();
  }

  function onScroll() {
    if (fullyOut()) { if (state !== 'armed') reArm(); return; }
    if (state !== 'armed') return;
    if (!inBand()) return;
    clearTimeout(stopTimer);
    stopTimer = setTimeout(function () {
      if (state !== 'armed' || !inBand()) return;
      if (Math.abs(centreDelta()) < 12) playFrom();     // already centred
      else { state = 'snapping'; glideToCentre(); }
    }, 160);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  setTimeout(onScroll, 400);   // in case we load already on #belief
})();

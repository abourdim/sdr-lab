/* ═══════════════════════════════════════════
   SDR KIDS LAB — ENHANCEMENTS v1.0.0
   Onboarding, Keyboard Shortcuts, Dynamic Home
   ═══════════════════════════════════════════ */

/* ── TASK D: ONBOARDING ── */
const SDROnboarding = (() => {
  const STORAGE_KEY = 'onboarding_complete';

  async function shouldShow() {
    try {
      const done = await SDRStorage.get('settings', STORAGE_KEY);
      return !done;
    } catch { return true; }
  }

  async function markComplete() {
    try { await SDRStorage.set('settings', STORAGE_KEY, true); } catch {}
  }

  function show() {
    const overlay = document.createElement('div');
    overlay.id = 'onboarding-overlay';
    overlay.className = 'onboarding';
    overlay.innerHTML = `
      <div class="onboarding__card">
        <div class="onboarding__header">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
        <div class="onboarding__avatar">🧑‍🚀</div>
        <h1 class="onboarding__title">Assalamu Alaikum!</h1>
        <p class="onboarding__text">I'm <strong>Mouhammed</strong>, your Radio Explorer guide! Let's set up your adventure.</p>
        
        <div class="onboarding__steps" id="onboard-steps">
          <div class="onboarding__step" data-step="1">
            <label class="onboarding__label">What should I call you?</label>
            <input type="text" id="onboard-name" class="onboarding__input" placeholder="Your name..." maxlength="30" autofocus>
          </div>
          <div class="onboarding__step" data-step="2" hidden>
            <label class="onboarding__label">Choose your experience level:</label>
            <div class="onboarding__options">
              <button class="onboarding__option onboarding__option--selected" data-level="newb">
                <span class="onboarding__option-icon">🟢</span>
                <strong>Newb</strong><span>I'm brand new to radio!</span>
              </button>
              <button class="onboarding__option" data-level="explorer">
                <span class="onboarding__option-icon">🟡</span>
                <strong>Explorer</strong><span>I know some basics</span>
              </button>
              <button class="onboarding__option" data-level="developer">
                <span class="onboarding__option-icon">🔴</span>
                <strong>Developer</strong><span>I want deep technical details</span>
              </button>
            </div>
          </div>
          <div class="onboarding__step" data-step="3" hidden>
            <label class="onboarding__label">Who are you?</label>
            <div class="onboarding__options">
              <button class="onboarding__option onboarding__option--selected" data-role="student">
                <span class="onboarding__option-icon">🎓</span>
                <strong>Student</strong><span>I'm here to learn!</span>
              </button>
              <button class="onboarding__option" data-role="teacher">
                <span class="onboarding__option-icon">👩‍🏫</span>
                <strong>Teacher</strong><span>Teaching a class</span>
              </button>
              <button class="onboarding__option" data-role="parent">
                <span class="onboarding__option-icon">👨‍👩‍👧</span>
                <strong>Parent</strong><span>Supervising my child</span>
              </button>
            </div>
          </div>
          <div class="onboarding__step" data-step="4" hidden>
            <div class="onboarding__ready-icon">📡</div>
            <p class="onboarding__text"><strong id="onboard-greeting">Welcome</strong>! Your SDR adventure begins now.</p>
            <p class="onboarding__text onboarding__text--small">
              🔑 Tip: Use the sidebar to navigate. Switch levels anytime in Settings. Press <kbd>/</kbd> to search.
            </p>
          </div>
        </div>

        <div class="onboarding__nav">
          <button class="btn btn--outline" id="onboard-back" hidden>← Back</button>
          <span class="onboarding__dots" id="onboard-dots">
            <span class="onboarding__dot onboarding__dot--active"></span>
            <span class="onboarding__dot"></span>
            <span class="onboarding__dot"></span>
            <span class="onboarding__dot"></span>
          </span>
          <button class="btn btn--primary" id="onboard-next">Next →</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    wireOnboarding(overlay);
  }

  function wireOnboarding(overlay) {
    let step = 1;
    let selectedLevel = 'newb';
    let selectedRole = 'student';

    const nextBtn = overlay.querySelector('#onboard-next');
    const backBtn = overlay.querySelector('#onboard-back');
    const dots = overlay.querySelectorAll('.onboarding__dot');

    function showStep(n) {
      overlay.querySelectorAll('.onboarding__step').forEach(s => s.hidden = true);
      overlay.querySelector(`.onboarding__step[data-step="${n}"]`).hidden = false;
      dots.forEach((d, i) => d.classList.toggle('onboarding__dot--active', i === n - 1));
      backBtn.hidden = n === 1;
      nextBtn.textContent = n === 4 ? '🚀 Start Adventure!' : 'Next →';
      if (n === 4) {
        const name = overlay.querySelector('#onboard-name')?.value?.trim() || 'Explorer';
        overlay.querySelector('#onboard-greeting').textContent = `Welcome, ${name}`;
      }
    }

    overlay.querySelectorAll('[data-level]').forEach(btn => {
      btn.addEventListener('click', () => {
        overlay.querySelectorAll('[data-level]').forEach(b => b.classList.remove('onboarding__option--selected'));
        btn.classList.add('onboarding__option--selected');
        selectedLevel = btn.dataset.level;
      });
    });

    overlay.querySelectorAll('[data-role]').forEach(btn => {
      btn.addEventListener('click', () => {
        overlay.querySelectorAll('[data-role]').forEach(b => b.classList.remove('onboarding__option--selected'));
        btn.classList.add('onboarding__option--selected');
        selectedRole = btn.dataset.role;
      });
    });

    nextBtn.addEventListener('click', () => {
      if (step < 4) { step++; showStep(step); }
      else {
        const name = overlay.querySelector('#onboard-name')?.value?.trim();
        if (name) SDRStorage.set('settings', 'playerName', name).catch(() => {});
        SDRSettings.set('level', selectedLevel);
        SDRSettings.set('role', selectedRole);
        markComplete();
        overlay.classList.add('onboarding--closing');
        setTimeout(() => overlay.remove(), 400);
        if (typeof SDRSound !== 'undefined') SDRSound.play('levelup');
      }
    });

    backBtn.addEventListener('click', () => {
      if (step > 1) { step--; showStep(step); }
    });

    overlay.querySelector('#onboard-name')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { step++; showStep(step); }
    });
  }

  return { shouldShow, show, markComplete };
})();


/* ── TASK E: KEYBOARD SHORTCUTS ── */
const SDRKeyboard = (() => {
  function init() {
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea, select')) return;

      if (e.key === '/') {
        e.preventDefault();
        const overlay = document.getElementById('search-overlay');
        const input = document.getElementById('search-input');
        if (overlay) {
          overlay.hidden = !overlay.hidden;
          overlay.classList.toggle('search-overlay--open');
          if (!overlay.hidden && input) input.focus();
        }
      }
      if (e.key === 'Escape') {
        const so = document.getElementById('search-overlay');
        if (so && !so.hidden) { so.hidden = true; so.classList.remove('search-overlay--open'); }
      }
      if (e.altKey && e.key === 'ArrowLeft') navigateModule(-1);
      if (e.altKey && e.key === 'ArrowRight') navigateModule(1);
      if (e.altKey && e.key === '1') { e.preventDefault(); SDRSettings.set('level', 'newb'); }
      if (e.altKey && e.key === '2') { e.preventDefault(); SDRSettings.set('level', 'explorer'); }
      if (e.altKey && e.key === '3') { e.preventDefault(); SDRSettings.set('level', 'developer'); }
      if (e.altKey && e.key === 'h') { e.preventDefault(); SDRRouter.navigate('home'); }
    });
  }

  function navigateModule(delta) {
    const current = SDRRouter.getCurrent();
    if (!current.startsWith('module-')) return;
    const num = parseInt(current.replace('module-', ''));
    const next = num + delta;
    if (next >= 0 && next <= 14) SDRRouter.navigate(`module-${next}`);
  }

  return { init };
})();


/* ── TASK F: DYNAMIC HOME ── */
const SDRDynamicHome = (() => {
  const FACTS = [
    "The first radio broadcast was on Christmas Eve 1906 by Reginald Fessenden!",
    "Radio waves travel at the speed of light — 299,792,458 m/s!",
    "The RTL-SDR dongle was originally designed for watching TV on computers!",
    "FM radio was invented by Edwin Armstrong in 1933 — the same tech we use today!",
    "The ISS transmits on 145.80 MHz — you can hear it with an SDR!",
    "Hedy Lamarr, a Hollywood actress, co-invented frequency hopping spread spectrum!",
    "NOAA weather satellites pass overhead about 6 times per day!",
    "Your WiFi router is actually a software-defined radio transmitter!",
    "ADS-B signals from airplanes travel 250+ miles line-of-sight!",
    "The first transatlantic radio signal was sent by Marconi in 1901!",
    "Islamic Golden Age scholars made key advances in optics and wave theory!",
    "A simple wire antenna can pick up signals from satellites 850 km away!",
    "LoRa radio can send tiny messages over 15 km in open terrain!",
    "There are about 3 billion IoT devices using radio frequencies worldwide!",
    "The electromagnetic spectrum is infinite — we've only mapped a tiny fraction!",
  ];

  async function getPlayerName() {
    try { return await SDRStorage.get('settings', 'playerName'); } catch { return null; }
  }

  async function render() {
    const el = document.getElementById('home-dynamic');
    if (!el) return;

    const stats = typeof SDRProgress !== 'undefined' ? SDRProgress.getStats() : null;
    const fact = FACTS[Math.floor(Math.random() * FACTS.length)];
    let html = '';

    // Bilingual greeting
    if (typeof SDRI18n !== 'undefined') {
      const playerName = await getPlayerName();
      const greeting = SDRI18n.getGreeting(playerName);
      html += `<div class="home-dynamic__card home-dynamic__greeting">
        <span class="home-dynamic__icon">🧑‍🚀</span>
        <div><strong>${greeting}</strong><p>Ready to explore the invisible world of radio?</p></div>
      </div>`;
    }

    html += `<div class="home-dynamic__card home-dynamic__fact">
      <span class="home-dynamic__icon">💡</span>
      <div><strong>Did You Know?</strong><p>${fact}</p></div>
    </div>`;

    if (stats && stats.xp > 0) {
      html += `<div class="home-dynamic__card home-dynamic__progress">
        <span class="home-dynamic__icon">⭐</span>
        <div><strong>Level ${stats.level}: ${stats.levelTitle}</strong>
        <p>${stats.xp} XP · ${stats.modulesViewed} modules · ${stats.quizCorrect} correct answers</p></div>
      </div>`;

      const nextNum = Math.min(stats.modulesViewed, 14);
      const modules = SDRModules.getAll();
      const next = modules[nextNum];
      if (next) {
        html += `<div class="home-dynamic__card home-dynamic__suggest">
          <span class="home-dynamic__icon">🧭</span>
          <div><strong>Suggested Next</strong>
          <p><a href="#${next.id}" class="home-dynamic__link">${next.icon} ${next.name}</a></p></div>
        </div>`;
      }
    }

    html += `<div class="home-dynamic__card home-dynamic__tip">
      <span class="home-dynamic__icon">⌨️</span>
      <div><strong>Keyboard Shortcuts</strong>
      <p><kbd>/</kbd> Search · <kbd>Alt+←→</kbd> Prev/Next · <kbd>Alt+1/2/3</kbd> Level · <kbd>Alt+H</kbd> Home</p></div>
    </div>`;

    el.innerHTML = html;
  }

  return { render };
})();

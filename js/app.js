/* ═══════════════════════════════════════════
   SDR KIDS LAB — MAIN APP v1.0.0
   Module definitions, initialization, rendering
   ═══════════════════════════════════════════ */

/* ── MODULE DEFINITIONS ── */
const SDRModules = (() => {
  const MODULES = [
    {
      id: 'module-0',
      num: 0,
      name: 'Welcome & Setup',
      icon: '👋',
      description: 'Meet Mouhammed and start your radio adventure!',
      narrative: 'Mouhammed discovers the invisible world of radio',
      category: 'intro',
      locked: false,
    },
    {
      id: 'module-1',
      num: 1,
      name: 'Radio History & Heroes',
      icon: '📜',
      description: 'Meet the pioneers who shaped radio technology.',
      narrative: 'Mouhammed learns from the heroes of radio history',
      category: 'theory',
      locked: false,
    },
    {
      id: 'module-2',
      num: 2,
      name: 'What is Radio?',
      icon: '🌊',
      description: 'Understand electromagnetic waves and how radio works.',
      narrative: 'Mouhammed understands how waves travel',
      category: 'theory',
      locked: false,
    },
    {
      id: 'module-3',
      num: 3,
      name: 'What is SDR?',
      icon: '💻',
      description: 'Software that replaces hardware — the magic of SDR.',
      narrative: 'Mouhammed meets SDR — software that hears everything',
      category: 'theory',
      locked: false,
    },
    {
      id: 'module-4',
      num: 4,
      name: 'Frequency & Spectrum',
      icon: '📊',
      description: 'Explore the rainbow of radio frequencies.',
      narrative: 'Mouhammed explores the frequency spectrum',
      category: 'theory',
      locked: false,
    },
    {
      id: 'module-5',
      num: 5,
      name: 'Antenna Lab',
      icon: '📡',
      description: 'Build and understand antennas — the ears of radio.',
      narrative: 'Mouhammed builds his first antenna',
      category: 'theory',
      locked: false,
    },
    {
      id: 'module-6',
      num: 6,
      name: 'Modulation & Demodulation',
      icon: '〰️',
      description: 'How messages ride on radio waves.',
      narrative: 'Mouhammed cracks the code of modulation',
      category: 'theory',
      locked: false,
    },
    {
      id: 'module-7',
      num: 7,
      name: 'micro:bit Radio Lab',
      icon: '📟',
      description: 'Your first real radio experience — send messages!',
      narrative: "Mouhammed's first radio with micro:bit",
      category: 'hardware',
      badge: 'kids',
      locked: false,
    },
    {
      id: 'module-8',
      num: 8,
      name: 'ESP32 + LoRa Lab',
      icon: '🔌',
      description: 'Long range IoT radio — talk across a city!',
      narrative: 'Mouhammed goes long range with LoRa',
      category: 'hardware',
      badge: 'kids',
      locked: false,
    },
    {
      id: 'module-9',
      num: 9,
      name: 'RTL-SDR Lab',
      icon: '📻',
      description: 'Plug in and hear the invisible world — your main SDR tool!',
      narrative: 'Mouhammed plugs in RTL-SDR and hears the world',
      category: 'hardware',
      badge: 'kids-primary',
      locked: false,
    },
    {
      id: 'module-10',
      num: 10,
      name: 'HackRF One Lab',
      icon: '🔬',
      description: 'Advanced transmit + receive SDR — full power!',
      narrative: 'Mouhammed unlocks HackRF One',
      category: 'hardware',
      badge: 'advanced',
      locked: true,
      requiredLevel: 'developer',
    },
    {
      id: 'module-11',
      num: 11,
      name: 'Signal Decoding Lab',
      icon: '🔓',
      description: 'Decode hidden messages from the airwaves.',
      narrative: 'Mouhammed decodes hidden signals',
      category: 'advanced',
      locked: false,
    },
    {
      id: 'module-12',
      num: 12,
      name: 'SDR + IoT Protocols',
      icon: '🌐',
      description: 'How IoT devices talk with invisible radio.',
      narrative: 'Mouhammed maps the IoT radio universe',
      category: 'advanced',
      locked: false,
    },
    {
      id: 'module-13',
      num: 13,
      name: 'Security & Ethics',
      icon: '🛡️',
      description: 'Be a responsible radio guardian.',
      narrative: 'Mouhammed becomes a responsible radio guardian',
      category: 'security',
      locked: false,
    },
    {
      id: 'module-14',
      num: 14,
      name: 'Final Project',
      icon: '🏆',
      description: 'Design your own SDR monitoring station!',
      narrative: 'Mouhammed designs his own SDR station — graduation!',
      category: 'capstone',
      locked: false,
    },
  ];

  function getAll() { return MODULES; }
  function getById(id) { return MODULES.find(m => m.id === id); }

  /* ── RENDER SIDEBAR MODULE LIST ── */
  function renderSidebar() {
    const list = document.getElementById('module-list');
    if (!list) return;

    const level = SDRSettings.get('level');

    list.innerHTML = MODULES.map(m => {
      const isLocked = m.locked && m.requiredLevel && level !== m.requiredLevel && level !== 'teacher';
      const statusIcon = isLocked ? '🔒' : (m.badge === 'kids' || m.badge === 'kids-primary') ? '✋' : '';
      
      return `
        <div class="sidebar__module-item ${isLocked ? 'sidebar__module-item--locked' : ''}" 
             data-route="${m.id}" 
             ${isLocked ? 'title="Complete previous modules or switch to Developer level"' : ''}
             role="button" tabindex="0" aria-label="Module ${m.num}: ${m.name}">
          <span class="sidebar__module-num">${m.num}</span>
          <span class="sidebar__module-name">${m.name}</span>
          <span class="sidebar__module-status">${statusIcon}</span>
        </div>
      `;
    }).join('');
  }

  /* ── RENDER HOME MODULE GRID ── */
  function renderHomeGrid() {
    const grid = document.getElementById('home-modules');
    if (!grid) return;

    const level = SDRSettings.get('level');

    const categories = [
      { key: 'intro', label: '🏠 Getting Started', modules: [] },
      { key: 'theory', label: '📚 Theory & Fundamentals', modules: [] },
      { key: 'hardware', label: '🔧 Hardware Labs', modules: [] },
      { key: 'advanced', label: '🔬 Applied Skills', modules: [] },
      { key: 'security', label: '🛡️ Ethics & Security', modules: [] },
      { key: 'capstone', label: '🏆 Capstone Project', modules: [] },
    ];

    MODULES.forEach(m => {
      const cat = categories.find(c => c.key === m.category);
      if (cat) cat.modules.push(m);
    });

    grid.innerHTML = categories.filter(c => c.modules.length > 0).map(cat => {
      const cards = cat.modules.map(m => {
        const isLocked = m.locked && m.requiredLevel && level !== m.requiredLevel && level !== 'teacher';
        return `
          <div class="home__module-card ${isLocked ? 'home__module-card--locked' : ''}"
               ${!isLocked ? `data-route="${m.id}"` : ''}
               role="button" tabindex="0" aria-label="Module ${m.num}: ${m.name}">
            <div class="home__module-num">Module ${m.num}</div>
            <div class="home__module-icon">${m.icon}</div>
            <div class="home__module-name">${m.name}</div>
            <div class="home__module-desc">${m.description}</div>
          </div>
        `;
      }).join('');

      return `
        <div class="home__category">
          <h3 class="home__category-title">${cat.label}</h3>
          <div class="home__category-grid">${cards}</div>
        </div>
      `;
    }).join('');
  }

  /* ── RENDER MODULE PAGE ── */
  function render(moduleId) {
    const m = getById(moduleId);
    if (!m) return;

    const header = document.getElementById('module-header');
    const content = document.getElementById('module-content');
    const nav = document.getElementById('module-nav');
    const level = SDRSettings.get('level');

    // Check lock
    if (m.locked && m.requiredLevel && level !== m.requiredLevel && level !== 'teacher') {
      header.innerHTML = `
        <h2 class="module-view__title">🔒 ${m.name}</h2>
        <p class="module-view__subtitle">This module requires ${m.requiredLevel} level access.</p>
      `;
      content.innerHTML = `
        <div class="module-view__placeholder">
          <div class="module-view__placeholder-icon">🔒</div>
          <div class="module-view__placeholder-text">Coming when you're ready!</div>
          <div class="module-view__placeholder-hint">Switch to Developer level in Settings to unlock this module.</div>
        </div>
      `;
      nav.innerHTML = '';
      return;
    }

    // Header
    let badgeHTML = '';
    if (m.badge === 'kids' || m.badge === 'kids-primary') {
      badgeHTML = `<span class="badge badge--safe module-view__badge">Kids ✋</span>`;
    } else if (m.badge === 'advanced') {
      badgeHTML = `<span class="badge badge--locked module-view__badge">Advanced 🔒</span>`;
    }

    const levelBadge = `<span class="badge badge--${level} module-view__badge">${level === 'newb' ? '🟢 Newb' : level === 'explorer' ? '🟡 Explorer' : '🔴 Developer'}</span>`;

    header.innerHTML = `
      <h2 class="module-view__title">${m.icon} Module ${m.num}: ${m.name}</h2>
      <p class="module-view__subtitle">${m.narrative}</p>
      <div>${levelBadge} ${badgeHTML}</div>
    `;

    // Content — try ModuleContent engine first, fallback to placeholder
    const hasContent = typeof ModuleContent !== 'undefined' && ModuleContent.get(moduleId, level);
    if (hasContent) {
      ModuleContent.render(moduleId, content, level);
    } else {
      content.innerHTML = `
        <div class="module-view__placeholder">
          <div class="module-view__placeholder-icon">${m.icon}</div>
          <div class="module-view__placeholder-text">${m.name}</div>
          <div class="module-view__placeholder-hint">
            📦 Module content coming in future phases!<br>
            <em>"${m.narrative}"</em>
          </div>
        </div>
      `;
    }

    // Navigation — prev/next buttons
    const prevModule = MODULES.find(mod => mod.num === m.num - 1);
    const nextModule = MODULES.find(mod => mod.num === m.num + 1);

    nav.innerHTML = `
      ${prevModule 
        ? `<button class="btn btn--outline btn--sm" data-route="${prevModule.id}">← ${prevModule.name}</button>` 
        : '<span></span>'
      }
      ${nextModule 
        ? `<button class="btn btn--primary btn--sm" data-route="${nextModule.id}">${nextModule.name} →</button>` 
        : '<span></span>'
      }
    `;
  }

  return {
    getAll,
    getById,
    renderSidebar,
    renderHomeGrid,
    render,
  };
})();

/* ═══════════════════════════════════════════
   APP INITIALIZATION
   ═══════════════════════════════════════════ */
const SDRApp = (() => {
  async function init() {
    console.log('📡 SDR Kids Lab v1.0.0 — Initializing...');

    try {
      // 1. Initialize storage
      await SDRStorage.init();

      // 2. Initialize settings (loads from storage, applies to DOM)
      await SDRSettings.init();

      // 3. Render module lists
      SDRModules.renderSidebar();
      SDRModules.renderHomeGrid();

      // 4. Initialize router
      SDRRouter.init();

      // 5. Initialize simulator playground
      SDRPlayground.init();

      // 6. Initialize gamification
      if (typeof SDRProgress !== 'undefined') {
        await SDRProgress.init();
        SDRProgress.updateUI();
      }

      // 7. Initialize search
      if (typeof SDRSearch !== 'undefined') {
        SDRSearch.buildIndex();
        SDRSearch.attachSearchEvents();
      }

      // 8. Initialize sound
      if (typeof SDRSound !== 'undefined') {
        SDRSound.init();
      }

      // 9. Initialize keyboard shortcuts
      if (typeof SDRKeyboard !== 'undefined') {
        SDRKeyboard.init();
      }

      // 10. Listen for setting changes to re-render
      window.addEventListener('sdr-setting-changed', (e) => {
        if (e.detail.key === 'level' || e.detail.key === 'role') {
          SDRModules.renderSidebar();
          SDRModules.renderHomeGrid();
          // Re-render current module if viewing one
          const current = SDRRouter.getCurrent();
          if (current.startsWith('module-')) {
            SDRModules.render(current);
          }
        }
      });

      // 6. Hide splash, show app
      setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const app = document.getElementById('app');
        if (splash) splash.classList.add('splash--hidden');
        if (app) app.hidden = false;
        
        // Remove splash from DOM after animation
        setTimeout(() => {
          if (splash) splash.remove();
          // Show onboarding for first-time users
          if (typeof SDROnboarding !== 'undefined') {
            SDROnboarding.shouldShow().then(show => { if (show) SDROnboarding.show(); });
          }
          // Update dynamic home content
          if (typeof SDRDynamicHome !== 'undefined') SDRDynamicHome.render().catch(() => {});
        }, 700);
      }, 2200); // Wait for loader animation

      console.log('📡 SDR Kids Lab v1.0.0 — Ready! ✅');

    } catch (error) {
      console.error('📡 SDR Kids Lab: Init failed', error);
      // Fallback — show app with error notification
      const splash = document.getElementById('splash-screen');
      const app = document.getElementById('app');
      if (splash) splash.classList.add('splash--hidden');
      if (app) app.hidden = false;
      // Show user-facing error
      SDRNotify.show('⚠️ Some features may be limited — storage unavailable. Your progress won\'t be saved this session.', 'warning', 8000);
    }
  }

  return { init };
})();

/* ── NOTIFICATION SYSTEM ── */
const SDRNotify = (() => {
  let container = null;

  function ensureContainer() {
    if (!container) {
      container = document.createElement('div');
      container.id = 'sdr-notifications';
      container.className = 'sdr-notify';
      document.body.appendChild(container);
    }
    return container;
  }

  function show(message, type = 'info', duration = 4000) {
    const c = ensureContainer();
    const toast = document.createElement('div');
    toast.className = `sdr-notify__toast sdr-notify__toast--${type}`;
    toast.innerHTML = message;
    c.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => toast.classList.add('sdr-notify__toast--visible'));

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => dismiss(toast), duration);
    }
    return toast;
  }

  function dismiss(toast) {
    toast.classList.remove('sdr-notify__toast--visible');
    setTimeout(() => toast.remove(), 300);
  }

  return { show, dismiss };
})();

/* ── START ── */
document.addEventListener('DOMContentLoaded', () => {
  SDRApp.init();
});

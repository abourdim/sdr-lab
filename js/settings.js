/* ═══════════════════════════════════════════
   SDR KIDS LAB — SETTINGS MANAGER v0.1.0
   Theme, level, accessibility, sound
   ═══════════════════════════════════════════ */

const SDRSettings = (() => {
  // Default settings
  const DEFAULTS = {
    theme: 'dark',
    level: 'newb',
    role: 'student',
    sound: 'on',
    lang: 'en',
    contrast: 'off',
    dyslexia: 'off',
    motion: 'full',
    fontSize: 16,
  };

  let current = { ...DEFAULTS };

  /* ── INIT ── */
  async function init() {
    // Load each setting from storage
    for (const [key, defaultVal] of Object.entries(DEFAULTS)) {
      const saved = await SDRStorage.getSetting(key, defaultVal);
      current[key] = saved;
    }
    applyAll();
    bindUI();
    console.log('⚙️ SDR Settings: Loaded', current);
  }

  /* ── APPLY SETTINGS TO DOM ── */
  function applyAll() {
    applyTheme(current.theme);
    applyFontSize(current.fontSize);
    applyAccessibility();
    updateUIState();
  }

  function applyTheme(theme) {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    
    const darkSheet = document.getElementById('theme-dark');
    const lightSheet = document.getElementById('theme-light');
    
    if (darkSheet) darkSheet.disabled = (theme !== 'dark');
    if (lightSheet) lightSheet.disabled = (theme !== 'light');
    
    // Update theme toggle icons
    const moonIcon = document.querySelector('.icon-moon');
    const sunIcon = document.querySelector('.icon-sun');
    if (moonIcon && sunIcon) {
      moonIcon.hidden = (theme === 'light');
      sunIcon.hidden = (theme === 'dark');
    }

    // Update meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = theme === 'dark' ? '#0a1628' : '#f0f4f8';
    }
  }

  function applyFontSize(size) {
    document.documentElement.style.setProperty('--font-size-base', size + 'px');
    document.documentElement.setAttribute('data-font-size', size);
    const label = document.getElementById('font-size-value');
    if (label) label.textContent = size + 'px';
    const slider = document.getElementById('font-size-slider');
    if (slider) slider.value = size;
  }

  function applyAccessibility() {
    const html = document.documentElement;
    html.setAttribute('data-contrast', current.contrast);
    html.setAttribute('data-dyslexia', current.dyslexia);
    html.setAttribute('data-motion', current.motion);
  }

  /* ── UPDATE UI STATE ── */
  function updateUIState() {
    // Update all toggle button groups
    document.querySelectorAll('[data-setting]').forEach(btn => {
      const setting = btn.dataset.setting;
      const value = btn.dataset.value;
      btn.classList.toggle('settings__toggle-btn--active', current[setting] === value);
    });

    // Update sidebar level buttons
    document.querySelectorAll('.sidebar__level-btn').forEach(btn => {
      const isActive = btn.dataset.level === current.level;
      btn.classList.toggle('sidebar__level-btn--active', isActive);
      btn.setAttribute('aria-checked', isActive);
    });
  }

  /* ── SET INDIVIDUAL SETTING ── */
  async function set(key, value) {
    current[key] = value;
    await SDRStorage.setSetting(key, value);
    
    // Apply specific changes
    switch (key) {
      case 'theme':
        applyTheme(value);
        break;
      case 'fontSize':
        applyFontSize(value);
        break;
      case 'contrast':
      case 'dyslexia':
      case 'motion':
        applyAccessibility();
        break;
      case 'lang':
        if (typeof SDRI18n !== 'undefined') SDRI18n.setLang(value);
        break;
    }
    
    updateUIState();
    
    // Dispatch event for other modules to listen
    window.dispatchEvent(new CustomEvent('sdr-setting-changed', { 
      detail: { key, value } 
    }));
  }

  function get(key) {
    return current[key];
  }

  function getAll() {
    return { ...current };
  }

  /* ── BIND UI EVENTS ── */
  function bindUI() {
    // Theme toggle button (topbar)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        set('theme', current.theme === 'dark' ? 'light' : 'dark');
      });
    }

    // Settings page toggle buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-setting]');
      if (btn) {
        const setting = btn.dataset.setting;
        const value = btn.dataset.value;
        if (setting === 'fontSize') return; // handled by range
        set(setting, value);
      }
    });

    // Font size slider
    const fontSlider = document.getElementById('font-size-slider');
    if (fontSlider) {
      fontSlider.addEventListener('input', (e) => {
        set('fontSize', parseInt(e.target.value));
      });
    }

    // Sidebar level buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.sidebar__level-btn');
      if (btn) {
        set('level', btn.dataset.level);
      }
    });

    // Export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        const json = await SDRStorage.exportAll();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sdr-kids-lab-progress.json';
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // Import button
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');
    if (importBtn && importFile) {
      importBtn.addEventListener('click', () => importFile.click());
      importFile.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const text = await file.text();
        try {
          await SDRStorage.importAll(text);
          await init(); // Reload settings
          alert('✅ Progress imported successfully!');
          location.reload();
        } catch (err) {
          alert('❌ Import failed: ' + err.message);
        }
      });
    }

    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        if (confirm('⚠️ This will erase ALL your progress, settings, and achievements. Are you sure?')) {
          await SDRStorage.resetAll();
          location.reload();
        }
      });
    }
  }

  /* ── PUBLIC API ── */
  return {
    init,
    set,
    get,
    getAll,
  };
})();

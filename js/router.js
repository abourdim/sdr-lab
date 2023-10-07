/* ═══════════════════════════════════════════
   SDR KIDS LAB — ROUTER v0.1.0
   Client-side page navigation + breadcrumbs
   ═══════════════════════════════════════════ */

const SDRRouter = (() => {
  let currentRoute = 'home';

  /* ── ROUTE DEFINITIONS ── */
  const routes = {
    home: { page: 'page-home', title: 'Home', icon: '🏠' },
    settings: { page: 'page-settings', title: 'Settings', icon: '⚙️' },
    help: { page: 'page-help', title: 'Help', icon: '❓' },
    playground: { page: 'page-playground', title: 'Simulator Playground', icon: '🧪' },
    tools: { page: 'page-tools', title: 'Genius Tools', icon: '🧠' },
    progress: { page: 'page-progress', title: 'Progress', icon: '📊' },
    dashboard: { page: 'page-dashboard', title: 'Dashboard', icon: '👩‍🏫' },
  };

  // Module routes are generated dynamically from MODULES data
  function getModuleRoute(moduleId) {
    return {
      page: 'page-module',
      title: SDRModules.getById(moduleId)?.name || 'Module',
      icon: SDRModules.getById(moduleId)?.icon || '📦',
      moduleId,
    };
  }

  /* ── INIT ── */
  function init() {
    bindNavigation();
    
    // Check hash on load
    const hash = window.location.hash.slice(1);
    if (hash) {
      navigate(hash);
    } else {
      navigate('home');
    }
    
    console.log('🧭 SDR Router: Ready');
  }

  /* ── NAVIGATE ── */
  function navigate(route) {
    // Stop any running simulator animations before leaving
    document.querySelectorAll('.mc-sim-embed').forEach(embed => {
      if (embed._sim) {
        if (embed._sim.stop) embed._sim.stop();
        if (embed._sim.destroy) embed._sim.destroy();
        embed._sim = null;
      }
    });

    // Stop audio spectrum if leaving tools
    if (typeof AudioSpectrum !== 'undefined' && AudioSpectrum.isRunning()) {
      AudioSpectrum.stop();
      const btn = document.getElementById('audio-spectrum-btn');
      if (btn) { btn.textContent = '🎤 Start Listening'; btn.classList.remove('btn--active'); }
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.hidden = true);

    let routeConfig;

    if (route.startsWith('module-')) {
      routeConfig = getModuleRoute(route);
    } else {
      routeConfig = routes[route];
    }

    if (!routeConfig) {
      routeConfig = routes.home;
      route = 'home';
    }

    // Show target page
    const page = document.getElementById(routeConfig.page);
    if (page) {
      page.hidden = false;
    }

    // If it's a module, render module content
    if (route.startsWith('module-') && typeof SDRModules !== 'undefined') {
      SDRModules.render(route);
      if (typeof SDRProgress !== 'undefined') SDRProgress.markModuleViewed(route);
      if (typeof SDRSound !== 'undefined') SDRSound.play('navigate');
    }

    // Progress page
    if (route === 'progress' && typeof SDRProgress !== 'undefined') {
      const el = document.getElementById('progress-content');
      if (el) {
        el.innerHTML = SDRProgress.renderProgressPage();
        // Wire certificate button
        const certBtn = document.getElementById('gen-cert-btn');
        if (certBtn) {
          certBtn.addEventListener('click', () => {
            const name = document.getElementById('cert-name')?.value;
            const container = document.getElementById('cert-container');
            if (container) container.innerHTML = SDRProgress.generateCertificate(name);
          });
        }
      }
    }

    // Dashboard page
    if (route === 'dashboard' && typeof SDRTeacherMode !== 'undefined') {
      const el = document.getElementById('dashboard-content');
      if (el) {
        el.innerHTML = SDRTeacherMode.renderDashboard();
        SDRTeacherMode.attachEvents();
      }
    }

    // Genius Tools page
    if (route === 'tools' && typeof GeniusTools !== 'undefined') {
      GeniusTools.init();
    }

    // Update state
    currentRoute = route;
    window.location.hash = route;

    // Update breadcrumb
    updateBreadcrumb(route, routeConfig);

    // Update sidebar active state
    updateSidebarActive(route);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close sidebar on mobile
    const sidebar = document.getElementById('sidebar');
    if (sidebar && window.innerWidth < 1024) {
      sidebar.classList.remove('sidebar--open');
    }

    // Dispatch event
    window.dispatchEvent(new CustomEvent('sdr-route-changed', { 
      detail: { route, config: routeConfig } 
    }));
  }

  /* ── BREADCRUMB ── */
  function updateBreadcrumb(route, config) {
    const breadcrumb = document.getElementById('breadcrumb');
    if (!breadcrumb) return;

    let html = '<span class="breadcrumb__item breadcrumb__item--home" data-route="home">Home</span>';

    if (route !== 'home') {
      if (route.startsWith('module-')) {
        html += `<span class="breadcrumb__item" data-route="${route}">${config.icon} ${config.title}</span>`;
      } else {
        html += `<span class="breadcrumb__item" data-route="${route}">${config.icon} ${config.title}</span>`;
      }
    }

    breadcrumb.innerHTML = html;
  }

  /* ── SIDEBAR ACTIVE STATE ── */
  function updateSidebarActive(route) {
    document.querySelectorAll('.sidebar__module-item').forEach(item => {
      item.classList.toggle('sidebar__module-item--active', item.dataset.route === route);
    });
  }

  /* ── BIND NAVIGATION ── */
  function bindNavigation() {
    // Global click handler for [data-route] elements
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-route]');
      if (target) {
        e.preventDefault();
        navigate(target.dataset.route);
      }
    });

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarClose = document.getElementById('sidebar-close');

    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('sidebar--open');
        sidebarToggle.setAttribute('aria-expanded', isOpen);
      });
    }

    if (sidebarClose && sidebar) {
      sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('sidebar--open');
        sidebarToggle?.setAttribute('aria-expanded', 'false');
      });
    }

    // Search toggle
    const searchToggle = document.getElementById('search-toggle');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');

    if (searchToggle && searchOverlay) {
      searchToggle.addEventListener('click', () => {
        searchOverlay.hidden = false;
        searchInput?.focus();
      });
    }

    if (searchClose && searchOverlay) {
      searchClose.addEventListener('click', () => {
        searchOverlay.hidden = true;
      });
    }

    if (searchOverlay) {
      searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
          searchOverlay.hidden = true;
        }
      });
    }

    // Settings toggle (topbar)
    const settingsToggle = document.getElementById('settings-toggle');
    if (settingsToggle) {
      settingsToggle.addEventListener('click', () => navigate('settings'));
    }

    // Help toggle (topbar)
    const helpToggle = document.getElementById('help-toggle');
    if (helpToggle) {
      helpToggle.addEventListener('click', () => navigate('help'));
    }

    // Handle browser back/forward
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      if (hash && hash !== currentRoute) {
        navigate(hash);
      }
    });

    // Keyboard: Escape to close overlays
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (searchOverlay && !searchOverlay.hidden) {
          searchOverlay.hidden = true;
        }
        if (sidebar && sidebar.classList.contains('sidebar--open') && window.innerWidth < 1024) {
          sidebar.classList.remove('sidebar--open');
        }
      }
    });
  }

  /* ── PUBLIC API ── */
  return {
    init,
    navigate,
    getCurrent: () => currentRoute,
  };
})();

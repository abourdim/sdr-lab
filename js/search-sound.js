/* ═══════════════════════════════════════════
   SDR KIDS LAB — SEARCH ENGINE v1.0.0
   Full-text search across all module content
   ═══════════════════════════════════════════ */

const SDRSearch = (() => {
  let index = [];

  function buildIndex() {
    index = [];
    const modules = SDRModules.getAll();
    const levels = ['newb', 'explorer', 'developer'];

    modules.forEach(m => {
      // Index module metadata
      index.push({
        moduleId: m.id,
        moduleNum: m.num,
        moduleName: m.name,
        text: `${m.name} ${m.description} ${m.narrative}`.toLowerCase(),
        type: 'module',
        icon: m.icon,
      });

      // Index module content if available
      const content = ModuleContent ? ModuleContent.get(m.id) : null;
      if (!content) return;

      levels.forEach(level => {
        const sections = content.sections?.[level] || [];
        sections.forEach(section => {
          const sectionText = [
            section.title || '',
            section.content || '',
            section.items ? section.items.map(i => `${i.title || ''} ${i.description || ''}`).join(' ') : '',
            section.rows ? section.rows.map(r => r.join(' ')).join(' ') : '',
          ].join(' ').replace(/<[^>]*>/g, '').toLowerCase();

          if (sectionText.trim()) {
            index.push({
              moduleId: m.id,
              moduleNum: m.num,
              moduleName: m.name,
              text: sectionText,
              title: (section.title || '').replace(/<[^>]*>/g, ''),
              type: 'section',
              level,
              icon: m.icon,
            });
          }
        });

        // Index quiz questions
        const quiz = content.quiz?.[level] || [];
        quiz.forEach(q => {
          index.push({
            moduleId: m.id,
            moduleNum: m.num,
            moduleName: m.name,
            text: `${q.question} ${q.options.join(' ')}`.toLowerCase(),
            title: q.question,
            type: 'quiz',
            level,
            icon: '❓',
          });
        });
      });

      // Index fun facts
      (content.didYouKnow || []).forEach(fact => {
        index.push({
          moduleId: m.id,
          moduleNum: m.num,
          moduleName: m.name,
          text: fact.toLowerCase(),
          title: fact.substring(0, 60) + '...',
          type: 'fact',
          icon: '💡',
        });
      });
    });
  }

  function search(query) {
    if (!query || query.length < 2) return [];
    if (index.length === 0) buildIndex();

    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
    const results = [];

    index.forEach(entry => {
      let score = 0;
      terms.forEach(term => {
        if (entry.text.includes(term)) {
          score += 1;
          // Boost for title match
          if (entry.title && entry.title.toLowerCase().includes(term)) score += 3;
          // Boost for module name match
          if (entry.moduleName.toLowerCase().includes(term)) score += 2;
        }
      });

      if (score > 0) {
        results.push({ ...entry, score });
      }
    });

    // Sort by score, deduplicate by module
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 15);
  }

  function renderResults(query) {
    const results = search(query);
    if (results.length === 0) {
      return `<div class="search__no-results">No results found for "${query}"</div>`;
    }

    return results.map(r => `
      <div class="search__result" data-route="${r.moduleId}" role="button" tabindex="0">
        <span class="search__result-icon">${r.icon}</span>
        <div class="search__result-info">
          <div class="search__result-title">${r.title || r.moduleName}</div>
          <div class="search__result-meta">Module ${r.moduleNum}: ${r.moduleName}${r.level ? ` · ${r.level}` : ''} · ${r.type}</div>
        </div>
      </div>
    `).join('');
  }

  function attachSearchEvents() {
    const input = document.getElementById('search-input');
    const resultsEl = document.getElementById('search-results');
    const overlay = document.getElementById('search-overlay');
    const closeBtn = document.getElementById('search-close');
    if (!input || !resultsEl) return;

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (overlay) { overlay.hidden = true; overlay.classList.remove('search-overlay--open'); }
      });
    }

    // Click outside to close
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) { overlay.hidden = true; overlay.classList.remove('search-overlay--open'); }
      });
    }

    let timeout;
    input.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const q = input.value.trim();
        resultsEl.innerHTML = q.length >= 2 ? renderResults(q) : '';
        // Attach click events to results
        resultsEl.querySelectorAll('.search__result').forEach(el => {
          el.addEventListener('click', () => {
            const route = el.dataset.route;
            if (route) {
              if (overlay) { overlay.hidden = true; overlay.classList.remove('search-overlay--open'); }
              input.value = '';
              resultsEl.innerHTML = '';
              SDRRouter.navigate(route);
            }
          });
        });
      }, 200);
    });
  }

  return { buildIndex, search, renderResults, attachSearchEvents };
})();


/* ═══════════════════════════════════════════
   SDR KIDS LAB — SOUND ENGINE v1.0.0
   Web Audio API sound effects
   ═══════════════════════════════════════════ */

const SDRSound = (() => {
  let ctx = null;
  let enabled = true;

  function init() {
    enabled = SDRSettings.get('sound') !== false;
  }

  function getCtx() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } 
      catch (e) { return null; }
    }
    return ctx;
  }

  function play(type) {
    if (!enabled) return;
    const ac = getCtx();
    if (!ac) return;

    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);

    const now = ac.currentTime;
    gain.gain.setValueAtTime(0.15, now);

    switch (type) {
      case 'click':
        osc.frequency.setValueAtTime(800, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
        break;
      case 'correct':
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(784, now + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now); osc.stop(now + 0.35);
        break;
      case 'wrong':
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(200, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
        break;
      case 'levelup':
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554, now + 0.1);
        osc.frequency.setValueAtTime(659, now + 0.2);
        osc.frequency.setValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now); osc.stop(now + 0.5);
        break;
      case 'badge':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.setValueAtTime(880, now + 0.15);
        osc.frequency.setValueAtTime(1100, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now); osc.stop(now + 0.45);
        break;
      case 'navigate':
        osc.frequency.setValueAtTime(600, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
        break;
    }
  }

  function setEnabled(val) { enabled = val; }

  return { init, play, setEnabled };
})();

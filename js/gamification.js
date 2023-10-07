/* ═══════════════════════════════════════════
   SDR KIDS LAB — GAMIFICATION ENGINE v1.0.0
   XP, Badges, Progress, Certificates
   ═══════════════════════════════════════════ */

const SDRProgress = (() => {
  /* ── STATE ── */
  let state = {
    xp: 0,
    level: 1,
    modulesCompleted: {},  // { 'module-0': { newb: true, explorer: false, developer: false } }
    quizScores: {},        // { 'module-0-newb': { correct: 2, total: 3 } }
    badges: [],            // ['first-module', 'quiz-master', ...]
    challengesCompleted: {},
    totalQuizCorrect: 0,
    totalQuizAttempted: 0,
    firstVisit: null,
    lastActivity: null,
  };

  /* ── XP TABLE ── */
  const XP_REWARDS = {
    moduleView: 10,
    quizCorrect: 25,
    quizComplete: 50,
    challengeComplete: 100,
    moduleComplete: 200,
    badgeEarned: 150,
  };

  const LEVELS = [
    { level: 1, xpNeeded: 0, title: 'Radio Rookie' },
    { level: 2, xpNeeded: 200, title: 'Signal Seeker' },
    { level: 3, xpNeeded: 500, title: 'Wave Watcher' },
    { level: 4, xpNeeded: 1000, title: 'Frequency Friend' },
    { level: 5, xpNeeded: 1800, title: 'Spectrum Scout' },
    { level: 6, xpNeeded: 2800, title: 'Antenna Ace' },
    { level: 7, xpNeeded: 4000, title: 'Modulation Master' },
    { level: 8, xpNeeded: 5500, title: 'SDR Scientist' },
    { level: 9, xpNeeded: 7500, title: 'Radio Guardian' },
    { level: 10, xpNeeded: 10000, title: 'RF Legend ★' },
  ];

  /* ── BADGES ── */
  const BADGE_DEFS = {
    'first-module': { icon: '🌟', name: 'First Steps', desc: 'Complete your first module' },
    'theory-complete': { icon: '📚', name: 'Theory Master', desc: 'Complete Modules 0-6' },
    'hardware-complete': { icon: '🔧', name: 'Hardware Hero', desc: 'Complete Modules 7-10' },
    'all-modules': { icon: '🏆', name: 'SDR Champion', desc: 'Complete all 15 modules' },
    'quiz-perfect': { icon: '💯', name: 'Perfect Score', desc: 'Get 100% on any quiz' },
    'quiz-streak-5': { icon: '🔥', name: 'On Fire!', desc: 'Get 5 quiz answers correct in a row' },
    'quiz-master': { icon: '🧠', name: 'Quiz Master', desc: 'Answer 50 quiz questions correctly' },
    'explorer-mode': { icon: '🟡', name: 'Explorer Unlocked', desc: 'Complete any module at Explorer level' },
    'developer-mode': { icon: '🔴', name: 'Developer Unlocked', desc: 'Complete any module at Developer level' },
    'radio-historian': { icon: '📜', name: 'Radio Historian', desc: 'Complete Module 1 at any level' },
    'antenna-builder': { icon: '📡', name: 'Antenna Builder', desc: 'Complete Module 5 at any level' },
    'signal-decoder': { icon: '🔓', name: 'Signal Decoder', desc: 'Complete Module 11 at any level' },
    'ethical-guardian': { icon: '🛡️', name: 'Ethical Guardian', desc: 'Complete Module 13 at any level' },
    'challenge-5': { icon: '⭐', name: 'Challenge Accepted', desc: 'Complete 5 challenges' },
    'dedication': { icon: '📅', name: 'Dedicated Learner', desc: 'Use SDR Kids Lab on 3 different days' },
  };

  /* ── INIT ── */
  async function init() {
    try {
      const saved = await SDRStorage.get('settings', 'progress');
      if (saved) {
        state = { ...state, ...saved };
      }
      if (!state.firstVisit) {
        state.firstVisit = new Date().toISOString();
      }
      state.lastActivity = new Date().toISOString();
      await save();
    } catch (e) {
      console.warn('Progress init:', e);
    }
  }

  async function save() {
    try {
      await SDRStorage.set('settings', 'progress', state);
    } catch (e) { /* silent */ }
  }

  /* ── XP ── */
  function addXP(amount, reason) {
    state.xp += amount;
    const oldLevel = state.level;
    // Recalculate level
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (state.xp >= LEVELS[i].xpNeeded) {
        state.level = LEVELS[i].level;
        break;
      }
    }
    if (state.level > oldLevel) {
      showNotification(`🎉 Level Up! You're now Level ${state.level}: ${getLevelTitle()}!`, 'levelup');
    }
    save();
    updateUI();
    return amount;
  }

  function getLevelTitle() {
    const l = LEVELS.find(l => l.level === state.level);
    return l ? l.title : 'Radio Rookie';
  }

  function getXPForNext() {
    const next = LEVELS.find(l => l.level === state.level + 1);
    if (!next) return { current: state.xp, needed: state.xp, percent: 100 };
    const prev = LEVELS.find(l => l.level === state.level);
    const range = next.xpNeeded - prev.xpNeeded;
    const progress = state.xp - prev.xpNeeded;
    return { current: state.xp, needed: next.xpNeeded, percent: Math.min(100, (progress / range) * 100) };
  }

  /* ── MODULE PROGRESS ── */
  function markModuleViewed(moduleId) {
    const diffLevel = SDRSettings.get('level');
    if (!state.modulesCompleted[moduleId]) {
      state.modulesCompleted[moduleId] = {};
    }
    if (!state.modulesCompleted[moduleId][diffLevel]) {
      state.modulesCompleted[moduleId][diffLevel] = true;
      addXP(XP_REWARDS.moduleView, `Viewed ${moduleId} at ${diffLevel}`);
      checkBadges(moduleId, diffLevel);
    }
    state.lastActivity = new Date().toISOString();
    save();
  }

  function markModuleComplete(moduleId) {
    const diffLevel = SDRSettings.get('level');
    if (!state.modulesCompleted[moduleId]) {
      state.modulesCompleted[moduleId] = {};
    }
    if (!state.modulesCompleted[moduleId][`${diffLevel}_complete`]) {
      state.modulesCompleted[moduleId][`${diffLevel}_complete`] = true;
      addXP(XP_REWARDS.moduleComplete, `Completed ${moduleId}`);
    }
    save();
  }

  /* ── QUIZ ── */
  function recordQuizAnswer(moduleId, questionIdx, isCorrect) {
    const diffLevel = SDRSettings.get('level');
    const key = `${moduleId}-${diffLevel}`;
    if (!state.quizScores[key]) {
      state.quizScores[key] = { correct: 0, total: 0, answers: {} };
    }
    // Only count first attempt per question
    if (state.quizScores[key].answers[questionIdx] !== undefined) return;
    
    state.quizScores[key].answers[questionIdx] = isCorrect;
    state.quizScores[key].total++;
    state.totalQuizAttempted++;
    
    if (isCorrect) {
      state.quizScores[key].correct++;
      state.totalQuizCorrect++;
      addXP(XP_REWARDS.quizCorrect, 'Quiz correct');
    }
    
    // Check for quiz-related badges
    if (state.totalQuizCorrect >= 50) awardBadge('quiz-master');
    
    // Check perfect score
    const moduleQuizzes = ModuleContent ? ModuleContent.get(moduleId) : null;
    if (moduleQuizzes) {
      const quiz = moduleQuizzes.quiz?.[diffLevel];
      if (quiz && state.quizScores[key].total === quiz.length && state.quizScores[key].correct === quiz.length) {
        awardBadge('quiz-perfect');
        addXP(XP_REWARDS.quizComplete, 'Perfect quiz');
      }
    }
    save();
    updateUI();
  }

  /* ── CHALLENGES ── */
  function markChallengeComplete(moduleId) {
    const diffLevel = SDRSettings.get('level');
    const key = `${moduleId}-${diffLevel}`;
    if (!state.challengesCompleted[key]) {
      state.challengesCompleted[key] = true;
      addXP(XP_REWARDS.challengeComplete, `Challenge ${moduleId}`);
      const count = Object.keys(state.challengesCompleted).length;
      if (count >= 5) awardBadge('challenge-5');
    }
    save();
  }

  /* ── BADGES ── */
  function awardBadge(badgeId) {
    if (state.badges.includes(badgeId)) return;
    state.badges.push(badgeId);
    const def = BADGE_DEFS[badgeId];
    if (def) {
      addXP(XP_REWARDS.badgeEarned, `Badge: ${def.name}`);
      showNotification(`${def.icon} Badge Earned: ${def.name}!`, 'badge');
    }
    save();
    updateUI();
  }

  function checkBadges(moduleId, diffLevel) {
    // First module
    if (Object.keys(state.modulesCompleted).length === 1) awardBadge('first-module');
    
    // Specific module badges
    if (moduleId === 'module-1') awardBadge('radio-historian');
    if (moduleId === 'module-5') awardBadge('antenna-builder');
    if (moduleId === 'module-11') awardBadge('signal-decoder');
    if (moduleId === 'module-13') awardBadge('ethical-guardian');
    
    // Level badges
    if (diffLevel === 'explorer') awardBadge('explorer-mode');
    if (diffLevel === 'developer') awardBadge('developer-mode');
    
    // Category completion
    const completed = Object.keys(state.modulesCompleted);
    const theory = ['module-0','module-1','module-2','module-3','module-4','module-5','module-6'];
    const hardware = ['module-7','module-8','module-9','module-10'];
    if (theory.every(m => completed.includes(m))) awardBadge('theory-complete');
    if (hardware.every(m => completed.includes(m))) awardBadge('hardware-complete');
    if (completed.length >= 15) awardBadge('all-modules');
    
    // Dedication (3 different days)
    const days = new Set();
    days.add(state.firstVisit?.substring(0, 10));
    days.add(state.lastActivity?.substring(0, 10));
    days.add(new Date().toISOString().substring(0, 10));
    if (days.size >= 3) awardBadge('dedication');
  }

  /* ── NOTIFICATIONS ── */
  function showNotification(message, type = 'info') {
    const existing = document.querySelector('.sdr-notification');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = `sdr-notification sdr-notification--${type}`;
    el.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(el);
    
    requestAnimationFrame(() => el.classList.add('sdr-notification--show'));
    setTimeout(() => {
      el.classList.remove('sdr-notification--show');
      setTimeout(() => el.remove(), 400);
    }, 3500);
  }

  /* ── UI UPDATE ── */
  function updateUI() {
    // Update XP bar in sidebar
    const xpBar = document.getElementById('xp-bar');
    const xpText = document.getElementById('xp-text');
    const levelBadge = document.getElementById('player-level');
    
    if (xpBar) {
      const progress = getXPForNext();
      xpBar.style.width = `${progress.percent}%`;
    }
    if (xpText) {
      xpText.textContent = `${state.xp} XP — Level ${state.level}`;
    }
    if (levelBadge) {
      levelBadge.textContent = `⭐ ${getLevelTitle()}`;
    }

    // Update module completion indicators in sidebar
    document.querySelectorAll('.sidebar__module-item').forEach(item => {
      const route = item.dataset.route;
      if (state.modulesCompleted[route]) {
        item.classList.add('sidebar__module-item--visited');
      }
    });
  }

  /* ── STATS ── */
  function getStats() {
    const modulesViewed = Object.keys(state.modulesCompleted).length;
    return {
      xp: state.xp,
      level: state.level,
      levelTitle: getLevelTitle(),
      modulesViewed,
      modulesTotal: 15,
      percentComplete: Math.round((modulesViewed / 15) * 100),
      quizCorrect: state.totalQuizCorrect,
      quizAttempted: state.totalQuizAttempted,
      quizAccuracy: state.totalQuizAttempted > 0 ? Math.round((state.totalQuizCorrect / state.totalQuizAttempted) * 100) : 0,
      badges: state.badges.map(id => ({ id, ...BADGE_DEFS[id] })),
      badgesTotal: Object.keys(BADGE_DEFS).length,
      challengesCompleted: Object.keys(state.challengesCompleted).length,
      firstVisit: state.firstVisit,
      lastActivity: state.lastActivity,
    };
  }

  /* ── CERTIFICATE ── */
  function generateCertificate(studentName) {
    const stats = getStats();
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return `
      <div class="certificate" id="certificate">
        <div class="certificate__border">
          <div class="certificate__header">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>
          <h1 class="certificate__title">📡 Certificate of Achievement</h1>
          <h2 class="certificate__subtitle">SDR Kids Lab</h2>
          <p class="certificate__text">This certifies that</p>
          <h2 class="certificate__name">${studentName || 'Radio Explorer'}</h2>
          <p class="certificate__text">has successfully explored the world of Software Defined Radio</p>
          <div class="certificate__stats">
            <div>⭐ Level ${stats.level}: ${stats.levelTitle}</div>
            <div>📡 ${stats.modulesViewed}/${stats.modulesTotal} Modules</div>
            <div>🧠 ${stats.quizCorrect} Quiz Questions Correct</div>
            <div>🏅 ${stats.badges.length} Badges Earned</div>
            <div>✨ ${stats.xp} XP Total</div>
          </div>
          <p class="certificate__date">${date}</p>
          <div class="certificate__badges">${stats.badges.map(b => `<span title="${b.name}">${b.icon}</span>`).join(' ')}</div>
          <div class="certificate__print" style="margin-top:1rem">
            <button class="btn btn--outline btn--sm" onclick="(function(){var c=document.getElementById('certificate');var w=window.open('','','width=800,height=600');w.document.write('<html><head><title>SDR Kids Lab Certificate</title><style>body{font-family:serif;text-align:center;padding:2rem}.certificate__border{border:4px double #b8860b;border-radius:16px;padding:3rem}.certificate__title{font-size:1.8rem;color:#b8860b}.certificate__name{font-size:2rem;font-style:italic}.certificate__stats{display:flex;flex-wrap:wrap;justify-content:center;gap:1rem;margin:1.5rem 0}.certificate__header{color:#b8860b}.certificate__date{color:#888}.certificate__badges{font-size:1.8rem}</style></head><body>'+c.innerHTML+'</body></html>');w.document.close();w.print();})()">🖨️ Print Certificate</button>
          </div>
        </div>
      </div>
    `;
  }

  /* ── RENDER PROGRESS PAGE ── */
  function renderProgressPage() {
    const stats = getStats();
    const xpNext = getXPForNext();
    
    return `
      <div class="progress-page">
        <h2 class="progress-page__title">📊 Your Progress</h2>
        
        <div class="progress-page__card">
          <div class="progress-page__level">
            <span class="progress-page__level-num">Level ${stats.level}</span>
            <span class="progress-page__level-title">${stats.levelTitle}</span>
          </div>
          <div class="progress-page__xp-bar-container">
            <div class="progress-page__xp-bar" style="width:${xpNext.percent}%"></div>
          </div>
          <div class="progress-page__xp-text">${stats.xp} / ${xpNext.needed} XP</div>
        </div>

        <div class="progress-page__grid">
          <div class="progress-page__stat">
            <div class="progress-page__stat-num">${stats.modulesViewed}</div>
            <div class="progress-page__stat-label">Modules Explored</div>
          </div>
          <div class="progress-page__stat">
            <div class="progress-page__stat-num">${stats.quizAccuracy}%</div>
            <div class="progress-page__stat-label">Quiz Accuracy</div>
          </div>
          <div class="progress-page__stat">
            <div class="progress-page__stat-num">${stats.badges.length}</div>
            <div class="progress-page__stat-label">Badges</div>
          </div>
          <div class="progress-page__stat">
            <div class="progress-page__stat-num">${stats.challengesCompleted}</div>
            <div class="progress-page__stat-label">Challenges</div>
          </div>
        </div>

        <h3>🏅 Badges (${stats.badges.length}/${stats.badgesTotal})</h3>
        <div class="progress-page__badges">
          ${Object.entries(BADGE_DEFS).map(([id, def]) => {
            const earned = stats.badges.find(b => b.id === id);
            return `<div class="progress-page__badge ${earned ? 'progress-page__badge--earned' : 'progress-page__badge--locked'}">
              <span class="progress-page__badge-icon">${earned ? def.icon : '🔒'}</span>
              <span class="progress-page__badge-name">${def.name}</span>
              <span class="progress-page__badge-desc">${def.desc}</span>
            </div>`;
          }).join('')}
        </div>

        <h3>🎓 Certificate</h3>
        <div class="progress-page__cert-section">
          <p>Enter your name to generate a personalized certificate!</p>
          <input type="text" id="cert-name" class="progress-page__cert-input" placeholder="Your name..." maxlength="40">
          <button class="btn btn--primary" id="gen-cert-btn">Generate Certificate</button>
          <a href="help/certificate.html" target="_blank" class="btn btn--outline" style="margin-left:0.5rem">🖨️ Printable Version</a>
        </div>
        <div id="cert-container"></div>
      </div>
    `;
  }

  return {
    init, getStats, addXP, getLevelTitle, getXPForNext,
    markModuleViewed, markModuleComplete, recordQuizAnswer,
    markChallengeComplete, awardBadge, showNotification,
    updateUI, generateCertificate, renderProgressPage,
    BADGE_DEFS,
  };
})();

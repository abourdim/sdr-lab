/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE CONTENT ENGINE v0.3.0
   Renders level-aware module content
   ═══════════════════════════════════════════ */

const ModuleContent = (() => {
  const registry = {};

  /* ── H: BILINGUAL KEY TERMS (Arabic + French) ── */
  const BILINGUAL = {
    'module-0':  { ar: 'مرحباً بكم في عالم الراديو!', fr: 'Bienvenue dans le monde de la radio !' },
    'module-1':  { ar: 'تاريخ الراديو والأبطال', fr: 'Histoire de la radio et ses héros' },
    'module-2':  { ar: 'موجات الراديو — الطيف الكهرومغناطيسي', fr: 'Ondes radio — le spectre électromagnétique' },
    'module-3':  { ar: 'الراديو المُعرَّف بالبرمجيات', fr: 'Radio définie par logiciel (SDR)' },
    'module-4':  { ar: 'التردد والطيف — تحويل فورييه', fr: 'Fréquence et spectre — transformée de Fourier' },
    'module-5':  { ar: 'مختبر الهوائيات — بناء هوائي ثنائي القطب', fr: "Laboratoire d'antennes — construire un dipôle" },
    'module-6':  { ar: 'التعديل وإزالة التعديل', fr: 'Modulation et démodulation' },
    'module-7':  { ar: 'مختبر مايكروبت — أول تجربة راديو', fr: 'Labo micro:bit — première expérience radio' },
    'module-8':  { ar: 'لورا — الاتصال بعيد المدى', fr: 'LoRa — communication longue portée' },
    'module-9':  { ar: 'مختبر RTL-SDR — استقبال العالم', fr: 'Labo RTL-SDR — écouter le monde' },
    'module-10': { ar: 'هاك آر إف — الإرسال والاستقبال', fr: 'HackRF One — émission et réception' },
    'module-11': { ar: 'فك تشفير الإشارات', fr: 'Décodage des signaux' },
    'module-12': { ar: 'إنترنت الأشياء والبروتوكولات اللاسلكية', fr: "Protocoles IoT et communication sans fil" },
    'module-13': { ar: 'الأمان والأخلاقيات — كن حارساً مسؤولاً', fr: 'Sécurité et éthique — soyez un gardien responsable' },
    'module-14': { ar: 'المشروع النهائي — بناء محطة SDR', fr: 'Projet final — construire une station SDR' },
  };

  function getBilingualTerms(moduleId) {
    return BILINGUAL[moduleId] || null;
  }

  /* ── REGISTER MODULE ── */
  function register(moduleId, contentDef) {
    registry[moduleId] = contentDef;
  }

  /* ── GET CONTENT ── */
  function get(moduleId, level) {
    const def = registry[moduleId];
    if (!def) return null;
    return {
      ...def,
      sections: def.sections?.[level] || def.sections?.newb || [],
      quiz: def.quiz?.[level] || def.quiz?.newb || [],
    };
  }

  /* ── RENDER MODULE PAGE ── */
  function render(moduleId, container, level) {
    const content = get(moduleId, level);
    if (!content || !container) return;

    let html = '';

    // Narrative intro
    if (content.narrative) {
      const bilingualTerms = getBilingualTerms(moduleId);
      const bilingualHTML = bilingualTerms
        ? `<div class="mc-bilingual">
            <span class="mc-bilingual__ar">${bilingualTerms.ar}</span>
            <span class="mc-bilingual__fr">${bilingualTerms.fr}</span>
          </div>` : '';
      html += `<div class="mc-narrative">
        <div class="mc-narrative__avatar">🧑‍🚀</div>
        <div class="mc-narrative__bubble">
          <strong>Mouhammed says:</strong> "${content.narrative[level] || content.narrative.newb}"
          ${bilingualHTML}
        </div>
      </div>`;
    }

    // Sections
    for (const section of (content.sections || [])) {
      html += renderSection(section);
    }

    // Did you know?
    if (content.didYouKnow) {
      const fact = content.didYouKnow[Math.floor(Math.random() * content.didYouKnow.length)];
      html += `<div class="mc-fact">
        <span class="mc-fact__icon">🤔</span>
        <div><strong>Did you know?</strong> ${fact}</div>
      </div>`;
    }

    // Key Takeaways
    if (content.takeaways?.length) {
      html += `<div class="mc-takeaways">
        <h3 class="mc-takeaways__title">📌 Key Takeaways</h3>
        <ul class="mc-takeaways__list">
          ${content.takeaways.map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>`;
    }

    // Quiz — content.quiz is already flattened to array by get()
    if (content.quiz?.length) {
      html += renderQuiz(content.quiz, moduleId);
    }

    // Challenge
    if (content.challenge?.[level]) {
      html += `<div class="mc-challenge">
        <span class="mc-challenge__icon">🏆</span>
        <div>
          <strong>Challenge:</strong> ${content.challenge[level]}
          <div style="margin-top:0.75rem">
            <button class="btn btn--outline btn--sm mc-challenge__done" data-module="${moduleId}">✅ I completed this challenge!</button>
          </div>
        </div>
      </div>`;
    }

    // Module complete button + worksheet link
    const moduleNum = moduleId.replace('module-', '').padStart(2, '0');
    html += `<div class="mc-complete">
      <button class="btn btn--primary mc-complete__btn" data-module="${moduleId}">🎓 Mark Module as Complete</button>
      <a href="worksheets/worksheet-${moduleNum}.html" target="_blank" class="mc-worksheet-link">📝 Print Worksheet for this Module</a>
    </div>`;

    container.innerHTML = html;

    // Wire up interactive elements
    wireInteractions(container, moduleId);
  }

  /* ── RENDER SECTION ── */
  function renderSection(section) {
    let html = `<div class="mc-section" data-type="${section.type || 'text'}">`;

    if (section.title) {
      html += `<h3 class="mc-section__title">${section.title}</h3>`;
    }

    switch (section.type) {
      case 'text':
        html += `<div class="mc-section__text">${section.content}</div>`;
        break;

      case 'analogy':
        html += `<div class="mc-analogy">
          <span class="mc-analogy__icon">${section.icon || '💡'}</span>
          <div class="mc-analogy__text">${section.content}</div>
        </div>`;
        break;

      case 'diagram':
        html += `<div class="mc-diagram">${section.content}</div>`;
        break;

      case 'code':
        html += `<pre class="mc-code"><code>${section.content}</code></pre>`;
        break;

      case 'table':
        html += renderTable(section);
        break;

      case 'timeline':
        html += renderTimeline(section.items);
        break;

      case 'cards':
        html += renderCards(section.items);
        break;

      case 'simulator':
        html += `<div class="mc-sim-wrap">
          ${section.title ? `<h3 class="mc-sim-wrap__title">${section.title}</h3>` : ''}
          <div class="mc-sim-embed" id="${section.simId || 'sim-embed'}" 
                      data-sim-type="${section.simType}" 
                      data-sim-config='${JSON.stringify(section.simConfig || {})}'>
          </div>
          ${renderSimControls(section.simType, section.simId || 'sim-embed')}
        </div>`;
        break;

      case 'steps':
        html += renderSteps(section.items);
        break;

      case 'warning':
        html += `<div class="mc-warning">
          <span class="mc-warning__icon">⚠️</span>
          <div>${section.content}</div>
        </div>`;
        break;

      case 'info':
        html += `<div class="mc-info">
          <span class="mc-info__icon">ℹ️</span>
          <div>${section.content}</div>
        </div>`;
        break;

      default:
        html += `<div>${section.content || ''}</div>`;
    }

    html += '</div>';
    return html;
  }

  function renderTable(section) {
    let html = '<div class="mc-table-wrap"><table class="mc-table">';
    if (section.headers) {
      html += '<thead><tr>' + section.headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead>';
    }
    if (section.rows) {
      html += '<tbody>' + section.rows.map(row =>
        '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>'
      ).join('') + '</tbody>';
    }
    html += '</table></div>';
    return html;
  }

  function renderTimeline(items) {
    return `<div class="mc-timeline">${items.map((item, i) => `
      <div class="mc-timeline__item">
        <div class="mc-timeline__marker">${item.year || (i + 1)}</div>
        <div class="mc-timeline__content">
          <strong>${item.title}</strong>
          <p>${item.description}</p>
        </div>
      </div>
    `).join('')}</div>`;
  }

  function renderCards(items) {
    return `<div class="mc-cards">${items.map(item => `
      <div class="mc-card">
        <div class="mc-card__icon">${item.icon || '📦'}</div>
        <h4 class="mc-card__title">${item.title}</h4>
        <p class="mc-card__text">${item.description}</p>
      </div>
    `).join('')}</div>`;
  }

  function renderSteps(items) {
    return `<div class="mc-steps">${items.map((item, i) => `
      <div class="mc-step">
        <div class="mc-step__num">${i + 1}</div>
        <div class="mc-step__content">
          <strong>${item.title}</strong>
          <p>${item.description}</p>
        </div>
      </div>
    `).join('')}</div>`;
  }

  /* ── SIM CONTROLS (type-specific) ── */
  function renderSimControls(simType, simId) {
    const common = `<button class="mc-sim-controls__btn" data-action="play" title="Play/Pause">▶️</button>`;
    const reset = `<button class="mc-sim-controls__btn" data-action="reset" title="Reset">🔄</button>`;

    let specific = '';
    switch (simType) {
      case 'spectrum':
        specific = `
          <label class="mc-sim-controls__slider-wrap">
            <span class="mc-sim-controls__label">Center</span>
            <input type="range" class="mc-sim-controls__slider" data-param="freq" min="0" max="100" value="50">
          </label>
          <label class="mc-sim-controls__slider-wrap">
            <span class="mc-sim-controls__label">Noise</span>
            <input type="range" class="mc-sim-controls__slider" data-param="gain" min="0" max="100" value="70">
          </label>
          <button class="mc-sim-controls__btn" data-action="addSignal" title="Add random signal">➕ Signal</button>`;
        break;
      case 'modulation':
        specific = `
          <label class="mc-sim-controls__slider-wrap">
            <span class="mc-sim-controls__label">Msg Hz</span>
            <input type="range" class="mc-sim-controls__slider" data-param="msgFreq" min="1" max="100" value="20">
          </label>
          <label class="mc-sim-controls__slider-wrap">
            <span class="mc-sim-controls__label">Depth</span>
            <input type="range" class="mc-sim-controls__slider" data-param="depth" min="0" max="100" value="80">
          </label>
          <button class="mc-sim-controls__btn" data-action="cycleType" title="Switch modulation type">🔄 AM/FM/PM</button>`;
        break;
      case 'antenna':
        specific = `
          <label class="mc-sim-controls__slider-wrap">
            <span class="mc-sim-controls__label">Freq MHz</span>
            <input type="range" class="mc-sim-controls__slider" data-param="antennaFreq" min="1" max="100" value="50">
          </label>
          <label class="mc-sim-controls__slider-wrap">
            <span class="mc-sim-controls__label">Elements</span>
            <input type="range" class="mc-sim-controls__slider" data-param="elements" min="1" max="8" value="2">
          </label>
          <button class="mc-sim-controls__btn" data-action="cycleAntennaType" title="Switch antenna type">📡 Type</button>`;
        break;
      case 'range':
        specific = `
          <label class="mc-sim-controls__slider-wrap">
            <span class="mc-sim-controls__label">Power dBm</span>
            <input type="range" class="mc-sim-controls__slider" data-param="txPower" min="0" max="100" value="50">
          </label>
          <label class="mc-sim-controls__slider-wrap">
            <span class="mc-sim-controls__label">Freq MHz</span>
            <input type="range" class="mc-sim-controls__slider" data-param="rangeFreq" min="0" max="100" value="30">
          </label>`;
        break;
      default:
        specific = '';
    }

    return `<div class="mc-sim-controls" data-sim-id="${simId}" data-sim-type="${simType}">
      ${common}${specific}${reset}
    </div>`;
  }

  /* ── QUIZ RENDERER ── */
  function renderQuiz(questions, moduleId) {
    let html = `<div class="mc-quiz" id="quiz-${moduleId}">
      <h3 class="mc-quiz__title">🧠 Check Your Understanding</h3>`;

    questions.forEach((q, qi) => {
      const correctText = q.options[q.correct] || '';
      const explanation = q.explanation || '';
      html += `<div class="mc-quiz__q" data-qi="${qi}" data-correct-text="${correctText.replace(/"/g, '&quot;')}" data-explanation="${explanation.replace(/"/g, '&quot;')}">
        <p class="mc-quiz__question"><strong>Q${qi + 1}:</strong> ${q.question}</p>
        <div class="mc-quiz__options">`;

      q.options.forEach((opt, oi) => {
        html += `<button class="mc-quiz__option" data-qi="${qi}" data-oi="${oi}" data-correct="${oi === q.correct}">${opt}</button>`;
      });

      html += `</div>
        <div class="mc-quiz__feedback" id="feedback-${moduleId}-${qi}" hidden></div>
      </div>`;
    });

    html += '</div>';
    return html;
  }

  /* ── WIRE INTERACTIONS ── */
  function wireInteractions(container, moduleId) {
    // Quiz answers
    container.querySelectorAll('.mc-quiz__option').forEach(btn => {
      btn.addEventListener('click', () => {
        const qi = btn.dataset.qi;
        const isCorrect = btn.dataset.correct === 'true';
        const feedback = document.getElementById(`feedback-${moduleId}-${qi}`);
        const parent = btn.closest('.mc-quiz__q');
        const correctText = parent.dataset.correctText || '';
        const explanation = parent.dataset.explanation || '';

        // Disable all options in this question
        parent.querySelectorAll('.mc-quiz__option').forEach(b => {
          b.disabled = true;
          if (b.dataset.correct === 'true') b.classList.add('mc-quiz__option--correct');
        });

        if (isCorrect) {
          btn.classList.add('mc-quiz__option--correct');
          if (feedback) {
            feedback.hidden = false;
            feedback.className = 'mc-quiz__feedback mc-quiz__feedback--correct';
            feedback.innerHTML = `✅ Correct!${explanation ? ' ' + explanation : ''}`;
          }
          // Gamification + Sound
          if (typeof SDRProgress !== 'undefined') SDRProgress.recordQuizAnswer(moduleId, qi, true);
          if (typeof SDRSound !== 'undefined') SDRSound.play('correct');
        } else {
          btn.classList.add('mc-quiz__option--wrong');
          if (feedback) {
            feedback.hidden = false;
            feedback.className = 'mc-quiz__feedback mc-quiz__feedback--wrong';
            feedback.innerHTML = `❌ The correct answer is: <strong>${correctText}</strong>${explanation ? '<br>' + explanation : ''}`;
          }
          if (typeof SDRProgress !== 'undefined') SDRProgress.recordQuizAnswer(moduleId, qi, false);
          if (typeof SDRSound !== 'undefined') SDRSound.play('wrong');
        }
      });
    });

    // Simulator embeds
    container.querySelectorAll('.mc-sim-embed').forEach(embed => {
      const simType = embed.dataset.simType;
      const config = JSON.parse(embed.dataset.simConfig || '{}');
      initSimEmbed(embed, simType, config);
    });

    // Simulator controls — type-specific wiring
    container.querySelectorAll('.mc-sim-controls').forEach(ctrl => {
      const simId = ctrl.dataset.simId;
      const simType = ctrl.dataset.simType;
      const embed = document.getElementById(simId);
      if (!embed || !embed._sim) return;
      const sim = embed._sim;

      ctrl.querySelectorAll('.mc-sim-controls__btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.action;
          if (action === 'play') {
            if (sim.running) { sim.stop?.(); btn.textContent = '▶️'; }
            else { sim.start?.(); btn.textContent = '⏸️'; }
          }
          if (action === 'reset') {
            if (sim.clearSignals) sim.clearSignals();
            if (sim.render) sim.render();
          }
          // Spectrum: add random signal
          if (action === 'addSignal' && sim.addSignal) {
            const freq = sim.opts?.minFreq || 88e6;
            const range = (sim.opts?.maxFreq || 108e6) - freq;
            sim.addSignal({ freq: freq + Math.random() * range, power: -30 - Math.random() * 30 });
          }
          // Modulation: cycle type
          if (action === 'cycleType' && sim.setType) {
            const types = ['AM', 'FM', 'PM'];
            const cur = types.indexOf(sim.type || 'AM');
            sim.setType(types[(cur + 1) % types.length]);
          }
          // Antenna: cycle type
          if (action === 'cycleAntennaType' && sim.setAntennaType) {
            const types = ['dipole', 'yagi', 'patch', 'loop'];
            const cur = types.indexOf(sim.antennaType || 'dipole');
            sim.setAntennaType(types[(cur + 1) % types.length]);
            if (sim.render) sim.render();
          }
        });
      });

      ctrl.querySelectorAll('.mc-sim-controls__slider').forEach(slider => {
        slider.addEventListener('input', () => {
          const param = slider.dataset.param;
          const val = parseInt(slider.value);
          // Spectrum controls
          if (param === 'freq' && sim.opts && simType === 'spectrum') {
            const range = (sim.opts.maxFreq || 108e6) - (sim.opts.minFreq || 88e6);
            sim.opts.centerFreq = (sim.opts.minFreq || 88e6) + (val / 100) * range;
          }
          if (param === 'gain' && sim.opts && simType === 'spectrum') {
            sim.opts.noiseFloor = -120 + (val / 100) * 60;
          }
          // Modulation controls
          if (param === 'msgFreq' && sim.setMessageFreq) {
            sim.setMessageFreq(0.5 + (val / 100) * 20);
          }
          if (param === 'depth' && sim.setDepth) {
            sim.setDepth(val / 100);
          }
          // Antenna controls
          if (param === 'antennaFreq' && sim.setFrequency) {
            sim.setFrequency(50 + (val / 100) * 5950); // 50-6000 MHz
            if (sim.render) sim.render();
          }
          if (param === 'elements' && sim.setElements) {
            sim.setElements(val);
            if (sim.render) sim.render();
          }
          // Range controls
          if (param === 'txPower' && sim.opts) {
            sim.opts.txPower = -10 + (val / 100) * 40; // -10 to +30 dBm
            if (sim.render) sim.render();
          }
          if (param === 'rangeFreq' && sim.opts) {
            sim.opts.frequency = 100 + (val / 100) * 5900; // 100-6000 MHz
            if (sim.render) sim.render();
          }
        });
      });
    });

    // Challenge complete button
    container.querySelectorAll('.mc-challenge__done').forEach(btn => {
      btn.addEventListener('click', () => {
        const mid = btn.dataset.module;
        if (typeof SDRProgress !== 'undefined') SDRProgress.markChallengeComplete(mid);
        if (typeof SDRSound !== 'undefined') SDRSound.play('badge');
        btn.textContent = '🏆 Challenge Completed!';
        btn.disabled = true;
        btn.classList.add('btn--completed');
      });
    });

    // Module complete button
    container.querySelectorAll('.mc-complete__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mid = btn.dataset.module;
        if (typeof SDRProgress !== 'undefined') SDRProgress.markModuleComplete(mid);
        if (typeof SDRSound !== 'undefined') SDRSound.play('levelup');
        btn.textContent = '🎓 Module Completed! ✅';
        btn.disabled = true;
        btn.classList.add('btn--completed');
      });
    });
  }

  /* ── INIT SIMULATOR EMBEDS ── */
  function initSimEmbed(container, type, config) {
    try {
      const canvas = document.createElement('canvas');
      container.appendChild(canvas);

      switch (type) {
        case 'spectrum': {
          canvas.className = 'sim-spectrum';
          canvas.style.height = '180px';
          const spec = new SpectrumEngine(canvas, config);
          if (config.signals) config.signals.forEach(s => spec.addSignal(s));
          if (config.scene) SignalLibrary.loadScene(spec, config.scene);
          spec.start();
          container._sim = spec;
          break;
        }
        case 'modulation': {
          canvas.className = 'sim-modulation';
          canvas.style.height = '240px';
          const mod = new ModulationEngine(canvas, config);
          mod.start();
          container._sim = mod;
          break;
        }
        case 'antenna': {
          canvas.className = 'sim-antenna';
          canvas.style.height = '260px';
          canvas.style.width = '260px';
          const ant = new AntennaSimulator(canvas, config);
          ant.render();
          container._sim = ant;
          break;
        }
        case 'range': {
          canvas.className = 'sim-range';
          canvas.style.height = '200px';
          const rng = new RangeCalculator(canvas, config);
          rng.render();
          container._sim = rng;
          break;
        }
      }
    } catch (err) {
      console.warn('Sim embed failed:', type, err);
      container.innerHTML = `<div class="mc-sim-error">
        <span>📡</span> Interactive simulation unavailable.
        <br><small>Visit the Playground for the full simulator experience.</small>
      </div>`;
    }
  }

  return { register, get, render };
})();

window.ModuleContent = ModuleContent;

/* ═══════════════════════════════════════════
   SDR KIDS LAB — LABS ENGINE v0.2.0
   Step-by-step guided lab runner
   ═══════════════════════════════════════════ */

class LabsEngine {
  constructor(containerId) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    this.currentLab = null;
    this.currentStep = 0;
    this.completed = [];
    this._onComplete = null;
    this._onStepChange = null;
  }

  /* ── LAB DEFINITION FORMAT ── */
  /*
    {
      id: 'lab-fm-scan',
      title: 'Scan the FM Band',
      description: 'Use RTL-SDR to find FM radio stations',
      icon: '📻',
      module: 'module-9',
      level: 'newb',
      estimatedTime: '10 min',
      steps: [
        {
          title: 'Step 1: Set Frequency Range',
          instruction: 'Set the frequency range to 88-108 MHz to scan the FM broadcast band.',
          hint: 'FM radio stations broadcast between 88 and 108 MHz.',
          action: 'setFrequency',        // action to verify
          verify: (state) => state.minFreq === 88e6 && state.maxFreq === 108e6,
          illustration: 'spectrum',       // which sim component to show
        },
        ...
      ]
    }
  */

  /* ── LOAD LAB ── */
  load(labDef) {
    this.currentLab = labDef;
    this.currentStep = 0;
    this.render();
  }

  /* ── RENDER ── */
  render() {
    if (!this.container || !this.currentLab) return;
    const lab = this.currentLab;
    const step = lab.steps[this.currentStep];
    const totalSteps = lab.steps.length;
    const progress = ((this.currentStep) / totalSteps) * 100;

    this.container.innerHTML = `
      <div class="lab">
        <div class="lab__header">
          <div class="lab__title-row">
            <span class="lab__icon">${lab.icon}</span>
            <h3 class="lab__title">${lab.title}</h3>
          </div>
          <div class="lab__meta">
            <span class="badge badge--${lab.level}">${lab.level}</span>
            <span class="lab__time">⏱️ ${lab.estimatedTime}</span>
            <span class="lab__progress-text">Step ${this.currentStep + 1} / ${totalSteps}</span>
          </div>
          <div class="lab__progress-bar">
            <div class="lab__progress-fill" style="width: ${progress}%"></div>
          </div>
        </div>

        <div class="lab__step">
          <h4 class="lab__step-title">${step.title}</h4>
          <p class="lab__step-instruction">${step.instruction}</p>
          ${step.hint ? `<div class="lab__hint" id="lab-hint" hidden>
            <span class="lab__hint-icon">💡</span> ${step.hint}
          </div>` : ''}
        </div>

        <div class="lab__sim-area" id="lab-sim-area">
          <!-- Simulation component rendered here by module -->
        </div>

        <div class="lab__actions">
          <button class="btn btn--outline btn--sm" 
                  ${this.currentStep === 0 ? 'disabled' : ''}
                  onclick="window._labEngine?.prevStep()">
            ← Previous
          </button>
          ${step.hint ? `
            <button class="btn btn--outline btn--sm" onclick="window._labEngine?.showHint()">
              💡 Hint
            </button>
          ` : ''}
          <button class="btn btn--primary btn--sm" 
                  onclick="window._labEngine?.nextStep()">
            ${this.currentStep === totalSteps - 1 ? '🏆 Complete Lab' : 'Next →'}
          </button>
        </div>
      </div>
    `;

    // Store reference for onclick handlers
    window._labEngine = this;

    // Notify step change
    if (this._onStepChange) {
      this._onStepChange(this.currentStep, step);
    }
  }

  /* ── NAVIGATION ── */
  nextStep() {
    if (!this.currentLab) return;
    const totalSteps = this.currentLab.steps.length;

    if (this.currentStep < totalSteps - 1) {
      this.currentStep++;
      this.render();
    } else {
      this._completeLab();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
    }
  }

  goToStep(index) {
    if (index >= 0 && index < this.currentLab.steps.length) {
      this.currentStep = index;
      this.render();
    }
  }

  showHint() {
    const hint = document.getElementById('lab-hint');
    if (hint) hint.hidden = false;
  }

  /* ── VERIFICATION ── */
  verifyStep(state) {
    if (!this.currentLab) return false;
    const step = this.currentLab.steps[this.currentStep];
    if (step.verify) {
      return step.verify(state);
    }
    return true;
  }

  /* ── COMPLETION ── */
  _completeLab() {
    if (!this.currentLab) return;

    this.completed.push(this.currentLab.id);

    this.container.innerHTML = `
      <div class="lab lab--complete">
        <div class="lab__complete-icon">🏆</div>
        <h3 class="lab__complete-title">Lab Complete!</h3>
        <p class="lab__complete-text">Great work! You finished: <strong>${this.currentLab.title}</strong></p>
        <div class="lab__complete-actions">
          <button class="btn btn--outline btn--sm" onclick="window._labEngine?.restart()">🔄 Redo Lab</button>
          <button class="btn btn--primary btn--sm" onclick="window._labEngine?.close()">✅ Done</button>
        </div>
      </div>
    `;

    if (this._onComplete) {
      this._onComplete(this.currentLab);
    }
  }

  restart() {
    this.currentStep = 0;
    this.render();
  }

  close() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.currentLab = null;
    this.currentStep = 0;
  }

  /* ── GET SIM AREA ── */
  getSimArea() {
    return document.getElementById('lab-sim-area');
  }

  /* ── EVENTS ── */
  onComplete(callback) { this._onComplete = callback; }
  onStepChange(callback) { this._onStepChange = callback; }

  /* ── STATE ── */
  isCompleted(labId) {
    return this.completed.includes(labId);
  }

  getCompleted() {
    return [...this.completed];
  }

  destroy() {
    window._labEngine = null;
  }
}

window.LabsEngine = LabsEngine;

/* ═══════════════════════════════════════════
   SDR KIDS LAB — PLAYGROUND v0.2.0
   Interactive simulator demo page
   ═══════════════════════════════════════════ */

const SDRPlayground = (() => {
  let spectrum = null;
  let waterfall = null;
  let modulation = null;
  let antenna = null;
  let range = null;
  let currentScene = 'fmBand';
  let initialized = false;

  function init() {
    if (initialized) {
      // Re-render if already initialized (page revisit)
      if (spectrum) spectrum.start();
      if (modulation) modulation.start();
      return;
    }

    // Check if playground page exists
    const page = document.getElementById('page-playground');
    if (!page) return;

    // Listen for route changes
    window.addEventListener('sdr-route-changed', (e) => {
      if (e.detail.route === 'playground') {
        setTimeout(() => setup(), 100);
      } else {
        pauseAll();
      }
    });
  }

  function setup() {
    if (initialized) {
      resumeAll();
      return;
    }

    try {
      setupSpectrum();
      setupWaterfall();
      setupModulation();
      setupAntenna();
      setupRange();
      setupSceneGrid();
      bindControls();
      loadScene('fmBand');
      initialized = true;
      console.log('🧪 Playground: Ready');
    } catch (err) {
      console.error('🧪 Playground: Setup error', err);
    }
  }

  /* ── SPECTRUM ── */
  function setupSpectrum() {
    const canvas = document.getElementById('spectrum-canvas');
    if (!canvas) return;

    spectrum = new SpectrumEngine(canvas, {
      fftSize: 512,
      minFreq: 87e6,
      maxFreq: 109e6,
      noiseFloor: -100,
      fps: 24,
    });
  }

  /* ── WATERFALL ── */
  function setupWaterfall() {
    const canvas = document.getElementById('waterfall-canvas');
    if (!canvas) return;

    waterfall = new WaterfallEngine(canvas, {
      fftSize: 512,
      colorMap: 'thermal',
      fps: 20,
    });

    // Connect waterfall to spectrum
    if (spectrum) {
      waterfall.connectSpectrum(spectrum);
      waterfall.start();
    }
  }

  /* ── MODULATION ── */
  function setupModulation() {
    const canvas = document.getElementById('modulation-canvas');
    if (!canvas) return;

    modulation = new ModulationEngine(canvas, {
      mode: 'am',
      carrierFreq: 10,
      messageFreq: 1,
      fps: 30,
    });
  }

  /* ── ANTENNA ── */
  function setupAntenna() {
    const canvas = document.getElementById('antenna-canvas');
    if (!canvas) return;

    antenna = new AntennaSimulator(canvas, {
      antennaType: 'dipole',
      frequency: 100e6,
    });
    antenna.render();
  }

  /* ── RANGE ── */
  function setupRange() {
    const canvas = document.getElementById('range-canvas');
    if (!canvas) return;

    range = RangeCalculator.fromPreset(canvas, 'lora868');
    range.render();
  }

  /* ── SCENE GRID ── */
  function setupSceneGrid() {
    const grid = document.getElementById('scene-grid');
    if (!grid) return;

    const scenes = SignalLibrary.getSceneList();
    grid.innerHTML = scenes.map(s => `
      <div class="sim-scene-card ${s.key === currentScene ? 'sim-scene-card--active' : ''}" 
           data-scene="${s.key}">
        <div class="sim-scene-card__name">${s.name}</div>
        <div class="sim-scene-card__desc">${s.description}</div>
      </div>
    `).join('');

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('[data-scene]');
      if (card) {
        loadScene(card.dataset.scene);
        // Update active state
        grid.querySelectorAll('.sim-scene-card').forEach(c => 
          c.classList.toggle('sim-scene-card--active', c.dataset.scene === card.dataset.scene)
        );
      }
    });
  }

  /* ── LOAD SCENE ── */
  function loadScene(sceneName) {
    if (!spectrum) return;
    currentScene = sceneName;
    const scene = SignalLibrary.loadScene(spectrum, sceneName);
    if (scene) {
      spectrum.start();
      if (waterfall) waterfall.clear();
    }
  }

  /* ── BIND CONTROLS ── */
  function bindControls() {
    // Spectrum toggle (play/pause)
    const specToggle = document.getElementById('spectrum-toggle');
    if (specToggle) {
      specToggle.addEventListener('click', () => {
        if (spectrum?.running) {
          spectrum.stop();
          specToggle.textContent = '▶️ Play';
        } else {
          spectrum?.start();
          specToggle.textContent = '⏸️ Pause';
        }
      });
    }

    // Peaks toggle
    const peaksToggle = document.getElementById('peaks-toggle');
    if (peaksToggle) {
      peaksToggle.addEventListener('click', () => {
        if (spectrum) {
          spectrum.opts.showPeaks = !spectrum.opts.showPeaks;
          peaksToggle.textContent = spectrum.opts.showPeaks ? '📈 Peaks' : '📉 No Peaks';
        }
      });
    }

    // Noise slider
    const noiseSlider = document.getElementById('noise-slider');
    const noiseValue = document.getElementById('noise-value');
    if (noiseSlider) {
      noiseSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        if (spectrum) spectrum.setNoiseFloor(val);
        if (noiseValue) noiseValue.textContent = val + ' dB';
      });
    }

    // Colormap buttons
    const colormapBtns = document.getElementById('colormap-btns');
    if (colormapBtns) {
      colormapBtns.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-map]');
        if (btn && waterfall) {
          waterfall.setColorMap(btn.dataset.map);
          waterfall.clear();
          colormapBtns.querySelectorAll('.sim-btn').forEach(b => 
            b.classList.toggle('sim-btn--active', b === btn)
          );
        }
      });
    }

    // Modulation buttons
    const modBtns = document.getElementById('mod-btns');
    if (modBtns) {
      modBtns.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-mod]');
        if (btn && modulation) {
          modulation.setMode(btn.dataset.mod);
          modBtns.querySelectorAll('.sim-btn').forEach(b => 
            b.classList.toggle('sim-btn--active', b === btn)
          );
        }
      });
    }

    // Carrier frequency slider
    const carrierSlider = document.getElementById('carrier-slider');
    const carrierValue = document.getElementById('carrier-value');
    if (carrierSlider) {
      carrierSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (modulation) modulation.setParams({ carrierFreq: val });
        if (carrierValue) carrierValue.textContent = val + ' Hz';
      });
    }

    // Message frequency slider
    const messageSlider = document.getElementById('message-slider');
    const messageValue = document.getElementById('message-value');
    if (messageSlider) {
      messageSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (modulation) modulation.setParams({ messageFreq: val });
        if (messageValue) messageValue.textContent = val + ' Hz';
      });
    }

    // Antenna type select
    const antennaSelect = document.getElementById('antenna-select');
    if (antennaSelect) {
      antennaSelect.addEventListener('change', (e) => {
        if (antenna) {
          antenna.setType(e.target.value);
        }
      });
    }

    // Range preset select
    const rangeSelect = document.getElementById('range-select');
    if (rangeSelect) {
      rangeSelect.addEventListener('change', (e) => {
        const preset = RangeCalculator.presets[e.target.value];
        if (range && preset) {
          range.setParams(preset);
          range.render();
        }
      });
    }
  }

  /* ── PAUSE / RESUME ── */
  function pauseAll() {
    if (spectrum) spectrum.stop();
    if (waterfall) waterfall.stop();
    if (modulation) modulation.stop();
  }

  function resumeAll() {
    if (spectrum) spectrum.start();
    if (waterfall) waterfall.start();
    if (modulation) modulation.start();
  }

  return { init, setup, loadScene };
})();

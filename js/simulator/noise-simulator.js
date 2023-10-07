/* ═══════════════════════════════════════════
   SDR KIDS LAB — NOISE SIMULATOR v0.2.0
   Adjustable noise floor for SDR simulations
   ═══════════════════════════════════════════ */

class NoiseSimulator {
  constructor(options = {}) {
    this.opts = {
      baseFloor: options.baseFloor || -100,    // dB
      variation: options.variation || 6,        // dB random variation
      burstProb: options.burstProb || 0.005,    // probability of noise burst
      burstPower: options.burstPower || 20,     // dB above floor
      burstDuration: options.burstDuration || 50, // samples
      ...options
    };

    this.level = this.opts.baseFloor;
    this.burstCountdown = 0;
    this.burstActive = false;
  }

  /* ── SET NOISE FLOOR ── */
  setFloor(level) {
    this.level = level;
    this.opts.baseFloor = level;
  }

  getFloor() {
    return this.level;
  }

  /* ── GENERATE NOISE SAMPLE ── */
  sample() {
    let val = this.level + (Math.random() - 0.5) * this.opts.variation;

    // Random noise bursts (simulates interference)
    if (this.burstCountdown > 0) {
      val += this.opts.burstPower * (this.burstCountdown / this.opts.burstDuration);
      this.burstCountdown--;
    } else if (Math.random() < this.opts.burstProb) {
      this.burstCountdown = this.opts.burstDuration;
    }

    return val;
  }

  /* ── FILL ARRAY WITH NOISE ── */
  fill(array) {
    for (let i = 0; i < array.length; i++) {
      array[i] = this.sample();
    }
    return array;
  }

  /* ── ADD NOISE TO EXISTING ARRAY ── */
  addTo(array) {
    for (let i = 0; i < array.length; i++) {
      // Combine in dB (approximate: take max with noise variation)
      const noise = this.sample();
      if (noise > array[i]) {
        array[i] = noise;
      }
    }
    return array;
  }

  /* ── ENVIRONMENTAL NOISE PRESETS ── */
  static presets = {
    quiet:    { baseFloor: -110, variation: 3, burstProb: 0.001 },
    urban:    { baseFloor: -90,  variation: 8, burstProb: 0.01 },
    noisy:    { baseFloor: -75,  variation: 12, burstProb: 0.02 },
    indoor:   { baseFloor: -95,  variation: 5, burstProb: 0.005 },
    outdoor:  { baseFloor: -100, variation: 4, burstProb: 0.003 },
    shielded: { baseFloor: -115, variation: 2, burstProb: 0.0005 },
  };

  static fromPreset(name) {
    const preset = NoiseSimulator.presets[name] || NoiseSimulator.presets.indoor;
    return new NoiseSimulator(preset);
  }
}

window.NoiseSimulator = NoiseSimulator;

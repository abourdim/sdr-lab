/* ═══════════════════════════════════════════
   SDR KIDS LAB — ANTENNA SIMULATOR v0.2.0
   Radiation pattern display + calculator
   ═══════════════════════════════════════════ */

class AntennaSimulator {
  constructor(canvasId, options = {}) {
    this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!this.canvas) throw new Error('Antenna: Canvas not found');
    this.ctx = this.canvas.getContext('2d');

    this.opts = {
      antennaType: options.antennaType || 'dipole',
      frequency: options.frequency || 100e6,
      gridColor: options.gridColor || 'rgba(212,169,76,0.15)',
      patternColor: options.patternColor || '#00bcd4',
      fillColor: options.fillColor || 'rgba(0,188,212,0.12)',
      textColor: options.textColor || '#7a8da6',
      accentColor: options.accentColor || '#d4a94c',
      ...options
    };

    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: 300, height: 300 };
    const size = Math.min(rect.width, this.canvas.offsetHeight || 300);
    const dpr = window.devicePixelRatio || 1;
    this.displaySize = size;
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.ctx.scale(dpr, dpr);
  }

  /* ── ANTENNA TYPES ── */
  static TYPES = {
    dipole: {
      name: 'Dipole',
      description: 'Simple two-element antenna, omnidirectional in one plane',
      gainDb: 2.15,
      pattern: (angle) => Math.abs(Math.cos(Math.PI / 2 * Math.cos(angle)) / Math.sin(angle + 0.001)),
    },
    monopole: {
      name: 'Monopole (Whip)',
      description: 'Single vertical element, good for general reception',
      gainDb: 5.15,
      pattern: (angle) => Math.abs(Math.cos(Math.PI / 2 * Math.cos(angle)) / Math.sin(angle + 0.001)),
    },
    yagi: {
      name: 'Yagi-Uda',
      description: 'Directional antenna with high gain in one direction',
      gainDb: 10,
      pattern: (angle) => {
        const main = Math.pow(Math.cos(angle), 4);
        const side = 0.15 * Math.pow(Math.cos(3 * angle), 2);
        const back = 0.05 * Math.pow(Math.cos(angle + Math.PI), 2);
        return Math.max(0, main + side + back);
      },
    },
    discone: {
      name: 'Discone',
      description: 'Wideband antenna, good for scanning many frequencies',
      gainDb: 0,
      pattern: (angle) => {
        const main = 0.8 + 0.2 * Math.cos(2 * angle);
        return Math.max(0, main);
      },
    },
    patch: {
      name: 'Patch (Microstrip)',
      description: 'Flat directional antenna, used in GPS and satellites',
      gainDb: 7,
      pattern: (angle) => {
        if (Math.abs(angle) > Math.PI / 2) return 0.05;
        return Math.pow(Math.cos(angle), 3);
      },
    },
    parabolic: {
      name: 'Parabolic Dish',
      description: 'Very high gain, very directional, used for satellites',
      gainDb: 25,
      pattern: (angle) => {
        const main = Math.pow(Math.cos(angle), 20);
        return Math.max(0.01, main);
      },
    },
  };

  /* ── SET ANTENNA ── */
  setType(type) {
    this.opts.antennaType = type;
    this.render();
  }

  setFrequency(freq) {
    this.opts.frequency = freq;
    this.render();
  }

  /* ── CALCULATIONS ── */
  static wavelength(freq) {
    return 3e8 / freq; // speed of light / frequency
  }

  static halfWaveLength(freq) {
    return AntennaSimulator.wavelength(freq) / 2;
  }

  static quarterWaveLength(freq) {
    return AntennaSimulator.wavelength(freq) / 4;
  }

  static formatLength(meters) {
    if (meters >= 1) return meters.toFixed(2) + ' m';
    if (meters >= 0.01) return (meters * 100).toFixed(1) + ' cm';
    return (meters * 1000).toFixed(1) + ' mm';
  }

  getInfo() {
    const type = AntennaSimulator.TYPES[this.opts.antennaType];
    const wl = AntennaSimulator.wavelength(this.opts.frequency);
    return {
      name: type.name,
      description: type.description,
      gainDb: type.gainDb,
      wavelength: wl,
      halfWave: wl / 2,
      quarterWave: wl / 4,
      frequency: this.opts.frequency,
    };
  }

  /* ── RENDER ── */
  render() {
    const ctx = this.ctx;
    const s = this.displaySize;
    const cx = s / 2;
    const cy = s / 2;
    const r = s * 0.38;

    ctx.clearRect(0, 0, s, s);

    // Grid circles
    this._drawGrid(ctx, cx, cy, r);

    // Pattern
    this._drawPattern(ctx, cx, cy, r);

    // Info text
    this._drawInfo(ctx, s);
  }

  _drawGrid(ctx, cx, cy, r) {
    ctx.strokeStyle = this.opts.gridColor;
    ctx.lineWidth = 0.5;

    // Concentric circles (dB levels)
    for (let i = 1; i <= 4; i++) {
      const cr = r * (i / 4);
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.stroke();

      // dB label
      ctx.fillStyle = this.opts.textColor;
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(`-${(4 - i) * 10} dB`, cx + cr + 3, cy - 3);
    }

    // Cross lines
    ctx.beginPath();
    ctx.moveTo(cx - r - 10, cy);
    ctx.lineTo(cx + r + 10, cy);
    ctx.moveTo(cx, cy - r - 10);
    ctx.lineTo(cx, cy + r + 10);
    ctx.stroke();

    // Angle labels
    ctx.fillStyle = this.opts.textColor;
    ctx.font = '10px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('0°', cx, cy - r - 14);
    ctx.fillText('180°', cx, cy + r + 18);
    ctx.textAlign = 'left';
    ctx.fillText('90°', cx + r + 8, cy + 4);
    ctx.textAlign = 'right';
    ctx.fillText('270°', cx - r - 8, cy + 4);
    ctx.textAlign = 'left';
  }

  _drawPattern(ctx, cx, cy, r) {
    const type = AntennaSimulator.TYPES[this.opts.antennaType];
    if (!type) return;

    const steps = 360;
    ctx.beginPath();

    for (let i = 0; i <= steps; i++) {
      const angle = (i / steps) * Math.PI * 2 - Math.PI / 2;
      const gain = Math.max(0, Math.min(1, type.pattern(angle)));
      const pr = r * gain;
      const x = cx + pr * Math.cos(angle);
      const y = cy + pr * Math.sin(angle);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fillStyle = this.opts.fillColor;
    ctx.fill();
    ctx.strokeStyle = this.opts.patternColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Main lobe indicator
    const maxAngle = -Math.PI / 2;
    const maxR = r * type.pattern(0);
    ctx.beginPath();
    ctx.arc(cx + maxR * Math.cos(maxAngle), cy + maxR * Math.sin(maxAngle), 4, 0, Math.PI * 2);
    ctx.fillStyle = this.opts.accentColor;
    ctx.fill();
  }

  _drawInfo(ctx, size) {
    const type = AntennaSimulator.TYPES[this.opts.antennaType];
    const info = this.getInfo();

    ctx.fillStyle = this.opts.textColor;
    ctx.font = 'bold 12px Nunito, sans-serif';
    ctx.fillText(type.name, 8, size - 36);

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText(`Gain: ${type.gainDb} dBi`, 8, size - 22);
    ctx.fillText(`λ = ${AntennaSimulator.formatLength(info.wavelength)}`, 8, size - 8);
  }

  destroy() {}
}

window.AntennaSimulator = AntennaSimulator;

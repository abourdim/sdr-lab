/* ═══════════════════════════════════════════
   SDR KIDS LAB — RANGE CALCULATOR v0.2.0
   Distance vs signal strength estimation
   ═══════════════════════════════════════════ */

class RangeCalculator {
  constructor(canvasId, options = {}) {
    this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

    this.opts = {
      txPower: options.txPower || 15,         // dBm
      txGain: options.txGain || 2,            // dBi
      rxGain: options.rxGain || 2,            // dBi
      frequency: options.frequency || 868e6,  // Hz
      rxSensitivity: options.rxSensitivity || -120, // dBm
      pathLossModel: options.pathLossModel || 'freespace',
      maxDistance: options.maxDistance || 10000, // meters
      ...options
    };

    if (this.canvas) {
      this._resize();
      window.addEventListener('resize', () => this._resize());
    }
  }

  _resize() {
    const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: 500, height: 200 };
    const dpr = window.devicePixelRatio || 1;
    this.displayWidth = rect.width;
    this.displayHeight = this.canvas.offsetHeight || 200;
    this.canvas.width = this.displayWidth * dpr;
    this.canvas.height = this.displayHeight * dpr;
    this.ctx.scale(dpr, dpr);
  }

  /* ── PATH LOSS MODELS ── */
  static freeSpaceLoss(distMeters, freqHz) {
    if (distMeters <= 0) return 0;
    // FSPL (dB) = 20log10(d) + 20log10(f) - 147.55
    return 20 * Math.log10(distMeters) + 20 * Math.log10(freqHz) - 147.55;
  }

  static urbanLoss(distMeters, freqHz) {
    // Simplified Hata model for urban
    if (distMeters <= 0) return 0;
    const freqMHz = freqHz / 1e6;
    const distKm = distMeters / 1000;
    return 69.55 + 26.16 * Math.log10(freqMHz) - 13.82 * Math.log10(30)
           + (44.9 - 6.55 * Math.log10(30)) * Math.log10(Math.max(0.1, distKm));
  }

  static indoorLoss(distMeters, freqHz) {
    // Free space + wall penetration factor
    if (distMeters <= 0) return 0;
    const fspl = RangeCalculator.freeSpaceLoss(distMeters, freqHz);
    const walls = Math.floor(distMeters / 10);
    return fspl + walls * 5; // 5 dB per wall
  }

  /* ── CALCULATE RECEIVED POWER ── */
  receivedPower(distMeters) {
    const { txPower, txGain, rxGain, frequency, pathLossModel } = this.opts;
    let loss;

    switch (pathLossModel) {
      case 'urban':
        loss = RangeCalculator.urbanLoss(distMeters, frequency);
        break;
      case 'indoor':
        loss = RangeCalculator.indoorLoss(distMeters, frequency);
        break;
      default:
        loss = RangeCalculator.freeSpaceLoss(distMeters, frequency);
    }

    return txPower + txGain + rxGain - loss;
  }

  /* ── CALCULATE MAX RANGE ── */
  maxRange() {
    const { rxSensitivity, maxDistance } = this.opts;
    // Binary search for max distance
    let lo = 1, hi = maxDistance;
    while (hi - lo > 1) {
      const mid = (lo + hi) / 2;
      if (this.receivedPower(mid) > rxSensitivity) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    return Math.round(lo);
  }

  /* ── RENDER RANGE CURVE ── */
  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.displayWidth;
    const h = this.displayHeight;
    const { rxSensitivity, maxDistance } = this.opts;

    ctx.clearRect(0, 0, w, h);

    const padding = { left: 55, right: 20, top: 20, bottom: 35 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    // Grid
    ctx.strokeStyle = 'rgba(212,169,76,0.12)';
    ctx.lineWidth = 0.5;
    ctx.fillStyle = '#7a8da6';
    ctx.font = '9px JetBrains Mono, monospace';

    // Y-axis (dB)
    const minRx = rxSensitivity - 10;
    const maxRx = this.opts.txPower + 5;
    const dbRange = maxRx - minRx;

    for (let db = Math.ceil(minRx / 20) * 20; db <= maxRx; db += 20) {
      const y = padding.top + plotH - ((db - minRx) / dbRange) * plotH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText(`${db} dBm`, padding.left - 5, y + 3);
    }

    // X-axis (distance)
    const distStep = maxDistance > 5000 ? 2000 : maxDistance > 1000 ? 500 : 100;
    for (let d = 0; d <= maxDistance; d += distStep) {
      const x = padding.left + (d / maxDistance) * plotW;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + plotH);
      ctx.stroke();
      ctx.textAlign = 'center';
      const label = d >= 1000 ? (d / 1000) + 'km' : d + 'm';
      ctx.fillText(label, x, h - padding.bottom + 15);
    }

    // Sensitivity line
    const sensY = padding.top + plotH - ((rxSensitivity - minRx) / dbRange) * plotH;
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(padding.left, sensY);
    ctx.lineTo(w - padding.right, sensY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#e74c3c';
    ctx.textAlign = 'left';
    ctx.font = '10px Nunito, sans-serif';
    ctx.fillText('Sensitivity', w - padding.right - 65, sensY - 5);

    // Signal curve
    ctx.beginPath();
    ctx.strokeStyle = '#00bcd4';
    ctx.lineWidth = 2;

    const maxR = this.maxRange();
    for (let i = 0; i <= 200; i++) {
      const d = (i / 200) * maxDistance;
      const rx = d > 0 ? this.receivedPower(d) : maxRx;
      const x = padding.left + (d / maxDistance) * plotW;
      const y = padding.top + plotH - ((rx - minRx) / dbRange) * plotH;
      const clampedY = Math.max(padding.top, Math.min(padding.top + plotH, y));

      if (i === 0) ctx.moveTo(x, clampedY);
      else ctx.lineTo(x, clampedY);
    }
    ctx.stroke();

    // Max range marker
    const markerX = padding.left + (maxR / maxDistance) * plotW;
    ctx.beginPath();
    ctx.strokeStyle = '#d4a94c';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.moveTo(markerX, padding.top);
    ctx.lineTo(markerX, padding.top + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Max range label
    ctx.fillStyle = '#d4a94c';
    ctx.font = 'bold 11px Nunito, sans-serif';
    ctx.textAlign = 'center';
    const rangeLabel = maxR >= 1000 ? (maxR / 1000).toFixed(1) + ' km' : maxR + ' m';
    ctx.fillText(`Max: ${rangeLabel}`, markerX, padding.top + 14);

    // Axis labels
    ctx.fillStyle = '#7a8da6';
    ctx.font = '10px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Distance', w / 2, h - 3);
    ctx.save();
    ctx.translate(12, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Signal (dBm)', 0, 0);
    ctx.restore();
  }

  /* ── PRESETS ── */
  static presets = {
    microbit:  { txPower: 4,  txGain: 0, rxGain: 0, frequency: 2.4e9,  rxSensitivity: -95,  maxDistance: 100,   pathLossModel: 'indoor' },
    lora433:   { txPower: 14, txGain: 2, rxGain: 2, frequency: 433e6,   rxSensitivity: -137, maxDistance: 15000, pathLossModel: 'freespace' },
    lora868:   { txPower: 14, txGain: 2, rxGain: 2, frequency: 868e6,   rxSensitivity: -137, maxDistance: 10000, pathLossModel: 'freespace' },
    wifi:      { txPower: 20, txGain: 3, rxGain: 3, frequency: 2.4e9,   rxSensitivity: -80,  maxDistance: 200,   pathLossModel: 'indoor' },
    bluetooth: { txPower: 4,  txGain: 0, rxGain: 0, frequency: 2.4e9,   rxSensitivity: -70,  maxDistance: 50,    pathLossModel: 'indoor' },
    fm:        { txPower: 47, txGain: 6, rxGain: 2, frequency: 100e6,   rxSensitivity: -90,  maxDistance: 100000,pathLossModel: 'freespace' },
  };

  static fromPreset(canvasId, presetName) {
    const preset = RangeCalculator.presets[presetName] || RangeCalculator.presets.lora868;
    return new RangeCalculator(canvasId, preset);
  }

  setParams(params) {
    Object.assign(this.opts, params);
  }

  destroy() {}
}

window.RangeCalculator = RangeCalculator;

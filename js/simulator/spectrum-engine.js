/* ═══════════════════════════════════════════
   SDR KIDS LAB — SPECTRUM ENGINE v0.2.0
   Canvas-based FFT spectrum display
   ═══════════════════════════════════════════ */

class SpectrumEngine {
  constructor(canvasId, options = {}) {
    this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!this.canvas) throw new Error('Spectrum: Canvas not found');
    this.ctx = this.canvas.getContext('2d');

    // Config
    this.opts = {
      fftSize: options.fftSize || 512,
      minFreq: options.minFreq || 88e6,       // 88 MHz
      maxFreq: options.maxFreq || 108e6,       // 108 MHz
      minDb: options.minDb || -120,
      maxDb: options.maxDb || 0,
      noiseFloor: options.noiseFloor || -100,
      gridLines: options.gridLines !== false,
      gridColor: options.gridColor || 'rgba(212,169,76,0.12)',
      lineColor: options.lineColor || '#00bcd4',
      fillColor: options.fillColor || 'rgba(0,188,212,0.15)',
      peakColor: options.peakColor || '#d4a94c',
      textColor: options.textColor || '#7a8da6',
      bgColor: options.bgColor || 'transparent',
      showPeaks: options.showPeaks !== false,
      peakDecay: options.peakDecay || 0.3,
      smoothing: options.smoothing || 0.7,
      animate: options.animate !== false,
      fps: options.fps || 30,
      ...options
    };

    // State
    this.data = new Float32Array(this.opts.fftSize);
    this.peaks = new Float32Array(this.opts.fftSize);
    this.signals = [];
    this.noiseLevel = this.opts.noiseFloor;
    this.running = false;
    this.animFrame = null;
    this.lastFrame = 0;
    this.markers = [];

    // Listeners for external updates
    this._onUpdate = null;

    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  /* ── RESIZE ── */
  _resize() {
    const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: 600, height: 200 };
    const dpr = window.devicePixelRatio || 1;
    this.width = this.canvas.width = rect.width * dpr;
    this.height = this.canvas.height = (this.canvas.offsetHeight || 200) * dpr;
    this.ctx.scale(dpr, dpr);
    this.displayWidth = rect.width;
    this.displayHeight = this.canvas.offsetHeight || 200;
  }

  /* ── SIGNAL MANAGEMENT ── */
  addSignal(signal) {
    // signal: { freq, bandwidth, power, modulation, label }
    this.signals.push({
      freq: signal.freq || 100e6,
      bandwidth: signal.bandwidth || 200e3,
      power: signal.power || -40,
      modulation: signal.modulation || 'fm',
      label: signal.label || '',
      color: signal.color || null,
      active: signal.active !== false,
      ...signal
    });
    return this.signals.length - 1;
  }

  removeSignal(index) {
    this.signals.splice(index, 1);
  }

  clearSignals() {
    this.signals = [];
  }

  setFrequencyRange(minFreq, maxFreq) {
    this.opts.minFreq = minFreq;
    this.opts.maxFreq = maxFreq;
  }

  setNoiseFloor(level) {
    this.noiseLevel = level;
  }

  addMarker(freq, label, color) {
    this.markers.push({ freq, label, color: color || '#d4a94c' });
  }

  clearMarkers() {
    this.markers = [];
  }

  /* ── DATA GENERATION ── */
  _generateData() {
    const { fftSize, minFreq, maxFreq, minDb } = this.opts;
    const freqRange = maxFreq - minFreq;
    const binWidth = freqRange / fftSize;
    const time = performance.now() / 1000;

    // Fill with noise
    for (let i = 0; i < fftSize; i++) {
      const noise = this.noiseLevel + (Math.random() - 0.5) * 6;
      // Smooth with previous
      this.data[i] = this.data[i] * this.opts.smoothing + noise * (1 - this.opts.smoothing);
    }

    // Add signals
    for (const sig of this.signals) {
      if (!sig.active) continue;
      const centerBin = Math.round((sig.freq - minFreq) / binWidth);
      const bwBins = Math.max(1, Math.round(sig.bandwidth / binWidth));
      const halfBw = bwBins / 2;

      for (let i = Math.max(0, centerBin - bwBins * 2); i < Math.min(fftSize, centerBin + bwBins * 2); i++) {
        const dist = Math.abs(i - centerBin);
        let amplitude;

        if (sig.modulation === 'fm') {
          // FM: wider, flatter top with skirts
          const normalDist = dist / halfBw;
          if (normalDist < 1) {
            amplitude = sig.power + (Math.random() - 0.5) * 3;
            // Add stereo pilot tone effect
            amplitude += Math.sin(time * 2 + i * 0.1) * 1.5;
          } else {
            amplitude = sig.power - (normalDist - 1) * 40;
          }
        } else if (sig.modulation === 'am') {
          // AM: narrow, sharp peak with sidebands
          const normalDist = dist / halfBw;
          amplitude = sig.power - normalDist * normalDist * 30;
          // Sidebands
          if (Math.abs(dist - halfBw * 0.5) < 2) {
            amplitude = sig.power - 10 + Math.random() * 3;
          }
        } else if (sig.modulation === 'digital') {
          // Digital: rectangular-ish
          const normalDist = dist / halfBw;
          if (normalDist < 0.9) {
            amplitude = sig.power + (Math.random() - 0.5) * 4;
          } else if (normalDist < 1.2) {
            amplitude = sig.power - (normalDist - 0.9) * 80;
          } else {
            amplitude = this.noiseLevel;
          }
        } else {
          // Generic: Gaussian
          const normalDist = dist / halfBw;
          amplitude = sig.power * Math.exp(-normalDist * normalDist * 2);
        }

        if (amplitude > this.data[i]) {
          this.data[i] = this.data[i] * 0.3 + amplitude * 0.7;
        }
      }
    }

    // Update peaks
    for (let i = 0; i < fftSize; i++) {
      if (this.data[i] > this.peaks[i]) {
        this.peaks[i] = this.data[i];
      } else {
        this.peaks[i] -= this.opts.peakDecay;
      }
    }

    // Notify listeners
    if (this._onUpdate) this._onUpdate(this.data);
  }

  /* ── RENDERING ── */
  _draw() {
    const ctx = this.ctx;
    const w = this.displayWidth;
    const h = this.displayHeight;
    const { fftSize, minDb, maxDb, minFreq, maxFreq } = this.opts;
    const dbRange = maxDb - minDb;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Background
    if (this.opts.bgColor !== 'transparent') {
      ctx.fillStyle = this.opts.bgColor;
      ctx.fillRect(0, 0, w, h);
    }

    // Grid
    if (this.opts.gridLines) {
      this._drawGrid(ctx, w, h);
    }

    // Spectrum fill
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let i = 0; i < fftSize; i++) {
      const x = (i / fftSize) * w;
      const dbVal = Math.max(minDb, Math.min(maxDb, this.data[i]));
      const y = h - ((dbVal - minDb) / dbRange) * h;
      if (i === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = this.opts.fillColor;
    ctx.fill();

    // Spectrum line
    ctx.beginPath();
    for (let i = 0; i < fftSize; i++) {
      const x = (i / fftSize) * w;
      const dbVal = Math.max(minDb, Math.min(maxDb, this.data[i]));
      const y = h - ((dbVal - minDb) / dbRange) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = this.opts.lineColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Peak hold line
    if (this.opts.showPeaks) {
      ctx.beginPath();
      for (let i = 0; i < fftSize; i++) {
        const x = (i / fftSize) * w;
        const dbVal = Math.max(minDb, Math.min(maxDb, this.peaks[i]));
        const y = h - ((dbVal - minDb) / dbRange) * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = this.opts.peakColor;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Markers
    this._drawMarkers(ctx, w, h);

    // Signal labels
    this._drawSignalLabels(ctx, w, h);
  }

  _drawGrid(ctx, w, h) {
    const { minDb, maxDb, minFreq, maxFreq } = this.opts;
    const dbRange = maxDb - minDb;
    const freqRange = maxFreq - minFreq;

    ctx.strokeStyle = this.opts.gridColor;
    ctx.lineWidth = 0.5;
    ctx.fillStyle = this.opts.textColor;
    ctx.font = '10px JetBrains Mono, monospace';

    // Horizontal dB lines
    const dbStep = dbRange > 80 ? 20 : 10;
    for (let db = minDb; db <= maxDb; db += dbStep) {
      const y = h - ((db - minDb) / dbRange) * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
      ctx.fillText(`${db} dB`, 4, y - 3);
    }

    // Vertical frequency lines
    const freqStep = this._niceFreqStep(freqRange);
    const startFreq = Math.ceil(minFreq / freqStep) * freqStep;
    for (let f = startFreq; f <= maxFreq; f += freqStep) {
      const x = ((f - minFreq) / freqRange) * w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
      ctx.fillText(this._formatFreq(f), x + 3, h - 4);
    }
  }

  _drawMarkers(ctx, w, h) {
    const { minFreq, maxFreq, minDb, maxDb } = this.opts;
    const freqRange = maxFreq - minFreq;
    const dbRange = maxDb - minDb;

    for (const marker of this.markers) {
      const x = ((marker.freq - minFreq) / freqRange) * w;
      if (x < 0 || x > w) continue;

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.strokeStyle = marker.color;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (marker.label) {
        ctx.fillStyle = marker.color;
        ctx.font = 'bold 11px Nunito, sans-serif';
        ctx.fillText(marker.label, x + 4, 14);
      }
    }
  }

  _drawSignalLabels(ctx, w, h) {
    const { minFreq, maxFreq, minDb, maxDb } = this.opts;
    const freqRange = maxFreq - minFreq;
    const dbRange = maxDb - minDb;

    for (const sig of this.signals) {
      if (!sig.active || !sig.label) continue;
      const x = ((sig.freq - minFreq) / freqRange) * w;
      if (x < 0 || x > w) continue;
      const y = h - ((sig.power - minDb) / dbRange) * h;

      ctx.fillStyle = sig.color || this.opts.peakColor;
      ctx.font = 'bold 10px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(sig.label, x, Math.max(20, y - 8));
      ctx.textAlign = 'left';
    }
  }

  /* ── HELPERS ── */
  _niceFreqStep(range) {
    if (range > 1e9) return 200e6;
    if (range > 100e6) return 20e6;
    if (range > 10e6) return 2e6;
    if (range > 1e6) return 200e3;
    if (range > 100e3) return 20e3;
    return 5e3;
  }

  _formatFreq(freq) {
    if (freq >= 1e9) return (freq / 1e9).toFixed(1) + ' GHz';
    if (freq >= 1e6) return (freq / 1e6).toFixed(1) + ' MHz';
    if (freq >= 1e3) return (freq / 1e3).toFixed(0) + ' kHz';
    return freq + ' Hz';
  }

  /* ── ANIMATION LOOP ── */
  start() {
    if (this.running) return;
    this.running = true;
    this._loop();
  }

  stop() {
    this.running = false;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }

  _loop() {
    if (!this.running) return;
    const now = performance.now();
    const interval = 1000 / this.opts.fps;

    if (now - this.lastFrame >= interval) {
      this._generateData();
      this._draw();
      this.lastFrame = now;
    }

    this.animFrame = requestAnimationFrame(() => this._loop());
  }

  /* ── SINGLE FRAME ── */
  renderOnce() {
    this._generateData();
    this._draw();
  }

  /* ── EVENT HOOK ── */
  onUpdate(callback) {
    this._onUpdate = callback;
  }

  /* ── GET DATA ── */
  getData() {
    return this.data;
  }

  getFreqAtX(x) {
    const ratio = x / this.displayWidth;
    return this.opts.minFreq + ratio * (this.opts.maxFreq - this.opts.minFreq);
  }

  getDbAtY(y) {
    const ratio = 1 - (y / this.displayHeight);
    return this.opts.minDb + ratio * (this.opts.maxDb - this.opts.minDb);
  }

  /* ── CLEANUP ── */
  destroy() {
    this.stop();
    window.removeEventListener('resize', this._resize);
  }
}

// Export
window.SpectrumEngine = SpectrumEngine;

/* ═══════════════════════════════════════════
   SDR KIDS LAB — WATERFALL ENGINE v0.2.0
   Scrolling spectrogram (waterfall) display
   ═══════════════════════════════════════════ */

class WaterfallEngine {
  constructor(canvasId, options = {}) {
    this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!this.canvas) throw new Error('Waterfall: Canvas not found');
    this.ctx = this.canvas.getContext('2d');

    this.opts = {
      fftSize: options.fftSize || 512,
      minDb: options.minDb || -120,
      maxDb: options.maxDb || 0,
      colorMap: options.colorMap || 'thermal',
      scrollSpeed: options.scrollSpeed || 2,
      fps: options.fps || 20,
      ...options
    };

    // Pre-build color map
    this.colorLUT = this._buildColorLUT(this.opts.colorMap);

    // Offscreen buffer for scrolling
    this.buffer = document.createElement('canvas');
    this.bufCtx = this.buffer.getContext('2d');

    this.running = false;
    this.animFrame = null;
    this.lastFrame = 0;
    this._spectrumSource = null;

    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: 600, height: 150 };
    const dpr = window.devicePixelRatio || 1;
    this.displayWidth = rect.width;
    this.displayHeight = this.canvas.offsetHeight || 150;
    this.canvas.width = this.displayWidth * dpr;
    this.canvas.height = this.displayHeight * dpr;
    this.ctx.scale(dpr, dpr);

    this.buffer.width = this.displayWidth;
    this.buffer.height = this.displayHeight;
  }

  /* ── COLOR MAP ── */
  _buildColorLUT(mapName) {
    const lut = new Array(256);
    for (let i = 0; i < 256; i++) {
      const t = i / 255;
      lut[i] = this._colorMapValue(mapName, t);
    }
    return lut;
  }

  _colorMapValue(name, t) {
    switch (name) {
      case 'thermal':
        // Black → Blue → Cyan → Green → Yellow → Red → White
        if (t < 0.15) return this._rgb(0, 0, Math.round(t / 0.15 * 180));
        if (t < 0.3) return this._rgb(0, Math.round((t - 0.15) / 0.15 * 200), 180);
        if (t < 0.5) return this._rgb(0, 200, Math.round(180 - (t - 0.3) / 0.2 * 180));
        if (t < 0.7) return this._rgb(Math.round((t - 0.5) / 0.2 * 255), 200 + Math.round((t - 0.5) / 0.2 * 55), 0);
        if (t < 0.85) return this._rgb(255, Math.round(255 - (t - 0.7) / 0.15 * 255), 0);
        return this._rgb(255, Math.round((t - 0.85) / 0.15 * 255), Math.round((t - 0.85) / 0.15 * 255));

      case 'electric':
        // Dark blue → Purple → Hot pink → White
        if (t < 0.3) return this._rgb(Math.round(t / 0.3 * 80), 0, Math.round(t / 0.3 * 180));
        if (t < 0.6) return this._rgb(80 + Math.round((t - 0.3) / 0.3 * 175), 0, 180 + Math.round((t - 0.3) / 0.3 * 75));
        return this._rgb(255, Math.round((t - 0.6) / 0.4 * 255), 255);

      case 'ocean':
        // Deep blue → Cyan → Green → Yellow
        if (t < 0.4) return this._rgb(0, Math.round(t / 0.4 * 100), Math.round(80 + t / 0.4 * 175));
        if (t < 0.7) return this._rgb(0, 100 + Math.round((t - 0.4) / 0.3 * 155), Math.round(255 - (t - 0.4) / 0.3 * 155));
        return this._rgb(Math.round((t - 0.7) / 0.3 * 255), 255, Math.round((t - 0.7) / 0.3 * 100));

      default: // grayscale
        const v = Math.round(t * 255);
        return this._rgb(v, v, v);
    }
  }

  _rgb(r, g, b) {
    return `rgb(${Math.max(0, Math.min(255, r))},${Math.max(0, Math.min(255, g))},${Math.max(0, Math.min(255, b))})`;
  }

  /* ── CONNECT TO SPECTRUM ENGINE ── */
  connectSpectrum(spectrumEngine) {
    this._spectrumSource = spectrumEngine;
    spectrumEngine.onUpdate((data) => {
      this._pushLine(data);
    });
  }

  /* ── PUSH NEW DATA LINE ── */
  _pushLine(data) {
    const w = this.displayWidth;
    const h = this.displayHeight;
    const { minDb, maxDb, fftSize } = this.opts;
    const dbRange = maxDb - minDb;
    const scrollPx = this.opts.scrollSpeed;

    // Scroll existing content down
    this.bufCtx.drawImage(this.buffer, 0, 0, w, h, 0, scrollPx, w, h);

    // Draw new top line
    const binWidth = w / fftSize;
    for (let i = 0; i < fftSize; i++) {
      const val = data[i] !== undefined ? data[i] : minDb;
      const normalized = Math.max(0, Math.min(1, (val - minDb) / dbRange));
      const colorIndex = Math.round(normalized * 255);
      this.bufCtx.fillStyle = this.colorLUT[colorIndex];
      this.bufCtx.fillRect(i * binWidth, 0, Math.ceil(binWidth), scrollPx);
    }
  }

  /* ── RENDER ── */
  _draw() {
    this.ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);
    this.ctx.drawImage(this.buffer, 0, 0);
  }

  /* ── STANDALONE MODE (without spectrum engine) ── */
  pushData(dataArray) {
    this._pushLine(dataArray);
    this._draw();
  }

  /* ── ANIMATION (for standalone use) ── */
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
    if (now - this.lastFrame >= 1000 / this.opts.fps) {
      this._draw();
      this.lastFrame = now;
    }
    this.animFrame = requestAnimationFrame(() => this._loop());
  }

  /* ── COLOR MAP SWITCHER ── */
  setColorMap(mapName) {
    this.opts.colorMap = mapName;
    this.colorLUT = this._buildColorLUT(mapName);
  }

  /* ── CLEAR ── */
  clear() {
    this.bufCtx.clearRect(0, 0, this.buffer.width, this.buffer.height);
    this.ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);
  }

  /* ── CLEANUP ── */
  destroy() {
    this.stop();
    this._spectrumSource = null;
  }
}

window.WaterfallEngine = WaterfallEngine;

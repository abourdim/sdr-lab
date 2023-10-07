/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULATION ENGINE v0.2.0
   Visual modulation & demodulation display
   ═══════════════════════════════════════════ */

class ModulationEngine {
  constructor(canvasId, options = {}) {
    this.canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
    if (!this.canvas) throw new Error('ModulationEngine: Canvas not found');
    this.ctx = this.canvas.getContext('2d');

    this.opts = {
      mode: options.mode || 'am',
      carrierFreq: options.carrierFreq || 10,    // visual Hz (for display)
      messageFreq: options.messageFreq || 1,     // visual Hz
      modulationIndex: options.modulationIndex || 0.5,
      freqDeviation: options.freqDeviation || 5,
      lineWidth: options.lineWidth || 2,
      carrierColor: options.carrierColor || '#7a8da6',
      messageColor: options.messageColor || '#2ecc71',
      modulatedColor: options.modulatedColor || '#00bcd4',
      bgColor: options.bgColor || 'transparent',
      showLabels: options.showLabels !== false,
      animate: options.animate !== false,
      speed: options.speed || 1,
      fps: options.fps || 30,
      ...options
    };

    this.time = 0;
    this.running = false;
    this.animFrame = null;
    this.lastFrame = 0;

    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: 600, height: 300 };
    const dpr = window.devicePixelRatio || 1;
    this.displayWidth = rect.width;
    this.displayHeight = this.canvas.offsetHeight || 300;
    this.canvas.width = this.displayWidth * dpr;
    this.canvas.height = this.displayHeight * dpr;
    this.ctx.scale(dpr, dpr);
  }

  /* ── SET MODE ── */
  setMode(mode) {
    this.opts.mode = mode;
  }

  setParams(params) {
    Object.assign(this.opts, params);
  }

  /* ── RENDER ── */
  _draw() {
    const ctx = this.ctx;
    const w = this.displayWidth;
    const h = this.displayHeight;
    const t = this.time;

    ctx.clearRect(0, 0, w, h);

    const sectionH = h / 3;
    const padding = 8;

    // Section 1: Message signal
    this._drawWave(ctx, 0, sectionH, 'message', t);
    if (this.opts.showLabels) {
      this._drawLabel(ctx, 'Message Signal', 8, 16, this.opts.messageColor);
    }

    // Section 2: Carrier signal
    this._drawWave(ctx, sectionH, sectionH, 'carrier', t);
    if (this.opts.showLabels) {
      this._drawLabel(ctx, 'Carrier Signal', 8, sectionH + 16, this.opts.carrierColor);
    }

    // Divider lines
    ctx.strokeStyle = 'rgba(212,169,76,0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, sectionH);
    ctx.lineTo(w, sectionH);
    ctx.moveTo(0, sectionH * 2);
    ctx.lineTo(w, sectionH * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Section 3: Modulated signal
    this._drawWave(ctx, sectionH * 2, sectionH, 'modulated', t);
    if (this.opts.showLabels) {
      const modeLabel = this.opts.mode.toUpperCase() + ' Modulated';
      this._drawLabel(ctx, modeLabel, 8, sectionH * 2 + 16, this.opts.modulatedColor);
    }
  }

  _drawWave(ctx, yOffset, height, type, t) {
    const w = this.displayWidth;
    const midY = yOffset + height / 2;
    const amp = (height / 2) * 0.8;
    const { carrierFreq, messageFreq, modulationIndex, freqDeviation, mode } = this.opts;

    ctx.beginPath();
    ctx.lineWidth = this.opts.lineWidth;

    for (let x = 0; x < w; x++) {
      const xTime = (x / w) * 4 + t;
      let y;

      if (type === 'message') {
        ctx.strokeStyle = this.opts.messageColor;
        y = midY - amp * Math.sin(2 * Math.PI * messageFreq * xTime);
      } else if (type === 'carrier') {
        ctx.strokeStyle = this.opts.carrierColor;
        y = midY - amp * 0.6 * Math.sin(2 * Math.PI * carrierFreq * xTime);
      } else {
        // Modulated
        ctx.strokeStyle = this.opts.modulatedColor;
        const msg = Math.sin(2 * Math.PI * messageFreq * xTime);

        switch (mode) {
          case 'am':
            y = midY - amp * (1 + modulationIndex * msg) * 0.5 * Math.sin(2 * Math.PI * carrierFreq * xTime);
            break;
          case 'fm': {
            const integral = -Math.cos(2 * Math.PI * messageFreq * xTime) / (2 * Math.PI * messageFreq);
            y = midY - amp * 0.6 * Math.sin(2 * Math.PI * carrierFreq * xTime + freqDeviation * integral);
            break;
          }
          case 'ask': {
            const bit = Math.sin(2 * Math.PI * messageFreq * xTime) > 0 ? 1 : 0;
            y = midY - amp * 0.6 * bit * Math.sin(2 * Math.PI * carrierFreq * xTime);
            break;
          }
          case 'fsk': {
            const bit = Math.sin(2 * Math.PI * messageFreq * xTime) > 0 ? 1 : 0;
            const freq = bit ? carrierFreq * 1.5 : carrierFreq * 0.7;
            y = midY - amp * 0.6 * Math.sin(2 * Math.PI * freq * xTime);
            break;
          }
          case 'psk': {
            const bit = Math.sin(2 * Math.PI * messageFreq * xTime) > 0 ? 0 : Math.PI;
            y = midY - amp * 0.6 * Math.sin(2 * Math.PI * carrierFreq * xTime + bit);
            break;
          }
          default:
            y = midY - amp * 0.6 * Math.sin(2 * Math.PI * carrierFreq * xTime);
        }
      }

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
  }

  _drawLabel(ctx, text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = 'bold 11px Nunito, sans-serif';
    ctx.globalAlpha = 0.8;
    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1;
  }

  /* ── ANIMATION ── */
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
      this.time += this.opts.speed * (1 / this.opts.fps);
      this._draw();
      this.lastFrame = now;
    }
    this.animFrame = requestAnimationFrame(() => this._loop());
  }

  renderOnce() {
    this._draw();
  }

  destroy() {
    this.stop();
  }
}

window.ModulationEngine = ModulationEngine;

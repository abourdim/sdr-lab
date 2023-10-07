/* ═══════════════════════════════════════════
   SDR KIDS LAB — GENIUS TOOLS v1.0.0
   Audio Spectrum, Morse, Satellite, Puzzles, Antenna Builder
   ═══════════════════════════════════════════ */

/* ══════════════════════════════════════
   1. LIVE AUDIO SPECTRUM ANALYZER
   Uses microphone → AnalyserNode → Canvas
   ══════════════════════════════════════ */
const AudioSpectrum = (() => {
  let ctx, analyser, source, canvas, canvasCtx, animId;
  let running = false;
  const FFT_SIZE = 2048;

  async function start(canvasEl) {
    canvas = canvasEl;
    canvasCtx = canvas.getContext('2d');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.8;
      source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      running = true;
      draw();
      return true;
    } catch (e) {
      console.warn('Microphone access denied:', e);
      return false;
    }
  }

  function stop() {
    running = false;
    if (animId) cancelAnimationFrame(animId);
    if (source) source.disconnect();
    if (ctx) ctx.close();
    ctx = analyser = source = null;
  }

  function draw() {
    if (!running) return;
    animId = requestAnimationFrame(draw);

    const bufLen = analyser.frequencyBinCount;
    const data = new Uint8Array(bufLen);
    analyser.getByteFrequencyData(data);

    const W = canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
    const H = canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);

    canvasCtx.fillStyle = '#0a1628';
    canvasCtx.fillRect(0, 0, W, H);

    // Grid
    canvasCtx.strokeStyle = 'rgba(212,169,76,0.1)';
    canvasCtx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const y = (i / 10) * H;
      canvasCtx.beginPath(); canvasCtx.moveTo(0, y); canvasCtx.lineTo(W, y); canvasCtx.stroke();
    }

    // Spectrum bars
    const barW = W / bufLen * 2.5;
    const usableBins = Math.min(bufLen, Math.floor(W / barW));

    for (let i = 0; i < usableBins; i++) {
      const v = data[i] / 255;
      const barH = v * H;
      const x = i * barW;

      // Color gradient: blue → cyan → green → yellow → red
      const hue = 240 - v * 240;
      canvasCtx.fillStyle = `hsl(${hue}, 90%, ${40 + v * 30}%)`;
      canvasCtx.fillRect(x, H - barH, barW - 1, barH);
    }

    // Labels
    canvasCtx.fillStyle = '#d4a94c';
    canvasCtx.font = `${12 * (window.devicePixelRatio || 1)}px monospace`;
    const sampleRate = ctx?.sampleRate || 44100;
    const freqLabels = [100, 500, 1000, 2000, 5000, 10000];
    freqLabels.forEach(f => {
      const bin = Math.round(f / (sampleRate / FFT_SIZE));
      const x = (bin / bufLen) * W * 2.5;
      if (x < W - 30) {
        canvasCtx.fillText(f >= 1000 ? (f/1000)+'kHz' : f+'Hz', x, H - 4);
      }
    });
  }

  return { start, stop, isRunning: () => running };
})();


/* ══════════════════════════════════════
   2. MORSE CODE TRANSCEIVER
   Encode/decode + audio beeps
   ══════════════════════════════════════ */
const MorseCode = (() => {
  const CODE = {
    'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....',
    'I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.',
    'Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-',
    'Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-',
    '5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','?':'..--..','!':'-.-.--',
    '.':'.-.-.-',',':'--..--','/':'-..-.','+':'.-.-.','=':'-...-',' ':'/',
  };
  const DECODE = {};
  Object.entries(CODE).forEach(([k, v]) => DECODE[v] = k);

  const WPM = 15;
  const DOT = 1200 / WPM; // ms
  const DASH = DOT * 3;
  const GAP_ELEM = DOT;
  const GAP_CHAR = DOT * 3;
  const GAP_WORD = DOT * 7;
  const FREQ = 700; // Hz

  function encode(text) {
    return text.toUpperCase().split('').map(ch => CODE[ch] || '').join(' ');
  }

  function decode(morse) {
    return morse.trim().split(/\s{3,}/).map(word =>
      word.split(/\s+/).map(ch => DECODE[ch] || '?').join('')
    ).join(' ');
  }

  async function play(text, onSymbol) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const morse = encode(text);
    let time = ctx.currentTime + 0.1;

    for (let i = 0; i < morse.length; i++) {
      const sym = morse[i];
      if (sym === '.') {
        beep(ctx, time, DOT / 1000);
        if (onSymbol) onSymbol(sym, time - ctx.currentTime);
        time += (DOT + GAP_ELEM) / 1000;
      } else if (sym === '-') {
        beep(ctx, time, DASH / 1000);
        if (onSymbol) onSymbol(sym, time - ctx.currentTime);
        time += (DASH + GAP_ELEM) / 1000;
      } else if (sym === '/') {
        time += GAP_WORD / 1000;
      } else if (sym === ' ') {
        time += GAP_CHAR / 1000;
      }
    }

    // Wait for playback to finish
    return new Promise(resolve => setTimeout(resolve, (time - ctx.currentTime) * 1000 + 200));
  }

  function beep(ctx, startTime, duration) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = FREQ;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.3, startTime + 0.005);
    gain.gain.setValueAtTime(0.3, startTime + duration - 0.005);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Manual keying
  let keyCtx, keyOsc, keyGain, keyLog = [], keyStart = 0, keyDown = false;

  function keyInit() {
    keyCtx = new (window.AudioContext || window.webkitAudioContext)();
    keyOsc = keyCtx.createOscillator();
    keyGain = keyCtx.createGain();
    keyOsc.type = 'sine';
    keyOsc.frequency.value = FREQ;
    keyGain.gain.value = 0;
    keyOsc.connect(keyGain);
    keyGain.connect(keyCtx.destination);
    keyOsc.start();
    keyLog = [];
    keyStart = 0;
  }

  function keyPress() {
    if (!keyCtx) keyInit();
    keyDown = true;
    keyGain.gain.setValueAtTime(0.3, keyCtx.currentTime);
    keyStart = Date.now();
  }

  function keyRelease() {
    if (!keyDown) return;
    keyDown = false;
    keyGain.gain.setValueAtTime(0, keyCtx.currentTime);
    const dur = Date.now() - keyStart;
    keyLog.push({ type: dur > DOT * 2 ? '-' : '.', gap: 0 });
  }

  function keyGetMorse() {
    return keyLog.map(e => e.type).join('');
  }

  function keyReset() {
    keyLog = [];
    if (keyCtx) { keyCtx.close(); keyCtx = null; }
  }

  return { encode, decode, play, keyInit, keyPress, keyRelease, keyGetMorse, keyReset, CODE };
})();


/* ══════════════════════════════════════
   3. SATELLITE PASS PREDICTOR
   Simplified SGP4-like orbital mechanics
   ══════════════════════════════════════ */
const SatPredictor = (() => {
  const DEG = Math.PI / 180;
  const EARTH_R = 6371; // km
  const MU = 398600.4418; // km³/s² standard gravitational parameter

  // Predefined TLE-derived orbital elements (simplified)
  const SATS = {
    'ISS': { name: 'ISS (ZARYA)', freq: '145.80 MHz', alt: 420, incl: 51.6, period: 92.68, raan0: 0, argp0: 0, epoch: Date.UTC(2026, 1, 23, 0, 0, 0) },
    'NOAA-15': { name: 'NOAA 15', freq: '137.62 MHz', alt: 808, incl: 98.7, period: 101.2, raan0: 45, argp0: 90, epoch: Date.UTC(2026, 1, 23, 0, 0, 0) },
    'NOAA-18': { name: 'NOAA 18', freq: '137.9125 MHz', alt: 854, incl: 99.0, period: 102.1, raan0: 120, argp0: 180, epoch: Date.UTC(2026, 1, 23, 0, 0, 0) },
    'NOAA-19': { name: 'NOAA 19', freq: '137.10 MHz', alt: 870, incl: 99.2, period: 102.5, raan0: 200, argp0: 270, epoch: Date.UTC(2026, 1, 23, 0, 0, 0) },
    'METEOR-M2': { name: 'Meteor-M N2-3', freq: '137.90 MHz', alt: 832, incl: 98.8, period: 101.5, raan0: 280, argp0: 45, epoch: Date.UTC(2026, 1, 23, 0, 0, 0) },
  };

  // Simplified propagator: compute subsatellite point at time t
  function propagate(sat, t) {
    const elapsed = (t - sat.epoch) / 1000; // seconds
    const n = 2 * Math.PI / (sat.period * 60); // mean motion rad/s
    const meanAnomaly = (n * elapsed) % (2 * Math.PI);

    // Simplified: assume circular orbit
    const raan = (sat.raan0 * DEG + 0.9856 * DEG / 86400 * elapsed) % (2 * Math.PI); // rough RAAN drift
    const argLat = sat.argp0 * DEG + meanAnomaly;

    // Subsatellite point (simplified ECI → lat/lon)
    const lat = Math.asin(Math.sin(sat.incl * DEG) * Math.sin(argLat));
    // Earth rotation
    const gmst = (280.46061837 + 360.98564736629 * (elapsed / 86400)) * DEG;
    const lon = Math.atan2(
      Math.sin(raan) * Math.cos(sat.incl * DEG) * Math.cos(argLat) + Math.cos(raan) * Math.sin(argLat) * Math.cos(sat.incl * DEG) - Math.sin(sat.incl * DEG) * Math.sin(argLat) * Math.sin(raan),
      Math.cos(raan) * Math.cos(argLat) - Math.sin(raan) * Math.sin(argLat) * Math.cos(sat.incl * DEG)
    ) - gmst;

    return {
      lat: lat / DEG,
      lon: ((lon / DEG) % 360 + 540) % 360 - 180,
      alt: sat.alt,
    };
  }

  // Calculate elevation from observer
  function elevation(obsLat, obsLon, satLat, satLon, satAlt) {
    const dLat = (satLat - obsLat) * DEG;
    const dLon = (satLon - obsLon) * DEG;
    const a = Math.sin(dLat/2)**2 + Math.cos(obsLat*DEG) * Math.cos(satLat*DEG) * Math.sin(dLon/2)**2;
    const groundDist = 2 * EARTH_R * Math.asin(Math.sqrt(a));
    const slantRange = Math.sqrt(groundDist**2 + satAlt**2);
    return Math.atan2(satAlt - groundDist * Math.tan(0), groundDist) / DEG;
  }

  // Predict next passes for a satellite from observer location
  function predictPasses(satKey, obsLat, obsLon, hours = 24) {
    const sat = SATS[satKey];
    if (!sat) return [];

    const now = Date.now();
    const stepMs = 30 * 1000; // 30-second steps
    const endTime = now + hours * 3600 * 1000;
    const passes = [];
    let inPass = false;
    let passStart = null;
    let maxEl = 0;
    let maxElTime = 0;

    for (let t = now; t < endTime; t += stepMs) {
      const pos = propagate(sat, t);
      const el = elevation(obsLat, obsLon, pos.lat, pos.lon, pos.alt);

      if (el > 5 && !inPass) {
        inPass = true;
        passStart = t;
        maxEl = el;
        maxElTime = t;
      } else if (el > 5 && inPass) {
        if (el > maxEl) { maxEl = el; maxElTime = t; }
      } else if (el <= 5 && inPass) {
        inPass = false;
        passes.push({
          satellite: sat.name,
          freq: sat.freq,
          aos: new Date(passStart),
          los: new Date(t),
          maxEl: Math.round(maxEl),
          maxElTime: new Date(maxElTime),
          duration: Math.round((t - passStart) / 60000),
        });
        if (passes.length >= 10) break;
      }
    }
    return passes;
  }

  // Render sky map (polar plot)
  function renderSkyMap(canvas, satKey, obsLat, obsLon) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width = canvas.offsetWidth * dpr;
    const H = canvas.height = canvas.offsetHeight * dpr;
    const cx = W / 2, cy = H / 2;
    const R = Math.min(cx, cy) - 20 * dpr;

    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, W, H);

    // Circles (elevation rings)
    [90, 60, 30, 0].forEach((el, i) => {
      const r = R * (1 - el / 90);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212,169,76,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = 'rgba(212,169,76,0.5)';
      ctx.font = `${10 * dpr}px monospace`;
      ctx.fillText(el + '°', cx + 3, cy - r + 12 * dpr);
    });

    // Cardinal directions
    ctx.fillStyle = '#d4a94c';
    ctx.font = `bold ${13 * dpr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('N', cx, cy - R - 5 * dpr);
    ctx.fillText('S', cx, cy + R + 15 * dpr);
    ctx.fillText('E', cx + R + 12 * dpr, cy + 4 * dpr);
    ctx.fillText('W', cx - R - 12 * dpr, cy + 4 * dpr);

    // Plot satellite track for next pass
    const sat = SATS[satKey];
    if (!sat) return;

    const now = Date.now();
    const stepMs = 10000;
    let points = [];
    let visible = false;

    for (let t = now; t < now + 3600000; t += stepMs) {
      const pos = propagate(sat, t);
      const el = elevation(obsLat, obsLon, pos.lat, pos.lon, pos.alt);
      if (el > 0) {
        visible = true;
        const dLon = (pos.lon - obsLon) * (Math.PI / 180);
        const dLat = (pos.lat - obsLat) * (Math.PI / 180);
        const az = Math.atan2(Math.sin(dLon), Math.cos(obsLat * Math.PI/180) * Math.tan(pos.lat * Math.PI/180) - Math.sin(obsLat * Math.PI/180) * Math.cos(dLon));
        const r = R * (1 - el / 90);
        const px = cx + r * Math.sin(az);
        const py = cy - r * Math.cos(az);
        points.push({ x: px, y: py, el, t });
      } else if (visible) break;
    }

    if (points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = '#00e676';
      ctx.lineWidth = 2 * dpr;
      ctx.stroke();

      // Mark start and end
      ctx.fillStyle = '#00e676';
      ctx.beginPath(); ctx.arc(points[0].x, points[0].y, 4 * dpr, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ff5252';
      ctx.beginPath(); ctx.arc(points[points.length-1].x, points[points.length-1].y, 4 * dpr, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(212,169,76,0.6)';
      ctx.font = `${12 * dpr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('No pass visible right now — check the table below', cx, cy);
    }
  }

  return { SATS, propagate, elevation, predictPasses, renderSkyMap };
})();


/* ══════════════════════════════════════
   4. SIGNAL DECODING PUZZLE GAME
   Progressive difficulty spectrum puzzles
   ══════════════════════════════════════ */
const SignalPuzzle = (() => {
  const LEVELS = [
    {
      name: 'Level 1: Find the FM Station',
      description: 'A local FM station is broadcasting. Find it on the spectrum and identify its frequency.',
      signals: [{ freq: 98.5e6, power: -25, label: 'FM Station', bw: 200000 }],
      noise: -95,
      question: 'What frequency is the FM station broadcasting on?',
      answer: '98.5',
      unit: 'MHz',
      hint: 'Look for the tallest peak in the FM band (88-108 MHz)',
      range: [88e6, 108e6],
    },
    {
      name: 'Level 2: Aircraft Overhead',
      description: 'An aircraft is broadcasting ADS-B. Find the signal!',
      signals: [
        { freq: 1090e6, power: -40, label: 'ADS-B', bw: 2000000 },
        { freq: 1085e6, power: -70, label: 'Noise spike', bw: 100000 },
      ],
      noise: -90,
      question: 'ADS-B broadcasts on what frequency?',
      answer: '1090',
      unit: 'MHz',
      hint: 'ADS-B is always on the same frequency — look for the strongest signal',
      range: [1080e6, 1100e6],
    },
    {
      name: 'Level 3: Weather Satellite',
      description: 'A NOAA satellite is passing overhead. Can you find its APT signal among the noise?',
      signals: [
        { freq: 137.1e6, power: -55, label: 'NOAA-19', bw: 40000 },
        { freq: 137.5e6, power: -75, label: 'Interference', bw: 20000 },
        { freq: 136.8e6, power: -80, label: 'Noise', bw: 50000 },
      ],
      noise: -85,
      question: 'What frequency is NOAA-19 transmitting on?',
      answer: '137.1',
      unit: 'MHz',
      hint: 'NOAA satellites use frequencies around 137 MHz',
      range: [136e6, 138e6],
    },
    {
      name: 'Level 4: Hidden Message',
      description: 'Someone is transmitting Morse code on a ham frequency. Find it and identify the modulation.',
      signals: [
        { freq: 14.060e6, power: -45, label: 'CW/Morse', bw: 500 },
        { freq: 14.100e6, power: -60, label: 'SSB Voice', bw: 3000 },
        { freq: 14.200e6, power: -50, label: 'SSB Voice 2', bw: 3000 },
      ],
      noise: -100,
      question: 'What is the narrowest signal? (This is the Morse/CW signal)',
      answer: '14.060',
      unit: 'MHz',
      hint: 'CW/Morse signals are very narrow — only about 500 Hz wide',
      range: [14e6, 14.3e6],
    },
    {
      name: 'Level 5: IoT Sensor Hunt',
      description: 'Multiple IoT sensors are transmitting in the ISM band. Count the unique signals.',
      signals: [
        { freq: 433.92e6, power: -50, label: 'Temp Sensor', bw: 20000 },
        { freq: 433.85e6, power: -55, label: 'Rain Gauge', bw: 20000 },
        { freq: 434.00e6, power: -60, label: 'Door Sensor', bw: 15000 },
        { freq: 433.78e6, power: -65, label: 'Car Key Fob', bw: 30000 },
      ],
      noise: -90,
      question: 'How many distinct signals can you count?',
      answer: '4',
      unit: 'signals',
      hint: 'Look carefully — some signals are weaker but still visible above the noise',
      range: [433.5e6, 434.5e6],
    },
  ];

  let currentLevel = 0;
  let puzzleSpectrum = null;
  let score = 0;

  function renderPuzzle(canvas, level) {
    const L = LEVELS[level];
    if (!L) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width = canvas.offsetWidth * dpr;
    const H = canvas.height = canvas.offsetHeight * dpr;

    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, W, H);

    const [minF, maxF] = L.range;
    const fRange = maxF - minF;

    // Grid
    ctx.strokeStyle = 'rgba(212,169,76,0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * W;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      const y = (i / 10) * H;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Noise floor
    const noiseY = H * (1 - (L.noise + 120) / 100);

    // Draw noise
    ctx.beginPath();
    for (let x = 0; x < W; x++) {
      const noise = noiseY + (Math.random() - 0.5) * 8 * dpr;
      if (x === 0) ctx.moveTo(x, noise);
      else ctx.lineTo(x, noise);
    }
    ctx.strokeStyle = 'rgba(0, 200, 100, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw signals
    L.signals.forEach(sig => {
      const cx = ((sig.freq - minF) / fRange) * W;
      const peakY = H * (1 - (sig.power + 120) / 100);
      const bwPixels = (sig.bw / fRange) * W;

      // Gaussian signal shape
      ctx.beginPath();
      for (let px = -bwPixels * 2; px <= bwPixels * 2; px++) {
        const x = cx + px;
        if (x < 0 || x > W) continue;
        const gaussian = Math.exp(-(px * px) / (2 * (bwPixels / 2) ** 2));
        const y = noiseY - (noiseY - peakY) * gaussian + (Math.random() - 0.5) * 3 * dpr;
        if (px === -bwPixels * 2) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#00e676';
      ctx.lineWidth = 2 * dpr;
      ctx.stroke();
    });

    // Freq labels
    ctx.fillStyle = '#d4a94c';
    ctx.font = `${11 * dpr}px monospace`;
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const f = minF + (i / 5) * fRange;
      const x = (i / 5) * W;
      let label;
      if (f >= 1e9) label = (f / 1e6).toFixed(0) + ' MHz';
      else if (f >= 1e6) label = (f / 1e6).toFixed(f < 100e6 ? 3 : 1) + ' MHz';
      else label = (f / 1e3).toFixed(0) + ' kHz';
      ctx.fillText(label, x, H - 4 * dpr);
    }

    // Power labels
    ctx.textAlign = 'left';
    for (let db = -120; db <= -20; db += 20) {
      const y = H * (1 - (db + 120) / 100);
      ctx.fillText(db + ' dB', 4 * dpr, y);
    }
  }

  function checkAnswer(input) {
    const L = LEVELS[currentLevel];
    if (!L) return { correct: false, message: 'No level loaded' };
    const userAns = input.trim().replace(/[^\d.]/g, '');
    const correct = userAns === L.answer;
    if (correct) {
      score += (currentLevel + 1) * 10;
      return { correct: true, message: `✅ Correct! ${L.signals[0]?.label || 'Signal'} found at ${L.answer} ${L.unit}. +${(currentLevel+1)*10} points!` };
    }
    return { correct: false, message: `❌ Not quite. Hint: ${L.hint}` };
  }

  function nextLevel() {
    if (currentLevel < LEVELS.length - 1) currentLevel++;
    return LEVELS[currentLevel];
  }

  function getLevel() { return LEVELS[currentLevel]; }
  function getLevelNum() { return currentLevel; }
  function getScore() { return score; }
  function reset() { currentLevel = 0; score = 0; }
  function getTotalLevels() { return LEVELS.length; }

  return { renderPuzzle, checkAnswer, nextLevel, getLevel, getLevelNum, getScore, reset, getTotalLevels, LEVELS };
})();


/* ══════════════════════════════════════
   5. ANTENNA BUILDER CALCULATOR
   Input freq → exact cut lengths + diagram
   ══════════════════════════════════════ */
const AntennaBuilder = (() => {
  const C = 299792458; // speed of light m/s
  const VF = 0.95; // velocity factor for wire

  function calculate(freqMHz) {
    const f = freqMHz * 1e6;
    const wavelength = C / f;
    const wl = wavelength * VF;

    return {
      frequency: freqMHz,
      wavelength: wavelength,
      dipole: {
        name: 'Half-Wave Dipole',
        totalLength: (wl / 2 * 100).toFixed(1), // cm
        eachSide: (wl / 4 * 100).toFixed(1),
        impedance: '~73Ω',
        gain: '2.15 dBi',
        description: 'Simplest antenna. Two equal wires, fed in the center.',
      },
      quarterWave: {
        name: 'Quarter-Wave Ground Plane',
        vertical: (wl / 4 * 100).toFixed(1),
        radials: (wl / 4 * 100).toFixed(1),
        numRadials: 4,
        impedance: '~36Ω (50Ω with angled radials)',
        gain: '2.15 dBi',
        description: 'Vertical antenna with ground plane radials at 45°.',
      },
      yagi: {
        name: '3-Element Yagi',
        reflector: (wl / 2 * 1.05 * 100).toFixed(1),
        driven: (wl / 2 * 100).toFixed(1),
        director: (wl / 2 * 0.91 * 100).toFixed(1),
        spacing: (wl * 0.2 * 100).toFixed(1),
        impedance: '~50Ω (with matching)',
        gain: '~7.1 dBi',
        description: 'Directional antenna. Point the director toward the signal source.',
      },
      slimJim: {
        name: 'Slim Jim (J-pole variant)',
        totalLength: (wl * 3/4 * 100).toFixed(1),
        halfWave: (wl / 2 * 100).toFixed(1),
        quarterWave: (wl / 4 * 100).toFixed(1),
        gap: (wl * 0.02 * 100).toFixed(1),
        impedance: '~50Ω (at feed point)',
        gain: '~3 dBi',
        description: 'End-fed half-wave with built-in matching section. Great for VHF/UHF.',
      },
    };
  }

  function render(canvas, data) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width = canvas.offsetWidth * dpr;
    const H = canvas.height = canvas.offsetHeight * dpr;

    ctx.fillStyle = '#0a1628';
    ctx.fillRect(0, 0, W, H);

    const pad = 30 * dpr;
    const colW = (W - pad * 2) / 4;

    // Draw 4 antenna types
    const types = [
      { name: 'Dipole', draw: drawDipole },
      { name: 'Ground Plane', draw: drawGroundPlane },
      { name: '3-Element Yagi', draw: drawYagi },
      { name: 'Slim Jim', draw: drawSlimJim },
    ];

    types.forEach((type, i) => {
      const cx = pad + colW * i + colW / 2;
      const top = pad + 20 * dpr;
      const bot = H - pad - 20 * dpr;
      type.draw(ctx, cx, top, bot, colW * 0.8, data, dpr);

      // Label
      ctx.fillStyle = '#d4a94c';
      ctx.font = `bold ${11 * dpr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(type.name, cx, H - 8 * dpr);
    });

    // Title
    ctx.fillStyle = '#e8eef4';
    ctx.font = `bold ${14 * dpr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`Antenna Dimensions for ${data.frequency} MHz (λ = ${(data.wavelength * 100).toFixed(1)} cm)`, W / 2, 18 * dpr);
  }

  function drawDipole(ctx, cx, top, bot, w, data, dpr) {
    const mid = (top + bot) / 2;
    const armLen = Math.min((bot - top) * 0.35, w * 0.9);
    ctx.strokeStyle = '#00e676';
    ctx.lineWidth = 3 * dpr;
    // Left arm
    ctx.beginPath(); ctx.moveTo(cx, mid); ctx.lineTo(cx - armLen, mid); ctx.stroke();
    // Right arm
    ctx.beginPath(); ctx.moveTo(cx, mid); ctx.lineTo(cx + armLen, mid); ctx.stroke();
    // Feed point
    ctx.fillStyle = '#ff5252';
    ctx.beginPath(); ctx.arc(cx, mid, 4 * dpr, 0, Math.PI * 2); ctx.fill();
    // Feedline
    ctx.strokeStyle = '#5a6f87';
    ctx.lineWidth = 1.5 * dpr;
    ctx.beginPath(); ctx.moveTo(cx, mid); ctx.lineTo(cx, bot - 10 * dpr); ctx.stroke();
    // Label
    ctx.fillStyle = '#e8eef4';
    ctx.font = `${10 * dpr}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(data.dipole.eachSide + ' cm', cx - armLen / 2, mid - 8 * dpr);
    ctx.fillText(data.dipole.eachSide + ' cm', cx + armLen / 2, mid - 8 * dpr);
  }

  function drawGroundPlane(ctx, cx, top, bot, w, data, dpr) {
    const feedY = (top + bot) * 0.55;
    const vertLen = Math.min((feedY - top) * 0.8, w * 0.7);
    const radLen = vertLen * 0.7;
    ctx.strokeStyle = '#00e676';
    ctx.lineWidth = 3 * dpr;
    // Vertical
    ctx.beginPath(); ctx.moveTo(cx, feedY); ctx.lineTo(cx, feedY - vertLen); ctx.stroke();
    // Radials
    ctx.strokeStyle = '#42a5f5';
    for (let a = -60; a <= 60; a += 40) {
      const rad = a * Math.PI / 180;
      ctx.beginPath(); ctx.moveTo(cx, feedY);
      ctx.lineTo(cx + Math.sin(rad) * radLen, feedY + Math.cos(rad) * radLen * 0.5);
      ctx.stroke();
    }
    // Feed
    ctx.fillStyle = '#ff5252';
    ctx.beginPath(); ctx.arc(cx, feedY, 4 * dpr, 0, Math.PI * 2); ctx.fill();
    // Labels
    ctx.fillStyle = '#e8eef4';
    ctx.font = `${10 * dpr}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(data.quarterWave.vertical + ' cm', cx + 15 * dpr, feedY - vertLen / 2);
  }

  function drawYagi(ctx, cx, top, bot, w, data, dpr) {
    const spacing = Math.min((bot - top) * 0.2, 40 * dpr);
    const mid = (top + bot) / 2;
    const maxLen = w * 0.45;
    const elements = [
      { y: mid - spacing, len: maxLen * 1.05, color: '#42a5f5', label: 'Reflector' },
      { y: mid, len: maxLen, color: '#00e676', label: 'Driven' },
      { y: mid + spacing, len: maxLen * 0.91, color: '#ffab40', label: 'Director' },
    ];
    elements.forEach(e => {
      ctx.strokeStyle = e.color;
      ctx.lineWidth = 3 * dpr;
      ctx.beginPath(); ctx.moveTo(cx - e.len, e.y); ctx.lineTo(cx + e.len, e.y); ctx.stroke();
    });
    // Boom
    ctx.strokeStyle = '#5a6f87';
    ctx.lineWidth = 1.5 * dpr;
    ctx.beginPath(); ctx.moveTo(cx, mid - spacing - 10); ctx.lineTo(cx, mid + spacing + 10); ctx.stroke();
    // Feed
    ctx.fillStyle = '#ff5252';
    ctx.beginPath(); ctx.arc(cx, mid, 4 * dpr, 0, Math.PI * 2); ctx.fill();
    // Arrow
    ctx.fillStyle = '#d4a94c';
    ctx.font = `${10 * dpr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('→ Signal', cx, mid + spacing + 25 * dpr);
    ctx.fillText(data.yagi.spacing + ' cm', cx + maxLen * 0.5 + 5, mid - spacing / 2);
  }

  function drawSlimJim(ctx, cx, top, bot, w, data, dpr) {
    const totalH = (bot - top) * 0.8;
    const halfH = totalH * 2/3;
    const qtrH = totalH * 1/3;
    const gap = 6 * dpr;
    const barW = 15 * dpr;
    const startY = top + (bot - top) * 0.1;

    ctx.strokeStyle = '#00e676';
    ctx.lineWidth = 3 * dpr;
    // Left side (full length)
    ctx.beginPath(); ctx.moveTo(cx - barW, startY); ctx.lineTo(cx - barW, startY + totalH); ctx.stroke();
    // Right side (half wave)
    ctx.beginPath(); ctx.moveTo(cx + barW, startY); ctx.lineTo(cx + barW, startY + halfH); ctx.stroke();
    // Top connection
    ctx.beginPath(); ctx.moveTo(cx - barW, startY); ctx.lineTo(cx + barW, startY); ctx.stroke();
    // Bottom stub
    ctx.beginPath(); ctx.moveTo(cx - barW, startY + totalH); ctx.lineTo(cx - barW, startY + totalH - qtrH + gap); ctx.stroke();
    // Feed point
    ctx.fillStyle = '#ff5252';
    const feedY = startY + halfH + qtrH * 0.3;
    ctx.beginPath(); ctx.arc(cx - barW - 3, feedY, 3 * dpr, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = '#e8eef4';
    ctx.font = `${9 * dpr}px monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(data.slimJim.totalLength + ' cm', cx + barW + 5, startY + totalH / 2);
  }

  return { calculate, render };
})();


/* ══════════════════════════════════════
   GENIUS TOOLS — INIT & WIRING
   ══════════════════════════════════════ */
const GeniusTools = (() => {
  function init() {
    wireAudioSpectrum();
    wireMorse();
    wireSatellite();
    wirePuzzle();
    wireAntennaBuilder();
  }

  function wireAudioSpectrum() {
    const btn = document.getElementById('audio-spectrum-btn');
    const canvas = document.getElementById('audio-spectrum-canvas');
    if (!btn || !canvas) return;

    btn.addEventListener('click', async () => {
      if (AudioSpectrum.isRunning()) {
        AudioSpectrum.stop();
        btn.textContent = '🎤 Start Listening';
        btn.classList.remove('btn--active');
      } else {
        const ok = await AudioSpectrum.start(canvas);
        if (ok) {
          btn.textContent = '⏹️ Stop';
          btn.classList.add('btn--active');
        } else {
          if (typeof SDRNotify !== 'undefined') SDRNotify.show('🎤 Microphone access denied. Please allow microphone in your browser settings.', 'warning');
        }
      }
    });
  }

  function wireMorse() {
    const input = document.getElementById('morse-input');
    const output = document.getElementById('morse-output');
    const playBtn = document.getElementById('morse-play');
    const decodeInput = document.getElementById('morse-decode-input');
    const decodeOutput = document.getElementById('morse-decode-output');
    const keyBtn = document.getElementById('morse-key');
    const keyOutput = document.getElementById('morse-key-output');
    const keyDecoded = document.getElementById('morse-key-decoded');
    const keyResetBtn = document.getElementById('morse-key-reset');

    if (input && output) {
      input.addEventListener('input', () => {
        output.textContent = MorseCode.encode(input.value);
      });
    }

    if (playBtn && input) {
      playBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return;
        playBtn.disabled = true;
        playBtn.textContent = '🔊 Playing...';
        MorseCode.play(text).then(() => {
          playBtn.disabled = false;
          playBtn.textContent = '🔊 Play';
        });
      });
    }

    if (decodeInput && decodeOutput) {
      decodeInput.addEventListener('input', () => {
        decodeOutput.textContent = MorseCode.decode(decodeInput.value);
      });
    }

    if (keyBtn) {
      const onDown = () => { MorseCode.keyPress(); keyBtn.classList.add('btn--active'); };
      const onUp = () => {
        MorseCode.keyRelease();
        keyBtn.classList.remove('btn--active');
        if (keyOutput) keyOutput.textContent = MorseCode.keyGetMorse();
        if (keyDecoded) keyDecoded.textContent = MorseCode.decode(MorseCode.keyGetMorse());
      };
      keyBtn.addEventListener('mousedown', onDown);
      keyBtn.addEventListener('mouseup', onUp);
      keyBtn.addEventListener('mouseleave', onUp);
      keyBtn.addEventListener('touchstart', (e) => { e.preventDefault(); onDown(); });
      keyBtn.addEventListener('touchend', (e) => { e.preventDefault(); onUp(); });
    }

    if (keyResetBtn) {
      keyResetBtn.addEventListener('click', () => {
        MorseCode.keyReset();
        if (keyOutput) keyOutput.textContent = '';
        if (keyDecoded) keyDecoded.textContent = '';
      });
    }
  }

  function wireSatellite() {
    const predictBtn = document.getElementById('sat-predict-btn');
    const satSelect = document.getElementById('sat-select');
    const resultsEl = document.getElementById('sat-results');
    const skyCanvas = document.getElementById('sat-sky-canvas');
    if (!predictBtn) return;

    predictBtn.addEventListener('click', () => {
      // Use Paris as default (from user's location)
      const lat = 48.8566;
      const lon = 2.3522;
      const satKey = satSelect?.value || 'ISS';

      // Sky map
      if (skyCanvas) SatPredictor.renderSkyMap(skyCanvas, satKey, lat, lon);

      // Passes table
      const passes = SatPredictor.predictPasses(satKey, lat, lon, 24);
      if (resultsEl) {
        if (passes.length === 0) {
          resultsEl.innerHTML = '<p style="color:var(--color-text-secondary)">No passes found in the next 24 hours. Try a different satellite.</p>';
        } else {
          resultsEl.innerHTML = `<table class="mc-table" style="width:100%">
            <thead><tr><th>AOS</th><th>Max El</th><th>Duration</th><th>LOS</th></tr></thead>
            <tbody>${passes.map(p => `<tr>
              <td>${p.aos.toLocaleTimeString()}</td>
              <td>${p.maxEl}°</td>
              <td>${p.duration} min</td>
              <td>${p.los.toLocaleTimeString()}</td>
            </tr>`).join('')}</tbody>
          </table>`;
        }
      }
    });
  }

  function wirePuzzle() {
    const canvas = document.getElementById('puzzle-canvas');
    const questionEl = document.getElementById('puzzle-question');
    const answerInput = document.getElementById('puzzle-answer');
    const checkBtn = document.getElementById('puzzle-check');
    const feedbackEl = document.getElementById('puzzle-feedback');
    const nextBtn = document.getElementById('puzzle-next');
    const scoreEl = document.getElementById('puzzle-score');
    const levelEl = document.getElementById('puzzle-level');
    if (!canvas || !checkBtn) return;

    function loadLevel() {
      const L = SignalPuzzle.getLevel();
      SignalPuzzle.renderPuzzle(canvas, SignalPuzzle.getLevelNum());
      if (questionEl) questionEl.innerHTML = `<strong>${L.name}</strong><br>${L.description}<br><br>❓ ${L.question}`;
      if (answerInput) { answerInput.value = ''; answerInput.placeholder = L.unit; }
      if (feedbackEl) feedbackEl.textContent = '';
      if (nextBtn) nextBtn.hidden = true;
      if (scoreEl) scoreEl.textContent = SignalPuzzle.getScore();
      if (levelEl) levelEl.textContent = (SignalPuzzle.getLevelNum() + 1) + '/' + SignalPuzzle.getTotalLevels();
    }

    checkBtn.addEventListener('click', () => {
      const result = SignalPuzzle.checkAnswer(answerInput?.value || '');
      if (feedbackEl) {
        feedbackEl.textContent = result.message;
        feedbackEl.style.color = result.correct ? '#00e676' : '#ff5252';
      }
      if (result.correct) {
        if (scoreEl) scoreEl.textContent = SignalPuzzle.getScore();
        if (nextBtn && SignalPuzzle.getLevelNum() < SignalPuzzle.getTotalLevels() - 1) nextBtn.hidden = false;
        if (typeof SDRSound !== 'undefined') SDRSound.play('correct');
      } else {
        if (typeof SDRSound !== 'undefined') SDRSound.play('wrong');
      }
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        SignalPuzzle.nextLevel();
        loadLevel();
      });
    }

    loadLevel();
  }

  function wireAntennaBuilder() {
    const freqInput = document.getElementById('antenna-freq-input');
    const calcBtn = document.getElementById('antenna-calc-btn');
    const canvas = document.getElementById('antenna-builder-canvas');
    const resultsEl = document.getElementById('antenna-results');
    if (!calcBtn) return;

    function doCalc() {
      const freq = parseFloat(freqInput?.value || 145);
      if (isNaN(freq) || freq < 1 || freq > 10000) return;
      const data = AntennaBuilder.calculate(freq);
      if (canvas) AntennaBuilder.render(canvas, data);
      if (resultsEl) {
        resultsEl.innerHTML = [data.dipole, data.quarterWave, data.yagi, data.slimJim].map(a => `
          <div class="antenna-result">
            <strong>${a.name}</strong>
            <p>${a.description}</p>
            <p>Impedance: ${a.impedance} · Gain: ${a.gain}</p>
            ${a.totalLength ? `<p>Total length: <strong>${a.totalLength} cm</strong></p>` : ''}
            ${a.eachSide ? `<p>Each side: <strong>${a.eachSide} cm</strong></p>` : ''}
            ${a.vertical ? `<p>Vertical: <strong>${a.vertical} cm</strong> · Radials: ${a.numRadials}× <strong>${a.radials} cm</strong></p>` : ''}
            ${a.reflector ? `<p>Reflector: <strong>${a.reflector} cm</strong> · Driven: <strong>${a.driven} cm</strong> · Director: <strong>${a.director} cm</strong> · Spacing: <strong>${a.spacing} cm</strong></p>` : ''}
          </div>
        `).join('');
      }
    }

    calcBtn.addEventListener('click', doCalc);
    if (freqInput) freqInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doCalc(); });

    // Auto-calculate on load with default
    doCalc();
  }

  return { init };
})();

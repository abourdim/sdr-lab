/* ═══════════════════════════════════════════
   SDR KIDS LAB — SIGNAL GENERATOR v0.2.0
   Procedural signal generation for simulations
   ═══════════════════════════════════════════ */

class SignalGenerator {
  constructor() {
    this.sampleRate = 48000;
    this.time = 0;
  }

  /* ── BASIC WAVEFORMS ── */
  sine(freq, amplitude = 1, phase = 0) {
    return amplitude * Math.sin(2 * Math.PI * freq * this.time + phase);
  }

  square(freq, amplitude = 1) {
    return amplitude * Math.sign(Math.sin(2 * Math.PI * freq * this.time));
  }

  sawtooth(freq, amplitude = 1) {
    const t = (this.time * freq) % 1;
    return amplitude * (2 * t - 1);
  }

  triangle(freq, amplitude = 1) {
    const t = (this.time * freq) % 1;
    return amplitude * (4 * Math.abs(t - 0.5) - 1);
  }

  noise(amplitude = 1) {
    return amplitude * (Math.random() * 2 - 1);
  }

  /* ── AM MODULATION ── */
  generateAM(carrierFreq, messageFreq, modulationIndex = 0.5, duration = 1) {
    const samples = Math.floor(duration * this.sampleRate);
    const output = new Float32Array(samples);
    const dt = 1 / this.sampleRate;

    for (let i = 0; i < samples; i++) {
      const t = i * dt;
      const message = Math.sin(2 * Math.PI * messageFreq * t);
      const carrier = Math.sin(2 * Math.PI * carrierFreq * t);
      output[i] = (1 + modulationIndex * message) * carrier;
    }
    return output;
  }

  /* ── FM MODULATION ── */
  generateFM(carrierFreq, messageFreq, freqDeviation = 75000, duration = 1) {
    const samples = Math.floor(duration * this.sampleRate);
    const output = new Float32Array(samples);
    const dt = 1 / this.sampleRate;
    let phase = 0;

    for (let i = 0; i < samples; i++) {
      const t = i * dt;
      const message = Math.sin(2 * Math.PI * messageFreq * t);
      const instantFreq = carrierFreq + freqDeviation * message;
      phase += 2 * Math.PI * instantFreq * dt;
      output[i] = Math.sin(phase);
    }
    return output;
  }

  /* ── DIGITAL SIGNALS ── */
  generateASK(carrierFreq, bitRate, data = [1, 0, 1, 1, 0], duration = null) {
    const bitDuration = 1 / bitRate;
    const totalDuration = duration || data.length * bitDuration;
    const samples = Math.floor(totalDuration * this.sampleRate);
    const output = new Float32Array(samples);
    const dt = 1 / this.sampleRate;

    for (let i = 0; i < samples; i++) {
      const t = i * dt;
      const bitIndex = Math.floor(t / bitDuration) % data.length;
      const carrier = Math.sin(2 * Math.PI * carrierFreq * t);
      output[i] = data[bitIndex] ? carrier : 0;
    }
    return output;
  }

  generateFSK(freq0, freq1, bitRate, data = [1, 0, 1, 1, 0], duration = null) {
    const bitDuration = 1 / bitRate;
    const totalDuration = duration || data.length * bitDuration;
    const samples = Math.floor(totalDuration * this.sampleRate);
    const output = new Float32Array(samples);
    const dt = 1 / this.sampleRate;
    let phase = 0;

    for (let i = 0; i < samples; i++) {
      const t = i * dt;
      const bitIndex = Math.floor(t / bitDuration) % data.length;
      const freq = data[bitIndex] ? freq1 : freq0;
      phase += 2 * Math.PI * freq * dt;
      output[i] = Math.sin(phase);
    }
    return output;
  }

  generatePSK(carrierFreq, bitRate, data = [1, 0, 1, 1, 0], duration = null) {
    const bitDuration = 1 / bitRate;
    const totalDuration = duration || data.length * bitDuration;
    const samples = Math.floor(totalDuration * this.sampleRate);
    const output = new Float32Array(samples);
    const dt = 1 / this.sampleRate;

    for (let i = 0; i < samples; i++) {
      const t = i * dt;
      const bitIndex = Math.floor(t / bitDuration) % data.length;
      const phaseShift = data[bitIndex] ? 0 : Math.PI;
      output[i] = Math.sin(2 * Math.PI * carrierFreq * t + phaseShift);
    }
    return output;
  }

  /* ── MORSE CODE ── */
  generateMorse(carrierFreq, text, wpm = 15) {
    const MORSE_TABLE = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
      'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
      'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
      'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
      'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
      '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
      '8': '---..', '9': '----.', ' ': ' '
    };

    const dotDuration = 1.2 / wpm;
    const dashDuration = dotDuration * 3;
    const symbolGap = dotDuration;
    const letterGap = dotDuration * 3;
    const wordGap = dotDuration * 7;

    // Calculate total duration
    let totalTime = 0;
    const events = [];
    
    for (const char of text.toUpperCase()) {
      if (char === ' ') {
        totalTime += wordGap;
        continue;
      }
      const morse = MORSE_TABLE[char];
      if (!morse) continue;

      for (let j = 0; j < morse.length; j++) {
        const dur = morse[j] === '.' ? dotDuration : dashDuration;
        events.push({ start: totalTime, duration: dur });
        totalTime += dur + symbolGap;
      }
      totalTime += letterGap - symbolGap;
    }

    const samples = Math.floor(totalTime * this.sampleRate);
    const output = new Float32Array(samples);
    const dt = 1 / this.sampleRate;

    for (const evt of events) {
      const startSample = Math.floor(evt.start * this.sampleRate);
      const endSample = Math.floor((evt.start + evt.duration) * this.sampleRate);
      for (let i = startSample; i < Math.min(endSample, samples); i++) {
        output[i] = Math.sin(2 * Math.PI * carrierFreq * i * dt);
      }
    }

    return { samples: output, duration: totalTime, events };
  }

  /* ── NOISE GENERATORS ── */
  whiteNoise(duration = 1, amplitude = 1) {
    const samples = Math.floor(duration * this.sampleRate);
    const output = new Float32Array(samples);
    for (let i = 0; i < samples; i++) {
      output[i] = amplitude * (Math.random() * 2 - 1);
    }
    return output;
  }

  /* ── SPECTRUM PROFILE GENERATOR ── */
  static createSignalProfile(config) {
    return {
      freq: config.freq || 100e6,
      bandwidth: config.bandwidth || 200e3,
      power: config.power || -40,
      modulation: config.modulation || 'fm',
      label: config.label || '',
      color: config.color || null,
      active: true,
      ...config
    };
  }

  /* ── ADVANCE TIME ── */
  tick(dt) {
    this.time += dt || (1 / this.sampleRate);
  }

  reset() {
    this.time = 0;
  }
}

window.SignalGenerator = SignalGenerator;

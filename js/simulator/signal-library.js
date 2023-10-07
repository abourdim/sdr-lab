/* ═══════════════════════════════════════════
   SDR KIDS LAB — SIGNAL LIBRARY v0.2.0
   Pre-built realistic signal profiles
   ═══════════════════════════════════════════ */

const SignalLibrary = {
  /* ── FM BROADCAST STATIONS ── */
  fm: [
    { freq: 88.1e6, bandwidth: 200e3, power: -35, modulation: 'fm', label: 'FM 88.1' },
    { freq: 91.5e6, bandwidth: 200e3, power: -30, modulation: 'fm', label: 'FM 91.5' },
    { freq: 95.8e6, bandwidth: 200e3, power: -25, modulation: 'fm', label: 'FM 95.8' },
    { freq: 99.7e6, bandwidth: 200e3, power: -28, modulation: 'fm', label: 'FM 99.7' },
    { freq: 101.1e6, bandwidth: 200e3, power: -32, modulation: 'fm', label: 'FM 101.1' },
    { freq: 104.3e6, bandwidth: 200e3, power: -27, modulation: 'fm', label: 'FM 104.3' },
    { freq: 107.9e6, bandwidth: 200e3, power: -40, modulation: 'fm', label: 'FM 107.9' },
  ],

  /* ── AM BROADCAST ── */
  am: [
    { freq: 540e3, bandwidth: 10e3, power: -45, modulation: 'am', label: 'AM 540' },
    { freq: 720e3, bandwidth: 10e3, power: -40, modulation: 'am', label: 'AM 720' },
    { freq: 1080e3, bandwidth: 10e3, power: -50, modulation: 'am', label: 'AM 1080' },
  ],

  /* ── AVIATION ── */
  aviation: [
    { freq: 121.5e6, bandwidth: 25e3, power: -55, modulation: 'am', label: 'Guard 121.5' },
    { freq: 118.1e6, bandwidth: 25e3, power: -50, modulation: 'am', label: 'Tower 118.1' },
    { freq: 1090e6, bandwidth: 2e6, power: -60, modulation: 'digital', label: 'ADS-B 1090' },
  ],

  /* ── WEATHER ── */
  weather: [
    { freq: 137.1e6, bandwidth: 40e3, power: -65, modulation: 'fm', label: 'NOAA-15' },
    { freq: 137.62e6, bandwidth: 40e3, power: -68, modulation: 'fm', label: 'NOAA-18' },
    { freq: 137.9125e6, bandwidth: 40e3, power: -63, modulation: 'fm', label: 'NOAA-19' },
  ],

  /* ── IoT / ISM BAND ── */
  iot: [
    { freq: 433.92e6, bandwidth: 50e3, power: -55, modulation: 'digital', label: 'ISM 433' },
    { freq: 868e6, bandwidth: 125e3, power: -50, modulation: 'digital', label: 'LoRa 868' },
    { freq: 915e6, bandwidth: 125e3, power: -48, modulation: 'digital', label: 'LoRa 915' },
  ],

  /* ── AMATEUR RADIO ── */
  amateur: [
    { freq: 3.5e6, bandwidth: 3e3, power: -55, modulation: 'am', label: 'Ham 80m' },
    { freq: 7.1e6, bandwidth: 3e3, power: -50, modulation: 'am', label: 'Ham 40m' },
    { freq: 14.2e6, bandwidth: 3e3, power: -45, modulation: 'am', label: 'Ham 20m' },
    { freq: 144.3e6, bandwidth: 15e3, power: -52, modulation: 'fm', label: 'Ham 2m' },
    { freq: 446e6, bandwidth: 12.5e3, power: -58, modulation: 'fm', label: 'Ham 70cm' },
  ],

  /* ── COMMON WIRELESS ── */
  wireless: [
    { freq: 2.412e9, bandwidth: 20e6, power: -35, modulation: 'digital', label: 'WiFi Ch1' },
    { freq: 2.437e9, bandwidth: 20e6, power: -40, modulation: 'digital', label: 'WiFi Ch6' },
    { freq: 2.462e9, bandwidth: 20e6, power: -38, modulation: 'digital', label: 'WiFi Ch11' },
  ],

  /* ── MICRO:BIT ── */
  microbit: [
    { freq: 2.404e9, bandwidth: 1e6, power: -55, modulation: 'digital', label: 'micro:bit G0' },
    { freq: 2.406e9, bandwidth: 1e6, power: -58, modulation: 'digital', label: 'micro:bit G1' },
    { freq: 2.410e9, bandwidth: 1e6, power: -60, modulation: 'digital', label: 'micro:bit G5' },
  ],

  /* ── SCENE PRESETS ── */
  scenes: {
    fmBand: {
      name: 'FM Radio Band',
      description: 'The FM broadcast band (88-108 MHz) with typical stations',
      minFreq: 87e6,
      maxFreq: 109e6,
      noiseFloor: -100,
      get signals() { return SignalLibrary.fm; }
    },
    aviation137: {
      name: 'VHF Aviation + Weather',
      description: 'Aircraft and weather satellite frequencies',
      minFreq: 117e6,
      maxFreq: 140e6,
      noiseFloor: -105,
      get signals() { return [...SignalLibrary.aviation.slice(0, 2), ...SignalLibrary.weather]; }
    },
    ism433: {
      name: 'ISM 433 MHz',
      description: 'IoT devices and amateur radio at 433 MHz',
      minFreq: 430e6,
      maxFreq: 440e6,
      noiseFloor: -100,
      get signals() { return [SignalLibrary.iot[0], SignalLibrary.amateur[4]]; }
    },
    loraBand: {
      name: 'LoRa Band (868 MHz)',
      description: 'LoRa IoT signals in the European ISM band',
      minFreq: 863e6,
      maxFreq: 870e6,
      noiseFloor: -110,
      get signals() { return [SignalLibrary.iot[1]]; }
    },
    wifi24: {
      name: 'WiFi 2.4 GHz',
      description: 'WiFi channels and micro:bit in the 2.4 GHz ISM band',
      minFreq: 2.4e9,
      maxFreq: 2.5e9,
      noiseFloor: -90,
      get signals() { return [...SignalLibrary.wireless, ...SignalLibrary.microbit]; }
    },
    adsb: {
      name: 'ADS-B (1090 MHz)',
      description: 'Aircraft transponder signals',
      minFreq: 1085e6,
      maxFreq: 1095e6,
      noiseFloor: -105,
      get signals() { return [SignalLibrary.aviation[2]]; }
    },
    hamHF: {
      name: 'HF Amateur Radio',
      description: 'Ham radio bands in the HF range',
      minFreq: 3e6,
      maxFreq: 30e6,
      noiseFloor: -95,
      get signals() { return SignalLibrary.amateur.slice(0, 3); }
    },
    wideband: {
      name: 'Wideband Scan (RTL-SDR Range)',
      description: 'Overview of signals across the RTL-SDR frequency range',
      minFreq: 24e6,
      maxFreq: 1.7e9,
      noiseFloor: -100,
      get signals() {
        return [
          ...SignalLibrary.fm.slice(0, 3),
          ...SignalLibrary.weather.slice(0, 1),
          ...SignalLibrary.aviation.slice(0, 1),
          ...SignalLibrary.iot,
          ...SignalLibrary.aviation.slice(2),
        ];
      }
    },
  },

  /* ── LOAD SCENE ── */
  loadScene(spectrumEngine, sceneName) {
    const scene = this.scenes[sceneName];
    if (!scene) return false;

    spectrumEngine.clearSignals();
    spectrumEngine.setFrequencyRange(scene.minFreq, scene.maxFreq);
    spectrumEngine.setNoiseFloor(scene.noiseFloor);

    for (const sig of scene.signals) {
      spectrumEngine.addSignal({ ...sig });
    }

    return scene;
  },

  /* ── GET ALL SCENE NAMES ── */
  getSceneList() {
    return Object.entries(this.scenes).map(([key, scene]) => ({
      key,
      name: scene.name,
      description: scene.description,
    }));
  },
};

window.SignalLibrary = SignalLibrary;

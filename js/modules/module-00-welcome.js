/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE 0: WELCOME & SETUP
   ═══════════════════════════════════════════ */

ModuleContent.register('module-0', {
  narrative: {
    newb: "Assalamu Alaikum! I'm Mouhammed, and I'm SO excited to explore the invisible world of radio with you! Did you know there are invisible waves passing through you RIGHT NOW carrying music, messages, and even pictures from space? Let's discover them together!",
    explorer: "Welcome, fellow explorer! I'm Mouhammed. Together we'll dive into Software Defined Radio — a technology that lets a computer hear every radio signal around us. By the end, you'll understand how the invisible electromagnetic world works!",
    developer: "Welcome to SDR Kids Lab. I'm Mouhammed, your guide through the architecture of Software Defined Radio systems. We'll cover RF fundamentals, signal processing, hardware interfaces, and protocol analysis. Let's build real understanding."
  },

  sections: {
    newb: [
      {
        type: 'text',
        title: '👋 What is SDR Kids Lab?',
        content: `<p>SDR Kids Lab is your personal radio adventure! We'll learn about <strong>radio waves</strong> — invisible signals that fly through the air carrying music, messages, airplane locations, and even weather pictures from space!</p>
        <p>You don't need any special equipment to start. Everything works right here in your browser with <strong>simulations</strong> — virtual versions of real radio tools.</p>`
      },
      {
        type: 'analogy',
        icon: '🏊',
        content: `Think of radio waves like waves in a swimming pool. When you jump in, waves spread out in every direction. Radio waves work the same way — a radio station "jumps" into the electromagnetic pool, and waves spread out so your radio can "feel" them!`
      },
      {
        type: 'cards',
        title: '🗺️ Your Adventure Path',
        items: [
          { icon: '📜', title: 'Learn the Basics', description: 'History, waves, frequencies — the foundation' },
          { icon: '📡', title: 'Build & Explore', description: 'Antennas, modulation, spectrum' },
          { icon: '📟', title: 'Hardware Labs', description: 'micro:bit, ESP32, RTL-SDR, HackRF' },
          { icon: '🔓', title: 'Decode & Create', description: 'Signals, protocols, your own station' },
        ]
      },
      {
        type: 'text',
        title: '🎮 How the Levels Work',
        content: `<p><strong>🟢 Newb</strong> — You're here! Fun analogies, pictures, and simple explanations. Perfect for beginners.</p>
        <p><strong>🟡 Explorer</strong> — Ready for more? Technical words, math basics, and deeper understanding.</p>
        <p><strong>🔴 Developer</strong> — Advanced mode with formulas, architecture, and best practices.</p>
        <p>You can switch levels anytime in the sidebar or Settings!</p>`
      },
      {
        type: 'steps',
        title: '🚀 Quick Setup',
        items: [
          { title: 'Choose your level', description: 'Click 🟢 Newb in the sidebar if you\'re just starting.' },
          { title: 'Pick a theme', description: 'Try 🌌 Space Dark or ☁️ Sky Light in Settings.' },
          { title: 'Explore the Playground', description: 'Click 🧪 Simulator Lab on the home page to see radio signals in action!' },
          { title: 'Start Module 1', description: 'Click Next to begin learning about radio history and heroes!' },
        ]
      }
    ],

    explorer: [
      {
        type: 'text',
        title: '👋 Welcome to SDR Kids Lab',
        content: `<p>SDR Kids Lab teaches you <strong>Software Defined Radio (SDR)</strong> — a technology where software replaces traditional radio hardware. Instead of separate radios for FM, AM, aircraft, and satellites, one SDR device + software can receive them all.</p>
        <p>We use <strong>interactive simulations</strong> that mimic real SDR software. When you're ready, you can connect real hardware like RTL-SDR dongles.</p>`
      },
      {
        type: 'table',
        title: '📡 Hardware We Cover',
        headers: ['Device', 'Frequency', 'Direction', 'Best For'],
        rows: [
          ['micro:bit', '2.4 GHz', 'TX + RX', 'First radio experiments, classroom'],
          ['ESP32 + LoRa', '433/868/915 MHz', 'TX + RX', 'Long-range IoT, 1-10 km'],
          ['RTL-SDR', '24 MHz – 1.7 GHz', 'RX only', 'FM, aircraft, weather sats, primary SDR'],
          ['HackRF One', '1 MHz – 6 GHz', 'TX + RX', 'Advanced analysis, research'],
        ]
      },
      {
        type: 'info',
        content: 'RTL-SDR is <strong>receive-only</strong> — it cannot transmit. This makes it 100% safe for beginners. You can listen to anything without risk.'
      },
      {
        type: 'text',
        title: '🎯 What You\'ll Learn',
        content: `<p>By the end of all 15 modules, you'll understand: electromagnetic waves and the radio spectrum, how AM/FM/digital modulation works, antenna design and radiation patterns, how IoT devices communicate wirelessly, how to decode real signals (ADS-B aircraft, NOAA weather satellites), security and ethics of radio monitoring, and how to design your own SDR monitoring station.</p>`
      }
    ],

    developer: [
      {
        type: 'text',
        title: 'SDR Kids Lab — Developer Overview',
        content: `<p>This app covers the full SDR pipeline: <strong>antenna → ADC → DSP → demodulation → decode</strong>. Each module builds on the previous, progressing from RF fundamentals through signal processing to protocol analysis.</p>
        <p>At Developer level, you'll see architecture diagrams, DSP math (with KaTeX in future phases), link budgets, and implementation details.</p>`
      },
      {
        type: 'table',
        title: 'System Architecture: 4 Hardware Tiers',
        headers: ['Tier', 'Device', 'Freq Range', 'Sample Rate', 'Bits', 'Interface'],
        rows: [
          ['1 — Education', 'micro:bit', '2.4 GHz (fixed)', '1 Mbps radio', '—', 'USB/BLE'],
          ['2 — IoT', 'ESP32+LoRa', '433/868/915 MHz', '—', '—', 'SPI/UART'],
          ['3 — SDR RX', 'RTL-SDR (R820T2)', '24 MHz–1.766 GHz', '≤3.2 Msps', '8-bit', 'USB 2.0'],
          ['4 — SDR TRX', 'HackRF One', '1 MHz–6 GHz', '≤20 Msps', '8-bit', 'USB 2.0'],
        ]
      },
      {
        type: 'text',
        title: 'Simulation Architecture',
        content: `<p>The simulator engines use <strong>Canvas 2D</strong> for rendering and <strong>procedural math</strong> for signal generation — no pre-recorded samples. The spectrum engine generates FFT-like data using Gaussian/rectangular signal profiles combined with noise, rendered at 20-30 fps.</p>
        <p>Key engines: <code>SpectrumEngine</code>, <code>WaterfallEngine</code>, <code>SignalGenerator</code>, <code>NoiseSimulator</code>, <code>ModulationEngine</code>, <code>AntennaSimulator</code>, <code>RangeCalculator</code>.</p>`
      },
      {
        type: 'code',
        title: 'SDR Signal Chain',
        content: `Antenna → LNA → Mixer → IF Filter → ADC → Digital Samples
  ↓              ↓           ↓            ↓
 Gain       Frequency     Bandwidth    Sample Rate
 Control    Conversion    Selection    (Nyquist)`
      },
      {
        type: 'text',
        title: 'I/Q Sampling & Complex Signals',
        content: `<p>The foundation of SDR is <strong>complex sampling</strong>. An ADC captures two streams simultaneously: <strong>I (In-phase)</strong> and <strong>Q (Quadrature)</strong>, offset by 90°. Together, each I/Q pair represents a point in the complex plane: <code>s(t) = I(t) + jQ(t)</code>.</p>
        <p>This captures both <strong>amplitude</strong> (√(I²+Q²)) and <strong>phase</strong> (atan2(Q,I)), enabling the software to reconstruct the original signal completely. A real-valued ADC would lose phase information, making demodulation of most modern signals impossible.</p>
        <p>The RTL-SDR produces 8-bit unsigned I/Q pairs at up to 2.56 Msps effective rate (3.2 Msps with dropped samples). Each sample pair is 2 bytes, yielding ~5 MB/s of raw data at full rate.</p>`
      },
      {
        type: 'text',
        title: 'Curriculum Architecture & Learning Path',
        content: `<p>SDR Kids Lab follows a deliberate pedagogical structure:</p>
        <p><strong>Phase 1 — Foundation (M0-M3):</strong> Conceptual grounding. What radio is, how waves propagate, and why SDR differs from traditional radio. No hardware required.</p>
        <p><strong>Phase 2 — RF Core (M4-M6):</strong> Technical fundamentals. Frequency/spectrum analysis (FFT, windowing), antenna physics (gain, impedance, radiation patterns), and modulation theory (AM/FM/digital, constellation diagrams).</p>
        <p><strong>Phase 3 — Hardware (M7-M10):</strong> Progressive hardware introduction. From safe educational devices (micro:bit) through IoT (ESP32+LoRa) to real SDR receivers (RTL-SDR) and transceivers (HackRF).</p>
        <p><strong>Phase 4 — Applied (M11-M14):</strong> Real-world signal decoding (ADS-B, NOAA APT), IoT protocol analysis, security/ethics framework, and a capstone station-building project.</p>`
      }
    ]
  },

  didYouKnow: [
    'Radio waves travel at the speed of light — 300,000 km per second!',
    'The first radio message was sent by Guglielmo Marconi in 1895.',
    'Muslim scholars in the Golden Age made key discoveries in optics and wave theory that helped us understand electromagnetic radiation.',
    'There are radio waves from the Big Bang still traveling through space — they\'re called the Cosmic Microwave Background.',
    'Your WiFi router is actually a radio transmitter!'
  ],

  takeaways: [
    'SDR uses software to process radio signals instead of fixed hardware',
    'Radio waves are invisible electromagnetic energy all around us',
    'This app covers 4 hardware tiers: micro:bit → ESP32+LoRa → RTL-SDR → HackRF',
    'The SDR signal chain: Antenna → ADC → Software Processing → Output'
  ],

  quiz: {
    newb: [
      {
        question: 'What does SDR stand for?',
        options: ['Super Digital Radio', 'Software Defined Radio', 'Signal Detection Receiver', 'Standard Data Radio'],
        correct: 1,
        explanation: 'SDR lets a computer process radio signals using software instead of fixed hardware circuits.'
      },
      {
        question: 'Which SDR device is safest for kids because it can only receive?',
        options: ['HackRF One', 'micro:bit', 'RTL-SDR', 'ESP32'],
        correct: 2,
        explanation: 'Radio waves are a real type of electromagnetic energy — invisible but all around us!'
      }
    ],
    explorer: [
      {
        question: 'What does SDR stand for?',
        options: ['Software Defined Radio', 'Signal Detection Receiver', 'Spectrum Display Router', 'System Data Relay'],
        correct: 0,
        explanation: 'I/Q (In-phase/Quadrature) samples capture both amplitude and phase of a signal.'
      },
      {
        question: 'What frequency range can RTL-SDR receive?',
        options: ['1 MHz – 6 GHz', '24 MHz – 1.7 GHz', '88 – 108 MHz only', '2.4 GHz only'],
        correct: 1,
        explanation: 'ADC (Analog-to-Digital Converter) turns continuous radio waves into numbers a computer can process.'
      },
      {
        question: 'Why is RTL-SDR considered safe for beginners?',
        options: ['It\'s very cheap', 'It uses low power', 'It can only receive, never transmit', 'It only works with FM radio'],
        correct: 2,
        explanation: 'SDR replaces hardware filters and demodulators with flexible software algorithms.'
      }
    ],
    developer: [
      {
        question: 'What is the maximum sample rate of a typical RTL-SDR (R820T2)?',
        options: ['1.2 Msps', '2.4 Msps', '3.2 Msps', '20 Msps'],
        correct: 2,
        explanation: 'The Nyquist theorem requires sampling at 2× the bandwidth to avoid aliasing artifacts.'
      },
      {
        question: 'What bit depth does RTL-SDR use for I/Q samples?',
        options: ['16-bit', '12-bit', '10-bit', '8-bit'],
        correct: 3,
        explanation: 'Complex I/Q samples encode both magnitude and phase, enabling full signal reconstruction.'
      }
    ]
  },

  challenge: {
    newb: 'Visit the Simulator Playground and find at least 3 FM radio stations in the FM Band scene!',
    explorer: 'Compare all 4 hardware devices in the table. Which would you choose for tracking aircraft, and why?',
    developer: 'Calculate the maximum instantaneous bandwidth of RTL-SDR given its 3.2 Msps sample rate and 8-bit I/Q samples. What is the data throughput in MB/s?'
  }
});

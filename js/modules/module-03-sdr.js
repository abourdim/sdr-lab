/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE 3: WHAT IS SDR?
   ═══════════════════════════════════════════ */

ModuleContent.register('module-3', {
  narrative: {
    newb: "Here's the coolest thing about SDR — instead of buying a different radio for every type of signal, you use ONE device and your computer does all the magic! It's like having a universal translator for every radio language in the world!",
    explorer: "SDR replaces fixed hardware radio components with software running on a general-purpose processor. This means one device can receive FM radio, decode aircraft positions, capture weather satellite images, and analyze IoT signals — all by changing software.",
    developer: "The SDR paradigm shifts radio functionality from fixed analog hardware to flexible digital processing. Understanding the ADC/DAC boundary, I/Q sampling theory, and the software processing pipeline is essential for effective SDR work."
  },

  sections: {
    newb: [
      {
        type: 'text',
        title: '📻 Old Radio vs New Radio',
        content: `<p>In the <strong>old days</strong>, every radio was built for one purpose. An FM radio could only hear FM stations. An aircraft radio could only hear pilots. A weather radio could only hear weather reports. You needed a DIFFERENT device for each one!</p>
        <p><strong>Software Defined Radio</strong> changes everything. With SDR, you have ONE device that plugs into your computer, and the <strong>software</strong> tells it what to listen to. Want FM? Click. Want aircraft? Click. Want weather satellites? Click!</p>`
      },
      {
        type: 'analogy',
        icon: '📱',
        content: `Remember how old phones could only make calls? Then smartphones came along and could do EVERYTHING — calls, games, cameras, maps. SDR is the same idea: a "smartphone for radio." One device, unlimited possibilities through software!`
      },
      {
        type: 'cards',
        title: '🔧 How SDR Works (Simple)',
        items: [
          { icon: '📡', title: '1. Antenna', description: 'Captures invisible radio waves from the air.' },
          { icon: '🔌', title: '2. SDR Dongle', description: 'Converts radio waves into digital numbers your computer can understand.' },
          { icon: '💻', title: '3. Computer', description: 'Software processes the numbers to turn them into sound, pictures, or data.' },
          { icon: '🎧', title: '4. You!', description: 'Listen, watch, and explore the invisible radio world!' },
        ]
      },
      {
        type: 'text',
        title: '🎯 What Can You Do With SDR?',
        content: `<p>With just a cheap RTL-SDR dongle ($20-30), you can:</p>
        <p>📻 Listen to FM and AM radio stations</p>
        <p>✈️ Track aircraft in real-time (ADS-B at 1090 MHz)</p>
        <p>🛰️ Receive weather satellite images from space (NOAA at 137 MHz)</p>
        <p>📟 Decode wireless sensors and IoT devices (433 MHz)</p>
        <p>🔭 Listen to the Sun, Jupiter, and meteor showers</p>
        <p>📡 Monitor amateur radio conversations</p>
        <p>🌡️ Capture data from weather stations</p>`
      },
      {
        type: 'simulator',
        title: '🧪 See Signals Across the Whole RTL-SDR Range!',
        simType: 'spectrum',
        simId: 'mod3-wideband',
        simConfig: { scene: 'wideband' }
      }
    ],

    explorer: [
      {
        type: 'text',
        title: 'The SDR Architecture',
        content: `<p>A traditional radio has fixed hardware for each function: tuning, filtering, amplification, demodulation. An SDR moves most of these functions into software.</p>
        <p>The key component is the <strong>ADC (Analog-to-Digital Converter)</strong>, which samples the radio signal and turns it into numbers. Once digitized, software can apply any demodulation, filtering, or decoding algorithm.</p>`
      },
      {
        type: 'steps',
        title: 'SDR Signal Chain',
        items: [
          { title: 'Antenna', description: 'Captures electromagnetic waves. Different antennas for different frequencies.' },
          { title: 'RF Frontend (Tuner)', description: 'Selects the desired frequency band, amplifies the signal (LNA), and filters out-of-band signals.' },
          { title: 'ADC — The Bridge', description: 'Converts the analog signal to digital I/Q samples. RTL-SDR uses 8-bit ADC at up to 3.2 Msps.' },
          { title: 'USB Transfer', description: 'Digital samples are streamed to the computer via USB.' },
          { title: 'Software Processing', description: 'FFT for spectrum display, demodulation (AM/FM/digital), decoding (ADS-B, NOAA), filtering, recording.' },
          { title: 'Output', description: 'Audio, images, data, or spectrum/waterfall visualization.' },
        ]
      },
      {
        type: 'table',
        title: 'SDR Hardware Comparison',
        headers: ['Feature', 'RTL-SDR', 'HackRF One', 'Airspy Mini'],
        rows: [
          ['Price', '~$25', '~$300', '~$100'],
          ['Frequency', '24 MHz–1.7 GHz', '1 MHz–6 GHz', '24–1700 MHz'],
          ['Direction', 'RX only', 'TX + RX', 'RX only'],
          ['ADC Bits', '8-bit', '8-bit', '12-bit'],
          ['Max Sample Rate', '3.2 Msps', '20 Msps', '6 Msps'],
          ['Bandwidth', '~2.4 MHz', '~20 MHz', '~6 MHz'],
          ['Best For', 'Learning, monitoring', 'Research, analysis', 'High-quality RX'],
        ]
      },
      {
        type: 'text',
        title: 'I/Q Sampling',
        content: `<p>SDR receivers use <strong>I/Q (In-phase/Quadrature) sampling</strong>. Instead of sampling the RF signal directly, the signal is mixed with two local oscillators 90° apart, producing two data streams: I (In-phase) and Q (Quadrature).</p>
        <p>Together, I and Q represent the signal as a <strong>complex number</strong>: s(t) = I(t) + jQ(t). This captures both amplitude AND phase information, which is essential for decoding all modulation types.</p>`
      },
      {
        type: 'info',
        content: 'Think of I/Q like GPS coordinates: you need both latitude AND longitude to know exactly where you are. Similarly, you need both I AND Q to fully describe a radio signal.'
      }
    ],

    developer: [
      {
        type: 'text',
        title: 'SDR System Architecture',
        content: `<p>The SDR architecture is defined by where the analog-to-digital boundary sits. An <strong>ideal SDR</strong> would digitize directly at the antenna with an extremely high sample rate ADC. Practical SDRs use heterodyne or direct-conversion architectures to bring the signal down to a manageable IF before digitization.</p>
        <p><strong>RTL-SDR architecture:</strong> The R820T2 is a silicon tuner that performs: LNA → Mixer (with internal PLL synthesizer) → IF amplifier → IF filter. The RTL2832U then digitizes the IF output with its 8-bit ADC at up to 3.2 Msps. The internal IF is around 3.57 MHz.</p>`
      },
      {
        type: 'code',
        title: 'RTL-SDR Block Diagram',
        content: `Antenna → R820T2 Tuner → RTL2832U ADC → USB 2.0 → Host
           │                     │
           ├─ LNA (gain 0-50dB)  ├─ 8-bit ADC
           ├─ Mixer (PLL synth)  ├─ I/Q demod
           ├─ IF Amp + Filter    ├─ Decimation
           └─ Tuning range:      └─ USB bulk transfer
              24 MHz – 1766 MHz     ~3.2 Msps max`
      },
      {
        type: 'text',
        title: 'I/Q Sampling Theory',
        content: `<p>The <strong>analytic signal representation</strong> uses complex baseband: s(t) = I(t) + jQ(t) = A(t)·e^(jφ(t)). This is obtained by mixing the RF signal with cos(2πf_LO·t) for I and -sin(2πf_LO·t) for Q.</p>
        <p>Key relationships: Instantaneous amplitude = √(I² + Q²), Instantaneous phase = atan2(Q, I), Instantaneous frequency = (1/2π)·d(phase)/dt.</p>
        <p><strong>Nyquist theorem:</strong> The I/Q sample rate must be ≥ 2× the signal bandwidth (not the carrier frequency). RTL-SDR at 2.4 Msps can capture signals with up to ~2.4 MHz instantaneous bandwidth.</p>
        <p><strong>Quantization noise:</strong> 8-bit ADC gives ~48 dB dynamic range (6.02N + 1.76 dB). This limits weak-signal performance compared to 12-bit or 16-bit SDRs.</p>`
      },
      {
        type: 'text',
        title: 'Software Processing Pipeline',
        content: `<p>A typical SDR software stack:</p>
        <p>1. <strong>Source:</strong> USB driver → I/Q sample stream (rtl-sdr library, libhackrf)</p>
        <p>2. <strong>DDC (Digital Down Converter):</strong> NCO mixer + CIC/FIR decimation filter → narrow channel</p>
        <p>3. <strong>Channelizer:</strong> Polyphase filter bank for multi-channel extraction</p>
        <p>4. <strong>Demodulator:</strong> AM (envelope detection), FM (frequency discrimination), PSK/QAM (Costas loop + matched filter)</p>
        <p>5. <strong>Decoder:</strong> Protocol-specific (ADS-B, NOAA APT, LoRa, etc.)</p>
        <p>6. <strong>Visualization:</strong> FFT → spectrum display, sliding FFT → waterfall</p>`
      },
      {
        type: 'table',
        title: 'SDR Software Ecosystem',
        headers: ['Software', 'Language', 'Best For', 'Platform'],
        rows: [
          ['GNU Radio', 'Python/C++', 'DSP flowgraphs, research', 'Linux/Mac/Win'],
          ['SDR#', 'C#', 'General RX, plugins', 'Windows'],
          ['GQRX', 'C++/Qt', 'General RX, scanner', 'Linux/Mac'],
          ['dump1090', 'C', 'ADS-B aircraft decode', 'All'],
          ['WXtoImg', 'C++', 'NOAA satellite images', 'All'],
          ['Universal Radio Hacker', 'Python', 'Protocol reverse engineering', 'All'],
        ]
      }
    ]
  },

  didYouKnow: [
    'A $25 RTL-SDR dongle was originally designed to watch digital TV — but hackers discovered it could receive almost ANY radio signal!',
    'The International Space Station (ISS) sometimes broadcasts radio signals you can receive with SDR!',
    'The term SDR was coined by Joseph Mitola in 1991, but the concept of flexible radio goes back to the 1970s.',
    'Modern smartphones contain SDR-like chips that can switch between 4G, 5G, WiFi, Bluetooth, and GPS using software.',
    'With SDR, scientists have detected radio signals from pulsars — spinning neutron stars thousands of light-years away!'
  ],

  takeaways: [
    'SDR replaces hardware components with flexible software algorithms',
    'An ADC converts analog signals to digital I/Q samples',
    'I/Q sampling captures both amplitude and phase of the signal',
    'SDR can tune to any frequency within its hardware range via software'
  ],

  quiz: {
    newb: [
      {
        question: 'What does SDR replace hardware with?',
        options: ['Bigger antennas', 'Software', 'More wires', 'Batteries'],
        correct: 1,
        explanation: 'SDR stands for Software Defined Radio — the software does what hardware used to do.'
      },
      {
        question: 'What does ADC stand for?',
        options: ['Automatic Digital Controller', 'Analog-to-Digital Converter', 'Advanced Data Computer', 'Antenna Direction Checker'],
        correct: 1,
        explanation: 'An ADC converts analog radio waves into digital numbers that software can process.'
      },
      {
        question: 'How much does a basic RTL-SDR dongle cost?',
        options: ['$500', '$200', '$25', '$5'],
        correct: 2,
        explanation: 'SDR can tune to any frequency because the software, not fixed hardware, selects what to listen to.'
      }
    ],
    explorer: [
      {
        question: 'What do the letters I and Q stand for in I/Q sampling?',
        options: ['Input / Quality', 'In-phase / Quadrature', 'Integer / Quantized', 'Internal / Quick'],
        correct: 1,
        explanation: 'I/Q samples use two components (In-phase and Quadrature) to represent both amplitude and phase.'
      },
      {
        question: 'What is the maximum sample rate of a typical RTL-SDR?',
        options: ['480 Ksps', '1.2 Msps', '3.2 Msps', '20 Msps'],
        correct: 2,
        explanation: 'The sample rate determines the bandwidth you can capture — higher rate means wider bandwidth.'
      },
      {
        question: 'What converts the analog radio signal into digital data?',
        options: ['The antenna', 'The USB cable', 'The ADC', 'The speaker'],
        correct: 2,
        explanation: 'SDR uses FFT (Fast Fourier Transform) to convert time-domain samples into a frequency spectrum display.'
      }
    ],
    developer: [
      {
        question: 'What is the theoretical dynamic range of an 8-bit ADC?',
        options: ['~24 dB', '~36 dB', '~48 dB', '~96 dB'],
        correct: 2,
        explanation: 'The RTL2832U chip has 8-bit ADC resolution, limiting dynamic range to about 48 dB.'
      },
      {
        question: 'According to Nyquist, what bandwidth can RTL-SDR capture at 2.4 Msps?',
        options: ['1.2 MHz', '2.4 MHz', '4.8 MHz', '7.2 MHz'],
        correct: 1,
        explanation: 'Direct sampling bypasses the tuner, allowing reception of HF frequencies below 30 MHz.'
      },
      {
        question: 'How is instantaneous frequency derived from I/Q samples?',
        options: [
          'f = I × Q',
          'f = sqrt(I² + Q²)',
          'f = (1/2π) × d[atan2(Q,I)]/dt',
          'f = I/Q × sample_rate'
        ],
        correct: 2,
        explanation: 'Decimation reduces sample rate after filtering, lowering CPU load while preserving the signal of interest.'
      }
    ]
  },

  challenge: {
    newb: 'Make a list of 5 things you could listen to with an RTL-SDR dongle. Which one sounds most exciting to you?',
    explorer: 'Compare RTL-SDR and HackRF One. If you had $300, which would you buy and why? Consider frequency range, sample rate, TX capability, and price.',
    developer: 'Design an SDR processing pipeline for ADS-B reception: specify center frequency, sample rate, demodulation type, and decoding steps. What is the minimum bandwidth needed for ADS-B (consider the 1 MHz pulse rate)?'
  }
});

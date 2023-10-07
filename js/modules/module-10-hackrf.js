/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE 10: HACKRF ONE LAB
   ═══════════════════════════════════════════ */

ModuleContent.register('module-10', {
  narrative: {
    newb: "The HackRF One is the advanced explorer's SDR — it can not only LISTEN to radio signals but also SEND them! It covers a massive frequency range. But with great power comes great responsibility — there are strict rules about transmitting!",
    explorer: "HackRF One is an open-source, full-duplex capable SDR transceiver covering 1 MHz to 6 GHz with 20 MHz bandwidth. It opens up advanced analysis, transmission experiments (with proper licensing), and research-grade signal investigation.",
    developer: "The HackRF One, designed by Great Scott Gadgets, uses a MAX2837 baseband IC + MAX5864 ADC/DAC + RFFC5072 mixer to achieve 1-6 GHz coverage with 20 Msps 8-bit I/Q. We'll cover architecture, calibration, and advanced usage patterns."
  },

  sections: {
    newb: [
      {
        type: 'text',
        title: '🔬 The Advanced SDR',
        content: `<p>The <strong>HackRF One</strong> is like the "big sibling" of RTL-SDR. While RTL-SDR can only listen, HackRF can <strong>both listen AND transmit</strong>!</p>
        <p>It can tune from <strong>1 MHz all the way up to 6 GHz</strong> — that's an enormous range covering AM radio to WiFi and beyond!</p>`
      },
      {
        type: 'warning',
        content: '<strong>⚠️ IMPORTANT SAFETY RULE:</strong> Transmitting radio signals without a license is ILLEGAL in most countries and can interfere with emergency services, aircraft, and other critical systems. <strong>NEVER transmit without proper authorization!</strong> This module is for learning — ask a teacher or licensed amateur radio operator before ANY transmission experiments.'
      },
      {
        type: 'table',
        title: '🆚 RTL-SDR vs HackRF One',
        headers: ['Feature', 'RTL-SDR', 'HackRF One'],
        rows: [
          ['Price', '~$25', '~$300'],
          ['Direction', 'Receive only ✅', 'Transmit AND Receive ⚠️'],
          ['Frequency', '24 MHz – 1.7 GHz', '1 MHz – 6 GHz'],
          ['Bandwidth', '~2.4 MHz', '20 MHz (8× wider!)'],
          ['Best for', 'Learning, monitoring', 'Research, analysis'],
          ['Safety', '100% safe for kids', 'Needs adult supervision for TX'],
        ]
      },
      {
        type: 'text',
        title: '🔍 What Can HackRF Do?',
        content: `<p>Everything RTL-SDR can do, PLUS:</p>
        <p>🔬 <strong>Analyze wireless devices</strong> — See exactly how remotes, sensors, and IoT gadgets communicate</p>
        <p>📡 <strong>Replay signals</strong> — Record a signal and play it back (for research only!)</p>
        <p>🔒 <strong>Security research</strong> — Test if wireless devices are secure</p>
        <p>📻 <strong>Ham radio TX</strong> — With a license, transmit on amateur bands</p>
        <p>🛰️ <strong>Satellite analysis</strong> — Analyze GPS, weather sats, and more</p>`
      },
      {
        type: 'info',
        content: 'HackRF is an <strong>open-source hardware</strong> project — the complete design is freely available for anyone to study, modify, and build! This is how science and engineering should work.'
      }
    ],

    explorer: [
      {
        type: 'text',
        title: 'HackRF One Architecture',
        content: `<p>The HackRF One signal chain:</p>
        <p><strong>Antenna → RF switch → RFFC5072 mixer → MAX2837 baseband → MAX5864 ADC/DAC → LPC4320 USB controller → Host</strong></p>
        <p>The <strong>RFFC5072</strong> is a wideband mixer/synthesizer that covers 85 MHz to 4200 MHz. For frequencies below 85 MHz and above 4200 MHz, the mixer is bypassed and direct sampling or harmonic reception is used.</p>
        <p>The <strong>MAX2837</strong> handles baseband filtering and gain control (0-62 dB in 2 dB steps). The <strong>MAX5864</strong> provides 8-bit ADC+DAC at up to 22 Msps.</p>`
      },
      {
        type: 'table',
        title: 'HackRF One Specifications',
        headers: ['Parameter', 'Value'],
        rows: [
          ['Frequency range', '1 MHz – 6 GHz'],
          ['Sample rate', 'Up to 20 Msps'],
          ['ADC/DAC', '8-bit (MAX5864)'],
          ['Instantaneous bandwidth', '20 MHz'],
          ['TX power', '-10 dBm (~100 μW) typical'],
          ['RX noise figure', '~12 dB (varies with frequency)'],
          ['Interface', 'USB 2.0 High Speed (480 Mbps)'],
          ['Open source', 'Yes — hardware and firmware'],
          ['Duplex', 'Half-duplex (TX or RX, not both simultaneously)'],
        ]
      },
      {
        type: 'text',
        title: 'Software for HackRF',
        content: `<p><strong>hackrf_tools</strong> — Command-line utilities: hackrf_transfer (record/playback I/Q), hackrf_sweep (wideband power spectrum), hackrf_info (device info).</p>
        <p><strong>GNU Radio</strong> — Full DSP framework with HackRF source/sink blocks. The most powerful option for custom processing.</p>
        <p><strong>SDR++, SDR#, GQRX</strong> — Same general receivers as RTL-SDR, with HackRF support.</p>
        <p><strong>Universal Radio Hacker (URH)</strong> — GUI tool for analyzing, demodulating, and reverse-engineering wireless protocols. Excellent for understanding unknown signals.</p>
        <p><strong>Inspectrum</strong> — Offline I/Q file analysis with spectrogram view and cursor measurements.</p>`
      },
      {
        type: 'text',
        title: 'HackRF Sweep: Wideband Scanner',
        content: `<p>One of HackRF's unique abilities: <strong>hackrf_sweep</strong> can scan the ENTIRE spectrum from 1 MHz to 6 GHz in seconds! It does this by rapidly tuning across the spectrum, capturing 20 MHz at a time.</p>
        <p>This gives you a "bird's eye view" of every signal in the RF environment — perfect for understanding what's out there.</p>`
      },
      {
        type: 'warning',
        content: '<strong>TX Safety:</strong> HackRF\'s transmit power is very low (~100 μW, -10 dBm) but this is still enough to cause interference with nearby devices. Never transmit near airports, hospitals, or emergency services. Always use a dummy load for TX testing, not an antenna.'
      }
    ],

    developer: [
      {
        type: 'text',
        title: 'HackRF Signal Chain Analysis',
        content: `<p>The HackRF uses a <strong>superheterodyne architecture</strong> with the RFFC5072 as the RF mixer. The IF center is typically 2.6 GHz for the MAX2837 baseband. The RFFC5072 synthesizer has a fractional-N PLL with ~1 MHz step size.</p>
        <p><strong>RX chain:</strong> Antenna → RF amp (MGA-81563, 0/14 dB) → RFFC5072 mixer → MAX2837 BB filter + VGA → MAX5864 ADC → LPC4320 (Cortex-M4) → USB 2.0.</p>
        <p><strong>TX chain:</strong> LPC4320 → MAX5864 DAC → MAX2837 BB filter + VGA → RFFC5072 mixer → RF amp (MGA-81563) → Antenna.</p>
        <p>The LPC4320 dual-core ARM (M4 + M0) handles USB protocol, sample rate conversion, and SGPIO-based high-speed sample streaming.</p>`
      },
      {
        type: 'text',
        title: 'Performance Characteristics',
        content: `<p><strong>Noise figure:</strong> Varies significantly with frequency. At 100 MHz: ~10 dB. At 1 GHz: ~12 dB. At 3 GHz: ~15 dB. Compare to RTL-SDR (~3-5 dB with R820T2 LNA). For weak signals, an external LNA is essential.</p>
        <p><strong>Dynamic range:</strong> Same 8-bit ADC limitation as RTL-SDR (~48 dB). The wider 20 MHz bandwidth means more noise power, reducing effective sensitivity. For narrowband signals, decimation provides processing gain.</p>
        <p><strong>Frequency accuracy:</strong> Crystal oscillator with ~20 ppm accuracy. For applications requiring better stability (e.g., GSM analysis), use an external 10 MHz reference input.</p>
        <p><strong>Half-duplex limitation:</strong> TX and RX share the same signal path via an RF switch. Cannot transmit and receive simultaneously. For full-duplex, use two HackRFs with synchronized clocks.</p>`
      },
      {
        type: 'code',
        title: 'hackrf_tools Usage',
        content: `# Record I/Q samples to file
hackrf_transfer -r capture.raw -f 433920000 -s 2000000 -g 40 -l 32
#  -f: center frequency (Hz)
#  -s: sample rate (Hz)
#  -g: baseband gain (0-62 dB, step 2)
#  -l: LNA gain (0/8/16/24/32/40 dB)

# Playback recorded I/Q (TX — CAREFUL!)
hackrf_transfer -t capture.raw -f 433920000 -s 2000000 -x 20
#  -x: TX VGA gain (0-47 dB)

# Wideband power sweep
hackrf_sweep -f 1:6000 -w 500000 -1 -r sweep.csv
#  -f: freq range in MHz
#  -w: FFT bin width (Hz)
#  -1: one sweep then exit

# GNU Radio: HackRF source block
# osmocom Source → set hw:hackrf, freq, sample_rate, gains`
      },
      {
        type: 'table',
        title: 'HackRF vs Other SDR Platforms',
        headers: ['Feature', 'HackRF One', 'USRP B210', 'PlutoSDR', 'LimeSDR Mini'],
        rows: [
          ['Price', '$300', '$2,300', '$150', '$160'],
          ['Freq range', '1M-6G', '70M-6G', '70M-6G', '10M-3.5G'],
          ['Bandwidth', '20 MHz', '56 MHz', '20 MHz', '30.72 MHz'],
          ['ADC bits', '8', '12', '12', '12'],
          ['Full duplex', 'No', 'Yes', 'Yes', 'Yes'],
          ['TX power', '-10 dBm', '+10 dBm', '+7 dBm', '+10 dBm'],
          ['Open source', 'Yes', 'Partial', 'Partial', 'Yes'],
        ]
      }
    ]
  },

  didYouKnow: [
    'HackRF One was created by Michael Ossmann and funded through a Kickstarter campaign in 2014 that raised over $600,000!',
    'The name "HackRF" means "hacking radio frequencies" in the positive sense — exploring and understanding, not breaking things.',
    'HackRF is used by security researchers worldwide to test if car key fobs, garage doors, and IoT devices are properly secured.',
    'With hackrf_sweep, you can scan from 1 MHz to 6 GHz in about 1 second — that\'s 6 billion frequencies checked in one second!',
    'HackRF\'s firmware and hardware designs are completely open source under the GPL license — anyone can build their own.'
  ],

  takeaways: [
    'HackRF covers 1 MHz to 6 GHz and can both transmit and receive (half-duplex)',
    'GNU Radio provides a graphical flowgraph environment for signal processing',
    'Transmitting requires proper licensing — never transmit without authorization',
    'PortaPack adds standalone portable operation with screen and controls'
  ],

  quiz: {
    newb: [
      {
        question: 'What makes HackRF different from RTL-SDR?',
        options: ['It\'s cheaper', 'It can transmit AND receive', 'It only works with FM', 'It\'s smaller'],
        correct: 1,
        explanation: 'HackRF covers 1 MHz to 6 GHz — a much wider range than the RTL-SDR.'
      },
      {
        question: 'Is it legal to transmit without a license?',
        options: ['Yes, always', 'Only at night', 'No! You need proper authorization', 'Only with HackRF'],
        correct: 2,
        explanation: 'Unlike RTL-SDR, HackRF can both receive AND transmit signals.'
      },
      {
        question: 'What frequency range does HackRF cover?',
        options: ['88-108 MHz', '1 MHz to 6 GHz', '2.4 GHz only', '1-10 MHz'],
        correct: 1,
        explanation: 'Transmitting on most frequencies requires a license — always check your local regulations.'
      }
    ],
    explorer: [
      {
        question: 'What is HackRF\'s maximum instantaneous bandwidth?',
        options: ['2.4 MHz', '5 MHz', '20 MHz', '100 MHz'],
        correct: 2,
        explanation: 'HackRF is half-duplex: it can transmit or receive, but not both simultaneously.'
      },
      {
        question: 'What does hackrf_sweep do?',
        options: ['Transmits on all frequencies', 'Scans the entire spectrum quickly', 'Cleans the antenna', 'Updates the firmware'],
        correct: 1,
        explanation: 'GNU Radio uses flowgraph blocks connected together to build signal processing chains.'
      },
      {
        question: 'What is HackRF\'s typical TX power?',
        options: ['1 Watt', '100 mW', '~100 μW (-10 dBm)', '10 Watts'],
        correct: 2,
        explanation: 'HackRF\'s 8-bit ADC limits dynamic range, similar to RTL-SDR, but it compensates with wider bandwidth.'
      }
    ],
    developer: [
      {
        question: 'What mixer IC does HackRF use for frequency conversion?',
        options: ['R820T2', 'RFFC5072', 'AD9361', 'Si5351'],
        correct: 1,
        explanation: 'The MAX2837 transceiver in HackRF handles the 2.3-2.7 GHz band directly.'
      },
      {
        question: 'What is HackRF\'s main limitation compared to USRP B210?',
        options: ['Lower frequency range', 'No TX capability', '8-bit ADC and no full duplex', 'Closed source'],
        correct: 2,
        explanation: 'PortaPack adds a screen and battery to HackRF for portable standalone operation.'
      }
    ]
  },

  challenge: {
    newb: 'Make a list of 5 rules for safe and legal radio transmission. Why is each rule important?',
    explorer: 'Use hackrf_sweep (or the Playground wideband scene) to identify all signal categories between 1 MHz and 2 GHz. Categorize them: broadcast, aviation, ISM, cellular, satellite.',
    developer: 'Design a signal analysis pipeline in GNU Radio: HackRF Source → Channel Filter → Power Squelch → Demodulator → File Sink. Configure for 433 MHz ISM band analysis. Calculate the expected noise floor and minimum detectable signal.'
  }
});

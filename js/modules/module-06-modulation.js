/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE 6: MODULATION & DEMODULATION
   ═══════════════════════════════════════════ */

ModuleContent.register('module-6', {
  narrative: {
    newb: "How do you hide a message inside a radio wave? That's called MODULATION! It's like writing a secret message on a carrier pigeon. The pigeon (carrier wave) flies the message (your voice or data) to its destination!",
    explorer: "Modulation is the process of encoding information onto a carrier wave. AM, FM, and digital modulation are the three pillars. Understanding how each works — and sounds on a spectrum display — is essential for identifying and decoding signals.",
    developer: "Modulation theory maps information signals to RF carriers through amplitude, frequency, or phase manipulation. We'll examine the mathematical models, spectral properties, bandwidth efficiency, and demodulation algorithms for analog and digital schemes."
  },

  sections: {
    newb: [
      {
        type: 'text',
        title: '📦 What is Modulation?',
        content: `<p>A radio wave by itself is just a steady hum — it carries no information. To send a message (your voice, music, or data), we have to <strong>change</strong> the wave in some way. This changing is called <strong>modulation</strong>.</p>
        <p>Think of it like this: the radio wave is a bicycle, and your message is the rider. The bicycle carries the rider from one place to another!</p>`
      },
      {
        type: 'cards',
        title: '3 Ways to Modulate',
        items: [
          { icon: '📏', title: 'AM — Change the Height', description: 'Make the wave taller and shorter to carry the message. Like whispering and shouting!' },
          { icon: '🔄', title: 'FM — Change the Speed', description: 'Make the wave wiggle faster and slower. Like a singer going up and down in pitch!' },
          { icon: '0️⃣1️⃣', title: 'Digital — On and Off', description: 'Turn the wave on and off like a light switch. Sends data as 1s and 0s — how computers talk!' },
        ]
      },
      {
        type: 'analogy',
        icon: '💡',
        content: `Imagine a flashlight beam crossing a dark room. <strong>AM</strong> is like making the light brighter and dimmer to send a message. <strong>FM</strong> is like changing the color of the light from red to blue. <strong>Digital</strong> is like blinking the light on and off in a pattern (like Morse code)!`
      },
      {
        type: 'text',
        title: '📻 AM Radio — Amplitude Modulation',
        content: `<p><strong>AM</strong> changes the <strong>height (amplitude)</strong> of the wave. When you talk louder, the wave gets bigger. When you whisper, it gets smaller.</p>
        <p>✅ Good: Travels very far, simple receivers</p>
        <p>❌ Bad: Picks up lots of static and noise</p>
        <p>📻 Used for: AM radio (540-1700 kHz), aviation voice, amateur radio</p>`
      },
      {
        type: 'text',
        title: '🎵 FM Radio — Frequency Modulation',
        content: `<p><strong>FM</strong> changes the <strong>speed (frequency)</strong> of the wave. When your voice goes up, the wave vibrates faster. When your voice goes down, it vibrates slower.</p>
        <p>✅ Good: Much less static, better sound quality</p>
        <p>❌ Bad: Doesn't travel as far as AM</p>
        <p>🎵 Used for: FM radio (88-108 MHz), TV audio, walkie-talkies</p>`
      },
      {
        type: 'text',
        title: '💻 Digital Modulation',
        content: `<p>Digital modulation sends <strong>1s and 0s</strong> — computer data! There are several ways to do this:</p>
        <p><strong>ASK</strong> — Signal ON = 1, signal OFF = 0 (like blinking a light)</p>
        <p><strong>FSK</strong> — High frequency = 1, low frequency = 0 (like two different notes)</p>
        <p><strong>PSK</strong> — Wave flips upside down to mark a change (like a secret handshake)</p>
        <p>💻 Used for: WiFi, Bluetooth, LoRa, ADS-B, everything digital!</p>`
      },
      {
        type: 'simulator',
        title: '🧪 Watch Modulation in Action!',
        simType: 'modulation',
        simId: 'mod6-modulation',
        simConfig: { mode: 'am', carrierFreq: 10, messageFreq: 1 }
      }
    ],

    explorer: [
      {
        type: 'text',
        title: 'Analog Modulation: AM and FM',
        content: `<p><strong>Amplitude Modulation (AM):</strong> The carrier amplitude varies proportionally to the message signal: s(t) = [1 + m·sin(2πf_m·t)] · sin(2πf_c·t), where m is the modulation index (0 to 1).</p>
        <p>In the frequency domain, AM creates a carrier and two sidebands at f_c ± f_m. Total bandwidth = 2 × f_m (max).</p>
        <p><strong>Frequency Modulation (FM):</strong> The carrier frequency varies proportionally to the message: instantaneous frequency = f_c + Δf·sin(2πf_m·t), where Δf is the frequency deviation.</p>
        <p>FM bandwidth follows <strong>Carson's Rule:</strong> BW ≈ 2(Δf + f_m). For broadcast FM: Δf = 75 kHz, f_m(max) = 15 kHz → BW ≈ 180 kHz → standard 200 kHz channel.</p>`
      },
      {
        type: 'table',
        title: 'AM vs FM Comparison',
        headers: ['Property', 'AM', 'FM'],
        rows: [
          ['Information in', 'Amplitude changes', 'Frequency changes'],
          ['Bandwidth', 'Narrow (2× audio BW)', 'Wide (Carson\'s Rule)'],
          ['Noise immunity', 'Poor (noise affects amplitude)', 'Good (noise is amplitude → filtered)'],
          ['Efficiency', 'Low (carrier wastes power)', 'Better (constant envelope)'],
          ['Complexity', 'Very simple receiver', 'More complex receiver'],
          ['Range', 'Long (ground wave at MF)', 'Shorter (line-of-sight at VHF)'],
          ['Audio quality', 'Mono, ~5 kHz', 'Stereo, ~15 kHz'],
        ]
      },
      {
        type: 'text',
        title: 'Digital Modulation Schemes',
        content: `<p><strong>ASK (Amplitude Shift Keying):</strong> OOK (On-Off Keying) is the simplest form — carrier present = 1, absent = 0. Used in simple remotes and RFID. Bandwidth efficient but susceptible to noise.</p>
        <p><strong>FSK (Frequency Shift Keying):</strong> Two frequencies represent 0 and 1. More robust than ASK. Used in Bluetooth (GFSK), LoRa uses a special wideband variant called CSS (Chirp Spread Spectrum).</p>
        <p><strong>PSK (Phase Shift Keying):</strong> Phase changes represent data. BPSK uses 0° and 180° for two symbols. QPSK uses 4 phases for 2 bits per symbol. 16-QAM combines amplitude and phase for 4 bits per symbol.</p>`
      },
      {
        type: 'text',
        title: 'Demodulation — Recovering the Message',
        content: `<p><strong>AM demodulation:</strong> Envelope detection — rectify the signal and low-pass filter to extract the amplitude variations. Can be done with a single diode!</p>
        <p><strong>FM demodulation:</strong> Frequency discrimination — convert frequency variations to amplitude, then detect. In SDR: compute instantaneous frequency as d(phase)/dt from I/Q samples.</p>
        <p><strong>Digital demodulation:</strong> Symbol timing recovery → matched filter → decision threshold → bit stream. More complex but more robust with error correction.</p>`
      },
      {
        type: 'simulator',
        title: '🧪 Compare AM, FM, and Digital Modulation',
        simType: 'modulation',
        simId: 'mod6-modulation-explore',
        simConfig: { mode: 'fm', carrierFreq: 12, messageFreq: 1.5 }
      }
    ],

    developer: [
      {
        type: 'text',
        title: 'AM Mathematical Model',
        content: `<p>Standard AM (DSB-FC): s(t) = A_c[1 + m·x(t)]·cos(2πf_c·t), where x(t) is the normalized message, m is modulation index (0 < m ≤ 1).</p>
        <p>Spectrum: S(f) = (A_c/2)[δ(f-f_c) + δ(f+f_c)] + (mA_c/4)[X(f-f_c) + X(f+f_c)]. Carrier contains no information; all info is in sidebands.</p>
        <p>Power efficiency: η = m²/(2+m²) for single-tone. At m=1, only 33% of total power carries information. This motivates <strong>SSB (Single Sideband)</strong> which suppresses carrier and one sideband, achieving 6× power efficiency.</p>`
      },
      {
        type: 'text',
        title: 'FM Mathematical Model',
        content: `<p>FM signal: s(t) = A_c·cos(2πf_c·t + 2πk_f∫x(τ)dτ), where k_f is the frequency sensitivity (Hz/V).</p>
        <p>The modulation index β = Δf/f_m determines the number of significant sidebands (Bessel function coefficients). <strong>Narrowband FM (β << 1):</strong> spectrum similar to AM. <strong>Wideband FM (β >> 1):</strong> many sidebands, bandwidth ≈ 2Δf.</p>
        <p><strong>FM demodulation in SDR:</strong> From I/Q samples: instantaneous phase φ(n) = atan2(Q(n), I(n)). Frequency = Δφ/ΔT = [φ(n) - φ(n-1)] × f_s / (2π). This is the basis of all SDR FM demodulators.</p>`
      },
      {
        type: 'text',
        title: 'Digital Modulation Theory',
        content: `<p><strong>Bit Error Rate (BER):</strong> The key performance metric. For BPSK in AWGN: BER = Q(√(2·Eb/N0)) where Eb/N0 is energy per bit to noise density ratio.</p>
        <p><strong>Spectral efficiency:</strong> bits/s/Hz. BPSK: 1 b/s/Hz. QPSK: 2 b/s/Hz. 16-QAM: 4 b/s/Hz. 64-QAM: 6 b/s/Hz. Higher-order schemes require better SNR.</p>
        <p><strong>Shannon limit:</strong> C = B·log₂(1 + SNR) — the theoretical maximum data rate for a given bandwidth and SNR. Modern schemes like LDPC and Turbo codes approach within 0.5 dB of this limit.</p>`
      },
      {
        type: 'table',
        title: 'Digital Modulation Performance',
        headers: ['Scheme', 'Bits/Symbol', 'Spectral Eff.', 'Required Eb/N0 @ BER 10⁻⁵', 'Used In'],
        rows: [
          ['OOK', '1', '1 b/s/Hz', '~12 dB', 'RFID, remotes'],
          ['BPSK', '1', '1 b/s/Hz', '9.6 dB', 'GPS, deep space'],
          ['QPSK', '2', '2 b/s/Hz', '9.6 dB', 'DVB-S, cellular'],
          ['8PSK', '3', '3 b/s/Hz', '13 dB', 'Satellite, EDGE'],
          ['16-QAM', '4', '4 b/s/Hz', '13.5 dB', 'WiFi, LTE'],
          ['64-QAM', '6', '6 b/s/Hz', '17.5 dB', 'WiFi, cable'],
          ['CSS (LoRa)', '~0.3', 'Low', '-20 dB SNR', 'LoRa IoT'],
        ]
      },
      {
        type: 'code',
        title: 'SDR Demodulation Algorithms',
        content: `# FM Demodulation (I/Q to audio)
phase[n] = atan2(Q[n], I[n])
freq[n]  = (phase[n] - phase[n-1]) × fs / (2π)
audio    = lowpass_filter(freq, cutoff=15kHz)

# AM Demodulation (envelope detection)
envelope[n] = sqrt(I[n]² + Q[n]²)
audio       = bandpass_filter(envelope, 300Hz-3kHz)

# BPSK Demodulation
symbol[n] = sign(I[n])  # Decision: +1 or -1
bit[n]    = (symbol[n] + 1) / 2  # Map to 0/1`
      }
    ]
  },

  didYouKnow: [
    'FM was invented by Edwin Armstrong in 1933, but the AM radio industry fought against it for decades because they had already invested in AM infrastructure!',
    'Your brain does "demodulation" too — when you hear someone talking, your ear converts sound waves back into nerve signals your brain understands.',
    'LoRa can communicate at signal levels BELOW the noise floor! Its chirp spread spectrum modulation can work at -20 dB SNR, meaning the signal is 100 times weaker than the noise.',
    'A single WiFi channel uses 64-QAM, which packs 6 bits into every symbol — that\'s 64 different signal states your router distinguishes!',
    'Morse code is actually a form of digital modulation — OOK (On-Off Keying) — invented over 180 years ago!'
  ],

  takeaways: [
    'AM varies amplitude, FM varies frequency to encode information',
    'Digital modulation (PSK, QAM, OFDM) enables modern communications',
    'Carson\u2019s Rule estimates FM bandwidth: BW \u2248 2(\u0394f + fm)',
    'Shannon\u2019s theorem defines the maximum data rate for a given bandwidth and SNR'
  ],

  quiz: {
    newb: [
      {
        question: 'What does AM change about the carrier wave?',
        options: ['Speed (frequency)', 'Height (amplitude)', 'Direction', 'Color'],
        correct: 1,
        explanation: 'AM (Amplitude Modulation) varies the wave\'s height/strength to encode information.'
      },
      {
        question: 'Which modulation type has better sound quality — AM or FM?',
        options: ['AM', 'FM', 'They\'re the same', 'Neither carries sound'],
        correct: 1,
        explanation: 'FM (Frequency Modulation) varies how fast the wave oscillates to encode information.'
      },
      {
        question: 'How does digital modulation represent data?',
        options: ['With colors', 'With 1s and 0s', 'With letters', 'With pictures'],
        correct: 1,
        explanation: 'Digital modulation converts data into discrete symbols, enabling error correction and compression.'
      }
    ],
    explorer: [
      {
        question: 'What is Carson\'s Rule for FM bandwidth?',
        options: ['BW = Δf × f_m', 'BW = 2(Δf + f_m)', 'BW = f_c / Δf', 'BW = Δf - f_m'],
        correct: 1,
        explanation: 'Carson\'s Rule estimates FM bandwidth: BW ≈ 2(Δf + fm) where Δf is deviation and fm is max modulation frequency.'
      },
      {
        question: 'How does an SDR demodulate FM from I/Q samples?',
        options: ['Envelope detection', 'Fourier transform', 'Phase differentiation', 'Power measurement'],
        correct: 2,
        explanation: 'QAM combines amplitude and phase modulation to pack more bits per symbol.'
      },
      {
        question: 'Which digital modulation sends 2 bits per symbol?',
        options: ['BPSK', 'OOK', 'QPSK', '16-QAM'],
        correct: 2,
        explanation: 'Constellation diagrams plot I vs Q to visualize how digital modulation encodes bits in signal phase and amplitude.'
      }
    ],
    developer: [
      {
        question: 'What is the power efficiency of standard AM at modulation index m=1?',
        options: ['100%', '50%', '33%', '17%'],
        correct: 2,
        explanation: 'OFDM splits a wideband channel into many narrow subcarriers, each modulated independently.'
      },
      {
        question: 'What SNR can LoRa\'s CSS modulation operate at?',
        options: ['+10 dB', '0 dB', '-10 dB', '-20 dB'],
        correct: 3,
        explanation: 'Shannon\'s theorem sets the maximum data rate: C = B × log₂(1 + SNR).'
      }
    ]
  },

  challenge: {
    newb: 'Go to the Simulator Playground and switch between AM, FM, ASK, FSK, and PSK modulation. Draw what each one looks like! Which one looks the most different?',
    explorer: 'Calculate the FM bandwidth for: (a) broadcast FM (Δf=75 kHz, f_m=15 kHz), (b) narrowband FM voice (Δf=5 kHz, f_m=3 kHz). How many NBFM channels fit in one broadcast FM channel?',
    developer: 'Implement FM demodulation from raw I/Q samples: given I[n] and Q[n] arrays, write pseudocode to extract audio. Include phase unwrapping and de-emphasis filtering (50 μs time constant for EU, 75 μs for US).'
  }
});

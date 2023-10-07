/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE 4: FREQUENCY & SPECTRUM
   ═══════════════════════════════════════════ */

ModuleContent.register('module-4', {
  narrative: {
    newb: "Imagine a rainbow — but instead of colors, it's made of RADIO SIGNALS! That's what a spectrum display shows. Every signal has its own spot, like every color has its place in the rainbow. Let's learn to read the radio rainbow!",
    explorer: "The spectrum is how we visualize radio signals across frequency. Understanding frequency, bandwidth, and how to read spectrum and waterfall displays is the core skill for any SDR operator. Time to master the tools!",
    developer: "Spectral analysis is fundamental to SDR. This module covers FFT-based spectrum estimation, windowing functions, resolution bandwidth, dynamic range considerations, and waterfall spectrogram interpretation."
  },

  sections: {
    newb: [
      {
        type: 'text',
        title: '🎵 What is Frequency?',
        content: `<p>Frequency is how FAST a wave vibrates. Think of it like a drumbeat:</p>
        <p><strong>Slow drumbeat</strong> = Low frequency = Long waves (like AM radio)</p>
        <p><strong>Fast drumbeat</strong> = High frequency = Short waves (like WiFi)</p>
        <p>We measure frequency in <strong>Hertz (Hz)</strong> — how many waves per second. One wave per second = 1 Hz.</p>`
      },
      {
        type: 'analogy',
        icon: '🎸',
        content: `Guitar strings work just like radio frequency! A thick, loose string vibrates slowly (low frequency = deep sound). A thin, tight string vibrates fast (high frequency = high-pitched sound). Radio works the same way — low frequency signals have long, lazy waves, and high frequency signals have short, quick waves.`
      },
      {
        type: 'table',
        title: '📏 Frequency Units',
        headers: ['Unit', 'Means', 'Example'],
        rows: [
          ['1 Hz', '1 wave per second', 'Heart beating'],
          ['1 kHz', '1,000 waves per second', 'Dog whistle'],
          ['1 MHz', '1,000,000 per second', 'FM radio (88-108 MHz)'],
          ['1 GHz', '1,000,000,000 per second', 'WiFi (2.4 GHz)'],
        ]
      },
      {
        type: 'text',
        title: '🌈 The Spectrum Display',
        content: `<p>A <strong>spectrum display</strong> is like a bar chart of radio signals. It shows:</p>
        <p>📏 <strong>Left to Right</strong> = Frequency (low → high)</p>
        <p>📶 <strong>Bottom to Top</strong> = How strong the signal is</p>
        <p>Tall peaks = strong signals (like nearby FM stations). The flat bumpy bottom = noise (normal background radio static).</p>`
      },
      {
        type: 'simulator',
        title: '🧪 Look at the FM Spectrum!',
        simType: 'spectrum',
        simId: 'mod4-fm-spectrum',
        simConfig: { scene: 'fmBand' }
      },
      {
        type: 'text',
        title: '🌊 The Waterfall Display',
        content: `<p>The <strong>waterfall</strong> is like a time machine for radio signals! It shows the spectrum scrolling down over time, painted in colors:</p>
        <p>🟦 <strong>Cold colors (blue/dark)</strong> = Weak or no signal</p>
        <p>🟥 <strong>Hot colors (red/yellow/white)</strong> = Strong signal!</p>
        <p>Signals that are always "on" look like vertical stripes. Signals that come and go look like dots or dashes.</p>`
      },
      {
        type: 'text',
        title: '📻 Bandwidth — How Wide is a Signal?',
        content: `<p>Every signal takes up some space on the spectrum. This space is called <strong>bandwidth</strong>.</p>
        <p>An FM radio station takes about <strong>200 kHz</strong> of space. A WiFi signal takes <strong>20 MHz</strong> — 100 times wider! That's why WiFi can carry so much more data.</p>
        <p>Think of bandwidth like a highway: more lanes = more cars can travel at once = more data!</p>`
      }
    ],

    explorer: [
      {
        type: 'text',
        title: 'Frequency, Period, and Wavelength',
        content: `<p>Three related properties of any wave:</p>
        <p><strong>Frequency (f)</strong>: Oscillations per second (Hz). <strong>Period (T)</strong>: Time for one cycle, T = 1/f. <strong>Wavelength (λ)</strong>: Physical length of one cycle, λ = c/f.</p>
        <p>Higher frequency → shorter period → shorter wavelength. These relationships are fundamental to all RF engineering.</p>`
      },
      {
        type: 'text',
        title: 'Reading the Spectrum Display',
        content: `<p>The spectrum display (FFT plot) shows <strong>power spectral density</strong> — signal strength (dBm or dBFS) vs frequency. Key elements to recognize:</p>
        <p><strong>Noise floor:</strong> The base level of background noise, typically -90 to -110 dBm for RTL-SDR. Signals must rise above this to be detected.</p>
        <p><strong>Signal peaks:</strong> Each peak represents a transmission. The height above the noise floor is the <strong>signal-to-noise ratio (SNR)</strong>.</p>
        <p><strong>Bandwidth:</strong> The width of a peak shows how much spectrum the signal occupies. FM ≈ 200 kHz, AM ≈ 10 kHz, WiFi ≈ 20 MHz.</p>
        <p><strong>Peak hold:</strong> A trace showing the maximum value at each frequency — useful for catching brief transmissions.</p>`
      },
      {
        type: 'table',
        title: 'Common Signal Bandwidths',
        headers: ['Signal Type', 'Bandwidth', 'Modulation', 'Data Capacity'],
        rows: [
          ['AM radio', '10 kHz', 'AM', 'Voice only'],
          ['FM radio', '200 kHz', 'FM (stereo)', 'Audio + RDS data'],
          ['Aircraft voice', '25 kHz', 'AM', 'Voice only'],
          ['ADS-B', '2 MHz', 'PPM', '112-bit messages'],
          ['LoRa', '125–500 kHz', 'CSS', '0.3–50 kbps'],
          ['WiFi (802.11n)', '20/40 MHz', 'OFDM', 'Up to 600 Mbps'],
          ['Bluetooth', '1 MHz', 'GFSK', 'Up to 3 Mbps'],
        ]
      },
      {
        type: 'text',
        title: 'Decibels (dB) — The Radio Power Scale',
        content: `<p>Radio uses <strong>decibels (dB)</strong> because signal power varies enormously — a ratio of 1,000,000,000,000 between strongest and weakest signals. Decibels compress this into a manageable range using logarithms.</p>
        <p>Key rules: <strong>+3 dB = double the power</strong>. <strong>+10 dB = 10× the power</strong>. <strong>+20 dB = 100× the power</strong>.</p>
        <p><strong>dBm</strong> = decibels relative to 1 milliwatt. 0 dBm = 1 mW. -100 dBm is a very weak signal (typical noise floor).</p>`
      },
      {
        type: 'text',
        title: 'Waterfall Spectrogram',
        content: `<p>The waterfall display plots <strong>frequency vs time</strong>, with color representing signal strength. Each horizontal line is one FFT frame. New data appears at the top and scrolls down.</p>
        <p>Patterns to recognize: constant carriers appear as vertical lines, FM broadcasts are wide bands, digital bursts appear as rectangles, and interference shows as horizontal lines across the waterfall.</p>`
      },
      {
        type: 'simulator',
        title: '🧪 Explore the Wideband Spectrum',
        simType: 'spectrum',
        simId: 'mod4-wideband',
        simConfig: { scene: 'wideband' }
      }
    ],

    developer: [
      {
        type: 'text',
        title: 'FFT-Based Spectral Estimation',
        content: `<p>The spectrum display computes the <strong>power spectral density (PSD)</strong> using the FFT. For N I/Q samples at sample rate fs:</p>
        <p><strong>Frequency resolution:</strong> Δf = fs / N. Example: 2.4 Msps / 1024-point FFT = 2.34 kHz per bin.</p>
        <p><strong>Time resolution:</strong> T = N / fs. This creates a fundamental trade-off — finer frequency resolution requires longer observation time (uncertainty principle: Δf × ΔT ≥ 1).</p>
        <p>The PSD in dBFS: P(k) = 10·log₁₀(|X(k)|² / N²) where X(k) is the FFT output.</p>`
      },
      {
        type: 'text',
        title: 'Windowing Functions',
        content: `<p>Applying a window function before FFT controls the trade-off between <strong>main lobe width</strong> (frequency resolution) and <strong>sidelobe level</strong> (spectral leakage):</p>
        <p><strong>Rectangular:</strong> Best resolution (Δf = fs/N), worst sidelobes (-13 dB). Good for resolving closely spaced signals.</p>
        <p><strong>Hann:</strong> Moderate resolution, good sidelobes (-31 dB). General purpose.</p>
        <p><strong>Blackman-Harris:</strong> Wider main lobe, excellent sidelobes (-92 dB). Best for detecting weak signals near strong ones.</p>
        <p><strong>Flat-top:</strong> Very wide main lobe, accurate amplitude measurement. Used for calibration.</p>`
      },
      {
        type: 'table',
        title: 'Windowing Comparison',
        headers: ['Window', 'Main Lobe Width', 'Sidelobes', 'Use Case'],
        rows: [
          ['Rectangular', '1 bin', '-13 dB', 'Maximum resolution'],
          ['Hann', '2 bins', '-31 dB', 'General purpose'],
          ['Hamming', '2 bins', '-42 dB', 'Communications'],
          ['Blackman-Harris', '4 bins', '-92 dB', 'Weak signal detection'],
          ['Kaiser (β=9)', '3 bins', '-70 dB', 'Adjustable trade-off'],
        ]
      },
      {
        type: 'text',
        title: 'Dynamic Range and Noise Floor',
        content: `<p><strong>Noise floor</strong> for an SDR is determined by: thermal noise + ADC quantization noise + phase noise. For RTL-SDR with 8-bit ADC:</p>
        <p>Thermal noise power: kTB = -174 dBm/Hz + 10·log₁₀(BW). At 2 MHz BW: -174 + 63 = -111 dBm.</p>
        <p>Quantization noise: 6.02N + 1.76 dB ≈ 49.9 dB for N=8 bits.</p>
        <p><strong>SFDR (Spurious-Free Dynamic Range)</strong> is limited by ADC bits and is the key performance metric for detecting weak signals near strong ones. RTL-SDR SFDR ≈ 45-50 dB, vs ~72 dB for 12-bit Airspy.</p>`
      },
      {
        type: 'code',
        title: 'Key Spectral Formulas',
        content: `FFT bin spacing:     Δf = fs / N
Time per FFT frame:  T = N / fs
Resolution BW:       RBW ≈ ENBW × (fs / N)
Noise floor (dBFS):  -6.02N - 1.76 + 10·log₁₀(N/2)
Processing gain:     10·log₁₀(fs / RBW)
Overlap for Hann:    50% (optimal)
Welch PSD:           Average of overlapping windowed FFTs`
      }
    ]
  },

  didYouKnow: [
    'The FM band (88-108 MHz) is only a tiny sliver of the radio spectrum — less than 0.002% of what RTL-SDR can receive!',
    'A WiFi signal takes up 100 times more bandwidth than an FM radio station. That\'s why WiFi can carry video but FM can only carry audio.',
    'The word "spectrum" comes from Latin meaning "appearance" — Isaac Newton first used it to describe the rainbow of colors from a prism.',
    'Radio astronomers use spectrum analysis to identify chemicals in distant galaxies — every element has a unique "fingerprint" of frequencies.',
    'The background noise floor of the universe (cosmic microwave background) is about 2.7 Kelvin — just 2.7 degrees above absolute zero!'
  ],

  takeaways: [
    'FFT converts time-domain signals into a frequency spectrum display',
    'The Nyquist theorem: sample at ≥2× the highest frequency to avoid aliasing',
    'Signal power is measured in dBm (decibels relative to 1 milliwatt)',
    'Window functions reduce spectral leakage in FFT analysis'
  ],

  quiz: {
    newb: [
      {
        question: 'What does frequency measure?',
        options: ['How far a wave travels', 'How fast a wave vibrates', 'How loud a signal is', 'How old a signal is'],
        correct: 1,
        explanation: 'FFT (Fast Fourier Transform) is the mathematical algorithm that splits a signal into its frequency components.'
      },
      {
        question: '1 GHz equals how many Hz?',
        options: ['1,000', '1,000,000', '1,000,000,000', '1,000,000,000,000'],
        correct: 2,
        explanation: 'Nyquist says you must sample at least twice the highest frequency to capture it accurately.'
      },
      {
        question: 'On a spectrum display, what do tall peaks represent?',
        options: ['Old signals', 'Strong signals', 'Broken signals', 'Slow signals'],
        correct: 1,
        explanation: 'Bandwidth is the range of frequencies a signal occupies — wider bandwidth means more information.'
      }
    ],
    explorer: [
      {
        question: 'What does +10 dB represent?',
        options: ['10× the power', '10 more watts', 'Double the frequency', '10 more signals'],
        correct: 0,
        explanation: 'dBm measures power relative to 1 milliwatt. 0 dBm = 1 mW, each +3 dB doubles the power.'
      },
      {
        question: 'What is the approximate bandwidth of an FM radio station?',
        options: ['10 kHz', '200 kHz', '2 MHz', '20 MHz'],
        correct: 1,
        explanation: 'Window functions reduce spectral leakage in FFT by tapering the signal edges to zero.'
      },
      {
        question: 'What creates the "noise floor" on a spectrum display?',
        options: ['Broken equipment', 'Background electromagnetic noise', 'FM radio stations', 'The antenna vibrating'],
        correct: 1,
        explanation: 'A waterfall display shows frequency (x-axis) vs time (y-axis) with color indicating signal strength.'
      }
    ],
    developer: [
      {
        question: 'For a 1024-point FFT at 2.4 Msps, what is the frequency resolution?',
        options: ['234 Hz', '2.34 kHz', '23.4 kHz', '234 kHz'],
        correct: 1,
        explanation: 'Zero-padding an FFT interpolates between frequency bins for smoother display, but doesn\'t add real resolution.'
      },
      {
        question: 'Which window function has the best sidelobe suppression?',
        options: ['Rectangular', 'Hann', 'Hamming', 'Blackman-Harris'],
        correct: 3,
        explanation: 'Welch\'s method averages multiple overlapping FFT segments to reduce noise variance in the spectrum estimate.'
      }
    ]
  },

  challenge: {
    newb: 'Go to the Simulator Playground and count how many FM stations you can see in the FM Band scene. Write down their frequencies!',
    explorer: 'Calculate the bandwidth ratio between WiFi (20 MHz) and AM radio (10 kHz). How many AM stations could fit inside one WiFi channel?',
    developer: 'Design FFT parameters for an ADS-B receiver at 1090 MHz with 2 Msps sample rate: choose FFT size, window function, and overlap percentage. Justify your choices considering ADS-B\'s 1 μs pulse width.'
  }
});

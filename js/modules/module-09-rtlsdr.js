/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE 9: RTL-SDR LAB
   ═══════════════════════════════════════════ */

ModuleContent.register('module-9', {
  narrative: {
    newb: "This is the big one! The RTL-SDR is your window into the invisible world of radio. With this little USB dongle, you can hear FM music, track airplanes flying overhead, receive pictures from weather satellites in SPACE, and so much more. Let's explore!",
    explorer: "RTL-SDR is the most important tool in your SDR toolkit. This $25 USB dongle receives from 24 MHz to 1.7 GHz — covering FM broadcast, aircraft, weather satellites, amateur radio, ISM bands, and more. Time to put theory into practice!",
    developer: "The RTL2832U+R820T2 platform provides a cost-effective wideband receiver for signal analysis. This module covers hardware setup, driver configuration, software ecosystem, and practical reception techniques for key signal types."
  },

  sections: {
    newb: [
      {
        type: 'text',
        title: '📻 Your First Real SDR!',
        content: `<p>The <strong>RTL-SDR</strong> is a small USB device (about the size of your thumb) that turns your computer into a powerful radio receiver. Just plug it in, connect an antenna, and you can hear thousands of different signals!</p>
        <p>It can only <strong>receive</strong> (listen) — it cannot transmit (send). This means it's <strong>100% safe</strong> for kids! You can't accidentally interfere with anything.</p>`
      },
      {
        type: 'cards',
        title: '🎯 Amazing Things to Receive',
        items: [
          { icon: '📻', title: 'FM Radio', description: 'Listen to any FM station (88-108 MHz) with crystal-clear quality!' },
          { icon: '✈️', title: 'Airplane Tracker', description: 'See every plane in the sky on a map! (ADS-B at 1090 MHz)' },
          { icon: '🛰️', title: 'Weather Satellites', description: 'Receive real photos from NOAA satellites passing overhead! (137 MHz)' },
          { icon: '🌡️', title: 'Wireless Sensors', description: 'Read your neighbor\'s weather station data! (433 MHz)' },
        ]
      },
      {
        type: 'steps',
        title: '🔧 Getting Started',
        items: [
          { title: 'Get an RTL-SDR', description: 'Buy an "RTL-SDR Blog V4" or similar dongle (~$25-30 online). It comes with a small antenna.' },
          { title: 'Install drivers', description: 'Windows: Install Zadig USB driver. Mac/Linux: drivers usually work automatically.' },
          { title: 'Install software', description: 'Download SDR++ (all platforms), SDR# (Windows), or GQRX (Mac/Linux). They\'re all free!' },
          { title: 'Plug in and tune!', description: 'Connect the antenna, plug in the dongle, open the software, and tune to 100 MHz — you should hear FM radio!' },
          { title: 'Explore!', description: 'Move the frequency up and down. Watch the spectrum display. Every bump and peak is a different signal!' },
        ]
      },
      {
        type: 'text',
        title: '✈️ Track Airplanes!',
        content: `<p>Every airplane broadcasts its position, speed, and altitude using a signal called <strong>ADS-B</strong> at <strong>1090 MHz</strong>. Your RTL-SDR can receive these signals!</p>
        <p>Use software like <strong>dump1090</strong> or <strong>FlightAware</strong> to see planes on a map in real time. You'll be amazed how many planes are flying near you right now!</p>`
      },
      {
        type: 'text',
        title: '🛰️ Pictures from Space!',
        content: `<p>NOAA weather satellites orbit Earth every 100 minutes, broadcasting weather images at <strong>137 MHz</strong> as they pass overhead. With RTL-SDR and a simple antenna, you can receive these images directly!</p>
        <p>The satellite transmits the image line by line as it flies over — like a very slow fax machine from space. You'll see clouds, coastlines, and weather patterns just like meteorologists do!</p>`
      },
      {
        type: 'simulator',
        title: '🧪 See What RTL-SDR Can Receive',
        simType: 'spectrum',
        simId: 'mod9-wideband',
        simConfig: { scene: 'wideband' }
      }
    ],

    explorer: [
      {
        type: 'text',
        title: 'RTL-SDR Hardware Details',
        content: `<p>The RTL-SDR uses two chips: the <strong>R820T2</strong> tuner and the <strong>RTL2832U</strong> ADC/USB interface. The R820T2 covers 24 MHz to 1766 MHz, while the RTL2832U digitizes the IF signal at up to 3.2 Msps with 8-bit resolution.</p>
        <p>The "Blog V4" version adds: TCXO (0.5 ppm stability), improved filtering, SMA connector, bias-tee for powering active antennas/LNAs, and thermal pad.</p>`
      },
      {
        type: 'table',
        title: 'RTL-SDR Signal Reception Guide',
        headers: ['Signal', 'Frequency', 'Bandwidth', 'Software', 'Antenna Needed'],
        rows: [
          ['FM Broadcast', '88-108 MHz', '200 kHz', 'SDR++, SDR#, GQRX', 'Stock whip works'],
          ['Aviation Voice', '118-137 MHz', '25 kHz (AM)', 'SDR++ AM mode', 'Stock whip works'],
          ['NOAA Satellites', '137.1/137.62/137.91 MHz', '40 kHz', 'SDR++ → WXtoImg', 'V-dipole or QFH'],
          ['Amateur 2m', '144-148 MHz', '15 kHz (FM)', 'SDR++ FM mode', 'Dipole or ground plane'],
          ['ISM 433 MHz', '433.92 MHz', '~50 kHz', 'rtl_433, URH', 'Dipole or whip (17cm)'],
          ['Amateur 70cm', '430-440 MHz', '12.5 kHz', 'SDR++ FM mode', 'Dipole or ground plane'],
          ['LoRa', '868/915 MHz', '125 kHz', 'SDR++ or gr-lora', 'Whip cut to λ/4'],
          ['ADS-B Aircraft', '1090 MHz', '2 MHz', 'dump1090, FlightAware', 'Collinear or ground plane'],
          ['GPS L1', '1575.42 MHz', '2 MHz', 'gnss-sdr', 'Patch or active antenna'],
        ]
      },
      {
        type: 'text',
        title: 'Software Ecosystem',
        content: `<p><strong>General receivers:</strong> SDR++ (cross-platform, modern), SDR# (Windows, most plugins), GQRX (Linux/Mac, GNU Radio based), CubicSDR (cross-platform).</p>
        <p><strong>Specialized decoders:</strong> dump1090 (ADS-B aircraft), WXtoImg/noaa-apt (NOAA satellites), rtl_433 (ISM band sensors), multimon-ng (POCSAG pagers), dsd (digital voice), gr-lora (LoRa decode).</p>
        <p><strong>Framework:</strong> GNU Radio (Python/C++ DSP framework) for custom signal processing pipelines.</p>`
      },
      {
        type: 'text',
        title: 'Practical Tips',
        content: `<p><strong>Sample rate:</strong> Use 2.048 or 2.4 Msps for most applications. Higher rates increase CPU load and may cause dropped samples on slow computers.</p>
        <p><strong>Gain:</strong> Start with AGC, then switch to manual gain. Too much gain overloads the ADC and causes spurious signals. Too little means weak signals are lost in the noise.</p>
        <p><strong>DC spike:</strong> There's always a spike at the center frequency — this is a hardware artifact. Offset your tuning by 100-200 kHz to avoid it.</p>
        <p><strong>Antenna:</strong> The stock telescopic antenna is okay for strong signals (FM, aircraft). For weaker signals (NOAA sats, ISM), build a proper dipole or ground plane antenna.</p>`
      },
      {
        type: 'info',
        content: 'RTL-SDR Blog V4 has a built-in <strong>bias-tee</strong> that can supply 4.5V through the coax to power active antennas and LNAs. Enable it in software — but be careful not to short-circuit it!'
      }
    ],

    developer: [
      {
        type: 'text',
        title: 'RTL-SDR Driver Architecture',
        content: `<p>The open-source <strong>librtlsdr</strong> library communicates with the RTL2832U via USB bulk transfers. Key API functions:</p>
        <p><code>rtlsdr_open()</code> → <code>rtlsdr_set_center_freq()</code> → <code>rtlsdr_set_sample_rate()</code> → <code>rtlsdr_set_tuner_gain_mode()</code> → <code>rtlsdr_read_async()</code> or <code>rtlsdr_read_sync()</code>.</p>
        <p>Data format: interleaved 8-bit unsigned I/Q samples (I₀, Q₀, I₁, Q₁, ...). Convert to signed: sample = (raw - 127.5) / 127.5. Each I/Q pair represents one complex sample.</p>`
      },
      {
        type: 'text',
        title: 'Performance Optimization',
        content: `<p><strong>USB buffer management:</strong> Use async reads with large buffers (256 KB × 16 buffers) to prevent dropped samples. Process in a separate thread from USB read.</p>
        <p><strong>Decimation:</strong> If you only need a narrow channel (e.g., 25 kHz AM), decimate from 2.4 Msps → 48 ksps using a CIC filter followed by compensation FIR. This reduces CPU load by 50×.</p>
        <p><strong>Spurious signals:</strong> The 8-bit ADC creates intermodulation products from strong signals. Use an RF bandpass filter for the frequency of interest. For ADS-B, a 1090 MHz cavity filter dramatically improves performance.</p>
        <p><strong>Frequency stability:</strong> The R820T2 PLL locks in ~5 ms. For frequency-hopping applications, use the TCXO-equipped V4 model (0.5 ppm vs 25+ ppm for bare RTL2832U).</p>`
      },
      {
        type: 'code',
        title: 'Python: RTL-SDR Raw I/Q Capture',
        content: `import numpy as np
from rtlsdr import RtlSdr

sdr = RtlSdr()
sdr.sample_rate = 2.4e6      # 2.4 Msps
sdr.center_freq = 100.3e6    # 100.3 MHz FM station
sdr.gain = 30                # dB (or 'auto')

# Read 1 second of I/Q samples
samples = sdr.read_samples(int(2.4e6))  # Complex64 array

# FM demodulation
phase = np.angle(samples)
freq = np.diff(np.unwrap(phase))
audio = freq * sdr.sample_rate / (2 * np.pi)

# Decimate to 48 kHz audio
from scipy.signal import decimate
audio_48k = decimate(audio, 50)  # 2.4M/50 = 48k

sdr.close()`
      },
      {
        type: 'table',
        title: 'RTL-SDR Known Limitations & Mitigations',
        headers: ['Limitation', 'Impact', 'Mitigation'],
        rows: [
          ['8-bit ADC', '~48 dB dynamic range', 'RF bandpass filter, careful gain management'],
          ['DC offset spike', 'Dead zone at center freq', 'Offset tuning by 100+ kHz'],
          ['Phase noise', 'Raised noise floor near strong signals', 'TCXO model, external reference'],
          ['Image rejection', 'Mirror signals ±IF', 'Handled by R820T2 tuner, but imperfect'],
          ['Max sample rate', '2.4 Msps stable (3.2 with drops)', 'Use minimum rate needed, USB 3.0 host'],
          ['No TX', 'Receive only', 'Use HackRF for TX experiments'],
        ]
      }
    ]
  },

  didYouKnow: [
    'RTL-SDR was originally a cheap digital TV tuner! Hackers discovered it could receive almost any radio signal, and it became the most popular SDR device in the world.',
    'With RTL-SDR, you can listen to the International Space Station (ISS) when it passes overhead — astronauts sometimes talk on 145.80 MHz!',
    'Some people use RTL-SDR to receive signals from deep space probes millions of kilometers away, using large homemade dish antennas.',
    'FlightAware will give you a free premium account if you share your ADS-B data from an RTL-SDR receiver with their network!',
    'NOAA weather satellites were launched in the 1990s-2000s and are still working! They broadcast images as they orbit the Earth 14 times per day.'
  ],

  takeaways: [
    'RTL-SDR covers ~24 MHz to 1.766 GHz using the R820T2 tuner chip',
    'RTL-SDR is receive-only — it cannot transmit, making it safe for beginners',
    '8-bit ADC gives ~48 dB dynamic range at up to 2.56 Msps effective rate',
    'Bias-T can power external LNAs and active antennas through the coax'
  ],

  quiz: {
    newb: [
      {
        question: 'Can RTL-SDR transmit (send) radio signals?',
        options: ['Yes, very powerfully', 'Yes, but weakly', 'No — receive only', 'Only with special software'],
        correct: 2,
        explanation: 'The RTL-SDR covers approximately 24 MHz to 1.766 GHz using the R820T2 tuner.'
      },
      {
        question: 'What is ADS-B?',
        options: ['A type of music', 'Aircraft position signals at 1090 MHz', 'A satellite TV channel', 'A video game'],
        correct: 1,
        explanation: 'SDR# (SDRSharp) is one of the most popular free Windows programs for RTL-SDR.'
      },
      {
        question: 'How much does a basic RTL-SDR dongle cost?',
        options: ['$5', '$25-30', '$200', '$500'],
        correct: 1,
        explanation: 'The RTL-SDR can only receive signals — it cannot transmit.'
      }
    ],
    explorer: [
      {
        question: 'What frequency do NOAA weather satellites broadcast on?',
        options: ['88-108 MHz', '~137 MHz', '433 MHz', '1090 MHz'],
        correct: 1,
        explanation: 'The R820T2 tuner converts RF to an intermediate frequency, then the RTL2832U digitizes it.'
      },
      {
        question: 'What is the DC spike in RTL-SDR caused by?',
        options: ['Software bug', 'Hardware artifact in the ADC', 'Strong FM stations', 'A broken antenna'],
        correct: 1,
        explanation: 'Direct sampling mode bypasses the tuner to receive HF frequencies below ~30 MHz.'
      },
      {
        question: 'What is the maximum usable sample rate for RTL-SDR?',
        options: ['480 Ksps', '1.2 Msps', '2.4 Msps (3.2 with drops)', '20 Msps'],
        correct: 2,
        explanation: 'A bias-T sends DC power up the coax cable to power active antennas or LNAs.'
      }
    ],
    developer: [
      {
        question: 'What data format does librtlsdr output?',
        options: ['16-bit signed I/Q', '8-bit unsigned interleaved I/Q', '32-bit float complex', 'Compressed audio'],
        correct: 1,
        explanation: '8-bit resolution gives about 48 dB of dynamic range — a key limitation of the RTL-SDR.'
      },
      {
        question: 'To demodulate FM from I/Q samples, you compute:',
        options: ['sqrt(I² + Q²)', 'I × Q', 'd[atan2(Q,I)]/dt', 'I + Q'],
        correct: 2,
        explanation: 'The maximum sample rate is 2.56 Msps, giving 2.56 MHz of instantaneous bandwidth.'
      }
    ]
  },

  challenge: {
    newb: 'If you have an RTL-SDR, tune to the FM band and find your favorite radio station. Write down its exact frequency and how strong its signal looks on the spectrum display!',
    explorer: 'Set up ADS-B reception: install dump1090, connect RTL-SDR with the stock antenna, and record how many unique aircraft you see in 1 hour. Calculate the detection range based on the furthest aircraft.',
    developer: 'Write a Python script using pyrtlsdr to: capture 5 seconds of I/Q at 2.4 Msps centered on an FM station, demodulate FM, decimate to 48 kHz audio, and save as a WAV file. Bonus: implement stereo decode using the 19 kHz pilot tone.'
  }
});

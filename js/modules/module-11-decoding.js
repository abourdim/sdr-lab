/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE 11: SIGNAL DECODING LAB
   ═══════════════════════════════════════════ */

ModuleContent.register('module-11', {
  narrative: {
    newb: "Now for the detective work! Every radio signal is like a coded message — and YOU can learn to decode them! We'll track airplanes, receive pictures from space, and read data from wireless sensors. It's like being a radio spy (a legal one)!",
    explorer: "Signal decoding is where SDR gets practical. We'll decode ADS-B aircraft transponders, NOAA weather satellite imagery, ISM band sensors, and pager messages. Each protocol has unique characteristics visible on the spectrum and waterfall.",
    developer: "Protocol analysis and signal decoding require understanding frame structures, encoding schemes, error correction, and timing recovery. We'll examine the demodulation and decoding pipelines for ADS-B, NOAA APT, and ISM OOK/FSK protocols."
  },

  sections: {
    newb: [
      {
        type: 'text',
        title: '🔓 Decoding Radio Signals',
        content: `<p>Radio signals carry hidden information — like secret messages waiting to be read! With the right software, your SDR can decode these signals and turn them into useful data.</p>
        <p>The amazing part? Most of these signals are meant to be public! Airplanes WANT you to know where they are (for safety). Weather satellites broadcast images for everyone. It's all out there waiting for you!</p>`
      },
      {
        type: 'cards',
        title: '🎯 Signals You Can Decode',
        items: [
          { icon: '✈️', title: 'ADS-B (Aircraft)', description: 'See every plane\'s position, altitude, speed, and flight number on a map!' },
          { icon: '🛰️', title: 'NOAA Satellites', description: 'Receive real weather photos directly from satellites orbiting Earth!' },
          { icon: '🌡️', title: 'Weather Sensors', description: 'Read temperature, humidity, and rain data from wireless sensors nearby.' },
          { icon: '📟', title: 'Pagers', description: 'Some areas still use pager systems — you can read their public messages!' },
        ]
      },
      {
        type: 'text',
        title: '✈️ ADS-B — Tracking Aircraft',
        content: `<p><strong>ADS-B</strong> stands for Automatic Dependent Surveillance — Broadcast. Every modern airplane constantly shouts: "Here I am! I'm flight ABC123, at 35,000 feet, going 500 mph, heading north!"</p>
        <p>These messages are broadcast at <strong>1090 MHz</strong>, and anyone with an RTL-SDR can receive them!</p>
        <p><strong>What you'll see:</strong> A map showing every plane within ~100-200 km of your antenna, updating in real time. It's like having your own air traffic control radar!</p>`
      },
      {
        type: 'steps',
        title: '🛰️ How to Receive Weather Satellite Images',
        items: [
          { title: 'Find the schedule', description: 'Use the "Look4Sat" app or n2yo.com to find when NOAA-15, 18, or 19 will pass overhead (usually several times a day).' },
          { title: 'Prepare your antenna', description: 'A simple V-dipole (two wires at 120° angle, each ~53 cm long) pointed at the sky works great!' },
          { title: 'Tune your SDR', description: 'Set to 137.1 MHz (NOAA-15), 137.62 MHz (NOAA-18), or 137.9125 MHz (NOAA-19). Use FM mode, ~40 kHz bandwidth.' },
          { title: 'Record the pass', description: 'When the satellite appears, you\'ll hear a distinctive ticking sound. Record the audio for 10-15 minutes.' },
          { title: 'Decode the image', description: 'Use WXtoImg or noaa-apt software to convert the audio into a weather image. You\'ll see clouds, land, and ocean from space!' },
        ]
      },
      {
        type: 'text',
        title: '🌡️ ISM Band Sensors (433 MHz)',
        content: `<p>Lots of wireless devices chatter at <strong>433 MHz</strong>: weather stations, doorbell sensors, car key fobs, temperature sensors, and more. The software <strong>rtl_433</strong> can decode over 200 different sensor types automatically!</p>
        <p>Just run it and watch data stream in — you might discover sensors you didn't even know existed nearby!</p>`
      }
    ],

    explorer: [
      {
        type: 'text',
        title: 'ADS-B Protocol',
        content: `<p>ADS-B uses <strong>PPM (Pulse Position Modulation)</strong> at 1090 MHz. Each message is 112 bits long (extended squitter) transmitted as 1 μs pulses.</p>
        <p><strong>Message structure:</strong> 8 μs preamble (1010000101000000) → 56 or 112 data bits → 24-bit CRC. The preamble's distinctive pattern allows receivers to detect the start of each message.</p>
        <p><strong>Message types:</strong> DF17 (extended squitter) carries aircraft ID, position (CPR encoded lat/lon), velocity, altitude. DF11 carries Mode-S transponder replies.</p>
        <p><strong>Position encoding:</strong> CPR (Compact Position Reporting) encodes latitude/longitude in 17 bits each. You need two messages (odd and even) to decode a full position — this is a clever compression trick.</p>`
      },
      {
        type: 'text',
        title: 'NOAA APT Protocol',
        content: `<p>NOAA weather satellites use <strong>APT (Automatic Picture Transmission)</strong> — an analog FM signal at ~137 MHz. The image is transmitted line by line at 2 lines per second, 4160 samples per line.</p>
        <p><strong>Signal structure:</strong> 2400 Hz subcarrier, AM modulated with image data. Two image channels side-by-side: visible light (Channel A) and infrared (Channel B), plus synchronization markers and telemetry.</p>
        <p>The sync pattern (7 cycles of 1040 Hz for Channel A, 7 cycles of 832 Hz for Channel B) allows the decoder to align the image correctly.</p>
        <p><strong>Doppler compensation:</strong> The satellite moves at ~7.5 km/s, causing ±3 kHz Doppler shift at 137 MHz. Your receiver must track this shift across the 12-15 minute pass.</p>`
      },
      {
        type: 'text',
        title: 'ISM Band Decoding with rtl_433',
        content: `<p><strong>rtl_433</strong> is a universal decoder for the 433 MHz ISM band. It supports 200+ device protocols using primarily OOK (On-Off Keying) and FSK modulation.</p>
        <p>Common protocols: Oregon Scientific (weather stations), Acurite (temp/humidity), LaCrosse (sensors), Honeywell (security), and many generic remote controls.</p>
        <p><strong>Protocol structure:</strong> Most ISM sensors use simple packet formats: preamble → sync word → device ID → data payload → checksum. Data rates are typically 1-10 kbps with OOK or 2-FSK modulation.</p>`
      },
      {
        type: 'table',
        title: 'Decodable Signals Reference',
        headers: ['Signal', 'Frequency', 'Modulation', 'Decoder Software', 'Difficulty'],
        rows: [
          ['ADS-B', '1090 MHz', 'PPM', 'dump1090, readsb', '⭐ Easy'],
          ['NOAA APT', '137 MHz', 'FM + AM subcarrier', 'noaa-apt, WXtoImg', '⭐⭐ Medium'],
          ['Meteor M2 LRPT', '137.1 MHz', 'QPSK', 'meteor_demod', '⭐⭐⭐ Hard'],
          ['ISM sensors', '433 MHz', 'OOK / FSK', 'rtl_433', '⭐ Easy'],
          ['POCSAG pagers', '~150 MHz', 'FSK', 'multimon-ng', '⭐⭐ Medium'],
          ['ACARS (aviation)', '131.55 MHz', 'AM + MSK', 'acarsdec', '⭐⭐ Medium'],
          ['AIS (ships)', '161.975/162.025 MHz', 'GMSK', 'AIS-catcher', '⭐⭐ Medium'],
        ]
      },
      {
        type: 'simulator',
        title: '🧪 ADS-B Frequency',
        simType: 'spectrum',
        simId: 'mod11-adsb',
        simConfig: { scene: 'adsb' }
      }
    ],

    developer: [
      {
        type: 'text',
        title: 'ADS-B Decoding Pipeline',
        content: `<p><strong>Signal chain:</strong> RF (1090 MHz) → RTL-SDR @ 2 Msps → magnitude detection → preamble correlation → bit extraction → CRC-24 check → message parsing → position decoding.</p>
        <p><strong>Preamble detection:</strong> Correlate incoming magnitude samples against the known preamble pattern [1,0,1,0,0,0,0,1,0,1,0,0,0,0,0,0]. Threshold: preamble energy > 2× mean noise energy.</p>
        <p><strong>Bit extraction:</strong> Each bit is 1 μs (2 samples at 2 Msps). PPM: pulse in first half = 1, pulse in second half = 0.</p>
        <p><strong>CPR position decode:</strong> Two messages (odd frame, even frame) provide: lat_cpr_even, lon_cpr_even, lat_cpr_odd, lon_cpr_odd (each 17 bits). The NL(lat) function (Number of Longitude zones) maps latitude to longitude precision. Global decode requires both frames received within 10 seconds.</p>`
      },
      {
        type: 'code',
        title: 'ADS-B Bit Extraction (Pseudocode)',
        content: `# After preamble detection at sample index i:
bits = []
for bit_idx in range(112):
    sample_pos = i + 16 + bit_idx * 2  # 16 = preamble length
    mag_first  = magnitude[sample_pos]
    mag_second = magnitude[sample_pos + 1]
    bits.append(1 if mag_first > mag_second else 0)

# CRC-24 check
generator = 0xFFF409  # ADS-B CRC polynomial
if crc24(bits) == 0:
    # Valid message — parse DF type
    df = (bits[0:5] as int)
    if df == 17:  # Extended squitter
        icao = bits[8:32]   # Aircraft ID
        tc = bits[32:37]    # Type code
        # tc 1-4: ID, 9-18: airborne pos, 19: velocity`
      },
      {
        type: 'text',
        title: 'NOAA APT Decode Pipeline',
        content: `<p><strong>Signal chain:</strong> RF (137 MHz, FM) → RTL-SDR @ 250 ksps → FM demod → resample to 20800 Hz → AM demod (hilbert envelope) → sync detection → line assembly → image construction.</p>
        <p>The 20800 Hz sample rate is chosen because APT transmits 4160 pixels/line × 2 lines/second × 2 channels + sync + telemetry. The AM subcarrier at 2400 Hz modulates image brightness.</p>
        <p><strong>Sync detection:</strong> Channel A sync is 7 pulses of 1040 Hz followed by a specific pattern. Cross-correlate the demodulated signal with the expected sync waveform. Peak position indicates line start.</p>
        <p><strong>Image enhancement:</strong> Apply histogram equalization, thermal/visible channel mapping, geographic overlay using satellite TLE orbital elements and reception timestamp.</p>`
      },
      {
        type: 'text',
        title: 'Protocol Reverse Engineering',
        content: `<p>For unknown signals, the workflow is: <strong>Observe → Classify → Demodulate → Analyze → Decode.</strong></p>
        <p>1. <strong>Observe:</strong> Record I/Q. Examine spectrum (bandwidth, center freq) and waterfall (timing, burst patterns).</p>
        <p>2. <strong>Classify:</strong> Determine modulation: constant envelope → FM/FSK/GFSK. Varying amplitude → AM/ASK/OOK. Phase jumps → PSK.</p>
        <p>3. <strong>Demodulate:</strong> Apply appropriate demodulator. Use Inspectrum or URH for visual analysis.</p>
        <p>4. <strong>Analyze:</strong> Find preamble, sync word, packet boundaries. Measure symbol rate, identify encoding (Manchester, NRZ, etc.).</p>
        <p>5. <strong>Decode:</strong> Parse fields, verify checksums, correlate with physical events (button press, sensor reading).</p>`
      }
    ]
  },

  didYouKnow: [
    'The first ADS-B signals were decoded by hobbyists using homemade equipment before any government mandated it for aviation safety!',
    'NOAA-15, launched in 1998, is still broadcasting weather images daily — over 27 years of continuous operation from space!',
    'rtl_433 can decode signals from over 200 different sensor types — many people discover neighbors\' sensors they never knew existed.',
    'Ships broadcast their position using AIS (Automatic Identification System) — you can track every ship near the coast with RTL-SDR!',
    'The Meteor M2 Russian weather satellite sends digital images at much higher resolution than NOAA, but the decode is more complex.'
  ],

  takeaways: [
    'ADS-B on 1090 MHz uses PPM encoding — decodable with RTL-SDR + dump1090',
    'NOAA APT satellites on 137 MHz transmit weather images receivable with simple antennas',
    'Protocol reverse engineering follows: Observe → Classify → Demodulate → Analyze → Decode',
    'Tools like rtl_433 and URH automate decoding of hundreds of protocols'
  ],

  quiz: {
    newb: [
      {
        question: 'What does ADS-B tell you about airplanes?',
        options: ['What food they serve', 'Position, altitude, speed, and flight number', 'The pilot\'s name', 'How much fuel they have'],
        correct: 1,
        explanation: 'ADS-B aircraft transponders broadcast on exactly 1090 MHz worldwide.'
      },
      {
        question: 'What frequency do NOAA weather satellites use?',
        options: ['88 MHz', '137 MHz', '433 MHz', '1090 MHz'],
        correct: 1,
        explanation: 'NOAA weather satellites transmit images on 137 MHz that anyone can receive with simple antennas.'
      },
      {
        question: 'What software decodes wireless sensors at 433 MHz?',
        options: ['Microsoft Word', 'rtl_433', 'Photoshop', 'VLC Media Player'],
        correct: 1,
        explanation: 'Protocol decoding means converting raw radio signals into meaningful data like position or weather images.'
      }
    ],
    explorer: [
      {
        question: 'What modulation does ADS-B use?',
        options: ['FM', 'AM', 'PPM (Pulse Position Modulation)', 'OFDM'],
        correct: 2,
        explanation: 'ADS-B uses Pulse Position Modulation — each bit is encoded by the timing of pulses.'
      },
      {
        question: 'How many messages do you need to decode an ADS-B position?',
        options: ['1 (single message)', '2 (odd and even frame)', '4 (all quadrants)', '10 (average)'],
        correct: 1,
        explanation: 'CPR (Compact Position Reporting) compresses latitude/longitude into fewer bits for ADS-B.'
      },
      {
        question: 'What causes the frequency to shift during a satellite pass?',
        options: ['Solar wind', 'Doppler effect from satellite motion', 'Earth\'s rotation', 'Atmospheric absorption'],
        correct: 1,
        explanation: 'APT (Automatic Picture Transmission) sends two image lines per second at 2080 samples per line.'
      }
    ],
    developer: [
      {
        question: 'What is the ADS-B CRC polynomial?',
        options: ['CRC-16', 'CRC-24 (0xFFF409)', 'CRC-32', 'CRC-8'],
        correct: 1,
        explanation: 'The ADS-B CRC uses polynomial 0xFFF409 (sometimes stated as 0xFFFA0480) for error detection.'
      },
      {
        question: 'What sample rate is used for NOAA APT line assembly?',
        options: ['8000 Hz', '11025 Hz', '20800 Hz', '48000 Hz'],
        correct: 2,
        explanation: 'Universal Radio Hacker (URH) automates the process of recording, demodulating, and analyzing unknown protocols.'
      }
    ]
  },

  challenge: {
    newb: 'If you have RTL-SDR, set up dump1090 and count how many different planes you can see in one hour. What\'s the farthest one?',
    explorer: 'Receive a NOAA satellite pass: find the schedule, build a V-dipole antenna, record the signal, and decode the image. What weather features can you identify?',
    developer: 'Implement a minimal ADS-B decoder: from raw 2 Msps I/Q, detect preambles, extract 112-bit messages, verify CRC-24, and parse DF17 type codes 9-18 to extract aircraft position.'
  }
});

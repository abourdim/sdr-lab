/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE 12: SDR + IOT PROTOCOLS
   ═══════════════════════════════════════════ */

ModuleContent.register('module-12', {
  narrative: {
    newb: "The Internet of Things is everywhere — smart homes, weather stations, farm sensors, city infrastructure. All these devices talk to each other using radio waves! Let's learn how IoT devices communicate and see their signals with SDR.",
    explorer: "IoT protocols like LoRaWAN, Zigbee, Z-Wave, and Bluetooth LE each occupy specific frequency bands with distinct modulation schemes. Understanding these protocols through SDR observation is key to IoT security and development.",
    developer: "The IoT protocol landscape spans sub-GHz LPWAN (LoRaWAN, Sigfox), ISM band protocols (Zigbee, Z-Wave, Thread), and 2.4 GHz PAN (BLE, WiFi HaLow). We'll analyze protocol stacks, PHY/MAC layers, and security implementations."
  },

  sections: {
    newb: [
      {
        type: 'text',
        title: '🌐 What is the Internet of Things?',
        content: `<p>The <strong>Internet of Things (IoT)</strong> is billions of devices that talk to each other wirelessly — without humans pressing buttons! Smart thermostats, fitness trackers, farm sensors, city streetlights, and even refrigerators.</p>
        <p>All these devices use <strong>radio waves</strong> to communicate, and with SDR, you can see and understand their conversations!</p>`
      },
      {
        type: 'cards',
        title: '📡 IoT Radio Technologies',
        items: [
          { icon: '📡', title: 'LoRa / LoRaWAN', description: 'Long range (10+ km), very slow. For sensors that send tiny data rarely.' },
          { icon: '🏠', title: 'Zigbee', description: 'Short range (~10m), mesh networking. Used in smart home devices (lights, locks).' },
          { icon: '🔵', title: 'Bluetooth LE', description: 'Short range (~10m), very low power. Fitness trackers, beacons, earbuds.' },
          { icon: '📶', title: 'WiFi', description: 'Medium range (~50m), high power. Smart speakers, cameras, computers.' },
        ]
      },
      {
        type: 'text',
        title: '🏠 IoT in Your Home',
        content: `<p>Look around — IoT devices are probably already in your home!</p>
        <p>🌡️ <strong>Weather station</strong> — Sends temp/humidity at 433 MHz every few minutes</p>
        <p>🚪 <strong>Doorbell sensor</strong> — Transmits at 433 MHz when someone presses the button</p>
        <p>💡 <strong>Smart lights</strong> — Controlled via Zigbee (2.4 GHz) or WiFi</p>
        <p>📱 <strong>Fitness band</strong> — Syncs to your phone via Bluetooth LE (2.4 GHz)</p>
        <p>🔑 <strong>Car key fob</strong> — Sends coded signal at 433 or 868 MHz when you press unlock</p>`
      },
      {
        type: 'text',
        title: '📊 Seeing IoT Signals',
        content: `<p>With RTL-SDR tuned to <strong>433 MHz</strong>, you can watch IoT devices chattering! Each burst of energy on the spectrum is a device sending data.</p>
        <p>On the waterfall, you'll see short bursts appearing every few seconds or minutes — those are sensors reporting their readings. Some are fast blips (doorbell press), some are regular rhythms (weather station every 30 seconds).</p>`
      },
      {
        type: 'simulator',
        title: '🧪 ISM 433 MHz Band',
        simType: 'spectrum',
        simId: 'mod12-ism',
        simConfig: { scene: 'ism433' }
      }
    ],

    explorer: [
      {
        type: 'text',
        title: 'IoT Protocol Stack',
        content: `<p>IoT protocols follow a layered architecture similar to the internet:</p>
        <p><strong>PHY (Physical):</strong> Radio modulation, frequency, data rate (what we see on the spectrum).</p>
        <p><strong>MAC (Media Access):</strong> Channel access, addressing, collision avoidance.</p>
        <p><strong>Network:</strong> Routing, mesh topology, gateway communication.</p>
        <p><strong>Application:</strong> Data format, commands, device management.</p>`
      },
      {
        type: 'table',
        title: 'IoT Protocol Comparison',
        headers: ['Protocol', 'Frequency', 'Range', 'Data Rate', 'Power', 'Topology'],
        rows: [
          ['LoRaWAN', '868/915 MHz', '2-15 km', '0.3-50 kbps', 'Very Low', 'Star (gateways)'],
          ['Sigfox', '868 MHz', '3-50 km', '100 bps', 'Ultra Low', 'Star (base stations)'],
          ['Zigbee', '2.4 GHz', '10-100 m', '250 kbps', 'Low', 'Mesh'],
          ['Z-Wave', '868/908 MHz', '30-100 m', '100 kbps', 'Low', 'Mesh'],
          ['BLE 5.0', '2.4 GHz', '10-400 m', '2 Mbps', 'Very Low', 'Star/Mesh'],
          ['WiFi HaLow', '900 MHz', '1 km', '150 kbps-78 Mbps', 'Medium', 'Star'],
          ['Thread', '2.4 GHz', '10-30 m', '250 kbps', 'Low', 'Mesh (IPv6)'],
          ['NB-IoT', 'LTE bands', '10 km', '250 kbps', 'Low', 'Cellular'],
        ]
      },
      {
        type: 'text',
        title: 'LoRaWAN Network Architecture',
        content: `<p><strong>LoRaWAN</strong> adds a network layer on top of LoRa radio. The architecture: End Devices → Gateways → Network Server → Application Server.</p>
        <p><strong>Device classes:</strong> Class A (battery-friendly, RX windows after TX), Class B (scheduled RX slots), Class C (always listening, mains-powered).</p>
        <p><strong>Security:</strong> AES-128 encryption at two levels: network session key (NwkSKey) for MAC commands, application session key (AppSKey) for payload. End-to-end encryption means even the gateway can't read your data!</p>`
      },
      {
        type: 'text',
        title: 'Analyzing IoT with SDR',
        content: `<p><strong>433 MHz with rtl_433:</strong> Automatically decodes 200+ sensor protocols. Run: <code>rtl_433 -f 433920000</code></p>
        <p><strong>Zigbee with HackRF:</strong> Use KillerBee framework or Wireshark with a CC2531 sniffer to capture and analyze Zigbee frames.</p>
        <p><strong>BLE with HackRF:</strong> BTLE (Bluetooth LE) packets at 2.4 GHz can be captured, though dedicated BLE sniffers (nRF52840) are more practical.</p>
        <p><strong>LoRa with SDR:</strong> gr-lora (GNU Radio) can demodulate LoRa chirps. You can observe the CSS modulation on the waterfall — it looks like diagonal lines!</p>`
      }
    ],

    developer: [
      {
        type: 'text',
        title: 'Sub-GHz PHY Layer Analysis',
        content: `<p><strong>ISM 433/868 MHz OOK:</strong> Most legacy sensors use OOK at 1-10 kbps. Typical packet: preamble (alternating 1/0, 4-20 bits) → sync word (unique pattern) → payload (2-10 bytes, MSB or LSB first) → CRC/checksum. Manchester or PWM encoding is common for clock recovery.</p>
        <p><strong>LoRa CSS PHY:</strong> The chirp waveform: f(t) = f_0 + BW·t/T_sym (mod BW), where T_sym = 2^SF/BW. Each symbol cyclically shifts the starting frequency by k·BW/2^SF where k ∈ [0, 2^SF). Demodulation: multiply by conjugate base chirp, take FFT, peak position = symbol value.</p>
        <p><strong>Sigfox UNB:</strong> Ultra-narrowband (100 Hz), DBPSK at 100 bps. Transmits on random frequencies within 200 kHz band — network-side receivers use wideband SDR to locate and decode.</p>`
      },
      {
        type: 'text',
        title: '2.4 GHz Protocol Analysis',
        content: `<p><strong>Zigbee PHY:</strong> IEEE 802.15.4, DSSS with OQPSK at 2 Mchip/s, 250 kbps data rate. 16 channels (11-26), 5 MHz spacing from 2405-2480 MHz. Frame: SHR (preamble + SFD) → PHR (frame length) → PSDU (MAC frame, max 127 bytes).</p>
        <p><strong>BLE PHY:</strong> GFSK at 1 Mbps (BLE 4.x) or 2 Mbps (BLE 5.0). 40 channels: 37 data channels + 3 advertising channels (37, 38, 39 at 2402, 2426, 2480 MHz). Advertising packets are the easiest to capture — devices broadcast on all 3 channels cyclically.</p>
        <p><strong>WiFi (802.11):</strong> OFDM with up to 64-QAM subcarriers. 20/40/80/160 MHz channels. Complex to decode with SDR but headers can be analyzed for network mapping.</p>`
      },
      {
        type: 'text',
        title: 'IoT Security Analysis',
        content: `<p><strong>Common vulnerabilities:</strong></p>
        <p>1. <strong>Replay attacks:</strong> Many OOK devices (garage doors, car fobs) use fixed codes — capture and replay opens the door. Mitigated by rolling codes (KeeLoq) but not all devices use them.</p>
        <p>2. <strong>Lack of encryption:</strong> Most 433 MHz sensors transmit in cleartext. Anyone with rtl_433 can read your weather station data.</p>
        <p>3. <strong>Weak key exchange:</strong> Zigbee's default trust center link key (ZigBeeAlliance09) is publicly known. Network key sent encrypted with this key → interceptable during join.</p>
        <p>4. <strong>Jamming:</strong> All ISM protocols are susceptible to narrowband or wideband jamming. LoRa's CSS is more resilient due to processing gain, but not immune.</p>`
      },
      {
        type: 'code',
        title: 'rtl_433 Advanced Usage',
        content: `# Decode all protocols, output JSON
rtl_433 -f 433920000 -F json -M time:utc

# Specific protocol (e.g., Acurite 5n1)
rtl_433 -f 433920000 -R 40 -F csv:sensors.csv

# LoRa observation with GNU Radio
# gr-lora: FM demod → Chirp de-spread → FFT → Symbol decode
# On waterfall: LoRa chirps appear as diagonal lines
# SF7: steep diagonals (fast), SF12: shallow diagonals (slow)

# Universal Radio Hacker (URH) workflow:
# 1. Record signal burst from unknown device
# 2. Auto-detect modulation (OOK/FSK/PSK)
# 3. Demodulate → view bit stream
# 4. Find repeating patterns → identify fields
# 5. Correlate with physical events → map data`
      }
    ]
  },

  didYouKnow: [
    'By 2025, there are over 15 billion IoT devices worldwide — almost 2 for every human on Earth!',
    'LoRaWAN gateways are being deployed on weather balloons and even on the International Space Station to provide IoT coverage from space.',
    'Some smart cities use IoT sensors in every parking space to help drivers find open spots — all communicating wirelessly!',
    'The first IoT device was a Coca-Cola vending machine at Carnegie Mellon University in 1982 that reported its inventory over the internet.',
    'Thread, used in Apple HomeKit and Google Nest, creates a self-healing mesh network — if one device fails, the others find a new path.'
  ],

  takeaways: [
    'IoT protocols optimize for different tradeoffs: range, speed, power, and cost',
    'Sub-GHz frequencies penetrate walls better; 2.4 GHz offers higher data rates',
    'Mesh networking (Zigbee, Thread) provides self-healing, scalable coverage',
    'Security vulnerabilities in IoT include replay attacks, cleartext, and default keys'
  ],

  quiz: {
    newb: [
      {
        question: 'What does IoT stand for?',
        options: ['Internet of Telephones', 'Internet of Things', 'Inside of Technology', 'Instant Online Transfer'],
        correct: 1,
        explanation: 'IoT protocols like LoRaWAN, Zigbee, and BLE each optimize for different tradeoffs of range, speed, and power.'
      },
      {
        question: 'Which IoT technology has the longest range?',
        options: ['Bluetooth', 'Zigbee', 'LoRa', 'WiFi'],
        correct: 2,
        explanation: 'Zigbee operates at 2.4 GHz worldwide and uses mesh networking where devices relay messages for each other.'
      },
      {
        question: 'At what frequency do most home sensors transmit?',
        options: ['88 MHz', '433 MHz', '2.4 GHz', '5 GHz'],
        correct: 1,
        explanation: 'BLE (Bluetooth Low Energy) is designed for short-range, low-power communication with smartphones.'
      }
    ],
    explorer: [
      {
        question: 'What type of network topology does Zigbee use?',
        options: ['Star', 'Mesh', 'Ring', 'Bus'],
        correct: 1,
        explanation: 'rtl_433 can decode over 200 different sensor protocols using just an RTL-SDR dongle.'
      },
      {
        question: 'What encryption does LoRaWAN use?',
        options: ['None', 'WPA2', 'AES-128', 'RSA-2048'],
        correct: 2,
        explanation: 'Sub-GHz frequencies (below 1 GHz) penetrate walls better and travel further than 2.4 GHz signals.'
      },
      {
        question: 'What does LoRa look like on a waterfall display?',
        options: ['Horizontal lines', 'Diagonal lines (chirps)', 'Dots', 'Circles'],
        correct: 1,
        explanation: 'Mesh networking means if one device fails, messages can route around it through other devices.'
      }
    ],
    developer: [
      {
        question: 'How does LoRa CSS demodulation work?',
        options: [
          'Envelope detection',
          'Multiply by conjugate base chirp, then FFT peak detection',
          'Phase-locked loop tracking',
          'Matched filter bank'
        ],
        correct: 1,
        explanation: '802.15.4 is the underlying PHY/MAC standard shared by Zigbee, Thread, and other mesh protocols.'
      },
      {
        question: 'What is Zigbee\'s well-known default trust center link key?',
        options: ['All zeros', 'ZigBeeAlliance09', 'A random per-device key', 'The network key itself'],
        correct: 1,
        explanation: 'LoRaWAN uses dual AES-128 keys: NwkSKey for network integrity and AppSKey for payload encryption.'
      }
    ]
  },

  challenge: {
    newb: 'Walk around your home and list every wireless device you can find. For each one, guess which radio technology it uses (WiFi, Bluetooth, Zigbee, or 433 MHz).',
    explorer: 'Run rtl_433 for 24 hours and analyze the data: how many unique sensors did you find? What types? Plot temperature readings over time if you captured a weather station.',
    developer: 'Capture and analyze an unknown OOK signal at 433 MHz using URH: identify the modulation, bit rate, preamble, sync word, and payload structure. Reverse-engineer the data format by correlating with physical events.'
  }
});

/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE 8: ESP32 + LORA LAB
   ═══════════════════════════════════════════ */

ModuleContent.register('module-8', {
  narrative: {
    newb: "What if you could send a message to someone TEN KILOMETERS away using a tiny device no bigger than a matchbox? That's LoRa — Long Range radio! Combined with the ESP32 computer chip, you can build amazing wireless projects that work across entire cities!",
    explorer: "LoRa (Long Range) is a spread spectrum modulation technique that trades data rate for extreme range and sensitivity. Paired with the ESP32's WiFi and Bluetooth, you get a versatile IoT platform for real-world wireless experimentation.",
    developer: "LoRa uses Chirp Spread Spectrum (CSS) modulation to achieve -137 dBm sensitivity at SF12. Combined with ESP32's dual-core processor and connectivity stack, this platform enables professional-grade IoT and LPWAN experimentation."
  },

  sections: {
    newb: [
      {
        type: 'text',
        title: '🔌 What is LoRa?',
        content: `<p><strong>LoRa</strong> stands for <strong>Long Range</strong>. It's a special type of radio that can send small messages over HUGE distances — up to <strong>10 km in cities</strong> and <strong>50+ km in open areas</strong>!</p>
        <p>The secret? LoRa sends messages <strong>very slowly</strong> but <strong>very reliably</strong>. It's like whispering very carefully instead of shouting — the message gets through even when it's noisy!</p>`
      },
      {
        type: 'analogy',
        icon: '🐢',
        content: `LoRa is like the tortoise in "The Tortoise and the Hare." WiFi is the hare — super fast but gets tired quickly (short range). LoRa is the tortoise — slow but steady, reaching destinations WiFi could never dream of!`
      },
      {
        type: 'cards',
        title: '🆚 LoRa vs Other Radios',
        items: [
          { icon: '📶', title: 'WiFi', description: 'Fast (100+ Mbps) but short range (~50m indoors). Uses lots of power.' },
          { icon: '🔵', title: 'Bluetooth', description: 'Medium speed, very short range (~10m). Great for headphones.' },
          { icon: '📟', title: 'micro:bit', description: '1 Mbps, ~30m range. Good for classroom projects.' },
          { icon: '📡', title: 'LoRa', description: 'Slow (0.3-50 kbps) but HUGE range (1-50 km). Tiny power use!' },
        ]
      },
      {
        type: 'text',
        title: '🖥️ What is ESP32?',
        content: `<p>The <strong>ESP32</strong> is a powerful tiny computer that has WiFi, Bluetooth, AND (with an add-on module) LoRa radio all in one! It's like a Swiss Army knife for wireless projects.</p>
        <p>Popular ESP32+LoRa boards: <strong>TTGO T-Beam</strong> (has GPS too!), <strong>Heltec WiFi LoRa 32</strong> (has a screen!), <strong>LilyGO T3</strong>.</p>`
      },
      {
        type: 'text',
        title: '🌍 What Can You Build?',
        content: `<p>🌡️ <strong>Weather station</strong> — Send temperature/humidity data across town</p>
        <p>🗺️ <strong>GPS tracker</strong> — Track a bike or pet over long distances</p>
        <p>📨 <strong>Text messenger</strong> — Send messages without WiFi or cell service</p>
        <p>🌱 <strong>Farm sensor</strong> — Monitor soil moisture kilometers away</p>
        <p>🆘 <strong>Emergency beacon</strong> — Send location when there's no phone signal</p>`
      },
      {
        type: 'warning',
        content: 'LoRa uses specific frequencies that vary by region! <strong>Europe: 868 MHz</strong>, <strong>Americas: 915 MHz</strong>, <strong>Asia: 433 MHz</strong>. Always use the correct frequency for your country — it\'s the law!'
      }
    ],

    explorer: [
      {
        type: 'text',
        title: 'LoRa Technology Deep Dive',
        content: `<p>LoRa uses <strong>Chirp Spread Spectrum (CSS)</strong> modulation. A "chirp" is a signal whose frequency sweeps from low to high (up-chirp) or high to low (down-chirp) over time. Data is encoded by the starting frequency of each chirp.</p>
        <p>The key parameter is <strong>Spreading Factor (SF)</strong>, ranging from SF7 to SF12. Higher SF = longer chirps = better sensitivity but slower data rate. Each step up doubles the time-on-air.</p>`
      },
      {
        type: 'table',
        title: 'LoRa Spreading Factors',
        headers: ['SF', 'Bit Rate (125kHz BW)', 'Sensitivity', 'Range (approx)', 'Time on Air (10 bytes)'],
        rows: [
          ['SF7', '5.47 kbps', '-123 dBm', '2-5 km', '56 ms'],
          ['SF8', '3.13 kbps', '-126 dBm', '3-7 km', '103 ms'],
          ['SF9', '1.76 kbps', '-129 dBm', '4-9 km', '185 ms'],
          ['SF10', '0.98 kbps', '-132 dBm', '5-12 km', '370 ms'],
          ['SF11', '0.54 kbps', '-134.5 dBm', '7-15 km', '741 ms'],
          ['SF12', '0.29 kbps', '-137 dBm', '10-20+ km', '1483 ms'],
        ]
      },
      {
        type: 'text',
        title: 'ESP32 + LoRa Hardware',
        content: `<p>The ESP32 connects to a LoRa transceiver chip (typically <strong>Semtech SX1276/SX1278</strong>) via SPI bus. The ESP32 handles application logic, WiFi/BLE connectivity, and sensor reading, while the SX127x handles RF modulation/demodulation.</p>
        <p><strong>Frequency bands by region:</strong> EU868 (863-870 MHz, 1% duty cycle), US915 (902-928 MHz), AS923 (915-928 MHz), AU915 (915-928 MHz), IN865 (865-867 MHz).</p>`
      },
      {
        type: 'code',
        title: 'Arduino: Basic LoRa Transmitter',
        content: `#include &lt;SPI.h&gt;
#include &lt;LoRa.h&gt;

void setup() {
  Serial.begin(115200);
  // Initialize LoRa at 868 MHz (EU) or 915 MHz (US)
  if (!LoRa.begin(868E6)) {
    Serial.println("LoRa init failed!");
    while (1);
  }
  LoRa.setSpreadingFactor(7);  // SF7-SF12
  LoRa.setSignalBandwidth(125E3);  // 125 kHz
  LoRa.setTxPower(14);  // 14 dBm
}

void loop() {
  LoRa.beginPacket();
  LoRa.print("Hello LoRa! RSSI test");
  LoRa.endPacket();
  delay(5000);  // Send every 5 seconds
}`
      },
      {
        type: 'simulator',
        title: '🧪 LoRa Range Calculator',
        simType: 'range',
        simId: 'mod8-range',
        simConfig: { txPower: 14, txGain: 2, rxGain: 2, frequency: 868e6, rxSensitivity: -137, maxDistance: 15000, pathLossModel: 'freespace' }
      }
    ],

    developer: [
      {
        type: 'text',
        title: 'Chirp Spread Spectrum Theory',
        content: `<p>In CSS, each symbol is a linear frequency chirp spanning the full bandwidth (BW). For SF bits per symbol, there are 2^SF possible starting frequencies. A symbol encodes SF bits by the cyclic frequency shift of the base chirp.</p>
        <p><strong>Symbol rate:</strong> Rs = BW / 2^SF. <strong>Bit rate:</strong> Rb = SF × Rs × CR, where CR is the coding rate (4/5 to 4/8).</p>
        <p><strong>Processing gain:</strong> PG = 10·log₁₀(2^SF · BW/Rb). At SF12/125kHz: PG ≈ 20 dB. This is why LoRa can operate at -20 dB SNR — the signal is below the noise floor but still decodable!</p>
        <p><strong>Orthogonality:</strong> Different SFs are quasi-orthogonal, meaning SF7 and SF12 transmissions can coexist on the same frequency. This is key to LoRaWAN network capacity.</p>`
      },
      {
        type: 'text',
        title: 'Link Budget for LoRa',
        content: `<p>Complete link budget at SF12, 868 MHz, 125 kHz BW:</p>
        <p>TX power: +14 dBm (EU868 max). TX antenna: +2 dBi. RX antenna: +2 dBi. RX sensitivity: -137 dBm.</p>
        <p><strong>Maximum path loss:</strong> 14 + 2 + 2 - (-137) = 155 dB.</p>
        <p><strong>FSPL at 868 MHz:</strong> d = 10^((155 - 20·log₁₀(868e6) + 147.55)/20) ≈ 282 km (free space).</p>
        <p>Real-world urban: add 20-40 dB for buildings, foliage, multipath → 5-15 km. Rural line-of-sight: 20-50 km achievable. Record: 832 km (balloon to ground).</p>`
      },
      {
        type: 'table',
        title: 'SX1276 Register Configuration',
        headers: ['Register', 'Address', 'Key Settings'],
        rows: [
          ['RegOpMode', '0x01', 'Mode: Sleep/Standby/TX/RX, LoRa mode bit'],
          ['RegFrMsb/Mid/Lsb', '0x06-08', 'Carrier freq: f = Fxosc × Frf / 2^19'],
          ['RegModemConfig1', '0x1D', 'BW (125-500kHz), CR (4/5-4/8), implicit header'],
          ['RegModemConfig2', '0x1E', 'SF (7-12), TX continuous, RX timeout MSB, CRC'],
          ['RegPaConfig', '0x09', 'PA select, output power (2-17 dBm or +20 dBm)'],
          ['RegLna', '0x0C', 'LNA gain (auto or manual), boost for 150% LNA'],
        ]
      },
      {
        type: 'code',
        title: 'LoRa Parameters & Time-on-Air',
        content: `# LoRa Time-on-Air calculation
T_sym    = 2^SF / BW              # Symbol duration
T_preamble = (n_preamble + 4.25) × T_sym
payload_symbols = 8 + max(
  ceil((8·PL - 4·SF + 28 + 16·CRC - 20·H) / (4·(SF-2·DE))) × (CR+4),
  0
)
T_payload = payload_symbols × T_sym
T_total   = T_preamble + T_payload

# Example: SF12, BW=125kHz, 10-byte payload, CR=4/5
# T_sym = 4096/125000 = 32.77 ms
# Total ≈ 1.5 seconds for 10 bytes!

# EU868 duty cycle: 1% → max 36s TX per hour
# At SF12: ~24 packets/hour maximum`
      }
    ]
  },

  didYouKnow: [
    'The longest LoRa transmission ever recorded was 832 km — from a high-altitude balloon to a ground station! That\'s farther than London to Paris.',
    'LoRa was invented by French company Cycleo in 2009 and acquired by Semtech in 2012. The word "LoRa" comes from "Long Range."',
    'In Europe, LoRa devices must obey a 1% duty cycle rule — you can only transmit for 36 seconds per hour. This ensures everyone gets a fair share!',
    'The Things Network uses LoRa gateways to create free, community-built IoT networks in cities worldwide. Anyone can join!',
    'A LoRa sensor running on 2 AA batteries can last over 10 YEARS because it uses so little power.'
  ],

  takeaways: [
    'LoRa uses Chirp Spread Spectrum for long-range, low-power communication',
    'Higher spreading factor = longer range but slower data rate',
    'LoRaWAN architecture: End Devices → Gateways → Network Server',
    'ISM bands (433/868/915 MHz) allow license-free operation with power limits'
  ],

  quiz: {
    newb: [
      {
        question: 'What does LoRa stand for?',
        options: ['Low Radiation', 'Long Range', 'Local Radio', 'Light Receiver'],
        correct: 1,
        explanation: 'LoRa stands for Long Range — it\'s designed to send small amounts of data over very long distances.'
      },
      {
        question: 'How far can LoRa send a message?',
        options: ['10 meters', '100 meters', '1 kilometer', '10+ kilometers'],
        correct: 3,
        explanation: 'In Europe, LoRa operates at 868 MHz (in the US it\'s 915 MHz).'
      },
      {
        question: 'Why is LoRa slow compared to WiFi?',
        options: ['It\'s broken', 'It trades speed for much longer range', 'It uses old technology', 'It\'s not really slow'],
        correct: 1,
        explanation: 'Higher spreading factor = longer range but slower data rate. It\'s a fundamental LoRa tradeoff.'
      }
    ],
    explorer: [
      {
        question: 'What modulation technique does LoRa use?',
        options: ['OFDM', 'GFSK', 'Chirp Spread Spectrum', 'QAM'],
        correct: 2,
        explanation: 'CSS (Chirp Spread Spectrum) sweeps frequency linearly, making LoRa resistant to interference and multipath.'
      },
      {
        question: 'What is the correct LoRa frequency for Europe?',
        options: ['433 MHz', '868 MHz', '915 MHz', '2.4 GHz'],
        correct: 1,
        explanation: 'LoRaWAN Class A devices only open receive windows after transmitting, maximizing battery life.'
      },
      {
        question: 'Higher Spreading Factor means...',
        options: ['Faster data, shorter range', 'Slower data, longer range', 'Same data, same range', 'No data at all'],
        correct: 1,
        explanation: 'The link budget determines maximum range — LoRa achieves ~157 dB, far exceeding WiFi\'s ~100 dB.'
      }
    ],
    developer: [
      {
        question: 'What is LoRa\'s sensitivity at SF12 with 125 kHz bandwidth?',
        options: ['-95 dBm', '-110 dBm', '-123 dBm', '-137 dBm'],
        correct: 3,
        explanation: 'SF7 gives the fastest data rate (11 kbps) while SF12 gives maximum range at 0.29 kbps.'
      },
      {
        question: 'What SNR can LoRa operate at with SF12?',
        options: ['+10 dB', '0 dB', '-10 dB', '-20 dB'],
        correct: 3,
        explanation: 'Adaptive Data Rate (ADR) automatically optimizes SF and power based on link quality.'
      }
    ]
  },

  challenge: {
    newb: 'Design a LoRa project on paper! What sensor would you connect? What data would you send? How far away is the receiver? Draw a picture of your system!',
    explorer: 'Calculate the time-on-air for a 20-byte LoRa packet at SF7 vs SF12, both at 125 kHz bandwidth. How many packets per hour can you send at each SF under EU868 1% duty cycle?',
    developer: 'Design a complete LoRa sensor node: ESP32 + SX1276 + BME280 sensor. Calculate link budget for 5 km urban path, choose optimal SF, estimate battery life with 3000 mAh cell at one reading per 15 minutes.'
  }
});

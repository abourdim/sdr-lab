/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE 7: MICRO:BIT RADIO LAB
   ═══════════════════════════════════════════ */

ModuleContent.register('module-7', {
  narrative: {
    newb: "The micro:bit is your very first radio! It's a tiny computer that can send and receive messages through the air — like a walkie-talkie you can program yourself! Let's build a secret messaging system with your friends!",
    explorer: "The BBC micro:bit has a built-in 2.4 GHz radio transceiver based on the Nordic nRF51822. It's the perfect first step into wireless communication — you can transmit AND receive, measure signal strength, and build real wireless projects.",
    developer: "The micro:bit's nRF51822 SoC provides a 2.4 GHz ISM band transceiver with configurable output power, frequency hopping across 80 channels, and RSSI measurement. We'll explore the radio architecture, protocol stack, and build measurement tools."
  },

  sections: {
    newb: [
      {
        type: 'text',
        title: '📟 Meet the micro:bit',
        content: `<p>The <strong>BBC micro:bit</strong> is a tiny computer (about the size of a credit card) with a built-in radio! Unlike RTL-SDR which can only listen, the micro:bit can <strong>send AND receive</strong> messages wirelessly.</p>
        <p>It works at <strong>2.4 GHz</strong> — the same frequency as WiFi and Bluetooth! But it uses its own simple radio protocol that's perfect for learning.</p>`
      },
      {
        type: 'cards',
        title: '🔧 What\'s on the micro:bit?',
        items: [
          { icon: '💡', title: '25 LEDs', description: '5×5 grid of lights — shows messages, pictures, and data!' },
          { icon: '📡', title: 'Radio', description: 'Built-in 2.4 GHz transmitter AND receiver.' },
          { icon: '🅰️', title: '2 Buttons', description: 'A and B buttons for input — trigger actions!' },
          { icon: '📐', title: 'Sensors', description: 'Accelerometer, compass, temperature, light level.' },
        ]
      },
      {
        type: 'analogy',
        icon: '📻',
        content: `The micro:bit radio is like a classroom intercom system. Everyone in the same "radio group" (channel) can hear each other. If you switch to a different group number, you join a different conversation — just like switching channels on a walkie-talkie!`
      },
      {
        type: 'steps',
        title: '🚀 Your First Radio Program',
        items: [
          { title: 'Open MakeCode', description: 'Go to makecode.microbit.org in your browser. Start a new project.' },
          { title: 'Set the radio group', description: 'From the Radio menu, add "radio set group 1" to the "on start" block. Everyone who wants to talk must use the SAME group number!' },
          { title: 'Send a message', description: 'Add "on button A pressed" → "radio send string Hello!"' },
          { title: 'Receive messages', description: 'Add "on radio received receivedString" → "show string receivedString"' },
          { title: 'Download & test', description: 'Download to TWO micro:bits. Press A on one — the other shows "Hello!" on its LEDs!' },
        ]
      },
      {
        type: 'text',
        title: '📶 Signal Strength (RSSI)',
        content: `<p>The micro:bit can tell you HOW STRONG a received signal is! This is called <strong>RSSI</strong> (Received Signal Strength Indicator).</p>
        <p>🟢 <strong>Strong signal (close)</strong> = RSSI around -30 to -50</p>
        <p>🟡 <strong>Medium signal</strong> = RSSI around -50 to -70</p>
        <p>🔴 <strong>Weak signal (far away)</strong> = RSSI around -70 to -95</p>
        <p>Try walking away from the other micro:bit and watch the number change!</p>`
      },
      {
        type: 'warning',
        content: 'The micro:bit radio range is about <strong>10-30 meters</strong> indoors and up to <strong>70 meters</strong> outdoors with clear line of sight. Walls, metal objects, and your body all reduce the range!'
      }
    ],

    explorer: [
      {
        type: 'text',
        title: 'micro:bit Radio Architecture',
        content: `<p>The micro:bit v2 uses the <strong>Nordic nRF52833</strong> SoC (v1 uses nRF51822). The radio operates in the <strong>2.4 GHz ISM band</strong> (2.400–2.483 GHz), shared with WiFi and Bluetooth.</p>
        <p>The radio supports <strong>80 frequency channels</strong> spaced 1 MHz apart. The MakeCode "radio group" maps to a specific frequency channel. Data rate is 1 Mbps using GFSK modulation.</p>
        <p>Transmit power is configurable from -30 dBm to +4 dBm (0.001 mW to 2.5 mW). Default is 0 dBm (1 mW).</p>`
      },
      {
        type: 'table',
        title: 'micro:bit Radio Specifications',
        headers: ['Parameter', 'Value'],
        rows: [
          ['Frequency', '2.4 GHz ISM band (2400–2483 MHz)'],
          ['Channels', '80 (1 MHz spacing)'],
          ['Data rate', '1 Mbps'],
          ['Modulation', 'GFSK (Gaussian FSK)'],
          ['TX power', '-30 dBm to +4 dBm (configurable)'],
          ['RX sensitivity', '-95 dBm'],
          ['Max range (outdoor)', '~70 m @ 0 dBm'],
          ['Packet size', 'Up to 32 bytes payload'],
          ['Protocol', 'Nordic proprietary (not Bluetooth)'],
        ]
      },
      {
        type: 'text',
        title: 'Experiments to Try',
        content: `<p><strong>Range test:</strong> Send RSSI readings to the LED display. Walk away step by step and record RSSI vs distance. Plot a graph — you'll see signal strength drops roughly as 1/d² (inverse square law).</p>
        <p><strong>Wall penetration:</strong> Measure RSSI through different materials — wood door, concrete wall, metal filing cabinet. Each material attenuates the signal differently.</p>
        <p><strong>Antenna orientation:</strong> The micro:bit's antenna is a PCB trace. Rotating the board changes the signal pattern. Find the best and worst orientations!</p>
        <p><strong>Channel hopping:</strong> Program the micro:bit to switch between radio groups every few seconds — this is how Bluetooth and WiFi avoid interference.</p>`
      },
      {
        type: 'code',
        title: 'MakeCode: RSSI Signal Meter',
        content: `// On start
radio.setGroup(1)
radio.setTransmitPower(7)  // Max power

// Button A: Send ping every 500ms
basic.forever(function() {
    radio.sendString("ping")
    basic.pause(500)
})

// On receive: Show RSSI as bar graph
radio.onReceivedString(function(receivedString) {
    let rssi = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    // Map RSSI (-95 to -30) to LED bar (0-25)
    let bars = Math.map(rssi, -95, -30, 0, 25)
    led.plotBarGraph(bars, 25)
})`
      },
      {
        type: 'simulator',
        title: '🧪 micro:bit Signal Range',
        simType: 'range',
        simId: 'mod7-range',
        simConfig: { txPower: 4, txGain: 0, rxGain: 0, frequency: 2.4e9, rxSensitivity: -95, maxDistance: 100, pathLossModel: 'indoor' }
      }
    ],

    developer: [
      {
        type: 'text',
        title: 'nRF52833 Radio Subsystem',
        content: `<p>The Nordic nRF52833 integrates a 2.4 GHz transceiver with the following architecture: RF frontend (LNA/PA) → Mixer → IF filter → ADC → baseband processor → packet engine → DMA → RAM.</p>
        <p>The radio uses <strong>GFSK modulation</strong> with BT=0.5 Gaussian filter. At 1 Mbps, the occupied bandwidth is approximately 1 MHz. The modulation index h = Δf/bit_rate ≈ 0.5 (Δf ≈ 250 kHz deviation).</p>
        <p>The packet format: preamble (1 byte, 0xAA) → address (3-5 bytes) → payload length (1 byte) → payload (0-254 bytes) → CRC (1-2 bytes). MakeCode limits payload to 32 bytes for the simple radio API.</p>`
      },
      {
        type: 'text',
        title: 'Link Budget Analysis',
        content: `<p>For micro:bit at +4 dBm TX power, 0 dBi antenna gain (PCB trace), 2.4 GHz:</p>
        <p><strong>FSPL at 10m:</strong> 20·log₁₀(10) + 20·log₁₀(2.4×10⁹) - 147.55 = 60.1 dB</p>
        <p><strong>FSPL at 50m:</strong> 74.1 dB</p>
        <p><strong>Received power at 50m:</strong> +4 + 0 + 0 - 74.1 = -70.1 dBm (above -95 dBm sensitivity ✓)</p>
        <p>Adding indoor path loss (walls, multipath): extra 10-30 dB depending on environment. A single concrete wall adds ~10 dB loss at 2.4 GHz.</p>
        <p><strong>Maximum theoretical range (free space):</strong> Path loss budget = 4 + 0 + 0 - (-95) = 99 dB. Solving FSPL equation: d = 10^((99 - 20·log₁₀(2.4e9) + 147.55)/20) ≈ 564m. Practical indoor range: 10-30m.</p>`
      },
      {
        type: 'text',
        title: 'MicroPython Radio API',
        content: `<p>For more control than MakeCode, use MicroPython's radio module:</p>`
      },
      {
        type: 'code',
        title: 'MicroPython: Advanced Radio Control',
        content: `import radio
import microbit

# Configure radio
radio.config(
    channel=7,        # 0-83 (frequency = 2400 + channel MHz)
    power=7,          # 0-7 (0=-30dBm, 7=+4dBm)
    data_rate=radio.RATE_1MBIT,  # or RATE_2MBIT
    length=32,        # Max payload bytes
    group=0,          # Logical group (address prefix)
    queue=3           # RX buffer size
)
radio.on()

# Transmit
radio.send("Hello from Python!")

# Receive with RSSI
while True:
    msg = radio.receive_full()  # Returns (bytes, rssi, timestamp)
    if msg:
        payload, rssi, ts = msg
        microbit.display.scroll(f"{rssi}dBm")`
      },
      {
        type: 'table',
        title: 'TX Power Levels',
        headers: ['Level', 'Power (dBm)', 'Power (mW)', 'Approx Indoor Range'],
        rows: [
          ['0', '-30 dBm', '0.001 mW', '~1 m'],
          ['1', '-20 dBm', '0.01 mW', '~3 m'],
          ['2', '-16 dBm', '0.025 mW', '~5 m'],
          ['3', '-12 dBm', '0.063 mW', '~7 m'],
          ['4', '-8 dBm', '0.16 mW', '~10 m'],
          ['5', '-4 dBm', '0.40 mW', '~15 m'],
          ['6', '0 dBm', '1.0 mW', '~20 m'],
          ['7', '+4 dBm', '2.5 mW', '~30 m'],
        ]
      }
    ]
  },

  didYouKnow: [
    'Over 5 million micro:bits have been given to kids in the UK — every Year 7 student (age 11-12) gets one for free!',
    'The micro:bit\'s radio uses the same 2.4 GHz frequency as your WiFi router, but it speaks a different "language" so they don\'t interfere.',
    'You can use micro:bits to build a mesh network — each micro:bit relays messages to the next, extending range far beyond 70 meters!',
    'The micro:bit accelerometer can detect earthquakes! Students in New Zealand used micro:bits as earthquake sensors.',
    'The name "micro:bit" was inspired by the BBC Micro computer from the 1980s, which taught a whole generation of British kids to code.'
  ],

  takeaways: [
    'The micro:bit operates at 2.4 GHz using GFSK modulation',
    'RSSI measures received signal strength and decreases with distance',
    'Radio groups isolate communication between paired devices',
    'The Friis equation relates transmitted power, distance, and received power'
  ],

  quiz: {
    newb: [
      {
        question: 'What frequency does the micro:bit radio use?',
        options: ['88 MHz (FM radio)', '433 MHz (IoT)', '2.4 GHz (same as WiFi)', '5 GHz'],
        correct: 2,
        explanation: 'The micro:bit radio operates at 2.4 GHz, the same frequency band used by WiFi and Bluetooth.'
      },
      {
        question: 'What does RSSI measure?',
        options: ['Temperature', 'Speed', 'Signal strength', 'Battery level'],
        correct: 2,
        explanation: 'RSSI (Received Signal Strength Indicator) measures how strong a received signal is.'
      },
      {
        question: 'To talk to each other, two micro:bits must be in the same...?',
        options: ['Room', 'Radio group', 'Color', 'Country'],
        correct: 1,
        explanation: 'The micro:bit uses radio groups so only devices on the same group number can communicate.'
      }
    ],
    explorer: [
      {
        question: 'How many radio channels does the micro:bit support?',
        options: ['10', '40', '80', '256'],
        correct: 2,
        explanation: 'GFSK (Gaussian Frequency Shift Keying) smooths frequency transitions to reduce bandwidth.'
      },
      {
        question: 'What modulation does the micro:bit radio use?',
        options: ['AM', 'FM', 'GFSK', 'OFDM'],
        correct: 2,
        explanation: 'The nRF52833 chip handles both BLE and the micro:bit\'s proprietary radio protocol.'
      },
      {
        question: 'What is the maximum TX power of a micro:bit?',
        options: ['-30 dBm', '0 dBm', '+4 dBm', '+20 dBm'],
        correct: 2,
        explanation: 'Signal strength decreases with distance following the inverse square law.'
      }
    ],
    developer: [
      {
        question: 'What is the approximate FSPL at 50m for 2.4 GHz?',
        options: ['54 dB', '64 dB', '74 dB', '84 dB'],
        correct: 2,
        explanation: 'The Friis equation calculates received power from transmitted power, antenna gains, distance, and frequency.'
      },
      {
        question: 'What SoC does the micro:bit v2 use?',
        options: ['ESP32', 'nRF52833', 'ATmega328', 'STM32F4'],
        correct: 1,
        explanation: 'Manchester encoding ensures clock recovery by guaranteeing a transition in every bit period.'
      }
    ]
  },

  challenge: {
    newb: 'Program two micro:bits to send secret messages to each other! Use button A to send "Yes" and button B to send "No". Bonus: add a smiley face when you receive a message!',
    explorer: 'Build an RSSI distance meter: send pings between two micro:bits and display signal strength on the LED grid as a bar graph. Walk away and record RSSI at 1m, 5m, 10m, 20m. Does it follow the inverse square law?',
    developer: 'Calculate the complete link budget for micro:bit communication through 2 concrete walls (10 dB each) at 15m distance. Then verify experimentally. Design a MicroPython script that logs RSSI, timestamp, and packet loss rate.'
  }
});

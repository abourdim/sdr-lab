/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE 14: FINAL PROJECT
   Build Your SDR Monitoring Station
   ═══════════════════════════════════════════ */

ModuleContent.register('module-14', {
  narrative: {
    newb: "You've learned SO much! Now it's time to put it all together and build YOUR very own SDR monitoring station. This is your radio command center — design it, build it, and show the world what you can do!",
    explorer: "This is where everything comes together. You'll design and build a complete SDR monitoring station — choosing your hardware, antennas, software, and target signals. Document your build and share your results with the community!",
    developer: "The capstone project: architect a multi-signal SDR monitoring station. Select hardware, design antennas, configure software pipelines, implement automated decoding, and build a dashboard for real-time signal intelligence."
  },

  sections: {
    newb: [
      {
        type: 'text',
        title: '🏗️ Your Radio Command Center!',
        content: `<p>Congratulations — you've completed all the learning modules! Now it's time to build something REAL. Your own <strong>SDR Monitoring Station</strong> is a setup that automatically listens to radio signals and shows you what's happening in the invisible world around you.</p>
        <p>Don't worry — you can start simple and add more later. Even a basic setup is amazing!</p>`
      },
      {
        type: 'steps',
        title: '🚀 Build Your Station (Simple Version)',
        items: [
          { title: 'Choose your hardware', description: 'Start with an RTL-SDR dongle (~$25). Add a Raspberry Pi if you want it running 24/7 without your main computer.' },
          { title: 'Build an antenna', description: 'Make a simple dipole for your favorite frequency. A V-dipole for weather satellites or a ground plane for ADS-B are great first builds!' },
          { title: 'Install software', description: 'Pick your mission: dump1090 for aircraft tracking, noaa-apt for satellite images, or rtl_433 for local sensors.' },
          { title: 'Set up a display', description: 'Use a web browser to show your data — aircraft on a map, weather images, or sensor readings on a dashboard.' },
          { title: 'Document everything!', description: 'Take photos, write about what you built, share your results. You\'re now a radio scientist!' },
        ]
      },
      {
        type: 'cards',
        title: '🎯 Choose Your Mission',
        items: [
          { icon: '✈️', title: 'Sky Watcher', description: 'Track every airplane in your area 24/7. See flight paths, count planes, find the farthest one!' },
          { icon: '🛰️', title: 'Space Listener', description: 'Catch weather satellite images every time they pass overhead. Build a collection of Earth photos from space!' },
          { icon: '🌡️', title: 'Sensor Hunter', description: 'Discover all the wireless sensors in your neighborhood. Map them and log their data over weeks.' },
          { icon: '📻', title: 'Radio Explorer', description: 'Scan the entire spectrum and catalog every signal you can find. Make a "radio map" of your area!' },
        ]
      },
      {
        type: 'text',
        title: '📝 Your Project Journal',
        content: `<p>Every great scientist keeps a journal! Write down:</p>
        <p>📅 <strong>Date</strong> — When you built or discovered something</p>
        <p>🔧 <strong>What you built</strong> — Hardware, antenna, software setup</p>
        <p>📊 <strong>What you found</strong> — Signals, aircraft count, images received</p>
        <p>🤔 <strong>What you learned</strong> — Challenges, solutions, surprises</p>
        <p>🎯 <strong>Next steps</strong> — What you want to try next</p>`
      },
      {
        type: 'text',
        title: '🎓 You Did It!',
        content: `<p>You've gone from knowing nothing about radio to understanding electromagnetic waves, modulation, antennas, SDR hardware, signal decoding, and security ethics. That's INCREDIBLE!</p>
        <p>Remember: this is just the beginning. The radio spectrum is vast, and there's always more to discover. Keep exploring, keep learning, and share your knowledge with others.</p>
        <p><strong>Bismillah — may your explorations benefit you and others. 🌟</strong></p>`
      }
    ],

    explorer: [
      {
        type: 'text',
        title: 'Station Design Considerations',
        content: `<p>A well-designed SDR station balances <strong>hardware capability</strong>, <strong>antenna performance</strong>, <strong>software configuration</strong>, and <strong>data management</strong>. Plan before you build!</p>`
      },
      {
        type: 'table',
        title: 'Station Configurations',
        headers: ['Config', 'Hardware', 'Antennas', 'Software', 'Budget'],
        rows: [
          ['Basic', 'RTL-SDR + laptop', '1 whip antenna', 'SDR++ for manual scanning', '~$30'],
          ['ADS-B Station', 'RTL-SDR + RPi', '1090 MHz ground plane', 'readsb + tar1090 web UI', '~$80'],
          ['Weather Sat', 'RTL-SDR + RPi', 'QFH or V-dipole', 'satdump + scheduler', '~$80'],
          ['Multi-Signal', '2× RTL-SDR + RPi 4', 'Discone + 1090 GP', 'readsb + rtl_433 + SDR++', '~$130'],
          ['Advanced', 'RTL-SDR + HackRF + Pi', 'Discone + Yagi + GP', 'GNU Radio + custom decoders', '~$450'],
        ]
      },
      {
        type: 'text',
        title: 'Raspberry Pi SDR Server',
        content: `<p>A Raspberry Pi makes an excellent <strong>headless SDR server</strong> — it runs 24/7, uses little power, and serves data over your home network.</p>
        <p><strong>Recommended setup:</strong> Raspberry Pi 4 (4GB), RTL-SDR Blog V4, quality USB extension cable (to separate SDR from Pi's RF noise), outdoor-rated coax to rooftop antenna.</p>
        <p><strong>ADS-B feed:</strong> Share your data with FlightAware, ADSBExchange, or FlightRadar24 for a free premium account and community contribution!</p>
        <p><strong>Automated satellite reception:</strong> Use <strong>satdump</strong> with orbit prediction to automatically capture NOAA and Meteor satellite passes, decode images, and save to a gallery.</p>`
      },
      {
        type: 'text',
        title: 'Antenna Installation',
        content: `<p><strong>Location:</strong> Higher is better. Roof-mounted antennas dramatically outperform indoor ones. Even a windowsill is better than a desk.</p>
        <p><strong>Lightning protection:</strong> If mounting outdoors, install a lightning arrestor on the coax and ground it properly. This protects your equipment.</p>
        <p><strong>Coax selection:</strong> For short runs (<5m), RG-58 is fine. For longer runs, use RG-6 or LMR-400 to minimize loss, especially at UHF.</p>
        <p><strong>Waterproofing:</strong> Seal outdoor connections with self-amalgamating tape. Water in connectors destroys signal quality fast.</p>`
      },
      {
        type: 'text',
        title: 'Data Logging and Analysis',
        content: `<p>The real value comes from <strong>long-term data collection</strong>:</p>
        <p><strong>ADS-B:</strong> Log all aircraft → analyze traffic patterns by time of day, day of week, season. Map coverage area. Count unique aircraft per month.</p>
        <p><strong>ISM sensors:</strong> Log all rtl_433 data → graph temperature/humidity over time. Detect sensor failures. Correlate with weather events.</p>
        <p><strong>Satellite images:</strong> Build a daily image library → create timelapse of weather patterns. Compare seasons.</p>`
      }
    ],

    developer: [
      {
        type: 'text',
        title: 'Multi-Signal SDR Architecture',
        content: `<p>A production SDR station requires careful system design:</p>
        <p><strong>Hardware layer:</strong> Multiple SDR receivers for simultaneous monitoring (e.g., RTL-SDR #1 dedicated to 1090 MHz ADS-B, #2 for 137 MHz satellite passes, #3 for 433 MHz continuous ISM monitoring).</p>
        <p><strong>Processing layer:</strong> Each receiver feeds a dedicated decoder process. Use systemd services for automatic restart. Consider Docker containers for isolation.</p>
        <p><strong>Data layer:</strong> InfluxDB or TimescaleDB for time-series sensor data. PostgreSQL for aircraft positions. File storage for satellite imagery.</p>
        <p><strong>Presentation layer:</strong> Grafana dashboards for sensor data, tar1090 for aircraft maps, custom web gallery for satellite images. Nginx reverse proxy for unified access.</p>`
      },
      {
        type: 'code',
        title: 'System Architecture',
        content: `┌─────────────────────────────────────────────┐
│              ANTENNA ARRAY                   │
│  ┌────────┐  ┌────────┐  ┌────────┐        │
│  │1090 GP │  │Discone │  │V-Dipole│        │
│  │(ADS-B) │  │(Wideband│  │(137MHz)│        │
│  └───┬────┘  └───┬────┘  └───┬────┘        │
│      │           │           │              │
│  ┌───┴────┐  ┌───┴────┐  ┌───┴────┐        │
│  │RTL-SDR1│  │RTL-SDR2│  │RTL-SDR3│        │
│  │1090MHz │  │433 MHz │  │137 MHz │        │
│  └───┬────┘  └───┬────┘  └───┬────┘        │
├──────┼───────────┼───────────┼──────────────┤
│      │    RASPBERRY PI 4     │              │
│  ┌───┴────┐  ┌───┴────┐  ┌───┴────┐        │
│  │readsb  │  │rtl_433 │  │satdump │        │
│  │(ADS-B) │  │(sensors)│  │(auto)  │        │
│  └───┬────┘  └───┬────┘  └───┬────┘        │
│      │           │           │              │
│  ┌───┴───────────┴───────────┴────┐         │
│  │     Data Pipeline (MQTT/JSON)  │         │
│  └───┬───────────┬───────────┬────┘         │
│  ┌───┴────┐  ┌───┴────┐  ┌───┴────┐        │
│  │InfluxDB│  │ PostGIS │  │  Files │        │
│  │(sensors)│  │(aircraft)│ │(images)│        │
│  └───┬────┘  └───┬────┘  └───┬────┘        │
│      └───────────┼───────────┘              │
│              ┌───┴────┐                     │
│              │Grafana │ ← Web Dashboard     │
│              │tar1090 │                     │
│              │Gallery │                     │
│              └────────┘                     │
└─────────────────────────────────────────────┘`
      },
      {
        type: 'text',
        title: 'Automated Satellite Reception',
        content: `<p><strong>Orbit prediction:</strong> Use TLE (Two-Line Element) data from celestial-above or Space-Track to predict satellite passes. Python's <code>skyfield</code> library computes rise/set times and maximum elevation.</p>
        <p><strong>Scheduling:</strong> Create a cron-based scheduler that: starts recording N seconds before predicted AOS (Acquisition of Signal), runs satdump or rtl_fm for the pass duration, stops at LOS (Loss of Signal), triggers decoding pipeline, moves decoded images to gallery.</p>
        <p><strong>Doppler correction:</strong> For NOAA APT (analog FM), the receiver tracks Doppler naturally. For Meteor M2 LRPT (QPSK), software Doppler correction is needed — pre-compute Doppler curve from TLE and apply frequency offset during reception.</p>`
      },
      {
        type: 'text',
        title: 'Performance Monitoring',
        content: `<p>Monitor station health with: <strong>SDR device temperature</strong> (RTL-SDR thermal throttles above 70°C), <strong>dropped sample rate</strong> (indicates USB or CPU issues), <strong>signal statistics</strong> (ADS-B message rate, sensor packet rate), <strong>noise floor trend</strong> (increasing noise may indicate interference or equipment degradation).</p>
        <p>Set up alerts in Grafana for: SDR device disconnection, message rate drop >50%, noise floor increase >6 dB, disk space <1 GB remaining.</p>`
      },
      {
        type: 'code',
        title: 'Docker Compose Stack',
        content: `version: '3'
services:
  readsb:
    image: ghcr.io/sdr-enthusiasts/readsb
    devices: ["/dev/bus/usb"]  # USB passthrough
    ports: ["8080:8080"]       # tar1090 web UI
    restart: always

  rtl433:
    image: hertzg/rtl_433
    command: -f 433920000 -F mqtt://mqtt:1883
    devices: ["/dev/bus/usb"]
    restart: always

  mqtt:
    image: eclipse-mosquitto
    ports: ["1883:1883"]

  influxdb:
    image: influxdb:2.7
    volumes: ["influx_data:/var/lib/influxdb2"]

  grafana:
    image: grafana/grafana
    ports: ["3000:3000"]
    volumes: ["grafana_data:/var/lib/grafana"]

volumes:
  influx_data:
  grafana_data:`
      }
    ]
  },

  didYouKnow: [
    'Some hobbyists run SDR stations that have been continuously monitoring aircraft for over 5 years without interruption!',
    'The global ADS-B Exchange network is built entirely by volunteers sharing data from their RTL-SDR stations.',
    'A Raspberry Pi 4 uses only about 6 watts of power — you could run an SDR station on a small solar panel!',
    'Some amateur radio operators bounce signals off the Moon (EME — Earth-Moon-Earth) using homemade dish antennas and SDR.',
    'The record for most aircraft simultaneously tracked by a single ADS-B station is over 400 — all with a $25 RTL-SDR!'
  ],

  takeaways: [
    'A basic SDR station needs: RTL-SDR (~$25), antenna, computer, and SDR software',
    'Antenna placement, cable quality, and lightning protection matter for real installations',
    'Raspberry Pi makes an excellent 24/7 headless SDR server',
    'Contributing ADS-B data to FlightAware/ADSBExchange builds the community'
  ],

  quiz: {
    newb: [
      {
        question: 'What\'s a good first SDR station project?',
        options: ['Building a satellite', 'ADS-B aircraft tracking with RTL-SDR', 'Hacking the internet', 'Building a cell tower'],
        correct: 1,
        explanation: 'An RTL-SDR dongle (~$25-30) is the most affordable way to start receiving real radio signals.'
      },
      {
        question: 'Why is a Raspberry Pi good for an SDR station?',
        options: ['It\'s very fast', 'It runs 24/7 with low power', 'It has a built-in radio', 'It\'s free'],
        correct: 1,
        explanation: 'Antenna choice depends on your target frequency — a simple dipole works for many applications.'
      },
      {
        question: 'What should every radio scientist keep?',
        options: ['A pet cat', 'A project journal', 'A big antenna', 'A radio license'],
        correct: 1,
        explanation: 'Documenting your station setup helps you reproduce results and share knowledge with others.'
      }
    ],
    explorer: [
      {
        question: 'What kind of antenna is best for wideband SDR scanning?',
        options: ['Dipole', 'Yagi', 'Discone', 'Patch'],
        correct: 2,
        explanation: 'A Raspberry Pi makes an excellent 24/7 SDR server — low power, headless, with USB for SDR dongles.'
      },
      {
        question: 'Why use a USB extension cable between Pi and RTL-SDR?',
        options: ['Easier to reach', 'Separates SDR from Pi\'s RF noise', 'Makes it look neater', 'USB cables are faster when longer'],
        correct: 1,
        explanation: 'Feeding ADS-B data to FlightAware or ADSBExchange contributes to global flight tracking and earns perks.'
      },
      {
        question: 'What database is good for time-series sensor data?',
        options: ['MySQL', 'MongoDB', 'InfluxDB', 'SQLite'],
        correct: 2,
        explanation: 'Proper coax cable (like LMR-400) and short cable runs minimize signal loss between antenna and SDR.'
      }
    ],
    developer: [
      {
        question: 'What triggers SDR thermal throttling on RTL-SDR?',
        options: ['Cold temperatures', 'Temperature above ~70°C', 'High sample rate', 'Long coax cables'],
        correct: 1,
        explanation: 'Docker Compose lets you run multiple SDR services (readsb, rtl_433, Grafana) in isolated containers.'
      },
      {
        question: 'Why does Meteor M2 LRPT need Doppler correction but NOAA APT does not?',
        options: [
          'Meteor moves faster',
          'NOAA uses digital modulation',
          'APT uses FM which naturally tracks frequency, LRPT uses QPSK which doesn\'t',
          'Meteor is further away'
        ],
        correct: 2,
        explanation: 'Automated satellite reception requires TLE orbit prediction to calculate AOS/LOS times and Doppler correction.'
      }
    ]
  },

  challenge: {
    newb: 'Design your dream SDR station on paper! Draw the hardware, antennas, and computer. Label everything. What signals will you monitor? Show it to your teacher or family!',
    explorer: 'Build a working ADS-B station: RTL-SDR + antenna + dump1090 on a Raspberry Pi. Run it for one week and create a report: total aircraft seen, busiest hour, farthest detection, and a map of coverage area.',
    developer: 'Build the full multi-signal station: automated ADS-B + ISM sensor logging + scheduled satellite reception. Implement a Grafana dashboard showing real-time data from all sources. Document the entire build in a reproducible guide.'
  }
});

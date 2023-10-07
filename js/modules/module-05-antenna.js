/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE 5: ANTENNA LAB
   ═══════════════════════════════════════════ */

ModuleContent.register('module-5', {
  narrative: {
    newb: "An antenna is like a fishing net for radio waves! Different shapes catch different types of signals. Some antennas listen in every direction, and some focus like a flashlight beam. Let's build one!",
    explorer: "Antennas are the critical interface between electromagnetic waves and your SDR. Understanding antenna types, gain patterns, impedance matching, and wavelength relationships lets you optimize reception for any signal you want to capture.",
    developer: "Antenna theory connects electromagnetic field equations to practical RF system design. We'll cover radiation patterns, gain, impedance, effective aperture, polarization, and practical antenna construction for common SDR frequency bands."
  },

  sections: {
    newb: [
      {
        type: 'text',
        title: '📡 What is an Antenna?',
        content: `<p>An <strong>antenna</strong> is a piece of metal (usually wire) that catches radio waves and turns them into electrical signals your radio can understand. Without an antenna, your SDR is deaf!</p>
        <p>Different antennas work better at different frequencies — just like different fishing nets catch different sizes of fish.</p>`
      },
      {
        type: 'analogy',
        icon: '🎣',
        content: `Antennas are like fishing nets! A big wide net (omnidirectional antenna) catches fish from everywhere but not very well. A spear (directional antenna like a Yagi) catches one fish at a time but with great precision. And the size of the net must match the size of the fish — your antenna must match the wavelength of the signal!`
      },
      {
        type: 'cards',
        title: '🔧 Types of Antennas',
        items: [
          { icon: '📏', title: 'Whip (Monopole)', description: 'Simple stick antenna. Hears from all directions. Comes with most SDR dongles.' },
          { icon: '🔀', title: 'Dipole', description: 'Two wires in opposite directions. Better than a whip! Easy to build from any wire.' },
          { icon: '📺', title: 'Yagi', description: 'Looks like an old TV antenna. Points in one direction for strong reception from that way.' },
          { icon: '📡', title: 'Dish (Parabolic)', description: 'Like a satellite dish. VERY focused beam. Used for catching signals from space!' },
        ]
      },
      {
        type: 'text',
        title: '📐 Antenna Size = Wave Size',
        content: `<p>Here's the magic rule: <strong>your antenna should be about half the wavelength of the signal you want</strong>.</p>
        <p>📻 FM radio (100 MHz) → wavelength = 3 meters → antenna = 1.5 meters (about 5 feet)!</p>
        <p>📶 WiFi (2.4 GHz) → wavelength = 12.5 cm → antenna = 6.25 cm (tiny!)</p>
        <p>That's why WiFi antennas are small and FM antennas are big!</p>`
      },
      {
        type: 'simulator',
        title: '🧪 See Antenna Radiation Patterns',
        simType: 'antenna',
        simId: 'mod5-antenna',
        simConfig: { antennaType: 'dipole', frequency: 100e6 }
      },
      {
        type: 'steps',
        title: '🛠️ Build a Simple Dipole Antenna!',
        items: [
          { title: 'Calculate the length', description: 'For FM radio: 300 ÷ 100 MHz = 3 meters wavelength. Half wave = 1.5 meters total. Each side = 75 cm.' },
          { title: 'Get materials', description: 'Two pieces of wire (75 cm each), a coaxial cable connector or alligator clips.' },
          { title: 'Connect the wires', description: 'Attach one wire to the center conductor and one to the shield of the coaxial cable. Spread them in a straight line.' },
          { title: 'Mount it', description: 'Hang it in a window or on a pole. Keep it away from metal objects.' },
          { title: 'Connect to SDR', description: 'Plug the coax into your RTL-SDR and tune to the FM band. Compare with the stock antenna!' },
        ]
      }
    ],

    explorer: [
      {
        type: 'text',
        title: 'Antenna Fundamentals',
        content: `<p>An antenna is a <strong>transducer</strong> — it converts between electromagnetic waves in free space and guided electrical signals on a transmission line. The key parameters are:</p>
        <p><strong>Gain:</strong> How much an antenna focuses energy in a particular direction, measured in dBi (relative to an isotropic radiator) or dBd (relative to a dipole).</p>
        <p><strong>Radiation pattern:</strong> A 3D map of the antenna's sensitivity/gain as a function of direction.</p>
        <p><strong>Impedance:</strong> The antenna's electrical resistance/reactance. Must match the feedline (usually 50Ω or 75Ω) for maximum power transfer.</p>
        <p><strong>Polarization:</strong> The orientation of the electric field — vertical, horizontal, or circular.</p>`
      },
      {
        type: 'table',
        title: 'Antenna Types for SDR',
        headers: ['Antenna', 'Gain', 'Pattern', 'Bandwidth', 'Best For'],
        rows: [
          ['Telescopic whip', '~2 dBi', 'Omnidirectional', 'Narrow (tune to λ/4)', 'General scanning'],
          ['Dipole (half-wave)', '2.15 dBi', 'Omnidirectional (donut)', 'Moderate (~10%)', 'FM, VHF, UHF'],
          ['Ground plane', '~3 dBi', 'Omni, low angle', 'Moderate', 'VHF/UHF scanning'],
          ['Discone', '0–2 dBi', 'Omnidirectional', 'Very wide (10:1)', 'Wideband scanning'],
          ['Yagi-Uda', '7–15 dBi', 'Directional', 'Narrow (~5%)', 'Specific signals, NOAA sats'],
          ['QFH (Quadrifilar)', '~3 dBi', 'Hemispherical', 'Narrow', 'Weather satellites'],
          ['Parabolic dish', '20–40 dBi', 'Very directional', 'Wide', 'Satellites, deep space'],
        ]
      },
      {
        type: 'text',
        title: 'Wavelength and Antenna Sizing',
        content: `<p>The fundamental relationship: <strong>λ = c / f</strong>. For a half-wave dipole, total length = λ/2. For a quarter-wave monopole (over a ground plane), length = λ/4.</p>
        <p>In practice, we apply a <strong>velocity factor</strong> (typically 0.95 for wire antennas) because waves travel slightly slower in conductors than in free space.</p>
        <p>Example: Quarter-wave for 137 MHz (NOAA satellites): λ = 300/137 = 2.19m, quarter wave = 0.548m × 0.95 = 52 cm per element.</p>`
      },
      {
        type: 'text',
        title: 'Impedance Matching',
        content: `<p>When an antenna's impedance doesn't match the feedline, some signal is <strong>reflected</strong> back instead of being received. This is measured by <strong>VSWR (Voltage Standing Wave Ratio)</strong> or <strong>return loss</strong>.</p>
        <p>VSWR 1:1 = perfect match. VSWR 2:1 = acceptable (~11% reflected power). VSWR 3:1 = poor (~25% reflected).</p>
        <p>A half-wave dipole has ~73Ω impedance in free space — close enough to 75Ω coax for most purposes. For 50Ω systems, use a balun or matching network.</p>`
      },
      {
        type: 'simulator',
        title: '🧪 Compare Antenna Patterns',
        simType: 'antenna',
        simId: 'mod5-antenna-explore',
        simConfig: { antennaType: 'yagi', frequency: 137e6 }
      }
    ],

    developer: [
      {
        type: 'text',
        title: 'Antenna Theory',
        content: `<p>From Maxwell's equations, an accelerating charge radiates electromagnetic energy. An antenna is designed to create controlled charge acceleration patterns to produce desired radiation patterns.</p>
        <p><strong>Effective aperture:</strong> Ae = G·λ² / (4π), relating gain to the "capture area" of the antenna. Higher gain = larger effective aperture.</p>
        <p><strong>Friis with antenna aperture:</strong> Pr/Pt = Ae_tx · Ae_rx / (λ²·d²), showing that antenna gain directly impacts link budget.</p>
        <p><strong>Radiation resistance:</strong> For a half-wave dipole, Rr ≈ 73Ω. For a short dipole (L << λ), Rr ≈ 20π²(L/λ)² — very low, making it inefficient.</p>`
      },
      {
        type: 'text',
        title: 'Pattern Analysis',
        content: `<p>The far-field radiation pattern E(θ,φ) is computed from the antenna current distribution I(z) using the array factor integral. For a half-wave dipole: E(θ) ∝ cos(π/2 · cos θ) / sin θ.</p>
        <p>Key metrics: <strong>Half-power beamwidth (HPBW)</strong> — angular width between -3 dB points. <strong>Front-to-back ratio (F/B)</strong> — ratio of forward to rearward gain. <strong>Sidelobe level (SLL)</strong> — highest sidelobe relative to main beam.</p>
        <p>For a Yagi-Uda array, gain ≈ 10·log₁₀(4.2·N) dBi where N is number of elements, though this depends heavily on element spacing and tuning.</p>`
      },
      {
        type: 'table',
        title: 'Antenna Dimensions for SDR Frequencies',
        headers: ['Frequency', 'Application', 'λ', 'λ/2 Dipole', 'λ/4 Monopole'],
        rows: [
          ['137 MHz', 'NOAA satellites', '2.19 m', '1.09 m', '54.7 cm'],
          ['144 MHz', 'Ham 2m band', '2.08 m', '1.04 m', '52.1 cm'],
          ['433 MHz', 'ISM/LoRa', '69.3 cm', '34.6 cm', '17.3 cm'],
          ['868 MHz', 'LoRa EU', '34.6 cm', '17.3 cm', '8.6 cm'],
          ['1090 MHz', 'ADS-B', '27.5 cm', '13.8 cm', '6.9 cm'],
          ['1575 MHz', 'GPS L1', '19.0 cm', '9.5 cm', '4.8 cm'],
        ]
      },
      {
        type: 'text',
        title: 'Practical Considerations for SDR',
        content: `<p><strong>Receive-only simplification:</strong> Since RTL-SDR only receives, VSWR is less critical (reflected power doesn't damage anything). However, poor matching still reduces received signal strength.</p>
        <p><strong>Wideband options:</strong> The discone antenna offers usable gain across a 10:1 frequency range — ideal for scanning. Trade-off: lower gain than resonant antennas at any specific frequency.</p>
        <p><strong>LNA placement:</strong> A low-noise amplifier should be placed as close to the antenna feedpoint as possible (before the coax) to minimize noise figure degradation. The system noise figure: NF_sys = NF₁ + (NF₂-1)/G₁.</p>
        <p><strong>Coax loss:</strong> RG-58 loses ~6 dB per 30m at 400 MHz. Use LMR-400 (1.5 dB/30m) for long runs. At UHF+, coax loss often exceeds antenna gain — keep cables short or use active antennas.</p>`
      },
      {
        type: 'code',
        title: 'Antenna Design Formulas',
        content: `Half-wave dipole length: L = (c / f) × 0.5 × VF
Quarter-wave monopole:   L = (c / f) × 0.25 × VF
  (VF = velocity factor ≈ 0.95 for wire)

Effective aperture:      Ae = G·λ² / (4π)
Radiation resistance:    Rr(dipole) ≈ 73Ω
Return loss:             RL = -20·log₁₀(|Γ|)
  where Γ = (Z_ant - Z_line) / (Z_ant + Z_line)
VSWR:                    (1+|Γ|) / (1-|Γ|)
Noise figure cascade:    NF = NF₁ + (NF₂-1)/G₁`
      }
    ]
  },

  didYouKnow: [
    'The largest radio antenna on Earth is the 500-meter FAST telescope in China — as wide as 30 football fields!',
    'Your body is an antenna! You can improve FM reception by touching the antenna because your body acts as a conductor.',
    'Satellite dishes are parabolic antennas — the curve focuses radio waves to a single point, just like a curved mirror focuses light.',
    'The earliest antennas were just long wires strung between poles — and they worked!',
    'Fractal antennas (antennas shaped like fractals) can receive multiple frequency bands in a tiny space — they\'re used in smartphones.'
  ],

  takeaways: [
    'Antenna length must match the target frequency wavelength',
    'A half-wave dipole length: L = c/(2f) or L(m) = 150/f(MHz)',
    'SWR measures impedance matching — 1:1 is perfect',
    'Antenna gain focuses energy directionally, measured in dBi'
  ],

  quiz: {
    newb: [
      {
        question: 'Why should your antenna be about half the wavelength of the signal?',
        options: ['It looks better', 'It matches the wave and catches more energy', 'It\'s cheaper', 'It makes less noise'],
        correct: 1,
        explanation: 'A dipole is two equal rods — the simplest and most fundamental antenna type.'
      },
      {
        question: 'Which antenna type hears from only one direction?',
        options: ['Whip', 'Dipole', 'Yagi', 'Discone'],
        correct: 2,
        explanation: 'Antenna length must match the wavelength of the target frequency for efficient reception.'
      },
      {
        question: 'For FM radio at 100 MHz, how long should a dipole antenna be?',
        options: ['15 cm', '75 cm', '1.5 meters', '3 meters'],
        correct: 2,
        explanation: 'Higher gain means the antenna focuses energy in a specific direction rather than radiating equally in all directions.'
      }
    ],
    explorer: [
      {
        question: 'What is antenna gain measured in?',
        options: ['Watts', 'dBi or dBd', 'MHz', 'Ohms'],
        correct: 1,
        explanation: 'SWR (Standing Wave Ratio) measures impedance match — 1:1 is perfect, above 3:1 means significant power is reflected back.'
      },
      {
        question: 'What happens when antenna impedance doesn\'t match the feedline?',
        options: ['Signal gets louder', 'Signal gets reflected back', 'Frequency changes', 'Antenna breaks'],
        correct: 1,
        explanation: 'A Yagi antenna uses parasitic director and reflector elements to create a directional beam.'
      },
      {
        question: 'Which antenna is best for wideband scanning across many frequencies?',
        options: ['Half-wave dipole', 'Yagi-Uda', 'Discone', 'Parabolic dish'],
        correct: 2,
        explanation: 'Antenna impedance must match the feedline (typically 50Ω) for maximum power transfer.'
      }
    ],
    developer: [
      {
        question: 'What is the radiation resistance of a half-wave dipole in free space?',
        options: ['50 Ω', '73 Ω', '100 Ω', '377 Ω'],
        correct: 1,
        explanation: 'Effective aperture relates the antenna\'s physical size to its ability to capture power from a passing wave.'
      },
      {
        question: 'Where should an LNA be placed for best system noise figure?',
        options: ['At the SDR input', 'After the coax', 'At the antenna feedpoint', 'Inside the computer'],
        correct: 2,
        explanation: 'Mutual coupling between elements in an array affects both impedance and radiation pattern.'
      }
    ]
  },

  challenge: {
    newb: 'Build a simple dipole antenna for FM radio using two pieces of wire (75 cm each). Connect it to your RTL-SDR and compare the signal strength with the stock antenna!',
    explorer: 'Calculate the quarter-wave monopole length for ADS-B reception (1090 MHz). Then design a ground plane antenna with 4 radials — what angle should the radials be bent to?',
    developer: 'Design a complete antenna system for NOAA weather satellite reception at 137.5 MHz. Specify: antenna type, dimensions, feedline type and length, LNA specifications, and calculate the full noise figure from antenna to SDR input.'
  }
});

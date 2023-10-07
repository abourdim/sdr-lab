/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE 2: WHAT IS RADIO?
   ═══════════════════════════════════════════ */

ModuleContent.register('module-2', {
  narrative: {
    newb: "Imagine you could see the invisible! Radio waves are all around us — from your WiFi to satellites in space. They're like invisible ripples in a cosmic pond. Let me show you how they work!",
    explorer: "Radio is electromagnetic radiation at specific frequencies. Understanding waves, frequency, wavelength, and propagation gives you the foundation to work with any radio system. Let's build that foundation.",
    developer: "Electromagnetic wave theory is the bedrock of RF engineering. This module covers wave mechanics, the EM spectrum, propagation models, and the relationship between time-domain and frequency-domain representations."
  },

  sections: {
    newb: [
      {
        type: 'text',
        title: '🌊 What Are Waves?',
        content: `<p>Drop a stone in water and watch the <strong>ripples</strong> spread out. That's a wave! Waves carry <strong>energy</strong> from one place to another.</p>
        <p>Radio waves work the same way, except instead of water, they travel through the air — and even through empty space! They're made of invisible electric and magnetic energy vibrating together.</p>`
      },
      {
        type: 'analogy',
        icon: '🪢',
        content: `Imagine shaking a jump rope up and down. The wave travels along the rope, but the rope itself stays in place — it just moves up and down. Radio waves are similar: the energy travels forward while the electric and magnetic fields "shake" up and down.`
      },
      {
        type: 'cards',
        title: '📊 Parts of a Wave',
        items: [
          { icon: '📏', title: 'Wavelength', description: 'The distance from one wave peak to the next. Longer waves = lower pitch.' },
          { icon: '🔄', title: 'Frequency', description: 'How many waves pass by per second. Measured in Hertz (Hz).' },
          { icon: '📶', title: 'Amplitude', description: 'How tall the wave is. Bigger = louder/stronger signal.' },
          { icon: '⚡', title: 'Speed', description: 'Radio waves travel at the speed of light — 300,000 km/s!' },
        ]
      },
      {
        type: 'text',
        title: '🌈 The Electromagnetic Spectrum',
        content: `<p>Radio waves are just one type of <strong>electromagnetic wave</strong>. There's a whole family!</p>
        <p>From longest to shortest wavelength: <strong>Radio waves</strong> → Microwaves → Infrared → Visible Light → Ultraviolet → X-rays → Gamma rays.</p>
        <p>They're all the same kind of energy — they just vibrate at different speeds!</p>`
      },
      {
        type: 'analogy',
        icon: '🎹',
        content: `The electromagnetic spectrum is like a piano keyboard. Low notes (bass) are like radio waves — long, low-frequency waves. High notes (treble) are like gamma rays — short, high-frequency waves. Visible light is just a tiny section in the middle — one octave on a cosmic piano!`
      },
      {
        type: 'text',
        title: '📡 How Does Radio Travel?',
        content: `<p>Radio waves can travel in different ways:</p>
        <p><strong>Direct line:</strong> Straight from transmitter to receiver (like a flashlight beam).</p>
        <p><strong>Ground wave:</strong> Follows the curve of the Earth (AM radio does this!).</p>
        <p><strong>Sky wave:</strong> Bounces off the upper atmosphere and comes back down — this is how shortwave radio travels around the world!</p>
        <p><strong>Reflection:</strong> Bounces off buildings and mountains (why you can sometimes hear radio in a valley).</p>`
      },
      {
        type: 'simulator',
        title: '🧪 See the FM Radio Band',
        simType: 'spectrum',
        simId: 'mod2-spectrum',
        simConfig: { scene: 'fmBand' }
      }
    ],

    explorer: [
      {
        type: 'text',
        title: 'Electromagnetic Waves',
        content: `<p>An electromagnetic (EM) wave consists of an <strong>electric field</strong> and a <strong>magnetic field</strong> oscillating perpendicular to each other and to the direction of propagation. Unlike sound waves, EM waves don't need a medium — they travel through vacuum at the speed of light, c ≈ 3 × 10⁸ m/s.</p>
        <p>The fundamental relationship: <strong>c = f × λ</strong> where f is frequency (Hz) and λ is wavelength (meters).</p>`
      },
      {
        type: 'table',
        title: 'The Electromagnetic Spectrum',
        headers: ['Band', 'Frequency Range', 'Wavelength', 'Common Uses'],
        rows: [
          ['ELF/VLF', '3 Hz – 30 kHz', '100,000 km – 10 km', 'Submarine communication'],
          ['LF/MF', '30 kHz – 3 MHz', '10 km – 100 m', 'AM broadcast, navigation'],
          ['HF', '3 – 30 MHz', '100 m – 10 m', 'Shortwave, amateur radio'],
          ['VHF', '30 – 300 MHz', '10 m – 1 m', 'FM radio, TV, aviation'],
          ['UHF', '300 MHz – 3 GHz', '1 m – 10 cm', 'TV, cellular, WiFi, GPS'],
          ['SHF', '3 – 30 GHz', '10 cm – 1 cm', 'Satellite, radar, 5G'],
          ['EHF', '30 – 300 GHz', '1 cm – 1 mm', 'Millimeter wave, astronomy'],
        ]
      },
      {
        type: 'text',
        title: 'Propagation Modes',
        content: `<p><strong>Line-of-sight (LOS):</strong> VHF and above. Limited by Earth's curvature. Range ≈ √(2 × h) km where h is antenna height in meters.</p>
        <p><strong>Ground wave:</strong> LF and MF. Follows Earth's surface. Good for AM broadcast over hundreds of km.</p>
        <p><strong>Sky wave (ionospheric):</strong> HF band. Refracted by ionosphere layers (D, E, F1, F2). Enables worldwide communication. Varies with time of day, season, and solar activity.</p>
        <p><strong>Space wave:</strong> Satellite communication through the atmosphere.</p>`
      },
      {
        type: 'text',
        title: 'The Doppler Effect',
        content: `<p>When a radio source moves toward you, the frequency appears <strong>higher</strong>. Moving away, it appears <strong>lower</strong>. This is the <strong>Doppler effect</strong>, the same reason an ambulance siren changes pitch as it passes.</p>
        <p>In SDR, Doppler shift is important for tracking satellites (they move at ~7.5 km/s in low orbit) and aircraft.</p>`
      },
      {
        type: 'simulator',
        title: '🧪 Explore the Wideband Spectrum',
        simType: 'spectrum',
        simId: 'mod2-spectrum-wide',
        simConfig: { scene: 'wideband' }
      }
    ],

    developer: [
      {
        type: 'text',
        title: 'Maxwell\'s Equations & Wave Propagation',
        content: `<p>The four Maxwell equations in differential form describe all classical EM phenomena. The wave equation derived from them: ∇²E = μ₀ε₀ ∂²E/∂t² shows that EM waves propagate at velocity c = 1/√(μ₀ε₀).</p>
        <p>In free space, the characteristic impedance is Z₀ = √(μ₀/ε₀) ≈ 377Ω — this is important for antenna impedance matching.</p>`
      },
      {
        type: 'text',
        title: 'Propagation Models',
        content: `<p><strong>Free-Space Path Loss (FSPL):</strong> L(dB) = 20log₁₀(d) + 20log₁₀(f) - 147.55, where d is distance in meters and f is frequency in Hz.</p>
        <p><strong>Friis Transmission Equation:</strong> Pr = Pt × Gt × Gr × (λ/4πd)², relating transmit power, antenna gains, wavelength, and distance to received power.</p>
        <p><strong>Two-Ray Ground Reflection:</strong> For longer distances, Pr ∝ (ht × hr / d²)², showing received power falls as d⁴ rather than d².</p>
        <p><strong>Okumura-Hata Model:</strong> Empirical model for urban/suburban/rural propagation at UHF. Widely used for cellular planning.</p>`
      },
      {
        type: 'text',
        title: 'Time vs Frequency Domain',
        content: `<p>A signal can be represented in the <strong>time domain</strong> (amplitude vs time) or <strong>frequency domain</strong> (amplitude vs frequency). The Fourier Transform converts between them: X(f) = ∫ x(t)e^(-j2πft) dt.</p>
        <p>In SDR, the <strong>FFT (Fast Fourier Transform)</strong> computes the discrete version efficiently in O(N log N) time. A spectrum display is essentially a real-time FFT of the I/Q samples.</p>
        <p>Key insight: modulation creates new frequency components. An AM signal has a carrier ± sideband frequencies. FM spreads energy across a bandwidth determined by Carson's rule: BW ≈ 2(Δf + fm).</p>`
      },
      {
        type: 'code',
        title: 'Key Formulas',
        content: `Wavelength:    λ = c / f
FSPL (dB):     20·log₁₀(d) + 20·log₁₀(f) - 147.55
Friis:         Pr = Pt·Gt·Gr·(λ/4πd)²
Doppler:       f_received = f_source × (1 + v/c)
Carson BW:     BW ≈ 2·(Δf + f_message)
FFT bin size:  Δf = fs / N  (sample rate / FFT size)`
      }
    ]
  },

  didYouKnow: [
    'The Sun is a giant radio transmitter! Jupiter also emits radio waves you can receive with a simple antenna.',
    'Radio waves from the center of our galaxy take 26,000 years to reach us.',
    'FM radio stations in the same city are always spaced at least 0.4 MHz apart to avoid interference.',
    'The cosmic microwave background (CMB) is radio radiation from 380,000 years after the Big Bang — the oldest "signal" we can detect.',
    'WiFi uses the same part of the electromagnetic spectrum as microwave ovens — 2.4 GHz!'
  ],

  takeaways: [
    'Radio waves are electromagnetic waves that travel at the speed of light (c ≈ 3×10⁸ m/s)',
    'Frequency and wavelength are inversely related: λ = c/f',
    'Radio waves can reflect, refract, diffract, and be absorbed by materials',
    'The electromagnetic spectrum spans from ELF radio to gamma rays'
  ],

  quiz: {
    newb: [
      {
        question: 'What carries radio waves?',
        options: ['Air molecules', 'Electricity and magnetism together', 'Sound vibrations', 'Gravity'],
        correct: 1,
        explanation: 'Radio waves are carried by oscillating electric and magnetic fields — they don\'t need air molecules.'
      },
      {
        question: 'How fast do radio waves travel?',
        options: ['Speed of sound', 'Speed of light', '100 km per hour', 'Speed of wind'],
        correct: 1,
        explanation: 'All electromagnetic waves, including radio, travel at approximately 300,000 km/s (the speed of light).'
      },
      {
        question: 'What is frequency?',
        options: ['How far a wave travels', 'How tall a wave is', 'How many waves pass per second', 'How loud a signal is'],
        correct: 2,
        explanation: 'Higher frequency means shorter wavelength — they\'re inversely proportional (c = f × λ).'
      }
    ],
    explorer: [
      {
        question: 'Which formula relates wavelength, frequency, and the speed of light?',
        options: ['c = f + λ', 'c = f × λ', 'c = f / λ', 'c = f² × λ'],
        correct: 1,
        explanation: 'The electromagnetic spectrum spans from very low frequency radio to gamma rays, all traveling at light speed.'
      },
      {
        question: 'Which propagation mode allows HF radio to travel around the world?',
        options: ['Line-of-sight', 'Ground wave', 'Sky wave (ionospheric)', 'Space wave'],
        correct: 2,
        explanation: 'Wavelength λ = c/f, so a 100 MHz signal has a 3-meter wavelength.'
      },
      {
        question: 'What happens to the frequency of a signal from a satellite moving toward you?',
        options: ['It increases (Doppler shift)', 'It decreases', 'It stays the same', 'It disappears'],
        correct: 0,
        explanation: 'Diffraction allows radio waves to bend around obstacles, which is why AM radio works in valleys.'
      }
    ],
    developer: [
      {
        question: 'What is the free-space characteristic impedance (Z₀)?',
        options: ['50 Ω', '75 Ω', '300 Ω', '377 Ω'],
        correct: 3,
        explanation: 'Polarization describes the orientation of the electric field vector as the wave propagates.'
      },
      {
        question: 'What is the FSPL at 1 km for 868 MHz?',
        options: ['About 71 dB', 'About 91 dB', 'About 111 dB', 'About 131 dB'],
        correct: 1,
        explanation: 'Path loss in free space follows the inverse square law: power decreases with the square of distance.'
      }
    ]
  },

  challenge: {
    newb: 'Calculate the wavelength of your favorite FM radio station! Use: wavelength = 300,000,000 ÷ frequency. Example: 100 MHz → 300,000,000 ÷ 100,000,000 = 3 meters!',
    explorer: 'Using the formula c = f × λ, calculate the wavelength for: WiFi (2.4 GHz), FM radio (100 MHz), and LoRa (868 MHz). Which has the longest wavelength?',
    developer: 'Calculate the link budget for an RTL-SDR receiving NOAA weather satellites at 137 MHz: satellite EIRP ≈ 37 dBm, distance ≈ 850 km, RX antenna gain ≈ 3 dBi. Is the received power above RTL-SDR sensitivity (-100 dBm)?'
  }
});

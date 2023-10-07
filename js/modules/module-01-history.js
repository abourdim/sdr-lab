/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE 1: RADIO HISTORY & HEROES
   ═══════════════════════════════════════════ */

ModuleContent.register('module-1', {
  narrative: {
    newb: "Did you know that people once thought talking through thin air was MAGIC? But brilliant inventors and scientists figured out how to do it! Let me introduce you to the heroes who made radio possible — including some amazing Muslim scientists you might not have heard about!",
    explorer: "Radio didn't appear overnight — it was built on centuries of scientific discovery. From Maxwell's equations to Marconi's first transmission, each breakthrough changed the world. Let's trace the path from theory to the radios in your pocket.",
    developer: "The history of radio is the history of applied electromagnetic theory. Understanding how we moved from Maxwell's field equations to modern SDR helps us appreciate the engineering decisions in current systems. Let's examine the key milestones."
  },

  sections: {
    newb: [
      {
        type: 'text',
        title: '✨ The Story of Radio',
        content: `<p>Long ago, if you wanted to send a message to someone far away, you had to send a person on a horse! Then came the telegraph (tapping electrical signals on a wire), then the telephone (talking on a wire). But the real magic? <strong>Sending messages through the air — with no wires at all!</strong></p>`
      },
      {
        type: 'timeline',
        title: '📅 Radio Timeline',
        items: [
          { year: '800s', title: 'Al-Kindi — First Book on Optics', description: 'Muslim scholar Al-Kindi wrote about how light travels in rays — an early step toward understanding electromagnetic waves.' },
          { year: '1000s', title: 'Ibn al-Haytham — Father of Optics', description: 'Muslim scientist Ibn al-Haytham (Alhazen) proved light travels in straight lines and invented the scientific method of experimentation.' },
          { year: '1864', title: 'James Clerk Maxwell — The Equations', description: 'Scottish scientist proved that electricity and magnetism are the same force, and predicted invisible waves that travel at the speed of light.' },
          { year: '1887', title: 'Heinrich Hertz — Proved Radio Waves Exist', description: 'German scientist created the first radio waves in a lab and proved Maxwell was right!' },
          { year: '1895', title: 'Guglielmo Marconi — First Radio Message', description: 'Italian inventor sent the first wireless telegraph message. The age of radio began!' },
          { year: '1901', title: 'Marconi — Across the Atlantic!', description: 'Marconi sent a radio signal across the Atlantic Ocean — over 3,500 km!' },
          { year: '1906', title: 'Reginald Fessenden — First Voice on Radio', description: 'Canadian inventor broadcast the first human voice and music over radio waves.' },
          { year: '1940s', title: 'Hedy Lamarr — Frequency Hopping', description: 'Movie star AND inventor! She invented frequency hopping, which is used in WiFi and Bluetooth today.' },
          { year: '1991', title: 'Joseph Mitola — Software Defined Radio', description: 'American engineer coined the term "Software Defined Radio" — using software to replace radio hardware.' },
        ]
      },
      {
        type: 'cards',
        title: '🌟 Muslim Science Heroes',
        items: [
          { icon: '🔭', title: 'Al-Kindi (801-873)', description: 'Wrote 270+ works including the first book on optics. Studied how light and radiation travel.' },
          { icon: '🔬', title: 'Ibn al-Haytham (965-1040)', description: 'Father of Optics. Invented the scientific method, proved light travels in straight lines.' },
          { icon: '📐', title: 'Al-Khwarizmi (780-850)', description: 'Father of Algebra. The math we use in SDR signal processing comes from his work.' },
          { icon: '⭐', title: 'Al-Biruni (973-1048)', description: 'Measured the Earth\'s circumference to within 16 km of the actual value. Amazing precision!' },
        ]
      },
      {
        type: 'analogy',
        icon: '📬',
        content: 'Before radio: sending a message was like mailing a letter — slow and needs a physical path. After radio: sending a message is like shouting into a canyon — it goes everywhere at once, instantly!'
      }
    ],

    explorer: [
      {
        type: 'text',
        title: 'From Theory to Transmission',
        content: `<p>Radio technology rests on <strong>electromagnetic theory</strong>. James Clerk Maxwell unified electricity and magnetism into four elegant equations, predicting that changing electric fields create magnetic fields and vice versa — producing waves that travel at the speed of light.</p>
        <p>Heinrich Hertz proved this experimentally using a spark-gap transmitter, creating and detecting radio waves across a room. Marconi then scaled this up to practical distances.</p>`
      },
      {
        type: 'timeline',
        title: '📅 Key Milestones',
        items: [
          { year: '1864', title: 'Maxwell\'s Equations', description: 'Unified theory of electromagnetism. Predicted electromagnetic waves travel at speed of light (c = 3×10⁸ m/s).' },
          { year: '1887', title: 'Hertz\'s Experiment', description: 'First artificial generation and detection of radio waves. Proved Maxwell\'s theory. Frequency unit "Hertz" named after him.' },
          { year: '1895', title: 'Marconi\'s Wireless Telegraph', description: 'First practical wireless communication over ~2 km. Used Morse code.' },
          { year: '1906', title: 'Fessenden\'s AM Broadcast', description: 'First audio broadcast using amplitude modulation (AM). Voice and music transmitted over radio.' },
          { year: '1933', title: 'Edwin Armstrong — FM Radio', description: 'Invented frequency modulation (FM), which greatly reduced static and noise compared to AM.' },
          { year: '1942', title: 'Lamarr & Antheil — Frequency Hopping', description: 'Patent for frequency-hopping spread spectrum (FHSS). Foundation for Bluetooth, WiFi, and military communications.' },
          { year: '1991', title: 'Mitola — Software Defined Radio', description: 'Coined SDR concept: radio functions implemented in software rather than fixed hardware.' },
          { year: '2010s', title: 'RTL-SDR Revolution', description: 'Cheap TV tuner dongles repurposed as SDR receivers, making radio experimentation accessible to everyone.' },
        ]
      },
      {
        type: 'info',
        content: 'The unit of frequency — the <strong>Hertz (Hz)</strong> — is named after Heinrich Hertz who first demonstrated radio waves experimentally.'
      },
      {
        type: 'text',
        title: 'Muslim Contributions to the Foundation',
        content: `<p><strong>Ibn al-Haytham</strong> (Alhazen, 965-1040) is considered the father of modern optics. His <em>Book of Optics</em> laid groundwork for understanding electromagnetic radiation by establishing that light is a physical phenomenon that follows mathematical laws.</p>
        <p><strong>Al-Khwarizmi</strong> (780-850) invented algebra — the mathematical foundation underlying all digital signal processing. The word "algorithm" comes from his name.</p>`
      }
    ],

    developer: [
      {
        type: 'text',
        title: 'Electromagnetic Theory to Modern SDR',
        content: `<p>Maxwell's equations (1864) unified Gauss's law, Faraday's law, and Ampere's law into four equations that describe all classical electromagnetic phenomena. The key insight: a time-varying electric field produces a magnetic field and vice versa, creating self-propagating waves at velocity c = 1/√(μ₀ε₀) ≈ 3×10⁸ m/s.</p>
        <p>Hertz's 1887 experiment used a spark-gap transmitter (essentially wideband impulse radio) and a resonant loop receiver. He demonstrated reflection, refraction, polarization, and interference of radio waves.</p>`
      },
      {
        type: 'table',
        title: 'Evolution of Radio Architecture',
        headers: ['Era', 'Architecture', 'Key Innovation', 'Flexibility'],
        rows: [
          ['1900s', 'Crystal radio', 'Passive tuned circuit + detector', 'Fixed frequency'],
          ['1920s', 'Superheterodyne', 'Mixer + IF stage', 'Tunable, selective'],
          ['1960s', 'Synthesized', 'PLL frequency synthesis', 'Agile tuning'],
          ['1990s', 'SDR (DSP-based)', 'ADC + digital processing', 'Software-reconfigurable'],
          ['2010s', 'SDR (commodity)', 'RTL2832U + R820T2 chipset', 'Ultra-low-cost RX'],
          ['2020s', 'Cognitive radio', 'AI + SDR', 'Self-adaptive spectrum use'],
        ]
      },
      {
        type: 'text',
        title: 'The RTL-SDR Revolution',
        content: `<p>In 2012, Antti Palosaari and Eric Fry discovered that Realtek RTL2832U DVB-T TV tuner chips could be accessed in raw I/Q sample mode, creating an extremely cheap (&lt;$25) wideband SDR receiver. This single discovery democratized radio experimentation.</p>
        <p>Architecture: R820T2 tuner → RTL2832U ADC (8-bit I/Q, ≤3.2 Msps) → USB 2.0 → host software (GNU Radio, SDR#, GQRX). The R820T2 handles RF frontend (LNA + mixer + IF filter) while RTL2832U performs digitization.</p>`
      }
    ]
  },

  didYouKnow: [
    'Hedy Lamarr was both a famous Hollywood actress AND the inventor of frequency hopping — a technology used in every WiFi and Bluetooth device today!',
    'The word "algebra" comes from the Arabic word "al-jabr" from Al-Khwarizmi\'s book. All the math in SDR uses algebra!',
    'Ibn al-Haytham spent years under house arrest, during which he wrote his famous Book of Optics — turning a difficult situation into a world-changing scientific work.',
    'Nikola Tesla demonstrated radio-controlled boats in 1898 — remote control was invented over 125 years ago!',
    'The first transatlantic radio message in 1901 was just one letter: "S" in Morse code (three dots).'
  ],

  takeaways: [
    'Radio technology evolved from Hertz (1887) through Marconi to modern SDR',
    'Key pioneers include Maxwell, Hertz, Marconi, Armstrong, and Hedy Lamarr',
    'Islamic Golden Age scholars contributed foundational work in optics and wave theory',
    'SDR represents the latest revolution — moving radio from hardware to software'
  ],

  quiz: {
    newb: [
      {
        question: 'Who proved that radio waves actually exist?',
        options: ['Marconi', 'Maxwell', 'Heinrich Hertz', 'Tesla'],
        correct: 2,
        explanation: 'Heinrich Hertz proved Maxwell\'s theoretical prediction of electromagnetic waves in his famous 1887 experiment.'
      },
      {
        question: 'What did Hedy Lamarr invent?',
        options: ['The television', 'Frequency hopping', 'The telephone', 'The microphone'],
        correct: 1,
        explanation: 'Marconi achieved the first transatlantic wireless transmission in 1901, proving radio waves could follow Earth\'s curvature.'
      },
      {
        question: 'Which Muslim scientist is called the "Father of Optics"?',
        options: ['Al-Khwarizmi', 'Al-Kindi', 'Ibn al-Haytham', 'Al-Biruni'],
        correct: 2,
        explanation: 'Hedy Lamarr co-invented frequency hopping spread spectrum, now used in WiFi and Bluetooth.'
      }
    ],
    explorer: [
      {
        question: 'Who predicted electromagnetic waves theoretically before they were proven?',
        options: ['Hertz', 'Marconi', 'Maxwell', 'Faraday'],
        correct: 2,
        explanation: 'Maxwell\'s equations unified electricity and magnetism, predicting electromagnetic waves travel at the speed of light.'
      },
      {
        question: 'What year was the term "Software Defined Radio" coined?',
        options: ['1975', '1991', '2001', '2012'],
        correct: 1,
        explanation: 'Armstrong invented FM radio in 1933 to solve AM\'s static noise problem.'
      },
      {
        question: 'What type of modulation did Edwin Armstrong invent to reduce static?',
        options: ['AM', 'FM', 'PM', 'SSB'],
        correct: 1,
        explanation: 'The RTL-SDR revolution began when hobbyists discovered TV tuner dongles could receive any frequency.'
      }
    ],
    developer: [
      {
        question: 'What chipset is used in most common RTL-SDR dongles?',
        options: ['Realtek RTL2832U + R820T2', 'Qualcomm SDR845', 'Analog Devices AD9361', 'Texas Instruments CC1101'],
        correct: 0,
        explanation: 'Cognitive radio dynamically adapts its parameters based on the spectral environment.'
      },
      {
        question: 'What speed do electromagnetic waves travel at in vacuum?',
        options: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', 'It depends on frequency'],
        correct: 1,
        explanation: 'MIMO uses multiple antennas to multiply capacity without extra bandwidth.'
      }
    ]
  },

  challenge: {
    newb: 'Draw your own radio timeline on paper with at least 5 events. Add your own illustrations!',
    explorer: 'Research one Muslim scientist mentioned in this module and write a short paragraph about their contribution to science.',
    developer: 'Compare the superheterodyne architecture with direct-conversion SDR. What are the advantages and trade-offs of each? Consider image rejection, DC offset, and complexity.'
  }
});

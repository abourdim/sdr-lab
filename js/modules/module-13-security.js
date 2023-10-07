/* ═══════════════════════════════════════════
   SDR KIDS LAB — MODULE 13: SECURITY & ETHICS
   ═══════════════════════════════════════════ */

ModuleContent.register('module-13', {
  narrative: {
    newb: "With the power to hear radio signals comes great responsibility! Just like a superhero must use their powers for good, we must use SDR ethically and legally. Let's learn the rules that keep everyone safe and make radio exploration fun for all.",
    explorer: "Radio monitoring intersects with privacy law, telecommunications regulations, and ethical considerations. Understanding legal frameworks, responsible disclosure, and the difference between monitoring and exploitation is essential for any SDR practitioner.",
    developer: "RF security encompasses transmission security (TRANSEC), communications security (COMSEC), and emission security (EMSEC). We'll examine legal frameworks, ethical guidelines, responsible research practices, and the technical aspects of RF security."
  },

  sections: {
    newb: [
      {
        type: 'text',
        title: '🛡️ The Radio Explorer\'s Code',
        content: `<p>As a radio explorer, you have amazing abilities — but you must follow important rules. Think of it like being a good neighbor: just because you CAN hear something doesn't mean you SHOULD listen or share it.</p>`
      },
      {
        type: 'steps',
        title: '⭐ The 5 Golden Rules',
        items: [
          { title: '👂 Listen, Don\'t Transmit (without permission)', description: 'RTL-SDR is receive-only, which is great! Never transmit on any frequency without proper authorization — it\'s illegal and can be dangerous.' },
          { title: '🤫 Keep Private Things Private', description: 'If you accidentally hear a private conversation, don\'t record it, share it, or tell others about it. Respect people\'s privacy.' },
          { title: '🚫 Never Jam or Interfere', description: 'Intentionally blocking radio signals is a serious crime. Emergency services, aircraft, and hospitals depend on clear radio communication.' },
          { title: '📋 Know Your Country\'s Rules', description: 'Radio laws vary by country. In most places, it\'s legal to LISTEN to most signals, but there are some restrictions. Learn your local rules!' },
          { title: '🤝 Be a Good Community Member', description: 'Share what you learn, help others, report problems responsibly, and always be honest about what you\'re doing.' },
        ]
      },
      {
        type: 'warning',
        content: '<strong>NEVER</strong> use SDR to: interfere with emergency services (police, fire, ambulance), jam other people\'s signals, record and share private conversations, or pretend to be someone else on the radio. These are <strong>serious crimes</strong> with heavy penalties.'
      },
      {
        type: 'text',
        title: '✅ What IS Okay',
        content: `<p>Lots of radio monitoring is perfectly legal and encouraged!</p>
        <p>✅ Listening to FM/AM radio stations</p>
        <p>✅ Tracking aircraft with ADS-B (this data is public!)</p>
        <p>✅ Receiving weather satellite images</p>
        <p>✅ Monitoring amateur radio (hams welcome listeners!)</p>
        <p>✅ Decoding public ISM band sensors (weather stations)</p>
        <p>✅ Learning about radio technology and science</p>
        <p>✅ Getting a ham radio license to transmit legally</p>`
      },
      {
        type: 'text',
        title: '🕌 Islamic Ethics and Radio',
        content: `<p>In Islam, we are taught to respect others' privacy — this applies perfectly to radio monitoring. The Quran teaches: do not spy on one another (49:12). If we accidentally intercept a private communication, we should not share it or use it harmfully.</p>
        <p>Using radio technology to help others, learn science, and explore Allah's creation is wonderful. Using it to harm, spy, or cause mischief goes against our values.</p>
        <p><strong>Bismillah</strong> — we begin every exploration with good intentions and end with gratitude for the knowledge gained.</p>`
      }
    ],

    explorer: [
      {
        type: 'text',
        title: 'Legal Framework for Radio Monitoring',
        content: `<p>Radio laws differ significantly by country, but general principles apply:</p>
        <p><strong>Receiving is generally legal:</strong> In most countries, receiving radio signals is legal. The electromagnetic waves pass through your property — you have no practical way to avoid them.</p>
        <p><strong>Exceptions exist:</strong> Some countries restrict receiving encrypted or specifically protected communications (military, cellular, some government). The act of decrypting is usually the illegal part, not the receiving.</p>
        <p><strong>Recording and sharing:</strong> Even where receiving is legal, recording and sharing intercepted private communications may violate privacy laws. Public broadcasts (FM, ADS-B, weather) are generally fine.</p>`
      },
      {
        type: 'table',
        title: 'Legal Status by Country (General Guide)',
        headers: ['Activity', 'US', 'UK', 'EU (varies)', 'Notes'],
        rows: [
          ['Receiving FM/AM', '✅ Legal', '✅ Legal', '✅ Legal', 'Public broadcasts'],
          ['ADS-B aircraft', '✅ Legal', '✅ Legal', '✅ Legal', 'Public safety data'],
          ['Weather satellites', '✅ Legal', '✅ Legal', '✅ Legal', 'Public scientific data'],
          ['Amateur radio', '✅ Legal to listen', '✅ Legal to listen', '✅ Legal to listen', 'TX needs license'],
          ['Cellular/mobile', '❌ Illegal to intercept', '❌ Illegal', '❌ Illegal', 'Encrypted, private'],
          ['Police/emergency', '✅ Legal to listen', '⚠️ Gray area', '⚠️ Varies', 'Many now encrypted'],
          ['Transmitting', '❌ Without license', '❌ Without license', '❌ Without license', 'Get a ham license!'],
          ['Jamming', '❌ Severe penalty', '❌ Severe penalty', '❌ Severe penalty', 'Always illegal everywhere'],
        ]
      },
      {
        type: 'text',
        title: 'Wireless Security Concepts',
        content: `<p><strong>Encryption:</strong> Modern cellular (4G/5G), WiFi (WPA3), and LoRaWAN use encryption. Even if you capture the signal, you can't read the content without the key. This is good security practice.</p>
        <p><strong>Security through obscurity:</strong> Some devices rely on being "hidden" rather than encrypted — this is NOT real security. If it's not encrypted, assume anyone can read it.</p>
        <p><strong>Rolling codes:</strong> Modern car key fobs use rolling codes — each press generates a new code, preventing replay attacks. Older systems with fixed codes are vulnerable.</p>
        <p><strong>Responsible disclosure:</strong> If you discover a security vulnerability in a wireless device, contact the manufacturer privately before making it public. Give them time to fix it. This protects users.</p>`
      },
      {
        type: 'text',
        title: 'Getting Licensed',
        content: `<p>Want to transmit legally? Get an <strong>amateur radio (ham) license</strong>! It's not as hard as you think.</p>
        <p><strong>US:</strong> Technician, General, Extra. Study at hamstudy.org, take exam at local club.</p>
        <p><strong>UK:</strong> Foundation, Intermediate, Full. Courses through RSGB.</p>
        <p><strong>EU:</strong> CEPT harmonized, varies by country. Usually 2-3 levels.</p>
        <p>With a license, you can transmit on amateur bands, join contests, contact the ISS, and bounce signals off the moon!</p>`
      }
    ],

    developer: [
      {
        type: 'text',
        title: 'RF Security Domains',
        content: `<p><strong>TRANSEC (Transmission Security):</strong> Protecting the transmission itself — frequency hopping, spread spectrum, LPI (Low Probability of Intercept) waveforms. Military FHSS systems hop across hundreds of frequencies per second.</p>
        <p><strong>COMSEC (Communications Security):</strong> Protecting the content — encryption, authentication, key management. AES-256 for data, ECDHE for key exchange.</p>
        <p><strong>EMSEC (Emission Security / TEMPEST):</strong> Preventing information leakage through unintentional electromagnetic emissions. Computer monitors, keyboards, and cables emit detectable RF that can be reconstructed. Shielded rooms (Faraday cages) mitigate this.</p>`
      },
      {
        type: 'text',
        title: 'Attack Vectors and Mitigations',
        content: `<p><strong>Replay attacks:</strong> Record and retransmit valid frames. Mitigated by sequence numbers, timestamps, and challenge-response protocols. KeeLoq rolling codes use LFSR-based non-repeating sequences.</p>
        <p><strong>Jamming:</strong> Overwhelm the receiver with noise. Continuous wave (CW), swept, or pulsed. Mitigation: spread spectrum, adaptive frequency selection, directional antennas, redundancy.</p>
        <p><strong>Eavesdropping:</strong> Passive interception. All unencrypted protocols are vulnerable. Even encrypted protocols leak metadata (timing, frequency, packet size). Traffic analysis can reveal patterns.</p>
        <p><strong>Spoofing:</strong> Transmit false signals (GPS spoofing, ADS-B injection). ADS-B has NO authentication — anyone can transmit false aircraft positions. This is a known aviation security concern.</p>
        <p><strong>Side-channel:</strong> Analyze RF emissions from processing (TEMPEST), power consumption (DPA), or timing to extract cryptographic keys.</p>`
      },
      {
        type: 'text',
        title: 'Ethical Research Framework',
        content: `<p><strong>Responsible disclosure process:</strong></p>
        <p>1. Discover vulnerability through legitimate research.</p>
        <p>2. Document thoroughly with minimal exploitation.</p>
        <p>3. Contact vendor privately (encrypted email preferred).</p>
        <p>4. Allow 90-day remediation window (industry standard).</p>
        <p>5. Publish findings with mitigations after fix or deadline.</p>
        <p><strong>Legal protection:</strong> In many jurisdictions, security research is protected if conducted in good faith. However, laws vary and the boundary between "research" and "unauthorized access" is legally complex. When in doubt, get legal advice and written authorization.</p>
        <p><strong>SDR-specific considerations:</strong> Observing RF emissions is generally passive and legal. Active testing (transmitting) requires authorization from the device owner and potentially regulatory compliance. Never test on production systems you don't own.</p>`
      },
      {
        type: 'code',
        title: 'Security Analysis Checklist',
        content: `# For any wireless protocol/device:
□ Is the communication encrypted? (capture, check entropy)
□ Is authentication used? (replay old packets → accepted?)
□ Are sequence numbers/nonces used? (replay protection)
□ Is the key exchange secure? (capture join/pairing)
□ What metadata is leaked? (device ID, timing patterns)
□ Is firmware update authenticated? (signed? integrity check?)
□ What is the attack surface? (range, required equipment)
□ Are there known CVEs for this protocol/device?

# Tools: Wireshark, URH, GNURadio, KillerBee, Ubertooth
# Always: Get permission. Document. Disclose responsibly.`
      }
    ]
  },

  didYouKnow: [
    'In the US, the penalty for intentionally jamming radio signals can be up to $100,000 fine and imprisonment — it\'s taken very seriously!',
    'Amateur radio operators have a proud tradition of providing emergency communications during disasters when cell phones and internet fail.',
    'The Enigma machine used in WWII was an early form of TRANSEC — it encrypted radio messages using rotating wheels. Breaking it (by Alan Turing and others) helped win the war.',
    'ADS-B has no encryption or authentication — meaning anyone with a transmitter could theoretically inject false aircraft data. This is a known concern being addressed by aviation authorities.',
    'The Islamic Golden Age established principles of privacy and intellectual honesty that directly apply to modern technology ethics.'
  ],

  takeaways: [
    'The 5 Golden Rules: listen respectfully, protect privacy, never jam, know the law, be a good citizen',
    'Receiving is generally legal; transmitting requires authorization in most countries',
    'Responsible disclosure: notify vendor → 90-day fix window → publish with mitigations',
    'Encryption (AES-256) and authentication protect wireless communications'
  ],

  quiz: {
    newb: [
      {
        question: 'Is it legal to listen to FM radio with SDR?',
        options: ['No, never', 'Yes, FM radio is public', 'Only with a license', 'Only in the US'],
        correct: 1,
        explanation: 'Receiving radio signals is generally legal in most countries — it\'s transmitting that requires permission.'
      },
      {
        question: 'What should you do if you accidentally hear a private conversation?',
        options: ['Record it', 'Share it online', 'Stop listening and don\'t share it', 'Call the police'],
        correct: 2,
        explanation: 'The 5 Golden Rules help young radio explorers stay safe, legal, and respectful.'
      },
      {
        question: 'Is jamming radio signals ever okay?',
        options: ['Yes, if you\'re bored', 'Yes, if you have a reason', 'No — it\'s always illegal and dangerous', 'Only on weekends'],
        correct: 2,
        explanation: 'Responsible disclosure means telling the manufacturer about vulnerabilities before making them public.'
      }
    ],
    explorer: [
      {
        question: 'What does "responsible disclosure" mean?',
        options: [
          'Never telling anyone about vulnerabilities',
          'Posting exploits on social media immediately',
          'Privately telling the manufacturer first, giving them time to fix it',
          'Selling vulnerability information'
        ],
        correct: 2,
        explanation: 'Encryption scrambles data so only authorized receivers can read it — security through obscurity is not secure.'
      },
      {
        question: 'What authentication does ADS-B currently use?',
        options: ['AES-256 encryption', 'Digital signatures', 'None — it\'s unauthenticated', 'Rolling codes'],
        correct: 2,
        explanation: 'Ham radio licenses (Technician/Foundation) prove you understand the rules and won\'t cause interference.'
      },
      {
        question: 'What license allows you to transmit on amateur radio bands?',
        options: ['Driving license', 'Ham radio license', 'TV license', 'No license needed'],
        correct: 1,
        explanation: 'Replay attacks record and retransmit signals — rolling codes defend against this by changing the code each time.'
      }
    ],
    developer: [
      {
        question: 'What does TEMPEST/EMSEC protect against?',
        options: ['Solar storms', 'Information leakage through unintentional electromagnetic emissions', 'Signal jamming', 'Software bugs'],
        correct: 1,
        explanation: 'The 90-day disclosure window gives vendors time to patch before vulnerabilities are published.'
      },
      {
        question: 'What is the industry standard timeline for responsible disclosure?',
        options: ['24 hours', '7 days', '90 days', '1 year'],
        correct: 2,
        explanation: 'TEMPEST attacks extract data from unintentional electromagnetic emissions of electronic devices.'
      }
    ]
  },

  challenge: {
    newb: 'Write your own "Radio Explorer\'s Pledge" with 5 rules you promise to follow. Decorate it and hang it near your radio setup!',
    explorer: 'Research the radio laws in your country. What signals are legal to listen to? What requires a license? What is strictly forbidden? Create a one-page guide.',
    developer: 'Analyze the security of a consumer IoT device you own: capture its RF emissions, determine if data is encrypted, check for replay vulnerability, and write a security assessment report with recommendations.'
  }
});

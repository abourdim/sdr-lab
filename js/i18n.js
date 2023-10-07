/* ═══════════════════════════════════════════
   SDR KIDS LAB — INTERNATIONALIZATION v1.0.0
   Arabic + French + English bilingual phrases
   ═══════════════════════════════════════════ */

const SDRI18n = (() => {
  const phrases = {
    en: {
      welcome: "Welcome to SDR Kids Lab!",
      bismillah: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      greeting: "Assalamu Alaikum",
      startAdventure: "Start Adventure",
      module: "Module",
      quiz: "Check Your Understanding",
      challenge: "Challenge",
      didYouKnow: "Did You Know?",
      nextModule: "Next Module",
      prevModule: "Previous Module",
      progress: "Progress",
      settings: "Settings",
      help: "Help",
      home: "Home",
      level: "Level",
      complete: "Complete",
    },
    fr: {
      welcome: "Bienvenue à SDR Kids Lab !",
      bismillah: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      greeting: "Assalamu Alaikum",
      startAdventure: "Commencer l'aventure",
      module: "Module",
      quiz: "Testez vos connaissances",
      challenge: "Défi",
      didYouKnow: "Le saviez-vous ?",
      nextModule: "Module suivant",
      prevModule: "Module précédent",
      progress: "Progression",
      settings: "Paramètres",
      help: "Aide",
      home: "Accueil",
      level: "Niveau",
      complete: "Terminé",
    },
    ar: {
      welcome: "!مرحباً بكم في مختبر الراديو",
      bismillah: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      greeting: "السلام عليكم",
      startAdventure: "ابدأ المغامرة",
      module: "الوحدة",
      quiz: "اختبر فهمك",
      challenge: "التحدي",
      didYouKnow: "هل تعلم؟",
      nextModule: "الوحدة التالية",
      prevModule: "الوحدة السابقة",
      progress: "التقدم",
      settings: "الإعدادات",
      help: "المساعدة",
      home: "الرئيسية",
      level: "المستوى",
      complete: "مكتمل",
    },
  };

  let currentLang = 'en';

  function setLang(lang) {
    if (phrases[lang]) currentLang = lang;
  }

  function t(key) {
    return phrases[currentLang]?.[key] || phrases.en[key] || key;
  }

  function getLang() { return currentLang; }

  // Bilingual greeting based on time of day
  function getGreeting(name) {
    const hour = new Date().getHours();
    const timeGreet = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    const greetings = {
      morning: { en: 'Good morning', fr: 'Bonjour', ar: 'صباح الخير' },
      afternoon: { en: 'Good afternoon', fr: 'Bon après-midi', ar: 'مساء الخير' },
      evening: { en: 'Good evening', fr: 'Bonsoir', ar: 'مساء الخير' },
    };
    const g = greetings[timeGreet];
    const nameStr = name ? `, ${name}` : '';
    return `${g.ar} · ${g.en}${nameStr}!`;
  }

  return { setLang, getLang, t, getGreeting, phrases };
})();

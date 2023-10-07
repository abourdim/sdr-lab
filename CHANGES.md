# SDR Kids Lab — Changelog

## v1.0.0 (2026-02-23)

### Content
- 15 modules × 3 difficulty levels = 45 learning experiences
- 223 content sections (text, tables, timelines, cards, code, simulators, steps)
- 120 quiz questions with educational explanations
- 60 Key Takeaways (4 per module)
- 45 hands-on challenges
- 75 fun facts
- 15 printable worksheets + 15 answer keys

### Features
- 10 interactive simulator engines (spectrum, waterfall, modulation, antenna, range, signal generator, noise, signal library, labs)
- Type-specific sim controls (spectrum: freq/noise/add signal; modulation: msg freq/depth/AM-FM-PM; antenna: freq/elements/type; range: power/freq)
- Gamification: XP, levels, 15 badges, printable certificate
- Teacher/Parent dashboard with worksheet & answer key links
- Full-text search with keyboard shortcut (/)
- Sound effects (Web Audio API)
- Onboarding wizard (name, level, role)
- Dynamic home page (bilingual greeting, random facts, progress, suggestions, shortcuts)
- Keyboard shortcuts (/, Alt+←→, Alt+1/2/3, Alt+H, Esc)
- Notification toast system (info/success/warning/error)

### Design
- Islamic geometric theme with بِسْمِ ٱللَّٰهِ header
- Dark (Space Dark) + Light (Sky Light) themes
- Responsive layout (mobile → desktop)
- Accessibility: high contrast, dyslexia font, reduced motion, font sizing
- Print-optimized CSS

### Technical
- Zero dependencies, fully offline (PWA + Service Worker)
- Privacy-first: all data in IndexedDB, nothing leaves the device
- Arabic/French/English i18n support
- 98 files, 224 KB zip
- 8,500+ lines JS, 2,800+ lines CSS
- All 120 quiz answers validated (correct index within bounds)
- Simulator animation cleanup on route change (no memory leaks)
- Graceful error handling with user-visible notifications

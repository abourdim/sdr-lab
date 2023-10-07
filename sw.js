const CACHE_NAME = 'sdr-kids-lab-v1.0.0';
const ASSETS = [
  './', './index.html', './manifest.json',
  './css/style.css', './css/dark-theme.css', './css/light-theme.css',
  './css/accessibility.css', './css/simulator.css', './css/module-content.css',
  './css/gamification.css', './css/enhancements.css', './css/genius-tools.css', './css/print.css',
  './js/storage.js', './js/settings.js', './js/app.js', './js/router.js',
  './js/playground.js', './js/module-content.js',
  './js/gamification.js', './js/teacher-mode.js', './js/search-sound.js',
  './js/enhancements.js', './js/i18n.js', './js/genius-tools.js',
  './js/simulator/spectrum-engine.js', './js/simulator/waterfall-engine.js',
  './js/simulator/modulation-engine.js', './js/simulator/antenna-simulator.js',
  './js/simulator/signal-generator.js', './js/simulator/noise-simulator.js',
  './js/simulator/signal-library.js', './js/simulator/range-calculator.js',
  './js/simulator/labs-engine.js',
  './js/modules/module-00-welcome.js', './js/modules/module-01-history.js',
  './js/modules/module-02-radio.js', './js/modules/module-03-sdr.js',
  './js/modules/module-04-frequency.js', './js/modules/module-05-antenna.js',
  './js/modules/module-06-modulation.js', './js/modules/module-07-microbit.js',
  './js/modules/module-08-esp32lora.js', './js/modules/module-09-rtlsdr.js',
  './js/modules/module-10-hackrf.js', './js/modules/module-11-decoding.js',
  './js/modules/module-12-iot.js', './js/modules/module-13-security.js',
  './js/modules/module-14-project.js',
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cached =>
    cached || fetch(e.request).then(r => {
      if (r.ok && e.request.method === 'GET') {
        const cl = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, cl));
      }
      return r;
    }).catch(() => e.request.destination === 'document' ? caches.match('./index.html') : undefined)
  ));
});

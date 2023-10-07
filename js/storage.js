/* ═══════════════════════════════════════════
   SDR KIDS LAB — STORAGE ENGINE v0.1.0
   IndexedDB persistence for local-first app
   ═══════════════════════════════════════════ */

const SDRStorage = (() => {
  const DB_NAME = 'sdr-kids-lab';
  const DB_VERSION = 1;
  let db = null;

  /* ── INIT DATABASE ── */
  function init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const database = e.target.result;

        // Settings store
        if (!database.objectStoreNames.contains('settings')) {
          database.createObjectStore('settings', { keyPath: 'key' });
        }

        // Progress store (per module)
        if (!database.objectStoreNames.contains('progress')) {
          database.createObjectStore('progress', { keyPath: 'moduleId' });
        }

        // Achievements / badges
        if (!database.objectStoreNames.contains('achievements')) {
          database.createObjectStore('achievements', { keyPath: 'id' });
        }

        // Bookmarks
        if (!database.objectStoreNames.contains('bookmarks')) {
          database.createObjectStore('bookmarks', { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (e) => {
        db = e.target.result;
        console.log('📦 SDR Storage: Database ready');
        resolve(db);
      };

      request.onerror = (e) => {
        console.error('📦 SDR Storage: Error opening database', e);
        reject(e);
      };
    });
  }

  /* ── GENERIC CRUD ── */
  function getStore(storeName, mode = 'readonly') {
    const tx = db.transaction(storeName, mode);
    return tx.objectStore(storeName);
  }

  function put(storeName, data) {
    return new Promise((resolve, reject) => {
      const store = getStore(storeName, 'readwrite');
      const req = store.put(data);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function get(storeName, key) {
    return new Promise((resolve, reject) => {
      const store = getStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  function getAll(storeName) {
    return new Promise((resolve, reject) => {
      const store = getStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  function remove(storeName, key) {
    return new Promise((resolve, reject) => {
      const store = getStore(storeName, 'readwrite');
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  function clearStore(storeName) {
    return new Promise((resolve, reject) => {
      const store = getStore(storeName, 'readwrite');
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  /* ── SETTINGS HELPERS ── */
  async function setSetting(key, value) {
    return put('settings', { key, value });
  }

  async function getSetting(key, defaultValue = null) {
    const result = await get('settings', key);
    return result ? result.value : defaultValue;
  }

  /* ── PROGRESS HELPERS ── */
  async function setModuleProgress(moduleId, data) {
    return put('progress', { moduleId, ...data, updatedAt: Date.now() });
  }

  async function getModuleProgress(moduleId) {
    return get('progress', moduleId);
  }

  async function getAllProgress() {
    return getAll('progress');
  }

  /* ── ACHIEVEMENT HELPERS ── */
  async function unlockAchievement(id, data) {
    return put('achievements', { id, ...data, unlockedAt: Date.now() });
  }

  async function getAchievements() {
    return getAll('achievements');
  }

  /* ── EXPORT / IMPORT ── */
  async function exportAll() {
    const data = {
      version: '0.1.0',
      exportedAt: new Date().toISOString(),
      settings: await getAll('settings'),
      progress: await getAll('progress'),
      achievements: await getAll('achievements'),
      bookmarks: await getAll('bookmarks'),
    };
    return JSON.stringify(data, null, 2);
  }

  async function importAll(jsonString) {
    const data = JSON.parse(jsonString);
    
    if (data.settings) {
      for (const item of data.settings) await put('settings', item);
    }
    if (data.progress) {
      for (const item of data.progress) await put('progress', item);
    }
    if (data.achievements) {
      for (const item of data.achievements) await put('achievements', item);
    }
    if (data.bookmarks) {
      for (const item of data.bookmarks) await put('bookmarks', item);
    }
    
    return true;
  }

  async function resetAll() {
    await clearStore('settings');
    await clearStore('progress');
    await clearStore('achievements');
    await clearStore('bookmarks');
    console.log('📦 SDR Storage: All data cleared');
  }

  /* ── PUBLIC API ── */
  return {
    init,
    setSetting,
    getSetting,
    setModuleProgress,
    getModuleProgress,
    getAllProgress,
    unlockAchievement,
    getAchievements,
    exportAll,
    importAll,
    resetAll,
  };
})();

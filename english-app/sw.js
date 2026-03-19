/**
 * Service Worker - caches all assets for offline use.
 * Change CACHE_VERSION on each deploy to trigger update.
 */

const CACHE_VERSION = 4;
const CACHE_NAME = 'english-trainer-v' + CACHE_VERSION;

const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/files-data.js',
  './js/vocab-data.js',
  './js/plan-data.js',
  './js/state.js',
  './js/tts.js',
  './js/markdown.js',
  './js/gamification.js',
  './js/views.js',
  './js/flashcards.js',
  './js/translator.js',
  './js/app.js',
  './manifest.json',
];

// Install: cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first, then update cache in background
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Return cached immediately, but also fetch fresh copy in background
      const fetchPromise = fetch(event.request).then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => null);

      return cached || fetchPromise;
    })
  );
});

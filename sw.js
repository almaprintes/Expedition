// Se sube de versión en cada release para invalidar la caché anterior.
const CACHE_VERSION = 'expedition-v0.3.002';

// El bundle de Phaser servido desde CDN se deja fuera de esta lista
// (addAll falla con facilidad en respuestas cross-origin opacas); el
// navegador lo cachea igualmente por su propia caché HTTP.
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './src/main.js',
  './src/Game.js',
  './src/engine/StateMachine.js',
  './src/engine/InputManager.js',
  './src/scenes/ExpeditionScene.js',
  './src/entities/Combatant.js',
  './src/entities/Hero.js',
  './src/entities/Enemy.js',
  './src/entities/EnemyFactory.js',
  './src/systems/CombatSystem.js',
  './src/systems/EncounterSystem.js',
  './src/systems/LootSystem.js',
  './src/ui/HUD.js',
  './src/ui/HealthBar.js',
  './assets/ui/icon-192.png',
  './assets/ui/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});

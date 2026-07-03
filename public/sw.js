/**
 * Service Worker
 * PWA: cache assets for offline use, fast repeat visits
 *
 * Cache strategy:
 *   - HTML:      network-first, fall back to cache
 *   - CSS/JS:    cache-first
 *   - Images:    cache-first with TTL
 *   - API:       network-only (no cache for sensitive data)
 */

const VERSION = 'v1.0.0';
const STATIC_CACHE = `portfolio-static-${VERSION}`;
const RUNTIME_CACHE = `portfolio-runtime-${VERSION}`;
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/data.js',
  '/assets/favicon.svg',
  '/assets/logo.svg',
  '/manifest.json'
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: route based on request
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== 'GET') return;

  // Skip cross-origin
  if (url.origin !== location.origin) return;

  // Skip API calls (always go to network)
  if (url.pathname.startsWith('/api/')) return;

  // Skip admin (don't cache sensitive)
  if (url.pathname.startsWith('/admin/')) return;

  if (request.destination === 'document') {
    // Network-first for HTML
    event.respondWith(networkFirst(request));
  } else if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    // Cache-first for assets
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    const cached = await caches.match(request);
    return cached || caches.match('/index.html');
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    return new Response('Offline', { status: 503 });
  }
}

// Listen for messages from the page
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

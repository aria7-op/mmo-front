const CACHE_NAME = 'mmo-app-v1';
const STATIC_CACHE = 'mmo-static-v1';
const DYNAMIC_CACHE = 'mmo-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  // Add other critical static assets
];

const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const STATIC_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle API requests
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/bak')) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          // Return cached version if available and fresh
          if (cachedResponse) {
            const cachedTime = new Date(cachedResponse.headers.get('date')).getTime();
            if (Date.now() - cachedTime < API_CACHE_DURATION) {
              return cachedResponse;
            }
          }

          // Otherwise fetch from network
          return fetch(request).then((networkResponse) => {
            // Cache successful responses
            if (networkResponse.ok) {
              const responseToCache = networkResponse.clone();
              cache.put(request, responseToCache);
            }
            return networkResponse;
          }).catch(() => {
            // Return cached version if network fails
            return cachedResponse;
          });
        });
      })
    );
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.some(asset => request.url.includes(asset)) || 
      request.url.includes('/assets/') ||
      request.url.match(/\.(css|js|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$/)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          // Return cached version if available
          if (cachedResponse) {
            return cachedResponse;
          }

          // Otherwise fetch from network and cache
          return fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              const responseToCache = networkResponse.clone();
              cache.put(request, responseToCache);
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // For all other requests, use network first with cache fallback
  event.respondWith(
    fetch(request).then((networkResponse) => {
      // Cache successful responses
      if (networkResponse.ok) {
        const responseToCache = networkResponse.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });
      }
      return networkResponse;
    }).catch(() => {
      // Return cached version if network fails
      return caches.match(request);
    })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any background sync tasks here
      Promise.resolve()
    );
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico'
  };

  event.waitUntil(
    self.registration.showNotification('MMO Notification', options)
  );
});

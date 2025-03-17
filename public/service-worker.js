// This is a simple service worker for PWA functionality
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('rupeetrack-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/rupee-icon.svg'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
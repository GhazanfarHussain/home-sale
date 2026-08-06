/* Home Sale - service worker for installable mobile app shell caching */
const CACHE_NAME = "home-sale-v1";
const APP_SHELL = [
  "index.html",
  "product.html",
  "styles.css",
  "script.js",
  "product.js",
  "icons.js",
  "manifest.json",
  "images/icons/icon-192.png",
  "images/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Never cache the admin editor or its login gate - always fetch fresh.
  if (/\/admin(-auth)?\.(html|js)$/.test(url.pathname)) return;

  // Product data: network-first so catalog edits show up, fall back to cache offline.
  if (url.pathname.endsWith("/data/items.json")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // App shell / images: cache-first for speed, refresh cache in the background.
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

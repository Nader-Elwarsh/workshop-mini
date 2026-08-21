const CACHE_NAME = "workshop-v11-2-7-orders-list-fix";
const CORE_FILES = [
  "./",
  "./index.html",
  "./customers.html",
  "./customer.html",
  "./devices.html",
  "./device.html",
  "./requests.html",
  "./request.html",
  "./inventory.html",
  "./part.html",
  "./settings.html",
  "./style.css",
  "./app.js",
  "./workshop-mini-enhancements.js",
  "./manifest.json",
  "./icon-192-v2.png",
  "./icon-512-v2.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // HTML pages: cache by pathname, not by query string.
  // This makes customer.html?id=..., device.html?id=... and request.html?id=...
  // open correctly while offline; app.js reads the ID from the URL.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          const cacheKey = new Request(url.origin + url.pathname, {method:"GET"});
          caches.open(CACHE_NAME).then(cache => cache.put(cacheKey, copy));
          return response;
        })
        .catch(() => {
          const cacheKey = new Request(url.origin + url.pathname, {method:"GET"});
          return caches.match(cacheKey).then(cached => cached || caches.match("./index.html"));
        })
    );
    return;
  }

  // Static files: network first when online so a newly deployed version is
  // picked up quickly; fall back to the local cache when offline.
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

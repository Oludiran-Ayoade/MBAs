// Service worker: cache-first for the app shell, network-first for Cloudinary lists.
const CACHE = "mba-notes-v5";
const SHELL = ["/", "/upload", "/manifest.json", "/icon.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // Only handle GETs — POSTs (e.g. /api/delete) must go straight to the network.
  if (e.request.method !== "GET") return;
  // Always hit the network for Cloudinary — lists and files must stay fresh.
  if (url.hostname.endsWith("cloudinary.com")) return;
  // Markdown notes: try network first, fall back to cache.
  if (url.pathname.endsWith(".md")) {
    e.respondWith(
      fetch(e.request)
        .then(res => { const c = res.clone(); caches.open(CACHE).then(cc => cc.put(e.request, c)); return res; })
        .catch(async () => (await caches.match(e.request)) || Response.error())
    );
    return;
  }
  // Everything else: network first, cache fallback (Next pages are dynamic).
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (e.request.method === "GET" && res.ok) {
          const c = res.clone();
          caches.open(CACHE).then(cc => cc.put(e.request, c));
        }
        return res;
      })
      .catch(async () => (await caches.match(e.request)) || Response.error())
  );
});

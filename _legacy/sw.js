// Service worker: cache-first for the app shell, network-first for Cloudinary lists.
const CACHE = "mba-notes-v1";
const SHELL = [
  "./",
  "./index.html",
  "./course.html",
  "./upload.html",
  "./reader.html",
  "./manifest.json",
  "./assets/css/styles.css",
  "./assets/js/config.js",
  "./assets/js/data.js",
  "./assets/js/app.js",
  "./assets/js/course.js",
  "./assets/js/reader.js",
  "./assets/js/upload.js",
  "./assets/js/theme.js",
  "./assets/icon.svg"
];

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
  // Always hit the network for Cloudinary — lists and files must stay fresh.
  if (url.hostname.endsWith("cloudinary.com")) return;
  // Markdown notes: try network first, fall back to cache.
  if (url.pathname.endsWith(".md")) {
    e.respondWith(
      fetch(e.request)
        .then(res => { const c = res.clone(); caches.open(CACHE).then(cc => cc.put(e.request, c)); return res; })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  // App shell: cache-first.
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});

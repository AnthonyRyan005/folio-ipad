// Folio keeps a copy of itself on the device so it opens without the internet.
// The build changes VERSION whenever the app changes, so devices pick up new versions.
// The text reader lives in its own cache, so app updates don't download it again.
const VERSION = 'folio-729b6bbcc1ef';
const OCR = 'folio-ocr-4549540fa4ee';
const FILES = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png"];
const OCR_FILES = ["ocr/tesseract.min.js", "ocr/worker.min.js", "ocr/tesseract-core-simd-lstm.wasm.js", "ocr/eng.traineddata.gz"];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(FILES.map(f => new Request(f, { cache: 'reload' })));
    try {
      const ocr = await caches.open(OCR);
      const have = new Set((await ocr.keys()).map(r => new URL(r.url).pathname));
      const need = OCR_FILES.filter(f => !have.has(new URL(f, self.location).pathname));
      if (need.length) await ocr.addAll(need.map(f => new Request(f, { cache: 'reload' })));
    } catch (e) { /* the text reader is optional: Folio still works without it */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('folio-') && key !== VERSION && key !== OCR) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    if (req.mode === 'navigate') {
      const page = await (await caches.open(VERSION)).match('index.html');
      return page || fetch(req);
    }
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    const res = await fetch(req);
    // Keep any other part of the text reader that this device needs, such as the version for older iPads.
    if (res.ok && url.pathname.includes('/ocr/')) (await caches.open(OCR)).put(req, res.clone()).catch(() => {});
    return res;
  })());
});

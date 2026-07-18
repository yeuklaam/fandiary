/* FanDiary Service Worker
   更新 App 時:把 VERSION 加 1,使用者下次開啟會自動換新快取 */
const VERSION = 'fandiary-v4';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-192.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png'
];

/* 安裝:預先快取 App 外殼 */
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

/* 啟用:清掉舊版本快取 */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* 取用策略:
   - App 外殼(同網域):快取優先,離線也能開
   - Google Fonts:快取優先+背景更新(第一次上線後,離線字型也正常)
   - 其他:網路優先,失敗退回快取 */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;

  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(hit => hit ||
        fetch(e.request).then(res => {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(e.request, copy));
          return res;
        })
      ).catch(() => caches.match('./index.html'))
    );
    return;
  }

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(VERSION + '-fonts').then(async c => {
        const hit = await c.match(e.request);
        const net = fetch(e.request).then(res => { c.put(e.request, res.clone()); return res; }).catch(() => null);
        return hit || net || Response.error();
      })
    );
  }
});

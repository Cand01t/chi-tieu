/* Lưu sẵn giao diện để app mở nhanh; dữ liệu luôn lấy mới từ Google Sheets */
var CACHE = 'chitieu-v3';
var SHELL = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // không đụng tới API Google
  e.respondWith(fetch(e.request).then(function (r) {                       // ưu tiên bản mới, mất mạng thì dùng bản lưu
    var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); return r;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
});

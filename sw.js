const CACHE_NAME = 'vocab-growth-v2';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener(
  'install',
  function(event) {
    event.waitUntil(
      caches
        .open(CACHE_NAME)
        .then(function(cache) {
          return cache.addAll(FILES_TO_CACHE);
        })
    );
  }
);

self.addEventListener(
  'activate',
  function(event) {
    event.waitUntil(
      caches.keys().then(function(keys) {
        return Promise.all(
          keys.map(function(key) {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
    );
  }
);

self.addEventListener(
  'fetch',
  function(event) {

    // 페이지 이동(index.html)은 항상 최신 버전을 먼저 받는다.
    if (event.request.mode === 'navigate') {

      event.respondWith(
        fetch(event.request)
          .catch(function() {
            return caches.match('./index.html');
          })
      );

      return;
    }

    // 아이콘 등 나머지 파일은 캐시 우선
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          return response || fetch(event.request);
        })
    );

  }
);

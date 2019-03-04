const CACHE_NAME = "super-soccer-v1";
var urlsToCache = [
  "/",
  "/menu.html",
  "/index.html",
  "/club.html",
  "/pages/about.html",
  "/pages/club.html",
  "/pages/favorite.html",
  "/pages/standings.html",
  "/assets/css/materialize.min.css",
  "/assets/css/style.css",
  "/assets/css/fa.css",
  "/assets/img/ico.png",
  "/assets/img/laliga.jpg",
  "/assets/js/api.js",
  "/assets/js/materialize.min.js",
  "/assets/js/fa.js",
  "/assets/js/nav.js",
  "/assets/webfonts/gs.ttf"
];
 
self.addEventListener("install", function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll(urlsToCache);
      }).then((res) => console.log(res)).catch((err) => console.log("caches open error", err))
    );
});

self.addEventListener("fetch", function(event) {
  var base_url = "https://api.football-data.org/";

  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(function(response) {
        return response || fetch (event.request);
      })
    )
  }
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
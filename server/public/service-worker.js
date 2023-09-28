const cacheName = "challenge-app";
const filesToCache = [
    "/",
    "/index.html",
    "/styles/index.css",
    "/styles/header.css",
    "/styles/main.css",
    "/styles/footer.css",
    "/styles/images/arrow-left.svg",
    "/styles/images/arrow-right.svg",
    "/styles/images/refresh.svg",
    "/scripts/index.js",
    "/locations"
];

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(filesToCache)));
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response
        }).catch(() => {
            return fetch(event.request)
        })

    );
});

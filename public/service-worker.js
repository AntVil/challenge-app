const cacheName = "challenge-app";
const filesToCache = [
    "/",
    "/index.html",
    "/styles/index.css",
    "/styles/header.css",
    "/styles/main.css",
    "/styles/footer.css",
    "/scripts/index.js"
];

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(filesToCache)));
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).then((response) => {
            let copy = response.clone();
            caches.open(cacheName).then((cache) => {
                cache.put(event.request, copy);
            });
            return response;
        }).catch(() => {
            return caches.match(event.request).then((response) => {
                return response;
            })
        })
    );
});

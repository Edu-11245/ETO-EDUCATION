const CACHE_NAME = 'ETO-v24';

const APP_SHELL = [
    './',
    './index.html',
    './dark.css',
    './manifest.json'
];

const EXTRA_SHELL = [
    './css/main.css?v=4',
    './css/courses.css',
    './css/fontawesome.min.css',
    './js/main.js?v=3',
    './courses/courses.js?v=7',
    './courses/summaries.js?v=4'
];
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL).then(() =>
                Promise.all(EXTRA_SHELL.map((url) => cache.add(url).catch(() => {})))
            ))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin !== self.location.origin) return;

    const isNavigation = event.request.mode === 'navigate' ||
        (event.request.destination === 'document');

    if (isNavigation) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return networkResponse;
                })
                .catch(() => caches.match('./index.html'))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request)
                .then((networkResponse) => {
                    if (
                        networkResponse &&
                        networkResponse.status === 200 &&
                        networkResponse.type !== 'opaque'
                    ) {
                        const responseClone = networkResponse.clone();

                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }

                    return networkResponse;
                })
                .catch(() => {
                    return caches.match('./index.html');
                });
        })
    );
});
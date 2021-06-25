const VERSION = 'v2';


self.addEventListener('install', (evt: ExtendableEvent) => {
    // @ts-ignore
    self.skipWaiting();
    evt.waitUntil((async () => {
        const cache = await caches.open(VERSION);
        await cache.add('/offline.min.html');
    })());
});


self.addEventListener('activate', (evt: ExtendableEvent) => {
    // @ts-ignore
    clients.claim();
    evt.waitUntil((async () => {
        await Promise.all((await caches.keys()).map(key => {
            if (!key.includes(VERSION))
                return caches.delete(key);
        }));
    })());
});


self.addEventListener('fetch', (evt: FetchEvent) => {
    if (evt.request.mode === 'navigate')
        evt.respondWith((async () => {
            try {
                return (await evt.preloadResponse) || (await fetch(evt.request));
            } catch {
                const cache = await caches.open(VERSION);
                return await cache.match('/offline.min.html');
            }
        })());
});


export {};

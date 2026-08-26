const CACHE_NAME = 'v2-pruebapwa-cache';
const ASSETS = [
    './index.html',
    './app.js',
    './manifest.json',
    'https://cdn-icons-png.flaticon.com/512/188/188987.png'
];

// Instalar Service Worker y guardar recursos esenciales
self.addEventListener('install', (event) => {
    self.skipWaiting(); //Activa el nuevo SW de inmediato en vez de esperar a que se cierren las pestañas viejas
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('SW: Guardando archivos estáticos en caché');
            return cache.addAll(ASSETS);
        })
    );
});

// Eliminar cachés de versiones anteriores para que los archivos actualizados no queden atrapados
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
        ).then(() => self.clients.claim())
    );
});

// Interceptar peticiones para dar soporte Offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Si el recurso está en caché (ej. index.html), lo devuelve. Si no, va a internet.
            return cachedResponse || fetch(event.request).catch(() => {
                // Fallback si internet falla y se pide una petición de datos (Módulo 2)
                return new Response(JSON.stringify({ error: "offline" }), {
                    headers: { 'Content-Type': 'application/json' }
                });
            });
        })
    );
});
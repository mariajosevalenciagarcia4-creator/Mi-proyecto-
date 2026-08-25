const CACHE_NAME = "pokedex-pwa-v1";

const ARCHIVOS = [
    "./",
        "./Index.html",
            "./style.css",
                "./app.js",
                    "./manifest.json"
                    ];


                    // INSTALACIÓN

                    self.addEventListener("install", (event) => {

                        event.waitUntil(

                                caches.open(CACHE_NAME)
                                            .then((cache) => {

                                                            return cache.addAll(ARCHIVOS);

                                                                        })

                                                                            );

                                                                                self.skipWaiting();
                                                                                });


                                                                                // ACTIVACIÓN

                                                                                self.addEventListener("activate", (event) => {

                                                                                    event.waitUntil(

                                                                                            caches.keys().then((keys) => {

                                                                                                        return Promise.all(

                                                                                                                        keys.map((key) => {

                                                                                                                                            if (key !== CACHE_NAME) {
                                                                                                                                                                    return caches.delete(key);
                                                                                                                                                                                        }

                                                                                                                                                                                                        })

                                                                                                                                                                                                                    );

                                                                                                                                                                                                                            })

                                                                                                                                                                                                                                );

                                                                                                                                                                                                                                    self.clients.claim();
                                                                                                                                                                                                                                    });


                                                                                                                                                                                                                                    // FUNCIONAMIENTO SIN CONEXIÓN

                                                                                                                                                                                                                                    self.addEventListener("fetch", (event) => {

                                                                                                                                                                                                                                        event.respondWith(

                                                                                                                                                                                                                                                caches.match(event.request)
                                                                                                                                                                                                                                                            .then((respuesta) => {

                                                                                                                                                                                                                                                                            return respuesta ||
                                                                                                                                                                                                                                                                                                fetch(event.request);

                                                                                                                                                                                                                                                                                                            })

                                                                                                                                                                                                                                                                                                                );

                                                                                                                                                                                                                                                                                                                });
// self.addEventListener('push', function(event) {
//     const data = event.data.json();
//     // self.registration.showNotification(data.title, {
//     //   body: data.body,
//     // });

//     console.log(...data);

//     self.registration.showNotification(data.title, {
//       ...data
//     }
//     );
//   });

//Configuracion para app movil
self.addEventListener('install', function(event) {
    console.log('Service Worker installing.');
    event.waitUntil(
        caches.open('my-cache').then(function(cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/script.js'
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});



  self.addEventListener('push', function(event) {
    const data = event.data.json();
    
    console.log('Push event received:', data);

    const options = {
        body: data.body,
        icon: data.icon,
        image: data.image,
        vibrate: data.vibrate,
        actions: data.actions,
        data: {
            url: data.actions[0].action // Guardamos la URL en el campo `data` para acceder a ella en `notificationclick`
        }
    };

    self.registration.showNotification(data.title, options);
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Cerrar la notificación

    const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(function(windowClients) {
            // Verificar si la URL ya está abierta
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // Si no está abierta, abrir una nueva ventana
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

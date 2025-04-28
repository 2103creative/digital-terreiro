// Nome e versão do cache
const CACHE_NAME = 'yle-axe-cache-v7';
const OFFLINE_URL = '/offline.html';

// URLs de páginas da aplicação
const APP_URLS = [
  '/',
  '/index.html',  
  '/manifest.json',
  '/service-worker.js',
  // '/offline.html', // Removido para evitar duplicidade
  '/dashboard',
  '/eventos',
  '/leitura',
  '/mensagens',
  '/frentes',
  '/limpeza',
  '/lista-compras',
  '/profile',
  '/sobre'
  // '/login' removido para não ser cacheado!
];

// Arquivos estáticos para cache prioritário
const STATIC_ASSETS = [
  '/offline.html', // Mantido apenas aqui
  '/icons/icon-144.png',
  '/icons/icon-384.png',
  '/icons/icon-48.png',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/favicon.ico',
  '/logo.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-192x192.png',
  '/pwa-maskable-512x512.png'
];

// Instala o service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        ...APP_URLS,
        ...STATIC_ASSETS
      ]);
    })
  );
  self.skipWaiting();
});

// Ativa o novo SW e remove caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Estratégia: Network First para páginas, Cache First para estáticos
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const reqUrl = new URL(event.request.url);
  if (reqUrl.origin !== self.location.origin) return;

  // Desativa cache para rotas de autenticação/login
  if (reqUrl.pathname.startsWith('/login') || reqUrl.pathname.includes('/api/auth')) {
    console.log('Não cacheando:', event.request.url);
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache First para assets
  if (STATIC_ASSETS.some((asset) => reqUrl.pathname.endsWith(asset))) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        // Corrige erro de clone: só clona se não for usado
        return fetch(event.request).then((resp) => {
          if (!resp || resp.status !== 200 || resp.type !== 'basic') return resp;
          // Clona apenas se não foi consumido
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone));
          return resp;
        });
      })
    );
    return;
  }

  // Network First para páginas
  event.respondWith(
    fetch(event.request)
      .then((resp) => {
        if (resp.status === 200) {
          // Só clona se não foi consumido
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone));
        }
        return resp;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Se for navegação, retorna offline.html
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});

// Recebe mensagens para limpar cache de login após autenticação
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'LOGIN_SUCCESS') {
    caches.open(CACHE_NAME).then(cache => {
      cache.delete('/login').then(() => {
        console.log('Cache da página de login removido');
      });
    });
  }
});

// WebSocket error handling (não bloqueia SW nem recarrega página)
self.addEventListener('error', (event) => {
  if (event.message && event.message.includes('WebSocket')) {
    console.warn('WebSocket error capturado no SW:', event.message);
    event.preventDefault();
  }
});

// Push notification (exemplo)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-144.png',
      badge: '/icons/icon-48.png',
      data: data.url || '/'
    })
  );
});

// Clica na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data);
      }
    })
  );
});
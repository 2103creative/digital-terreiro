/* eslint-disable no-restricted-globals */

// Nome e versão do cache
const CACHE_NAME = 'yle-axe-cache-v2';
const APP_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js',
  '/offline.html',
  '/placeholder.svg',
  '/dashboard',
  '/eventos',
  '/leitura',
  '/mensagens',
  '/frentes',
  '/profile',
  '/sobre'
];

// Arquivos estáticos para cache
const STATIC_ASSETS = [
  '/icons/icon-48.png',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/icons/icon-144.png',
  '/icons/icon-192.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png',
  '/icons/apple-touch/apple-icon-180.png',
  '/icons/apple-touch/apple-splash-2048-2732.png'
];

// Instala o service worker
self.addEventListener('install', (event) => {
  // Console para debug
  console.log('[Service Worker] Instalando...');
  
  // Realiza a instalação
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cache aberto');
        // Adiciona todos os URLs ao cache
        return Promise.all([
          cache.addAll(APP_URLS),
          cache.addAll(STATIC_ASSETS)
        ]);
      })
      .then(() => {
        console.log('[Service Worker] Todos recursos cacheados');
        // Ativa o worker imediatamente
        return self.skipWaiting();
      })
  );
});

// Ativa o service worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Ativando...');
  
  // Lista de caches a manter
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    // Limpa caches antigos
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Ativado e pronto para controlar clientes');
      // Toma controle de todos os clientes imediatamente
      return self.clients.claim();
    })
  );
});

// Captura e processa requisições de rede
self.addEventListener('fetch', (event) => {
  // Estratégia: Cache First, fallback para Network, depois para offline.html
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna resposta
        if (response) {
          return response;
        }
        
        // Clone a requisição porque pode ser consumida apenas uma vez
        const fetchRequest = event.request.clone();
        
        // Tenta buscar da rede
        return fetch(fetchRequest)
          .then((networkResponse) => {
            // Verifica se recebemos uma resposta válida
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone a resposta para armazenar no cache
            const responseToCache = networkResponse.clone();
            
            // Abre o cache e armazena a resposta
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch(() => {
            // Offline fallback para navegação em páginas
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Evento de mensagem para comunicação com a página
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Evento para notificações push
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body || 'Nova notificação do Ylê Axé',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Ylê Axé Xangô & Oxum',
      options
    )
  );
});

// Evento para clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

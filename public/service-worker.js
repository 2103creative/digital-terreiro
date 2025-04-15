/* eslint-disable no-restricted-globals */

// Nome e versão do cache
const CACHE_NAME = 'yle-axe-cache-v6';
const OFFLINE_URL = '/offline.html';

// URLs de páginas da aplicação
const APP_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js',
  '/offline.html',
  '/dashboard',
  '/eventos',
  '/leitura',
  '/mensagens',
  '/frentes',
  '/limpeza',
  '/lista-compras',
  '/profile',
  '/sobre',
  '/login'
];

// Arquivos estáticos para cache prioritário
const STATIC_ASSETS = [
  '/icons/icon-144.png',
  '/icons/icon-384.png',
  '/icons/icon-48.png',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/favicon.ico'
];

// Instala o service worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');
  
  // Realiza a instalação
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Cache aberto');
        
        // Adiciona todos os URLs ao cache
        return Promise.all([
          // Cache prioritário - deve ser completado para o SW ser instalado
          cache.add(OFFLINE_URL),
          
          // Cache em segundo plano - não bloqueia a instalação
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

// Estratégias de cache diferentes baseadas no tipo de recurso
const resourceType = (request) => {
  const url = new URL(request.url);
  
  if (url.pathname.startsWith('/api/')) {
    return 'api';
  }
  
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    return 'static';
  }
  
  if (request.mode === 'navigate') {
    return 'navigation';
  }
  
  return 'unknown';
};

// Captura e processa requisições de rede
self.addEventListener('fetch', (event) => {
  // Ignorar requisições de outros domínios
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Determinar tipo de recurso
  const type = resourceType(event.request);
  
  // Escolher estratégia baseada no tipo
  switch (type) {
    case 'api':
      // Network first, fallback para cache (se existente) ou erro offline
      event.respondWith(
        fetch(event.request)
          .then(response => {
            // Cache a resposta para uso offline futuro
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
            return response;
          })
          .catch(() => {
            return caches.match(event.request)
              .then(cachedResponse => {
                // Se temos versão em cache, retorne-a
                if (cachedResponse) {
                  return cachedResponse;
                }
                
                // Se não, retorne uma resposta padrão para API
                return new Response(
                  JSON.stringify({ error: 'Você está offline e este recurso não está em cache' }),
                  { 
                    status: 503,
                    headers: { 'Content-Type': 'application/json' }
                  }
                );
              });
          })
      );
      break;
      
    case 'static':
      // Cache first, fallback para network
      event.respondWith(
        caches.match(event.request)
          .then(cachedResponse => {
            return cachedResponse || fetch(event.request)
              .then(response => {
                // Cache a nova resposta
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                return response;
              });
          })
      );
      break;
      
    case 'navigation':
      // Network first, fallback para cache, fallback para offline.html
      event.respondWith(
        fetch(event.request)
          .then(response => {
            // Cache a resposta
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
            return response;
          })
          .catch(() => {
            return caches.match(event.request)
              .then(cachedResponse => {
                return cachedResponse || caches.match(OFFLINE_URL);
              });
          })
      );
      break;
      
    default:
      // Stale-while-revalidate para outros recursos
      event.respondWith(
        caches.match(event.request)
          .then(cachedResponse => {
            const fetchPromise = fetch(event.request)
              .then(networkResponse => {
                // Atualizar o cache
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
              });
            
            // Retorna o cache imediatamente, mas atualiza em segundo plano
            return cachedResponse || fetchPromise;
          })
      );
  }
});

// Evento de mensagem para comunicação com a página
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Evento para sincronização em segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

// Função para sincronizar mensagens
const syncMessages = async () => {
  try {
    // Aqui você implementaria a lógica para enviar mensagens pendentes
    console.log('[Service Worker] Sincronizando mensagens...');
    
    return self.registration.showNotification('Ylê Axé', {
      body: 'Suas mensagens foram sincronizadas com sucesso!',
      icon: '/icons/icon-144.png'
    });
  } catch (error) {
    console.error('[Service Worker] Erro ao sincronizar:', error);
  }
};

// Evento para notificações push
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nova notificação do Ylê Axé',
      icon: '/icons/icon-144.png',
      badge: '/icons/icon-144.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/dashboard',
        timestamp: new Date().getTime()
      },
      actions: [
        {
          action: 'view',
          title: 'Ver agora'
        },
        {
          action: 'close',
          title: 'Mais tarde'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Ylê Axé Xangô & Oxum',
        options
      )
    );
  } catch (error) {
    console.error('[Service Worker] Erro ao processar notificação push:', error);
  }
});

// Evento para clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  // Abrir página apropriada
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(windowClients => {
        // Verificar se já existe uma janela aberta e focar nela
        for (const client of windowClients) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Se não tem janela aberta, abrir uma nova
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
  );
});

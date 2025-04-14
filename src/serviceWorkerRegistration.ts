// Este código opcional é usado para registrar um service worker.
// Permite que o aplicativo carregue mais rápido em visitas subsequentes e fornece capacidades offline.

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/) ||
    window.location.hostname.match(/^192\.168\.\d{1,3}\.\d{1,3}$/)
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if ('serviceWorker' in navigator) {
    // O construtor de URL está disponível em todos os navegadores que suportam SW
    const publicUrl = new URL(import.meta.env.BASE_URL || '/', window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Nosso service worker não funcionará se BASE_URL estiver em uma origem diferente
      // da origem de nossa página. Isso pode acontecer se um CDN for usado para
      // servir ativos; veja https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${import.meta.env.BASE_URL || '/'}service-worker.js`;

      if (isLocalhost) {
        // Isso está rodando no localhost. Vamos verificar se um service worker ainda existe ou não.
        checkValidServiceWorker(swUrl, config);

        // Adicione alguns logs adicionais para localhost, apontando para desenvolvedores recursos.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'Este aplicativo web está sendo servido primeiro pelo cache, ' +
              'seguido pela network quando disponível.'
          );
        });
      } else {
        // Não é localhost. Apenas registre o service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker registrado com sucesso:', swUrl);
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Neste ponto, o conteúdo pré-cacheado atualizado foi buscado,
              // mas o service worker anterior ainda servirá o conteúdo mais antigo
              // até que todas as guias do cliente sejam fechadas.
              console.log(
                'Novo conteúdo está disponível e será usado quando todas ' +
                  'as guias para esta página forem fechadas.'
              );
              
              // Exibir notificação de atualização para o usuário
              const event = new CustomEvent('swUpdate', { detail: registration });
              window.dispatchEvent(event);

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // Neste ponto, tudo foi pré-cacheado.
              // É o momento perfeito para exibir uma mensagem
              // "O conteúdo está em cache para uso offline."
              console.log('Conteúdo em cache para uso offline.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Erro durante o registro do service worker:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  // Verifica se o service worker pode ser encontrado. Se não puder, recarrega a página.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Garante que o service worker existe e que estamos realmente obtendo um arquivo JS.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // Nenhum service worker encontrado. Provavelmente um aplicativo diferente. Recarregue a página.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker encontrado. Prossiga normalmente.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('Nenhuma conexão com a internet encontrada. Aplicativo rodando no modo offline.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// Função para notificar o usuário sobre atualizações e oferecer a opção de recarregar
export function listenForUpdates(callback?: () => void) {
  window.addEventListener('swUpdate', (event: any) => {
    const registration = event.detail;
    
    // Armazenar a informação de que há uma atualização disponível
    localStorage.setItem('swUpdateAvailable', 'true');
    
    // Execute o callback opcional sem mostrar prompt
    if (callback) {
      callback();
    }
    
    // Adicionar um pequeno indicador de atualização no canto da tela
    const updateIndicator = document.createElement('div');
    updateIndicator.id = 'pwa-update-indicator';
    updateIndicator.style.position = 'fixed';
    updateIndicator.style.bottom = '20px';
    updateIndicator.style.right = '20px';
    updateIndicator.style.backgroundColor = '#3b82f6';
    updateIndicator.style.color = 'white';
    updateIndicator.style.padding = '8px 16px';
    updateIndicator.style.borderRadius = '4px';
    updateIndicator.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    updateIndicator.style.cursor = 'pointer';
    updateIndicator.style.zIndex = '9999';
    updateIndicator.textContent = 'Atualização disponível';
    
    updateIndicator.addEventListener('click', () => {
      // Se houver um novo worker esperando, force a atualização
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      
      // Recarregue a página para carregar o novo service worker
      window.location.reload();
    });
    
    // Adicionar o indicador ao body somente se ainda não existir
    if (!document.getElementById('pwa-update-indicator')) {
      document.body.appendChild(updateIndicator);
    }
  });
} 
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { register, listenForUpdates } from './serviceWorkerRegistration';

// Adiciona tipos para a janela global
declare global {
  interface Window {
    installPWA: () => Promise<any>;
    isPWAInstalled: () => boolean;
    deferredPromptEvent?: any;
  }
}

// Renderiza a aplicação React
createRoot(document.getElementById("root")!).render(<App />);

// Registra service worker para suporte a PWA
register({
  onSuccess: () => console.log('PWA disponível para uso offline'),
  onUpdate: (registration) => {
    console.log('Nova versão disponível');
    // Não forçar a atualização, apenas notificar o usuário sutilmente
    window.dispatchEvent(new CustomEvent('swUpdate', { detail: registration }));
  },
});

// Escute por atualizações do service worker apenas se o usuário
// não estiver em uma sessão crítica
if (!window.location.pathname.includes('/admin')) {
  listenForUpdates();
}

// Detector de instalação PWA
const pwaInstallEventName = 'pwaInstallAvailable';

// Intercepta o evento de instalação
window.addEventListener('beforeinstallprompt', (e) => {
  // Previne que o Chrome mostre automaticamente o prompt
  e.preventDefault();
  
  // Armazena o evento para uso posterior
  window.deferredPromptEvent = e;
  
  // Notifica a aplicação que o app pode ser instalado
  window.dispatchEvent(new CustomEvent(pwaInstallEventName));
  
  // Registra um callback para verificar se o usuário aceita ou rejeita a instalação
  window.deferredPromptEvent.userChoice.then((choiceResult: { outcome: string }) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('Usuário aceitou a instalação da PWA');
      // Limpa o prompt pois já foi usado
      window.deferredPromptEvent = undefined;
    } else {
      console.log('Usuário rejeitou a instalação da PWA');
    }
  });
});

// Hook para verificar se o app já está instalado
window.addEventListener('appinstalled', () => {
  console.log('PWA foi instalada pelo usuário');
  // Limpa o prompt
  window.deferredPromptEvent = undefined;
});

// Exporta a função para instalar o PWA
window.installPWA = () => {
  if (window.deferredPromptEvent) {
    // Mostrar o prompt
    window.deferredPromptEvent.prompt();
    
    // Retornar a promise para o resultado da escolha do usuário
    return window.deferredPromptEvent.userChoice;
  }
  return Promise.reject('Não foi possível instalar o aplicativo agora.');
};

// Detecta se o aplicativo já está sendo executado no modo instalado
window.isPWAInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         document.referrer.includes('android-app://');
};

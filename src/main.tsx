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

// === EVITA SW COM CACHE ANTIGO EM DEV ===
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(r => r.unregister());
  });
  caches.keys().then(keys => {
    keys.forEach(key => caches.delete(key));
  });
}

// === RENDERIZA APP ===
createRoot(document.getElementById("root")!).render(<App />);

// === REGISTRA SERVICE WORKER ===
register({
  onSuccess: () => console.log('PWA disponível para uso offline'),
  onUpdate: (registration) => {
    console.log('Nova versão disponível');
    window.dispatchEvent(new CustomEvent('swUpdate', { detail: registration }));
  },
});
listenForUpdates();

// === EVENTOS DE INSTALAÇÃO PWA ===
const pwaInstallEventName = 'pwaInstallAvailable';

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPromptEvent = e;
  window.dispatchEvent(new CustomEvent(pwaInstallEventName));
  window.deferredPromptEvent.userChoice.then((choiceResult: { outcome: string }) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('Usuário aceitou a instalação da PWA');
      window.deferredPromptEvent = undefined;
    } else {
      console.log('Usuário rejeitou a instalação da PWA');
    }
  });
});

window.addEventListener('appinstalled', () => {
  console.log('PWA foi instalada pelo usuário');
  window.deferredPromptEvent = undefined;
});

window.installPWA = () => {
  if (window.deferredPromptEvent) {
    window.deferredPromptEvent.prompt();
    return window.deferredPromptEvent.userChoice;
  }
  return Promise.reject('Não foi possível instalar o aplicativo agora.');
};

window.isPWAInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         document.referrer.includes('android-app://');
};

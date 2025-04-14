import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { register, listenForUpdates } from './serviceWorkerRegistration';

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA support
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

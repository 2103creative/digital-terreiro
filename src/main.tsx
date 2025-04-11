
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { register } from './registerServiceWorker';

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA support
register({
  onSuccess: () => console.log('PWA is now available for offline use'),
  onUpdate: () => console.log('New content is available; please refresh'),
});

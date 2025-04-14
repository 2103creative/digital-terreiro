import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function UpdateIndicator() {
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  
  useEffect(() => {
    // Verificar se há uma atualização disponível no localStorage
    const hasUpdate = localStorage.getItem('swUpdateAvailable') === 'true';
    if (hasUpdate) {
      setShowUpdateButton(true);
    }
    
    // Adicionar listener para eventos de atualização do service worker
    const handleSwUpdate = () => {
      localStorage.setItem('swUpdateAvailable', 'true');
      setShowUpdateButton(true);
    };
    
    window.addEventListener('swUpdate', handleSwUpdate);
    
    return () => {
      window.removeEventListener('swUpdate', handleSwUpdate);
    };
  }, []);
  
  const handleUpdate = () => {
    // Limpar flag de atualização
    localStorage.removeItem('swUpdateAvailable');
    // Recarregar a página para aplicar a atualização
    window.location.reload();
  };
  
  if (!showUpdateButton) return null;
  
  return (
    <button
      onClick={handleUpdate}
      className="fixed bottom-16 md:bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg z-50 flex items-center justify-center"
      title="Nova atualização disponível"
    >
      <RefreshCw className="h-4 w-4" />
    </button>
  );
} 
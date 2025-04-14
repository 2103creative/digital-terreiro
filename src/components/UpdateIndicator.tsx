import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function UpdateIndicator() {
  // Forçando o componente a nunca mostrar o botão de atualização
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  
  useEffect(() => {
    // Removendo a verificação de atualização disponível
    localStorage.removeItem('swUpdateAvailable');
    
    // Função vazia para o listener
    const handleSwUpdate = () => {
      // Não fazemos nada para não mostrar o botão
    };
    
    window.addEventListener('swUpdate', handleSwUpdate);
    
    return () => {
      window.removeEventListener('swUpdate', handleSwUpdate);
    };
  }, []);
  
  // Retornando null para não renderizar nada
  return null;
} 
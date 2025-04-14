import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface PWAInstallPromptProps {
  position?: 'top' | 'bottom';
  dismissable?: boolean;
}

const PWAInstallPrompt = ({ 
  position = 'bottom', 
  dismissable = true 
}: PWAInstallPromptProps) => {
  const [showPrompt, setShowPrompt] = useState(false);
  
  useEffect(() => {
    // Verificar se já está instalado
    if (window.isPWAInstalled()) {
      return; // Não mostrar o prompt se já estiver instalado
    }
    
    // Evento personalizado criado no main.tsx
    const handleInstallAvailable = () => {
      // Verificar preferência do usuário no localStorage
      const dismissed = localStorage.getItem('pwaPromptDismissed');
      if (dismissed === 'true' && dismissable) {
        return;
      }
      
      setShowPrompt(true);
    };
    
    // Ouvir o evento de disponibilidade de instalação
    window.addEventListener('pwaInstallAvailable', handleInstallAvailable);
    
    // Se o evento já foi disparado antes, verificar deferredPrompt
    if (window.deferredPromptEvent) {
      handleInstallAvailable();
    }
    
    return () => {
      window.removeEventListener('pwaInstallAvailable', handleInstallAvailable);
    };
  }, [dismissable]);
  
  const handleInstall = async () => {
    try {
      await window.installPWA();
      setShowPrompt(false);
    } catch (error) {
      console.error('Erro ao tentar instalar PWA:', error);
    }
  };
  
  const handleDismiss = () => {
    setShowPrompt(false);
    // Salvar preferência do usuário
    if (dismissable) {
      localStorage.setItem('pwaPromptDismissed', 'true');
    }
  };
  
  if (!showPrompt) return null;
  
  return (
    <div className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 p-4 z-50`}>
      <Card className="mx-auto max-w-md animate-slide-up shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-primary rounded-full p-2">
              <Download className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Instale o Ylê Axé</p>
              <p className="text-xs text-muted-foreground">Adicione à tela inicial para acesso rápido</p>
            </div>
            <div className="flex gap-2">
              {dismissable && (
                <Button variant="ghost" size="sm" onClick={handleDismiss} className="text-xs h-8">
                  Agora não
                </Button>
              )}
              <Button size="sm" onClick={handleInstall} className="text-xs h-8">
                Instalar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt; 
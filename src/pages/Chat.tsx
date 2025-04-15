import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatComunitario from '@/components/ChatComunitario';
import DashboardHeader from '@/components/DashboardHeader';
import DesktopSidebar from '@/components/DesktopSidebar';
import MobileNav from '@/components/MobileNav';
import { useToast } from '@/hooks/use-toast';
import { Heart, ArrowLeft } from 'lucide-react';

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é um dispositivo móvel
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar tamanho inicial
    checkIfMobile();
    
    // Adicionar listener para mudanças de tamanho
    window.addEventListener('resize', checkIfMobile);
    
    // Aplicar classe no body quando em mobile para evitar scroll
    if (isMobile) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMobile]);

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      toast({
        title: "Acesso negado",
        description: "Por favor, faça login para acessar esta página",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  // Layout para dispositivos móveis
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col h-full">
        <div className="border-b p-3 flex items-center">
          <button 
            onClick={() => window.history.back()} 
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold ml-2">Chat Comunitário</h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatComunitario />
        </div>
      </div>
    );
  }

  // Layout para desktop
  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <DesktopSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-4">
          <div className="flex items-center mb-6">
            <Heart className="h-6 w-6 mr-2 text-pink-600" />
            <div>
              <h1 className="text-2xl font-bold">Bate Papo</h1>
              <p className="text-sm text-gray-500">
                Comunicação em tempo real com a comunidade
              </p>
            </div>
          </div>
          <div className="h-[calc(100vh-12rem)]">
            <ChatComunitario />
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Chat; 
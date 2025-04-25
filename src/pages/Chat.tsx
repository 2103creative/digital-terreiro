import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatComunitario from '@/components/ChatComunitario';
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
        <div className="border-b p-2 flex items-center">
          <button 
            onClick={() => window.history.back()} 
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="font-medium ml-2 text-base">Chat Comunitário</h1>
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
      <div className="flex-1">
        <main className="container mx-auto px-2 py-3 max-w-lg">
          <div className="flex items-center mb-3">
            <Heart className="h-5 w-5 mr-2 text-pink-600" />
            <h1 className="text-xl font-semibold">Bate Papo</h1>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-2 md:p-3">
            <ChatComunitario />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat; 
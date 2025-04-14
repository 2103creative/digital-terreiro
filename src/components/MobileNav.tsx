import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Home, 
  BookOpen, 
  CalendarDays, 
  FileText, 
  MessageSquare, 
  User, 
  Info,
  Settings,
  Calendar,
  Brush
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

// Este componente agora está desativado em favor do menu dropdown
// Mantido apenas para referência caso precise voltar à navegação inferior
const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Verificar mensagens não lidas
  useEffect(() => {
    try {
      const handleMessageUpdate = (event: any) => {
        const { count } = event.detail;
        setUnreadMessages(count);
      };

      // Verificar localStorage ao inicializar
      const checkStoredMessages = () => {
        const storedData = localStorage.getItem("yle-axe-messages");
        if (storedData) {
          const readStatus = JSON.parse(storedData);
          // A contagem é baseada no componente de mensagens
          const messagesData = [1, 2, 3, 4]; // IDs de mensagens fixados por simplicidade
          const unreadCount = messagesData.filter(id => !readStatus[id]).length;
          setUnreadMessages(unreadCount);
        }
      };

      window.addEventListener('message-update', handleMessageUpdate);
      checkStoredMessages();

      return () => {
        window.removeEventListener('message-update', handleMessageUpdate);
      };
    } catch (error) {
      console.error("Erro ao verificar mensagens:", error);
    }
  }, []);

  // Navegação
  const navItems = [
    {
      icon: Home,
      label: "Início",
      path: "/dashboard",
    },
    {
      icon: Calendar,
      label: "Eventos",
      path: "/eventos",
    },
    {
      icon: FileText,
      label: "Frentes",
      path: "/frentes",
    },
    {
      icon: BookOpen,
      label: "Leitura",
      path: "/leitura",
    },
    {
      icon: Brush,
      label: "Limpeza",
      path: "/limpeza",
    },
    {
      icon: MessageSquare,
      label: "Mensagens",
      path: "/mensagens",
      badge: unreadMessages > 0 ? unreadMessages : null,
    }
  ];

  // Itens adicionais
  const secondaryItems = [
    {
      icon: User,
      label: "Perfil",
      path: "/profile",
    },
    {
      icon: Info,
      label: "Sobre",
      path: "/sobre",
    }
  ];

  // Este componente está desativado
  return null;
};

export default MobileNav;

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Home, 
  BookOpen, 
  CalendarDays, 
  FileText, 
  MessageSquare, 
  User, 
  Info
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

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
      icon: FileText,
      label: "Frentes",
      path: "/frentes",
    },
    {
      icon: CalendarDays,
      label: "Eventos",
      path: "/eventos",
    },
    {
      icon: BookOpen,
      label: "Leitura",
      path: "/leitura",
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

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 py-2 px-3 bottom-nav-admin">
      <div className="grid grid-cols-6 gap-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-1 text-[10px] rounded transition-colors relative",
              isActive(item.path)
                ? "text-primary"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span>{item.label}</span>
            {item.badge && (
              <span className="absolute top-0 right-1/4 h-4 w-4 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
        
        {secondaryItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-1 text-[10px] rounded transition-colors",
              location.pathname === item.path
                ? "text-primary"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;

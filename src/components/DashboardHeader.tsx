import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Settings, 
  LogOut, 
  Users, 
  Calendar, 
  BookOpen, 
  Info, 
  FileEdit, 
  Cog, 
  Search,
  Command,
  HelpCircle,
  Menu,
  MessageSquare,
  X,
  Home,
  Heart,
  PawPrint,
  Brush,
  FileText,
  User,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessageUpdates } from "./MessagesContent";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { AVATAR_UPDATED_EVENT } from "./ProfileContent";
import { Input } from "@/components/ui/input";

const DashboardHeader = () => {
  const messageCount = useMessageUpdates();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const [avatar, setAvatar] = useState("/placeholder-avatar.png");
  const [isFullscreenMenuOpen, setIsFullscreenMenuOpen] = useState(false);

  useEffect(() => {
    // Get user avatar from localStorage
    const loadUserAvatar = () => {
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
          const userData = JSON.parse(userString);
          if (userData.avatar) {
            setAvatar(userData.avatar);
          }
        } catch (error) {
          console.error("Erro ao carregar avatar:", error);
        }
      }
    };

    loadUserAvatar();

    // Escutar o evento de atualização de avatar
    const handleAvatarUpdate = (event: CustomEvent) => {
      const { avatar: newAvatar } = event.detail;
      setAvatar(newAvatar);
    };

    window.addEventListener(AVATAR_UPDATED_EVENT, handleAvatarUpdate as EventListener);

    // Prevenir o scroll quando o menu estiver aberto
    if (isFullscreenMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener(AVATAR_UPDATED_EVENT, handleAvatarUpdate as EventListener);
      document.body.style.overflow = '';
    };
  }, [isFullscreenMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNotificationClick = () => {
    navigate("/mensagens");
  };

  const navigateToAdmin = (path: string) => {
    navigate(`/admin/${path}`);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsFullscreenMenuOpen(false);
  };

  // Obter iniciais do nome do usuário para o avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Menu items for regular users
  const regularMenuItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: FileText,
      label: "Frentes",
      path: "/frentes",
    },
    {
      icon: Calendar,
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
      badge: messageCount > 0 ? messageCount : null,
    },
    {
      icon: Brush,
      label: "Limpeza",
      path: "/limpeza",
    },
    {
      icon: ShoppingCart,
      label: "Compras",
      path: "/lista-compras",
    },
    {
      icon: Heart,
      label: "Chat Comunitário",
      path: "/chat",
    },
    {
      icon: Info,
      label: "Sobre",
      path: "/sobre",
    },
    {
      icon: User,
      label: "Meu Perfil",
      path: "/profile",
    }
  ];

  // Menu items for administrators
  const adminMenuItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: Users,
      label: "Usuários",
      path: "/admin/usuarios",
    },
    {
      icon: FileText,
      label: "Frentes",
      path: "/admin/frentes",
    },
    {
      icon: ShoppingCart,
      label: "Compras",
      path: "/admin/mantimentos",
    },
    {
      icon: Calendar,
      label: "Eventos",
      path: "/admin/eventos",
    },
    {
      icon: BookOpen,
      label: "Leitura",
      path: "/admin/leitura",
    },
    {
      icon: Brush,
      label: "Limpeza",
      path: "/admin/limpeza",
    },
    {
      icon: MessageSquare,
      label: "Mensagens",
      path: "/admin/mensagens",
      badge: messageCount > 0 ? messageCount : null,
    },
    {
      icon: Heart,
      label: "Chat Comunitário",
      path: "/chat",
    },
    {
      icon: Info,
      label: "Sobre",
      path: "/admin/sobre",
    },
    {
      icon: User,
      label: "Meu Perfil",
      path: "/profile",
    }
  ];

  // Seleciona os itens de menu com base no tipo de usuário
  const menuItems = isAdmin ? adminMenuItems : regularMenuItems;

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center h-12 px-3 md:px-4 bg-white border-b border-gray-200">
        <div className="md:hidden mr-2">
          <button 
            className="h-8 w-8 flex items-center justify-center text-gray-500"
            onClick={() => setIsFullscreenMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 flex items-center">
          <div className="relative w-full md:w-80 max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 md:pl-3 pointer-events-none">
              <Search className="h-3 w-3 md:h-3.5 md:w-3.5 text-gray-400" />
            </div>
            <Input 
              type="search" 
              placeholder="Pesquisar (Ctrl + G)" 
              className="pl-7 md:pl-9 pr-3 md:pr-4 py-1 h-7 md:h-8 text-[10px] md:text-xs border-gray-200 rounded focus:ring-1 focus:ring-gray-300 focus:border-gray-300" 
            />
            <div className="absolute inset-y-0 right-0 hidden md:flex items-center pr-3 pointer-events-none">
              <div className="flex items-center justify-center w-4 h-4 bg-gray-100 rounded text-[10px] text-gray-500 border border-gray-200">
                <Command className="h-2.5 w-2.5" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 md:gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 md:h-8 md:w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700 hidden md:flex"
            onClick={() => {}}
            aria-label="Ajuda"
          >
            <HelpCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7 md:h-8 md:w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700 relative"
            onClick={handleNotificationClick}
            aria-label="Notificações"
          >
            <Bell className="h-3.5 w-3.5 md:h-4 md:w-4" />
            {messageCount > 0 && (
              <span className="absolute -top-1 -right-1 h-3 w-3 md:h-3.5 md:w-3.5 rounded-full bg-red-500 text-[6px] md:text-[8px] text-white flex items-center justify-center">
                {messageCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-7 md:h-8 px-1 md:px-1.5 rounded-md hover:bg-gray-100" aria-label="Perfil e Configurações">
                <div className="flex items-center">
                  <Avatar className="h-5 w-5 md:h-6 md:w-6 mr-1 md:mr-1.5">
                    <AvatarImage src={avatar} alt={user?.name || "Usuário"} />
                    <AvatarFallback className="text-[8px] md:text-[10px]">{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                  </Avatar>
                  <span className="text-[10px] md:text-xs text-gray-700 font-normal hidden md:inline-block">
                    {isAdmin ? "Ajuda" : "A"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 md:w-56 text-[10px] md:text-xs">
              <DropdownMenuLabel className="text-[10px] md:text-xs font-normal text-gray-500">
                <div className="flex flex-col space-y-1">
                  <p className="text-[10px] md:text-xs font-medium text-gray-700">{user?.name}</p>
                  <p className="text-[8px] md:text-xs text-gray-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => navigate('/profile')}
                className="text-[10px] md:text-xs py-1.5 px-2"
              >
                <Settings className="mr-2 h-3 w-3 md:h-3.5 md:w-3.5" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem 
                  onClick={() => navigate('/configuracoes')}
                  className="text-[10px] md:text-xs py-1.5 px-2"
                >
                  <Cog className="mr-2 h-3 w-3 md:h-3.5 md:w-3.5" />
                  <span>Configurações</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-[10px] md:text-xs py-1.5 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
              >
                <LogOut className="mr-2 h-3 w-3 md:h-3.5 md:w-3.5" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Fullscreen Menu for Mobile */}
      {isFullscreenMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={avatar} alt={user?.name || "Usuário"} />
                  <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm text-gray-900">{user?.name || "Usuário"}</p>
                  <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrador' : 'Membro do Terreiro'}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsFullscreenMenuOpen(false)}
                className="text-gray-500 p-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          
            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavigate(item.path)}
                      className="flex items-center w-full text-gray-700 hover:text-blue-600 py-2 px-1"
                    >
                      <item.icon className="h-5 w-5 mr-4" />
                      <span className="text-base font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-2 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
                
                {/* Settings and Logout */}
                <li className="mt-48">
                  <div className="flex items-center text-gray-500 py-2 px-1 space-x-4">
                    <button
                      onClick={() => handleNavigate('/configuracoes')}
                      className="flex items-center"
                    >
                      <Settings className="h-5 w-5 mr-2" />
                      <span className="text-base font-medium">Configurações</span>
                    </button>
                    <div>|</div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      <span className="text-base font-medium">Sair</span>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHeader;

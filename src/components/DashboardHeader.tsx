import { useNavigate } from "react-router-dom";
import { Bell, Settings, LogOut, Users, Calendar, BookOpen, Info, FileEdit, Cog } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useMessageUpdates } from "./MessagesContent";
import { useState, useEffect } from "react";

const DashboardHeader = () => {
  const messageCount = useMessageUpdates();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar se o usuário é administrador
  useEffect(() => {
    const checkAdminStatus = () => {
      // Em um app real, isso seria verificado através de um token JWT ou outro mecanismo seguro
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const user = JSON.parse(userString);
          setIsAdmin(user.isAdmin === true);
        } catch (e) {
          console.error('Erro ao verificar status de administrador:', e);
        }
      }
    };

    checkAdminStatus();
    
    // Para fins de demonstração, vamos simular que o usuário é admin após 1 segundo
    // Remova esta parte em um aplicativo real e use apenas a verificação acima
    const timer = setTimeout(() => {
      setIsAdmin(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/");
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta",
    });
  };

  const handleNotificationClick = () => {
    navigate("/mensagens");
  };

  const navigateToAdmin = (path: string) => {
    navigate(`/admin/${path}`);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white shadow-sm border-b border-gray-200">
      <div>
        <h1 className="text-lg font-medium text-gray-800">Ylê Axé Xangô & Oxum</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          onClick={handleNotificationClick}
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
          {messageCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-[10px] text-white flex items-center justify-center">
              {messageCount}
            </span>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-800 hover:bg-gray-100" aria-label="Perfil e Configurações">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 rounded-md shadow-md">
            {isAdmin && (
              <>
                <DropdownMenuLabel className="text-sm font-medium text-gray-800">Administração</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigateToAdmin('usuarios')} className="text-sm text-gray-700 hover:bg-gray-100">
                    <Users className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Gerenciar Usuários</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateToAdmin('frentes')} className="text-sm text-gray-700 hover:bg-gray-100">
                    <FileEdit className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Editar Frentes</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateToAdmin('eventos')} className="text-sm text-gray-700 hover:bg-gray-100">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Gerenciar Eventos</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateToAdmin('leitura')} className="text-sm text-gray-700 hover:bg-gray-100">
                    <BookOpen className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Gerenciar Leitura</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateToAdmin('sobre')} className="text-sm text-gray-700 hover:bg-gray-100">
                    <Info className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Editar Sobre</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-gray-200" />
              </>
            )}
            
            <DropdownMenuItem onClick={() => navigate('/configuracoes')} className="text-sm text-gray-700 hover:bg-gray-100">
              <Cog className="mr-2 h-4 w-4 text-gray-500" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem 
              className="text-sm text-red-600 hover:bg-red-50 focus:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;

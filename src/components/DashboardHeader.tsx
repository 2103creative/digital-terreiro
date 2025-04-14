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
    <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-background/95 backdrop-blur border-b">
      <div>
        <h1 className="text-xl font-bold">Ylê Axé Xangô & Oxum</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={handleNotificationClick}
          aria-label="Notificações"
        >
          <Bell className="h-5 w-5" />
          {messageCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center">
              {messageCount}
            </span>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Perfil e Configurações">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {isAdmin && (
              <>
                <DropdownMenuLabel>Administração</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigateToAdmin('usuarios')}>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Gerenciar Usuários</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateToAdmin('frentes')}>
                    <FileEdit className="mr-2 h-4 w-4" />
                    <span>Editar Frentes</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateToAdmin('eventos')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Gerenciar Eventos</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateToAdmin('leitura')}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Gerenciar Leitura</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateToAdmin('sobre')}>
                    <Info className="mr-2 h-4 w-4" />
                    <span>Editar Sobre</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
            
            <DropdownMenuItem onClick={() => navigate('/configuracoes')}>
              <Cog className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
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

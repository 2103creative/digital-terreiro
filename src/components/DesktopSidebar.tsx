
import { useLocation, useNavigate } from "react-router-dom";
import { Home, User, Layers, Info, Calendar, BookOpen, MessageSquare, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const DesktopSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
    toast({
      title: "Saiu com sucesso",
      description: "Você foi desconectado da sua conta",
    });
  };

  const mainMenuItems = [
    {
      label: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      label: "Perfil",
      icon: User,
      path: "/profile",
    },
    {
      label: "Eventos",
      icon: Calendar,
      path: "/eventos",
    },
    {
      label: "Leitura",
      icon: BookOpen,
      path: "/leitura",
    },
    {
      label: "Frentes",
      icon: Layers,
      path: "/frentes",
    },
    {
      label: "Mensagens",
      icon: MessageSquare,
      path: "/mensagens",
    },
  ];

  const secondaryMenuItems = [
    {
      label: "Configurações",
      icon: Settings,
      path: "/profile",
    },
    {
      label: "Sobre",
      icon: Info,
      path: "/sobre",
    },
  ];

  const MenuItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <li>
        <button
          onClick={() => navigate(item.path)}
          className={cn(
            "flex items-center w-full px-4 py-2 rounded-md transition-colors",
            isActive 
              ? "bg-primary/10 text-primary font-medium" 
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <item.icon className="h-5 w-5 mr-3" />
          <span>{item.label}</span>
        </button>
      </li>
    );
  };

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-background">
      <div className="p-6">
        <h1 className="text-xl font-bold">Ylê Axé Xangô & Oxum</h1>
        <p className="text-sm text-muted-foreground">Terreiro de Umbanda e Nação</p>
      </div>

      <div className="px-4 mb-6">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Maria da Silva</p>
            <p className="text-xs text-muted-foreground">Médium em Desenvolvimento</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {mainMenuItems.map((item) => (
            <MenuItem key={item.path} item={item} />
          ))}
        </ul>

        <div className="mt-6 pt-6 border-t">
          <ul className="space-y-1">
            {secondaryMenuItems.map((item) => (
              <MenuItem key={item.path} item={item} />
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default DesktopSidebar;

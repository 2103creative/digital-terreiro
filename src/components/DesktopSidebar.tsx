import { useLocation, useNavigate } from "react-router-dom";
import { Home, User, Layers, Info, Calendar, BookOpen, MessageSquare, Brush, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const DesktopSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

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
      label: "Limpeza",
      icon: Brush,
      path: "/limpeza",
    },
    {
      label: "Mensagens",
      icon: MessageSquare,
      path: "/mensagens",
    },
  ];

  const secondaryMenuItems = [
    {
      label: "Sobre",
      icon: Info,
      path: "/sobre",
    },
    {
      label: "Demo Botões",
      icon: Square,
      path: "/botao-demo",
    },
  ];

  const MenuItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <li>
        <button
          onClick={() => navigate(item.path)}
          className={cn(
            "flex items-center w-full px-4 py-2.5 text-sm rounded-md transition-colors",
            isActive 
              ? "bg-blue-50 text-blue-600 font-medium" 
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          )}
        >
          <item.icon className={cn(
            "h-5 w-5 mr-3",
            isActive ? "text-blue-600" : "text-gray-500"
          )} />
          <span>{item.label}</span>
        </button>
      </li>
    );
  };

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-lg font-medium text-gray-800">Ylê Axé Xangô & Oxum</h1>
        <p className="text-xs text-gray-500 mt-1">Terreiro de Umbanda e Nação</p>
      </div>

      <div className="px-3 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Maria da Silva</p>
            <p className="text-xs text-gray-500">Médium em Desenvolvimento</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-1 px-2">
          <p className="text-xs uppercase font-medium text-gray-500 mb-2">Menu Principal</p>
        </div>
        <ul className="space-y-1">
          {mainMenuItems.map((item) => (
            <MenuItem key={item.path} item={item} />
          ))}
        </ul>

        <div className="mt-6 mb-1 px-2">
          <p className="text-xs uppercase font-medium text-gray-500 mb-2">Informações</p>
        </div>
        <ul className="space-y-1">
          {secondaryMenuItems.map((item) => (
            <MenuItem key={item.path} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default DesktopSidebar;

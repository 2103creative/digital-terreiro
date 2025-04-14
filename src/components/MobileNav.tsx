import { useLocation, useNavigate } from "react-router-dom";
import { Home, User, FileText, Info, Brush, Calendar, BookOpen, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const tabs = [
    {
      label: "Início",
      icon: Home,
      path: "/dashboard",
    },
    {
      label: "Frentes",
      icon: FileText,
      path: "/frentes",
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
      label: "Limpeza",
      icon: Brush,
      path: "/limpeza",
    },
    {
      label: "Mensagens",
      icon: MessageSquare,
      path: "/mensagens",
    },
    {
      label: "Perfil",
      icon: User,
      path: "/profile",
    },
    {
      label: "Sobre",
      icon: Info,
      path: "/sobre",
    },
  ];

  // Dividir em duas linhas para melhor visualização em mobile
  const firstRow = tabs.slice(0, 4);
  const secondRow = tabs.slice(4);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-md md:hidden">
      <div className="grid grid-cols-4 gap-1 p-1">
        {firstRow.map((tab) => {
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.path}
              className="relative flex flex-col items-center justify-center py-2"
              onClick={() => navigate(tab.path)}
            >
              {isActive && (
                <div className="absolute top-0 w-6 h-0.5 bg-blue-600 rounded"></div>
              )}
              <div className={cn(
                "flex flex-col items-center justify-center",
                isActive ? "text-blue-600" : "text-gray-400"
              )}>
                <tab.icon strokeWidth={isActive ? 2 : 1.5} className={cn(
                  "h-5 w-5 mb-1",
                  isActive ? "text-blue-600" : "text-gray-400"
                )} />
                <span className={cn(
                  "text-[10px]",
                  isActive ? "font-medium" : "font-normal"
                )}>
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="grid grid-cols-4 gap-1 p-1 pt-0">
        {secondRow.map((tab) => {
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.path}
              className="relative flex flex-col items-center justify-center py-2"
              onClick={() => navigate(tab.path)}
            >
              {isActive && (
                <div className="absolute top-0 w-6 h-0.5 bg-blue-600 rounded"></div>
              )}
              <div className={cn(
                "flex flex-col items-center justify-center",
                isActive ? "text-blue-600" : "text-gray-400"
              )}>
                <tab.icon strokeWidth={isActive ? 2 : 1.5} className={cn(
                  "h-5 w-5 mb-1",
                  isActive ? "text-blue-600" : "text-gray-400"
                )} />
                <span className={cn(
                  "text-[10px]",
                  isActive ? "font-medium" : "font-normal"
                )}>
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;

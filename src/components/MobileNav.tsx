import { useLocation, useNavigate } from "react-router-dom";
import { Home, User, BookOpen, Info, Brush } from "lucide-react";
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
      label: "Perfil",
      icon: User,
      path: "/profile",
    },
    {
      label: "Frentes",
      icon: BookOpen,
      path: "/frentes",
    },
    {
      label: "Limpeza",
      icon: Brush,
      path: "/limpeza",
    },
    {
      label: "Sobre",
      icon: Info,
      path: "/sobre",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-sm md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.path}
              className="relative flex flex-col items-center justify-center w-full h-full"
              onClick={() => navigate(tab.path)}
            >
              {isActive && (
                <div className="absolute top-0 w-12 h-1 rounded-b-sm bg-blue-600"></div>
              )}
              <div className={cn(
                "flex flex-col items-center justify-center",
                isActive ? "text-blue-600" : "text-gray-500"
              )}>
                <tab.icon strokeWidth={isActive ? 2 : 1.5} className="h-5 w-5 mb-1" />
                <span className={cn(
                  "text-xs",
                  isActive ? "font-medium" : ""
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

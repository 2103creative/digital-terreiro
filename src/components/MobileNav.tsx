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
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 shadow-md md:hidden">
      <div className="flex justify-around items-center h-[4.5rem] px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.path}
              className="relative flex flex-col items-center justify-center w-full h-full"
              onClick={() => navigate(tab.path)}
            >
              {isActive && (
                <div className="absolute top-2.5 w-1.5 h-1.5 rounded-full bg-black"></div>
              )}
              <div className={cn(
                "flex flex-col items-center justify-center mt-1.5",
                isActive ? "text-black" : "text-gray-400"
              )}>
                <tab.icon strokeWidth={isActive ? 2.5 : 1.5} className={cn(
                  "h-6 w-6 mb-1",
                  isActive ? "text-black" : "text-gray-400"
                )} />
                <span className={cn(
                  "text-xs",
                  isActive ? "font-semibold" : "font-medium"
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

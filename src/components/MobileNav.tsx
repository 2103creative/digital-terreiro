
import { useLocation, useNavigate } from "react-router-dom";
import { Home, User, LayersIcon, Info } from "lucide-react";
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
      icon: LayersIcon,
      path: "/frentes",
    },
    {
      label: "Sobre",
      icon: Info,
      path: "/sobre",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-background md:hidden">
      <div className="grid grid-cols-4">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.path}
              className={cn(
                "mobile-tab py-2",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => navigate(tab.path)}
            >
              <tab.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;

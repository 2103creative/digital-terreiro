
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, BookOpen, MessageSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const tabs = [
    {
      label: "Destaques",
      icon: Home,
      path: "/dashboard",
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
      icon: Users,
      path: "/frentes",
    },
    {
      label: "Mensagens",
      icon: MessageSquare,
      path: "/mensagens",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t md:hidden">
      <div className="grid grid-cols-5">
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

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  User, 
  Calendar, 
  BookOpen, 
  FileText, 
  Info, 
  MessageSquare, 
  Brush, 
  ChevronRight,
  Settings,
  Cog,
  Users,
  Heart,
  ShoppingCart,
  Leaf
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface MenuItemType {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path: string;
}

interface CategoryMenuItemType {
  category: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items: MenuItemType[];
}

type MenuItem = MenuItemType | CategoryMenuItemType;

const DesktopSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [menuCollapsed, setMenuCollapsed] = useState<Record<string, boolean>>({
    PUBLIC: false,
  });

  const toggleMenu = (key: string) => {
    setMenuCollapsed(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Itens de menu para usuários comuns
  const userMenuItems: MenuItemType[] = [
    {
      label: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      label: "Frentes",
      icon: FileText,
      path: "/frentes",
    },
    {
      label: "Ervas",
      icon: Leaf,
      path: "/ervas",
    },
    {
      label: "Compras",
      icon: ShoppingCart,
      path: "/compras",
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
      label: "Bate Papo",
      icon: Heart,
      path: "/chat",
    },
    {
      label: "Meu Perfil",
      icon: User,
      path: "/profile",
    }
  ];

  // Itens de menu para administradores
  const adminMenuItems: MenuItemType[] = [
    {
      label: "Dashboard",
      icon: Home,
      path: "/admin/dashboard",
    },
    {
      label: "Frentes",
      icon: FileText,
      path: "/admin/frentes",
    },
    {
      label: "Ervas",
      icon: Leaf,
      path: "/admin/ervas",
    },
    {
      label: "Compras",
      icon: ShoppingCart,
      path: "/admin/compras",
    },
    {
      label: "Eventos",
      icon: Calendar,
      path: "/admin/eventos",
    },
    {
      label: "Leitura",
      icon: BookOpen,
      path: "/admin/leitura",
    },
    {
      label: "Limpeza",
      icon: Brush,
      path: "/admin/limpeza",
    },
    {
      label: "Mensagens",
      icon: MessageSquare,
      path: "/admin/mensagens",
    },
    {
      label: "Bate Papo",
      icon: Heart,
      path: "/chat",
    },
    {
      label: "Usuários",
      icon: Users,
      path: "/admin/usuarios",
    },
    {
      label: "Meu Perfil",
      icon: User,
      path: "/profile",
    },
  ];

  // Seleciona os itens de menu com base no tipo de usuário
  const mainMenuItems = isAdmin ? adminMenuItems : userMenuItems;

  const secondaryMenuItems: MenuItemType[] = [];

  const isCategoryMenuItem = (item: MenuItem): item is CategoryMenuItemType => {
    return 'category' in item;
  };

  const MenuItemComponent = ({ item, isCategory = false }) => {
    if (isCategory || isCategoryMenuItem(item)) {
      const categoryItem = item as CategoryMenuItemType;
      return (
        <li>
          <button
            onClick={() => toggleMenu(categoryItem.category)}
            className="flex items-center w-full px-4 py-1.5 text-xs text-gray-600 hover:text-gray-900 font-medium group"
          >
            <ChevronRight 
              className={cn(
                "h-3.5 w-3.5 mr-1.5 transition-transform",
                !menuCollapsed[categoryItem.category] ? "rotate-90" : ""
              )} 
            />
            <span>{categoryItem.category}</span>
          </button>
          {!menuCollapsed[categoryItem.category] && categoryItem.items && (
            <ul className="pl-8 mt-1 space-y-1">
              {categoryItem.items.map((subItem) => (
                <MenuItemComponent key={subItem.path} item={subItem} />
              ))}
            </ul>
          )}
        </li>
      );
    }
    
    const standardItem = item as MenuItemType;
    const isActive = standardItem.path ? location.pathname === standardItem.path : false;
    
    return (
      <li>
        <button
          onClick={() => navigate(standardItem.path)}
          className={cn(
            "flex items-center w-full px-4 py-1.5 text-xs rounded-none transition-colors",
            isActive 
              ? "text-blue-800 font-medium" 
              : "text-gray-700 hover:text-gray-900"
          )}
        >
          {standardItem.icon && (
            React.createElement(standardItem.icon, { width: 18, height: 18, style: { marginRight: 8 } })
          )}
          <span>{standardItem.label}</span>
        </button>
      </li>
    );
  };

  return (
    <aside className="hidden md:flex h-screen w-60 flex-col border-r border-gray-200 bg-white">
      <div className="p-3 border-b border-gray-100">
        <h1 className="text-base font-medium text-gray-900 mb-1 pl-4">Ylê Axé Xangô & Oxum</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="py-1">
          <li>
            <button
              onClick={() => toggleMenu("PUBLIC")}
              className="flex items-center w-full px-4 py-1 text-xs text-gray-600 hover:text-gray-900 font-medium"
            >
              <ChevronRight 
                className={cn(
                  "h-3.5 w-3.5 mr-1.5 transition-transform",
                  !menuCollapsed.PUBLIC ? "rotate-90" : ""
                )} 
              />
              <span>{isAdmin ? "MENU" : "PÚBLICO"}</span>
            </button>
            
            {!menuCollapsed.PUBLIC && (
              <ul className="mt-1 space-y-0.5">
                {mainMenuItems.map((item) => (
                  isCategoryMenuItem(item) ? 
                    <MenuItemComponent key={item.category} item={item} isCategory={true} /> : 
                    <MenuItemComponent key={item.path} item={item} />
                ))}
                
                {secondaryMenuItems.map((item) => (
                  <MenuItemComponent key={(item as MenuItemType).path} item={item} />
                ))}
              </ul>
            )}
          </li>
        </ul>
        <div className="flex flex-col items-center mt-6 mb-2">
          <img src="/canoa.png" alt="Canoa" className="w-32 h-auto opacity-80" />
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;

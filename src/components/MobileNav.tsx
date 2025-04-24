import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Users,
  FileText,
  ShoppingCart,
  CalendarDays,
  BookOpen,
  Brush,
  MessageSquare,
  Heart,
  Info,
  User,
  Settings,
  Leaf,
  LogOut
} from "lucide-react";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number | null;
  isActive: boolean;
}

const NavItem = ({ icon: Icon, label, path, badge, isActive }: NavItemProps) => (
  <Link
    to={path}
    className="inline-flex flex-col items-center justify-center px-1 group relative"
  >
    <div
      className={cn(
        "w-10 h-10 flex items-center justify-center rounded-full mb-1 transition-colors",
        isActive
          ? "bg-primary text-white"
          : "text-gray-500 group-hover:bg-gray-100"
      )}
    >
      <Icon className="h-5 w-5" />
      {badge && (
        <Badge
          className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 h-5 min-w-5 p-0 flex items-center justify-center"
          variant="destructive"
        >
          {badge}
        </Badge>
      )}
    </div>
    <span className="text-xs text-gray-500 group-hover:text-gray-900">
      {label}
    </span>
  </Link>
);

const MobileNav = () => {
  const location = useLocation();
  const { user, isAdmin, loading } = useAuth();

  // Corrige: só renderiza após carregamento e usuário admin validado
  if (loading) return null;
  if (!user || !isAdmin) return null;

  // Rotas administrativas completas
  const adminNav = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Usuários", path: "/adminusuarios" },
    { icon: FileText, label: "Frentes", path: "/adminfrente" },
    { icon: Leaf, label: "Ervas", path: "/adminervas" },
    { icon: ShoppingCart, label: "Compras", path: "/adminmantimentos" },
    { icon: CalendarDays, label: "Eventos", path: "/adminevents" },
    { icon: BookOpen, label: "Leitura", path: "/adminreading" },
    { icon: Brush, label: "Limpeza", path: "/adminlimpeza" },
    { icon: MessageSquare, label: "Mensagens", path: "/messages", badge: 3 },
    { icon: Heart, label: "Chat", path: "/chat" },
    { icon: Info, label: "Sobre", path: "/adminabout" },
    { icon: User, label: "Meu Perfil", path: "/profile" },
    { icon: Settings, label: "Configurações", path: "/settings" },
    { icon: LogOut, label: "Sair", path: "/logout" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg flex justify-between px-2 py-1 md:hidden">
      {adminNav.map((item) => (
        <NavItem
          key={item.path}
          icon={item.icon}
          label={item.label}
          path={item.path}
          badge={item.badge}
          isActive={location.pathname.startsWith(item.path)}
        />
      ))}
    </nav>
  );
};

export default MobileNav;

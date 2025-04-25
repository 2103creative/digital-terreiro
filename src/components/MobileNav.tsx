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
          ? "bg-primary text-white shadow-lg"
          : "text-gray-500 group-hover:bg-gray-100"
      )}
    >
      <Icon className="h-6 w-6" />
      {badge && (
        <Badge
          className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 h-5 min-w-5 p-0 flex items-center justify-center"
          variant="destructive"
        >
          {badge}
        </Badge>
      )}
    </div>
    {/* Esconde o label em telas pequenas para economizar espaço */}
    <span className="text-xs text-gray-500 group-hover:text-gray-900 hidden xs:block">
      {label}
    </span>
  </Link>
);

const MobileNav = () => {
  const location = useLocation();
  const { user, isAdmin, loading } = useAuth();

  // Corrige: só renderiza após carregamento e usuário admin validado
  if (loading) return null;
  if (!user) return null;

  // Todos os ícones/páginas disponíveis para admin
  const allAdminNav = [
    { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
    { icon: FileText, label: "Frentes", path: "/admin/frentes" },
    { icon: Leaf, label: "Ervas", path: "/admin/ervas" },
    { icon: ShoppingCart, label: "Compras", path: "/admin/compras" },
    { icon: CalendarDays, label: "Eventos", path: "/admin/eventos" },
    { icon: BookOpen, label: "Leitura", path: "/admin/leitura" },
    { icon: Brush, label: "Limpeza", path: "/admin/limpeza" },
    { icon: MessageSquare, label: "Mensagens", path: "/admin/mensagens" },
    { icon: Heart, label: "Bate Papo", path: "/chat" },
    { icon: Users, label: "Usuários", path: "/admin/usuarios" },
    { icon: User, label: "Perfil", path: "/profile" }
  ];

  // Todos os ícones/páginas disponíveis para usuário comum
  const allUserNav = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Frentes", path: "/frentes" },
    { icon: Leaf, label: "Ervas", path: "/ervas" },
    { icon: ShoppingCart, label: "Compras", path: "/compras" },
    { icon: CalendarDays, label: "Eventos", path: "/eventos" },
    { icon: BookOpen, label: "Leitura", path: "/leitura" },
    { icon: Brush, label: "Limpeza", path: "/limpeza" },
    { icon: MessageSquare, label: "Mensagens", path: "/mensagens" },
    { icon: Heart, label: "Bate Papo", path: "/chat" },
    { icon: Users, label: "Usuários", path: "/usuarios" },
    { icon: User, label: "Perfil", path: "/profile" }
  ];

  const navItems = isAdmin ? allAdminNav : allUserNav;

  // Divide os ícones igualmente em duas linhas
  const half = Math.ceil(navItems.length / 2);
  const firstRow = navItems.slice(0, half);
  const secondRow = navItems.slice(half);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg px-1 py-1 md:hidden">
      <div className="flex flex-col">
        <div className="flex justify-around w-full mb-1">
          {firstRow.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname.startsWith(item.path)}
            />
          ))}
        </div>
        <div className="flex justify-around w-full">
          {secondRow.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname.startsWith(item.path)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;

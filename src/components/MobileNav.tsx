import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Home, 
  BookOpen, 
  CalendarDays, 
  FileText, 
  MessageSquare, 
  User, 
  Info,
  Settings,
  Calendar,
  Brush,
  Heart,
  UserCog,
  ShoppingCart
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

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
    className="inline-flex flex-col items-center justify-center px-1 group"
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
  // Desativando a barra de navegação mobile conforme solicitado
  return null;
};

export default MobileNav;

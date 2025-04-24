import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminFrente from "./AdminFrente";
import UserFrentes from "./UserFrentes";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth from auth context
import DesktopSidebar from "@/components/DesktopSidebar";

const Frentes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin } = useAuth(); // Get isAdmin from auth context

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
      toast({
        title: "Acesso negado",
        description: "Por favor, faça login para acessar esta página",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  // Renderiza componente de visualização para usuários e admin para admins
  return isAdmin ? (
    <AdminFrente />
  ) : (
    <div className="min-h-screen bg-gray-50 md:flex">
      <DesktopSidebar />
      <div className="flex-1">
        <UserFrentes />
      </div>
    </div>
  );
};

export default Frentes;

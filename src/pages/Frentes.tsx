import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserFrentes from "./UserFrentes";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Frentes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
      toast({
        title: "Acesso negado",
        description: "Por favor, faça login para acessar esta página",
        variant: "destructive",
      });
    }
  }, [navigate, toast, isAuthenticated, loading]);

  if (loading) return null;
  if (!isAuthenticated) return null;

  // Renderiza componente de visualização para usuários
  return (
    <div className="flex-1">
      <UserFrentes />
    </div>
  );
};

export default Frentes;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserFrentes from "./UserFrentes";
import { useToast } from "@/hooks/use-toast";

const Frentes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  // Renderiza componente de visualização para usuários
  return (
    <div className="flex-1">
      <UserFrentes />
    </div>
  );
};

export default Frentes;

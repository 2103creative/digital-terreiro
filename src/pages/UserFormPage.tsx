import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserForm from "@/components/UserForm";
import { useToast } from "@/hooks/use-toast";

const UserFormPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userId } = useParams();
  
  useEffect(() => {
    // Verificar se o usuário está autenticado e é admin
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
      toast({
        title: "Acesso negado",
        description: "Por favor, faça login para acessar esta página",
        variant: "destructive",
      });
      return;
    }

    // Simulação de verificação de admin
    setTimeout(() => {
      const isAdmin = true; // Em um app real, isso seria verificado via API
      if (!isAdmin) {
        navigate("/dashboard");
        toast({
          title: "Acesso restrito",
          description: "Você não tem permissão para acessar esta área",
          variant: "destructive",
        });
      }
    }, 500);
  }, [navigate, toast]);

  return (
    <div className="flex-1">
      <main className="container mx-auto px-4 py-6">
        <UserForm userId={userId ? parseInt(userId) : undefined} />
      </main>
    </div>
  );
};

export default UserFormPage; 
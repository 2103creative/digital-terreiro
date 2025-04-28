import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Mensagens = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
      toast({
        title: "Acesso negado",
        description: "Por favor, faça login para acessar esta página.",
        variant: "destructive",
      });
    }
  }, [navigate, toast, isAuthenticated, loading]);

  if (loading) return null;
  if (!isAuthenticated) return null;

  return (
    <div className="flex-1">
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Mensagens</h2>
        <p>Área de mensagens da comunidade. (Em breve...)</p>
      </main>
    </div>
  );
};

export default Mensagens;

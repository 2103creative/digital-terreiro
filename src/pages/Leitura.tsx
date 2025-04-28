import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Leitura = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Exemplo de proteção de rota
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
      toast({
        title: "Acesso negado",
        description: "Por favor, faça login para acessar esta página.",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  return (
    <div className="flex-1">
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-4">Leitura</h2>
        <p>Materiais de estudo e leituras recomendadas. (Em breve...)</p>
      </main>
    </div>
  );
};

export default Leitura;

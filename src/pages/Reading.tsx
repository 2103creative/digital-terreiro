import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReadingContent from "@/components/ReadingContent";
import { useToast } from "@/hooks/use-toast";

const Reading = () => {
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

  return (
    <div className="flex-1">
      <main className="container mx-auto px-4 py-6">
        <ReadingContent />
      </main>
    </div>
  );
};

export default Reading;

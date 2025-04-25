import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventsCards from "@/components/EventsCards";
import { useToast } from "@/hooks/use-toast";

const Events = () => {
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
        <h1 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">Eventos</h1>
        <p className="text-xs md:text-sm text-gray-500 mb-6">Confira os próximos eventos do terreiro e marque para ser avisado!</p>
        <EventsCards />
      </main>
    </div>
  );
};

export default Events;

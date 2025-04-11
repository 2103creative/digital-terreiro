import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import MessagesContent from "@/components/MessagesContent";
import MobileNav from "@/components/MobileNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useToast } from "@/hooks/use-toast";

const Messages = () => {
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
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:flex">
      <DesktopSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <div className="flex justify-center gap-4 border-b pb-1">
              <button 
                className="text-muted-foreground"
                onClick={() => navigate("/dashboard")}
              >
                Destaques
              </button>
              <button 
                className="text-muted-foreground"
                onClick={() => navigate("/eventos")}
              >
                Eventos
              </button>
              <button 
                className="text-muted-foreground"
                onClick={() => navigate("/leitura")}
              >
                Leitura
              </button>
              <button 
                className="font-medium text-primary border-b-2 border-primary pb-1 px-1"
                onClick={() => navigate("/mensagens")}
              >
                Mensagens
              </button>
            </div>
          </div>
          <MessagesContent />
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Messages;

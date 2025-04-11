
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardHighlights from "@/components/DashboardHighlights";
import MobileNav from "@/components/MobileNav";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
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
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-6">
        <DashboardHighlights />
      </main>
      
      <MobileNav />
    </div>
  );
};

export default Dashboard;

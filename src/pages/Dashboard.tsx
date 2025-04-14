import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardHighlights from "@/components/DashboardHighlights";
import MobileNav from "@/components/MobileNav";
import DesktopSidebar from "@/components/DesktopSidebar";
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
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0 md:flex">
      <DesktopSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="container mx-auto px-4 py-5">
          <div className="mb-6">
            <h1 className="text-xl font-medium text-gray-800 mb-1">Bem-vindo(a) ao Ylê Axé Xangô & Oxum</h1>
            <p className="text-sm text-gray-600">Confira os destaques e atividades recentes do terreiro</p>
          </div>
          
          <DashboardHighlights />
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Dashboard;

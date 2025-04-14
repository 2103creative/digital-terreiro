import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

import DashboardHeader from "@/components/DashboardHeader";
import MobileNav from "@/components/MobileNav";
import DesktopSidebar from "@/components/DesktopSidebar";

interface AdminLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  pageDescription?: string;
}

const AdminLayout = ({ children, pageTitle, pageDescription }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0 md:flex">
      <DesktopSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="container mx-auto px-4 py-4">
          {(pageTitle || pageDescription) && (
            <div className="bg-white border border-gray-100 rounded px-5 pb-4 mb-6">
              {/* Cabeçalho da página */}
              <div className="py-4 border-b border-gray-100">
                {pageTitle && (
                  <h1 className="text-xl font-medium text-gray-900 mb-2">{pageTitle}</h1>
                )}
                {pageDescription && (
                  <p className="text-gray-500 text-xs">{pageDescription}</p>
                )}
              </div>
            </div>
          )}
          
          {children}
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default AdminLayout; 
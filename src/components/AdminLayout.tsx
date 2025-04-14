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
    <div className="min-h-screen bg-gray-50 md:flex">
      <DesktopSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="px-5 py-6">
          {(pageTitle || pageDescription) && (
            <div className="bg-white border border-gray-100 rounded mb-5">
              {/* Cabeçalho da página */}
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center mb-2">
                  {pageTitle && (
                    <h1 className="text-xl font-medium text-gray-900">{pageTitle}</h1>
                  )}
                  <div className="flex space-x-2 mb-2 md:mb-0">
                    <button className="h-8 text-xs px-2 text-gray-600 border border-gray-200 bg-white rounded hover:bg-gray-50">
                      Dispensar
                    </button>
                  </div>
                </div>
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
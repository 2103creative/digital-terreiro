import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
    <div className="flex-1">
      <main className="px-5 py-6">
        {(pageTitle || pageDescription) && (
          <div className="mb-5">
            <div className="py-4">
              <div className="flex flex-col">
                {pageTitle && (
                  <h1 className="text-xl font-medium text-gray-900">{pageTitle}</h1>
                )}
                {pageDescription && (
                  <p className="text-gray-500 text-xs">{pageDescription}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
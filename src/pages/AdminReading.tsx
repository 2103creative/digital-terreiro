import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import MobileNav from "@/components/MobileNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminReading = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Verificar autenticação e permissão de admin
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gerenciar Materiais de Leitura</h1>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Material
            </Button>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Administração de Leitura</CardTitle>
              <CardDescription>
                Esta é uma página de administração para gerenciar todos os materiais de leitura disponíveis.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-10">
              <BookOpen className="h-16 w-16 text-primary mb-4" />
              <p className="text-xl font-medium text-center">Funcionalidade em Desenvolvimento</p>
              <p className="text-muted-foreground mt-2 text-center">
                A administração de materiais de leitura está sendo implementada.
                Aqui você poderá adicionar, editar e remover livros, artigos e outros materiais de estudo.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default AdminReading; 
import { BookOpen, PlusCircle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminReading = () => {
  return (
    <AdminLayout pageTitle="Gerenciar Materiais de Leitura" pageDescription="Esta é uma página de administração para gerenciar todos os materiais de leitura disponíveis.">
      <div className="flex justify-end items-center mb-6">
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
    </AdminLayout>
  );
};

export default AdminReading; 
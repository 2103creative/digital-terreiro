import { Layers, PlusCircle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminFrente = () => {
  return (
    <AdminLayout pageTitle="Gerenciar Frentes" pageDescription="Esta é uma página de administração para gerenciar as frentes de Nação/Umbanda.">
      <div className="flex justify-end items-center mb-6">
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Frente
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Administração de Frentes</CardTitle>
          <CardDescription>
            Esta é uma página de administração para gerenciar as frentes de Nação/Umbanda.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-10">
          <Layers className="h-16 w-16 text-primary mb-4" />
          <p className="text-xl font-medium text-center">Funcionalidade em Desenvolvimento</p>
          <p className="text-muted-foreground mt-2 text-center">
            A administração de frentes está sendo implementada.
            Aqui você poderá criar, editar e excluir informações sobre as diferentes frentes.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminFrente; 
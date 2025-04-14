import { Calendar, PlusCircle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminEvents = () => {
  return (
    <AdminLayout pageTitle="Gerenciar Eventos" pageDescription="Esta é uma página de administração para gerenciar os eventos do terreiro.">
      <div className="flex justify-between items-center mb-6">
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Administração de Eventos</CardTitle>
          <CardDescription>
            Esta é uma página de administração para gerenciar os eventos do terreiro.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-10">
          <Calendar className="h-16 w-16 text-primary mb-4" />
          <p className="text-xl font-medium text-center">Funcionalidade em Desenvolvimento</p>
          <p className="text-muted-foreground mt-2 text-center">
            A administração de eventos está sendo implementada.
            Aqui você poderá criar, editar e excluir eventos.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminEvents; 
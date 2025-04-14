import { Info, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminAbout = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Alterações salvas",
      description: "As informações da página Sobre foram atualizadas com sucesso.",
    });
  };

  return (
    <AdminLayout pageTitle="Editar Página Sobre" pageDescription="Atualize as informações exibidas na página Sobre.">
      <div className="flex justify-end mb-6">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações do Terreiro</CardTitle>
          <CardDescription>
            Edite as informações principais exibidas na página Sobre.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Página</Label>
            <Input id="title" defaultValue="Sobre Ylê Axé Xangô & Oxum" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              rows={4}
              defaultValue="O Ylê Axé Xangô & Oxum é um terreiro dedicado à preservação e prática das tradições de matriz africana, com foco na Umbanda e no Candomblé."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="history">História</Label>
            <Textarea 
              id="history" 
              rows={8}
              defaultValue="Fundado em 2010 pelo Babalorixá José da Silva, nosso terreiro tem sido um espaço de acolhimento, espiritualidade e preservação cultural. Ao longo dos anos, temos trabalhado para manter vivas as tradições e rituais que honram nossos ancestrais e orixás."
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informações de Contato</CardTitle>
          <CardDescription>
            Atualize as informações de contato e localização.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" defaultValue="Rua das Flores, 123 - São Paulo, SP" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" defaultValue="(11) 99999-9999" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" defaultValue="contato@yleaxe.com.br" />
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminAbout; 
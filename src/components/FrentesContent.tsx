
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Eye, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample frentes data
const frentes = {
  umbanda: [
    {
      id: 1,
      title: "Caboclos",
      description: "Energia de proteção e cura da natureza",
      views: 128,
    },
    {
      id: 2,
      title: "Pretos Velhos",
      description: "Sabedoria ancestral e acolhimento",
      views: 156,
    },
    {
      id: 3,
      title: "Crianças",
      description: "Energia de pureza e alegria",
      views: 97,
    },
    {
      id: 4,
      title: "Exus e Pombagiras",
      description: "Guardiões e orientadores dos caminhos",
      views: 214,
    },
  ],
  nacao: [
    {
      id: 5,
      title: "Xangô",
      description: "Orixá da justiça e do trovão",
      views: 183,
    },
    {
      id: 6,
      title: "Oxum",
      description: "Orixá das águas doces e do amor",
      views: 176,
    },
    {
      id: 7,
      title: "Ogum",
      description: "Orixá guerreiro, senhor dos caminhos",
      views: 145,
    },
    {
      id: 8,
      title: "Iemanjá",
      description: "Rainha do mar, mãe de todos os orixás",
      views: 192,
    },
  ],
};

const FrentesContent = () => {
  const [activeTab, setActiveTab] = useState("umbanda");
  const { toast } = useToast();

  const handleFrenteClick = (frente: any) => {
    toast({
      title: `${frente.title}`,
      description: "Conteúdo em desenvolvimento. Em breve!",
    });
  };

  const renderFrentes = (frentesToRender: any[]) => {
    return frentesToRender.map((frente) => (
      <Card key={frente.id} className="card-hover">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">{frente.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground mb-3">{frente.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-muted-foreground">
              <Eye className="h-3 w-3 mr-1" />
              <span>{frente.views} visualizações</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleFrenteClick(frente)}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Ver detalhes
            </Button>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="space-y-6 pb-16">
      <Tabs defaultValue="umbanda" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="umbanda">Umbanda</TabsTrigger>
          <TabsTrigger value="nacao">Nação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="umbanda" className="space-y-4">
          <h3 className="text-lg font-semibold">Frentes de Umbanda</h3>
          {renderFrentes(frentes.umbanda)}
        </TabsContent>
        
        <TabsContent value="nacao" className="space-y-4">
          <h3 className="text-lg font-semibold">Frentes de Nação</h3>
          {renderFrentes(frentes.nacao)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FrentesContent;

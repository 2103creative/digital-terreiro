import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Eye, BookOpen, ArrowLeft } from "lucide-react";

interface Frente {
  id: number;
  title: string;
  description: string;
  subtitle?: string;
  imageUrl?: string;
  type: "umbanda" | "nacao";
  views: number;
}

// Dados de exemplo das frentes
const frentesData = {
  umbanda: [
    {
      id: 1,
      title: "Caboclos",
      subtitle: "Energia de proteção e cura",
      description: "Energia de proteção e cura da natureza. Os caboclos são espíritos que representam os nativos brasileiros e trabalham com as forças da natureza para cura e orientação espiritual.",
      imageUrl: "/placeholder-frente.jpg",
      type: "umbanda" as const,
      views: 128,
    },
    {
      id: 2,
      title: "Pretos Velhos",
      subtitle: "Sabedoria ancestral",
      description: "Sabedoria ancestral e acolhimento. Os pretos velhos são espíritos de antigos escravos que viveram no Brasil e trazem consigo conhecimento, caridade e paciência.",
      imageUrl: "/placeholder-frente.jpg",
      type: "umbanda" as const,
      views: 156,
    },
    {
      id: 3,
      title: "Crianças",
      subtitle: "Energia de pureza",
      description: "Energia de pureza e alegria. As crianças na umbanda representam a pureza, a inocência e a alegria, trazendo leveza aos trabalhos espirituais.",
      imageUrl: "/placeholder-frente.jpg",
      type: "umbanda" as const,
      views: 97,
    },
    {
      id: 4,
      title: "Exus e Pombagiras",
      subtitle: "Guardiões e orientadores",
      description: "Guardiões e orientadores dos caminhos. Trabalham na quebra de demandas, proteção espiritual e remoção de obstáculos da vida dos médiuns e consulentes.",
      imageUrl: "/placeholder-frente.jpg",
      type: "umbanda" as const,
      views: 214,
    },
  ],
  nacao: [
    {
      id: 5,
      title: "Xangô",
      subtitle: "Orixá da justiça",
      description: "Orixá da justiça e do trovão. Xangô é o senhor da justiça, representado pelas pedreiras, trovões e pela força que equilibra o bem e o mal.",
      imageUrl: "/placeholder-frente.jpg",
      type: "nacao" as const,
      views: 183,
    },
    {
      id: 6,
      title: "Oxum",
      subtitle: "Orixá das águas doces",
      description: "Orixá das águas doces e do amor. Oxum representa a fertilidade, beleza, riqueza e o amor materno, sendo a dona dos rios e cachoeiras.",
      imageUrl: "/placeholder-frente.jpg",
      type: "nacao" as const,
      views: 176,
    },
    {
      id: 7,
      title: "Ogum",
      subtitle: "Orixá guerreiro",
      description: "Orixá guerreiro, senhor dos caminhos. Ogum é o orixá da tecnologia, das batalhas e da força, abrindo caminhos e removendo obstáculos.",
      imageUrl: "/placeholder-frente.jpg",
      type: "nacao" as const,
      views: 145,
    },
    {
      id: 8,
      title: "Iemanjá",
      subtitle: "Rainha do mar",
      description: "Rainha do mar, mãe de todos os orixás. Iemanjá representa o acolhimento materno, a fertilidade e a proteção de seus filhos.",
      imageUrl: "/placeholder-frente.jpg",
      type: "nacao" as const,
      views: 192,
    },
  ],
};

const FrentesContent = () => {
  const [activeTab, setActiveTab] = useState<"umbanda" | "nacao">("umbanda");
  const [selectedFrente, setSelectedFrente] = useState<Frente | null>(null);

  const handleFrenteClick = (frente: Frente) => {
    setSelectedFrente(frente);
    // Incrementar visualizações na vida real seria feito com uma chamada de API
    frente.views += 1;
  };

  const handleVoltar = () => {
    setSelectedFrente(null);
  };

  const renderFrentes = (frentesToRender: Frente[]) => {
    return frentesToRender.map((frente) => (
      <Card key={frente.id} className="card-hover">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base">{frente.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground mb-3">{frente.subtitle || frente.description}</p>
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

  // Renderizar detalhes da frente selecionada
  if (selectedFrente) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4" 
          onClick={handleVoltar}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para frentes
        </Button>
        
        <Card>
          <CardHeader className="p-6">
            <div className="mb-4">
              <span className="inline-block px-2 py-1 text-xs rounded bg-primary/10 text-primary mb-2">
                {selectedFrente.type === "umbanda" ? "Umbanda" : "Nação"}
              </span>
              <CardTitle className="text-2xl">{selectedFrente.title}</CardTitle>
              {selectedFrente.subtitle && (
                <p className="text-lg text-muted-foreground mt-1">{selectedFrente.subtitle}</p>
              )}
            </div>
            
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
              <img 
                src={selectedFrente.imageUrl || "/placeholder-frente.jpg"}
                alt={selectedFrente.title}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/800x450?text=Frente+Espiritual";
                }}
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-6 pt-0">
            <div className="prose max-w-none">
              <h3>Descrição</h3>
              <p className="text-base">{selectedFrente.description}</p>
              
              <h3 className="mt-6">Características</h3>
              <ul>
                {selectedFrente.type === "umbanda" ? (
                  <>
                    <li>Trabalho espiritual focado na caridade e evolução</li>
                    <li>Atendimento e consultas mediúnicas</li>
                    <li>Desenvolvimento de médiuns e consulentes</li>
                  </>
                ) : (
                  <>
                    <li>Culto ancestral aos orixás</li>
                    <li>Ritualística e tradições africanas</li>
                    <li>Preservação de conhecimentos ancestrais</li>
                  </>
                )}
              </ul>
              
              <div className="flex items-center text-sm text-muted-foreground mt-8">
                <Eye className="h-4 w-4 mr-1" />
                <span>{selectedFrente.views} visualizações</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <Tabs defaultValue="umbanda" onValueChange={(value) => setActiveTab(value as "umbanda" | "nacao")}>
        <TabsList className="mb-4">
          <TabsTrigger value="umbanda">Umbanda</TabsTrigger>
          <TabsTrigger value="nacao">Nação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="umbanda" className="space-y-4">
          <h3 className="text-lg font-semibold">Frentes de Umbanda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderFrentes(frentesData.umbanda)}
          </div>
        </TabsContent>
        
        <TabsContent value="nacao" className="space-y-4">
          <h3 className="text-lg font-semibold">Frentes de Nação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderFrentes(frentesData.nacao)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FrentesContent;

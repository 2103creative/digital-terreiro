import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Eye, BookOpen, ArrowLeft, Feather, Coffee, Baby, Sparkles, Cloud, Droplets, Sword, Anchor, ArrowRight } from "lucide-react";

interface Frente {
  id: number;
  title: string;
  description: string;
  subtitle?: string;
  imageUrl?: string;
  type: "umbanda" | "nacao";
  views: number;
  icon: React.ElementType;
  color: string;
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
      icon: Feather,
      color: "bg-green-50 text-green-700",
    },
    {
      id: 2,
      title: "Pretos Velhos",
      subtitle: "Sabedoria ancestral",
      description: "Sabedoria ancestral e acolhimento. Os pretos velhos são espíritos de antigos escravos que viveram no Brasil e trazem consigo conhecimento, caridade e paciência.",
      imageUrl: "/placeholder-frente.jpg",
      type: "umbanda" as const,
      views: 156,
      icon: Coffee,
      color: "bg-amber-50 text-amber-700",
    },
    {
      id: 3,
      title: "Crianças",
      subtitle: "Energia de pureza",
      description: "Energia de pureza e alegria. As crianças na umbanda representam a pureza, a inocência e a alegria, trazendo leveza aos trabalhos espirituais.",
      imageUrl: "/placeholder-frente.jpg",
      type: "umbanda" as const,
      views: 97,
      icon: Baby,
      color: "bg-pink-50 text-pink-700",
    },
    {
      id: 4,
      title: "Exus e Pombagiras",
      subtitle: "Guardiões e orientadores",
      description: "Guardiões e orientadores dos caminhos. Trabalham na quebra de demandas, proteção espiritual e remoção de obstáculos da vida dos médiuns e consulentes.",
      imageUrl: "/placeholder-frente.jpg",
      type: "umbanda" as const,
      views: 214,
      icon: Sparkles,
      color: "bg-purple-50 text-purple-700",
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
      icon: Cloud,
      color: "bg-red-50 text-red-700",
    },
    {
      id: 6,
      title: "Oxum",
      subtitle: "Orixá das águas doces",
      description: "Orixá das águas doces e do amor. Oxum representa a fertilidade, beleza, riqueza e o amor materno, sendo a dona dos rios e cachoeiras.",
      imageUrl: "/placeholder-frente.jpg",
      type: "nacao" as const,
      views: 176,
      icon: Droplets,
      color: "bg-yellow-50 text-yellow-700",
    },
    {
      id: 7,
      title: "Ogum",
      subtitle: "Orixá guerreiro",
      description: "Orixá guerreiro, senhor dos caminhos. Ogum é o orixá da tecnologia, das batalhas e da força, abrindo caminhos e removendo obstáculos.",
      imageUrl: "/placeholder-frente.jpg",
      type: "nacao" as const,
      views: 145,
      icon: Sword,
      color: "bg-blue-50 text-blue-700",
    },
    {
      id: 8,
      title: "Iemanjá",
      subtitle: "Rainha do mar",
      description: "Rainha do mar, mãe de todos os orixás. Iemanjá representa o acolhimento materno, a fertilidade e a proteção de seus filhos.",
      imageUrl: "/placeholder-frente.jpg",
      type: "nacao" as const,
      views: 192,
      icon: Anchor,
      color: "bg-cyan-50 text-cyan-700",
    },
  ],
};

const FrentesContent = () => {
  const [activeTab, setActiveTab] = useState<"umbanda" | "nacao">("umbanda");
  const [selectedFrente, setSelectedFrente] = useState<Frente | null>(null);

  const handleFrenteClick = (frente: Frente) => {
    setSelectedFrente(frente);
    frente.views += 1;
  };

  const handleVoltar = () => {
    setSelectedFrente(null);
  };

  const renderFrentes = (frentesToRender: Frente[]) => {
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {frentesToRender.map((frente) => (
          <div 
            key={frente.id} 
            className="frente-card"
            onClick={() => handleFrenteClick(frente)}
          >
            <div className="frente-card-icon">
              <frente.icon className="h-5 w-5 text-gray-600" />
            </div>
            
            <div className="frente-card-title">{frente.title}</div>
            
            <div className="frente-card-action">
              <span>Ver</span>
              <ArrowRight className="h-2.5 w-2.5 ml-0.5" />
            </div>
            
            <div className={`frente-card-indicator ${frente.color.split(' ')[0]}`}></div>
            
            <div className="frente-card-views">
              <Eye className="h-2.5 w-2.5 mr-0.5" />
              <span>{frente.views}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

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
    <div className="space-y-6">
      <Tabs defaultValue="umbanda" onValueChange={(value) => setActiveTab(value as "umbanda" | "nacao")}>
        <TabsList className="grid w-full max-w-[200px] grid-cols-2 mb-6">
          <TabsTrigger value="umbanda" className="text-xs py-1.5">Umbanda</TabsTrigger>
          <TabsTrigger value="nacao" className="text-xs py-1.5">Nação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="umbanda" className="space-y-4">
          <h2 className="text-sm md:text-base font-medium text-gray-900 mb-2 md:mb-3 text-left">Frentes de Umbanda</h2>
          <p className="text-xs text-gray-500 mb-4">Conheça as frentes espirituais da Umbanda e suas características</p>
          {renderFrentes(frentesData.umbanda)}
        </TabsContent>
        
        <TabsContent value="nacao" className="space-y-4">
          <h2 className="text-sm md:text-base font-medium text-gray-900 mb-2 md:mb-3 text-left">Frentes de Nação</h2>
          <p className="text-xs text-gray-500 mb-4">Conheça os orixás cultuados na casa e suas características</p>
          {renderFrentes(frentesData.nacao)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FrentesContent;

import { useState } from "react";
import { Layers, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Interface para o modelo Frente (replicada para consistência)
interface Frente {
  id: number;
  title: string;
  description: string;
  subtitle?: string;
  imageUrl?: string;
  type: "umbanda" | "nacao";
  views: number;
}

// Dados de exemplo das frentes (pode ser substituído por fetch futuramente)
const frentesData: Frente[] = [
  {
    id: 1,
    title: "Caboclos",
    subtitle: "Energia de proteção e cura",
    description: "Energia de proteção e cura da natureza. Os caboclos são espíritos que representam os nativos brasileiros e trabalham com as forças da natureza para cura e orientação espiritual.",
    imageUrl: "/placeholder-frente.jpg",
    type: "umbanda",
    views: 128,
  },
  {
    id: 2,
    title: "Pretos Velhos",
    subtitle: "Sabedoria ancestral",
    description: "Sabedoria ancestral e acolhimento. Os pretos velhos são espíritos de antigos escravos que viveram no Brasil e trazem consigo conhecimento, caridade e paciência.",
    imageUrl: "/placeholder-frente.jpg",
    type: "umbanda",
    views: 156,
  },
  {
    id: 3,
    title: "Crianças",
    subtitle: "Energia de pureza",
    description: "Energia de pureza e alegria. As crianças na umbanda representam a pureza, a inocência e a alegria, trazendo leveza aos trabalhos espirituais.",
    imageUrl: "/placeholder-frente.jpg",
    type: "umbanda",
    views: 97,
  },
  {
    id: 4,
    title: "Exus e Pombagiras",
    subtitle: "Guardiões e orientadores",
    description: "Guardiões e orientadores dos caminhos. Trabalham na quebra de demandas, proteção espiritual e remoção de obstáculos da vida dos médiuns e consulentes.",
    imageUrl: "/placeholder-frente.jpg",
    type: "umbanda",
    views: 214,
  },
  {
    id: 5,
    title: "Xangô",
    subtitle: "Orixá da justiça",
    description: "Orixá da justiça, equilíbrio e força. Xangô é conhecido por sua imparcialidade, poder e domínio sobre os raios e trovões.",
    imageUrl: "/placeholder-frente.jpg",
    type: "nacao",
    views: 180,
  },
];

const UserFrentes = () => {
  const [activeTab, setActiveTab] = useState<"umbanda" | "nacao">("umbanda");
  const [selectedFrente, setSelectedFrente] = useState<Frente | null>(null);

  const filteredFrentes = frentesData.filter(frente => frente.type === activeTab);

  return (
    <div className="p-2 md:p-6">
      <h1 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">Frentes</h1>
      <p className="text-xs md:text-sm text-gray-500 mb-4">Conheça as frentes espirituais do terreiro</p>
      <Tabs defaultValue="umbanda" onValueChange={value => setActiveTab(value as "umbanda" | "nacao")}> 
        <TabsList>
          <TabsTrigger value="umbanda">Umbanda</TabsTrigger>
          <TabsTrigger value="nacao">Nação</TabsTrigger>
        </TabsList>
      </Tabs>
      {!selectedFrente ? (
        <div className="flex flex-wrap gap-4 max-w-5xl mt-4">
          {filteredFrentes.map(frente => (
            <Card
              key={frente.id}
              className="bg-white border border-gray-100 rounded-[15px] aspect-square hover:shadow-sm cursor-pointer transition-shadow w-[120px] h-[120px]"
              onClick={() => setSelectedFrente(frente)}
            >
              <div className="flex flex-col h-full p-3 relative">
                <div className="absolute top-3 left-3">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <h3 className="text-xs font-medium text-gray-900 text-center line-clamp-2">{frente.title}</h3>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center text-xs text-blue-600"
                  onClick={e => { e.stopPropagation(); setSelectedFrente(frente); }}
                  style={{ cursor: 'pointer' }}
                >
                  <span>Acessar</span>
                  <ArrowRight className="h-3 w-3 ml-0.5" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow border border-gray-100">
          <button
            className="text-xs text-blue-600 mb-4 flex items-center gap-1 hover:underline"
            onClick={() => setSelectedFrente(null)}
          >
            <ArrowRight className="h-3 w-3 rotate-180" /> Voltar
          </button>
          <h2 className="text-lg md:text-xl font-semibold mb-2">{selectedFrente.title}</h2>
          {selectedFrente.subtitle && <h3 className="text-sm text-gray-700 mb-2">{selectedFrente.subtitle}</h3>}
          <p className="text-gray-700 mb-4 whitespace-pre-line">{selectedFrente.description}</p>
          {selectedFrente.imageUrl && (
            <img
              src={selectedFrente.imageUrl}
              alt={selectedFrente.title}
              className="w-full rounded-lg border object-cover max-h-64"
              onError={e => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Frente'; }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UserFrentes;

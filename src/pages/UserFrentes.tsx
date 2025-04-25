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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredFrentes.map(frente => (
            <div key={frente.id} className="bg-white border rounded-xl p-5 shadow-sm flex flex-col h-full justify-between">
              <div>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h2 className="font-bold text-lg leading-tight mb-0.5">{frente.title}</h2>
                    {frente.subtitle && <p className="text-xs italic text-gray-500 mb-2">{frente.subtitle}</p>}
                  </div>
                  <Layers className="h-5 w-5 text-primary mt-1" />
                </div>
                <p className="text-sm text-gray-700 mb-3">{frente.description}</p>
                <div className="mb-2">
                  <span className="font-semibold text-xs">Tipo:</span>
                  <span className="ml-1">
                    <span className="inline-block mr-1 mb-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 font-normal rounded-full">
                      {frente.type === 'umbanda' ? 'Umbanda' : 'Nação'}
                    </span>
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-xs">Visualizações:</span>
                  <span className="ml-1">
                    <span className="inline-block mr-1 mb-1 px-2 py-0.5 text-xs bg-black text-white font-semibold rounded-full">{frente.views}</span>
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button className="gap-1 text-gray-700 border border-gray-300 rounded-md px-3 py-1 text-xs hover:bg-gray-50 flex items-center" onClick={() => setSelectedFrente(frente)}>
                  <ArrowRight className="h-4 w-4" />
                  Detalhes
                </button>
              </div>
            </div>
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

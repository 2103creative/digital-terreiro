import { useState, useEffect } from "react";
import { Layers, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { connectSocket, getSocket, disconnectSocket } from "@/lib/socket";

interface Frente {
  id: string;
  nome: string;
  descricao: string;
  terreiroId: string;
  tipo: "umbanda" | "nacao";
  visualizacoes: number;
}

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

const UserFrentes = () => {
  const [frentes, setFrentes] = useState<Frente[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"umbanda" | "nacao">("umbanda");
  const [selectedFrente, setSelectedFrente] = useState<Frente | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const terreiroId = user.terreiroId;
    if (!terreiroId) return;

    // Fetch frentes do backend
    fetch(`${API_URL}/frentes?terreiroId=${terreiroId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setFrentes(data);
        setLoading(false);
      });

    // Real-time updates
    const socket = connectSocket(terreiroId);
    socket.on('frenteCreated', (frente: Frente) => {
      setFrentes(prev => [...prev, frente]);
    });
    socket.on('frenteUpdated', (frente: Frente) => {
      setFrentes(prev => prev.map(f => f.id === frente.id ? frente : f));
    });
    socket.on('frenteDeleted', ({ id }: { id: string }) => {
      setFrentes(prev => prev.filter(f => f.id !== id));
    });
    return () => {
      socket.off('frenteCreated');
      socket.off('frenteUpdated');
      socket.off('frenteDeleted');
      disconnectSocket();
    };
  }, []);

  if (loading) return <div className="p-8 text-center">Carregando frentes...</div>;

  const filteredFrentes = frentes.filter(frente => frente.tipo === activeTab);

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
                    <h2 className="font-bold text-lg leading-tight mb-0.5">{frente.nome}</h2>
                  </div>
                  <Layers className="h-5 w-5 text-primary mt-1" />
                </div>
                <p className="text-sm text-gray-700 mb-3">{frente.descricao}</p>
                <div className="mb-2">
                  <span className="font-semibold text-xs">Tipo:</span>
                  <span className="ml-1">
                    <span className="inline-block mr-1 mb-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 font-normal rounded-full">
                      {frente.tipo === 'umbanda' ? 'Umbanda' : 'Nação'}
                    </span>
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-xs">Visualizações:</span>
                  <span className="ml-1">
                    <span className="inline-block mr-1 mb-1 px-2 py-0.5 text-xs bg-black text-white font-semibold rounded-full">{frente.visualizacoes}</span>
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
          <h2 className="text-lg md:text-xl font-semibold mb-2">{selectedFrente.nome}</h2>
          <p className="text-gray-700 mb-4 whitespace-pre-line">{selectedFrente.descricao}</p>
        </div>
      )}
    </div>
  );
};

export default UserFrentes;

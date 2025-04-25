import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Leaf, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { connectSocket, disconnectSocket } from '@/lib/socket';

interface Erva {
  id: string;
  nome: string;
  nomeCientifico: string;
  propriedades: string[];
  usos: string[];
  descricao: string;
  orixas: string[];
  imagem?: string;
  terreiroId: string;
}

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

const Ervas = () => {
  const [busca, setBusca] = useState('');
  const [ervas, setErvas] = useState<Erva[]>([]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const terreiroId = user.terreiroId;
    if (!terreiroId) return;

    fetch(`${API_URL}/ervas?terreiroId=${terreiroId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setErvas(data));

    const socket = connectSocket(terreiroId);
    socket.on('ervaCreated', (erva: Erva) => setErvas(prev => [...prev, erva]));
    socket.on('ervaUpdated', (erva: Erva) => setErvas(prev => prev.map(e => e.id === erva.id ? erva : e)));
    socket.on('ervaDeleted', ({ id }: { id: string }) => setErvas(prev => prev.filter(e => e.id !== id)));
    return () => {
      socket.off('ervaCreated');
      socket.off('ervaUpdated');
      socket.off('ervaDeleted');
      disconnectSocket();
    };
  }, []);

  const ervasFiltradas = ervas.filter(
    (erva) =>
      erva.nome.toLowerCase().includes(busca.toLowerCase()) ||
      erva.nomeCientifico.toLowerCase().includes(busca.toLowerCase()) ||
      erva.orixas.some(o => o.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-bold mt-8 mb-1">Ervas</h1>
      <p className="text-gray-600 mb-6">Explore nosso catálogo de ervas sagradas, suas propriedades e usos nos trabalhos espirituais.</p>
      {/* Barra de busca */}
      <div className="relative mt-6 mb-10 flex justify-start">
        <div className="w-full max-w-[340px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-terreiro-500" />
          <Input
            type="text"
            placeholder="Buscar por nome, nome científico ou orixá..."
            className="pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 shadow-sm focus:border-terreiro-500 focus:ring-terreiro-500"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
      </div>
      {/* Cards de ervas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ervasFiltradas.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">Nenhuma erva encontrada.</div>
        ) : (
          ervasFiltradas.map((erva) => (
            <div key={erva.id} className="bg-white border rounded-xl p-5 shadow-sm flex flex-col h-full justify-between">
              <div>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h2 className="font-bold text-lg leading-tight mb-0.5">{erva.nome}</h2>
                    <p className="text-xs italic text-gray-500 mb-2">{erva.nomeCientifico}</p>
                  </div>
                  <Leaf className="h-5 w-5 text-green-600 mt-1" />
                </div>
                <p className="text-sm text-gray-700 mb-3">{erva.descricao}</p>
                <div className="mb-2">
                  <span className="font-semibold text-xs">Propriedades:</span>
                  <span className="ml-1">
                    {erva.propriedades.map((prop, idx) => (
                      <Badge key={idx} className="mr-1 mb-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 font-normal rounded-full">{prop}</Badge>
                    ))}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-xs">Usos:</span>
                  <span className="ml-1">
                    {erva.usos.map((uso, idx) => (
                      <Badge key={idx} className="mr-1 mb-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 font-normal rounded-full">{uso}</Badge>
                    ))}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-xs">Orixás associados:</span>
                  <span className="ml-1">
                    {erva.orixas.map((orixa, idx) => (
                      <Badge key={idx} className="mr-1 mb-1 px-2 py-0.5 text-xs bg-black text-white font-semibold rounded-full">{orixa}</Badge>
                    ))}
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <Button variant="outline" size="sm" className="gap-1 text-gray-700 border-gray-300 hover:bg-gray-50">
                  <Info className="h-4 w-4" />
                  Detalhes
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Ervas;

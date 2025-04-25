import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Leaf, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Erva {
  id: number;
  nome: string;
  nomeCientifico: string;
  propriedades: string[];
  usos: string[];
  descricao: string;
  orixas: string[];
  imagem?: string;
}

const Ervas = () => {
  const [busca, setBusca] = useState('');
  
  // Lista mockada de ervas
  const [ervas] = useState<Erva[]>([
    {
      id: 1,
      nome: 'Arruda',
      nomeCientifico: 'Ruta graveolens',
      propriedades: ['Proteção', 'Limpeza'],
      usos: ['Banhos', 'Defumação', 'Amacis'],
      descricao: 'Erva muito utilizada para proteção espiritual e afastamento de energias negativas. Seu aroma forte é característico.',
      orixas: ['Ogum', 'Oxóssi']
    },
    {
      id: 2,
      nome: 'Guiné',
      nomeCientifico: 'Petiveria alliacea',
      propriedades: ['Proteção', 'Descarrego'],
      usos: ['Banhos', 'Defumação', 'Sacudimentos'],
      descricao: 'Também conhecida como "tipi" ou "erva-de-tipi", é usada para afastar energias negativas e proteger contra magias.',
      orixas: ['Oxóssi', 'Obaluaê']
    },
    {
      id: 3,
      nome: 'Alecrim',
      nomeCientifico: 'Rosmarinus officinalis',
      propriedades: ['Purificação', 'Limpeza', 'Amor'],
      usos: ['Banhos', 'Chás', 'Defumação'],
      descricao: 'Erva com forte aroma, usada para purificação de ambientes e abertura dos caminhos. Também associada ao amor.',
      orixas: ['Oxalá', 'Iansã']
    },
    {
      id: 4,
      nome: 'Manjericão',
      nomeCientifico: 'Ocimum basilicum',
      propriedades: ['Prosperidade', 'Amor'],
      usos: ['Banhos', 'Defumação'],
      descricao: 'Erva usada para atrair prosperidade e amor. Seu aroma atrai energias positivas.',
      orixas: ['Oxum', 'Logun Edé']
    },
    {
      id: 5,
      nome: 'Espada de São Jorge',
      nomeCientifico: 'Sansevieria trifasciata',
      propriedades: ['Proteção', 'Defesa'],
      usos: ['Amacis', 'Proteção Residencial'],
      descricao: 'Planta usada para proteção espiritual. Como o próprio nome indica, funciona como uma "espada" contra energias negativas.',
      orixas: ['Ogum', 'Obaluaê']
    },
    {
      id: 6,
      nome: 'Alfazema',
      nomeCientifico: 'Lavandula angustifolia',
      propriedades: ['Harmonização', 'Paz', 'Tranquilidade'],
      usos: ['Banhos', 'Defumação'],
      descricao: 'Erva aromática usada para trazer paz e tranquilidade. Muito utilizada em banhos ritualísticos.',
      orixas: ['Oxalá', 'Iemanjá']
    }
  ]);

  // Filtrar ervas baseado na busca
  const ervasFiltradas = ervas.filter(erva => 
    erva.nome.toLowerCase().includes(busca.toLowerCase()) ||
    erva.nomeCientifico.toLowerCase().includes(busca.toLowerCase()) ||
    erva.orixas.some(orixa => orixa.toLowerCase().includes(busca.toLowerCase()))
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

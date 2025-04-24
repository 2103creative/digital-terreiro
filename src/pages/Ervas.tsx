import { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <MainLayout title="Catálogo de Ervas">
      <p className="text-terreiro-600 mb-6">
        Explore nosso catálogo de ervas sagradas, suas propriedades e usos nos trabalhos espirituais.
      </p>
      {/* Barra de busca */}
      <div className="relative mt-6 mb-10">
        <Search className="absolute left-3 top-3 h-4 w-4 text-terreiro-500" />
        <Input
          placeholder="Buscar por nome, nome científico ou orixá..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-10 pr-4 py-2"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ervasFiltradas.length > 0 ? (
          ervasFiltradas.map((erva) => (
            <Card key={erva.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-serif">{erva.nome}</CardTitle>
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm italic text-terreiro-500">{erva.nomeCientifico}</p>
              </CardHeader>
              <CardContent>
                <p className="text-terreiro-600 mb-4">{erva.descricao}</p>
                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-1.5">Propriedades:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {erva.propriedades.map((prop, idx) => (
                      <Badge key={idx} variant="outline">{prop}</Badge>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-1.5">Usos:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {erva.usos.map((uso, idx) => (
                      <Badge key={idx} variant="secondary">{uso}</Badge>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1.5">Orixás associados:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {erva.orixas.map((orixa, idx) => (
                      <Badge key={idx}>{orixa}</Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>Detalhes</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center p-8 border rounded-md">
            <p className="text-terreiro-500">
              Nenhuma erva encontrada para a sua busca. Tente outros termos.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Ervas;

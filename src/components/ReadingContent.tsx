import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Bookmark, Download, Book, Eye } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Dados de exemplo para materiais de leitura
const readingMaterials = {
  umbanda: [
    {
      id: 1,
      title: "Fundamentos da Umbanda",
      description: "Conheça os princípios básicos da religião de Umbanda",
      type: "e-book",
      pages: 45,
      progress: 100,
      status: "Concluído",
      coverImage: "/placeholder-book.jpg",
    },
    {
      id: 2,
      title: "Guia dos Orixás",
      description: "Aprenda sobre os Orixás e suas características",
      type: "e-book",
      pages: 120,
      progress: 65,
      status: "Em progresso",
      coverImage: "/placeholder-book.jpg",
    },
    {
      id: 3,
      title: "Pontos Riscados",
      description: "Significado e aplicação dos pontos riscados na umbanda",
      type: "e-book",
      pages: 80,
      progress: 0,
      status: "Não iniciado",
      coverImage: "/placeholder-book.jpg",
    },
    {
      id: 4,
      title: "Ervas Sagradas",
      description: "Guia completo sobre ervas sagradas e seus usos rituais",
      type: "e-book",
      pages: 150,
      progress: 25,
      status: "Em progresso",
      coverImage: "/placeholder-book.jpg",
    },
  ],
  nacao: [
    {
      id: 5,
      title: "Candomblé: Tradição e Rituais",
      description: "Tradição africana e rituais do candomblé de ketu",
      type: "e-book",
      pages: 200,
      progress: 30,
      status: "Em progresso",
      coverImage: "/placeholder-book.jpg",
    },
    {
      id: 6,
      title: "Yorùbá para Iniciantes",
      description: "Guia básico de introdução à língua yorùbá",
      type: "e-book",
      pages: 85,
      progress: 0,
      status: "Não iniciado",
      coverImage: "/placeholder-book.jpg",
    },
    {
      id: 7,
      title: "Oriki e Cantigas",
      description: "Coletânea de orikis e cantigas tradicionais",
      type: "e-book",
      pages: 90,
      progress: 15,
      status: "Em progresso",
      coverImage: "/placeholder-book.jpg",
    },
    {
      id: 8,
      title: "Comidas de Santo",
      description: "Receitas tradicionais para os orixás",
      type: "e-book",
      pages: 120,
      progress: 60,
      status: "Em progresso",
      coverImage: "/placeholder-book.jpg",
    },
  ],
};

const ReadingContent = () => {
  const renderBookStatus = (progress: number) => {
    if (progress === 0) return <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">Não iniciado</Badge>;
    if (progress === 100) return <Badge variant="secondary" className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5">Concluído</Badge>;
    return <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5">{progress}% lido</Badge>;
  };

  const renderReadingMaterials = (materials: typeof readingMaterials.umbanda) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => (
          <div key={material.id} className="bg-white border rounded-xl p-5 shadow-sm flex flex-col h-full justify-between cursor-pointer hover:shadow-lg transition-shadow">
            <div>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="font-bold text-lg leading-tight mb-0.5">{material.title}</h2>
                  <p className="text-xs italic text-gray-500 mb-2">{material.type === 'e-book' ? 'E-book' : material.type}</p>
                </div>
                <BookOpen className="h-5 w-5 text-primary mt-1" />
              </div>
              <p className="text-sm text-gray-700 mb-3">{material.description}</p>
              <div className="mb-2">
                <span className="font-semibold text-xs">Páginas:</span>
                <span className="ml-1 inline-block mr-1 mb-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 font-normal rounded-full">{material.pages}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-xs">Status:</span>
                <span className="ml-1 inline-block mr-1 mb-1 px-2 py-0.5 text-xs bg-black text-white font-semibold rounded-full">{material.status}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-xs">Progresso:</span>
                <span className="ml-1">
                  <Progress value={material.progress} className="h-1.5 w-24 inline-block align-middle mr-2" />
                  <span className="text-xs align-middle">{material.progress}%</span>
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-gray-700 border-gray-300 px-3 py-1 text-xs flex items-center"
                onClick={() => window.open('/Os_Nago_e_a_Morte.pdf', '_blank')}
              >
                <BookOpen className="h-4 w-4 mr-1" />
                {material.progress === 0 ? 'Ler' : 'Continuar'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-gray-700 border-gray-300 px-3 py-1 text-xs flex items-center"
              >
                <Download className="h-4 w-4 mr-1" />
                Baixar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-gray-700 border-gray-300 px-3 py-1 text-xs flex items-center"
              >
                <Bookmark className="h-4 w-4 mr-1" />
                Salvar
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">Leitura</h1>
      <p className="text-xs md:text-sm text-gray-500 mb-6">Clique em um material para abrir e ler o documento completo.</p>
      {renderReadingMaterials([...readingMaterials.umbanda, ...readingMaterials.nacao])}
    </div>
  );
};

export default ReadingContent;

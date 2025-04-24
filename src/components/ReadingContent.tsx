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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {materials.map((material) => (
          <Card
            key={material.id}
            className="overflow-hidden h-full cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => window.open("/Os_Nago_e_a_Morte.pdf", "_blank")}
          >
            <CardContent className="p-0 h-full">
              <div className="p-3 flex flex-col h-full">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 text-primary mr-1.5" />
                    <h3 className="text-sm font-medium">{material.title}</h3>
                  </div>
                  <Badge className="bg-indigo-50 text-indigo-700 text-[10px] px-1.5 py-0.5 ml-1">E-Book</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{material.description}</p>
                <div className="text-xs text-muted-foreground mb-2">{material.pages} páginas</div>
                <Progress value={material.progress} className="h-1.5 mb-2" />
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <div>{renderBookStatus(material.progress)}</div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <Download className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                      <Book className="h-3.5 w-3.5 mr-1" />
                      {material.progress === 0 ? "Ler" : "Continuar"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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

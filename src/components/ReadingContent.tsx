
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, Bookmark, Download, BookOpen, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CardIcon } from "@/components/ui/CardIcon";

// Sample reading content
const readings = {
  umbanda: [
    {
      id: 1,
      title: "Fundamentos da Umbanda",
      description: "Conheça os princípios básicos da religião de Umbanda",
      progress: 100,
      pages: 45,
      type: "e-book",
    },
    {
      id: 2,
      title: "Guia dos Orixás",
      description: "Aprenda sobre os Orixás e suas características",
      progress: 65,
      pages: 120,
      type: "e-book",
    },
    {
      id: 3,
      title: "Pontos Riscados",
      description: "O significado dos símbolos sagrados",
      progress: 0,
      pages: 78,
      type: "e-book",
    },
  ],
  nacao: [
    {
      id: 4,
      title: "Iniciação ao Candomblé",
      description: "Os primeiros passos na Nação",
      progress: 30,
      pages: 90,
      type: "doutrina",
    },
    {
      id: 5,
      title: "Rituais e Obrigações",
      description: "O calendário ritualístico e suas obrigações",
      progress: 0,
      pages: 65,
      type: "doutrina",
    },
  ],
};

const ReadingContent = () => {
  const [activeTab, setActiveTab] = useState("umbanda");
  const { toast } = useToast();

  const handleBookAction = (book: any, action: string) => {
    switch (action) {
      case "read":
        toast({
          title: `Lendo: ${book.title}`,
          description: "Conteúdo em desenvolvimento. Em breve!",
        });
        break;
      case "save":
        toast({
          title: "Salvo para leitura offline",
          description: `${book.title} está disponível offline agora`,
        });
        break;
      case "download":
        toast({
          title: "Download iniciado",
          description: `${book.title} está sendo baixado`,
        });
        break;
    }
  };

  const renderBooks = (books: any[]) => {
    return books.map((book) => (
      <Card key={book.id} className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CardIcon variant={book.type === "e-book" ? "primary" : "secondary"}>
                {book.type === "e-book" ? 
                  <BookOpen className="h-4 w-4" /> : 
                  <Book className="h-4 w-4" />
                }
              </CardIcon>
              <CardTitle className="text-base font-medium">{book.title}</CardTitle>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary-foreground font-medium">
              {book.type === "e-book" ? "E-Book" : "Doutrina"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-4 py-2">
          <p className="text-sm text-muted-foreground mb-3">{book.description}</p>
          <div className="flex items-center justify-between text-xs">
            <span>{book.pages} páginas</span>
            <span className="font-medium">
              {book.progress > 0 
                ? book.progress === 100 
                  ? "Concluído" 
                  : `${book.progress}% lido` 
                : "Não iniciado"}
            </span>
          </div>
          {book.progress > 0 && (
            <div className="w-full h-1.5 bg-secondary/20 rounded-full mt-2">
              <div 
                className="h-full bg-primary rounded-full" 
                style={{ width: `${book.progress}%` }}
              ></div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between p-4 pt-2 border-t border-gray-100">
          <Button 
            variant={book.progress === 100 ? "outline" : "default"}
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => handleBookAction(book, "read")}
          >
            <BookOpenCheck className="h-3.5 w-3.5" />
            {book.progress > 0 && book.progress < 100 ? "Continuar" : "Ler"}
          </Button>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => handleBookAction(book, "save")}
            >
              <Bookmark className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => handleBookAction(book, "download")}
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    ));
  };

  return (
    <div className="space-y-6 pb-16">
      <Tabs defaultValue="umbanda" onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full grid grid-cols-2">
          <TabsTrigger value="umbanda">Umbanda</TabsTrigger>
          <TabsTrigger value="nacao">Nação</TabsTrigger>
        </TabsList>
        
        <TabsContent value="umbanda" className="space-y-4">
          <h3 className="text-lg font-semibold">Conhecimento de Umbanda</h3>
          {renderBooks(readings.umbanda)}
        </TabsContent>
        
        <TabsContent value="nacao" className="space-y-4">
          <h3 className="text-lg font-semibold">Doutrinas de Nação</h3>
          {renderBooks(readings.nacao)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReadingContent;


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Book, Users, Calendar, Star, BookOpen } from "lucide-react";

const DashboardHighlights = () => {
  // Get user from localStorage (in a real app, this would come from a proper auth system)
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : { name: "Usuário", avatar: "/placeholder.svg" };
  
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-4 pb-16">
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-bold mb-0.5">Ylê Umbanda</h1>
        <div className="flex justify-between w-full max-w-md">
          <span className="font-medium">Destaques</span>
          <div className="flex gap-2">
            <span>Eventos</span>
            <span>Giras</span>
            <span>Mensagens</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-3">
        <Avatar className="h-12 w-12 border-2 border-primary">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">Bem-vindo(a), {firstName}</p>
          <p className="text-sm text-muted-foreground">Médium em Desenvolvimento</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold mb-1">Próximos Eventos</h2>
        <Separator className="mb-2" />
        
        <div className="space-y-2">
          <Card className="border-0 shadow-none">
            <CardContent className="p-2 flex justify-between items-center">
              <div>
                <p className="font-medium">Gira de Pretos Velhos</p>
                <p className="text-xs text-muted-foreground">Sábado, 20 de Maio • 20:00</p>
              </div>
              <Calendar className="h-5 w-5" />
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-none">
            <CardContent className="p-2 flex justify-between items-center">
              <div>
                <p className="font-medium">Desenvolvimento Mediúnico</p>
                <p className="text-xs text-muted-foreground">Terça, 23 de Maio • 20:00</p>
              </div>
              <Calendar className="h-5 w-5" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold mb-1">Atividades Recentes</h2>
        <Separator className="mb-2" />
        
        <div className="space-y-2">
          <Card className="border-0 shadow-none">
            <CardContent className="p-2 flex justify-between items-center">
              <div>
                <p className="font-medium">Leitura concluída</p>
                <p className="text-xs text-muted-foreground">Fundamentos da Umbanda</p>
              </div>
              <BookOpen className="h-5 w-5" />
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-none">
            <CardContent className="p-2 flex justify-between items-center">
              <div>
                <p className="font-medium">Participação em Gira</p>
                <p className="text-xs text-muted-foreground">Gira de Caboclos</p>
              </div>
              <Users className="h-5 w-5" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold mb-1">Desenvolvimento Espiritual</h2>
        <Separator className="mb-3" />
        
        <div className="grid grid-cols-2 gap-4">
          <Card className="py-3 px-4 text-center">
            <Star className="mx-auto h-5 w-5 mb-1" />
            <p className="text-xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Giras</p>
          </Card>
          
          <Card className="py-3 px-4 text-center">
            <Book className="mx-auto h-5 w-5 mb-1" />
            <p className="text-xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Estudos</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardHighlights;

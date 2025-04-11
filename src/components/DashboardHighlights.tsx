import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Users, Calendar, Star, BookOpen } from "lucide-react";

const DashboardHighlights = () => {
  const navigate = useNavigate();
  // Get user from localStorage (in a real app, this would come from a proper auth system)
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : { name: "Maria", avatar: "/placeholder.svg" };
  
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-4 pb-16">
      <div>
        <div className="flex justify-center gap-4 border-b pb-1">
          <button 
            className="font-medium text-primary border-b-2 border-primary pb-1 px-1"
            onClick={() => navigate("/dashboard")}
          >
            Destaques
          </button>
          <button 
            className="text-muted-foreground"
            onClick={() => navigate("/eventos")}
          >
            Eventos
          </button>
          <button 
            className="text-muted-foreground"
            onClick={() => navigate("/leitura")}
          >
            Leitura
          </button>
          <button 
            className="text-muted-foreground"
            onClick={() => navigate("/mensagens")}
          >
            Mensagens
          </button>
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
        <h2 className="font-semibold mb-2">Próximos Eventos</h2>
        
        <div className="space-y-3">
          <Card className="rounded-lg border shadow-sm">
            <CardContent className="p-3 flex justify-between items-center">
              <div>
                <p className="font-medium">Gira de Pretos Velhos</p>
                <p className="text-xs text-muted-foreground">Sábado, 20 de Maio • 9:00</p>
              </div>
              <Calendar className="h-5 w-5 text-gray-400" />
            </CardContent>
          </Card>
          
          <Card className="rounded-lg border shadow-sm">
            <CardContent className="p-3 flex justify-between items-center">
              <div>
                <p className="font-medium">Desenvolvimento Mediúnico</p>
                <p className="text-xs text-muted-foreground">Terça, 23 de Maio • 20:00</p>
              </div>
              <Calendar className="h-5 w-5 text-gray-400" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="font-semibold mb-2">Atividades Recentes</h2>
        
        <div className="space-y-3">
          <Card className="rounded-lg border shadow-sm">
            <CardContent className="p-3 flex justify-between items-center">
              <div>
                <p className="font-medium">Leitura concluída</p>
                <p className="text-xs text-muted-foreground">Fundamentos da Umbanda</p>
              </div>
              <BookOpen className="h-5 w-5 text-gray-400" />
            </CardContent>
          </Card>
          
          <Card className="rounded-lg border shadow-sm">
            <CardContent className="p-3 flex justify-between items-center">
              <div>
                <p className="font-medium">Participação em Gira</p>
                <p className="text-xs text-muted-foreground">Gira de Caboclos</p>
              </div>
              <Users className="h-5 w-5 text-gray-400" />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="font-semibold mb-2">Desenvolvimento Espiritual</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <Card className="rounded-lg border shadow-sm py-3 px-4 text-center">
            <Star className="mx-auto h-5 w-5 mb-1 text-gray-400" />
            <p className="text-xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Giras</p>
          </Card>
          
          <Card className="rounded-lg border shadow-sm py-3 px-4 text-center">
            <Book className="mx-auto h-5 w-5 mb-1 text-gray-400" />
            <p className="text-xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Estudos</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardHighlights;


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, BookMarked } from "lucide-react";

const DashboardHighlights = () => {
  // Get user from localStorage (in a real app, this would come from a proper auth system)
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : { name: "Usuário", avatar: "/placeholder.svg" };
  
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold">Bem-vindo(a), {firstName}</h2>
          <p className="text-muted-foreground">Seu caminho espiritual continua</p>
        </div>
      </div>

      <section>
        <h3 className="text-lg font-semibold mb-3">Próximos Eventos</h3>
        <div className="grid gap-4">
          {[
            { title: "Gira de Pretos Velhos", date: "15/10 - 20h", icon: Users },
            { title: "Desenvolvimento Mediúnico", date: "22/10 - 19h", icon: Users },
          ].map((event, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-secondary">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">Atividades Recentes</h3>
        <div className="grid gap-4">
          {[
            { title: "Fundamentos da Umbanda", subtitle: "Você concluiu a leitura", icon: BookMarked },
            { title: "Gira de Caboclos", subtitle: "Você participou desta gira", icon: Users },
          ].map((activity, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-full bg-secondary">
                  <activity.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">Desenvolvimento Espiritual</h3>
        <div className="grid gap-4">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-base">Obrigação de Mata</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Mesas apresentadas: 3/7</p>
              <div className="w-full h-2 bg-secondary rounded-full mt-2">
                <div className="h-full w-[42%] bg-primary rounded-full"></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-base">Obrigação de Santo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Tipo de obrigação: Cabeça</p>
              <p className="text-sm text-muted-foreground mt-1">Data prevista: 05/12/2025</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DashboardHighlights;

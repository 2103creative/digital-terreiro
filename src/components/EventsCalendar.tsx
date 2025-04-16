
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample event data
const events = [
  { date: new Date(2025, 3, 15), title: "Gira de Pretos Velhos", type: "gira", time: "20:00" },
  { date: new Date(2025, 3, 22), title: "Desenvolvimento Mediúnico", type: "curso", time: "19:00" },
  { date: new Date(2025, 3, 29), title: "Gira de Caboclos", type: "gira", time: "20:00" },
  { date: new Date(2025, 4, 5), title: "Festa de Xangô", type: "festa", time: "18:00" },
  { date: new Date(2025, 4, 12), title: "Curso de Umbanda", type: "curso", time: "14:00" },
];

const EventsCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeFilter, setActiveFilter] = useState("todos");
  const { toast } = useToast();

  // Get events for the selected date
  const getDayEvents = (day: Date | undefined) => {
    if (!day) return [];
    
    return events.filter(event => {
      return event.date.getDate() === day.getDate() && 
             event.date.getMonth() === day.getMonth() &&
             event.date.getFullYear() === day.getFullYear() &&
             (activeFilter === "todos" || event.type === activeFilter);
    });
  };

  const selectedDateEvents = getDayEvents(date);

  // Get dates that have events for the calendar
  const eventDates = events
    .filter(event => activeFilter === "todos" || event.type === activeFilter)
    .map(event => event.date);

  const handleSubscribe = (eventTitle: string) => {
    toast({
      title: "Inscrição confirmada",
      description: `Você receberá notificações para: ${eventTitle}`,
    });
  };

  // Function to render the badge for event type
  const renderEventTypeBadge = (type: string) => {
    switch (type) {
      case "gira":
        return <Badge>Gira</Badge>;
      case "festa":
        return <Badge variant="secondary">Festa</Badge>;
      case "curso":
        return <Badge variant="outline">Curso</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <Tabs defaultValue="todos" onValueChange={setActiveFilter}>
        <TabsList className="mb-4">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="gira">Giras</TabsTrigger>
          <TabsTrigger value="festa">Festas</TabsTrigger>
          <TabsTrigger value="curso">Cursos</TabsTrigger>
        </TabsList>
      </Tabs>

      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        modifiers={{
          event: eventDates,
        }}
        modifiersStyles={{
          event: { textDecoration: "underline", fontWeight: "bold" }
        }}
      />

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">
          {date ? (
            <>Eventos para {date.toLocaleDateString('pt-BR')}</>
          ) : (
            <>Selecione uma data</>
          )}
        </h3>

        {selectedDateEvents.length > 0 ? (
          <div className="space-y-3">
            {selectedDateEvents.map((event, index) => (
              <Card key={index} className="card-hover">
                <CardHeader className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{event.title}</CardTitle>
                    {renderEventTypeBadge(event.type)}
                  </div>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Horário: {event.time}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2"
                      onClick={() => handleSubscribe(event.title)}
                    >
                      <Bell className="h-4 w-4 mr-1" />
                      Notificar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Não há eventos para esta data.</p>
        )}
      </div>
    </div>
  );
};

export default EventsCalendar;

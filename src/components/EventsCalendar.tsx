
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

  // Function to get icon for event type
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "gira":
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case "festa":
        return <Calendar className="h-5 w-5 text-green-600" />;
      case "curso":
        return <Calendar className="h-5 w-5 text-purple-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };
  
  // Function to get color for event type indicator
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "gira":
        return "bg-blue-500";
      case "festa":
        return "bg-green-500";
      case "curso":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {selectedDateEvents.map((event, index) => (
              <Card 
                key={index} 
                className="bg-white border border-gray-100 rounded-lg aspect-square hover:shadow-sm cursor-pointer transition-shadow"
              >
                <div className="flex flex-col h-full p-2 relative">
                  {/* Ícone do tipo de evento no canto superior esquerdo */}
                  <div className="absolute top-2 left-2">
                    {getEventTypeIcon(event.type)}
                  </div>
                  
                  {/* Horário do evento no canto superior direito */}
                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] text-gray-500">
                      {event.time}
                    </span>
                  </div>
                  
                  {/* Título do evento centralizado */}
                  <div className="flex-1 flex items-center justify-center px-2">
                    <h3 className="text-xs font-medium text-gray-900 text-center line-clamp-3">{event.title}</h3>
                  </div>
                  
                  {/* Link de notificar no canto inferior esquerdo */}
                  <div className="absolute bottom-2 left-2 flex items-center text-[10px] text-blue-600" onClick={() => handleSubscribe(event.title)}>
                    <span>Notificar</span>
                    <Bell className="h-2.5 w-2.5 ml-0.5" />
                  </div>
                  
                  {/* Indicador de tipo no canto inferior direito */}
                  <div className="absolute bottom-2 right-2">
                    <div className={cn("h-3 w-3 rounded-full", getEventTypeColor(event.type))}></div>
                  </div>
                </div>
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

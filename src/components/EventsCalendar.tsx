
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, Calendar as CalendarIcon, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CardIcon } from "@/components/ui/CardIcon";

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
        return <Badge className="px-1.5 py-0.5 text-[10px]">Gira</Badge>;
      case "festa":
        return <Badge variant="secondary" className="px-1.5 py-0.5 text-[10px]">Festa</Badge>;
      case "curso":
        return <Badge variant="outline" className="px-1.5 py-0.5 text-[10px]">Curso</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <Tabs defaultValue="todos" onValueChange={setActiveFilter}>
        <TabsList className="mb-4 w-full grid grid-cols-4">
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
        className="rounded-md border shadow-sm"
        modifiers={{
          event: eventDates,
        }}
        modifiersStyles={{
          event: { textDecoration: "underline", fontWeight: "bold" }
        }}
      />

      <div className="mt-4">
        <h3 className="text-base font-medium mb-3">
          {date ? (
            <>Eventos para {date.toLocaleDateString('pt-BR')}</>
          ) : (
            <>Selecione uma data</>
          )}
        </h3>

        {selectedDateEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedDateEvents.map((event, index) => (
              <div key={index} className="list-card">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <CardIcon variant="primary" className="text-blue-600 bg-blue-50 mr-2 h-7 w-7">
                      <CalendarIcon className="h-3.5 w-3.5" />
                    </CardIcon>
                    <div>
                      <h4 className="text-sm font-medium">{event.title}</h4>
                      <div className="flex items-center text-[10px] text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                  {renderEventTypeBadge(event.type)}
                </div>
                <div className="mt-2 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => handleSubscribe(event.title)}
                  >
                    <Bell className="h-3 w-3 mr-1" />
                    Notificar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-6 bg-gray-50 rounded-lg border border-gray-100 text-sm">
            Não há eventos para esta data.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventsCalendar;

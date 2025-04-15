
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
        return <Badge className="px-2.5 py-1">Gira</Badge>;
      case "festa":
        return <Badge variant="secondary" className="px-2.5 py-1">Festa</Badge>;
      case "curso":
        return <Badge variant="outline" className="px-2.5 py-1">Curso</Badge>;
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
              <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center space-x-3">
                    <CardIcon variant="primary" className="text-blue-600 bg-blue-50">
                      <CalendarIcon className="h-4 w-4" />
                    </CardIcon>
                    <CardTitle className="text-base font-medium">{event.title}</CardTitle>
                  </div>
                  {renderEventTypeBadge(event.type)}
                </CardHeader>
                <CardContent className="py-2 px-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      <span>{event.time}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 gap-1.5 text-xs"
                      onClick={() => handleSubscribe(event.title)}
                    >
                      <Bell className="h-3.5 w-3.5" />
                      Notificar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
            Não há eventos para esta data.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventsCalendar;

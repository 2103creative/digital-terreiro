import { useState } from "react";
import { Calendar, PlusCircle, Edit, Trash2, ArrowLeftCircle, ArrowRight } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

// Interface para o modelo de Evento
interface Event {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  date: Date;
  type: "gira" | "festa" | "curso";
}

// Dados de exemplo dos eventos
const eventsData: Event[] = [
  {
    id: 1,
    title: "Gira de Caboclos",
    subtitle: "Força e proteção da natureza",
    description: "Gira aberta para todos os médiuns e consulentes. Trabalho de cura e orientação espiritual.",
    date: new Date(2025, 3, 15, 19, 0),
    type: "gira",
  },
  {
    id: 2,
    title: "Festa de Oxóssi",
    subtitle: "Celebração ao Orixá das matas",
    description: "Celebração anual em homenagem a Oxóssi, Orixá das matas e da caça. Traga flores, frutas e champagne.",
    date: new Date(2025, 4, 20, 16, 0),
    type: "festa",
  },
  {
    id: 3,
    title: "Curso de Desenvolvimento Mediúnico",
    subtitle: "Iniciante ao intermediário",
    description: "Curso voltado para médiuns iniciantes e em desenvolvimento. Serão abordados temas como concentração, sintonia e incorporação.",
    date: new Date(2025, 5, 5, 14, 0),
    type: "curso",
  },
  {
    id: 4,
    title: "Gira de Pretos Velhos",
    subtitle: "Sabedoria e acolhimento",
    description: "Gira dedicada aos Pretos Velhos. Traga velas brancas, café e fumo de corda para oferendas.",
    date: new Date(2025, 3, 30, 19, 0),
    type: "gira",
  },
];

const AdminEvents = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>(eventsData);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    subtitle: "",
    description: "",
    date: new Date(),
    type: "gira",
  });

  // Função para adicionar novo evento
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.type) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...events.map(e => e.id), 0) + 1;
    const eventToAdd: Event = {
      id: newId,
      title: newEvent.title,
      subtitle: newEvent.subtitle,
      description: newEvent.description!,
      date: newEvent.date!,
      type: newEvent.type as "gira" | "festa" | "curso",
    };

    setEvents([...events, eventToAdd]);
    setNewEvent({
      title: "",
      subtitle: "",
      description: "",
      date: new Date(),
      type: "gira",
    });
    setShowForm(false);

    toast({
      title: "Evento adicionado",
      description: `O evento "${eventToAdd.title}" foi adicionado com sucesso.`,
    });
  };

  // Função para editar evento
  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      subtitle: event.subtitle,
      description: event.description,
      date: event.date,
      type: event.type,
    });
    setShowForm(true);
  };

  // Função para atualizar evento
  const handleUpdateEvent = () => {
    if (!selectedEvent) return;
    
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.type) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const updatedEvents = events.map(e => 
      e.id === selectedEvent.id 
        ? { 
            ...e, 
            title: newEvent.title!, 
            subtitle: newEvent.subtitle, 
            description: newEvent.description!, 
            date: newEvent.date!,
            type: newEvent.type as "gira" | "festa" | "curso"
          } 
        : e
    );

    setEvents(updatedEvents);
    setNewEvent({
      title: "",
      subtitle: "",
      description: "",
      date: new Date(),
      type: "gira",
    });
    setSelectedEvent(null);
    setShowForm(false);

    toast({
      title: "Evento atualizado",
      description: `O evento "${newEvent.title}" foi atualizado com sucesso.`,
    });
  };

  // Função para confirmar exclusão
  const handleConfirmDelete = () => {
    if (!selectedEvent) return;
    
    const updatedEvents = events.filter(e => e.id !== selectedEvent.id);
    setEvents(updatedEvents);
    setShowDeleteDialog(false);
    setSelectedEvent(null);

    toast({
      title: "Evento excluído",
      description: `O evento "${selectedEvent.title}" foi excluído com sucesso.`,
    });
  };

  // Função para obter a cor da badge com base no tipo de evento
  const getEventTypeBadgeColor = (type: string) => {
    switch (type) {
      case "gira":
        return "bg-blue-100 text-blue-800";
      case "festa":
        return "bg-green-100 text-green-800";
      case "curso":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Função para obter o nome do tipo de evento
  const getEventTypeName = (type: string) => {
    switch (type) {
      case "gira":
        return "Gira";
      case "festa":
        return "Festa";
      case "curso":
        return "Curso";
      default:
        return type;
    }
  };

  // Ordenar eventos por data
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <AdminLayout pageTitle="Gerenciar Eventos" pageDescription="Administre os eventos do terreiro">
      {!showForm ? (
        <>
          <div className="flex justify-end items-center mb-6">
            <Button onClick={() => setShowForm(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-4 max-w-5xl">
            {sortedEvents.map(event => (
              <Card
                key={event.id}
                className="bg-white border border-gray-100 rounded-[15px] aspect-square hover:shadow-sm cursor-pointer transition-shadow w-[120px] h-[120px]"
                onClick={() => handleEditEvent(event)}
              >
                <div className="flex flex-col h-full p-3 relative">
                  {/* Ícone de evento no canto superior esquerdo */}
                  <div className="absolute top-3 left-3">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  {/* Nome do evento centralizado */}
                  <div className="flex-1 flex items-center justify-center">
                    <h3 className="text-xs font-medium text-gray-900 text-center line-clamp-2">{event.title}</h3>
                  </div>
                  {/* Link de editar no canto inferior esquerdo */}
                  <div className="absolute bottom-3 left-3 flex items-center text-xs text-blue-600"
                    onClick={e => { e.stopPropagation(); handleEditEvent(event); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>Editar</span>
                    <ArrowRight className="h-3 w-3 ml-0.5" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {events.length === 0 && (
            <div className="flex flex-col items-center justify-center p-10">
              <Calendar className="h-16 w-16 text-primary mb-4" />
              <p className="text-xl font-medium text-center">Nenhum evento encontrado</p>
              <p className="text-muted-foreground mt-2 text-center">
                Não existem eventos cadastrados. Clique em "Novo Evento" para adicionar.
              </p>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{selectedEvent ? 'Editar' : 'Novo'} Evento</CardTitle>
              <Button variant="outline" size="sm" onClick={() => {
                setShowForm(false);
                setSelectedEvent(null);
                setNewEvent({
                  title: "",
                  subtitle: "",
                  description: "",
                  date: new Date(),
                  type: "gira",
                });
              }}>
                <ArrowLeftCircle className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
            <CardDescription>
              {selectedEvent ? 'Edite as informações do evento' : 'Preencha as informações para adicionar um novo evento'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Título *</Label>
                  <Input
                    id="event-title"
                    placeholder="Ex: Gira de Caboclos"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-subtitle">Subtítulo</Label>
                  <Input
                    id="event-subtitle"
                    placeholder="Ex: Trabalho de cura e proteção"
                    value={newEvent.subtitle}
                    onChange={(e) => setNewEvent({...newEvent, subtitle: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-date">Data e Hora *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newEvent.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newEvent.date ? (
                          format(newEvent.date, "PPP 'às' HH:mm", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={newEvent.date}
                        onSelect={(date) => setNewEvent({...newEvent, date: date || new Date()})}
                        initialFocus
                        locale={ptBR}
                      />
                      <div className="p-3 border-t border-border">
                        <Label htmlFor="event-time" className="mb-2 block">Horário</Label>
                        <Input 
                          id="event-time"
                          type="time"
                          value={newEvent.date ? format(newEvent.date, "HH:mm") : "19:00"}
                          onChange={(e) => {
                            if (newEvent.date) {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = new Date(newEvent.date);
                              newDate.setHours(parseInt(hours, 10));
                              newDate.setMinutes(parseInt(minutes, 10));
                              setNewEvent({...newEvent, date: newDate});
                            }
                          }}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-type">Tipo de Evento *</Label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value) => setNewEvent({...newEvent, type: value as "gira" | "festa" | "curso"})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gira">Gira</SelectItem>
                      <SelectItem value="festa">Festa</SelectItem>
                      <SelectItem value="curso">Curso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-description">Descrição *</Label>
                <Textarea
                  id="event-description"
                  placeholder="Descreva detalhadamente este evento, incluindo informações importantes para os participantes"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  rows={5}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowForm(false);
                setSelectedEvent(null);
                setNewEvent({
                  title: "",
                  subtitle: "",
                  description: "",
                  date: new Date(),
                  type: "gira",
                });
              }}
            >
              Cancelar
            </Button>
            {selectedEvent && (
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                Excluir
              </Button>
            )}
            <Button onClick={selectedEvent ? handleUpdateEvent : handleAddEvent}>
              {selectedEvent ? 'Atualizar Evento' : 'Adicionar Evento'}
            </Button>
          </CardFooter>
        </Card>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o evento "{selectedEvent?.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminEvents;
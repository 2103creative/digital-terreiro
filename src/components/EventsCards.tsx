import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { connectSocket, disconnectSocket } from "@/lib/socket";

interface Event {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  tipo: "gira" | "festa" | "curso";
  terreiroId: string;
}

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

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

const EventsCards = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const terreiroId = user.terreiroId;
    if (!terreiroId) return;

    fetch(`${API_URL}/eventos?terreiroId=${terreiroId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setEvents(data));

    const socket = connectSocket(terreiroId);
    socket.on('eventoCreated', (evento: Event) => setEvents(prev => [...prev, evento]));
    socket.on('eventoUpdated', (evento: Event) => setEvents(prev => prev.map(e => e.id === evento.id ? evento : e)));
    socket.on('eventoDeleted', ({ id }: { id: string }) => setEvents(prev => prev.filter(e => e.id !== id)));
    return () => {
      socket.off('eventoCreated');
      socket.off('eventoUpdated');
      socket.off('eventoDeleted');
      disconnectSocket();
    };
  }, []);

  const handleCardClick = (event: Event) => {
    setSelectedEvent(event);
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3500);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, idx) => (
          <div key={event.id} className="bg-white border rounded-xl p-5 shadow-sm flex flex-col h-full justify-between cursor-pointer hover:shadow-lg transition-shadow">
            <div>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="font-bold text-lg leading-tight mb-0.5">{event.titulo}</h2>
                  <p className="text-xs italic text-gray-500 mb-2">{renderEventTypeBadge(event.tipo)}</p>
                </div>
                <Bell className="h-5 w-5 text-primary mt-1" />
              </div>
              <p className="text-sm text-gray-700 mb-3">{event.descricao}</p>
              <div className="mb-2">
                <span className="font-semibold text-xs">Data:</span>
                <span className="ml-1 inline-block mr-1 mb-1 px-2 py-0.5 text-xs bg-black text-white font-semibold rounded-full">{new Date(event.data).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button className="gap-1 text-gray-700 border border-gray-300 rounded-md px-3 py-1 text-xs hover:bg-gray-50 flex items-center" onClick={() => handleCardClick(event)}>
                Quero ser avisado <Bell className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {showNotif && selectedEvent && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in">
          Você será avisado sobre o evento: <b>{selectedEvent.titulo}</b>
        </div>
      )}
    </>
  );
};

export default EventsCards;

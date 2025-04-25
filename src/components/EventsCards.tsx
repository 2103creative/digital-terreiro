import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

// Sample event data (should be imported/shared in real project)
const events = [
  { date: new Date(2025, 3, 15), title: "Gira de Pretos Velhos", type: "gira", time: "20:00", description: "Celebração tradicional com Pretos Velhos." },
  { date: new Date(2025, 3, 22), title: "Desenvolvimento Mediúnico", type: "curso", time: "19:00", description: "Curso especial para médiuns iniciantes." },
  { date: new Date(2025, 3, 29), title: "Gira de Caboclos", type: "gira", time: "20:00", description: "Trabalho espiritual com Caboclos." },
  { date: new Date(2025, 4, 5), title: "Festa de Xangô", type: "festa", time: "18:00", description: "Festa em homenagem a Xangô." },
  { date: new Date(2025, 4, 12), title: "Curso de Umbanda", type: "curso", time: "14:00", description: "Curso sobre fundamentos da Umbanda." },
];

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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showNotif, setShowNotif] = useState(false);

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3500);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, idx) => (
          <div key={idx} className="bg-white border rounded-xl p-5 shadow-sm flex flex-col h-full justify-between cursor-pointer hover:shadow-lg transition-shadow">
            <div>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="font-bold text-lg leading-tight mb-0.5">{event.title}</h2>
                  <p className="text-xs italic text-gray-500 mb-2">{event.type === 'gira' ? 'Gira' : event.type === 'festa' ? 'Festa' : 'Curso'}</p>
                </div>
                <Bell className="h-5 w-5 text-primary mt-1" />
              </div>
              <p className="text-sm text-gray-700 mb-3">{event.description}</p>
              <div className="mb-2">
                <span className="font-semibold text-xs">Horário:</span>
                <span className="ml-1 inline-block mr-1 mb-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 font-normal rounded-full">{event.time}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-xs">Data:</span>
                <span className="ml-1 inline-block mr-1 mb-1 px-2 py-0.5 text-xs bg-black text-white font-semibold rounded-full">{event.date.toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button className="gap-1 text-gray-700 border border-gray-300 rounded-md px-3 py-1 text-xs hover:bg-gray-50 flex items-center" onClick={() => handleCardClick(event)}>
                Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
      {showNotif && selectedEvent && (
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[260px] animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-base text-gray-800">{selectedEvent.title}</span>
            {renderEventTypeBadge(selectedEvent.type)}
          </div>
          <div className="text-xs text-gray-500 mb-1">Horário: {selectedEvent.time}</div>
          <div className="text-xs text-gray-700 mb-2">{selectedEvent.description}</div>
        </div>
      )}
    </>
  );
};

export default EventsCards;

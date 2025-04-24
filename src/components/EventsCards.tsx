import { useState } from "react";
import { Card } from "@/components/ui/card";
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {events.map((event, idx) => (
          <Card
            key={idx}
            className="overflow-hidden h-full cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick(event)}
          >
            <div className="p-3 flex flex-col h-full">
              <div className="mb-2 flex items-start justify-between">
                <span className="font-semibold text-sm text-gray-800">{event.title}</span>
                {renderEventTypeBadge(event.type)}
              </div>
              <div className="flex justify-between items-end mt-auto">
                <span className="text-xs text-gray-500 font-medium">{event.time}</span>
                <Bell className="h-4 w-4 text-gray-400 hover:text-blue-500 cursor-pointer" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      {showNotif && selectedEvent && (
        <div className="fixed top-6 right-6 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[260px] animate-fade-in">
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

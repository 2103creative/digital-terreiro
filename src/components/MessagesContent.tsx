import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Calendar, 
  AlertTriangle, 
  Check, 
  Clock, 
  Bell, 
  Star,
  X 
} from "lucide-react";
import { formatDate } from "@/lib/utils";

// Custom event for message updates
const MESSAGE_UPDATE_EVENT = "message-update";

// Function to emit message updates
export const emitMessageUpdate = (count: number) => {
  const event = new CustomEvent(MESSAGE_UPDATE_EVENT, { detail: { count } });
  window.dispatchEvent(event);
};

// Hook to listen for message updates
export const useMessageUpdates = () => {
  const [messageCount, setMessageCount] = useState(0);
  
  useEffect(() => {
    // Check localStorage for unread messages
    const checkUnreadMessages = () => {
      try {
        const storageKey = "yle-axe-messages";
        const storedMessages = localStorage.getItem(storageKey);
        if (storedMessages) {
          const readStatus = JSON.parse(storedMessages);
          // Count messages that are not marked as read
          const unreadCount = Object.values(readStatus).filter(isRead => !isRead).length;
          setMessageCount(unreadCount);
        }
      } catch (error) {
        console.error("Error checking unread messages:", error);
      }
    };

    // Initial check
    checkUnreadMessages();
    
    // Listen for update events
    const handleMessageUpdate = (event: CustomEvent) => {
      const { count } = event.detail;
      setMessageCount(count);
    };
    
    window.addEventListener(MESSAGE_UPDATE_EVENT, handleMessageUpdate as EventListener);
    
    return () => {
      window.removeEventListener(MESSAGE_UPDATE_EVENT, handleMessageUpdate as EventListener);
    };
  }, []);
  
  return messageCount;
};

// Dados de exemplo para mensagens
const messages = [
  {
    id: 1,
    title: "Gira cancelada devido a chuva forte",
    content: "A gira de Pretos Velhos prevista para hoje às 20h foi cancelada devido a fortes chuvas na região. Remarcamos para a próxima semana.",
    date: new Date(2025, 3, 15),
    status: "urgente",
    read: false,
    sender: "Dirigente",
    category: "aviso",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
  },
  {
    id: 2,
    title: "Doações para festa de Oxum",
    content: "Estamos recebendo doações para a festa de Oxum que acontecerá no próximo mês. Itens necessários: frutas, mel, champanhe e flores amarelas.",
    date: new Date(2025, 3, 10),
    status: "normal",
    read: false,
    sender: "Secretaria",
    category: "evento",
    icon: Calendar,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
  },
  {
    id: 3,
    title: "Novo curso de desenvolvimento mediúnico",
    content: "Estamos abrindo inscrições para o novo curso de desenvolvimento mediúnico que começará em maio. Vagas limitadas.",
    date: new Date(2025, 3, 8),
    status: "normal",
    read: false,
    sender: "Departamento de Ensino",
    category: "curso",
    icon: Star,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  {
    id: 4,
    title: "Obrigação de Mata",
    content: "Lembramos que a próxima mesa de Obrigação de Mata será no dia 18/04 às 10h. Favor confirmar presença com antecedência.",
    date: new Date(2025, 3, 5),
    status: "normal",
    read: true,
    sender: "Pai de Santo",
    category: "ritual",
    icon: Check,
    iconColor: "text-green-500",
    iconBg: "bg-green-50",
  }
];

const MessagesContent = () => {
  const [activeTab, setActiveTab] = useState("recentes");
  const [readMessages, setReadMessages] = useState<number[]>([4]);

  const markAsRead = (id: number) => {
    if (!readMessages.includes(id)) {
      setReadMessages([...readMessages, id]);
    }
  };

  const unreadMessages = messages.filter(msg => !readMessages.includes(msg.id));
  const urgentMessages = messages.filter(msg => msg.status === "urgente");

  const renderMessages = (messagesToRender: typeof messages) => {
    return (
      <div className="space-y-3">
        {messagesToRender.map((message) => {
          const isRead = readMessages.includes(message.id);
          
          return (
            <Card 
              key={message.id} 
              className={`overflow-hidden transition-all ${isRead ? 'bg-gray-50' : 'bg-white'}`}
            >
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <div className={`flex-shrink-0 ${message.iconBg} rounded-full p-2 h-8 w-8 flex items-center justify-center`}>
                    <message.icon className={`h-4 w-4 ${message.iconColor}`} />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm ${isRead ? 'font-normal' : 'font-medium'}`}>{message.title}</h3>
                          {message.status === "urgente" && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">Urgente</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{message.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{message.id}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatDate(message.date)}</span>
                        </div>
                      </div>
                      
                      {!isRead && (
                        <button 
                          className="text-xs text-blue-600 flex items-center"
                          onClick={() => markAsRead(message.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-16">
      <Tabs defaultValue="recentes" onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full grid grid-cols-3">
          <TabsTrigger value="recentes">Recentes</TabsTrigger>
          <TabsTrigger value="nao-lidas">
            Não lidas ({unreadMessages.length})
          </TabsTrigger>
          <TabsTrigger value="urgentes">
            Urgentes ({urgentMessages.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recentes">
          <h3 className="text-base font-medium mb-3">Mensagens Recentes</h3>
          {renderMessages(messages)}
        </TabsContent>
        
        <TabsContent value="nao-lidas">
          <h3 className="text-base font-medium mb-3">Mensagens Não Lidas</h3>
          {unreadMessages.length > 0 ? (
            renderMessages(unreadMessages)
          ) : (
            <p className="text-center text-muted-foreground py-8 bg-gray-50 rounded-lg border">
              Não há mensagens não lidas.
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="urgentes">
          <h3 className="text-base font-medium mb-3">Mensagens Urgentes</h3>
          {urgentMessages.length > 0 ? (
            renderMessages(urgentMessages)
          ) : (
            <p className="text-center text-muted-foreground py-8 bg-gray-50 rounded-lg border">
              Não há mensagens urgentes.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessagesContent;

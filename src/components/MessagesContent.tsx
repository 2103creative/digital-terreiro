import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, AlertCircle, Check, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

// Armazenamento no localStorage para persistir estado de leitura
const STORAGE_KEY = "yle-axe-messages";

// Sample messages
const messages = [
  {
    id: 1,
    title: "Gira cancelada devido à chuva",
    content: "A gira de Pretos Velhos prevista para hoje às 20h foi cancelada devido à forte chuva. Reagendaremos em breve.",
    date: new Date(2025, 3, 10, 15, 30),
    isUrgent: true,
    isRead: false,
  },
  {
    id: 2,
    title: "Doações para festa de Oxum",
    content: "Estamos recebendo doações para a festa de Oxum que acontecerá no próximo mês. Precisamos de flores amarelas, champagne e mel.",
    date: new Date(2025, 3, 8, 10, 15),
    isUrgent: false,
    isRead: false,
  },
  {
    id: 3,
    title: "Novo curso de desenvolvimento",
    content: "Estamos abrindo inscrições para o novo curso de desenvolvimento mediúnico que começa no dia 22/04. Vagas limitadas!",
    date: new Date(2025, 3, 5, 9, 0),
    isUrgent: false,
    isRead: false,
  },
  {
    id: 4,
    title: "Obrigação de Mata",
    content: "Lembramos que a próxima mesa de Obrigação de Mata será no dia 18/04 às 19h. Não esqueça sua guia e roupas brancas.",
    date: new Date(2025, 3, 1, 14, 45),
    isUrgent: false,
    isRead: true,
  },
];

// Evento personalizado para notificar sobre novas mensagens
export const emitMessageUpdate = (count: number) => {
  window.dispatchEvent(new CustomEvent('message-update', { detail: { count } }));
};

// Hook para componentes externos escutarem atualizações de mensagens
export const useMessageUpdates = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const handleMessageUpdate = (event: any) => {
      setUnreadCount(event.detail.count);
    };

    // Verificar mensagens não lidas no localStorage ao montar
    const checkStoredMessages = () => {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const readStatus = JSON.parse(storedData);
          const unreadCount = messages.filter(msg => !readStatus[msg.id]).length;
          setUnreadCount(unreadCount);
        } else {
          // Se não houver dados salvos, conte mensagens não lidas dos dados iniciais
          const unreadCount = messages.filter(msg => !msg.isRead).length;
          setUnreadCount(unreadCount);
        }
      } catch (error) {
        console.error("Erro ao verificar mensagens:", error);
      }
    };

    window.addEventListener('message-update', handleMessageUpdate);
    checkStoredMessages();

    return () => {
      window.removeEventListener('message-update', handleMessageUpdate);
    };
  }, []);

  return unreadCount;
};

const MessagesContent = () => {
  const [activeTab, setActiveTab] = useState("recentes");
  const [selectedMessage, setSelectedMessage] = useState<typeof messages[0] | null>(null);
  
  // Inicializar com dados do localStorage ou dados padrão
  const getInitialReadStatus = () => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error("Erro ao recuperar dados de mensagens:", error);
    }
    
    // Se não houver dados salvos, use os valores iniciais
    return messages.reduce((acc, msg) => ({ ...acc, [msg.id]: msg.isRead }), {});
  };
  
  const [readStatus, setReadStatus] = useState<Record<number, boolean>>(getInitialReadStatus());

  // Salvar no localStorage quando o status muda
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readStatus));
    
    // Emitir evento quando o status de leitura muda
    const unreadCount = messages.filter(msg => !readStatus[msg.id]).length;
    emitMessageUpdate(unreadCount);
  }, [readStatus]);

  // Emitir número de mensagens não lidas ao iniciar o componente
  useEffect(() => {
    const unreadCount = messages.filter(msg => !readStatus[msg.id]).length;
    emitMessageUpdate(unreadCount);
  }, []);

  const handleMessageClick = (message: typeof messages[0]) => {
    setSelectedMessage(message);
  };

  const markAsRead = (id: number) => {
    setReadStatus(prev => ({ ...prev, [id]: true }));
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({...selectedMessage, isRead: true});
    }
  };

  const recentMessages = messages.sort((a, b) => b.date.getTime() - a.date.getTime());
  const unreadMessages = messages.filter(msg => !readStatus[msg.id]);
  const urgentMessages = messages.filter(msg => msg.isUrgent);

  const formatMessageDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date >= today) {
      return `Hoje às ${format(date, 'HH:mm')}`;
    } else if (date >= yesterday) {
      return `Ontem às ${format(date, 'HH:mm')}`;
    } else {
      return format(date, "d 'de' MMMM 'às' HH:mm", { locale: ptBR });
    }
  };

  const renderMessageList = (messagesToRender: typeof messages) => {
    return messagesToRender.length > 0 ? (
      <div className="space-y-4">
        {messagesToRender.map((message) => (
          <Card 
            key={message.id} 
            className={`card-hover ${!readStatus[message.id] ? 'border-primary' : ''} cursor-pointer transition-all hover:shadow-md active:bg-gray-50`}
            onClick={() => handleMessageClick(message)}
          >
            <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <MessageSquare className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                  <CardTitle className="text-sm md:text-base">{message.title}</CardTitle>
                </div>
                <div className="flex items-center gap-1 ml-1 flex-shrink-0">
                  {!readStatus[message.id] && (
                    <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></span>
                  )}
                  {message.isUrgent && (
                    <Badge variant="destructive" className="text-[10px] py-0 h-5">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Urgente
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                {formatMessageDate(message.date)}
              </p>
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-1 md:pt-2">
              <p className="text-xs md:text-sm line-clamp-2">{message.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground text-center py-8">
        Não há mensagens nesta categoria.
      </p>
    );
  };

  return (
    <div className="space-y-4 pb-16">
      <Tabs defaultValue="recentes" onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="recentes" className="flex-1 text-xs md:text-sm py-1 h-8 md:h-10">
            Recentes
          </TabsTrigger>
          <TabsTrigger value="nao-lidas" className="flex-1 text-xs md:text-sm py-1 h-8 md:h-10">
            Não lidas {unreadMessages.length > 0 && `(${unreadMessages.length})`}
          </TabsTrigger>
          <TabsTrigger value="urgentes" className="flex-1 text-xs md:text-sm py-1 h-8 md:h-10">
            Urgentes {urgentMessages.length > 0 && `(${urgentMessages.length})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recentes">
          {renderMessageList(recentMessages)}
        </TabsContent>
        
        <TabsContent value="nao-lidas">
          {renderMessageList(unreadMessages)}
        </TabsContent>
        
        <TabsContent value="urgentes">
          {renderMessageList(urgentMessages)}
        </TabsContent>
      </Tabs>

      {/* Diálogo de visualização detalhada de mensagem */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto p-4 md:p-6">
          {selectedMessage && (
            <>
              <DialogHeader className="pb-2">
                <DialogTitle className="flex items-center gap-2 text-base md:text-lg">
                  <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
                  {selectedMessage.title}
                </DialogTitle>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    {formatMessageDate(selectedMessage.date)}
                  </p>
                  {selectedMessage.isUrgent && (
                    <Badge variant="destructive" className="text-[10px] py-0 h-5">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Urgente
                    </Badge>
                  )}
                </div>
              </DialogHeader>
              <div className="py-2 border-t border-b my-2">
                <p className="text-sm md:text-base whitespace-pre-line">{selectedMessage.content}</p>
              </div>
              <DialogFooter className="flex sm:justify-between gap-2 flex-wrap mt-2">
                <div className="flex items-center">
                  {!readStatus[selectedMessage.id] ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => markAsRead(selectedMessage.id)}
                      className="gap-1 text-xs"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Marcar como lida
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-green-600" />
                      Mensagem lida
                    </span>
                  )}
                </div>
                <DialogClose asChild>
                  <Button variant="secondary" size="sm" className="text-xs">
                    <X className="h-3.5 w-3.5 mr-1" />
                    Fechar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagesContent;

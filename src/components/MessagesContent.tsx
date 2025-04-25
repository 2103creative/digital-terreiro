import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">Mensagens</h1>
      <p className="text-xs md:text-sm text-gray-500 mb-6">Confira os comunicados e avisos do terreiro:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white border rounded-xl p-5 shadow-sm flex flex-col h-full justify-between cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleMessageClick(msg)}>
            <div>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="font-bold text-lg leading-tight mb-0.5 flex items-center gap-2">{msg.isUrgent && <AlertCircle className="h-4 w-4 text-red-500" />} {msg.title}</h2>
                  <p className="text-xs italic text-gray-500 mb-2">{formatMessageDate(msg.date)}</p>
                </div>
                <MessageSquare className="h-5 w-5 text-primary mt-1" />
              </div>
              <p className="text-sm text-gray-700 mb-3">{msg.content}</p>
              <div className="mb-2">
                <span className="font-semibold text-xs">Status:</span>
                <span className="ml-1 inline-block mr-1 mb-1 px-2 py-0.5 text-xs bg-black text-white font-semibold rounded-full">{readStatus[msg.id] ? 'Lida' : 'Não lida'}</span>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button className="gap-1 text-gray-700 border border-gray-300 rounded-md px-3 py-1 text-xs hover:bg-gray-50 flex items-center" onClick={() => handleMessageClick(msg)}>
                Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

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
                  <p className="text-xs text-gray-500">
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

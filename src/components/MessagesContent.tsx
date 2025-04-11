
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
    isRead: true,
  },
  {
    id: 3,
    title: "Novo curso de desenvolvimento",
    content: "Estamos abrindo inscrições para o novo curso de desenvolvimento mediúnico que começa no dia 22/04. Vagas limitadas!",
    date: new Date(2025, 3, 5, 9, 0),
    isUrgent: false,
    isRead: true,
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

const MessagesContent = () => {
  const [activeTab, setActiveTab] = useState("recentes");
  const [readStatus, setReadStatus] = useState<Record<number, boolean>>(
    messages.reduce((acc, msg) => ({ ...acc, [msg.id]: msg.isRead }), {})
  );

  const handleMessageClick = (id: number) => {
    setReadStatus(prev => ({ ...prev, [id]: true }));
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
            className={`card-hover ${!readStatus[message.id] ? 'border-primary' : ''}`}
            onClick={() => handleMessageClick(message.id)}
          >
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 flex-shrink-0" />
                  <CardTitle className="text-base">{message.title}</CardTitle>
                </div>
                {message.isUrgent && (
                  <Badge variant="destructive" className="ml-2">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Urgente
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatMessageDate(message.date)}
              </p>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-sm">{message.content}</p>
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
    <div className="space-y-6 pb-16">
      <Tabs defaultValue="recentes" onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="recentes" className="flex-1">
            Recentes
          </TabsTrigger>
          <TabsTrigger value="nao-lidas" className="flex-1">
            Não lidas {unreadMessages.length > 0 && `(${unreadMessages.length})`}
          </TabsTrigger>
          <TabsTrigger value="urgentes" className="flex-1">
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
    </div>
  );
};

export default MessagesContent;

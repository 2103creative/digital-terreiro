import { useState } from "react";
import { MessageSquare, PlusCircle, Edit, Trash2, ArrowLeftCircle, AlertCircle, CheckCircle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { emitMessageUpdate } from "@/components/MessagesContent";

// Interface para o modelo de Mensagem
interface Message {
  id: number;
  title: string;
  content: string;
  date: Date;
  isUrgent: boolean;
  isRead: boolean;
}

// Dados de exemplo das mensagens (importados do componente MessagesContent)
const messagesData: Message[] = [
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

// Chave para armazenamento no localStorage
const STORAGE_KEY = "yle-axe-messages";

const AdminMessages = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(() => {
    // Tenta recuperar as mensagens armazenadas no localStorage
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEY + "-admin");
      return storedMessages ? JSON.parse(storedMessages) : messagesData;
    } catch (error) {
      console.error("Erro ao recuperar mensagens:", error);
      return messagesData;
    }
  });
  
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState<Partial<Message>>({
    title: "",
    content: "",
    date: new Date(),
    isUrgent: false,
    isRead: false,
  });

  // Função para salvar mensagens no localStorage e atualizar contador
  const saveMessages = (updatedMessages: Message[]) => {
    localStorage.setItem(STORAGE_KEY + "-admin", JSON.stringify(updatedMessages));
    
    // Salvar também o status de leitura no formato do componente MessagesContent
    const readStatus = updatedMessages.reduce((acc, msg) => ({ ...acc, [msg.id]: msg.isRead }), {});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readStatus));
    
    // Atualizar contagem de mensagens não lidas
    const unreadCount = updatedMessages.filter(msg => !msg.isRead).length;
    emitMessageUpdate(unreadCount);
  };

  // Função para adicionar nova mensagem
  const handleAddMessage = () => {
    if (!newMessage.title || !newMessage.content) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...messages.map(m => m.id), 0) + 1;
    const messageToAdd: Message = {
      id: newId,
      title: newMessage.title,
      content: newMessage.content,
      date: newMessage.date || new Date(),
      isUrgent: newMessage.isUrgent || false,
      isRead: newMessage.isRead || false,
    };

    const updatedMessages = [...messages, messageToAdd];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    
    setNewMessage({
      title: "",
      content: "",
      date: new Date(),
      isUrgent: false,
      isRead: false,
    });
    setShowForm(false);

    toast({
      title: "Mensagem adicionada",
      description: `A mensagem "${messageToAdd.title}" foi adicionada com sucesso.`,
    });
  };

  // Função para editar mensagem
  const handleEditMessage = (message: Message) => {
    setSelectedMessage(message);
    setNewMessage({
      title: message.title,
      content: message.content,
      date: message.date,
      isUrgent: message.isUrgent,
      isRead: message.isRead,
    });
    setShowForm(true);
  };

  // Função para atualizar mensagem
  const handleUpdateMessage = () => {
    if (!selectedMessage) return;
    
    if (!newMessage.title || !newMessage.content) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const updatedMessages = messages.map(m => 
      m.id === selectedMessage.id 
        ? { 
            ...m, 
            title: newMessage.title!, 
            content: newMessage.content!, 
            date: newMessage.date || m.date,
            isUrgent: newMessage.isUrgent || false,
            isRead: newMessage.isRead || false,
          } 
        : m
    );

    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    
    setNewMessage({
      title: "",
      content: "",
      date: new Date(),
      isUrgent: false,
      isRead: false,
    });
    setSelectedMessage(null);
    setShowForm(false);

    toast({
      title: "Mensagem atualizada",
      description: `A mensagem "${newMessage.title}" foi atualizada com sucesso.`,
    });
  };

  // Função para confirmar exclusão
  const handleConfirmDelete = () => {
    if (!selectedMessage) return;
    
    const updatedMessages = messages.filter(m => m.id !== selectedMessage.id);
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    
    setShowDeleteDialog(false);
    setSelectedMessage(null);

    toast({
      title: "Mensagem excluída",
      description: `A mensagem "${selectedMessage.title}" foi excluída com sucesso.`,
    });
  };

  // Função para marcar/desmarcar mensagem como lida
  const handleToggleRead = (message: Message) => {
    const updatedMessages = messages.map(m => 
      m.id === message.id 
        ? { ...m, isRead: !m.isRead } 
        : m
    );
    
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    
    toast({
      title: `Mensagem marcada como ${!message.isRead ? 'lida' : 'não lida'}`,
      description: `A mensagem "${message.title}" foi atualizada.`,
    });
  };

  // Formatação da data da mensagem
  const formatMessageDate = (date: Date) => {
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  // Ordenar mensagens por data (mais recentes primeiro)
  const sortedMessages = [...messages].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <AdminLayout pageTitle="Gerenciar Mensagens" pageDescription="Administre as mensagens enviadas aos membros do terreiro">
      {!showForm ? (
        <>
          <div className="flex justify-end items-center mb-6">
            <Button onClick={() => setShowForm(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Mensagem
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Lista de Mensagens</CardTitle>
              <CardDescription>
                Gerencie as mensagens enviadas à comunidade do terreiro
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sortedMessages.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {sortedMessages.map((message) => (
                    <Card 
                      key={message.id} 
                      className={cn(
                        "bg-white border border-gray-100 rounded-lg aspect-square hover:shadow-sm cursor-pointer transition-shadow",
                        message.isRead ? "" : "border-l-4 border-l-blue-500"
                      )}
                      onClick={() => handleEditMessage(message)}
                    >
                      <div className="flex flex-col h-full p-2 relative">
                        {/* Ícone de status no canto superior esquerdo */}
                        <div className="absolute top-2 left-2">
                          {message.isRead ? 
                            <CheckCircle className="h-5 w-5 text-green-600" /> : 
                            <MessageSquare className="h-5 w-5 text-blue-600" />}
                        </div>
                        
                        {/* Data da mensagem no canto superior direito */}
                        <div className="absolute top-2 right-2">
                          <span className="text-[10px] text-gray-500">
                            {format(message.date, "dd/MM", { locale: ptBR })}
                          </span>
                        </div>
                        
                        {/* Indicador de urgência */}
                        {message.isUrgent && (
                          <div className="absolute top-8 right-2">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          </div>
                        )}
                        
                        {/* Título da mensagem centralizado */}
                        <div className="flex-1 flex items-center justify-center px-2">
                          <h3 className="text-xs font-medium text-gray-900 text-center line-clamp-3">{message.title}</h3>
                        </div>
                        
                        {/* Link de editar no canto inferior esquerdo */}
                        <div className="absolute bottom-2 left-2 flex items-center text-[10px] text-blue-600">
                          <span>Editar</span>
                          <Edit className="h-2.5 w-2.5 ml-0.5" />
                        </div>
                        
                        {/* Botão de excluir no canto inferior direito */}
                        <div 
                          className="absolute bottom-2 right-2 flex items-center text-[10px] text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMessage(message);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <span>Excluir</span>
                          <Trash2 className="h-2.5 w-2.5 ml-0.5" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-10">
                  <MessageSquare className="h-16 w-16 text-primary mb-4" />
                  <p className="text-xl font-medium text-center">Nenhuma mensagem encontrada</p>
                  <p className="text-muted-foreground mt-2 text-center">
                    Não existem mensagens cadastradas.
                    Clique em "Nova Mensagem" para adicionar.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{selectedMessage ? 'Editar' : 'Nova'} Mensagem</CardTitle>
              <Button variant="outline" size="sm" onClick={() => {
                setShowForm(false);
                setSelectedMessage(null);
                setNewMessage({
                  title: "",
                  content: "",
                  date: new Date(),
                  isUrgent: false,
                  isRead: false,
                });
              }}>
                <ArrowLeftCircle className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
            <CardDescription>
              {selectedMessage ? 'Edite as informações da mensagem' : 'Preencha as informações para adicionar uma nova mensagem'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="message-title">Título *</Label>
                <Input
                  id="message-title"
                  placeholder="Ex: Gira cancelada devido à chuva"
                  value={newMessage.title}
                  onChange={(e) => setNewMessage({...newMessage, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message-content">Conteúdo *</Label>
                <Textarea
                  id="message-content"
                  placeholder="Digite o conteúdo da mensagem aqui..."
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  rows={5}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="message-urgent"
                  checked={newMessage.isUrgent}
                  onCheckedChange={(checked) => setNewMessage({...newMessage, isUrgent: checked})}
                />
                <Label htmlFor="message-urgent">Marcar como urgente</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="message-read"
                  checked={newMessage.isRead}
                  onCheckedChange={(checked) => setNewMessage({...newMessage, isRead: checked})}
                />
                <Label htmlFor="message-read">Marcar como lida</Label>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setSelectedMessage(null);
                    setNewMessage({
                      title: "",
                      content: "",
                      date: new Date(),
                      isUrgent: false,
                      isRead: false,
                    });
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={selectedMessage ? handleUpdateMessage : handleAddMessage}>
                  {selectedMessage ? 'Atualizar' : 'Adicionar'} Mensagem
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a mensagem "{selectedMessage?.title}"? Esta ação não pode ser desfeita.
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

export default AdminMessages;
import { useState, useRef, useEffect } from 'react';
import { Send, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChat, ChatMessage } from '@/contexts/ChatContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ChatComunitario() {
  const { messages, sendMessage, isConnected } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Detectar se está em dispositivo móvel
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // Função para obter as iniciais do nome para o avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Formatar a data da mensagem
  const formatMessageTime = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: ptBR
    });
  };

  // Rolar para a última mensagem quando receber novas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Manipulador para enviar mensagem
  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  // Manipulador para enviar mensagem com Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const renderMessages = () => {
    // Se não houver mensagens, exibir uma mensagem de boas-vindas
    if (!messages.length) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <UserCircle2 className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">Bem-vindo ao Chat Comunitário</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-md">
            Este é um espaço para todos os membros do terreiro compartilharem ideias e informações.
            Seja a primeira pessoa a enviar uma mensagem!
          </p>
        </div>
      );
    }

    return messages.map((msg: ChatMessage, i: number) => (
      <div
        key={msg.id || i}
        className={`flex ${msg.userData.name === 'Visitante' ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {msg.userData.name !== 'Visitante' && (
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={msg.userData.avatar} alt={msg.userData.name} />
            <AvatarFallback>{getInitials(msg.userData.name)}</AvatarFallback>
          </Avatar>
        )}
        <div>
          <div
            className={`max-w-xs p-3 rounded-lg ${
              msg.userData.name === 'Visitante' ? 'bg-black text-white' : 'bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{msg.userData.name}</span>
              <span className="text-xs px-2 py-0.5 bg-opacity-20 bg-zinc-200 rounded-full">
                {msg.userData.orixa}
              </span>
            </div>
            <p className="text-sm">{msg.text}</p>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {msg.timestamp && formatMessageTime(msg.timestamp)}
          </div>
        </div>
        {msg.userData.name === 'Visitante' && (
          <Avatar className="h-8 w-8 ml-2">
            <AvatarImage src={msg.userData.avatar} alt={msg.userData.name} />
            <AvatarFallback>{getInitials(msg.userData.name)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    ));
  };

  // Layout específico para mobile (sem header duplicado e ocupando toda a altura)
  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {renderMessages()}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-3 bg-white">
          <div className="flex items-center">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 mr-2 h-10"
              onKeyPress={handleKeyPress}
              disabled={!isConnected}
            />
            <Button
              onClick={handleSend}
              className="bg-black text-white hover:bg-gray-800 h-10 px-3"
              disabled={!isConnected || !newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {!isConnected && (
            <p className="text-xs text-red-500 mt-2">
              Não foi possível conectar ao servidor de chat. Tente novamente mais tarde.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Layout desktop com cabeçalho completo
  return (
    <div className="flex flex-col h-full bg-white border rounded-lg shadow-sm overflow-hidden">
      <div className="bg-white border-b pb-3 pt-4 px-4">
        <div className="flex items-center">
          <UserCircle2 className="h-5 w-5 mr-2 text-gray-700" />
          <h3 className="font-medium text-base">Chat Comunitário</h3>
          {isConnected ? (
            <span className="ml-auto text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              Conectado
            </span>
          ) : (
            <span className="ml-auto text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
              Desconectado
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-white">
        <div className="flex">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 mr-2"
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
          />
          <Button
            onClick={handleSend}
            className="bg-black text-white hover:bg-gray-800"
            disabled={!isConnected || !newMessage.trim()}
          >
            <Send className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Enviar</span>
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-red-500 mt-2">
            Não foi possível conectar ao servidor de chat. Tente novamente mais tarde.
          </p>
        )}
      </div>
    </div>
  );
} 
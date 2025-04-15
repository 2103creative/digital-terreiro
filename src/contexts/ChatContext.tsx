import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

// Tipos para as mensagens e usuários
interface ChatUser {
  name: string;
  orixa: string;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
  userData: ChatUser;
}

// Interface do contexto
interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  isConnected: boolean;
}

// Valor padrão do contexto
const defaultContext: ChatContextType = {
  messages: [],
  sendMessage: () => {},
  isConnected: false,
};

// Criar o contexto
const ChatContext = createContext<ChatContextType>(defaultContext);

// Hook personalizado para usar o contexto
export const useChat = () => useContext(ChatContext);

// Provider do contexto
interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  // Carregar mensagens do localStorage ao iniciar
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat_messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Erro ao carregar mensagens do localStorage:', error);
      }
    }
  }, []);

  // Inicializar conexão do Socket.IO
  useEffect(() => {
    // Conectar ao servidor demo público
    const newSocket = io('https://socket-io-demo-server.glitch.me', {
      transports: ['websocket'],
    });

    // Eventos de conexão
    newSocket.on('connect', () => {
      console.log('Conectado ao servidor de chat');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado do servidor de chat');
      setIsConnected(false);
    });

    // Receber mensagens existentes (simulado)
    newSocket.on('existing_messages', (msgs: ChatMessage[]) => {
      if (Array.isArray(msgs) && msgs.length > 0) {
        setMessages(msgs);
        localStorage.setItem('chat_messages', JSON.stringify(msgs));
      }
    });

    // Receber novas mensagens
    newSocket.on('new_message', (msg: ChatMessage) => {
      setMessages(prev => {
        const updatedMessages = [...prev, msg];
        localStorage.setItem('chat_messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    setSocket(newSocket);

    // Desconectar ao desmontar o componente
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Função para enviar mensagens
  const sendMessage = (text: string) => {
    if (!socket || !text.trim()) return;

    // Obter informações do usuário do localStorage como fallback
    let userData: ChatUser;
    
    if (user?.name) {
      // Usar dados do contexto de autenticação
      userData = {
        name: user.name,
        orixa: getUserProperty(user, 'orixa') || 'Oxalá',
        avatar: getUserProperty(user, 'avatar') || '/placeholder-avatar.png',
      };
    } else {
      // Dados de usuário padrão
      userData = {
        name: 'Visitante',
        orixa: 'Oxalá',
        avatar: '/placeholder-avatar.png',
      };
    }

    // Cria um ID único para mensagens enviadas
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newMessage: ChatMessage = {
      id: messageId,
      text: text.trim(),
      timestamp: Date.now(),
      userData,
    };

    // Emitir a mensagem para o servidor
    socket.emit('send_message', newMessage);
    
    // Otimisticamente adicionar a mensagem localmente (para UI responsiva)
    setMessages(prev => {
      const updatedMessages = [...prev, newMessage];
      localStorage.setItem('chat_messages', JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };

  // Função auxiliar para obter propriedades do usuário com segurança
  const getUserProperty = (user: any, property: string): string => {
    if (user && typeof user === 'object' && property in user) {
      return user[property];
    }
    
    // Tentar obter de localStorage como fallback
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const userData = JSON.parse(userString);
        return userData[property] || '';
      }
    } catch (error) {
      console.error(`Erro ao obter propriedade ${property} do usuário:`, error);
    }
    
    return '';
  };

  const value = {
    messages,
    sendMessage,
    isConnected,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}; 
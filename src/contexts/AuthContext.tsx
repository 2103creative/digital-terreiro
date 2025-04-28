import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authenticate, logout as logoutService, User } from '@/lib/authService';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Sempre sincroniza com localStorage ao montar e valida token
  useEffect(() => {
    async function validateSession() {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      // Tenta validar o token no backend (ou simula)
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api/users'}/validate-token`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            setUser(null);
          }
        } else {
          // Token inválido
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch {
        // Falha na validação (offline ou erro de rede)
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    validateSession();
  }, []);

  // LOGIN REAL
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      sessionStorage.setItem('authInProgress', 'true');
      const authenticatedUser = await authenticate(email, password);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem('user', JSON.stringify(authenticatedUser));
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo(a), ${authenticatedUser.name}!`,
        });
        import('@/serviceWorkerRegistration').then(({ notifyLoginSuccess }) => {
          notifyLoginSuccess();
          sessionStorage.removeItem('authInProgress');
        });
        // LOG para depuração
        console.log("AuthContext: login bem-sucedido, user:", authenticatedUser);
        return true;
      } else {
        setUser(null);
        toast({
          title: "Erro de autenticação",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        });
        sessionStorage.removeItem('authInProgress');
        return false;
      }
    } catch (error) {
      setUser(null);
      console.error('DEBUG erro ao fazer login:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro durante a autenticação.",
        variant: "destructive",
      });
      sessionStorage.removeItem('authInProgress');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutService();
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!user;
  const isAdmin = user ? user.role === 'admin' : false;

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, isAdmin, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
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

  // Sempre sincroniza com localStorage ao montar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log("AuthContext useEffect: storedUser", storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  // LOGIN REAL
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const authenticatedUser = await authenticate(email, password);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem('user', JSON.stringify(authenticatedUser));
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo(a), ${authenticatedUser.name}!`,
        });
        return true;
      } else {
        setUser(null);
        toast({
          title: "Erro de autenticação",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        });
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

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: !!user && user.role === 'admin',
      login: handleLogin,
      logout: handleLogout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
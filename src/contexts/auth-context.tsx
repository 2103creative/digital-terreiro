
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/db/supabase-client';
import { getCurrentUser, isAdmin, isMember } from '@/lib/services/auth-service';
import type { Tables } from '@/lib/db/supabase-client';
import { useToast } from '@/hooks/use-toast';

type User = Tables<'users'>;

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMember: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { name: string; orixa?: string; avatar_url?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (userDetails: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [userIsMember, setUserIsMember] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          setUserIsAdmin(currentUser.role === 'admin');
          setUserIsMember(currentUser.role === 'admin' || currentUser.role === 'member');
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    // Carregar usuário inicial
    loadUser();

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          
          if (currentUser) {
            setUserIsAdmin(currentUser.role === 'admin');
            setUserIsMember(currentUser.role === 'admin' || currentUser.role === 'member');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserIsAdmin(false);
        setUserIsMember(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user } = await supabase.auth.signInWithPassword({ email, password });
      
      if (user) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          setUserIsAdmin(currentUser.role === 'admin');
          setUserIsMember(currentUser.role === 'admin' || currentUser.role === 'member');
        }
        
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo(a) de volta, ${currentUser?.name || 'usuário'}!`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (
    email: string, 
    password: string, 
    userData: { name: string; orixa?: string; avatar_url?: string }
  ) => {
    try {
      setLoading(true);
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            orixa: userData.orixa,
            avatar_url: userData.avatar_url
          }
        }
      });
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Verifique seu email para confirmar seu cadastro.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Ocorreu um erro ao criar sua conta.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setUserIsAdmin(false);
      setUserIsMember(false);
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do sistema.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao desconectar.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      setLoading(true);
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar email",
        description: error.message || "Ocorreu um erro ao solicitar redefinição de senha.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (userDetails: Partial<User>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('users')
        .update({ 
          ...userDetails,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id || '')
        .select()
        .single();
      
      if (error) throw error;
      
      setUser(data);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro ao atualizar seu perfil.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: userIsAdmin,
        isMember: userIsMember,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        resetPassword: handleResetPassword,
        updateProfile: handleUpdateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

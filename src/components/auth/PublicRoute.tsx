
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import LoadingScreen from '@/components/LoadingScreen';

interface PublicRouteProps {
  children: ReactNode;
  restricted?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  restricted = false,
}) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (loading) {
    return <LoadingScreen />;
  }

  // Se a rota é restrita e o usuário está autenticado, redireciona para o dashboard
  if (restricted && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Caso contrário, renderiza o conteúdo normal
  return <>{children}</>;
};

export default PublicRoute;

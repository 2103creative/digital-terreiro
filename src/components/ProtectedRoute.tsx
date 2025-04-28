import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // LOG para depuração
  console.log('ProtectedRoute', { isAuthenticated, loading, isAdmin });

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (loading) {
    return <LoadingScreen />;
  }

  // Verificar se é necessário ser administrador
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Verificar se o usuário está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se passou por todas as verificações, renderiza o conteúdo
  return <>{children}</>;
};

export default ProtectedRoute; 

import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import LoadingScreen from '@/components/LoadingScreen';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireMember?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireMember = false,
}) => {
  const { isAuthenticated, isAdmin, isMember, loading } = useAuth();
  const location = useLocation();

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (loading) {
    return <LoadingScreen />;
  }

  // Se requer autenticação e usuário não está autenticado, redireciona para login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se requer permissões de admin e usuário não é admin, redireciona para dashboard
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se requer permissões de membro e usuário não é membro nem admin, redireciona para dashboard
  if (requireMember && !isMember) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se todas as verificações passaram, renderiza o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;

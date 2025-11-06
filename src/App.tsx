import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import UpdateIndicator from "@/components/UpdateIndicator";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Layouts
import AdminDesktopLayout from "@/layouts/AdminDesktopLayout";
import AdminMobileLayout from "@/layouts/AdminMobileLayout";
import UserDesktopLayout from "@/layouts/UserDesktopLayout";
import UserMobileLayout from "@/layouts/UserMobileLayout";

// Páginas principais
import Login from "./pages/Login";
// import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Leitura from "./pages/Leitura";
import Mensagens from "./pages/Mensagens";
import Frentes from "./pages/Frentes";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminUsers from "./pages/AdminUsers";
import UserFormPage from "./pages/UserFormPage";
import Limpeza from "./pages/Limpeza";
import AdminLimpeza from "./pages/AdminLimpeza";
import CleaningGenerator from "./pages/CleaningGenerator";
import AdminMessages from "./pages/AdminMessages";
import Favoritos from "./pages/Favoritos";
import Chat from "./pages/Chat";
import AdminMantimentos from "./pages/AdminMantimentos";
import ListaCompras from "./pages/ListaCompras";
import AdminErvas from "./pages/AdminErvas";
import Ervas from "./pages/Ervas";
import AdminUsersView from "./pages/AdminUsersView"; // Import the new component
import LoginRedirectIfAuthenticated from "./pages/LoginRedirectIfAuthenticated";
import Cadastro from "./pages/Cadastro";
import EsqueciSenha from "./pages/EsqueciSenha";

// Lazy pages
const AdminEvents = lazy(() => import("./pages/AdminEvents"));
const AdminFrente = lazy(() => import("./pages/AdminFrente"));
const AdminReading = lazy(() => import("./pages/AdminReading"));

const queryClient = new QueryClient();

const AdminLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

function AppLayoutWrapper() {
  const { user, isAdmin, loading } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const Layout = isMobile
    ? UserMobileLayout
    : UserDesktopLayout;

  return <Layout><Outlet /></Layout>;
}

function AdminLayoutWrapper() {
  const { user, isAdmin, loading } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  // LOG para depuração
  console.log('AdminLayoutWrapper', { user, isAdmin, loading });

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const Layout = isMobile ? AdminMobileLayout : AdminDesktopLayout;
  return <Layout><Outlet /></Layout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ChatProvider>
          <Toaster />
          <Sonner />
          <UpdateIndicator />
          <PWAInstallPrompt />
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginRedirectIfAuthenticated />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/esqueci-senha" element={<EsqueciSenha />} />

              {/* Rotas protegidas de usuário */}
              <Route element={<AppLayoutWrapper />}>
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/frentes" element={<ProtectedRoute><Frentes /></ProtectedRoute>} />
                <Route path="/ervas" element={<ProtectedRoute><Ervas /></ProtectedRoute>} />
                <Route path="/compras" element={<ProtectedRoute><ListaCompras /></ProtectedRoute>} />
                <Route path="/eventos" element={<ProtectedRoute><Events /></ProtectedRoute>} />
                <Route path="/leitura" element={<ProtectedRoute><Leitura /></ProtectedRoute>} />
                <Route path="/mensagens" element={<ProtectedRoute><Mensagens /></ProtectedRoute>} />
                <Route path="/limpeza" element={<ProtectedRoute><Limpeza /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              </Route>

              {/* Rotas protegidas de admin */}
              <Route element={<AdminLayoutWrapper />}>
                <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin={true}><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/frentes" element={<ProtectedRoute requireAdmin={true}><Suspense fallback={<AdminLoading />}><AdminFrente /></Suspense></ProtectedRoute>} />
                <Route path="/admin/ervas" element={<ProtectedRoute requireAdmin={true}><AdminErvas /></ProtectedRoute>} />
                <Route path="/admin/compras" element={<ProtectedRoute requireAdmin={true}><AdminMantimentos /></ProtectedRoute>} />
                <Route path="/admin/eventos" element={<ProtectedRoute requireAdmin={true}><Suspense fallback={<AdminLoading />}><AdminEvents /></Suspense></ProtectedRoute>} />
                <Route path="/admin/leitura" element={<ProtectedRoute requireAdmin={true}><Suspense fallback={<AdminLoading />}><AdminReading /></Suspense></ProtectedRoute>} />
                <Route path="/admin/limpeza" element={<ProtectedRoute requireAdmin={true}><AdminLimpeza /></ProtectedRoute>} />
                <Route path="/admin/mensagens" element={<ProtectedRoute requireAdmin={true}><AdminMessages /></ProtectedRoute>} />
                <Route path="/admin/usuarios" element={<ProtectedRoute requireAdmin={true}><AdminUsers /></ProtectedRoute>} />
                <Route path="/admin/usuarios-view" element={<ProtectedRoute requireAdmin={true}><AdminUsersView /></ProtectedRoute>} />
                <Route path="/admin/usuarios/novo" element={<ProtectedRoute requireAdmin={true}><UserFormPage /></ProtectedRoute>} />
                <Route path="/admin/usuarios/editar/:userId" element={<ProtectedRoute requireAdmin={true}><UserFormPage /></ProtectedRoute>} />
                <Route path="/admin/cleaning-generator" element={<ProtectedRoute requireAdmin={true}><CleaningGenerator /></ProtectedRoute>} />
              </Route>

              {/* 404 - página não encontrada */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

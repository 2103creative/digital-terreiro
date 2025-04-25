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
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Reading from "./pages/Reading";
import Messages from "./pages/Messages";
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
  if (!user) return <Login />;

  const Layout = isAdmin
    ? isMobile
      ? AdminMobileLayout
      : AdminDesktopLayout
    : isMobile
    ? UserMobileLayout
    : UserDesktopLayout;

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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rotas protegidas */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayoutWrapper />
                  </ProtectedRoute>
                }
              >
                {/* Rotas comuns */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/frentes" element={<Frentes />} />
                <Route path="/eventos" element={<Events />} />
                <Route path="/leitura" element={<Reading />} />
                <Route path="/mensagens" element={<Messages />} />
                <Route path="/limpeza" element={<Limpeza />} />
                <Route path="/compras" element={<ListaCompras />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/ervas" element={<Ervas />} />
                <Route path="/favoritos" element={<Favoritos />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/userform" element={<UserFormPage />} />

                {/* Rotas administrativas */}
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/frentes" element={<Suspense fallback={<AdminLoading />}><AdminFrente /></Suspense>} />
                <Route path="/admin/ervas" element={<AdminErvas />} />
                <Route path="/admin/compras" element={<AdminMantimentos />} />
                <Route path="/admin/eventos" element={<Suspense fallback={<AdminLoading />}><AdminEvents /></Suspense>} />
                <Route path="/admin/leitura" element={<Suspense fallback={<AdminLoading />}><AdminReading /></Suspense>} />
                <Route path="/admin/limpeza" element={<AdminLimpeza />} />
                <Route path="/admin/mensagens" element={<AdminMessages />} />
                <Route path="/admin/usuarios" element={<AdminUsers />} />
                <Route path="/admin/usuarios/novo" element={<ProtectedRoute requireAdmin={true}><UserFormPage /></ProtectedRoute>} />
                <Route path="/admin/usuarios/editar/:userId" element={<ProtectedRoute requireAdmin={true}><UserFormPage /></ProtectedRoute>} />
                <Route path="/admin/usuarios-view" element={<AdminUsersView />} /> // Add the new route
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

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import UpdateIndicator from "@/components/UpdateIndicator";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { lazy, Suspense } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ProtectedRoute from "@/components/ProtectedRoute";
// Layouts
import AdminDesktopLayout from "@/layouts/AdminDesktopLayout";
import AdminMobileLayout from "@/layouts/AdminMobileLayout";
import UserDesktopLayout from "@/layouts/UserDesktopLayout";
import UserMobileLayout from "@/layouts/UserMobileLayout";

// Lazy loading para páginas administrativas menos frequentemente acessadas
const AdminEvents = lazy(() => import("./pages/AdminEvents"));
const AdminFrente = lazy(() => import("./pages/AdminFrente"));
const AdminReading = lazy(() => import("./pages/AdminReading"));
const AdminAbout = lazy(() => import("./pages/AdminAbout"));

// Importação direta das páginas comuns (user)
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Reading from "./pages/Reading";
import Messages from "./pages/Messages";
import Frentes from "./pages/Frentes";
import Profile from "./pages/Profile";
import About from "./pages/About";
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

const AdminLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
);

const queryClient = new QueryClient();

function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (loading) return null; // Aguarda carregamento do contexto
  if (!user) return <Login />;

  // Admin
  if (isAdmin) {
    return isMobile ? (
      <AdminMobileLayout>{children}</AdminMobileLayout>
    ) : (
      <AdminDesktopLayout>{children}</AdminDesktopLayout>
    );
  }
  // Usuário comum
  return isMobile ? (
    <UserMobileLayout>{children}</UserMobileLayout>
  ) : (
    <UserDesktopLayout>{children}</UserDesktopLayout>
  );
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
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Rotas protegidas para qualquer usuário logado (admin ou user) */}
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <AppLayoutWrapper>
                      <Routes>
                        {/* Rotas comuns */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/frentes" element={<Frentes />} />
                        <Route path="/eventos" element={<Events />} />
                        <Route path="/leitura" element={<Reading />} />
                        <Route path="/mensagens" element={<Messages />} />
                        <Route path="/limpeza" element={<Limpeza />} />
                        <Route path="/lista-compras" element={<ListaCompras />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/sobre" element={<About />} />
                        <Route path="/ervas" element={<Ervas />} />
                        <Route path="/favoritos" element={<Favoritos />} />
                        <Route path="/configuracoes" element={<Settings />} />

                        {/* Rotas administrativas (visíveis apenas para admin) */}
                        <Route path="/adminusuarios" element={<AdminUsers />} />
                        <Route path="/adminusuarios/novo" element={<UserFormPage />} />
                        <Route path="/adminusuarios/editar/:userId" element={<UserFormPage />} />
                        <Route path="/adminevents" element={<Suspense fallback={<AdminLoading />}><AdminEvents /></Suspense>} />
                        <Route path="/adminfrente" element={<Suspense fallback={<AdminLoading />}><AdminFrente /></Suspense>} />
                        <Route path="/adminreading" element={<Suspense fallback={<AdminLoading />}><AdminReading /></Suspense>} />
                        <Route path="/adminabout" element={<Suspense fallback={<AdminLoading />}><AdminAbout /></Suspense>} />
                        <Route path="/adminlimpeza" element={<AdminLimpeza />} />
                        <Route path="/adminmantimentos" element={<AdminMantimentos />} />
                        <Route path="/adminervas" element={<AdminErvas />} />
                        <Route path="/adminmessages" element={<AdminMessages />} />
                        <Route path="/cleaning-generator" element={<CleaningGenerator />} />
                        {/* ...outras rotas admin */}
                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AppLayoutWrapper>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </ChatProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

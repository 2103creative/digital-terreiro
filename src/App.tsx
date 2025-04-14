import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateIndicator from "@/components/UpdateIndicator";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Reading from "./pages/Reading";
import Messages from "./pages/Messages";
import Frentes from "./pages/Frentes";
import Profile from "./pages/Profile";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import AdminUsers from "./pages/AdminUsers";
import UserFormPage from "./pages/UserFormPage";
import Limpeza from "./pages/Limpeza";
import AdminLimpeza from "./pages/AdminLimpeza";
import AdminMessages from "./pages/AdminMessages";

// Lazy loading para páginas administrativas menos frequentemente acessadas
import { lazy, Suspense } from "react";
const AdminEvents = lazy(() => import("./pages/AdminEvents"));
const AdminFrente = lazy(() => import("./pages/AdminFrente"));
const AdminReading = lazy(() => import("./pages/AdminReading"));
const AdminAbout = lazy(() => import("./pages/AdminAbout"));

// Loading fallback
const AdminLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
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
            
            {/* Rotas protegidas para usuários comuns */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/eventos" 
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leitura" 
              element={
                <ProtectedRoute>
                  <Reading />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mensagens" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/frentes" 
              element={
                <ProtectedRoute>
                  <Frentes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/limpeza" 
              element={
                <ProtectedRoute>
                  <Limpeza />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sobre" 
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/configuracoes" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas administrativas (requerem permissão de admin) */}
            <Route 
              path="/admin/usuarios" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/usuarios/novo" 
              element={
                <ProtectedRoute requireAdmin>
                  <UserFormPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/usuarios/editar/:userId" 
              element={
                <ProtectedRoute requireAdmin>
                  <UserFormPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/eventos" 
              element={
                <ProtectedRoute requireAdmin>
                  <Suspense fallback={<AdminLoading />}>
                    <AdminEvents />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/frentes" 
              element={
                <ProtectedRoute requireAdmin>
                  <Suspense fallback={<AdminLoading />}>
                    <AdminFrente />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/leitura" 
              element={
                <ProtectedRoute requireAdmin>
                  <Suspense fallback={<AdminLoading />}>
                    <AdminReading />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/mensagens" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminMessages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/sobre" 
              element={
                <ProtectedRoute requireAdmin>
                  <Suspense fallback={<AdminLoading />}>
                    <AdminAbout />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/limpeza" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLimpeza />
                </ProtectedRoute>
              } 
            />
            
            {/* Página 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

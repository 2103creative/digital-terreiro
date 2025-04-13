import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rotas protegidas */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/leitura" element={<Reading />} />
          <Route path="/mensagens" element={<Messages />} />
          <Route path="/frentes" element={<Frentes />} />
          <Route path="/limpeza" element={<Limpeza />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/configuracoes" element={<Settings />} />
          
          {/* Rotas administrativas */}
          <Route path="/admin/usuarios" element={<AdminUsers />} />
          <Route path="/admin/usuarios/novo" element={<UserFormPage />} />
          <Route path="/admin/usuarios/editar/:userId" element={<UserFormPage />} />
          <Route 
            path="/admin/eventos" 
            element={
              <Suspense fallback={<AdminLoading />}>
                <AdminEvents />
              </Suspense>
            } 
          />
          <Route 
            path="/admin/frentes" 
            element={
              <Suspense fallback={<AdminLoading />}>
                <AdminFrente />
              </Suspense>
            } 
          />
          <Route 
            path="/admin/leitura" 
            element={
              <Suspense fallback={<AdminLoading />}>
                <AdminReading />
              </Suspense>
            } 
          />
          <Route 
            path="/admin/sobre" 
            element={
              <Suspense fallback={<AdminLoading />}>
                <AdminAbout />
              </Suspense>
            } 
          />
          <Route path="/admin/limpeza" element={<AdminLimpeza />} />
          
          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

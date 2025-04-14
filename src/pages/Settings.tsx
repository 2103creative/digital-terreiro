import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import MobileNav from "@/components/MobileNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Verificar se o usuário está autenticado
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
      toast({
        title: "Acesso negado",
        description: "Por favor, faça login para acessar esta página",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:flex">
      <DesktopSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="container mx-auto px-4 py-4">
          <h2 className="text-xl font-semibold mb-3">Configurações</h2>
          
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              {/* Layout desktop */}
              <div className="hidden md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-1">
                {/* Coluna 1 */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Configurações Gerais</h3>
                  
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-xs font-medium">Modo Escuro</p>
                      <p className="text-xs text-gray-500">Ativar o tema escuro para todos os usuários</p>
                    </div>
                    <Checkbox id="dark-mode-desktop" className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-medium">Modo Manutenção</p>
                      <p className="text-xs text-gray-500">Ativar o modo de manutenção</p>
                    </div>
                    <Checkbox id="maintenance-desktop" className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4" />
                  </div>
                  
                  <h3 className="text-sm font-semibold mb-2">Notificações</h3>
                  
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-xs font-medium">Notificações por E-mail</p>
                      <p className="text-xs text-gray-500">Enviar notificações por e-mail</p>
                    </div>
                    <Checkbox id="email-notif-desktop" defaultChecked className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">Notificações Push</p>
                      <p className="text-xs text-gray-500">Enviar notificações push</p>
                    </div>
                    <Checkbox id="push-notif-desktop" defaultChecked className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4" />
                  </div>
                </div>
                
                {/* Coluna 2 */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Segurança</h3>
                  
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-xs font-medium">Autenticação de Dois Fatores</p>
                      <p className="text-xs text-gray-500">Exigir para todos os usuários</p>
                    </div>
                    <Checkbox id="two-factor-desktop" className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-medium">Expiração de Senha</p>
                      <p className="text-xs text-gray-500">Exigir alteração a cada 90 dias</p>
                    </div>
                    <Checkbox id="password-expiry-desktop" defaultChecked className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4" />
                  </div>
                  
                  <h3 className="text-sm font-semibold mb-2">Dados</h3>
                  
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-xs font-medium">Backup Automático</p>
                      <p className="text-xs text-gray-500">Realizar backup diariamente</p>
                    </div>
                    <Checkbox id="auto-backup-desktop" className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium">Logs do Sistema</p>
                      <p className="text-xs text-gray-500">Manter logs detalhados</p>
                    </div>
                    <Checkbox id="system-logs-desktop" defaultChecked className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4" />
                  </div>
                </div>
              </div>
              
              {/* Layout mobile (sem alterações) */}
              <div className="md:hidden">
                {/* Configurações Gerais */}
                <div className="mb-3">
                  <h3 className="text-xs font-medium mb-2 text-gray-700">Configurações Gerais</h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-2">
                        <p className="text-xs font-medium">Modo Escuro</p>
                        <p className="text-xs text-gray-500">Ativar o tema escuro para todos os usuários</p>
                      </div>
                      <Checkbox id="dark-mode" className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 flex-shrink-0" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-2">
                        <p className="text-xs font-medium">Modo Manutenção</p>
                        <p className="text-xs text-gray-500">Ativar o modo de manutenção</p>
                      </div>
                      <Checkbox id="maintenance" className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 flex-shrink-0" />
                    </div>
                  </div>
                </div>
                
                <div className="h-px bg-gray-100 my-2" />
                
                {/* Notificações */}
                <div className="mb-3">
                  <h3 className="text-xs font-medium mb-2 text-gray-700">Notificações</h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-2">
                        <p className="text-xs font-medium">Notificações por E-mail</p>
                        <p className="text-xs text-gray-500">Enviar notificações por e-mail</p>
                      </div>
                      <Checkbox id="email-notif" defaultChecked className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 flex-shrink-0" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-2">
                        <p className="text-xs font-medium">Notificações Push</p>
                        <p className="text-xs text-gray-500">Enviar notificações push</p>
                      </div>
                      <Checkbox id="push-notif" defaultChecked className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 flex-shrink-0" />
                    </div>
                  </div>
                </div>
                
                <div className="h-px bg-gray-100 my-2" />
                
                {/* Segurança */}
                <div className="mb-3">
                  <h3 className="text-xs font-medium mb-2 text-gray-700">Segurança</h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-2">
                        <p className="text-xs font-medium">Autenticação de Dois Fatores</p>
                        <p className="text-xs text-gray-500">Exigir para todos os usuários</p>
                      </div>
                      <Checkbox id="two-factor" className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 flex-shrink-0" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-2">
                        <p className="text-xs font-medium">Expiração de Senha</p>
                        <p className="text-xs text-gray-500">Exigir alteração a cada 90 dias</p>
                      </div>
                      <Checkbox id="password-expiry" defaultChecked className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 flex-shrink-0" />
                    </div>
                  </div>
                </div>
                
                <div className="h-px bg-gray-100 my-2" />
                
                {/* Dados */}
                <div>
                  <h3 className="text-xs font-medium mb-2 text-gray-700">Dados</h3>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-2">
                        <p className="text-xs font-medium">Backup Automático</p>
                        <p className="text-xs text-gray-500">Realizar backup diariamente</p>
                      </div>
                      <Checkbox id="auto-backup" className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 flex-shrink-0" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1 pr-2">
                        <p className="text-xs font-medium">Logs do Sistema</p>
                        <p className="text-xs text-gray-500">Manter logs detalhados</p>
                      </div>
                      <Checkbox id="system-logs" defaultChecked className="rounded-sm data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Settings;
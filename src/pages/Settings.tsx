import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import MobileNav from "@/components/MobileNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

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
          <h2 className="text-xl font-semibold mb-6">Configurações</h2>
          
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-8">
                {/* Configurações Gerais */}
                <div>
                  <h3 className="text-base font-semibold mb-4">Configurações Gerais</h3>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Modo Escuro</p>
                        <p className="text-xs text-gray-500">Ativar o tema escuro para todos os usuários</p>
                      </div>
                      <Switch id="dark-mode" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Modo Manutenção</p>
                        <p className="text-xs text-gray-500">Ativar o modo de manutenção</p>
                      </div>
                      <Switch id="maintenance" />
                    </div>
                  </div>
                </div>
                
                {/* Notificações */}
                <div>
                  <h3 className="text-base font-semibold mb-4">Notificações</h3>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Notificações por E-mail</p>
                        <p className="text-xs text-gray-500">Enviar notificações por e-mail</p>
                      </div>
                      <Switch id="email-notif" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Notificações Push</p>
                        <p className="text-xs text-gray-500">Enviar notificações push</p>
                      </div>
                      <Switch id="push-notif" defaultChecked />
                    </div>
                  </div>
                </div>
                
                {/* Segurança */}
                <div>
                  <h3 className="text-base font-semibold mb-4">Segurança</h3>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Autenticação de Dois Fatores</p>
                        <p className="text-xs text-gray-500">Exigir para todos os usuários</p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Expiração de Senha</p>
                        <p className="text-xs text-gray-500">Exigir alteração a cada 90 dias</p>
                      </div>
                      <Switch id="password-expiry" defaultChecked />
                    </div>
                  </div>
                </div>
                
                {/* Dados */}
                <div>
                  <h3 className="text-base font-semibold mb-4">Dados</h3>
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Backup Automático</p>
                        <p className="text-xs text-gray-500">Realizar backup diariamente</p>
                      </div>
                      <Switch id="auto-backup" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Logs do Sistema</p>
                        <p className="text-xs text-gray-500">Manter logs detalhados</p>
                      </div>
                      <Switch id="system-logs" defaultChecked />
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
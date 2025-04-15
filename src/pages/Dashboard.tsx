import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import MobileNav from "@/components/MobileNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Calendar, 
  BookOpen, 
  Brush,
  MessageSquare,
  Info,
  ArrowRight,
  User,
  Users,
  Heart,
  ShoppingCart
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is authenticated
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

  const siteOverview = [
    {
      title: "Frentes",
      icon: FileText,
      description: "Conheça as frentes espirituais do terreiro e suas atividades.",
      path: "/frentes",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Eventos",
      icon: Calendar,
      description: "Calendário de giras, festas e eventos especiais do terreiro.",
      path: "/eventos",
      color: "bg-purple-50 text-purple-700",
    },
    {
      title: "Leitura",
      icon: BookOpen,
      description: "Materiais de estudo e leituras recomendadas para médiuns.",
      path: "/leitura",
      color: "bg-amber-50 text-amber-700",
    },
    {
      title: "Limpeza",
      icon: Brush,
      description: "Escala de limpeza e manutenção do terreiro.",
      path: "/limpeza",
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Lista de Compras",
      icon: ShoppingCart,
      description: "Visualize os itens que precisam ser comprados para o terreiro.",
      path: "/lista-compras",
      color: "bg-cyan-50 text-cyan-700",
    },
    {
      title: "Mensagens",
      icon: MessageSquare,
      description: "Comunicações importantes e mensagens da diretoria.",
      path: "/mensagens",
      color: "bg-rose-50 text-rose-700",
    },
    {
      title: "Bate Papo",
      icon: Heart,
      description: "Chat comunitário em tempo real entre os membros do terreiro.",
      path: "/chat",
      color: "bg-pink-50 text-pink-700",
    },
    {
      title: "Sobre",
      icon: Info,
      description: "História e informações sobre o terreiro.",
      path: "/sobre",
      color: "bg-indigo-50 text-indigo-700",
    },
    {
      title: "Meu Perfil",
      icon: User,
      description: "Gerencie suas informações pessoais e preferências.",
      path: "/profile",
      color: "bg-gray-50 text-gray-700",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <DesktopSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="px-4 md:px-5 py-4 md:py-6 pb-28 md:pb-6">
          {/* Bem-vindo */}
          <div className="bg-white border border-gray-100 rounded mb-4 md:mb-5">
            <div className="px-4 md:px-5 py-3 md:py-4 border-b border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-1 md:mb-2">
                <h1 className="text-lg md:text-xl font-medium text-gray-900">Bem-vindo ao Portal do Ylê Axé Xangô & Oxum</h1>
              </div>
              <p className="text-xs text-gray-500">Terreiro de Umbanda e Nação</p>
            </div>
            
            <div className="p-4 md:p-5">
              <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-center">
                <div className="rounded-lg overflow-hidden w-full md:w-1/3 h-40 md:h-48 bg-gray-200">
                  <img 
                    src="/terreiro-placeholder.jpg" 
                    alt="Terreiro Ylê Axé Xangô & Oxum" 
                    className="w-full h-full object-cover"
                    onError={(e) => {e.currentTarget.src = "https://via.placeholder.com/400x300?text=Terreiro"}}
                  />
                </div>
                <div className="w-full md:w-2/3">
                  <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4">
                    Bem-vindo ao espaço digital do nosso terreiro. Aqui você encontrará informações sobre nossa comunidade,
                    eventos, estudos e atividades. Este portal foi criado para facilitar a comunicação entre todos os
                    membros e auxiliar na organização de nossas atividades espirituais.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-600">
                      <Users className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      <span>42 Membros ativos</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-600">
                      <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      <span>Próxima gira: 15/12/2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Acesso rápido às seções */}
          <div className="mb-4 md:mb-5">
            <h2 className="text-sm md:text-base font-medium text-gray-900 mb-2 md:mb-3">Visão Geral do Site</h2>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5 md:gap-3 lg:gap-4 max-w-5xl">
              {siteOverview.map((section, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-gray-100 rounded-lg aspect-square hover:shadow-sm cursor-pointer"
                  onClick={() => navigate(section.path)}
                >
                  <div className="flex flex-col items-center justify-center h-full text-center p-2">
                    <div className={`p-2 rounded-full ${section.color} bg-opacity-20 mb-2`}>
                      <section.icon className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <h3 className="text-xs font-medium text-gray-900 mb-2">{section.title}</h3>
                    <div className="flex items-center text-[10px] text-blue-600">
                      <span>Acessar</span>
                      <ArrowRight className="h-2.5 w-2.5 ml-0.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Dashboard;

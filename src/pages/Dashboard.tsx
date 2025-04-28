import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Calendar, 
  CalendarDays, 
  BookOpen, 
  Brush,
  MessageSquare,
  ArrowRight,
  User,
  Users,
  Heart,
  ShoppingCart,
  Leaf,
  LogOut
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  console.log('Dashboard renderizado');

  const siteOverview = [
    {
      title: "Frentes",
      icon: FileText,
      description: "Conheça as frentes espirituais do terreiro e suas atividades.",
      path: "/frentes",
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Ervas",
      icon: Leaf,
      description: "Gerencie as ervas cadastradas e seus usos tradicionais.",
      path: "/ervas",
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Compras",
      icon: ShoppingCart,
      description: "Visualize os itens que precisam ser comprados para o terreiro.",
      path: "/compras",
      color: "bg-cyan-50 text-cyan-700",
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
      title: "Mensagens",
      icon: MessageSquare,
      description: "Envie e gerencie mensagens para a comunidade do terreiro.",
      path: "/mensagens",
      color: "bg-pink-50 text-pink-700",
    },
    {
      title: "Bate Papo",
      icon: Heart,
      description: "Chat comunitário em tempo real entre os membros do terreiro.",
      path: "/chat",
      color: "bg-rose-50 text-rose-700",
    },
    {
      title: "Meu Perfil",
      icon: User,
      description: "Gerencie suas informações pessoais e preferências.",
      path: "/profile",
      color: "bg-gray-50 text-gray-700",
    },
    {
      title: "Usuários",
      icon: Users,
      description: "Visualize todos os perfis de usuários do sistema.",
      path: "/admin/usuarios-view",
      color: "bg-indigo-50 text-indigo-700",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <h1 style={{textAlign: 'center', margin: '2rem 0', color: '#222'}}>Dashboard</h1>
      <div className="flex-1">
      
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
                  <picture>
                    <source srcSet="/terreiro-placeholder.webp" type="image/webp" />
                    <img 
                      src="/terreiro-placeholder.jpg" 
                      alt="Terreiro Ylê Axé Xangô & Oxum" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {e.currentTarget.src = "https://via.placeholder.com/400x300?text=Terreiro"}}
                    />
                  </picture>
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
          <div className="mb-4 md:mb-5 flex items-center justify-between">
            <h2 className="text-sm md:text-base font-medium text-gray-900 mb-2 md:mb-3 text-left">Visão Geral do Site</h2>
            <button
              className="flex items-center gap-1 px-2 py-1 rounded bg-transparent text-xs text-red-600 hover:text-red-700 focus:outline-none border-none shadow-none"
              style={{ boxShadow: 'none' }}
              onClick={() => {
                localStorage.removeItem("isAuthenticated");
                navigate("/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-w-5xl">
            {siteOverview.map((section, index) => (
              <div 
                key={index} 
                className="bg-white border border-gray-100 rounded-[12px] aspect-square hover:shadow-sm cursor-pointer transition-shadow w-[95px] h-[95px]"
                onClick={() => navigate(section.path)}
              >
                <div className="flex flex-col h-full p-2 relative">
                  {/* Ícone no canto superior esquerdo */}
                  <div className="absolute top-2 left-2">
                    <section.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  {/* Nome centralizado */}
                  <div className="flex-1 flex items-center justify-center">
                    <h3 className="text-[11px] font-medium text-gray-900 text-center line-clamp-2">{section.title}</h3>
                  </div>
                  {/* Link de acessar no canto inferior esquerdo */}
                  <div className="absolute bottom-2 left-2 flex items-center text-[10px] text-blue-600">
                    <span>Acessar</span>
                    <ArrowRight className="h-3 w-3 ml-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

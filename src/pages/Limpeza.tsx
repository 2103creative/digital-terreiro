import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import MobileNav from "@/components/MobileNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Interface para os itens de limpeza
interface CleaningItem {
  id: number;
  date: string;
  month: string;
  team: string;
  isSpecialDay: boolean;
  status: "pending" | "completed" | "missed";
}

// Interface para as configurações de visualização
interface ViewSettings {
  showStatusButtons: boolean;
  showObservations: boolean;
  allowStatusChange: boolean;
  observationsText: string;
  pageTitle: string;
  pageSubtitle: string;
}

// Configurações padrão
const DEFAULT_VIEW_SETTINGS: ViewSettings = {
  showStatusButtons: true,
  showObservations: true,
  allowStatusChange: true,
  observationsText: `• Caso haja necessidade de qualquer motivo para a realização da mesma em dias antecipados ou posteriores, atente-se em comunicar o seu parceiro(a) para não haver discordância.

• As limpezas serão supervisionadas a cada limpeza, assim verificando se a limpeza teve efetividade.

• A limpeza do terreiro ocorre mesmo com chuva ou sol. Em dias de chuva a parte externa não precisa ser lavada.

• A limpeza consiste em lavar o chão, vidros internos e externos, paredes e teto quando necessário, tirar o pó onde houver pó, tirar teias de aranha quando observado, área externa, escadas, banheiro, lavanderia, pias internas e externas, organizar os panos utilizados para a limpeza do dia (lavar, secar, guardar). Retire o lixo para a rua quando houver necessidade. Passar um pano molhado nos corrimãos das escadas, colocar no lixo do banheiro quando trocar, lavar os panos usados na limpeza, lavar os panos de pratos, tapetes e toalhas de rosto.

• Ao finalizar as tarefas, por favor, salve tudo o que foi utilizado nos seus devidos lugares.

Lembrete: Sempre que levar os panos pra lavar, traga na próxima vez que vier pro Terreiro.

Lavar separadamente os panos:
• Toalhas de rosto com toalhas de rosto.
• Panos de prato com panos de prato.
• Tapetes com tapetes.
• Pano de chão com pano de chão.

Agradeço a compreensão de todos!`,
  pageTitle: "Lista de limpeza e \"Dias D\" do terreiro para 2025",
  pageSubtitle: "\"Dias D\" Todos participam e segue a cada dois meses"
};

const Limpeza = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [cleaningItems, setCleaningItems] = useState<CleaningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewSettings, setViewSettings] = useState<ViewSettings>(DEFAULT_VIEW_SETTINGS);
  
  useEffect(() => {
    loadCleaningData();
    loadViewSettings();
  }, []);

  const loadViewSettings = () => {
    // Carregar configurações definidas pelo administrador
    const savedSettings = localStorage.getItem('cleaningViewSettings');
    if (savedSettings) {
      try {
        setViewSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    }
  };
  
  const loadCleaningData = () => {
    setIsLoading(true);
    // Simulando carregamento de dados
    setTimeout(() => {
      const data: CleaningItem[] = [
        // Janeiro
        { id: 1, date: "11/01", month: "Janeiro", team: "Karina e Nicole", isSpecialDay: false, status: "pending" },
        { id: 2, date: "18/01", month: "Janeiro", team: "Tita e Maicon (Início da Construção)", isSpecialDay: false, status: "pending" },
        { id: 3, date: "25/01", month: "Janeiro", team: "OBRIGAÇÃO DE MATA", isSpecialDay: true, status: "pending" },
        
        // Fevereiro
        { id: 4, date: "01/02", month: "Fevereiro", team: "Jeferson e Bruna", isSpecialDay: false, status: "pending" },
        { id: 5, date: "08/02", month: "Fevereiro", team: "Leno e Carol", isSpecialDay: false, status: "pending" },
        { id: 6, date: "15/02", month: "Fevereiro", team: "(Dia D)", isSpecialDay: true, status: "pending" },
        { id: 7, date: "22/02", month: "Fevereiro", team: "Stefany e Tita", isSpecialDay: false, status: "pending" },
        { id: 8, date: "29/02", month: "Fevereiro", team: "Karina e Maicon", isSpecialDay: false, status: "pending" },
        
        // Março e demais meses continuam aqui...
      ];
      
      setCleaningItems(data);
      setIsLoading(false);
    }, 800);
  };
  
  const handleStatusChange = (id: number, status: "pending" | "completed" | "missed") => {
    // Verificar se a alteração de status é permitida pelas configurações
    if (!viewSettings.allowStatusChange) {
      toast({
        title: "Ação não permitida",
        description: "O administrador desativou a alteração de status.",
        variant: "destructive",
      });
      return;
    }
    
    // Em um app real, isso enviaria uma requisição para o servidor
    setCleaningItems(prevItems => 
      prevItems.map(item => item.id === id ? { ...item, status } : item)
    );
    
    toast({
      title: "Status atualizado",
      description: "O status da tarefa foi atualizado com sucesso.",
    });
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "missed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-amber-600" />;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50";
      case "missed":
        return "bg-red-50";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0 md:flex">
      <DesktopSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="container mx-auto px-4 py-6">
          <div className="bg-white shadow-sm rounded-lg py-4 px-6 mb-6">
            <h1 className="text-xl font-medium text-gray-800 text-center">{viewSettings.pageTitle}</h1>
            <p className="text-center text-gray-600 text-sm mt-2">
              {viewSettings.pageSubtitle}
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-10 w-10 border-3 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(cleaningItems.reduce((acc, item) => {
                acc[item.month] = true;
                return acc;
              }, {})).map(month => (
                <div key={month} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <h2 className="text-lg font-medium text-gray-800">{month}</h2>
                  </div>
                  <div className="p-0">
                    <table className="w-full border-collapse">
                      <tbody>
                        {cleaningItems
                          .filter(item => item.month === month)
                          .map(item => (
                            <tr 
                              key={item.id} 
                              className={`border-b border-gray-100 hover:bg-gray-50 ${
                                item.isSpecialDay ? 'bg-blue-50' : getStatusClass(item.status)
                              }`}
                            >
                              <td className="px-4 py-3 text-center w-16">
                                <span className="text-sm font-medium text-gray-700">{item.date}</span>
                              </td>
                              <td className="px-2 py-3">
                                <span className={`text-sm ${item.isSpecialDay ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                                  {item.team}
                                </span>
                                {item.isSpecialDay && (
                                  <div className="text-xs text-blue-600 mt-0.5">
                                    Todos participam
                                  </div>
                                )}
                              </td>
                              {viewSettings.showStatusButtons && (
                                <td className="px-2 py-3 w-32 text-right">
                                  <div className="flex justify-end space-x-2">
                                    <button 
                                      onClick={() => handleStatusChange(item.id, "pending")}
                                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
                                        item.status === "pending" 
                                          ? "bg-amber-100 border-amber-300" 
                                          : "border-gray-200 hover:bg-amber-50"
                                      }`}
                                      aria-label="Pendente"
                                      disabled={!viewSettings.allowStatusChange}
                                    >
                                      <Clock className={`h-5 w-5 ${
                                        item.status === "pending" ? "text-amber-600" : "text-gray-400"
                                      }`} />
                                    </button>
                                    
                                    <button 
                                      onClick={() => handleStatusChange(item.id, "completed")}
                                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
                                        item.status === "completed" 
                                          ? "bg-green-100 border-green-300" 
                                          : "border-gray-200 hover:bg-green-50"
                                      }`}
                                      aria-label="Concluído"
                                      disabled={!viewSettings.allowStatusChange}
                                    >
                                      <CheckCircle className={`h-5 w-5 ${
                                        item.status === "completed" ? "text-green-600" : "text-gray-400"
                                      }`} />
                                    </button>
                                    
                                    <button 
                                      onClick={() => handleStatusChange(item.id, "missed")}
                                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors ${
                                        item.status === "missed" 
                                          ? "bg-red-100 border-red-300" 
                                          : "border-gray-200 hover:bg-red-50"
                                      }`}
                                      aria-label="Não realizado"
                                      disabled={!viewSettings.allowStatusChange}
                                    >
                                      <XCircle className={`h-5 w-5 ${
                                        item.status === "missed" ? "text-red-600" : "text-gray-400"
                                      }`} />
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {viewSettings.showObservations && (
            <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">OBSERVAÇÕES</h2>
              <div className="space-y-3 text-sm text-gray-600">
                {viewSettings.observationsText.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Limpeza; 
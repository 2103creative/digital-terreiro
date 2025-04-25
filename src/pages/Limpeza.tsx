import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileNav from "@/components/MobileNav";
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

  const groupedByMonth = cleaningItems.reduce((acc, item) => {
    acc[item.month] = acc[item.month] || [];
    acc[item.month].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-2xl font-bold mt-8 mb-1">Limpeza</h1>
      <p className="text-gray-600 mb-6">Confira as listas de limpeza e os "Dias D" do terreiro. Todos participam!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {Object.entries(groupedByMonth).map(([month, items]) => (
          <div key={month} className="bg-gray-50 border rounded-xl p-0 shadow-sm flex flex-col h-full min-h-[180px]">
            <span className="font-bold text-base px-6 pt-5 pb-2">{month}</span>
            <ul className="text-sm text-gray-700">
              {items.map(item => (
                <li key={item.id}
                  className={`flex items-center px-6 py-2 border-t last:rounded-b-xl last:border-b-0 border-gray-100 ${item.isSpecialDay ? 'bg-blue-50' : ''}`}
                >
                  <span className="w-16 text-xs font-medium text-gray-500">{item.date}</span>
                  <span className={`ml-2 flex-1 ${item.isSpecialDay ? 'text-blue-700 font-semibold uppercase' : ''}`}>{item.team}</span>
                  {item.isSpecialDay && (
                    <span className="block ml-2 text-xs text-blue-500">Todos participam</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Limpeza; 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import MobileNav from "@/components/MobileNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";

// Interface para os itens de limpeza
interface CleaningItem {
  id: number;
  date: string;
  month: string;
  team: string;
  isSpecialDay: boolean;
  status: "pending" | "completed" | "missed";
}

const statusOptions = [
  { value: "pending", label: "Pendente", icon: Clock },
  { value: "completed", label: "Concluído", icon: CheckCircle },
  { value: "missed", label: "Não realizado", icon: XCircle },
];

const AdminLimpeza = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cleaningItems, setCleaningItems] = useState<CleaningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Verificar se o usuário está autenticado e é admin
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
      toast({
        title: "Acesso negado",
        description: "Por favor, faça login para acessar esta página",
        variant: "destructive",
      });
      return;
    }

    // Simulação de verificação de admin
    setTimeout(() => {
      const isAdmin = true; // Em um app real, isso seria verificado via API
      if (!isAdmin) {
        navigate("/dashboard");
        toast({
          title: "Acesso restrito",
          description: "Você não tem permissão para acessar esta área",
          variant: "destructive",
        });
      }
    }, 500);
    
    // Carregar os dados de limpeza
    loadCleaningData();
  }, [navigate, toast]);
  
  const loadCleaningData = () => {
    setIsLoading(true);
    // Em um app real, isso seria uma requisição para carregar os dados
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
        
        // Março
        { id: 9, date: "01/03", month: "Março", team: "Camila e Nicole", isSpecialDay: false, status: "pending" },
        { id: 10, date: "08/03", month: "Março", team: "Baby e Bruna", isSpecialDay: false, status: "pending" },
        { id: 11, date: "15/03", month: "Março", team: "Leno e Stefany", isSpecialDay: false, status: "pending" },
        { id: 12, date: "22/03", month: "Março", team: "Tainan e Maicon", isSpecialDay: false, status: "pending" },
        { id: 13, date: "29/03", month: "Março", team: "Carol e Nicole", isSpecialDay: false, status: "pending" },
        
        // Abril
        { id: 14, date: "05/04", month: "Abril", team: "Camila e Baby", isSpecialDay: false, status: "pending" },
        { id: 15, date: "12/04", month: "Abril", team: "Jeferson e Stefany", isSpecialDay: false, status: "pending" },
        { id: 16, date: "19/04", month: "Abril", team: "(Dia D)", isSpecialDay: true, status: "pending" },
        { id: 17, date: "26/04", month: "Abril", team: "Tainan e Leno", isSpecialDay: false, status: "pending" },
        
        // Maio
        { id: 18, date: "03/05", month: "Maio", team: "Karina e Tita", isSpecialDay: false, status: "pending" },
        { id: 19, date: "10/05", month: "Maio", team: "Carol e Maicon", isSpecialDay: false, status: "pending" },
        { id: 20, date: "17/05", month: "Maio", team: "Tainan e Jeferson", isSpecialDay: false, status: "pending" },
        { id: 21, date: "24/05", month: "Maio", team: "Baby e Bruna", isSpecialDay: false, status: "pending" },
        { id: 22, date: "31/05", month: "Maio", team: "Stefany e Leno", isSpecialDay: false, status: "pending" },
        
        // Junho
        { id: 23, date: "07/06", month: "Junho", team: "Nicole e Tita", isSpecialDay: false, status: "pending" },
        { id: 24, date: "14/06", month: "Junho", team: "Carol e Camila", isSpecialDay: false, status: "pending" },
        { id: 25, date: "21/06", month: "Junho", team: "(Dia D)", isSpecialDay: true, status: "pending" },
        { id: 26, date: "28/06", month: "Junho", team: "Maicon e Stefany", isSpecialDay: false, status: "pending" },
        
        // Julho
        { id: 27, date: "05/07", month: "Julho", team: "Baby e Bruna", isSpecialDay: false, status: "pending" },
        { id: 28, date: "12/07", month: "Julho", team: "Leno e Nicole", isSpecialDay: false, status: "pending" },
        { id: 29, date: "19/07", month: "Julho", team: "Karina e Stefany", isSpecialDay: false, status: "pending" },
        { id: 30, date: "26/07", month: "Julho", team: "Carol e Maicon", isSpecialDay: false, status: "pending" },
        
        // Agosto
        { id: 31, date: "02/08", month: "Agosto", team: "Camila e Jeferson", isSpecialDay: false, status: "pending" },
        { id: 32, date: "09/08", month: "Agosto", team: "Baby e Leno", isSpecialDay: false, status: "pending" },
        { id: 33, date: "16/08", month: "Agosto", team: "(Dia D)", isSpecialDay: true, status: "pending" },
        { id: 34, date: "23/08", month: "Agosto", team: "Tainan e Karina", isSpecialDay: false, status: "pending" },
        { id: 35, date: "30/08", month: "Agosto", team: "Tita e Stefany", isSpecialDay: false, status: "pending" },
        
        // Setembro
        { id: 36, date: "06/09", month: "Setembro", team: "Carol e Maicon", isSpecialDay: false, status: "pending" },
        { id: 37, date: "13/09", month: "Setembro", team: "Camila e Baby", isSpecialDay: false, status: "pending" },
        { id: 38, date: "20/09", month: "Setembro", team: "Jeferson e Tainan", isSpecialDay: false, status: "pending" },
        { id: 39, date: "27/09", month: "Setembro", team: "Nicole e Leno", isSpecialDay: false, status: "pending" },
        
        // Outubro
        { id: 40, date: "04/10", month: "Outubro", team: "Karina e Tita", isSpecialDay: false, status: "pending" },
        { id: 41, date: "11/10", month: "Outubro", team: "Carol e Stefany", isSpecialDay: false, status: "pending" },
        { id: 42, date: "18/10", month: "Outubro", team: "(Dia D)", isSpecialDay: true, status: "pending" },
        { id: 43, date: "25/10", month: "Outubro", team: "Camila e Tainan", isSpecialDay: false, status: "pending" },
        
        // Novembro
        { id: 44, date: "01/11", month: "Novembro", team: "Jeferson e Nicole", isSpecialDay: false, status: "pending" },
        { id: 45, date: "08/11", month: "Novembro", team: "Leno e Baby", isSpecialDay: false, status: "pending" },
        { id: 46, date: "15/11", month: "Novembro", team: "Karina e Tainan", isSpecialDay: false, status: "pending" },
        { id: 47, date: "22/11", month: "Novembro", team: "Carol e Camila", isSpecialDay: false, status: "pending" },
        { id: 48, date: "29/11", month: "Novembro", team: "Maicon e Tita", isSpecialDay: false, status: "pending" },
        
        // Dezembro
        { id: 49, date: "06/12", month: "Dezembro", team: "Leno e Jeferson", isSpecialDay: false, status: "pending" },
        { id: 50, date: "13/12", month: "Dezembro", team: "Nicole e Bruna", isSpecialDay: false, status: "pending" },
        { id: 51, date: "20/12", month: "Dezembro", team: "(Dia D)", isSpecialDay: true, status: "pending" }
      ];
      
      setCleaningItems(data);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleStatusChange = (id: number, status: "pending" | "completed" | "missed") => {
    // Em um app real, enviaria a alteração para o servidor
    const updatedItems = cleaningItems.map(item => 
      item.id === id ? { ...item, status } : item
    );
    
    setCleaningItems(updatedItems);
    
    toast({
      title: "Status atualizado",
      description: "O status da tarefa foi atualizado com sucesso.",
    });
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "missed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50";
      case "missed":
        return "bg-red-50";
      default:
        return "bg-amber-50";
    }
  };
  
  const saveChanges = () => {
    // Em um app real, isso enviarisa todas as alterações para o servidor de uma vez
    toast({
      title: "Alterações salvas",
      description: "Todas as alterações foram salvas com sucesso.",
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0 md:flex">
      <DesktopSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="container mx-auto px-4 py-6">
          <div className="bg-white shadow-sm rounded-lg py-4 px-6 mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-medium text-gray-800">Lista de limpeza e "Dias D" do terreiro para 2025</h1>
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700" onClick={saveChanges}>Salvar alterações</Button>
            </div>
            
            <p className="text-gray-600 text-sm mt-2">
              "Dias D" Todos participam e segue a cada dois meses. Utilize os seletores para atualizar o status de cada tarefa.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              className={`border-b border-gray-100 last:border-b-0 ${
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
                              <td className="px-4 py-3 w-40">
                                <div className="flex items-center justify-end space-x-2">
                                  {getStatusIcon(item.status)}
                                  <Select
                                    value={item.status}
                                    onValueChange={(value) => 
                                      handleStatusChange(
                                        item.id, 
                                        value as "pending" | "completed" | "missed"
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-32 h-8 text-sm bg-white border border-gray-200 shadow-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {statusOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                          <div className="flex items-center">
                                            <option.icon className="mr-2 h-4 w-4" />
                                            <span>{option.label}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="bg-white shadow-sm rounded-lg mt-8 p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">OBSERVAÇÕES:</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>• Caso haja necessidade de qualquer motivo para a realização da mesma em dias antecipados ou posteriores, atente-se em comunicar o seu parceiro(a) para não haver discordância.</p>
              <p>• As limpezas serão supervisionadas a cada limpeza, assim verificando se a limpeza teve efetividade.</p>
              <p>• A limpeza do terreiro ocorre mesmo com chuva ou sol. Em dias de chuva a parte externa não precisa ser lavada.</p>
              <p>• A limpeza consiste em lavar o chão, vidros internos e externos, paredes e teto quando necessário, tirar o pó onde houver pó, tirar teias de aranha quando observado, área externa, escadas, banheiro, lavanderia, pias internas e externas, organizar os panos utilizados para a limpeza do dia (lavar, secar, guardar). Retire o lixo para a rua quando houver necessidade. Passar um pano molhado nos corrimãos das escadas, colocar no lixo do banheiro quando trocar, lavar os panos usados na limpeza, lavar os panos de pratos, tapetes e toalhas de rosto.</p>
              <p>• Ao finalizar as tarefas, por favor, salve tudo o que foi utilizado nos seus devidos lugares.</p>
              
              <div className="pt-2">
                <p className="font-medium text-gray-800">Lembrete: Sempre que levar os panos pra lavar, traga na próxima vez que vier pro Terreiro.</p>
              </div>
              
              <div className="pt-2">
                <p className="font-medium text-gray-800">Lavar separadamente os panos:</p>
                <p>• Toalhas de rosto com toalhas de rosto.</p>
                <p>• Panos de prato com panos de prato.</p>
                <p>• Tapetes com tapetes.</p>
                <p>• Pano de chão com pano de chão.</p>
              </div>
              
              <p className="pt-2 font-medium text-gray-800">Agradeço a compreensão de todos!</p>
            </div>
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default AdminLimpeza; 
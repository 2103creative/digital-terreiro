import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Filter, Download } from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const { toast } = useToast();
  const [cleaningItems, setCleaningItems] = useState<CleaningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Carregar os dados de limpeza
    loadCleaningData();
  }, []);
  
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
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "missed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-amber-600" />;
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
  
  const saveChanges = () => {
    // Em um app real, isso enviarisa todas as alterações para o servidor de uma vez
    toast({
      title: "Alterações salvas",
      description: "Todas as alterações foram salvas com sucesso.",
    });
  };
  
  return (
    <AdminLayout>
      {/* Página de lista no estilo ERPNext 15 */}
      <div className="bg-white border border-gray-100 rounded px-5 pb-4">
        {/* Cabeçalho da página */}
        <div className="py-4 border-b border-gray-100">
          <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center mb-2">
            <h1 className="text-xl font-medium text-gray-900">Lista de Limpeza 2025</h1>
            <div className="flex space-x-2 mb-2 md:mb-0">
              <Button variant="outline" size="sm" className="h-8 text-xs px-2 text-gray-600 border-gray-200 bg-white">
                <Filter className="h-3.5 w-3.5 mr-1" />
                Filtrar
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs px-2 text-gray-600 border-gray-200 bg-white">
                <Download className="h-3.5 w-3.5 mr-1" />
                Exportar
              </Button>
              <Button 
                size="sm" 
                className="h-8 text-xs px-3 bg-blue-500 hover:bg-blue-600 text-white" 
                onClick={saveChanges}
              >
                Salvar alterações
              </Button>
            </div>
          </div>
          <p className="text-gray-500 text-xs">
            "Dias D" são tarefas coletivas que ocorrem a cada dois meses. Utilize os seletores para atualizar o status de cada tarefa.
          </p>
        </div>
        
        {/* Conteúdo principal */}
        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin h-10 w-10 border-3 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.keys(cleaningItems.reduce((acc, item) => {
                acc[item.month] = true;
                return acc;
              }, {})).map(month => (
                <div key={month} className="border border-gray-100 rounded overflow-hidden">
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                    <h2 className="text-sm font-medium text-gray-700">{month}</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody>
                        {cleaningItems
                          .filter(item => item.month === month)
                          .map(item => (
                            <tr 
                              key={item.id} 
                              className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                                item.isSpecialDay ? 'bg-blue-50' : getStatusClass(item.status)
                              }`}
                            >
                              <td className="px-3 py-2 text-center w-14">
                                <span className="text-xs font-medium text-gray-600">{item.date}</span>
                              </td>
                              <td className="px-3 py-2">
                                <span className={`text-xs ${item.isSpecialDay ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                                  {item.team}
                                </span>
                                {item.isSpecialDay && (
                                  <div className="text-[10px] text-blue-500 mt-0.5">
                                    Todos participam
                                  </div>
                                )}
                              </td>
                              <td className="px-3 py-2 w-36">
                                <div className="flex items-center justify-end">
                                  <Select
                                    value={item.status}
                                    onValueChange={(value) => 
                                      handleStatusChange(
                                        item.id, 
                                        value as "pending" | "completed" | "missed"
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-28 h-7 text-xs bg-white border border-gray-200 rounded">
                                      <div className="flex items-center">
                                        {getStatusIcon(item.status)}
                                        <SelectValue className="ml-1.5" />
                                      </div>
                                    </SelectTrigger>
                                    <SelectContent className="text-xs">
                                      {statusOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                          <div className="flex items-center">
                                            <option.icon className="mr-1.5 h-3.5 w-3.5" />
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
          </div>
        )}
      </div>
      
      {/* Seção de observações no estilo ERPNext 15 */}
      <div className="bg-white border border-gray-100 rounded px-5 py-4 mt-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3">OBSERVAÇÕES</h2>
        <div className="space-y-3 text-xs text-gray-600">
          <p>• Caso haja necessidade de qualquer motivo para a realização da mesma em dias antecipados ou posteriores, atente-se em comunicar o seu parceiro(a) para não haver discordância.</p>
          <p>• As limpezas serão supervisionadas a cada limpeza, assim verificando se a limpeza teve efetividade.</p>
          <p>• A limpeza do terreiro ocorre mesmo com chuva ou sol. Em dias de chuva a parte externa não precisa ser lavada.</p>
          <p>• A limpeza consiste em lavar o chão, vidros internos e externos, paredes e teto quando necessário, tirar o pó onde houver pó, tirar teias de aranha quando observado, área externa, escadas, banheiro, lavanderia, pias internas e externas, organizar os panos utilizados para a limpeza do dia (lavar, secar, guardar). Retire o lixo para a rua quando houver necessidade. Passar um pano molhado nos corrimãos das escadas, colocar no lixo do banheiro quando trocar, lavar os panos usados na limpeza, lavar os panos de pratos, tapetes e toalhas de rosto.</p>
          <p>• Ao finalizar as tarefas, por favor, salve tudo o que foi utilizado nos seus devidos lugares.</p>
          
          <div className="pt-1">
            <p className="font-medium text-gray-700 text-xs">Lembrete: Sempre que levar os panos pra lavar, traga na próxima vez que vier pro Terreiro.</p>
          </div>
          
          <div className="pt-1">
            <p className="font-medium text-gray-700 text-xs">Lavar separadamente os panos:</p>
            <p>• Toalhas de rosto com toalhas de rosto.</p>
            <p>• Panos de prato com panos de prato.</p>
            <p>• Tapetes com tapetes.</p>
            <p>• Pano de chão com pano de chão.</p>
          </div>
          
          <p className="pt-1 font-medium text-gray-700">Agradeço a compreensão de todos!</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLimpeza; 
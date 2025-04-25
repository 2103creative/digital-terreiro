import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Filter, Download, Save, Eye, EyeOff, Edit, Trash, Plus, ListPlus } from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Interface para os itens de limpeza
interface CleaningItem {
  id: number;
  date: string;
  month: string;
  team: string;
  isSpecialDay: boolean;
  status: "pending" | "completed" | "missed";
}

// Formulário para editar item
interface EditingItem extends Omit<CleaningItem, 'id'> {
  id?: number;
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

const statusOptions = [
  { value: "pending", label: "Pendente", icon: Clock },
  { value: "completed", label: "Concluído", icon: CheckCircle },
  { value: "missed", label: "Não realizado", icon: XCircle },
];

const AdminLimpeza = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [cleaningItems, setCleaningItems] = useState<CleaningItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Estado para as configurações de visualização
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
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
  });
  
  // Função para converter as datas da escala gerada para o formato esperado
  const convertGeneratedScheduleToCleaningItems = (generatedSchedule: any[]): CleaningItem[] => {
    let counter = 1;
    
    return generatedSchedule.map(item => {
      let formattedDate = item.date;
      
      // Se a data estiver no formato YYYY-MM-DD, converter para DD/MM
      if (item.date && item.date.includes('-')) {
        const [year, month, day] = item.date.split('-');
        formattedDate = `${day}/${month}`;
      } 
      // Se já estiver no formato DD/MM, usar diretamente
      else if (item.date && item.date.includes('/')) {
        formattedDate = item.date;
      }
      // Caso não seja possível determinar o formato, registrar o erro
      else {
        console.error("Formato de data não reconhecido:", item.date);
        formattedDate = item.date || "Data inválida";
      }
      
      return {
        id: counter++,
        date: formattedDate,
        month: item.month,
        team: item.isSpecialDay ? item.specialDayTitle : item.names.join(' e '),
        isSpecialDay: item.isSpecialDay || false,
        status: item.status as "pending" | "completed" | "missed"
      };
    });
  };

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
    
    // Verificar se existem dados de limpeza gerados e passados como state
    if (location.state && location.state.generatedSchedule) {
      // Converter os dados recebidos para o formato esperado
      const convertedItems = convertGeneratedScheduleToCleaningItems(location.state.generatedSchedule);
      setCleaningItems(convertedItems);
      setIsLoading(false);
      
      // Limpar o histórico para evitar que os dados sejam carregados novamente ao atualizar a página
      window.history.replaceState({}, document.title);
      
      toast({
        title: "Agenda importada",
        description: "A agenda de limpeza foi importada com sucesso do gerador",
      });
    } else {
      // Carregar dados normalmente se não houver dados gerados
      loadCleaningData();
    }
    
    // Carregar configurações salvas (simulado)
    const savedSettings = localStorage.getItem('cleaningViewSettings');
    if (savedSettings) {
      try {
        setViewSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    }
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
  
  // Funções para manipulação da lista
  const handleAddItem = () => {
    setEditingItem({
      date: "",
      month: "",
      team: "",
      isSpecialDay: false,
      status: "pending"
    });
    setIsDialogOpen(true);
  };
  
  const handleEditItem = (item: CleaningItem) => {
    setEditingItem({ ...item });
    setIsDialogOpen(true);
  };
  
  const handleDeleteItem = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este item de limpeza?")) {
      const updatedItems = cleaningItems.filter(item => item.id !== id);
      setCleaningItems(updatedItems);
      
      // Desativado temporariamente
      /*
      toast({
        title: "Item excluído",
        description: "O item foi excluído da lista de limpeza com sucesso.",
      });
      */
    }
  };
  
  const handleSaveItem = () => {
    if (!editingItem) return;
    
    if (!editingItem.date || !editingItem.month || !editingItem.team) {
      // Desativado temporariamente
      /*
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      */
      return;
    }
    
    let updatedItems;
    
    if (editingItem.id) {
      // Editando item existente
      updatedItems = cleaningItems.map(item => 
        item.id === editingItem.id ? { ...editingItem, id: item.id } : item
      );
    } else {
      // Adicionando novo item
      const newId = Math.max(0, ...cleaningItems.map(item => item.id)) + 1;
      updatedItems = [
        ...cleaningItems,
        { ...editingItem, id: newId }
      ];
    }
    
    setCleaningItems(updatedItems);
    setIsDialogOpen(false);
    setEditingItem(null);
    
    // Desativado temporariamente
    /*
    toast({
      title: editingItem.id ? "Item atualizado" : "Item adicionado",
      description: `O item foi ${editingItem.id ? 'atualizado' : 'adicionado'} com sucesso.`,
    });
    */
  };
  
  const handleStatusChange = (id: number, status: "pending" | "completed" | "missed") => {
    // Em um app real, enviaria a alteração para o servidor
    const updatedItems = cleaningItems.map(item => 
      item.id === id ? { ...item, status } : item
    );
    
    setCleaningItems(updatedItems);
    
    // Desativado temporariamente
    /*
    toast({
      title: "Status atualizado",
      description: "O status da tarefa foi atualizado com sucesso.",
    });
    */
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
    // Em um app real, isso enviaria todas as alterações para o servidor de uma vez
    
    // Desativado temporariamente
    /*
    toast({
      title: "Alterações salvas",
      description: "Todas as alterações foram salvas com sucesso.",
    });
    */
  };
  
  const saveViewSettings = () => {
    // Salva as configurações no localStorage (em um app real, isso iria para um servidor)
    localStorage.setItem('cleaningViewSettings', JSON.stringify(viewSettings));
    
    // Desativado temporariamente
    /*
    toast({
      title: "Configurações salvas",
      description: "As configurações de visualização foram atualizadas com sucesso.",
    });
    */
  };
  
  return (
    <AdminLayout pageTitle="Limpeza" pageDescription="Gerencie as listas de limpeza e as datas dos Dias D do terreiro.">
      {/* Botão Adicionar logo abaixo do título/subtítulo, antes das abas */}
      <div className="flex flex-col items-start gap-2 mb-4">
        <Button 
          size="sm" 
          className="h-8 text-xs px-3 bg-black hover:bg-gray-900 text-white" 
          onClick={handleAddItem}
        >
          Adicionar
        </Button>
      </div>
      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Lista de Limpeza</TabsTrigger>
          <TabsTrigger value="settings">Configurações de Exibição</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div className="bg-white border border-gray-100 rounded px-5 pb-4">
            {/* Filtros e ações */}
            <div className="py-4 border-b border-gray-100">
              <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center mb-2">
                <div className="flex flex-wrap gap-2 mb-2 md:mb-0 w-full md:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs px-2 text-gray-600 border-gray-200 bg-white flex-1 sm:flex-none"
                    onClick={() => navigate('/admin/gerador-limpeza')}
                  >
                    <ListPlus className="h-3.5 w-3.5 mr-1" />
                    Gerador
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs px-2 text-gray-600 border-gray-200 bg-white flex-1 sm:flex-none"
                  >
                    <Filter className="h-3.5 w-3.5 mr-1" />
                    Filtrar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs px-2 text-gray-600 border-gray-200 bg-white flex-1 sm:flex-none"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Exportar
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 text-xs px-3 bg-blue-500 hover:bg-blue-600 text-white flex-1 sm:flex-none" 
                    onClick={saveChanges}
                  >
                    Salvar alterações
                  </Button>
                </div>
              </div>
              <p className="text-gray-500 text-xs">
                "Dias D" são tarefas coletivas que ocorrem a cada dois meses. Utilize os marcadores para atualizar o status de cada tarefa.
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
                      {/* Versão desktop da tabela */}
                      <div className="hidden md:block overflow-x-auto">
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
                                  <td className="px-3 py-2">
                                    <div className="flex items-center justify-end space-x-2">
                                      <div className="flex space-x-3 mr-2">
                                        <Checkbox 
                                          id={`pending-${item.id}`}
                                          checked={item.status === "pending"}
                                          className="rounded-sm data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 h-4 w-4"
                                          onCheckedChange={() => handleStatusChange(item.id, "pending")}
                                        />
                                        <Checkbox 
                                          id={`completed-${item.id}`}
                                          checked={item.status === "completed"}
                                          className="rounded-sm data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 h-4 w-4"
                                          onCheckedChange={() => handleStatusChange(item.id, "completed")}
                                        />
                                        <Checkbox 
                                          id={`missed-${item.id}`}
                                          checked={item.status === "missed"}
                                          className="rounded-sm data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500 h-4 w-4"
                                          onCheckedChange={() => handleStatusChange(item.id, "missed")}
                                        />
                                      </div>
                                      <Button
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 w-6 p-0" 
                                        onClick={() => handleEditItem(item)}
                                      >
                                        <Edit className="h-3.5 w-3.5 text-gray-500" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 w-6 p-0" 
                                        onClick={() => handleDeleteItem(item.id)}
                                      >
                                        <Trash className="h-3.5 w-3.5 text-gray-500" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Versão mobile da tabela - layout em cards */}
                      <div className="md:hidden">
                        {cleaningItems
                          .filter(item => item.month === month)
                          .map(item => (
                            <div 
                              key={item.id}
                              className={`p-3 border-b border-gray-50 ${
                                item.isSpecialDay ? 'bg-blue-50' : getStatusClass(item.status)
                              }`}
                            >
                              <div className="flex items-start justify-between mb-1.5">
                                <div>
                                  <span className="text-xs font-medium text-gray-600">{item.date}</span>
                                  <span className={`ml-2 text-xs ${item.isSpecialDay ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                                    {item.team}
                                  </span>
                                  {item.isSpecialDay && (
                                    <div className="text-[10px] text-blue-500 mt-0.5">
                                      Todos participam
                                    </div>
                                  )}
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0" 
                                    onClick={() => handleEditItem(item)}
                                  >
                                    <Edit className="h-3.5 w-3.5 text-gray-500" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0" 
                                    onClick={() => handleDeleteItem(item.id)}
                                  >
                                    <Trash className="h-3.5 w-3.5 text-gray-500" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center mt-1.5 space-x-4">
                                <div className="flex items-center">
                                  <Checkbox 
                                    id={`pending-mobile-${item.id}`}
                                    checked={item.status === "pending"}
                                    className="rounded-sm data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 h-4 w-4 mr-1"
                                    onCheckedChange={() => handleStatusChange(item.id, "pending")}
                                  />
                                  <label htmlFor={`pending-mobile-${item.id}`} className="text-[10px] text-gray-500">Pendente</label>
                                </div>
                                <div className="flex items-center">
                                  <Checkbox 
                                    id={`completed-mobile-${item.id}`}
                                    checked={item.status === "completed"}
                                    className="rounded-sm data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 h-4 w-4 mr-1"
                                    onCheckedChange={() => handleStatusChange(item.id, "completed")}
                                  />
                                  <label htmlFor={`completed-mobile-${item.id}`} className="text-[10px] text-gray-500">Concluído</label>
                                </div>
                                <div className="flex items-center">
                                  <Checkbox 
                                    id={`missed-mobile-${item.id}`}
                                    checked={item.status === "missed"}
                                    className="rounded-sm data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500 h-4 w-4 mr-1"
                                    onCheckedChange={() => handleStatusChange(item.id, "missed")}
                                  />
                                  <label htmlFor={`missed-mobile-${item.id}`} className="text-[10px] text-gray-500">Não realizado</label>
                                </div>
                              </div>
                            </div>
                          ))}
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
              {viewSettings.observationsText.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-white border border-gray-100 rounded px-4 sm:px-5 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-2 md:mb-0">Configurações de Visualização</h2>
              <Button
                onClick={saveViewSettings}
                className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="px-4 sm:px-6 py-4">
                <CardTitle>Configurações da Página</CardTitle>
                <CardDescription>
                  Configure como a página de limpeza será exibida para os usuários
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="page-title">Título da Página</Label>
                    <Input 
                      id="page-title" 
                      value={viewSettings.pageTitle}
                      onChange={(e) => setViewSettings({...viewSettings, pageTitle: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="page-subtitle">Subtítulo da Página</Label>
                    <Input 
                      id="page-subtitle" 
                      value={viewSettings.pageSubtitle}
                      onChange={(e) => setViewSettings({...viewSettings, pageSubtitle: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="show-status-buttons"
                      checked={viewSettings.showStatusButtons}
                      onCheckedChange={(checked) => setViewSettings({...viewSettings, showStatusButtons: checked})}
                    />
                    <Label htmlFor="show-status-buttons" className="flex items-center text-sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Mostrar botões de status
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="allow-status-change"
                      checked={viewSettings.allowStatusChange}
                      onCheckedChange={(checked) => setViewSettings({...viewSettings, allowStatusChange: checked})}
                    />
                    <Label htmlFor="allow-status-change" className="flex items-center text-sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Permitir alteração de status
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="show-observations"
                      checked={viewSettings.showObservations}
                      onCheckedChange={(checked) => setViewSettings({...viewSettings, showObservations: checked})}
                    />
                    <Label htmlFor="show-observations" className="flex items-center text-sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Mostrar observações
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="px-4 sm:px-6 py-4">
                <CardTitle>Texto de Observações</CardTitle>
                <CardDescription>
                  Edite o texto que será exibido na seção de observações para os usuários
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 py-4">
                <Textarea 
                  rows={15}
                  value={viewSettings.observationsText}
                  onChange={(e) => setViewSettings({...viewSettings, observationsText: e.target.value})}
                  placeholder="Insira as instruções e observações para os usuários..."
                  className="font-mono text-xs"
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 bg-white border border-gray-100 rounded p-4 sm:p-5">
            <h3 className="text-base font-medium text-gray-900 mb-2">Visualização Prévia</h3>
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h2 className="text-base font-medium text-center">{viewSettings.pageTitle}</h2>
                  <p className="text-sm text-center text-gray-600 mt-1">{viewSettings.pageSubtitle}</p>
                  
                  <div className="mt-4 border border-gray-200 rounded bg-white overflow-hidden">
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                      <span className="text-sm font-medium">Janeiro</span>
                    </div>
                    <div className="p-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-1">
                        <div className="flex-1 mb-2 sm:mb-0">
                          <span className="text-xs">11/01 - Karina e Nicole</span>
                        </div>
                        {viewSettings.showStatusButtons && (
                          <div className="flex space-x-1">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-200">
                              <Clock className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center border border-green-300 bg-green-50">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-200">
                              <XCircle className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {viewSettings.showObservations && (
                    <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                      <h3 className="text-xs font-medium mb-1">OBSERVAÇÕES</h3>
                      <p className="text-xs text-gray-600">
                        {viewSettings.observationsText.split('\n\n')[0]}...
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dialog para adicionar/editar itens de limpeza */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full max-w-[95vw] sm:max-w-[425px] sm:w-full p-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-2">
            <DialogTitle>{editingItem?.id ? 'Editar Item' : 'Adicionar Novo Item'}</DialogTitle>
            <DialogDescription>
              {editingItem?.id 
                ? 'Modifique os detalhes do item de limpeza existente.' 
                : 'Preencha os detalhes para adicionar um novo item à lista de limpeza.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 px-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-date">Data</Label>
                <Input 
                  id="item-date" 
                  placeholder="DD/MM" 
                  value={editingItem?.date || ''} 
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, date: e.target.value} : null)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-month">Mês</Label>
                <Input 
                  id="item-month" 
                  placeholder="Janeiro, Fevereiro, etc" 
                  value={editingItem?.month || ''} 
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, month: e.target.value} : null)} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="item-team">Equipe</Label>
              <Input 
                id="item-team" 
                placeholder="Nomes dos responsáveis" 
                value={editingItem?.team || ''} 
                onChange={(e) => setEditingItem(prev => prev ? {...prev, team: e.target.value} : null)} 
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="item-special" 
                checked={editingItem?.isSpecialDay || false} 
                onCheckedChange={(checked) => 
                  setEditingItem(prev => prev ? {...prev, isSpecialDay: checked as boolean} : null)
                } 
              />
              <Label htmlFor="item-special">É um dia especial (Dia D, Obrigação, etc)</Label>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 px-4 pb-4 pt-2">
            <Button variant="outline" className="sm:w-auto w-full h-8 text-xs px-3" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button className="sm:w-auto w-full h-8 text-xs px-3 bg-black hover:bg-gray-900 text-white" onClick={handleSaveItem}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminLimpeza;
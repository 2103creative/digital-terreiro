import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash, 
  Search, 
  ShoppingCart,
  Save,
  Filter,
  Download,
  ArrowUpDown,
  CalendarClock,
  AlertTriangle,
  Bell,
  Users,
  Check
} from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

// Interface para os mantimentos
interface Mantimento {
  id: number;
  nome: string;
  quantidade: number;
  unidade: string;
  categoria: string;
  dataValidade?: string;
  dataCompra: string;
  estoqueMinimo: number;
}

// Formulário para editar item
interface MantimentoForm extends Omit<Mantimento, 'id'> {
  id?: number;
}

// Interface para os itens que serão comprados
interface ItemCompra extends Omit<Mantimento, 'observacoes'> {
  quantidade_comprar: number;
  usuario: string;
}

// Categorias disponíveis
const categorias = [
  "Alimentos",
  "Bebidas",
  "Limpeza",
  "Rituais",
  "Outros"
];

// Unidades de medida disponíveis
const unidades = [
  "kg", // quilograma
  "g", // grama
  "L", // litro
  "ml", // mililitro
  "un", // unidade
  "cx", // caixa
  "pct", // pacote
  "dz", // dúzia
  "m", // metro
  "cm", // centímetro
  "rolo", // rolo
  "par" // par
];

const AdminMantimentos = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mantimentos, setMantimentos] = useState<Mantimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todos");
  const [filtroEstoqueBaixo, setFiltroEstoqueBaixo] = useState(false);
  const [filtroApenasCompras, setFiltroApenasCompras] = useState(false);
  const [viewMode, setViewMode] = useState<"admin" | "compras">("admin");
  const [itemsParaComprar, setItemsParaComprar] = useState<ItemCompra[]>([]);
  const [quantidadeComprar, setQuantidadeComprar] = useState<Record<number, number>>({});
  const [itemsChecked, setItemsChecked] = useState<Record<number, boolean>>({});
  const [form, setForm] = useState<MantimentoForm>({
    nome: "",
    quantidade: 0,
    unidade: "un",
    categoria: "Alimentos",
    dataCompra: new Date().toISOString().split('T')[0],
    estoqueMinimo: 1,
  });
  
  // Função para buscar mantimentos (mock)
  function fetchMantimentosMock() {
    return Promise.resolve([
      {
        id: 1,
        nome: "Arroz",
        quantidade: 10,
        unidade: "kg",
        categoria: "Alimentos",
        dataValidade: "2025-12-31",
        dataCompra: "2025-01-01",
        estoqueMinimo: 2
      },
      {
        id: 2,
        nome: "Sabão em pó",
        quantidade: 5,
        unidade: "kg",
        categoria: "Limpeza",
        dataValidade: "2025-10-10",
        dataCompra: "2025-01-15",
        estoqueMinimo: 1
      }
    ]);
  }

  // Carregar dados
  useEffect(() => {
    fetchMantimentosMock()
      .then(setMantimentos)
      .catch(() => {
        toast({
          title: "Erro ao carregar mantimentos",
          description: "Não foi possível carregar os dados. Tente novamente mais tarde.",
          variant: "destructive",
        });
      });
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    // Verificar se há itens zerados e alertar
    const itensZerados = mantimentos.filter(item => item.quantidade === 0);
    if (itensZerados.length > 0 && !isLoading) {
      const itemNames = itensZerados.map(item => item.nome).join(", ");
      toast({
        title: `${itensZerados.length} item(s) com estoque zerado!`,
        description: `Os seguintes itens precisam ser comprados: ${itemNames}`,
        variant: "destructive",
      });
    }
  }, [mantimentos, isLoading, toast]);
  
  // Salvar lista de compras no localStorage quando mudar
  useEffect(() => {
    if (itemsParaComprar.length > 0) {
      localStorage.setItem('listaCompras', JSON.stringify(itemsParaComprar));
    } else {
      localStorage.removeItem('listaCompras');
    }
  }, [itemsParaComprar]);
  
  // Filtros
  const mantimentosFiltrados = mantimentos.filter(item => {
    // Pesquisa por texto
    const matchesSearch = 
      searchTerm === "" || 
      item.nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por categoria
    const matchesCategoria = 
      categoriaFiltro === "todos" || 
      item.categoria === categoriaFiltro;
    
    // Filtro por estoque baixo (apenas > 0 e <= estoqueMinimo)
    const matchesEstoqueBaixo = 
      !filtroEstoqueBaixo || 
      (item.quantidade > 0 && item.quantidade <= item.estoqueMinimo);
    
    // Filtro apenas para compras (itens zerados ou abaixo do estoque mínimo)
    const matchesCompras = 
      !filtroApenasCompras || 
      item.quantidade === 0 || 
      (item.quantidade > 0 && item.quantidade <= item.estoqueMinimo);
    
    return matchesSearch && matchesCategoria && matchesEstoqueBaixo && matchesCompras;
  });
  
  // Verificar se um mantimento está com estoque zerado
  const isEstoqueZerado = (mantimento: Mantimento) => {
    return mantimento.quantidade === 0;
  };
  
  // Verificar se um mantimento está com estoque baixo
  const isEstoqueBaixo = (mantimento: Mantimento) => {
    return mantimento.quantidade <= mantimento.estoqueMinimo && mantimento.quantidade > 0;
  };
  
  // Verificar se um mantimento está próximo da validade
  const isProximoValidade = (mantimento: Mantimento) => {
    if (!mantimento.dataValidade) return false;
    
    const hoje = new Date();
    const dataValidade = new Date(mantimento.dataValidade);
    const diffDias = Math.floor((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    return diffDias <= 30 && diffDias >= 0;
  };
  
  // Verificar se um mantimento está vencido
  const isVencido = (mantimento: Mantimento) => {
    if (!mantimento.dataValidade) return false;
    
    const hoje = new Date();
    const dataValidade = new Date(mantimento.dataValidade);
    
    return dataValidade < hoje;
  };
  
  // Adicionar/Editar Mantimento
  const handleSaveItem = () => {
    if (!form.nome || form.quantidade < 0 || !form.unidade || !form.categoria) {
      toast({
        title: "Erro ao salvar",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    if (form.quantidade < 0) {
      toast({
        title: "Quantidade inválida",
        description: "A quantidade não pode ser negativa.",
        variant: "destructive",
      });
      return;
    }
    if (form.estoqueMinimo < 0) {
      toast({
        title: "Estoque mínimo inválido",
        description: "O estoque mínimo não pode ser negativo.",
        variant: "destructive",
      });
      return;
    }
    if (form.dataCompra && new Date(form.dataCompra) > new Date()) {
      toast({
        title: "Data de compra inválida",
        description: "A data de compra não pode ser futura.",
        variant: "destructive",
      });
      return;
    }
    if (form.id) {
      // Editar item existente
      setMantimentos(mantimentos.map(item => 
        item.id === form.id ? { ...form, id: form.id, dataValidade: form.dataValidade || undefined } as Mantimento : item
      ));
      toast({
        title: "Mantimento atualizado",
        description: `${form.nome} foi atualizado com sucesso.`
      });
    } else {
      // Adicionar novo item
      const newId = Math.max(0, ...mantimentos.map(item => item.id)) + 1;
      setMantimentos([...mantimentos, { ...form, id: newId, dataValidade: form.dataValidade || undefined } as Mantimento]);
      toast({
        title: "Mantimento adicionado",
        description: `${form.nome} foi adicionado com sucesso.`
      });
    }
    resetForm();
    setFormOpen(false);
  };
  
  // Editar um item
  const handleEditItem = (item: Mantimento) => {
    setForm({
      id: item.id,
      nome: item.nome,
      quantidade: item.quantidade,
      unidade: item.unidade,
      categoria: item.categoria,
      dataValidade: item.dataValidade,
      dataCompra: item.dataCompra,
      estoqueMinimo: item.estoqueMinimo,
    });
    
    setFormOpen(true);
  };
  
  // Remover um item
  const handleDeleteItem = (id: number) => {
    if (confirm("Tem certeza que deseja remover este item?")) {
      setMantimentos(mantimentos.filter(item => item.id !== id));
      
      toast({
        title: "Mantimento removido",
        description: "Item removido com sucesso."
      });
    }
  };
  
  // Resetar formulário
  const resetForm = () => {
    setForm({
      nome: "",
      quantidade: 0,
      unidade: "un",
      categoria: "Alimentos",
      dataCompra: new Date().toISOString().split('T')[0],
      estoqueMinimo: 1,
    });
  };
  
  // Abrir formulário para novo item
  const handleAddItem = () => {
    resetForm();
    setFormOpen(true);
  };

  // Exportar lista em CSV
  const handleExportCSV = () => {
    // Cabeçalho do CSV
    let csvContent = "ID,Nome,Quantidade,Unidade,Categoria,Data Validade,Data Compra,Estoque Mínimo\n";
    
    // Dados
    mantimentos.forEach(item => {
      const row = [
        item.id,
        item.nome,
        item.quantidade,
        item.unidade,
        item.categoria,
        item.dataValidade || "",
        item.dataCompra,
        item.estoqueMinimo,
      ].join(",");
      
      csvContent += row + "\n";
    });
    
    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mantimentos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Dados para a visualização de compras
  const itensFaltantes = mantimentos.filter(item => item.quantidade === 0);
  const itensBaixos = mantimentos.filter(item => item.quantidade > 0 && item.quantidade <= item.estoqueMinimo);
  
  // Gerar lista de compras em formato CSV
  const handleExportListaCompras = () => {
    // Filtrar apenas itens que precisam ser comprados
    const itensParaComprar = mantimentos.filter(item => 
      item.quantidade === 0 || item.quantidade <= item.estoqueMinimo
    );
    
    if (itensParaComprar.length === 0) {
      toast({
        title: "Sem itens para comprar",
        description: "Não há itens que precisem ser comprados no momento.",
      });
      return;
    }
    
    // Cabeçalho do CSV
    let csvContent = "Nome,Quantidade Necessária,Unidade,Categoria\n";
    
    // Dados
    itensParaComprar.forEach(item => {
      const quantidadeNecessaria = item.quantidade === 0 
        ? item.estoqueMinimo 
        : (item.estoqueMinimo - item.quantidade);
        
      const row = [
        item.nome,
        quantidadeNecessaria,
        item.unidade,
        item.categoria,
      ].join(",");
      
      csvContent += row + "\n";
    });
    
    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `lista_compras_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Lista de compras exportada",
      description: `${itensParaComprar.length} itens incluídos na lista.`
    });
  };
  
  // Adicionar item à lista de compras do usuário
  const adicionarItemCompra = (item: Mantimento) => {
    if (!user?.name) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para adicionar itens à sua lista de compras.",
        variant: "destructive",
      });
      return;
    }
    const maxQtd = item.quantidade === 0 ? item.estoqueMinimo : (item.estoqueMinimo - item.quantidade);
    if (!quantidadeComprar[item.id] || quantidadeComprar[item.id] < 1 || quantidadeComprar[item.id] > maxQtd) {
      toast({
        title: "Erro",
        description: `Selecione uma quantidade válida (1 até ${maxQtd}).`,
        variant: "destructive",
      });
      return;
    }
    const novoItemCompra: ItemCompra = {
      ...item,
      quantidade_comprar: quantidadeComprar[item.id],
      usuario: user.name
    };
    setItemsParaComprar([...itemsParaComprar, novoItemCompra]);
    // Remover da lista de mantimentos que precisam ser comprados
    setMantimentos(mantimentos.map(m => 
      m.id === item.id 
        ? {...m, quantidade: m.quantidade + quantidadeComprar[item.id]} 
        : m
    ));
    // Limpar quantidade selecionada
    setQuantidadeComprar(prev => {
      const newState = {...prev};
      delete newState[item.id];
      return newState;
    });
    toast({
      title: "Item adicionado à sua lista de compras",
      description: `Você se comprometeu a comprar ${quantidadeComprar[item.id]} ${item.unidade} de ${item.nome}`,
    });
  };
  
  // Remover item da lista de compras do usuário
  const removerItemCompra = (id: number) => {
    const item = itemsParaComprar.find(i => i.id === id);
    if (!item) return;
    
    setItemsParaComprar(itemsParaComprar.filter(i => i.id !== id));
    
    // Devolver para a lista geral de mantimentos
    setMantimentos(mantimentos.map(m => 
      m.id === id 
        ? {...m, quantidade: m.quantidade - item.quantidade_comprar} 
        : m
    ));
    
    toast({
      title: "Item removido da sua lista de compras",
      description: `${item.nome} foi removido da sua lista.`,
    });
  };
  
  // Atualizar quantidade a ser comprada
  const handleQuantidadeChange = (id: number, valor: number) => {
    if (isNaN(valor) || valor < 1) return;
    setQuantidadeComprar({
      ...quantidadeComprar,
      [id]: valor
    });
  };
  
  // Alternar o estado de item checado/não checado
  const toggleItemChecked = (id: number) => {
    setItemsChecked(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Marcar item como comprado
  const marcarComoComprado = (itemId: number) => {
    const item = itemsParaComprar.find(i => i.id === itemId && i.usuario === user?.name);
    if (!item) return;
    
    // Atualizar data de compra para hoje
    const dataCompraAtual = new Date().toISOString().split('T')[0];
    
    // Atualizar o item no estoque principal
    setMantimentos(mantimentos.map(m => 
      m.id === itemId 
        ? { 
            ...m, 
            quantidade: m.quantidade, // A quantidade já foi atualizada quando o usuário adicionou à lista
            dataCompra: dataCompraAtual
          } 
        : m
    ));
    
    // Remover da lista de compras
    setItemsParaComprar(itemsParaComprar.filter(i => !(i.id === itemId && i.usuario === user?.name)));
    
    toast({
      title: "Item marcado como comprado",
      description: `${item.nome} foi adicionado ao estoque.`,
    });
  };
  
  return (
    <AdminLayout pageTitle="Compras" pageDescription="Gerencie o estoque e as compras do terreiro.">
      <div className="space-y-4">
        <div className="mb-2">
          <div className="mt-2">
            <Button className="h-8 text-xs px-3 bg-black hover:bg-gray-900 text-white flex items-center gap-1" onClick={handleAddItem}>
              <span className="text-lg leading-none">+</span> Adicionar
            </Button>
          </div>
        </div>

        {/* Tabs para alternar entre visualizações */}
        <div className="bg-white p-1 border rounded-lg">
          <Tabs defaultValue="admin" onValueChange={(value) => setViewMode(value as "admin" | "compras")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin">Visão Administrativa</TabsTrigger>
              <TabsTrigger value="compras">
                Lista de Compras 
                {(itensFaltantes.length + itensBaixos.length) > 0 && (
                  <span className="ml-2 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {itensFaltantes.length + itensBaixos.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="admin" className="mt-0 pt-4">
              {/* Filtros e Ações */}
              <div className="flex flex-col md:flex-row gap-3 bg-white p-4 border rounded-lg mb-4">
                <div className="flex-1 flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar mantimentos..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                    <SelectTrigger className="w-full md:w-44">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas Categorias</SelectItem>
                      {categorias.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="estoqueMinimo"
                      checked={filtroEstoqueBaixo}
                      onChange={() => setFiltroEstoqueBaixo(!filtroEstoqueBaixo)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="estoqueMinimo" className="text-sm">
                      Apenas estoque baixo
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-2 md:justify-end">
                  <Button variant="outline" size="sm" onClick={handleExportCSV}>
                    <Download className="h-4 w-4 mr-1" />
                    Exportar
                  </Button>
                </div>
              </div>
              
              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mantimentos.length}</div>
                    <p className="text-xs text-gray-500">Itens em estoque</p>
                  </CardContent>
                </Card>
                
                <Card className={itensFaltantes.length > 0 ? "border-red-200 bg-red-50" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      Estoque Zerado
                      {itensFaltantes.length > 0 && (
                        <AlertTriangle className="h-4 w-4 ml-2 text-red-600" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {itensFaltantes.length}
                    </div>
                    <p className="text-xs text-gray-500">Itens que precisam ser comprados</p>
                  </CardContent>
                </Card>
                
                <Card className={itensBaixos.length > 0 ? "border-amber-200 bg-amber-50" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-600">
                      {itensBaixos.length}
                    </div>
                    <p className="text-xs text-gray-500">Itens abaixo do estoque mínimo</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Listagem de Mantimentos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lista de Mantimentos</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center p-6">
                      <p>Carregando...</p>
                    </div>
                  ) : mantimentosFiltrados.length === 0 ? (
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Nenhum mantimento encontrado com os filtros atuais.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="py-2 px-3 text-left">Nome</th>
                            <th className="py-2 px-3 text-left">Quantidade</th>
                            <th className="py-2 px-3 text-left">Categoria</th>
                            <th className="py-2 px-3 text-left">Validade</th>
                            <th className="py-2 px-3 text-left">Status</th>
                            <th className="py-2 px-3 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mantimentosFiltrados.map((item) => (
                            <tr key={item.id} className={`border-b hover:bg-gray-50 ${isEstoqueZerado(item) ? 'bg-red-50' : ''}`}>
                              <td className="py-2 px-3 font-medium">{item.nome}</td>
                              <td className="py-2 px-3">
                                {item.quantidade} {item.unidade}
                                {isEstoqueZerado(item) ? (
                                  <Badge variant="destructive" className="ml-2">
                                    Zerado
                                  </Badge>
                                ) : isEstoqueBaixo(item) ? (
                                  <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                                    Baixo
                                  </Badge>
                                ) : null}
                              </td>
                              <td className="py-2 px-3">{item.categoria}</td>
                              <td className="py-2 px-3">
                                {item.dataValidade ? new Date(item.dataValidade).toLocaleDateString('pt-BR') : '-'}
                              </td>
                              <td className="py-2 px-3">
                                {isVencido(item) ? (
                                  <Badge variant="destructive">Vencido</Badge>
                                ) : isProximoValidade(item) ? (
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                    Vence em breve
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Em dia
                                  </Badge>
                                )}
                              </td>
                              <td className="py-2 px-3 text-right">
                                <div className="flex justify-end space-x-2">
                                  <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)}>
                                    <Edit className="h-4 w-4 text-gray-500" />
                                  </Button>
                                  <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                                    <Trash className="h-4 w-4 text-gray-500" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="compras" className="mt-0 pt-4">
              {/* Filtros para a lista de compras */}
              <div className="flex flex-col md:flex-row gap-3 bg-white p-4 border rounded-lg mb-4">
                <div className="flex-1 flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Buscar itens para comprar..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                    <SelectTrigger className="w-full md:w-44">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas Categorias</SelectItem>
                      {categorias.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 md:justify-end">
                  <Button variant="outline" size="sm" onClick={handleExportListaCompras}>
                    <Download className="h-4 w-4 mr-1" />
                    Exportar Lista
                  </Button>
                </div>
              </div>

              {/* Mensagem informativa sobre os checkboxes */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
                <p>Selecione a quantidade de cada item que você está disposto a comprar e clique em "Comprar" para adicioná-lo à sua lista.</p>
              </div>
              
              {/* Lista de itens comprometidos para compra */}
              {itemsParaComprar.length > 0 && (
                <Card className="mb-4 border-green-200">
                  <CardHeader className="pb-3 bg-green-50 border-b border-green-100">
                    <CardTitle className="text-base flex items-center">
                      <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
                      Seus Itens para Comprar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="py-2 px-3 text-left">Nome</th>
                            <th className="py-2 px-3 text-left">Categoria</th>
                            <th className="py-2 px-3 text-left">Quantidade</th>
                            <th className="py-2 px-3 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemsParaComprar
                            .filter(item => item.usuario === user?.name)
                            .map((item) => (
                              <tr key={`compra-${item.id}`} className="border-b hover:bg-gray-50 bg-green-50">
                                <td className="py-2 px-3 font-medium">{item.nome}</td>
                                <td className="py-2 px-3">{item.categoria}</td>
                                <td className="py-2 px-3 font-medium text-green-600">
                                  {item.quantidade_comprar} {item.unidade}
                                </td>
                                <td className="py-2 px-3 text-right">
                                  <div className="flex justify-end space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => marcarComoComprado(item.id)}
                                      className="text-green-500 hover:text-green-700"
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Comprado
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => removerItemCompra(item.id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash className="h-4 w-4 mr-1" />
                                      Remover
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Lista de itens que outros membros irão comprar */}
              {itemsParaComprar.filter(item => item.usuario !== user?.name).length > 0 && (
                <Card className="mb-4 border-blue-200">
                  <CardHeader className="pb-3 bg-blue-50 border-b border-blue-100">
                    <CardTitle className="text-base flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      Itens que Outros Membros Irão Comprar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="py-2 px-3 text-left">Nome</th>
                            <th className="py-2 px-3 text-left">Categoria</th>
                            <th className="py-2 px-3 text-left">Quantidade</th>
                            <th className="py-2 px-3 text-left">Membro</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemsParaComprar
                            .filter(item => item.usuario !== user?.name)
                            .map((item) => (
                              <tr key={`compra-outros-${item.id}`} className="border-b hover:bg-gray-50 bg-blue-50">
                                <td className="py-2 px-3 font-medium">{item.nome}</td>
                                <td className="py-2 px-3">{item.categoria}</td>
                                <td className="py-2 px-3 font-medium text-blue-600">
                                  {item.quantidade_comprar} {item.unidade}
                                </td>
                                <td className="py-2 px-3 font-medium text-gray-800">
                                  {item.usuario}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Lista de itens que precisam ser comprados */}
              <Card>
                <CardHeader className="pb-3 bg-red-50 border-b border-red-100">
                  <CardTitle className="text-base flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                    Itens Zerados (Urgente)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex justify-center p-6">
                      <p>Carregando...</p>
                    </div>
                  ) : itensFaltantes.length === 0 ? (
                    <div className="text-center p-6">
                      <p className="text-gray-500">Não há itens com estoque zerado no momento.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="py-2 px-3 text-left">Nome</th>
                            <th className="py-2 px-3 text-left">Categoria</th>
                            <th className="py-2 px-3 text-left">Qtd. Necessária</th>
                            <th className="py-2 px-3 text-left">Qtd. a Comprar</th>
                            <th className="py-2 px-3 text-left">Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itensFaltantes
                            .filter(item => 
                              searchTerm === "" || 
                              item.nome.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .filter(item =>
                              categoriaFiltro === "todos" || 
                              item.categoria === categoriaFiltro
                            )
                            .map((item) => (
                              <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-3 font-medium">{item.nome}</td>
                                <td className="py-2 px-3">{item.categoria}</td>
                                <td className="py-2 px-3 font-medium text-red-600">
                                  {item.estoqueMinimo} {item.unidade}
                                </td>
                                <td className="py-2 px-3">
                                  <Input 
                                    type="number"
                                    min="1"
                                    max={item.estoqueMinimo}
                                    value={quantidadeComprar[item.id] || ""}
                                    onChange={(e) => handleQuantidadeChange(item.id, parseInt(e.target.value))}
                                    className="w-20 h-8 px-2"
                                    placeholder="Qtd"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => adicionarItemCompra(item)}
                                    disabled={!quantidadeComprar[item.id] || quantidadeComprar[item.id] < 1 || quantidadeComprar[item.id] > item.estoqueMinimo}
                                  >
                                    <ShoppingCart className="h-4 w-4 mr-1" />
                                    Comprar
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Lista de itens com estoque baixo */}
              <Card>
                <CardHeader className="pb-3 bg-amber-50 border-b border-amber-100">
                  <CardTitle className="text-base flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-amber-600" />
                    Estoque Baixo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex justify-center p-6">
                      <p>Carregando...</p>
                    </div>
                  ) : itensBaixos.length === 0 ? (
                    <div className="text-center p-6">
                      <p className="text-gray-500">Não há itens com estoque baixo no momento.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="py-2 px-3 text-left">Nome</th>
                            <th className="py-2 px-3 text-left">Categoria</th>
                            <th className="py-2 px-3 text-left">Estoque Atual</th>
                            <th className="py-2 px-3 text-left">Qtd. a Comprar</th>
                            <th className="py-2 px-3 text-left">Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itensBaixos
                            .filter(item => 
                              searchTerm === "" || 
                              item.nome.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .filter(item =>
                              categoriaFiltro === "todos" || 
                              item.categoria === categoriaFiltro
                            )
                            .map((item) => (
                              <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-3 font-medium">{item.nome}</td>
                                <td className="py-2 px-3">{item.categoria}</td>
                                <td className="py-2 px-3">
                                  {item.quantidade} {item.unidade}
                                </td>
                                <td className="py-2 px-3">
                                  <Input 
                                    type="number"
                                    min="1"
                                    max={item.estoqueMinimo - item.quantidade}
                                    value={quantidadeComprar[item.id] || ""}
                                    onChange={(e) => handleQuantidadeChange(item.id, parseInt(e.target.value))}
                                    className="w-20 h-8 px-2"
                                    placeholder="Qtd"
                                  />
                                </td>
                                <td className="py-2 px-3">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => adicionarItemCompra(item)}
                                    disabled={!quantidadeComprar[item.id] || quantidadeComprar[item.id] < 1 || quantidadeComprar[item.id] > (item.estoqueMinimo - item.quantidade)}
                                  >
                                    <ShoppingCart className="h-4 w-4 mr-1" />
                                    Comprar
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Modal para adicionar/editar mantimento */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {form.id ? "Editar Mantimento" : "Adicionar Novo Mantimento"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome do Item *</Label>
              <Input
                id="nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Arroz, Feijão, Velas..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.quantidade}
                  onChange={(e) => setForm({ ...form, quantidade: parseFloat(e.target.value) })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="unidade">Unidade *</Label>
                <Select 
                  value={form.unidade} 
                  onValueChange={(value) => setForm({ ...form, unidade: value })}
                >
                  <SelectTrigger id="unidade">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {unidades.map(un => (
                      <SelectItem key={un} value={un}>{un}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="categoria">Categoria *</Label>
                <Select 
                  value={form.categoria} 
                  onValueChange={(value) => setForm({ ...form, categoria: value })}
                >
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="estoqueMinimo">Estoque Mínimo *</Label>
                <Input
                  id="estoqueMinimo"
                  type="number"
                  min="0"
                  value={form.estoqueMinimo}
                  onChange={(e) => setForm({ ...form, estoqueMinimo: parseInt(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dataCompra">Data da Compra *</Label>
                <Input
                  id="dataCompra"
                  type="date"
                  value={form.dataCompra}
                  onChange={(e) => setForm({ ...form, dataCompra: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="dataValidade">Data de Validade</Label>
                <Input
                  id="dataValidade"
                  type="date"
                  value={form.dataValidade || ""}
                  onChange={(e) => setForm({ ...form, dataValidade: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="h-8 text-xs px-3" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button className="h-8 text-xs px-3 bg-black hover:bg-gray-900 text-white flex items-center gap-1" onClick={handleSaveItem}>
              <span className="text-lg leading-none">+</span> Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMantimentos;
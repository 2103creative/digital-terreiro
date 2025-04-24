import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  ShoppingCart,
  Download,
  AlertTriangle,
  Bell,
  Users,
  Check,
  Trash
} from "lucide-react";

import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  observacoes?: string;
}

// Interface para os itens que serão comprados
interface ItemCompra extends Mantimento {
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

const ListaCompras = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mantimentos, setMantimentos] = useState<Mantimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todos");
  const [itemsParaComprar, setItemsParaComprar] = useState<ItemCompra[]>([]);
  const [quantidadeComprar, setQuantidadeComprar] = useState<Record<number, number>>({});
  
  // Verificar autenticação
  useEffect(() => {
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
  
  // Carregar dados
  useEffect(() => {
    loadMantimentos();
    
    // Carregar lista de compras do localStorage
    const savedItems = localStorage.getItem('listaCompras');
    if (savedItems && user?.name) {
      try {
        const parsedItems = JSON.parse(savedItems);
        // Filtrar para mostrar apenas os itens do usuário atual
        const userItems = parsedItems.filter((item: ItemCompra) => item.usuario === user.name);
        if (userItems.length > 0) {
          setItemsParaComprar(userItems);
          toast({
            title: "Lista de compras carregada",
            description: `${userItems.length} item(s) na sua lista de compras.`
          });
        }
      } catch (error) {
        console.error("Erro ao carregar lista de compras:", error);
      }
    }
  }, [user]);
  
  // Salvar lista de compras no localStorage quando mudar
  useEffect(() => {
    if (itemsParaComprar.length > 0) {
      localStorage.setItem('listaCompras', JSON.stringify(itemsParaComprar));
    } else {
      localStorage.removeItem('listaCompras');
    }
  }, [itemsParaComprar]);
  
  const loadMantimentos = () => {
    setIsLoading(true);
    
    // Em um app real, isso seria uma requisição para uma API
    setTimeout(() => {
      const dadosExemplo: Mantimento[] = [
        {
          id: 1,
          nome: "Arroz",
          quantidade: 5,
          unidade: "kg",
          categoria: "Alimentos",
          dataValidade: "2024-12-31",
          dataCompra: "2023-06-15",
          estoqueMinimo: 2,
          observacoes: "Marca Tio João"
        },
        {
          id: 2,
          nome: "Feijão Preto",
          quantidade: 0,
          unidade: "kg",
          categoria: "Alimentos",
          dataValidade: "2024-10-20",
          dataCompra: "2023-06-15",
          estoqueMinimo: 2
        },
        {
          id: 3,
          nome: "Velas Brancas",
          quantidade: 20,
          unidade: "un",
          categoria: "Rituais",
          dataCompra: "2023-07-01",
          estoqueMinimo: 10
        },
        {
          id: 4,
          nome: "Água Sanitária",
          quantidade: 0,
          unidade: "L",
          categoria: "Limpeza",
          dataValidade: "2024-05-20",
          dataCompra: "2023-05-20",
          estoqueMinimo: 1
        },
        {
          id: 5,
          nome: "Refrigerante",
          quantidade: 1,
          unidade: "L",
          categoria: "Bebidas",
          dataValidade: "2023-11-15",
          dataCompra: "2023-09-01",
          estoqueMinimo: 2,
          observacoes: "Guaraná"
        }
      ];
      
      setMantimentos(dadosExemplo);
      setIsLoading(false);
    }, 1000);
  };
  
  // Dados para a visualização de compras
  const itensFaltantes = mantimentos.filter(item => item.quantidade === 0);
  const itensBaixos = mantimentos.filter(item => item.quantidade > 0 && item.quantidade <= item.estoqueMinimo);
  
  // Gerar lista de compras em formato CSV
  const handleExportListaCompras = () => {
    // Apenas os itens do usuário
    const userItems = itemsParaComprar.filter(item => item.usuario === user?.name);
    
    if (userItems.length === 0) {
      toast({
        title: "Sem itens na sua lista",
        description: "Você não tem itens na sua lista de compras.",
      });
      return;
    }
    
    // Cabeçalho do CSV
    let csvContent = "Nome,Quantidade,Unidade,Categoria,Observações\n";
    
    // Dados
    userItems.forEach(item => {
      const row = [
        item.nome,
        item.quantidade_comprar,
        item.unidade,
        item.categoria,
        item.observacoes || ""
      ].join(",");
      
      csvContent += row + "\n";
    });
    
    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `minha_lista_compras_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Lista de compras exportada",
      description: `${userItems.length} itens incluídos na lista.`
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
    
    if (!quantidadeComprar[item.id]) {
      toast({
        title: "Erro",
        description: "Selecione a quantidade que deseja comprar.",
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
    setQuantidadeComprar({
      ...quantidadeComprar,
      [id]: valor
    });
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
    <AdminLayout 
      pageTitle="Minha Lista de Compras" 
      pageDescription="Selecione itens para comprar e ajude a manter nosso estoque"
    >
      <div className="space-y-4">
        <div className="bg-white p-3 md:p-4 border rounded-lg mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-primary h-5 w-5" />
            <h2 className="text-base md:text-lg font-semibold">Gerencie sua lista de compras</h2>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportListaCompras} className="h-7 px-2 text-xs">
            <Download className="h-4 w-4 mr-1" />
            Exportar Minha Lista
          </Button>
        </div>

        {/* Itens do usuário */}
        {itemsParaComprar.filter(item => item.usuario === user?.name).length > 0 && (
          <Card className="mb-3 border-green-200 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/admin/mantimentos')}>
            <CardHeader className="py-2 px-3 bg-green-50 border-b border-green-100">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-green-600" />
                Meus Itens para Comprar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-1 px-2 text-left font-medium">Nome</th>
                      <th className="py-1 px-2 text-left font-medium">Categoria</th>
                      <th className="py-1 px-2 text-left font-medium">Qtd.</th>
                      <th className="py-1 px-2 text-left font-medium">Obs.</th>
                      <th className="py-1 px-2 text-right font-medium">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsParaComprar
                      .filter(item => item.usuario === user?.name)
                      .map((item) => (
                        <tr key={`compra-${item.id}`} className="border-b hover:bg-gray-50 bg-green-50">
                          <td className="py-1 px-2 font-medium">{item.nome}</td>
                          <td className="py-1 px-2">{item.categoria}</td>
                          <td className="py-1 px-2 font-medium text-green-600">{item.quantidade_comprar} {item.unidade}</td>
                          <td className="py-1 px-2 text-gray-600">{item.observacoes || "-"}</td>
                          <td className="py-1 px-2 text-right">
                            <div className="flex justify-end gap-1">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={e => { e.stopPropagation(); marcarComoComprado(item.id); }}
                                className="h-7 px-2 text-xs text-green-500 hover:text-green-700"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Comprado
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={e => { e.stopPropagation(); removerItemCompra(item.id); }}
                                className="h-7 px-2 text-xs text-red-500 hover:text-red-700"
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

        {/* Itens de outros membros */}
        {itemsParaComprar.filter(item => item.usuario !== user?.name).length > 0 && (
          <Card className="mb-3 border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/admin/mantimentos')}>
            <CardHeader className="py-2 px-3 bg-blue-50 border-b border-blue-100">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Itens que Outros Membros Irão Comprar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-1 px-2 text-left font-medium">Nome</th>
                      <th className="py-1 px-2 text-left font-medium">Categoria</th>
                      <th className="py-1 px-2 text-left font-medium">Qtd.</th>
                      <th className="py-1 px-2 text-left font-medium">Membro</th>
                      <th className="py-1 px-2 text-left font-medium">Obs.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsParaComprar
                      .filter(item => item.usuario !== user?.name)
                      .map((item) => (
                        <tr key={`compra-outros-${item.id}`} className="border-b hover:bg-gray-50 bg-blue-50">
                          <td className="py-1 px-2 font-medium">{item.nome}</td>
                          <td className="py-1 px-2">{item.categoria}</td>
                          <td className="py-1 px-2 font-medium text-blue-600">{item.quantidade_comprar} {item.unidade}</td>
                          <td className="py-1 px-2">{item.usuario}</td>
                          <td className="py-1 px-2 text-gray-600">{item.observacoes || "-"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros e busca */}
        <div className="bg-white border rounded-lg p-3 md:p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
          <div className="flex flex-col md:flex-row gap-2 md:items-center flex-1">
            <Input
              placeholder="Buscar item..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-7 text-xs px-2 w-full md:w-56"
            />
            <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
              <SelectTrigger className="h-7 text-xs px-2 w-full md:w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos" className="text-xs">Todas</SelectItem>
                {categorias.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-xs">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabelas minimalistas dos mantimentos */}
        <div className="grid gap-2">
          {/* Lista de itens que precisam ser comprados */}
          <Card className={itensFaltantes.length > 0 ? "border-red-200 mb-3" : "mb-3"}>
            <CardHeader className="py-2 px-3 bg-red-50 border-b border-red-100">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
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
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-1 px-2 text-left font-medium">Nome</th>
                        <th className="py-1 px-2 text-left font-medium">Categoria</th>
                        <th className="py-1 px-2 text-left font-medium">Qtd. Necessária</th>
                        <th className="py-1 px-2 text-left font-medium">Qtd. a Comprar</th>
                        <th className="py-1 px-2 text-left font-medium">Obs.</th>
                        <th className="py-1 px-2 text-left font-medium">Ação</th>
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
                            <td className="py-1 px-2 font-medium">{item.nome}</td>
                            <td className="py-1 px-2">{item.categoria}</td>
                            <td className="py-1 px-2 font-medium text-red-600">{item.estoqueMinimo} {item.unidade}</td>
                            <td className="py-1 px-2">
                              <Input 
                                type="number"
                                min="1"
                                max={item.estoqueMinimo}
                                value={quantidadeComprar[item.id] || ""}
                                onChange={(e) => handleQuantidadeChange(item.id, parseInt(e.target.value))}
                                className="w-20 h-7 px-2"
                                placeholder="Qtd"
                              />
                            </td>
                            <td className="py-1 px-2 text-gray-600">{item.observacoes || "-"}</td>
                            <td className="py-1 px-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => adicionarItemCompra(item)}
                                disabled={!quantidadeComprar[item.id]}
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
            <CardHeader className="py-2 px-3 bg-amber-50 border-b border-amber-100">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-600" />
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
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-1 px-2 text-left font-medium">Nome</th>
                        <th className="py-1 px-2 text-left font-medium">Categoria</th>
                        <th className="py-1 px-2 text-left font-medium">Estoque Atual</th>
                        <th className="py-1 px-2 text-left font-medium">Qtd. a Comprar</th>
                        <th className="py-1 px-2 text-left font-medium">Obs.</th>
                        <th className="py-1 px-2 text-left font-medium">Ação</th>
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
                            <td className="py-1 px-2 font-medium">{item.nome}</td>
                            <td className="py-1 px-2">{item.categoria}</td>
                            <td className="py-1 px-2">{item.quantidade} {item.unidade}</td>
                            <td className="py-1 px-2">
                              <Input 
                                type="number"
                                min="1"
                                max={item.estoqueMinimo - item.quantidade}
                                value={quantidadeComprar[item.id] || ""}
                                onChange={(e) => handleQuantidadeChange(item.id, parseInt(e.target.value))}
                                className="w-20 h-7 px-2"
                                placeholder="Qtd"
                              />
                            </td>
                            <td className="py-1 px-2 text-gray-600">{item.observacoes || "-"}</td>
                            <td className="py-1 px-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => adicionarItemCompra(item)}
                                disabled={!quantidadeComprar[item.id]}
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default ListaCompras; 
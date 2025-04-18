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
        <div className="bg-white p-4 border rounded-lg mb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="text-primary h-6 w-6" />
              <h2 className="text-lg font-medium">Gerencie sua lista de compras</h2>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportListaCompras}>
                <Download className="h-4 w-4 mr-1" />
                Exportar Minha Lista
              </Button>
            </div>
          </div>
        </div>
      
        {/* Lista de itens comprometidos para compra */}
        {itemsParaComprar.filter(item => item.usuario === user?.name).length > 0 && (
          <Card className="mb-4 border-green-200">
            <CardHeader className="pb-3 bg-green-50 border-b border-green-100">
              <CardTitle className="text-base flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
                Meus Itens para Comprar
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
                      <th className="py-2 px-3 text-left">Observações</th>
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
                          <td className="py-2 px-3 text-gray-600">
                            {item.observacoes || "-"}
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
                      <th className="py-2 px-3 text-left">Observações</th>
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
                          <td className="py-2 px-3 text-gray-600">
                            {item.observacoes || "-"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
        
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
        </div>

        {/* Mensagem informativa sobre a funcionalidade */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
          <p>Selecione a quantidade de cada item que você está disposto a comprar e clique em "Comprar" para adicioná-lo à sua lista.</p>
        </div>
        
        {/* Lista de itens que precisam ser comprados */}
        <Card className={itensFaltantes.length > 0 ? "border-red-200 mb-4" : "mb-4"}>
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
                      <th className="py-2 px-3 text-left">Observações</th>
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
                          <td className="py-2 px-3 text-gray-600">
                            {item.observacoes || "-"}
                          </td>
                          <td className="py-2 px-3">
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
                      <th className="py-2 px-3 text-left">Observações</th>
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
                          <td className="py-2 px-3 text-gray-600">
                            {item.observacoes || "-"}
                          </td>
                          <td className="py-2 px-3">
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
    </AdminLayout>
  );
};

export default ListaCompras; 
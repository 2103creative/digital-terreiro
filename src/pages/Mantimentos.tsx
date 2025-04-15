import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Search, ShoppingCart, Download, AlertTriangle, Bell } from "lucide-react";

// Importação corrigida - não existe DashboardLayout no projeto
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "@/components/DashboardHeader";
import MobileNav from "@/components/MobileNav";
import DesktopSidebar from "@/components/DesktopSidebar";

// Interface para os mantimentos (igual ao AdminMantimentos)
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

// Categorias disponíveis (igual ao AdminMantimentos)
const categorias = [
  "Alimentos",
  "Bebidas",
  "Limpeza",
  "Rituais",
  "Outros"
];

const Mantimentos = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mantimentos, setMantimentos] = useState<Mantimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todos");
  
  // Carregar dados
  useEffect(() => {
    loadMantimentos();
  }, []);
  
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
      
      // Filtramos apenas itens que precisam ser comprados
      const itensFaltantes = dadosExemplo.filter(item =>
        item.quantidade === 0 || item.quantidade <= item.estoqueMinimo
      );
      
      setMantimentos(itensFaltantes);
      setIsLoading(false);
    }, 1000);
  };
  
  // Filtros para busca e categoria
  const mantimentosFiltrados = mantimentos.filter(item => {
    // Pesquisa por texto
    const matchesSearch = 
      searchTerm === "" || 
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.observacoes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por categoria
    const matchesCategoria = 
      categoriaFiltro === "todos" || 
      item.categoria === categoriaFiltro;
    
    return matchesSearch && matchesCategoria;
  });
  
  // Separar itens por urgência
  const itensZerados = mantimentosFiltrados.filter(item => item.quantidade === 0);
  const itensBaixos = mantimentosFiltrados.filter(item => item.quantidade > 0 && item.quantidade <= item.estoqueMinimo);
  
  // Verificar se um mantimento está com estoque zerado
  const isEstoqueZerado = (mantimento: Mantimento) => {
    return mantimento.quantidade === 0;
  };
  
  // Exportar lista de compras em CSV
  const handleExportListaCompras = () => {
    if (mantimentos.length === 0) {
      toast({
        title: "Sem itens para comprar",
        description: "Não há itens que precisem ser comprados no momento.",
      });
      return;
    }
    
    // Cabeçalho do CSV
    let csvContent = "Nome,Quantidade Necessária,Unidade,Categoria,Observações\n";
    
    // Dados
    mantimentos.forEach(item => {
      const quantidadeNecessaria = item.quantidade === 0 
        ? item.estoqueMinimo 
        : (item.estoqueMinimo - item.quantidade);
        
      const row = [
        item.nome,
        quantidadeNecessaria,
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
    link.setAttribute("download", `lista_compras_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Lista de compras exportada",
      description: `${mantimentos.length} itens incluídos na lista.`
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <DesktopSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="px-4 py-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <ShoppingCart className="mr-2 h-6 w-6 text-primary" />
                  Lista de Compras
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Aqui você pode visualizar todos os itens que precisam ser comprados para o terreiro
                </p>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 md:mt-0"
                onClick={handleExportListaCompras}
              >
                <Download className="h-4 w-4 mr-1" />
                Exportar Lista
              </Button>
            </div>
            
            {/* Resumo e Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="md:col-span-2">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Buscar item..."
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
                </CardContent>
              </Card>
              
              <Card className={itensZerados.length > 0 ? "border-red-200 bg-red-50" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    Itens Urgentes
                    {itensZerados.length > 0 && (
                      <AlertTriangle className="h-4 w-4 ml-2 text-red-600" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {itensZerados.length}
                  </div>
                  <p className="text-xs text-gray-500">Itens com estoque zerado</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Seção de Itens Urgentes (Zerados) */}
            {itensZerados.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  <h2 className="text-lg font-medium">Itens com Estoque Zerado (Urgente)</h2>
                </div>
                
                <Card className="border-red-100">
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="flex justify-center p-6">
                        <p>Carregando...</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-red-50 border-b border-red-100">
                              <th className="py-3 px-4 text-left">Nome</th>
                              <th className="py-3 px-4 text-left">Categoria</th>
                              <th className="py-3 px-4 text-left">Quantidade Necessária</th>
                              <th className="py-3 px-4 text-left">Observações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itensZerados.map((item) => (
                              <tr key={item.id} className="border-b hover:bg-red-50">
                                <td className="py-3 px-4 font-medium">{item.nome}</td>
                                <td className="py-3 px-4">{item.categoria}</td>
                                <td className="py-3 px-4 font-medium text-red-600">
                                  {item.estoqueMinimo} {item.unidade}
                                </td>
                                <td className="py-3 px-4 text-gray-600">
                                  {item.observacoes || "-"}
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
            )}
            
            {/* Seção de Itens com Estoque Baixo */}
            {itensBaixos.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <Bell className="h-5 w-5 mr-2 text-amber-600" />
                  <h2 className="text-lg font-medium">Itens com Estoque Baixo</h2>
                </div>
                
                <Card className="border-amber-100">
                  <CardContent className="p-0">
                    {isLoading ? (
                      <div className="flex justify-center p-6">
                        <p>Carregando...</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-amber-50 border-b border-amber-100">
                              <th className="py-3 px-4 text-left">Nome</th>
                              <th className="py-3 px-4 text-left">Categoria</th>
                              <th className="py-3 px-4 text-left">Estoque Atual</th>
                              <th className="py-3 px-4 text-left">Quantidade a Comprar</th>
                              <th className="py-3 px-4 text-left">Observações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itensBaixos.map((item) => (
                              <tr key={item.id} className="border-b hover:bg-amber-50">
                                <td className="py-3 px-4 font-medium">{item.nome}</td>
                                <td className="py-3 px-4">{item.categoria}</td>
                                <td className="py-3 px-4">
                                  {item.quantidade} {item.unidade}
                                  <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                                    Baixo
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 font-medium text-amber-600">
                                  {item.estoqueMinimo - item.quantidade} {item.unidade}
                                </td>
                                <td className="py-3 px-4 text-gray-600">
                                  {item.observacoes || "-"}
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
            )}
            
            {/* Sem itens para comprar */}
            {mantimentosFiltrados.length === 0 && (
              <Card className="mt-6">
                <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
                  {searchTerm || categoriaFiltro !== "todos" ? (
                    <p className="text-gray-500">Nenhum item encontrado com os filtros atuais.</p>
                  ) : (
                    <>
                      <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum item precisa ser comprado!</h3>
                      <p className="text-gray-500">O estoque está completo neste momento.</p>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Mantimentos; 
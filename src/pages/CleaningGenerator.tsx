  import { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { AlertCircle, Calendar, Trash, UserPlus, ArrowRight, Check, Save, Download, ChevronsUpDown } from 'lucide-react';
  import AdminLayout from '@/components/AdminLayout';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Badge } from '@/components/ui/badge';
  import { Checkbox } from '@/components/ui/checkbox';
  import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { getAllUsers } from '@/lib/authService';
  import { useToast } from '@/components/ui/use-toast';

  interface CleaningItem {
    id: string;
    date: string;
    month: string;
    names: string[];
    status: 'pending' | 'completed' | 'missed';
    isSpecialDay?: boolean;
    specialDayTitle?: string;
  }

  interface MemberInfo {
    name: string;
    participationCount: number;
  }

  const CleaningGenerator = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    
    // Estado para usuários e membros
    const [users, setUsers] = useState<any[]>([]);
    const [members, setMembers] = useState<string[]>([]);
    const [newMemberName, setNewMemberName] = useState('');
    
    // Estado para configurações
    const [year, setYear] = useState(new Date().getFullYear() + 1);
    const [specialDays, setSpecialDays] = useState<{date: string, title: string}[]>([]);
    const [newSpecialDate, setNewSpecialDate] = useState('');
    const [newSpecialTitle, setNewSpecialTitle] = useState('');
    
    // Estado para visualização
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
    
    // Estado para resultados
    const [generatedSchedule, setGeneratedSchedule] = useState<CleaningItem[]>([]);
    const [memberStats, setMemberStats] = useState<MemberInfo[]>([]);
    
    // Estado para carregamento
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Histórico para o algoritmo melhorado
    const [pairHistory, setPairHistory] = useState<Set<string>>(new Set());
    const [memberCleaningHistory, setMemberCleaningHistory] = useState<Record<string, number>>({});
    
    useEffect(() => {
      // Verificar se o usuário está autenticado e é admin
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      const isAdmin = localStorage.getItem("userRole") === "admin";
      
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      
      if (!isAdmin) {
        navigate("/dashboard");
        return;
      }
      
      // Carregar usuários existentes
      loadUsers();
      
      setIsLoading(false);
    }, [navigate]);
    
    // Carregar usuários do sistema
    const loadUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
        
        // Inicializar membros com os nomes dos usuários
        const initialMembers = allUsers.map(user => user.name);
        setMembers(initialMembers);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    };
    
    // Funções para gerenciar membros
    const addMember = () => {
      if (newMemberName.trim() && !members.includes(newMemberName.trim())) {
        setMembers([...members, newMemberName.trim()]);
        setNewMemberName('');
      }
    };
    
    const removeMember = (index: number) => {
      setMembers(members.filter((_, i) => i !== index));
    };
    
    // Funções para gerenciar dias especiais
    const addSpecialDay = () => {
      if (newSpecialDate && newSpecialTitle.trim()) {
        setSpecialDays([...specialDays, { 
          date: newSpecialDate, 
          title: newSpecialTitle.trim() 
        }]);
        setNewSpecialDate('');
        setNewSpecialTitle('');
      }
    };
    
    const removeSpecialDay = (index: number) => {
      setSpecialDays(specialDays.filter((_, i) => i !== index));
    };
    
    // Tradutor de meses para português
    const getMonthNamePtBr = (month: number): string => {
      const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      
      // Garantir que o índice do mês está dentro do intervalo válido
      if (month >= 0 && month < 12) {
        return months[month];
      }
      
      console.error(`Índice de mês inválido: ${month}`);
      return 'Mês desconhecido';
    };
    
    // Função de teste para verificar se todos os sábados estão sendo gerados corretamente
    const testSaturdayGeneration = (year: number) => {
      try {
        const saturdays = generateSaturdays(year);
        
        // Verificar a quantidade
        if (saturdays.length < 50 || saturdays.length > 53) {
          toast({
            title: "Erro na geração de sábados",
            description: `Esperado entre 50-53 sábados, mas encontrado: ${saturdays.length}`,
            variant: "destructive",
          });
          return;
        }
        
        // Verificar se todas as datas são sábados
        const invalidDates: string[] = [];
        for (const date of saturdays) {
          if (new Date(date).getDay() !== 6) {
            invalidDates.push(new Date(date).toLocaleDateString());
          }
        }
        
        if (invalidDates.length > 0) {
          toast({
            title: "Datas inválidas detectadas",
            description: `Encontradas ${invalidDates.length} datas que não são sábados`,
            variant: "destructive",
          });
          return;
        }
        
        // Verificar se não há lacunas (cada sábado deve estar a 7 dias do anterior)
        const gaps: string[] = [];
        for (let i = 1; i < saturdays.length; i++) {
          const diff = (new Date(saturdays[i]).getTime() - new Date(saturdays[i-1]).getTime()) / (1000 * 60 * 60 * 24);
          if (diff !== 7) {
            gaps.push(`Entre ${new Date(saturdays[i-1]).toLocaleDateString()} e ${new Date(saturdays[i]).toLocaleDateString()}: ${diff} dias`);
          }
        }
        
        if (gaps.length > 0) {
          toast({
            title: "Lacunas na sequência de sábados",
            description: `Encontradas ${gaps.length} lacunas na sequência`,
            variant: "destructive",
          });
          return;
        }
        
        // Se passou em todos os testes
        toast({
          title: "Teste de geração de sábados concluído",
          description: `Total de ${saturdays.length} sábados gerados corretamente para ${year}`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Erro ao testar geração de sábados",
          description: error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive",
        });
      }
    };

    // Gera todos os sábados do ano
    const generateSaturdays = (year: number): string[] => {
      const saturdays: string[] = [];
      
      // Começar com o primeiro dia do ano
      const startDate = new Date(year, 0, 1); 
      
      // Encontrar o primeiro sábado do ano
      // Em JavaScript: 0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta, 6=Sábado
      const firstDayOfWeek = startDate.getDay();
      const daysUntilSaturday = (firstDayOfWeek <= 6) ? (6 - firstDayOfWeek) : 0;
      
      // Definir a data do primeiro sábado
      const firstSaturday = new Date(year, 0, 1 + daysUntilSaturday);
      
      // Loop para gerar todos os sábados do ano
      let currentDate = new Date(firstSaturday);
      
      while (currentDate.getFullYear() === year) {
        // Formatar a data como YYYY-MM-DD
        const formattedDate = 
          `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        
        saturdays.push(formattedDate);
        
        // Avançar 7 dias para o próximo sábado
        currentDate.setDate(currentDate.getDate() + 7);
      }
      
      // Verificação de segurança - confirmar se todas são sábados
      for (let dateStr of saturdays) {
        const testDate = new Date(dateStr);
        if (testDate.getDay() !== 6) {
          console.error(`ERRO: Data ${dateStr} não é um sábado. Dia da semana: ${testDate.getDay()}`);
        }
      }
      
      return saturdays;
    };
    
    // Formatar data no formato desejado para exibição (DD/MM)
    const formatDisplayDate = (dateStr: string): string => {
      // Verificar se a data está no formato ISO (YYYY-MM-DD)
      if (dateStr && dateStr.includes('-') && dateStr.length >= 10) {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}`;
      }
      
      // Tentar criar um objeto Date válido e extrair dia/mês
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          return `${day}/${month}`;
        }
      } catch (e) {
        console.error("Erro ao formatar data:", dateStr, e);
      }
      
      // Fallback - retornar a data original ou placeholder
      return dateStr || 'Data inválida';
    };
    
    // Formatar data no formato YYYY-MM-DD para operações internas
    const formatISODate = (dateStr: string): string => {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    // Formatar data no formato DD/MM para exportação
    const formatShortDate = (dateStr: string): string => {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${day}/${month}`;
    };
    
    // Verifica se uma dupla foi formada recentemente (nos últimos N ciclos)
    const wasPairedRecently = (member1: string, member2: string, historyLimit: number = 5) => {
      const pairKey = [member1, member2].sort().join('|');
      return pairHistory.has(pairKey);
    };

    // Verifica se um membro participou de limpezas demais comparado com outros
    const hasCleanedTooMuch = (member: string, averageCleanings: number, threshold: number = 1.5) => {
      const memberCount = memberCleaningHistory[member] || 0;
      return memberCount > averageCleanings * threshold;
    };

    // Encontra o melhor par para um membro, considerando balanceamento e histórico
    const findBestPair = (member: string, availableMembers: string[], averageCleanings: number) => {
      // Filtrar membros que não foram pareados recentemente com este membro
      const possiblePairs = availableMembers.filter(m => 
        m !== member && !wasPairedRecently(member, m)
      );
      
      if (possiblePairs.length === 0) {
        // Se não houver opções sem histórico recente, usar qualquer disponível
        return availableMembers[0];
      }
      
      // Ordenar por quem participou menos de limpezas
      possiblePairs.sort((a, b) => {
        const countA = memberCleaningHistory[a] || 0;
        const countB = memberCleaningHistory[b] || 0;
        return countA - countB; // Prioriza quem limpou menos
      });
      
      return possiblePairs[0];
    };

    // Atualiza históricos de pares e limpezas
    const updateHistories = (pairs: string[][]) => {
      // Atualizar histórico de pares (mantém os últimos N pares por membro)
      const newPairHistory = new Set<string>();
      
      pairs.forEach(pair => {
        const pairKey = [...pair].sort().join('|');
        newPairHistory.add(pairKey);
        
        // Atualizar contagem de limpezas para cada membro
        pair.forEach(member => {
          memberCleaningHistory[member] = (memberCleaningHistory[member] || 0) + 1;
        });
      });
      
      setPairHistory(newPairHistory);
    };

    // Gera a agenda de limpeza
    const generateCleaningSchedule = () => {
      setIsGenerating(true);
      
      try {
        // Verificações iniciais
        if (members.length < 2) {
          alert("Adicione pelo menos duas pessoas para gerar a escala.");
          setIsGenerating(false);
          return;
        }
        
        // Obter todos os sábados do ano
        const saturdays = generateSaturdays(year);
        console.log(`Gerados ${saturdays.length} sábados para ${year}:`, saturdays);
        
        // Inicializar histórico de limpeza se for uma nova geração
        const cleaningCountInitial: Record<string, number> = {};
        members.forEach(member => {
          cleaningCountInitial[member] = 0;
        });
        setMemberCleaningHistory(cleaningCountInitial);

        // Criar agenda
        const schedule: CleaningItem[] = [];
        const memberParticipation: Record<string, number> = {};
        const assignedPairs: string[][] = [];
        
        // Inicializar contador de participação
        members.forEach(member => {
          memberParticipation[member] = 0;
        });
        
        // Para cada sábado, atribuir um par
        for (let i = 0; i < saturdays.length; i++) {
          const date = saturdays[i];
          
          // Validar formato da data
          if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            console.error(`Data inválida na posição ${i}:`, date);
            continue;
          }
          
          // Obter o nome do mês em português
          const dateParts = date.split('-');
          // Mês em JavaScript é 0-indexed (Janeiro = 0), mas no formato ISO é 1-indexed
          const monthIndex = parseInt(dateParts[1], 10) - 1;
          const monthName = getMonthNamePtBr(monthIndex);
          
          console.log(`Processando data ${date} - mês: ${monthName}`);
          
          // Verificar se é um dia especial
          const specialDay = specialDays.find(sd => sd.date === date);
          
          if (specialDay) {
            // Dia especial - todos participam
            schedule.push({
              id: `cleaning-${i}`,
              date,
              month: monthName,
              names: [...members], // Todos participam
              status: 'pending',
              isSpecialDay: true,
              specialDayTitle: specialDay.title
            });
            
            // Incrementar participação de todos
            members.forEach(member => {
              memberParticipation[member] += 1;
            });
          } else {
            // Calcular média atual de limpezas por membro
            const totalCleanings = Object.values(memberParticipation).reduce((sum, val) => sum + val, 0);
            const averageCleanings = totalCleanings / members.length || 0;
            
            // Criar uma cópia ordenada dos membros, priorizando quem participou menos
            const sortedMembers = [...members].sort((a, b) => 
              (memberParticipation[a] || 0) - (memberParticipation[b] || 0)
            );
            
            let currentPair: string[] = [];
            
            // Escolher o primeiro membro (quem participou menos)
            const firstMember = sortedMembers[0];
            currentPair.push(firstMember);
            
            // Encontrar o melhor par para o primeiro membro
            const remainingMembers = sortedMembers.filter(m => m !== firstMember);
            const secondMember = findBestPair(firstMember, remainingMembers, averageCleanings);
            currentPair.push(secondMember);
            
            // Adicionar o par à escala
            schedule.push({
              id: `cleaning-${i}`,
              date,
              month: monthName,
              names: currentPair,
              status: 'pending'
            });
            
            // Incrementar participação dos membros do par
            currentPair.forEach(member => {
              memberParticipation[member] = (memberParticipation[member] || 0) + 1;
            });
            
            // Adicionar ao histórico de pares
            assignedPairs.push(currentPair);
            
            // Atualizar histórico a cada 5 datas para manter um equilíbrio de memória
            if (i > 0 && i % 5 === 0) {
              updateHistories(assignedPairs.slice(-5));
            }
          }
        }
        
        // Atualizar histórico final
        updateHistories(assignedPairs);
        
        // Estatísticas de participação
        const stats = Object.entries(memberParticipation).map(([name, count]) => ({
          name,
          participationCount: count
        }));
        
        stats.sort((a, b) => b.participationCount - a.participationCount);
        
        setGeneratedSchedule(schedule);
        setMemberStats(stats);

        // Expandir o primeiro mês por padrão
        if (schedule.length > 0) {
          setExpandedMonth(schedule[0].month);
        }
      } catch (error) {
        console.error("Erro ao gerar escala:", error);
        alert("Ocorreu um erro ao gerar a escala. Tente novamente.");
      } finally {
        setIsGenerating(false);
      }
    };
    
    // Alternar a expansão de um mês no modo calendário
    const toggleMonthExpansion = (month: string) => {
      if (expandedMonth === month) {
        setExpandedMonth(null);
      } else {
        setExpandedMonth(month);
      }
    };
    
    // Obter todos os meses únicos da escala
    const getUniqueMonths = () => {
      if (!generatedSchedule.length) return [];
      
      // Agrupar por mês, priorizando meses válidos
      const monthsMap = generatedSchedule.reduce((acc, item) => {
        if (item.month && !acc.has(item.month)) {
          acc.set(item.month, true);
        }
        return acc;
      }, new Map<string, boolean>());
      
      // Converter para array e ordenar
      return Array.from(monthsMap.keys()).sort((a, b) => {
        const monthsOrder = {
          'Janeiro': 0, 'Fevereiro': 1, 'Março': 2, 'Abril': 3,
          'Maio': 4, 'Junho': 5, 'Julho': 6, 'Agosto': 7,
          'Setembro': 8, 'Outubro': 9, 'Novembro': 10, 'Dezembro': 11
        };
        return (monthsOrder[a] || 99) - (monthsOrder[b] || 99);
      });
    };
    
    // Renderizar os itens de um mês específico
    const renderMonthItems = (month: string) => {
      return generatedSchedule
        .filter(item => item.month === month)
        .map((item, index) => (
          <TableRow key={index} className={item.isSpecialDay ? "bg-amber-50" : ""}>
            <TableCell className="font-mono text-sm border-r border-gray-100 w-[80px]">
              {formatDisplayDate(item.date)}
            </TableCell>
            <TableCell className={`${item.isSpecialDay ? 'text-blue-700 font-medium' : ''}`}>
              {item.isSpecialDay ? (
                <div>
                  <div className="font-medium text-blue-700">{item.specialDayTitle}</div>
                  <div className="text-xs text-blue-600 mt-0.5">Todos participam</div>
                </div>
              ) : (
                item.names.join(' e ')
              )}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Checkbox 
                  checked={item.status === "pending"}
                  className="rounded-sm data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 h-4 w-4"
                />
                <Checkbox 
                  className="rounded-sm data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 h-4 w-4"
                />
                <Checkbox 
                  className="rounded-sm data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500 h-4 w-4"
                />
              </div>
            </TableCell>
          </TableRow>
        ));
    };
    
    // Renderizar o calendário mensal
    const renderCalendarView = () => {
      const uniqueMonths = getUniqueMonths();
      
      // Verificar se há meses sem itens
      const monthsWithItems = uniqueMonths.map(month => {
        const itemsInMonth = generatedSchedule.filter(item => item.month === month);
        return {
          month,
          itemCount: itemsInMonth.length
        };
      });
      
      console.log("Meses e quantidade de itens:", monthsWithItems);
      
      return (
        <div className="space-y-4">
          {uniqueMonths.map(month => (
            <Card key={month} className="overflow-hidden">
              <CardHeader 
                className={`py-2 px-4 cursor-pointer hover:bg-gray-50 ${expandedMonth === month ? 'bg-blue-50' : ''}`}
                onClick={() => toggleMonthExpansion(month)}
              >
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{month}</CardTitle>
                  <span className="text-sm text-gray-500 mr-2">
                    {generatedSchedule.filter(item => item.month === month).length} itens
                  </span>
                  <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                </div>
              </CardHeader>
              
              {expandedMonth === month && (
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableBody>
                        {renderMonthItems(month)}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      );
    };
    
    // Exportar para CSV
    const exportToCSV = () => {
      if (!generatedSchedule.length) return;
      
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Data,Pessoas,Status,Tipo\n";
      
      generatedSchedule.forEach(item => {
        const formattedDate = formatDisplayDate(item.date);
        const names = item.names.join(' & ');
        const status = item.status;
        const type = item.isSpecialDay ? `Dia D: ${item.specialDayTitle}` : "Normal";
        
        csvContent += `${formattedDate},${names},${status},${type}\n`;
      });
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `escala-limpeza-${year}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    // Enviar para a página de limpeza
    const sendToCleaningPage = () => {
      // Converter para o formato esperado pela página AdminLimpeza
      const formattedSchedule = generatedSchedule.map(item => {
        // Garantir que a data está no formato DD/MM
        const formattedDate = formatDisplayDate(item.date);
        
        console.log(`Formatando item para envio - data original: ${item.date}, formatada: ${formattedDate}`);
        
        return {
          ...item,
          date: formattedDate
        };
      });
      
      // Verificação final das datas
      const invalidDates = formattedSchedule.filter(item => 
        !item.date || item.date.includes('NaN') || item.date === 'Data inválida'
      );
      
      if (invalidDates.length > 0) {
        console.error(`Encontradas ${invalidDates.length} datas inválidas:`, invalidDates);
        toast({
          title: "Atenção",
          description: `Existem ${invalidDates.length} datas com formato inválido. Verifique o console.`,
          variant: "destructive",
        });
      }
      
      navigate('/admin/limpeza', { state: { generatedSchedule: formattedSchedule } });
    };
    
    if (isLoading) {
      return <AdminLayout pageTitle="Carregando..." pageDescription="Aguarde um momento...">
        <div className="flex items-center justify-center h-64">
          <p>Carregando...</p>
        </div>
      </AdminLayout>;
    }
    
    return (
      <AdminLayout 
        pageTitle="Gerador de Escala de Limpeza" 
        pageDescription="Crie escalas de limpeza automaticamente para todo o ano."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Configurações</CardTitle>
              <CardDescription>Defina as opções para a escala</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="year">Ano da Escala</Label>
                <Input 
                  id="year" 
                  type="number" 
                  value={year} 
                  onChange={e => setYear(parseInt(e.target.value) || new Date().getFullYear())} 
                />
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <Label>Pessoas Participantes ({members.length})</Label>
                  <Badge variant="outline" className="ml-2">
                    {members.length * (members.length - 1) / 2} pares possíveis
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    placeholder="Nome da pessoa" 
                    value={newMemberName} 
                    onChange={e => setNewMemberName(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && addMember()}
                  />
                  <Button size="sm" onClick={addMember}>
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                  {members.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      Nenhuma pessoa adicionada
                    </p>
                  )}
                  
                  {members.map((member, index) => (
                    <div key={index} className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                      <span className="text-sm">{member}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeMember(index)}>
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <Label>Dias Especiais (Dia D)</Label>
                <div className="flex gap-2 mb-2">
                  <Input 
                    type="date" 
                    value={newSpecialDate} 
                    onChange={e => setNewSpecialDate(e.target.value)} 
                    min={`${year}-01-01`}
                    max={`${year}-12-31`}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={addSpecialDay}>
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
                <Input 
                  placeholder="Título do Dia D" 
                  value={newSpecialTitle} 
                  onChange={e => setNewSpecialTitle(e.target.value)} 
                  className="mb-2"
                  onKeyDown={e => e.key === 'Enter' && addSpecialDay()}
                />
                
                <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                  {specialDays.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      Nenhum dia especial adicionado
                    </p>
                  )}
                  
                  {specialDays.map((day, index) => (
                    <div key={index} className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                      <div>
                        <span className="text-xs text-gray-500">
                          {new Date(day.date).toLocaleDateString('pt-BR')}:
                        </span>
                        <span className="text-sm ml-1">{day.title}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => removeSpecialDay(index)}>
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={generateCleaningSchedule} 
                disabled={isGenerating || members.length < 2}
              >
                {isGenerating ? 'Gerando...' : 'Gerar Escala de Limpeza'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Escala Gerada</CardTitle>
                  <CardDescription>
                    Escala de limpeza para o ano {year}
                    {generatedSchedule.length > 0 && (
                      <span className="ml-2 text-xs">
                        ({generatedSchedule.length} sábados)
                      </span>
                    )}
                  </CardDescription>
                </div>

                {generatedSchedule.length > 0 && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={viewMode === 'list' ? 'bg-blue-50' : ''}
                      onClick={() => setViewMode('list')}
                    >
                      Lista
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={viewMode === 'calendar' ? 'bg-blue-50' : ''}
                      onClick={() => setViewMode('calendar')}
                    >
                      Calendário
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedSchedule.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhuma escala gerada</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Configure as opções e clique em "Gerar Escala de Limpeza" para criar uma escala de limpeza para todos os sábados do ano.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Informação</AlertTitle>
                      <AlertDescription>
                        A escala foi gerada com {generatedSchedule.length} sábados, incluindo {specialDays.length} Dias D.
                        Cada pessoa participa em média {(generatedSchedule.reduce((total, item) => total + item.names.length, 0) / members.length).toFixed(1)} vezes.
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Estatísticas de Participação</h3>
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[180px]">Pessoa</TableHead>
                              <TableHead>Participações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {memberStats.map((stat, index) => (
                              <TableRow key={index}>
                                <TableCell>{stat.name}</TableCell>
                                <TableCell>{stat.participationCount}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Ações</h3>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start" 
                          onClick={exportToCSV}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Exportar para CSV
                        </Button>
                        
                        <Button 
                          className="w-full justify-start" 
                          onClick={sendToCleaningPage}
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Enviar para página de limpeza
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botão para testar geração de sábados */}
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => testSaturdayGeneration(year)}
                  >
                    Testar Geração de Sábados
                  </Button>
                  
                  {viewMode === 'list' ? (
                    <div className="border rounded-md overflow-x-auto">
                      <Table>
                        <TableCaption>Escala de limpeza para {year}</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Data</TableHead>
                            <TableHead>Equipe</TableHead>
                            <TableHead className="w-[120px] text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {generatedSchedule.map((item, index) => (
                            <TableRow key={index} className={item.isSpecialDay ? "bg-amber-50" : ""}>
                              <TableCell className="font-mono text-sm">
                                {formatDisplayDate(item.date)}
                              </TableCell>
                              <TableCell className={`${item.isSpecialDay ? 'text-blue-700 font-medium' : ''}`}>
                                {item.isSpecialDay ? (
                                  <div>
                                    <div className="font-medium text-blue-700">{item.specialDayTitle}</div>
                                    <div className="text-xs text-blue-600 mt-0.5">Todos participam</div>
                                  </div>
                                ) : (
                                  item.names.join(' e ')
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
                                  <Checkbox 
                                    checked={item.status === "pending"}
                                    className="rounded-sm data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 h-4 w-4"
                                  />
                                  <Checkbox 
                                    className="rounded-sm data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 h-4 w-4"
                                  />
                                  <Checkbox 
                                    className="rounded-sm data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500 h-4 w-4"
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    renderCalendarView()
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  };

  export default CleaningGenerator;
  import { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { AlertCircle, Calendar, Trash, UserPlus, ArrowRight, Check, Save, Download } from 'lucide-react';
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
    
    // Estado para resultados
    const [generatedSchedule, setGeneratedSchedule] = useState<CleaningItem[]>([]);
    const [memberStats, setMemberStats] = useState<MemberInfo[]>([]);
    
    // Estado para carregamento
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    
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
    
    // Gera todos os sábados do ano
    const generateSaturdays = (year: number): string[] => {
      const saturdays: string[] = [];
      const date = new Date(year, 0, 1); // 1º de janeiro
      
      // Avança para o primeiro sábado
      while (date.getDay() !== 6) {
        date.setDate(date.getDate() + 1);
      }
      
      // Coleta todos os sábados do ano
      while (date.getFullYear() === year) {
        // Formato YYYY-MM-DD
        const formattedDate = date.toISOString().split('T')[0];
        saturdays.push(formattedDate);
        date.setDate(date.getDate() + 7); // Próximo sábado
      }
      
      return saturdays;
    };
    
    // Gera todas as combinações possíveis de pares únicos
    const generateUniquePairs = (people: string[]): string[][] => {
      const pairs: string[][] = [];
      
      for (let i = 0; i < people.length; i++) {
        for (let j = i + 1; j < people.length; j++) {
          pairs.push([people[i], people[j]]);
        }
      }
      
      return pairs;
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
        
        // Gerar todos os pares possíveis
        let allPairs = generateUniquePairs(members);
        
        // Embaralhar os pares para distribuição aleatória
        for (let i = allPairs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allPairs[i], allPairs[j]] = [allPairs[j], allPairs[i]];
        }
        
        // Criar agenda
        const schedule: CleaningItem[] = [];
        const memberParticipation: Record<string, number> = {};
        
        // Inicializar contador de participação
        members.forEach(member => {
          memberParticipation[member] = 0;
        });
        
        let pairIndex = 0;
        
        // Para cada sábado, atribuir um par
        for (let i = 0; i < saturdays.length; i++) {
          const date = saturdays[i];
          
          // Verificar se é um dia especial
          const specialDay = specialDays.find(sd => sd.date === date);
          
          if (specialDay) {
            // Dia especial - todos participam
            schedule.push({
              id: `cleaning-${i}`,
              date,
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
            // Dia normal - escolher próximo par
            const currentPair = allPairs[pairIndex % allPairs.length];
            
            schedule.push({
              id: `cleaning-${i}`,
              date,
              names: currentPair,
              status: 'pending'
            });
            
            // Incrementar participação dos membros do par
            currentPair.forEach(member => {
              memberParticipation[member] += 1;
            });
            
            pairIndex++;
          }
        }
        
        // Se o número de sábados for maior que o número de pares disponíveis,
        // precisamos repetir alguns pares. Neste caso, tentamos distribuir igualmente.
        if (saturdays.length > allPairs.length) {
          // Já atribuímos todos os pares na primeira volta
          // A lógica acima continuará a partir do início da lista para as demais datas
        }
        
        // Estatísticas de participação
        const stats = Object.entries(memberParticipation).map(([name, count]) => ({
          name,
          participationCount: count
        }));
        
        stats.sort((a, b) => b.participationCount - a.participationCount);
        
        setGeneratedSchedule(schedule);
        setMemberStats(stats);
      } catch (error) {
        console.error("Erro ao gerar escala:", error);
        alert("Ocorreu um erro ao gerar a escala. Tente novamente.");
      } finally {
        setIsGenerating(false);
      }
    };
    
    // Exportar para CSV
    const exportToCSV = () => {
      if (!generatedSchedule.length) return;
      
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Data,Pessoas,Status,Tipo\n";
      
      generatedSchedule.forEach(item => {
        const date = new Date(item.date).toLocaleDateString('pt-BR');
        const names = item.names.join(' & ');
        const status = item.status;
        const type = item.isSpecialDay ? `Dia D: ${item.specialDayTitle}` : "Normal";
        
        csvContent += `${date},${names},${status},${type}\n`;
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
      navigate('/admin/limpeza', { state: { generatedSchedule } });
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
              <CardTitle className="text-lg">Escala Gerada</CardTitle>
              <CardDescription>
                Escala de limpeza para o ano {year}
                {generatedSchedule.length > 0 && (
                  <span className="ml-2 text-xs">
                    ({generatedSchedule.length} sábados)
                  </span>
                )}
              </CardDescription>
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
                  
                  <div className="border rounded-md overflow-x-auto">
                    <Table>
                      <TableCaption>Escala de limpeza para {year}</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Data</TableHead>
                          <TableHead>Pessoas</TableHead>
                          <TableHead className="w-[130px]">Tipo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {generatedSchedule.map((item, index) => (
                          <TableRow key={index} className={item.isSpecialDay ? "bg-amber-50" : ""}>
                            <TableCell className="font-mono text-xs">
                              {new Date(item.date).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {item.names.map((name, idx) => (
                                  <Badge key={idx} variant={item.isSpecialDay ? "outline" : "secondary"} className="text-xs">
                                    {name}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.isSpecialDay ? (
                                <Badge variant="warning" className="whitespace-nowrap">
                                  Dia D: {item.specialDayTitle}
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="whitespace-nowrap">
                                  Regular
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  };

  export default CleaningGenerator;
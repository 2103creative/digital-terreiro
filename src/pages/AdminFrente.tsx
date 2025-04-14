import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, PlusCircle, Edit, Trash2, ArrowLeftCircle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Interface para o modelo Frente
interface Frente {
  id: number;
  title: string;
  description: string;
  subtitle?: string;
  imageUrl?: string;
  type: "umbanda" | "nacao";
  views: number;
}

// Dados de exemplo das frentes
const frentesData: Frente[] = [
  {
    id: 1,
    title: "Caboclos",
    subtitle: "Energia de proteção e cura",
    description: "Energia de proteção e cura da natureza. Os caboclos são espíritos que representam os nativos brasileiros e trabalham com as forças da natureza para cura e orientação espiritual.",
    imageUrl: "/placeholder-frente.jpg",
    type: "umbanda",
    views: 128,
  },
  {
    id: 2,
    title: "Pretos Velhos",
    subtitle: "Sabedoria ancestral",
    description: "Sabedoria ancestral e acolhimento. Os pretos velhos são espíritos de antigos escravos que viveram no Brasil e trazem consigo conhecimento, caridade e paciência.",
    imageUrl: "/placeholder-frente.jpg",
    type: "umbanda",
    views: 156,
  },
  {
    id: 3,
    title: "Crianças",
    subtitle: "Energia de pureza",
    description: "Energia de pureza e alegria. As crianças na umbanda representam a pureza, a inocência e a alegria, trazendo leveza aos trabalhos espirituais.",
    imageUrl: "/placeholder-frente.jpg",
    type: "umbanda",
    views: 97,
  },
  {
    id: 4,
    title: "Exus e Pombagiras",
    subtitle: "Guardiões e orientadores",
    description: "Guardiões e orientadores dos caminhos. Trabalham na quebra de demandas, proteção espiritual e remoção de obstáculos da vida dos médiuns e consulentes.",
    imageUrl: "/placeholder-frente.jpg",
    type: "umbanda",
    views: 214,
  },
  {
    id: 5,
    title: "Xangô",
    subtitle: "Orixá da justiça",
    description: "Orixá da justiça e do trovão. Xangô é o senhor da justiça, representado pelas pedreiras, trovões e pela força que equilibra o bem e o mal.",
    imageUrl: "/placeholder-frente.jpg",
    type: "nacao",
    views: 183,
  },
  {
    id: 6,
    title: "Oxum",
    subtitle: "Orixá das águas doces",
    description: "Orixá das águas doces e do amor. Oxum representa a fertilidade, beleza, riqueza e o amor materno, sendo a dona dos rios e cachoeiras.",
    imageUrl: "/placeholder-frente.jpg",
    type: "nacao",
    views: 176,
  },
];

const AdminFrente = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [frentes, setFrentes] = useState<Frente[]>(frentesData);
  const [activeTab, setActiveTab] = useState<"umbanda" | "nacao">("umbanda");
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFrente, setSelectedFrente] = useState<Frente | null>(null);
  const [newFrente, setNewFrente] = useState<Partial<Frente>>({
    title: "",
    subtitle: "",
    description: "",
    type: "umbanda",
    imageUrl: "/placeholder-frente.jpg",
  });

  // Função para adicionar nova frente
  const handleAddFrente = () => {
    if (!newFrente.title || !newFrente.description || !newFrente.type) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...frentes.map(f => f.id), 0) + 1;
    const frenteToAdd: Frente = {
      id: newId,
      title: newFrente.title,
      subtitle: newFrente.subtitle || "",
      description: newFrente.description,
      imageUrl: newFrente.imageUrl || "/placeholder-frente.jpg",
      type: newFrente.type as "umbanda" | "nacao",
      views: 0,
    };

    setFrentes([...frentes, frenteToAdd]);
    setNewFrente({
      title: "",
      subtitle: "",
      description: "",
      type: "umbanda",
      imageUrl: "/placeholder-frente.jpg",
    });
    setShowForm(false);

    toast({
      title: "Frente adicionada",
      description: `A frente "${frenteToAdd.title}" foi adicionada com sucesso.`,
    });
  };

  // Função para editar frente
  const handleEditFrente = (frente: Frente) => {
    setSelectedFrente(frente);
    setNewFrente({
      title: frente.title,
      subtitle: frente.subtitle,
      description: frente.description,
      type: frente.type,
      imageUrl: frente.imageUrl,
    });
    setShowForm(true);
  };

  // Função para atualizar frente
  const handleUpdateFrente = () => {
    if (!selectedFrente) return;
    
    if (!newFrente.title || !newFrente.description || !newFrente.type) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const updatedFrentes = frentes.map(f => 
      f.id === selectedFrente.id 
        ? { 
            ...f, 
            title: newFrente.title!, 
            subtitle: newFrente.subtitle || "", 
            description: newFrente.description!, 
            type: newFrente.type as "umbanda" | "nacao",
            imageUrl: newFrente.imageUrl || f.imageUrl
          } 
        : f
    );

    setFrentes(updatedFrentes);
    setNewFrente({
      title: "",
      subtitle: "",
      description: "",
      type: "umbanda",
      imageUrl: "/placeholder-frente.jpg",
    });
    setSelectedFrente(null);
    setShowForm(false);

    toast({
      title: "Frente atualizada",
      description: `A frente "${newFrente.title}" foi atualizada com sucesso.`,
    });
  };

  // Função para confirmar exclusão
  const handleConfirmDelete = () => {
    if (!selectedFrente) return;
    
    const updatedFrentes = frentes.filter(f => f.id !== selectedFrente.id);
    setFrentes(updatedFrentes);
    setShowDeleteDialog(false);
    setSelectedFrente(null);

    toast({
      title: "Frente excluída",
      description: `A frente "${selectedFrente.title}" foi excluída com sucesso.`,
    });
  };

  // Filtrar frentes por tipo
  const filteredFrentes = frentes.filter(frente => frente.type === activeTab);

  return (
    <AdminLayout pageTitle="Gerenciar Frentes" pageDescription="Administre as frentes espirituais do terreiro">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="umbanda" onValueChange={(value) => setActiveTab(value as "umbanda" | "nacao")}>
              <TabsList>
                <TabsTrigger value="umbanda">Umbanda</TabsTrigger>
                <TabsTrigger value="nacao">Nação</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={() => setShowForm(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Frente
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Frentes de {activeTab === "umbanda" ? "Umbanda" : "Nação"}</CardTitle>
              <CardDescription>
                Gerencie as frentes espirituais do {activeTab === "umbanda" ? "terreiro de umbanda" : "culto de nação"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFrentes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Imagem</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Subtítulo</TableHead>
                      <TableHead className="hidden md:table-cell">Visualizações</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFrentes.map((frente) => (
                      <TableRow key={frente.id}>
                        <TableCell>
                          <Avatar className="h-10 w-10">
                            <img src={frente.imageUrl} alt={frente.title} />
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{frente.title}</TableCell>
                        <TableCell>{frente.subtitle}</TableCell>
                        <TableCell className="hidden md:table-cell">{frente.views}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditFrente(frente)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => {
                                setSelectedFrente(frente);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center p-10">
                  <Layers className="h-16 w-16 text-primary mb-4" />
                  <p className="text-xl font-medium text-center">Nenhuma frente encontrada</p>
                  <p className="text-muted-foreground mt-2 text-center">
                    Não existem frentes de {activeTab === "umbanda" ? "Umbanda" : "Nação"} cadastradas.
                    Clique em "Nova Frente" para adicionar.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{selectedFrente ? 'Editar' : 'Nova'} Frente</CardTitle>
              <Button variant="outline" size="sm" onClick={() => {
                setShowForm(false);
                setSelectedFrente(null);
                setNewFrente({
                  title: "",
                  subtitle: "",
                  description: "",
                  type: "umbanda",
                  imageUrl: "/placeholder-frente.jpg",
                });
              }}>
                <ArrowLeftCircle className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
            <CardDescription>
              {selectedFrente ? 'Edite as informações da frente espiritual' : 'Preencha as informações para adicionar uma nova frente espiritual'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frente-titulo">Título *</Label>
                  <Input
                    id="frente-titulo"
                    placeholder="Ex: Caboclos"
                    value={newFrente.title}
                    onChange={(e) => setNewFrente({...newFrente, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frente-subtitulo">Subtítulo</Label>
                  <Input
                    id="frente-subtitulo"
                    placeholder="Ex: Energia de proteção e cura"
                    value={newFrente.subtitle}
                    onChange={(e) => setNewFrente({...newFrente, subtitle: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frente-imagem">URL da Imagem</Label>
                <Input
                  id="frente-imagem"
                  placeholder="URL da imagem"
                  value={newFrente.imageUrl}
                  onChange={(e) => setNewFrente({...newFrente, imageUrl: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Deixe vazio para usar a imagem padrão
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frente-tipo">Tipo *</Label>
                <Select
                  value={newFrente.type}
                  onValueChange={(value) => setNewFrente({...newFrente, type: value as "umbanda" | "nacao"})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="umbanda">Umbanda</SelectItem>
                    <SelectItem value="nacao">Nação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frente-descricao">Descrição *</Label>
                <Textarea
                  id="frente-descricao"
                  placeholder="Descreva detalhadamente esta frente espiritual"
                  value={newFrente.description}
                  onChange={(e) => setNewFrente({...newFrente, description: e.target.value})}
                  rows={5}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setSelectedFrente(null);
                    setNewFrente({
                      title: "",
                      subtitle: "",
                      description: "",
                      type: "umbanda",
                      imageUrl: "/placeholder-frente.jpg",
                    });
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={selectedFrente ? handleUpdateFrente : handleAddFrente}>
                  {selectedFrente ? 'Atualizar' : 'Adicionar'} Frente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a frente "{selectedFrente?.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminFrente; 
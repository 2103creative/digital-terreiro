import { useState } from "react";
import { BookOpen, PlusCircle, Edit, Trash2, ArrowLeftCircle, Download, FileText, Book } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

// Interface para o modelo do Material de Leitura
interface ReadingMaterial {
  id: number;
  title: string;
  description: string;
  pages: number;
  type: "e-book" | "doutrina" | "artigo";
  category: "umbanda" | "nacao";
  author?: string;
  coverUrl?: string;
  fileUrl?: string;
  publishedDate?: Date;
  isFeatured: boolean;
}

// Dados de exemplo dos materiais de leitura
const materialsData: ReadingMaterial[] = [
  {
    id: 1,
    title: "Fundamentos da Umbanda",
    description: "Conheça os princípios básicos da religião de Umbanda. Este livro aborda os conceitos fundamentais, a história e as práticas da Umbanda de forma clara e acessível.",
    pages: 45,
    type: "e-book",
    category: "umbanda",
    author: "Pai João de Aruanda",
    coverUrl: "/covers/umbanda-fundamentos.jpg",
    fileUrl: "/ebooks/fundamentos-umbanda.pdf",
    publishedDate: new Date(2023, 5, 15),
    isFeatured: true,
  },
  {
    id: 2,
    title: "Guia dos Orixás",
    description: "Aprenda sobre os Orixás e suas características. Um guia completo com descrições, correspondências, oferendas e rezas de cada Orixá cultuado na Umbanda.",
    pages: 120,
    type: "e-book",
    category: "umbanda",
    author: "Mãe Stella de Oxóssi",
    coverUrl: "/covers/guia-orixas.jpg",
    fileUrl: "/ebooks/guia-orixas.pdf",
    publishedDate: new Date(2022, 9, 7),
    isFeatured: false,
  },
  {
    id: 3,
    title: "Pontos Riscados",
    description: "O significado dos símbolos sagrados. Explore a geometria sagrada dos pontos riscados de Umbanda e entenda como eles canalizam as energias espirituais.",
    pages: 78,
    type: "e-book",
    category: "umbanda",
    author: "Carlos Alberto Santos",
    coverUrl: "/covers/pontos-riscados.jpg",
    fileUrl: "/ebooks/pontos-riscados.pdf",
    publishedDate: new Date(2023, 2, 22),
    isFeatured: false,
  },
  {
    id: 4,
    title: "Iniciação ao Candomblé",
    description: "Os primeiros passos na Nação. Uma introdução aos fundamentos do Candomblé, explicando os princípios da religião e os primeiros passos para os iniciantes.",
    pages: 90,
    type: "doutrina",
    category: "nacao",
    author: "Pai Rodolfo de Omolu",
    coverUrl: "/covers/iniciacao-candomble.jpg",
    fileUrl: "/ebooks/iniciacao-candomble.pdf",
    publishedDate: new Date(2021, 11, 10),
    isFeatured: true,
  },
  {
    id: 5,
    title: "Rituais e Obrigações",
    description: "O calendário ritualístico e suas obrigações. Um guia completo sobre o calendário litúrgico do Candomblé e as obrigações religiosas ao longo do ano.",
    pages: 65,
    type: "doutrina",
    category: "nacao",
    author: "Mãe Rita de Iansã",
    coverUrl: "/covers/rituais-obrigacoes.jpg",
    fileUrl: "/ebooks/rituais-obrigacoes.pdf",
    publishedDate: new Date(2022, 3, 5),
    isFeatured: false,
  },
  {
    id: 6,
    title: "Ervas Sagradas e seus Usos",
    description: "Aprenda sobre as ervas utilizadas nos rituais, suas propriedades e usos sagrados. Um artigo detalhado sobre as ervas mais comuns e seus poderes de cura.",
    pages: 12,
    type: "artigo",
    category: "umbanda",
    author: "Pai Jorge de Oxóssi",
    coverUrl: "/covers/ervas-sagradas.jpg",
    fileUrl: "/articles/ervas-sagradas.pdf",
    publishedDate: new Date(2023, 1, 18),
    isFeatured: true,
  },
];

const AdminReading = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<"umbanda" | "nacao">("umbanda");
  const [materials, setMaterials] = useState<ReadingMaterial[]>(materialsData);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<ReadingMaterial | null>(null);
  const [newMaterial, setNewMaterial] = useState<Partial<ReadingMaterial>>({
    title: "",
    description: "",
    pages: 1,
    type: "e-book",
    category: "umbanda",
    author: "",
    coverUrl: "",
    fileUrl: "",
    publishedDate: new Date(),
    isFeatured: false,
  });

  // Função para adicionar novo material
  const handleAddMaterial = () => {
    if (!newMaterial.title || !newMaterial.description || !newMaterial.pages || !newMaterial.type || !newMaterial.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...materials.map(m => m.id), 0) + 1;
    const materialToAdd: ReadingMaterial = {
      id: newId,
      title: newMaterial.title,
      description: newMaterial.description,
      pages: newMaterial.pages || 1,
      type: newMaterial.type as "e-book" | "doutrina" | "artigo",
      category: newMaterial.category as "umbanda" | "nacao",
      author: newMaterial.author || "",
      coverUrl: newMaterial.coverUrl || "/covers/default-cover.jpg",
      fileUrl: newMaterial.fileUrl || "",
      publishedDate: newMaterial.publishedDate || new Date(),
      isFeatured: newMaterial.isFeatured || false,
    };

    setMaterials([...materials, materialToAdd]);
    setNewMaterial({
      title: "",
      description: "",
      pages: 1,
      type: "e-book",
      category: "umbanda",
      author: "",
      coverUrl: "",
      fileUrl: "",
      publishedDate: new Date(),
      isFeatured: false,
    });
    setShowForm(false);

    toast({
      title: "Material adicionado",
      description: `O material "${materialToAdd.title}" foi adicionado com sucesso.`,
    });
  };

  // Função para editar material
  const handleEditMaterial = (material: ReadingMaterial) => {
    setSelectedMaterial(material);
    setNewMaterial({
      title: material.title,
      description: material.description,
      pages: material.pages,
      type: material.type,
      category: material.category,
      author: material.author,
      coverUrl: material.coverUrl,
      fileUrl: material.fileUrl,
      publishedDate: material.publishedDate,
      isFeatured: material.isFeatured,
    });
    setShowForm(true);
  };

  // Função para atualizar material
  const handleUpdateMaterial = () => {
    if (!selectedMaterial) return;
    
    if (!newMaterial.title || !newMaterial.description || !newMaterial.pages || !newMaterial.type || !newMaterial.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const updatedMaterials = materials.map(m => 
      m.id === selectedMaterial.id 
        ? { 
            ...m, 
            title: newMaterial.title!, 
            description: newMaterial.description!, 
            pages: newMaterial.pages!, 
            type: newMaterial.type as "e-book" | "doutrina" | "artigo",
            category: newMaterial.category as "umbanda" | "nacao",
            author: newMaterial.author || m.author,
            coverUrl: newMaterial.coverUrl || m.coverUrl,
            fileUrl: newMaterial.fileUrl || m.fileUrl,
            publishedDate: newMaterial.publishedDate || m.publishedDate,
            isFeatured: newMaterial.isFeatured || false,
          } 
        : m
    );

    setMaterials(updatedMaterials);
    setNewMaterial({
      title: "",
      description: "",
      pages: 1,
      type: "e-book",
      category: "umbanda",
      author: "",
      coverUrl: "",
      fileUrl: "",
      publishedDate: new Date(),
      isFeatured: false,
    });
    setSelectedMaterial(null);
    setShowForm(false);

    toast({
      title: "Material atualizado",
      description: `O material "${newMaterial.title}" foi atualizado com sucesso.`,
    });
  };

  // Função para confirmar exclusão
  const handleConfirmDelete = () => {
    if (!selectedMaterial) return;
    
    const updatedMaterials = materials.filter(m => m.id !== selectedMaterial.id);
    setMaterials(updatedMaterials);
    setShowDeleteDialog(false);
    setSelectedMaterial(null);

    toast({
      title: "Material excluído",
      description: `O material "${selectedMaterial.title}" foi excluído com sucesso.`,
    });
  };

  // Função para obter o ícone do tipo de material
  const getMaterialTypeIcon = (type: string) => {
    switch (type) {
      case "e-book":
        return <Book className="h-4 w-4 mr-1" />;
      case "doutrina":
        return <BookOpen className="h-4 w-4 mr-1" />;
      case "artigo":
        return <FileText className="h-4 w-4 mr-1" />;
      default:
        return <BookOpen className="h-4 w-4 mr-1" />;
    }
  };

  // Função para obter o nome do tipo de material
  const getMaterialTypeName = (type: string) => {
    switch (type) {
      case "e-book":
        return "E-Book";
      case "doutrina":
        return "Doutrina";
      case "artigo":
        return "Artigo";
      default:
        return type;
    }
  };

  // Função para obter a cor da badge com base no tipo de material
  const getMaterialTypeBadgeColor = (type: string) => {
    switch (type) {
      case "e-book":
        return "bg-blue-100 text-blue-800";
      case "doutrina":
        return "bg-purple-100 text-purple-800";
      case "artigo":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filtrar materiais por categoria
  const filteredMaterials = materials.filter(material => material.category === activeCategory);

  return (
    <AdminLayout pageTitle="Gerenciar Materiais de Leitura" pageDescription="Administre os materiais de leitura disponíveis para os membros">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <Tabs defaultValue="umbanda" onValueChange={(value) => setActiveCategory(value as "umbanda" | "nacao")}>
              <TabsList>
                <TabsTrigger value="umbanda">Umbanda</TabsTrigger>
                <TabsTrigger value="nacao">Nação</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={() => setShowForm(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Material
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Lista de Materiais de Leitura</CardTitle>
              <CardDescription>
                Gerencie os materiais de leitura disponíveis para {activeCategory === "umbanda" ? "Umbanda" : "Nação"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredMaterials.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="hidden md:table-cell">Autor</TableHead>
                      <TableHead className="hidden md:table-cell">Páginas</TableHead>
                      <TableHead className="hidden md:table-cell">Destaque</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.title}</TableCell>
                        <TableCell>
                          <Badge className={cn("rounded-sm font-normal", getMaterialTypeBadgeColor(material.type))}>
                            <span className="flex items-center">
                              {getMaterialTypeIcon(material.type)}
                              {getMaterialTypeName(material.type)}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{material.author || "Desconhecido"}</TableCell>
                        <TableCell className="hidden md:table-cell">{material.pages}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {material.isFeatured ? (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Destaque
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">Não</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-blue-500"
                              onClick={() => {
                                window.open(material.fileUrl, '_blank');
                                toast({
                                  title: "Download iniciado",
                                  description: `O arquivo está sendo baixado.`,
                                });
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditMaterial(material)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => {
                                setSelectedMaterial(material);
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
                  <BookOpen className="h-16 w-16 text-primary mb-4" />
                  <p className="text-xl font-medium text-center">Nenhum material encontrado</p>
                  <p className="text-muted-foreground mt-2 text-center">
                    Não existem materiais de leitura para {activeCategory === "umbanda" ? "Umbanda" : "Nação"} cadastrados.
                    Clique em "Novo Material" para adicionar.
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
              <CardTitle>{selectedMaterial ? 'Editar' : 'Novo'} Material de Leitura</CardTitle>
              <Button variant="outline" size="sm" onClick={() => {
                setShowForm(false);
                setSelectedMaterial(null);
                setNewMaterial({
                  title: "",
                  description: "",
                  pages: 1,
                  type: "e-book",
                  category: "umbanda",
                  author: "",
                  coverUrl: "",
                  fileUrl: "",
                  publishedDate: new Date(),
                  isFeatured: false,
                });
              }}>
                <ArrowLeftCircle className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
            <CardDescription>
              {selectedMaterial ? 'Edite as informações do material de leitura' : 'Preencha as informações para adicionar um novo material de leitura'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material-title">Título *</Label>
                  <Input
                    id="material-title"
                    placeholder="Ex: Fundamentos da Umbanda"
                    value={newMaterial.title}
                    onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material-author">Autor</Label>
                  <Input
                    id="material-author"
                    placeholder="Ex: Pai João de Aruanda"
                    value={newMaterial.author}
                    onChange={(e) => setNewMaterial({...newMaterial, author: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material-type">Tipo de Material *</Label>
                  <Select
                    value={newMaterial.type}
                    onValueChange={(value) => setNewMaterial({...newMaterial, type: value as "e-book" | "doutrina" | "artigo"})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="e-book">E-Book</SelectItem>
                      <SelectItem value="doutrina">Doutrina</SelectItem>
                      <SelectItem value="artigo">Artigo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material-category">Categoria *</Label>
                  <Select
                    value={newMaterial.category}
                    onValueChange={(value) => setNewMaterial({...newMaterial, category: value as "umbanda" | "nacao"})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="umbanda">Umbanda</SelectItem>
                      <SelectItem value="nacao">Nação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material-pages">Número de Páginas *</Label>
                  <Input
                    id="material-pages"
                    type="number"
                    min="1"
                    placeholder="Ex: 45"
                    value={newMaterial.pages}
                    onChange={(e) => setNewMaterial({...newMaterial, pages: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material-cover">URL da Capa</Label>
                  <Input
                    id="material-cover"
                    placeholder="Ex: /covers/umbanda-fundamentos.jpg"
                    value={newMaterial.coverUrl}
                    onChange={(e) => setNewMaterial({...newMaterial, coverUrl: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">
                    Deixe vazio para usar a capa padrão
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material-file">URL do Arquivo</Label>
                  <Input
                    id="material-file"
                    placeholder="Ex: /ebooks/fundamentos-umbanda.pdf"
                    value={newMaterial.fileUrl}
                    onChange={(e) => setNewMaterial({...newMaterial, fileUrl: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="material-description">Descrição *</Label>
                <Textarea
                  id="material-description"
                  placeholder="Descreva o material de leitura detalhadamente"
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="material-featured"
                  checked={newMaterial.isFeatured}
                  onCheckedChange={(checked) => setNewMaterial({...newMaterial, isFeatured: checked})}
                />
                <Label htmlFor="material-featured">Destacar este material</Label>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setSelectedMaterial(null);
                    setNewMaterial({
                      title: "",
                      description: "",
                      pages: 1,
                      type: "e-book",
                      category: "umbanda",
                      author: "",
                      coverUrl: "",
                      fileUrl: "",
                      publishedDate: new Date(),
                      isFeatured: false,
                    });
                  }}
                >
                  Cancelar
                </Button>
                <Button onClick={selectedMaterial ? handleUpdateMaterial : handleAddMaterial}>
                  {selectedMaterial ? 'Atualizar' : 'Adicionar'} Material
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
              Tem certeza que deseja excluir o material "{selectedMaterial?.title}"? Esta ação não pode ser desfeita.
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

export default AdminReading; 
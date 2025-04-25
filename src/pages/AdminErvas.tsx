import { useState } from "react";
import { Leaf, PlusCircle, Edit, ArrowLeftCircle } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MobileNav from "@/components/MobileNav";

interface Erva {
  id: number;
  titulo: string;
  subtitulo: string;
  descricao: string;
  propriedades: string;
  usos: string;
  orixaAssociado: string;
}

// Exemplo de ervas
const ervasData: Erva[] = [
  {
    id: 1,
    titulo: "Arruda",
    subtitulo: "Ruta graveolens",
    descricao: "Erva muito utilizada para proteção espiritual e afastamento de energias negativas. Seu aroma forte é característico.",
    propriedades: "Proteção, Limpeza",
    usos: "Banhos, Defumação, Amacis",
    orixaAssociado: "Ogum, Oxóssi",
  },
  {
    id: 2,
    titulo: "Guiné",
    subtitulo: "Petiveria alliacea",
    descricao: "Utilizada para afastar energias negativas e fortalecer o campo espiritual.",
    propriedades: "Proteção, Fortalecimento",
    usos: "Banhos, Defumação",
    orixaAssociado: "Oxóssi, Ogum",
  },
  {
    id: 3,
    titulo: "Alecrim",
    subtitulo: "Rosmarinus officinalis",
    descricao: "Erva de alegria, clareza mental e proteção.",
    propriedades: "Alegria, Clareza mental, Proteção",
    usos: "Banhos, Chás, Defumação",
    orixaAssociado: "Oxóssi, Iemanjá",
  },
];

const AdminErvas = () => {
  const { toast } = useToast();
  const [ervas, setErvas] = useState<Erva[]>(ervasData);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedErva, setSelectedErva] = useState<Erva | null>(null);
  const [newErva, setNewErva] = useState<Partial<Erva>>({ titulo: "", subtitulo: "", descricao: "", propriedades: "", usos: "", orixaAssociado: "" });

  const handleAddErva = () => {
    if (!newErva.titulo || !newErva.descricao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    const newId = Math.max(...ervas.map(e => e.id), 0) + 1;
    const ervaToAdd: Erva = {
      id: newId,
      titulo: newErva.titulo!,
      subtitulo: newErva.subtitulo || "",
      descricao: newErva.descricao!,
      propriedades: newErva.propriedades || "",
      usos: newErva.usos || "",
      orixaAssociado: newErva.orixaAssociado || "",
    };
    setErvas([...ervas, ervaToAdd]);
    setNewErva({ titulo: "", subtitulo: "", descricao: "", propriedades: "", usos: "", orixaAssociado: "" });
    setShowForm(false);
    toast({ title: "Erva adicionada", description: `A erva "${ervaToAdd.titulo}" foi adicionada com sucesso.` });
  };

  const handleEditErva = (erva: Erva) => {
    setSelectedErva(erva);
    setNewErva({ ...erva });
    setShowForm(true);
  };

  const handleUpdateErva = () => {
    if (!selectedErva) return;
    if (!newErva.titulo || !newErva.descricao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }
    const updatedErvas = ervas.map(e =>
      e.id === selectedErva.id
        ? { ...e, ...newErva }
        : e
    );
    setErvas(updatedErvas);
    setSelectedErva(null);
    setNewErva({ titulo: "", subtitulo: "", descricao: "", propriedades: "", usos: "", orixaAssociado: "" });
    setShowForm(false);
    toast({ title: "Erva atualizada", description: `A erva "${newErva.titulo}" foi atualizada com sucesso.` });
  };

  const handleConfirmDelete = () => {
    if (!selectedErva) return;
    const updatedErvas = ervas.filter(e => e.id !== selectedErva.id);
    setErvas(updatedErvas);
    setShowDeleteDialog(false);
    setSelectedErva(null);
    toast({ title: "Erva excluída", description: `A erva "${selectedErva.titulo}" foi excluída com sucesso.` });
  };

  return (
    <AdminLayout pageTitle="Ervas" pageDescription="Gerencie o catálogo de ervas sagradas do terreiro.">
      {!showForm ? (
        <>
          <div className="mb-6 flex flex-col items-start gap-2">
            <Button className="h-8 text-xs px-3 bg-black hover:bg-gray-900 text-white flex items-center gap-1" onClick={() => setShowForm(true)}>
              <span className="text-lg leading-none">+</span> Adicionar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 max-w-5xl">
            {ervas.map(erva => (
              <Card
                key={erva.id}
                className="bg-white border border-gray-100 rounded-[12px] aspect-square hover:shadow-sm cursor-pointer transition-shadow w-[95px] h-[95px]"
                onClick={() => handleEditErva(erva)}
              >
                <div className="flex flex-col h-full p-2 relative">
                  {/* Ícone de erva no canto superior esquerdo */}
                  <div className="absolute top-2 left-2">
                    <Leaf className="h-4 w-4 text-primary" />
                  </div>
                  {/* Nome da erva centralizado */}
                  <div className="flex-1 flex items-center justify-center">
                    <h3 className="text-[11px] font-medium text-gray-900 text-center line-clamp-2">{erva.titulo}</h3>
                  </div>
                  {/* Link de editar no canto inferior esquerdo */}
                  <div className="absolute bottom-2 left-2 flex items-center text-[10px] text-blue-600"
                    onClick={e => { e.stopPropagation(); handleEditErva(erva); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>Editar</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {ervas.length === 0 && (
            <div className="flex flex-col items-center justify-center p-10">
              <Leaf className="h-16 w-16 text-primary mb-4" />
              <p className="text-xl font-medium text-center">Nenhuma erva cadastrada</p>
              <p className="text-muted-foreground mt-2 text-center">
                Não existem ervas cadastradas. Clique em "Nova Erva" para adicionar.
              </p>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{selectedErva ? 'Editar' : 'Nova'} Erva</CardTitle>
              <Button variant="outline" size="sm" onClick={() => {
                setShowForm(false);
                setSelectedErva(null);
                setNewErva({ titulo: "", subtitulo: "", descricao: "", propriedades: "", usos: "", orixaAssociado: "" });
              }}>
                <ArrowLeftCircle className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="erva-titulo">Título *</Label>
                <Input
                  id="erva-titulo"
                  value={newErva.titulo}
                  onChange={e => setNewErva({ ...newErva, titulo: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="erva-subtitulo">Subtítulo</Label>
                <Input
                  id="erva-subtitulo"
                  value={newErva.subtitulo}
                  onChange={e => setNewErva({ ...newErva, subtitulo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="erva-descricao">Descrição *</Label>
                <Textarea
                  id="erva-descricao"
                  value={newErva.descricao}
                  onChange={e => setNewErva({ ...newErva, descricao: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="erva-propriedades">Propriedades</Label>
                <Input
                  id="erva-propriedades"
                  placeholder="Proteção, Limpeza"
                  value={newErva.propriedades}
                  onChange={e => setNewErva({ ...newErva, propriedades: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="erva-usos">Usos</Label>
                <Input
                  id="erva-usos"
                  placeholder="Banhos, Defumação, Amacis"
                  value={newErva.usos}
                  onChange={e => setNewErva({ ...newErva, usos: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="erva-orixa">Orixá Associado</Label>
                <Input
                  id="erva-orixa"
                  placeholder="Ogum, Oxóssi"
                  value={newErva.orixaAssociado}
                  onChange={e => setNewErva({ ...newErva, orixaAssociado: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" className="h-8 text-xs px-3" onClick={() => {
              setShowForm(false);
              setSelectedErva(null);
              setNewErva({ titulo: "", subtitulo: "", descricao: "", propriedades: "", usos: "", orixaAssociado: "" });
            }}>
              Cancelar
            </Button>
            {selectedErva && (
              <Button variant="destructive" className="h-8 text-xs px-3" onClick={() => setShowDeleteDialog(true)}>
                Excluir
              </Button>
            )}
            <Button className="h-8 text-xs px-3 bg-black hover:bg-gray-900 text-white flex items-center gap-1" onClick={selectedErva ? handleUpdateErva : handleAddErva}>
              <span className="text-lg leading-none">+</span> Adicionar
            </Button>
          </CardFooter>
        </Card>
      )}
      {/* Diálogo de confirmação de exclusão */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
            <h3 className="text-lg font-semibold mb-2">Confirmar exclusão</h3>
            <p className="mb-4">Tem certeza que deseja excluir a erva "{selectedErva?.titulo}"? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>Excluir</Button>
            </div>
          </div>
        </div>
      )}
      <MobileNav />
    </AdminLayout>
  );
};

export default AdminErvas;

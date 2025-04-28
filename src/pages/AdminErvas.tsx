import { useState, useEffect } from "react";
import { Leaf, PlusCircle, Edit, ArrowLeftCircle, Trash2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MobileNav from "@/components/MobileNav";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { Badge } from "@/components/ui/badge";

interface Erva {
  id: string;
  nome: string;
  nomeCientifico: string;
  propriedades: string[];
  usos: string[];
  descricao: string;
  orixas: string[];
  imagem?: string;
  terreiroId: string;
}

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

const AdminErvas = () => {
  const { toast } = useToast();
  const [ervas, setErvas] = useState<Erva[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editErva, setEditErva] = useState<Erva | null>(null);
  const [form, setForm] = useState<{ nome: string; nomeCientifico: string; propriedades: string; usos: string; descricao: string; orixas: string; imagem?: string }>({ nome: '', nomeCientifico: '', propriedades: '', usos: '', descricao: '', orixas: '', imagem: '' });

  // Função para buscar ervas (mock)
  function fetchErvasMock() {
    return Promise.resolve([
      {
        id: "1",
        nome: "Arruda",
        nomeCientifico: "Ruta graveolens",
        propriedades: ["Proteção", "Limpeza"],
        usos: ["Banhos", "Defumações"],
        descricao: "Erva muito utilizada para proteção espiritual.",
        orixas: ["Oxalá", "Ogum"],
        imagem: "",
        terreiroId: "1"
      }
    ]);
  }

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const terreiroId = user.terreiroId;
    if (!terreiroId) return;

    fetchErvasMock()
      .then(setErvas)
      .catch(() => {
        toast({
          title: "Erro ao carregar ervas",
          description: "Não foi possível carregar os dados. Tente novamente mais tarde.",
          variant: "destructive",
        });
      });

    const socket = connectSocket(terreiroId);
    socket.on('ervaCreated', (erva: Erva) => setErvas(prev => [...prev, erva]));
    socket.on('ervaUpdated', (erva: Erva) => setErvas(prev => prev.map(e => e.id === erva.id ? erva : e)));
    socket.on('ervaDeleted', ({ id }: { id: string }) => setErvas(prev => prev.filter(e => e.id !== id)));
    return () => {
      socket.off('ervaCreated');
      socket.off('ervaUpdated');
      socket.off('ervaDeleted');
      disconnectSocket();
    };
  }, []);

  const handleCreate = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const terreiroId = user.terreiroId;
    if (!form.nome || !form.nomeCientifico || !form.descricao || !terreiroId) return;
    const res = await fetch(`${API_URL}/ervas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        nome: form.nome,
        nomeCientifico: form.nomeCientifico,
        propriedades: form.propriedades.split(',').map(p => p.trim()),
        usos: form.usos.split(',').map(u => u.trim()),
        descricao: form.descricao,
        orixas: form.orixas.split(',').map(o => o.trim()),
        imagem: form.imagem,
        terreiroId
      })
    });
    if (res.ok) {
      toast({ title: 'Erva criada com sucesso!' });
      setShowForm(false);
      setForm({ nome: '', nomeCientifico: '', propriedades: '', usos: '', descricao: '', orixas: '', imagem: '' });
    } else {
      toast({ title: 'Erro ao criar erva', variant: 'destructive' });
    }
  };

  const handleEdit = async () => {
    if (!editErva) return;
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const terreiroId = user.terreiroId;
    const res = await fetch(`${API_URL}/ervas/${editErva.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        nome: form.nome,
        nomeCientifico: form.nomeCientifico,
        propriedades: form.propriedades.split(',').map(p => p.trim()),
        usos: form.usos.split(',').map(u => u.trim()),
        descricao: form.descricao,
        orixas: form.orixas.split(',').map(o => o.trim()),
        imagem: form.imagem,
        terreiroId
      })
    });
    if (res.ok) {
      toast({ title: 'Erva atualizada com sucesso!' });
      setShowForm(false);
      setEditErva(null);
      setForm({ nome: '', nomeCientifico: '', propriedades: '', usos: '', descricao: '', orixas: '', imagem: '' });
    } else {
      toast({ title: 'Erro ao atualizar erva', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const terreiroId = user.terreiroId;
    const res = await fetch(`${API_URL}/ervas/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ terreiroId })
    });
    if (res.ok) {
      toast({ title: 'Erva removida com sucesso!' });
    } else {
      toast({ title: 'Erro ao remover erva', variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Ervas</h1>
          <Button onClick={() => { setShowForm(true); setEditErva(null); setForm({ nome: '', nomeCientifico: '', propriedades: '', usos: '', descricao: '', orixas: '', imagem: '' }); }}><PlusCircle className="mr-2" />Nova Erva</Button>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {ervas.map(erva => (
            <Card key={erva.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="text-green-600" />
                <span className="font-bold">{erva.nome}</span>
                <span className="text-xs italic text-gray-500">{erva.nomeCientifico}</span>
              </div>
              <div className="text-muted-foreground text-sm mb-2">{erva.descricao}</div>
              <div className="mb-2">
                <span className="font-semibold text-xs">Propriedades:</span>
                {erva.propriedades.map(p => (
                  <Badge key={p} className="ml-1" variant="secondary">{p}</Badge>
                ))}
              </div>
              <div className="mb-2">
                <span className="font-semibold text-xs">Usos:</span>
                {erva.usos.map(u => (
                  <Badge key={u} className="ml-1" variant="outline">{u}</Badge>
                ))}
              </div>
              <div className="mb-2">
                <span className="font-semibold text-xs">Orixás:</span>
                {erva.orixas.map(o => (
                  <Badge key={o} className="ml-1" variant="default">{o}</Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => { setEditErva(erva); setForm({ nome: erva.nome, nomeCientifico: erva.nomeCientifico, propriedades: erva.propriedades.join(', '), usos: erva.usos.join(', '), descricao: erva.descricao, orixas: erva.orixas.join(', '), imagem: erva.imagem || '' }); setShowForm(true); }}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(erva.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 w-full max-w-lg shadow-xl">
              <h2 className="text-xl font-semibold mb-4">{editErva ? 'Editar Erva' : 'Nova Erva'}</h2>
              <div className="space-y-3">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
                <Label htmlFor="nomeCientifico">Nome Científico</Label>
                <Input id="nomeCientifico" value={form.nomeCientifico} onChange={e => setForm(f => ({ ...f, nomeCientifico: e.target.value }))} />
                <Label htmlFor="propriedades">Propriedades (separadas por vírgula)</Label>
                <Input id="propriedades" value={form.propriedades} onChange={e => setForm(f => ({ ...f, propriedades: e.target.value }))} />
                <Label htmlFor="usos">Usos (separados por vírgula)</Label>
                <Input id="usos" value={form.usos} onChange={e => setForm(f => ({ ...f, usos: e.target.value }))} />
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
                <Label htmlFor="orixas">Orixás (separados por vírgula)</Label>
                <Input id="orixas" value={form.orixas} onChange={e => setForm(f => ({ ...f, orixas: e.target.value }))} />
                <Label htmlFor="imagem">Imagem (URL opcional)</Label>
                <Input id="imagem" value={form.imagem} onChange={e => setForm(f => ({ ...f, imagem: e.target.value }))} />
              </div>
              <div className="flex gap-2 mt-6 justify-end">
                <Button onClick={editErva ? handleEdit : handleCreate}>{editErva ? 'Salvar' : 'Criar'}</Button>
                <Button variant="secondary" onClick={() => { setShowForm(false); setEditErva(null); setForm({ nome: '', nomeCientifico: '', propriedades: '', usos: '', descricao: '', orixas: '', imagem: '' }); }}>Cancelar</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminErvas;

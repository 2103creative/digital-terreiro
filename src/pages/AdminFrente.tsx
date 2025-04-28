import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, PlusCircle, Edit, Trash2, ArrowLeftCircle, ArrowRight } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
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
import { connectSocket, disconnectSocket } from "@/lib/socket";

interface Frente {
  id: string;
  nome: string;
  descricao: string;
  tipo: "umbanda" | "nacao";
  terreiroId: string;
  visualizacoes: number;
}

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

const AdminFrente = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [frentes, setFrentes] = useState<Frente[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editFrente, setEditFrente] = useState<Frente | null>(null);
  const [form, setForm] = useState<{ nome: string; descricao: string; tipo: "umbanda" | "nacao" }>({ nome: '', descricao: '', tipo: 'umbanda' });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const terreiroId = user.terreiroId;
    if (!terreiroId) return;

    fetch(`${API_URL}/frentes?terreiroId=${terreiroId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        setFrentes(data);
        setLoading(false);
      });

    const socket = connectSocket(terreiroId);
    socket.on('frenteCreated', (frente: Frente) => setFrentes(prev => [...prev, frente]));
    socket.on('frenteUpdated', (frente: Frente) => setFrentes(prev => prev.map(f => f.id === frente.id ? frente : f)));
    socket.on('frenteDeleted', ({ id }: { id: string }) => setFrentes(prev => prev.filter(f => f.id !== id)));
    return () => {
      socket.off('frenteCreated');
      socket.off('frenteUpdated');
      socket.off('frenteDeleted');
      disconnectSocket();
    };
  }, []);

  const handleCreate = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const terreiroId = user.terreiroId;
    if (!form.nome || !form.descricao || !terreiroId) return;
    const res = await fetch(`${API_URL}/frentes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ ...form, terreiroId })
    });
    if (res.ok) {
      toast({ title: 'Frente criada com sucesso!' });
      setDialogOpen(false);
      setForm({ nome: '', descricao: '', tipo: 'umbanda' });
    } else {
      toast({ title: 'Erro ao criar frente', variant: 'destructive' });
    }
  };

  const handleEdit = async () => {
    if (!editFrente) return;
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const terreiroId = user.terreiroId;
    const res = await fetch(`${API_URL}/frentes/${editFrente.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ ...form, terreiroId })
    });
    if (res.ok) {
      toast({ title: 'Frente atualizada com sucesso!' });
      setDialogOpen(false);
      setEditFrente(null);
      setForm({ nome: '', descricao: '', tipo: 'umbanda' });
    } else {
      toast({ title: 'Erro ao atualizar frente', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const terreiroId = user.terreiroId;
    const res = await fetch(`${API_URL}/frentes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ terreiroId })
    });
    if (res.ok) {
      toast({ title: 'Frente removida com sucesso!' });
    } else {
      toast({ title: 'Erro ao remover frente', variant: 'destructive' });
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando frentes...</div>;

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Frentes</h1>
          <Button onClick={() => setDialogOpen(true)}><PlusCircle className="mr-2" />Nova Frente</Button>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {frentes.map(frente => (
            <Card key={frente.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="text-primary" />
                <span className="font-bold">{frente.nome}</span>
              </div>
              <div className="text-muted-foreground text-sm mb-2">{frente.descricao}</div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => { setEditFrente(frente); setForm({ nome: frente.nome, descricao: frente.descricao, tipo: frente.tipo }); setDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(frente.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editFrente ? 'Editar Frente' : 'Nova Frente'}</DialogTitle>
              <DialogDescription>Preencha os dados da frente</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v as "umbanda" | "nacao" }))}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="umbanda">Umbanda</SelectItem>
                  <SelectItem value="nacao">Nação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button onClick={editFrente ? handleEdit : handleCreate}>{editFrente ? 'Salvar' : 'Criar'}</Button>
              <Button variant="secondary" onClick={() => { setDialogOpen(false); setEditFrente(null); setForm({ nome: '', descricao: '', tipo: 'umbanda' }); }}>Cancelar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default AdminFrente;
import { useState, useEffect } from "react";
import { Calendar, CalendarDays, PlusCircle, Edit, Trash2, ArrowLeftCircle, ArrowRight } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { connectSocket, disconnectSocket } from "@/lib/socket";

interface Event {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  tipo: "gira" | "festa" | "curso";
  terreiroId: string;
}

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

const AdminEvents = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<{ titulo: string; descricao: string; data: string; tipo: "gira" | "festa" | "curso" }>({ titulo: '', descricao: '', data: '', tipo: 'gira' });
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setFetchError('Usuário não encontrado. Faça login novamente.');
      setLoading(false);
      return;
    }
    const user = JSON.parse(userStr);
    const terreiroId = user.terreiroId;
    if (!terreiroId) {
      setFetchError('ID do terreiro não encontrado no usuário.');
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/eventos?terreiroId=${terreiroId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar eventos');
        return res.json();
      })
      .then(data => {
        console.log('Eventos carregados:', data);
        // Se não vier array, ou vier vazio, use mock para debug visual
        if (!Array.isArray(data) || !data.length) {
          setEvents([
            { id: '1', titulo: 'Evento Teste', descricao: 'Descrição teste', data: new Date().toISOString(), tipo: 'gira', terreiroId },
            { id: '2', titulo: 'Festa de Oxum', descricao: 'Festa tradicional', data: new Date().toISOString(), tipo: 'festa', terreiroId }
          ]);
        } else {
          setEvents(data);
        }
        setLoading(false);
      })
      .catch(err => {
        setFetchError('Erro ao carregar eventos. (Verifique o backend e o terreiroId)');
        setLoading(false);
        console.error(err);
        // Mostra eventos mockados para debug visual
        setEvents([
          { id: '1', titulo: 'Evento Teste', descricao: 'Descrição teste', data: new Date().toISOString(), tipo: 'gira', terreiroId: terreiroId || 'mock' },
          { id: '2', titulo: 'Festa de Oxum', descricao: 'Festa tradicional', data: new Date().toISOString(), tipo: 'festa', terreiroId: terreiroId || 'mock' }
        ]);
      });

    const socket = connectSocket(terreiroId);
    socket.on('eventoCreated', (evento: Event) => setEvents(prev => [...prev, evento]));
    socket.on('eventoUpdated', (evento: Event) => setEvents(prev => prev.map(e => e.id === evento.id ? evento : e)));
    socket.on('eventoDeleted', ({ id }: { id: string }) => setEvents(prev => prev.filter(e => e.id !== id)));
    return () => {
      socket.off('eventoCreated');
      socket.off('eventoUpdated');
      socket.off('eventoDeleted');
      disconnectSocket();
    };
  }, []);

  const handleCreate = async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const terreiroId = user.terreiroId;
    if (!form.titulo || !form.descricao || !form.data || !terreiroId) return;
    const res = await fetch(`${API_URL}/eventos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ ...form, terreiroId })
    });
    if (res.ok) {
      toast({ title: 'Evento criado com sucesso!' });
      setDialogOpen(false);
      setForm({ titulo: '', descricao: '', data: '', tipo: 'gira' });
    } else {
      toast({ title: 'Erro ao criar evento', variant: 'destructive' });
    }
  };

  const handleEdit = async () => {
    if (!editEvent) return;
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const terreiroId = user.terreiroId;
    const res = await fetch(`${API_URL}/eventos/${editEvent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ ...form, terreiroId })
    });
    if (res.ok) {
      toast({ title: 'Evento atualizado com sucesso!' });
      setDialogOpen(false);
      setEditEvent(null);
      setForm({ titulo: '', descricao: '', data: '', tipo: 'gira' });
    } else {
      toast({ title: 'Erro ao atualizar evento', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    const terreiroId = user.terreiroId;
    const res = await fetch(`${API_URL}/eventos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ terreiroId })
    });
    if (res.ok) {
      toast({ title: 'Evento removido com sucesso!' });
    } else {
      toast({ title: 'Erro ao remover evento', variant: 'destructive' });
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando eventos...</div>;
  if (fetchError) return <div className="p-8 text-center text-red-600">{fetchError}</div>;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Eventos do Terreiro</h1>
        <Button onClick={() => setDialogOpen(true)}><PlusCircle className="mr-2" />Novo Evento</Button>
      </div>
      {events.length === 0 ? (
        <div className="text-center text-gray-500">Nenhum evento cadastrado.</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {events.map(event => (
            <Card key={event.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="text-primary" />
                <span className="font-bold">{event.titulo}</span>
              </div>
              <div className="text-muted-foreground text-sm mb-2">{event.descricao}</div>
              <div className="text-xs text-gray-500 mb-2">Data: {new Date(event.data).toLocaleDateString('pt-BR')}</div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => { setEditEvent(event); setForm({ titulo: event.titulo, descricao: event.descricao, data: event.data, tipo: event.tipo }); setDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(event.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editEvent ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
            <DialogDescription>Preencha os dados do evento</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea id="descricao" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
            <Label htmlFor="data">Data</Label>
            <Input id="data" type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} />
            <Label htmlFor="tipo">Tipo</Label>
            <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v as "gira" | "festa" | "curso" }))}>
              <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="gira">Gira</SelectItem>
                <SelectItem value="festa">Festa</SelectItem>
                <SelectItem value="curso">Curso</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={editEvent ? handleEdit : handleCreate}>{editEvent ? 'Salvar' : 'Criar'}</Button>
            <Button variant="secondary" onClick={() => { setDialogOpen(false); setEditEvent(null); setForm({ titulo: '', descricao: '', data: '', tipo: 'gira' }); }}>Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEvents;
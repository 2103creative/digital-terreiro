import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, User as UserIcon, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AdminLayout from "@/components/AdminLayout";
import { getAllUsers, isAdmin, isAuthenticated, User } from "@/lib/authService";
import { connectSocket, disconnectSocket } from "@/lib/socket";

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se o usuário está autenticado e é admin
    if (!isAuthenticated()) {
      navigate("/login");
      toast({
        title: "Acesso negado",
        description: "Por favor, faça login para acessar esta página",
        variant: "destructive",
      });
      return;
    }

    if (!isAdmin()) {
      navigate("/dashboard");
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta área",
        variant: "destructive",
      });
      return;
    }

    // Carregar usuários
    loadUsers();

    // Real-time updates
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const terreiroId = user.terreiroId;
      if (terreiroId) {
        const socket = connectSocket(terreiroId);
        socket.on('userCreated', (user: User) => setUsers(prev => [...prev, user]));
        socket.on('userUpdated', (user: User) => setUsers(prev => prev.map(u => u.id === user.id ? user : u)));
        socket.on('userDeleted', ({ id }: { id: string }) => setUsers(prev => prev.filter(u => u.id !== id)));
        return () => {
          socket.off('userCreated');
          socket.off('userUpdated');
          socket.off('userDeleted');
          disconnectSocket();
        };
      }
    }

    // Detectar tamanho da tela para responsividade
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate, toast]);

  async function loadUsers() {
    setLoading(true);
    const users = await getAllUsers();
    setUsers(users);
    setLoading(false);
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <Badge className="bg-green-500">Ativo</Badge>
      : <Badge variant="secondary">Inativo</Badge>;
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-blue-500">Admin</Badge>;
      case "user":
        return <Badge variant="outline">Usuário</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const handleEdit = (userId: string) => {
    navigate(`/admin/usuarios/editar/${userId}`);
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (userToDelete) {
      // Em um app real, seria uma chamada API para excluir o usuário
      setUsers(users.filter(user => user.id !== userToDelete));
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido com sucesso",
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleAddUser = () => {
    navigate("/admin/usuarios/novo");
  };

  return (
    <AdminLayout pageTitle="Usuários" pageDescription="Gerencie os usuários do sistema.">
      <div className="flex justify-between items-center mb-6">
        <Button className="h-8 text-xs px-3 bg-black hover:bg-gray-900 text-white flex items-center gap-1" onClick={handleAddUser}>
          <span className="text-lg leading-none">+</span> Adicionar
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 max-w-5xl">
          {users.map(user => (
            <Card
              key={user.id}
              className="bg-white border border-gray-100 rounded-[12px] aspect-square hover:shadow-sm cursor-pointer transition-shadow w-[95px] h-[95px]"
              onClick={() => handleEdit(user.id)}
            >
              <div className="flex flex-col h-full p-2 relative">
                {/* Ícone de usuário no canto superior esquerdo */}
                <div className="absolute top-2 left-2">
                  <UserIcon className="h-4 w-4 text-primary" />
                </div>
                {/* Nome do usuário centralizado */}
                <div className="flex-1 flex items-center justify-center">
                  <h3 className="text-[11px] font-medium text-gray-900 text-center line-clamp-2">{user.name}</h3>
                </div>
                {/* Link de editar no canto inferior esquerdo */}
                <div className="absolute bottom-2 left-2 flex items-center text-[10px] text-blue-600"
                  onClick={e => { e.stopPropagation(); handleEdit(user.id); }}
                  style={{ cursor: 'pointer' }}
                >
                  <span>Editar</span>
                </div>
                {/* Status do usuário no canto inferior direito */}
                <div className="absolute bottom-2 right-2">
                  <div className={`h-2 w-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminUsers;
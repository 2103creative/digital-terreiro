
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
    
    // Detectar tamanho da tela para responsividade
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate, toast]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersList = await getAllUsers();
      setUsers(usersList);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
    <AdminLayout pageTitle="Gerenciar Usuários">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Usuários do Sistema</h1>
        <Button onClick={handleAddUser}>
          <UserPlus className="h-4 w-4 mr-2" />
          Novo Usuário
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {users.map((user) => (
            <Card 
              key={user.id} 
              className="user-card hover:shadow-sm cursor-pointer transition-shadow"
              onClick={() => handleEdit(user.id)}
            >
              <div className="relative flex flex-col h-full items-center justify-center p-2">
                <UserIcon className="h-6 w-6 text-gray-600 mb-2" />
                <h3 className="text-xs font-medium text-gray-900 text-center">{user.name}</h3>
                
                <div className="absolute bottom-2 flex items-center text-[10px] text-blue-600">
                  <span>Editar</span>
                  <Pencil className="h-2.5 w-2.5 ml-0.5" />
                </div>
                
                <div className="absolute bottom-2 right-2">
                  <div className={`h-3 w-3 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
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

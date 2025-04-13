import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import MobileNav from "@/components/MobileNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  PencilIcon, 
  Trash2Icon, 
  UserPlusIcon,
  ArrowUpDown
} from "lucide-react";
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

// Dados mockados para usuários
const MOCK_USERS = [
  { 
    id: 1, 
    name: "Maria Silva", 
    email: "maria@example.com", 
    role: "admin", 
    status: "active", 
    lastLogin: "2025-04-10T15:30:00" 
  },
  { 
    id: 2, 
    name: "João Santos", 
    email: "joao@example.com", 
    role: "member", 
    status: "active", 
    lastLogin: "2025-04-09T10:15:00" 
  },
  { 
    id: 3, 
    name: "Ana Oliveira", 
    email: "ana@example.com", 
    role: "member", 
    status: "inactive", 
    lastLogin: "2025-03-20T08:45:00" 
  },
  { 
    id: 4, 
    name: "Carlos Pereira", 
    email: "carlos@example.com", 
    role: "editor", 
    status: "active", 
    lastLogin: "2025-04-11T09:30:00" 
  },
  { 
    id: 5, 
    name: "Lúcia Fernandes", 
    email: "lucia@example.com", 
    role: "member", 
    status: "pending", 
    lastLogin: null 
  },
];

const AdminUsers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState(MOCK_USERS);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  
  useEffect(() => {
    // Verificar se o usuário está autenticado e é admin
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
      toast({
        title: "Acesso negado",
        description: "Por favor, faça login para acessar esta página",
        variant: "destructive",
      });
      return;
    }

    // Simulação de verificação de admin
    setTimeout(() => {
      const isAdmin = true; // Em um app real, isso seria verificado via API
      if (!isAdmin) {
        navigate("/dashboard");
        toast({
          title: "Acesso restrito",
          description: "Você não tem permissão para acessar esta área",
          variant: "destructive",
        });
      }
    }, 500);
    
    // Detectar tamanho da tela para responsividade
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate, toast]);

  const formatDate = (dateString) => {
    if (!dateString) return "Nunca";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Ativo</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inativo</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-orange-500 border-orange-500">Pendente</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const handleEdit = (userId) => {
    navigate(`/admin/usuarios/editar/${userId}`);
  };

  const handleDeleteClick = (userId) => {
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
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:flex">
      <DesktopSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gerenciar Usuários</h1>
            <Button onClick={handleAddUser}>
              <UserPlusIcon className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>Lista de usuários do sistema</TableCaption>
              <TableHeader>
                <TableRow>
                  {!isMobile && <TableHead className="w-[80px]">ID</TableHead>}
                  <TableHead>Nome</TableHead>
                  {!isMobile && <TableHead>E-mail</TableHead>}
                  <TableHead>
                    <div className="flex items-center">
                      Função
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  {!isMobile && <TableHead>Último Acesso</TableHead>}
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    {!isMobile && <TableCell className="font-medium">{user.id}</TableCell>}
                    <TableCell>{user.name}</TableCell>
                    {!isMobile && <TableCell>{user.email}</TableCell>}
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    {!isMobile && <TableCell>{formatDate(user.lastLogin)}</TableCell>}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(user.id)}>
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(user.id)}>
                          <Trash2Icon className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
      
      <MobileNav />
      
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
    </div>
  );
};

export default AdminUsers; 
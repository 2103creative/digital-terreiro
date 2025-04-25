import { useState, useEffect } from "react";
import { Users, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/AdminLayout";
import { getAllUsers, isAdmin, isAuthenticated, User } from "@/lib/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminUsersView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
    // eslint-disable-next-line
  }, [navigate, toast]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersList = await getAllUsers();
      setUsers(usersList);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusDotColor = (status: boolean) => {
    if (status) {
      return 'bg-green-500';
    } else {
      return 'bg-red-500';
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold mt-8 mb-1">Usuários</h1>
        <p className="text-gray-600 mb-6">Visualize os usuários do sistema e suas informações espirituais.</p>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {users.map((user) => (
              <div key={user.id} className="bg-white border rounded-xl p-5 shadow-sm flex flex-col h-full justify-between min-h-[240px]">
                <div className="flex flex-row items-start gap-4 mb-6">
                  <div className="relative mt-1">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-20 h-20 rounded-full border object-cover bg-gray-100"
                      onError={e => (e.currentTarget.src = "/placeholder.svg")}
                    />
                    {/* Status Dot */}
                    <span
                      className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-white ${getStatusDotColor(user.isActive)}`}
                    />
                  </div>
                  <div className="flex flex-col justify-center flex-1 mt-6">
                    <span className="font-bold text-base leading-tight block">{user.name || 'Nome não informado'}</span>
                    <span className="text-xs text-gray-500 block">{user.email || 'Email não informado'}</span>
                    <span className="text-xs text-gray-700 block">{user.birthdate || 'Aniversário não informado'}</span>
                    <span className="text-[15px] text-gray-700 font-semibold mt-2 text-left">{user.role === 'admin' ? 'Admin' : 'User'}</span>
                    <div className="flex flex-row gap-8 mt-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-gray-500">Orixá Regente</span>
                        <span className="text-sm text-gray-900">{user.orixa || 'Não definido'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-gray-500">Data de Batismo</span>
                        <span className="text-sm text-gray-900">{user.batismoDate || 'Não informado'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-center gap-10 mb-2">
                  <div className="flex flex-col items-center">
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsersView;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserFormProps {
  userId?: number; // Se fornecido, estamos editando um usuário
  onComplete?: () => void;
}

const UserForm = ({ userId, onComplete }: UserFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!userId;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthdate: "",
    whatsapp: "",
    orixa: "Não definido",
    batismoDate: "",
    mataObrigacao: [],
    santoObrigacao: "",
    status: "active",
    role: "member",
    avatar: "/placeholder.svg"
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      
      // Em um app real, isso seria uma requisição para obter os dados do usuário
      // Aqui estamos simulando com dados mockados
      setTimeout(() => {
        const mockUsers = [
          { 
            id: 1, 
            name: "Maria Silva", 
            email: "maria@example.com", 
            birthdate: "1990-05-15",
            whatsapp: "11999887766",
            orixa: "Xangô",
            batismoDate: "2018-03-10",
            mataObrigacao: ["Oxóssi", "Ogum"],
            santoObrigacao: "7 anos",
            role: "admin", 
            status: "active",
            avatar: "/placeholder.svg"
          },
          { 
            id: 2, 
            name: "João Santos", 
            email: "joao@example.com", 
            birthdate: "1985-10-20",
            whatsapp: "11988776655",
            orixa: "Oxóssi",
            batismoDate: "2019-06-21",
            mataObrigacao: ["Oxóssi"],
            santoObrigacao: "3 anos",
            role: "member", 
            status: "active",
            avatar: "/placeholder.svg"
          }
        ];
        
        const user = mockUsers.find(user => user.id === userId);
        if (user) {
          setFormData({
            ...formData,
            ...user
          });
          if (user.avatar) {
            setImagePreview(user.avatar);
          }
        }
        
        setIsLoading(false);
      }, 800);
    }
  }, [userId, isEditMode]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };
  
  const handleMataChange = (linha: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        mataObrigacao: [...formData.mataObrigacao, linha]
      });
    } else {
      setFormData({
        ...formData,
        mataObrigacao: formData.mataObrigacao.filter(item => item !== linha)
      });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Em um app real, você enviaria o arquivo para o servidor
      // Aqui, estamos apenas criando uma URL temporária para exibição
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setFormData({
        ...formData,
        avatar: imageUrl
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Em um app real, isso seria uma requisição para salvar o usuário
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: isEditMode ? "Usuário atualizado" : "Usuário criado",
        description: isEditMode 
          ? `As informações de ${formData.name} foram atualizadas` 
          : `${formData.name} foi adicionado(a) com sucesso`,
      });
      
      if (onComplete) {
        onComplete();
      } else {
        navigate("/admin/usuarios");
      }
    }, 1000);
  };
  
  const orixaOptions = [
    "Não definido", "Bará", "Ogum", "Iansã", "Xangô", "Odè", "Otim", 
    "Ossanha", "Obá", "Xapanã", "Oxum", "Iemanjá", "Oxalá"
  ];
  
  const linhasDeMata = [
    "Oxóssi", "Ogum", "Xangô", "Oxum", "Iansã", "Iemanjá", "Obaluaiê"
  ];
  
  const roleOptions = [
    { value: "admin", label: "Administrador" },
    { value: "editor", label: "Editor" },
    { value: "member", label: "Membro" }
  ];
  
  const statusOptions = [
    { value: "active", label: "Ativo" },
    { value: "inactive", label: "Inativo" },
    { value: "pending", label: "Pendente" }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate("/admin/usuarios")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">
          {isEditMode ? `Editar Usuário: ${formData.name}` : "Adicionar Novo Usuário"}
        </h1>
      </div>
      
      {isLoading && isEditMode ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-medium mb-4">Foto de Perfil</h2>
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={imagePreview || formData.avatar} alt={formData.name} />
                  <AvatarFallback>{formData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="relative">
                  <Input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Label
                    htmlFor="avatar"
                    className="flex items-center gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    <Upload className="h-4 w-4" />
                    Alterar foto
                  </Label>
                </div>
              </div>
              
              <div className="space-y-2 flex-1">
                <p className="text-sm text-muted-foreground">
                  Adicione uma foto de perfil para o usuário. Formatos aceitos: JPG, PNG ou GIF. 
                  Tamanho máximo recomendado: 2MB.
                </p>
                <p className="text-sm text-muted-foreground">
                  A foto será usada na página de perfil do usuário e em listagens do sistema.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-medium mb-4">Informações Pessoais</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthdate">Data de nascimento *</Label>
                <Input
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-medium mb-4">Informações Espirituais</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orixa">Orixá regente</Label>
                <Select 
                  value={formData.orixa} 
                  onValueChange={(value) => handleSelectChange("orixa", value)}
                >
                  <SelectTrigger id="orixa">
                    <SelectValue placeholder="Selecione o Orixá" />
                  </SelectTrigger>
                  <SelectContent>
                    {orixaOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="batismoDate">Data de batismo</Label>
                <Input
                  id="batismoDate"
                  name="batismoDate"
                  type="date"
                  value={formData.batismoDate}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label>Obrigação de Mata (Mesas Apresentadas)</Label>
                <div className="grid gap-2 md:grid-cols-3 mt-2">
                  {linhasDeMata.map((linha) => (
                    <div key={linha} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`linha-${linha}`} 
                        checked={formData.mataObrigacao.includes(linha)}
                        onCheckedChange={(checked) => 
                          handleMataChange(linha, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`linha-${linha}`}
                        className="font-normal"
                      >
                        {linha}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="santoObrigacao">Obrigação de Santo</Label>
                <Input
                  id="santoObrigacao"
                  name="santoObrigacao"
                  value={formData.santoObrigacao}
                  onChange={handleChange}
                  placeholder="Ex: 3 anos"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-medium mb-4">Configurações de Conta</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleSelectChange("role", value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/admin/usuarios")}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            {isEditMode && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => {
                  // Em um app real, isso seria uma chamada API para excluir o usuário
                  toast({
                    title: "Usuário excluído",
                    description: `${formData.name} foi removido com sucesso`,
                  });
                  navigate("/admin/usuarios");
                }}
                disabled={isLoading}
              >
                Excluir
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Salvando...
                </>
              ) : (
                isEditMode ? "Salvar alterações" : "Criar usuário"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserForm;
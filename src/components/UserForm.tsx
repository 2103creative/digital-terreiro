import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

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
    avatar: "/placeholder.svg",
    allowedPages: [],
    editPages: []
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
            batismoDate: "2010-01-01",
            mataObrigacao: ["Oxóssi", "Ogum"],
            santoObrigacao: "3 anos",
            status: "active",
            role: "admin", 
            avatar: "/avatar1.jpg",
            allowedPages: ["/dashboard", "/frentes"],
            editPages: ["/dashboard", "/frentes"]
          },
          { 
            id: 2, 
            name: "João Santos", 
            email: "joao@example.com", 
            birthdate: "1985-10-20",
            whatsapp: "11988776655",
            orixa: "Oxóssi",
            batismoDate: "2015-06-01",
            mataObrigacao: ["Xangô", "Iansã"],
            santoObrigacao: "5 anos",
            status: "active",
            role: "member", 
            avatar: "/avatar2.jpg",
            allowedPages: ["/favoritos", "/events"],
            editPages: ["/favoritos", "/events"]
          }
        ];
        
        const user = mockUsers.find(user => user.id === userId);
        if (user) {
          setFormData({
            ...formData,
            ...user
          });
          setImagePreview(user.avatar);
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
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
      setFormData({
        ...formData,
        avatar: URL.createObjectURL(e.target.files[0])
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
  
  // Lista de páginas disponíveis para permissão de visualização
  const pageOptions = [
    { value: "/dashboard", label: "Dashboard" },
    { value: "/frentes", label: "Frentes" },
    { value: "/ervas", label: "Ervas" },
    { value: "/lista-compras", label: "Compras" },
    { value: "/events", label: "Eventos" },
    { value: "/reading", label: "Leitura" },
    { value: "/limpeza", label: "Limpeza" },
    { value: "/messages", label: "Mensagens" },
    { value: "/chat", label: "Bate Papo" },
    { value: "/adminusuarios", label: "Usuários" }
  ];

  const handleAllowedPagesChange = (page: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        allowedPages: [...formData.allowedPages, page]
      });
    } else {
      setFormData({
        ...formData,
        allowedPages: formData.allowedPages.filter(p => p !== page)
      });
    }
  };
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 h-8 w-8"
          onClick={() => navigate("/admin/usuarios")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">
          {isEditMode ? `Editar Usuário: ${formData.name}` : "Adicionar Novo Usuário"}
        </h1>
      </div>
      {isLoading && isEditMode ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto de perfil */}
          <div className="rounded-lg border p-4 md:p-6 flex items-center gap-6 bg-white">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-24 w-24 md:h-28 md:w-28">
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
                  className="flex items-center gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md text-xs font-medium"
                >
                  <Upload className="h-4 w-4" />
                  Alterar foto
                </Label>
              </div>
            </div>
            <div className="flex-1 space-y-1 text-xs text-muted-foreground">
              <div>Adicione uma foto de perfil para o usuário. Formatos aceitos: JPG, PNG ou GIF. Tamanho máximo recomendado: 2MB.</div>
              <div>A foto será usada na página de perfil do usuário e em listagens do sistema.</div>
            </div>
          </div>

          {/* Informações pessoais */}
          <div className="rounded-lg border p-4 md:p-6 bg-white">
            <h2 className="text-base font-medium mb-3">Informações Pessoais</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs">Nome completo *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="h-8 text-xs px-2" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="birthdate" className="text-xs">Data de nascimento *</Label>
                <Input id="birthdate" name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} required className="h-8 text-xs px-2" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs">Email *</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="h-8 text-xs px-2" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="whatsapp" className="text-xs">WhatsApp</Label>
                <Input id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="h-8 text-xs px-2" placeholder="(11) 99999-9999" />
              </div>
            </div>
          </div>

          {/* Informações espirituais */}
          <div className="rounded-lg border p-4 md:p-6 bg-white">
            <h2 className="text-base font-medium mb-3">Informações Espirituais</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="orixa" className="text-xs">Orixá regente</Label>
                <Select value={formData.orixa} onValueChange={v => handleSelectChange("orixa", v)}>
                  <SelectTrigger id="orixa" className="h-8 text-xs px-2">
                    <SelectValue placeholder="Selecione o Orixá" />
                  </SelectTrigger>
                  <SelectContent>
                    {orixaOptions.map(option => (
                      <SelectItem key={option} value={option} className="text-xs">{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="batismoDate" className="text-xs">Data de batismo</Label>
                <Input id="batismoDate" name="batismoDate" type="date" value={formData.batismoDate} onChange={handleChange} className="h-8 text-xs px-2" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label className="text-xs">Obrigação de Mata (Mesas Apresentadas)</Label>
                <div className="grid gap-2 md:grid-cols-3 mt-1">
                  {linhasDeMata.map(linha => (
                    <div key={linha} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`linha-${linha}`} 
                        checked={formData.mataObrigacao.includes(linha)}
                        onCheckedChange={checked => handleMataChange(linha, checked as boolean)}
                      />
                      <Label htmlFor={`linha-${linha}`} className="font-normal text-xs">{linha}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="santoObrigacao" className="text-xs">Obrigação de Santo</Label>
                <Input id="santoObrigacao" name="santoObrigacao" value={formData.santoObrigacao} onChange={handleChange} className="h-8 text-xs px-2" placeholder="Ex: 3 anos" />
              </div>
            </div>
          </div>

          {/* Configurações de Conta */}
          <div className="rounded-lg border p-4 md:p-6 bg-white">
            <h2 className="text-base font-medium mb-3">Configurações de Conta</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="role" className="text-xs">Função</Label>
                <Select value={formData.role} onValueChange={v => handleSelectChange("role", v)}>
                  <SelectTrigger id="role" className="h-8 text-xs px-2">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map(option => (
                      <SelectItem key={option.value} value={option.value} className="text-xs">{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="status" className="text-xs">Status</Label>
                <Select value={formData.status} onValueChange={v => handleSelectChange("status", v)}>
                  <SelectTrigger id="status" className="h-8 text-xs px-2">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value} className="text-xs">{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Permissões de Visualização */}
          <div className="rounded-lg border p-4 md:p-6 bg-white">
            <h2 className="text-base font-medium mb-3">Permissões de Visualização</h2>
            <div className="grid gap-2 md:grid-cols-3">
              {pageOptions.map(page => (
                <div key={page.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`page-${page.value}`}
                    checked={formData.allowedPages.includes(page.value)}
                    onCheckedChange={checked => handleAllowedPagesChange(page.value, checked as boolean)}
                  />
                  <Label htmlFor={`page-${page.value}`} className="font-normal text-xs">{page.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Permissões de Edição */}
          {["admin","editor"].includes(formData.role) && (
            <div className="rounded-lg border p-4 md:p-6 bg-white">
              <h2 className="text-base font-medium mb-3">Permissões de Edição</h2>
              <div className="grid gap-2 md:grid-cols-3">
                {pageOptions.map(page => (
                  <div key={page.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-page-${page.value}`}
                      checked={formData.editPages?.includes(page.value) || false}
                      onCheckedChange={checked => {
                        setFormData({
                          ...formData,
                          editPages: checked
                            ? [...(formData.editPages || []), page.value]
                            : (formData.editPages || []).filter(p => p !== page.value)
                        });
                      }}
                    />
                    <Label htmlFor={`edit-page-${page.value}`} className="font-normal text-xs">{page.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/usuarios")}
              className="h-8 text-xs px-3">Cancelar</Button>
            {isEditMode && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => {
                  toast({
                    title: "Usuário excluído",
                    description: `${formData.name} foi removido com sucesso`,
                  });
                  navigate("/admin/usuarios");
                }}
                className="h-8 text-xs px-3"
              >Excluir</Button>
            )}
            <Button type="submit" disabled={isLoading} className="h-8 text-xs px-4 flex items-center gap-1">
              <span className="text-lg leading-none">+</span> Adicionar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserForm;
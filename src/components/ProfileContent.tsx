import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const ProfileContent = () => {
  // Get user from localStorage (in a real app, this would come from a proper auth system)
  const userString = localStorage.getItem("user");
  const defaultUser = { 
    name: "", 
    email: "", 
    birthdate: "", 
    orixa: "Não definido", 
    avatar: "/placeholder.svg",
    iniciationDate: "15/03/2020",
    templeAffiliation: "Terreiro Pai José de Angola"
  };
  const initialUser = userString ? JSON.parse(userString) : defaultUser;
  
  const [formData, setFormData] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    birthdate: initialUser.birthdate || "",
    orixa: initialUser.orixa || "Não definido",
    iniciationDate: initialUser.iniciationDate || "",
    templeAffiliation: initialUser.templeAffiliation || "Terreiro Pai José de Angola"
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrixaChange = (value: string) => {
    setFormData({
      ...formData,
      orixa: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update user in localStorage
    const updatedUser = { ...initialUser, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    setIsEditing(false);
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso",
    });
  };

  const orixaOptions = [
    "Não definido", "Bará", "Ogum", "Iansã", "Xangô", "Odè", "Otim", 
    "Ossanha", "Obá", "Xapanã", "Oxum", "Iemanjá", "Oxalá"
  ];

  return (
    <div className="space-y-4 pb-16">
      <h1 className="text-xl font-bold mb-6">Perfil</h1>
      
      {!isEditing ? (
        <>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={initialUser.avatar} alt={formData.name} />
                <AvatarFallback>{formData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="font-semibold mb-2">Informações Pessoais</h2>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome Completo</p>
                    <p>{formData.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p>{formData.birthdate ? new Date(formData.birthdate).toLocaleDateString('pt-BR') : "Não informado"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{formData.email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="font-semibold mb-2">Informações Espirituais</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Orixá Regente</p>
                  <p>{formData.orixa}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Data de Iniciação</p>
                  <p>{formData.iniciationDate || "Não informado"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Casa de Umbanda</p>
                  <p>{formData.templeAffiliation}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={initialUser.avatar} alt={formData.name} />
              <AvatarFallback>{formData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="font-semibold mb-2">Informações Pessoais</h2>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birthdate">Data de nascimento</Label>
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="font-semibold mb-2">Informações Espirituais</h2>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="orixa">Orixá regente</Label>
                <Select 
                  value={formData.orixa} 
                  onValueChange={handleOrixaChange}
                >
                  <SelectTrigger id="orixa">
                    <SelectValue placeholder="Selecione seu Orixá" />
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
                <Label htmlFor="iniciationDate">Data de iniciação</Label>
                <Input
                  id="iniciationDate"
                  name="iniciationDate"
                  value={formData.iniciationDate}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="templeAffiliation">Casa de Umbanda</Label>
                <Input
                  id="templeAffiliation"
                  name="templeAffiliation"
                  value={formData.templeAffiliation}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 pt-2">
            <Button 
              type="submit" 
              className="flex-1"
            >
              Salvar
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileContent;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
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
    iniciationDate: ""
  };
  const initialUser = userString ? JSON.parse(userString) : defaultUser;
  
  const [formData, setFormData] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    birthdate: initialUser.birthdate || "",
    orixa: initialUser.orixa || "Não definido",
    iniciationDate: initialUser.iniciationDate || "",
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  // Function to get an icon for the Orixa
  const getOrixaIcon = (orixa: string) => {
    const orixaMap: Record<string, string> = {
      "Bará": "🔥",
      "Ogum": "⚔️",
      "Iansã": "🌪️",
      "Xangô": "⚡",
      "Odè": "🏹",
      "Otim": "🌙",
      "Ossanha": "🌿",
      "Obá": "🛡️",
      "Xapanã": "🧙‍♂️",
      "Oxum": "💧",
      "Iemanjá": "🌊",
      "Oxalá": "✨",
      "Não definido": "❓"
    };
    
    return orixaMap[orixa] || "❓";
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col items-center text-center mb-6">
        <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
          <AvatarImage src={initialUser.avatar} alt={formData.name} />
          <AvatarFallback>{formData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        {!isEditing ? (
          <>
            <h2 className="text-2xl font-semibold">{formData.name}</h2>
            <p className="text-muted-foreground">{formData.email}</p>
            
            <div className="mt-6 flex gap-4">
              <Button 
                onClick={() => setIsEditing(true)}
                className="w-full"
              >
                Editar Perfil
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md mt-4 space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2 text-left">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2 text-left">
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
            
            <div className="space-y-2 text-left">
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
            
            <div className="space-y-2 text-left">
              <Label htmlFor="iniciationDate">Data de iniciação (opcional)</Label>
              <Input
                id="iniciationDate"
                name="iniciationDate"
                type="date"
                value={formData.iniciationDate}
                onChange={handleChange}
              />
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

      {!isEditing && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Informações Espirituais</h3>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                {getOrixaIcon(formData.orixa)}
                Orixá regente: {formData.orixa}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formData.iniciationDate 
                      ? `Data de iniciação: ${new Date(formData.iniciationDate).toLocaleDateString('pt-BR')}`
                      : "Data de iniciação não informada"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Centro Religioso: Ylê Axé Xangô & Oxum</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfileContent;

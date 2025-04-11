
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [orixa, setOrixa] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration for demo
    setTimeout(() => {
      if (name && email && password && birthdate) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify({
          name: name,
          email: email,
          birthdate: birthdate,
          orixa: orixa || "Não definido",
          avatar: "/placeholder.svg"
        }));
        navigate("/dashboard");
        toast({
          title: "Cadastro realizado com sucesso",
          description: "Bem-vindo ao Ylê Axé Xangô & Oxum",
        });
      } else {
        toast({
          title: "Erro no cadastro",
          description: "Por favor, preencha todos os campos obrigatórios",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const orixaOptions = [
    "Bará", "Ogum", "Iansã", "Xangô", "Odè", "Otim", 
    "Ossanha", "Obá", "Xapanã", "Oxum", "Iemanjá", "Oxalá"
  ];

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-1">Ylê Axé Xangô & Oxum</h1>
        <p className="text-sm text-muted-foreground mb-6">Seu terreiro na palma da mão</p>
        
        <h2 className="text-xl font-bold">Cadastre-se</h2>
        <p className="text-muted-foreground">Crie sua conta espiritual</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            type="text"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birthdate">Data de nascimento</Label>
          <Input
            id="birthdate"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="orixa">Orixá regente (opcional)</Label>
          <Select value={orixa} onValueChange={setOrixa}>
            <SelectTrigger id="orixa">
              <SelectValue placeholder="Selecione seu Orixá (opcional)" />
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
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto"
            onClick={() => navigate("/login")}
          >
            Entrar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;

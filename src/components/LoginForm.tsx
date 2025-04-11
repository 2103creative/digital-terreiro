
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication for demo
    setTimeout(() => {
      // In a real app, we'd check credentials with a backend
      if (email && password) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify({
          name: "Filho de Xangô",
          email: email,
          avatar: "/placeholder.svg"
        }));
        navigate("/dashboard");
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta ao Ylê Axé Xangô & Oxum",
        });
      } else {
        toast({
          title: "Erro no login",
          description: "Por favor, verifique seu email e senha",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm animate-slide-up">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-1">Ylê Axé Xangô & Oxum</h1>
        <p className="text-sm text-muted-foreground mb-6">Seu terreiro na palma da mão</p>
        
        <h2 className="text-xl font-bold">Entrar</h2>
        <p className="text-muted-foreground">Acesse sua conta espiritual</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs"
              onClick={() => toast({
                title: "Recuperação de senha",
                description: "Função em desenvolvimento. Em breve!",
              })}
            >
              Esqueceu a senha?
            </Button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe}
            onCheckedChange={(checked) => 
              setRememberMe(checked as boolean)
            }
          />
          <Label htmlFor="remember" className="text-sm">Lembrar-me</Label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto"
            onClick={() => navigate("/register")}
          >
            Cadastre-se
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

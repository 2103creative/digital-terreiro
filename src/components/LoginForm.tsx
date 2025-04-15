import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setLoginError("Credenciais inválidas. Tente novamente.");
      }
    } catch (error) {
      setLoginError("Ocorreu um erro. Tente novamente mais tarde.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-card rounded-lg shadow-sm animate-slide-up">
      <CardContent>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-1">Ylê Axé Xangô & Oxum</h1>
          <p className="text-sm text-muted-foreground mb-6">Seu terreiro na palma da mão</p>
          
          <h2 className="text-xl font-bold">Entrar</h2>
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
                type="button"
                onClick={() => navigate("/recuperar-senha")}
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
          
          {loginError && (
            <div className="text-sm text-red-500 text-center mt-4">
              {loginError}
            </div>
          )}
          
          <div className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto"
              type="button"
              onClick={() => navigate("/register")}
            >
              Cadastre-se
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;

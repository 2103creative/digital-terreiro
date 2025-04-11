
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, BookOpen, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-md mx-auto mt-8 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-center mb-2">Bem-vindo ao Ylê Axé Xangô & Oxum</h1>
          <p className="text-muted-foreground text-center mb-8">Sua jornada espiritual começa aqui</p>
          
          <div className="w-full space-y-4 mb-8">
            <Card className="border hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Comunidade Espiritual</h3>
                  <p className="text-sm text-muted-foreground">Conecte-se com outros praticantes</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-md">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Conhecimento Sagrado</h3>
                  <p className="text-sm text-muted-foreground">Acesse ensinamentos e práticas</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-md">
                  <Compass className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Guia Espiritual</h3>
                  <p className="text-sm text-muted-foreground">Encontre seu caminho na umbanda</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full space-y-3">
            <Button 
              className="w-full bg-black text-white hover:bg-gray-800" 
              onClick={() => navigate("/register")}
            >
              Começar Agora
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate("/login")}
            >
              Já tenho uma conta
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            <Link to="/sobre" className="underline underline-offset-2">Fale Conosco</Link>
          </p>
        </div>
      </main>
      
      <footer className="py-4 mt-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Ylê Axé Xangô & Oxum &copy; {new Date().getFullYear()}</p>
          <p>Seu terreiro na palma da mão</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

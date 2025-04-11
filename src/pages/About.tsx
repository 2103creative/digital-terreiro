
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import MobileNav from "@/components/MobileNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useToast } from "@/hooks/use-toast";
import { Heart, Users, Mail, Phone, MapPin } from "lucide-react";

const About = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/login");
      toast({
        title: "Acesso negado",
        description: "Por favor, faça login para acessar esta página",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0 md:flex">
      <DesktopSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="container mx-auto px-4 py-6 md:py-8 max-w-3xl">
          <div className="mb-8">
            <div className="relative h-48 md:h-64 w-full mb-4 rounded-xl overflow-hidden">
              <img 
                src="/lovable-uploads/458caf45-805c-4f1d-a605-86b417e8b369.png" 
                alt="Ylê Umbanda" 
                className="w-full h-full object-cover brightness-75"
              />
              <h1 className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white">
                Sobre Ylê Umbanda
              </h1>
            </div>
          </div>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3">Nossa Missão</h2>
            <p className="text-muted-foreground">
              Conectar e fortalecer a comunidade Umbanda através da tecnologia, preservando nossa rica 
              tradição espiritual enquanto abraçamos a modernidade.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Respeito</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Honramos todas as formas de expressão espiritual
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Comunidade</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Unidos em nossa jornada espiritual
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-4">Contato</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>contato@yleumbanda.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </section>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default About;

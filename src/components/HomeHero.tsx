
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HomeHero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 font-quicksand">
        Ylê Axé Xangô & Oxum
      </h1>
      <p className="text-lg text-muted-foreground mb-8 font-quicksand">
        Seu terreiro na palma da mão
      </p>
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 font-quicksand">
          Sua jornada espiritual começa aqui
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { title: "Comunidade Espiritual", icon: "🙏" },
            { title: "Conhecimento Sagrado", icon: "📚" },
            { title: "Guia Espiritual", icon: "✨" },
            { title: "Eventos", icon: "📅" },
            { title: "Login/Cadastro", icon: "👤" },
          ].map((card) => (
            <div 
              key={card.title}
              className="bg-card p-4 rounded-lg shadow-sm flex flex-col items-center justify-center card-hover cursor-pointer"
              onClick={() => card.title === "Login/Cadastro" ? navigate("/login") : null}
            >
              <span className="text-2xl mb-2">{card.icon}</span>
              <h3 className="text-sm font-medium font-quicksand">{card.title}</h3>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-quicksand"
            onClick={() => navigate("/login")}
          >
            Entrar
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="font-quicksand"
            onClick={() => navigate("/register")}
          >
            Cadastrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;

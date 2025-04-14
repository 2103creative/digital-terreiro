import { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import MobileNav from "@/components/MobileNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const Favoritos = () => {
  const [favorites, setFavorites] = useState<{ id: string; type: string; title: string; path: string }[]>([]);

  useEffect(() => {
    // Carregar favoritos do localStorage (exemplo)
    try {
      const storedFavorites = localStorage.getItem("yle-axe-favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        // Dados de exemplo para mostrar a interface
        setFavorites([
          { id: "1", type: "evento", title: "Festa de Xangô", path: "/eventos/1" },
          { id: "2", type: "frente", title: "Frente de Desenvolvimento Mediúnico", path: "/frentes/2" },
          { id: "3", type: "leitura", title: "Fundamentos da Umbanda", path: "/leitura/3" }
        ]);
      }
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  }, []);

  const handleRemoveFavorite = (id: string) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);
    
    try {
      localStorage.setItem("yle-axe-favorites", JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Erro ao salvar favoritos:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DesktopSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Meus Favoritos</h1>
            
            {favorites.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {favorites.map((favorite) => (
                  <Card key={favorite.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{favorite.title}</CardTitle>
                          <CardDescription className="capitalize">{favorite.type}</CardDescription>
                        </div>
                        <button 
                          onClick={() => handleRemoveFavorite(favorite.id)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Remover dos favoritos"
                        >
                          <Heart className="h-4 w-4 fill-current" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <a 
                        href={favorite.path} 
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Ver detalhes
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum favorito ainda</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Você ainda não adicionou itens aos favoritos. Explore eventos, frentes e leituras e marque como favorito o que desejar acessar rapidamente.
                </p>
              </div>
            )}
          </div>
        </main>
        
        <MobileNav />
      </div>
    </div>
  );
};

export default Favoritos; 

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeHero from "@/components/HomeHero";

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
    <div className="min-h-screen bg-background">
      <header className="py-4 px-6 border-b">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Ylê Axé Xangô & Oxum</h1>
        </div>
      </header>
      
      <main className="container mx-auto py-6">
        <HomeHero />
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Ylê Axé Xangô & Oxum &copy; {new Date().getFullYear()}</p>
          <p>Seu terreiro na palma da mão</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

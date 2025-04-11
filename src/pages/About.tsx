
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="py-4 px-6 border-b">
        <div className="container mx-auto flex items-center">
          <Link to="/" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Sobre</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Ylê Axé Xangô & Oxum</h2>
            <p className="text-muted-foreground mb-4">
              O Terreiro Ylê Axé Xangô & Oxum é um espaço sagrado dedicado à prática da Umbanda e Nação,
              onde buscamos o desenvolvimento espiritual e a conexão com as forças divinas.
            </p>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold mb-3">Nossa Missão</h3>
            <p className="mb-4">
              Servir como um canal de luz e acolhimento, oferecendo orientação espiritual
              e promovendo os ensinamentos sagrados que unem as tradições afro-brasileiras.
            </p>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold mb-3">Valores</h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Respeito às tradições e à ancestralidade</li>
              <li>Igualdade e inclusão para todos os filhos</li>
              <li>Caridade e assistência espiritual</li>
              <li>Desenvolvimento mediúnico responsável</li>
              <li>Preservação dos conhecimentos sagrados</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-xl font-semibold mb-3">Contato</h3>
            <div className="grid gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Endereço</p>
                    <p className="text-sm text-muted-foreground">
                      Rua dos Orixás, 123 - Jardim Espiritual, São Paulo - SP
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      contato@yleaxexangoeoxum.com.br
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">
                      (11) 98765-4321
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Ylê Axé Xangô & Oxum &copy; {new Date().getFullYear()}</p>
          <Link to="/" className="hover:underline">
            Voltar ao início
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default About;

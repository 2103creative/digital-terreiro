import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import MobileNav from "@/components/MobileNav";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Limpeza = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
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
        
        <main className="container mx-auto px-4 py-6">
          <Card className="bg-white shadow-md mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-center">Lista de limpeza e "Dias D" do terreiro para 2025</CardTitle>
              <p className="text-center text-gray-600 italic">
                "Dias D" Todos participam e segue a cada dois meses
              </p>
            </CardHeader>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Card className="border rounded-md shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-bold text-primary">Janeiro</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-100">
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">11/01</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Karina e Nicole</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">18/01</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Tita e Maicon (Início da Construção)</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex bg-blue-50">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">25/01</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-blue-700">OBRIGAÇÃO DE MATA</span>
                          <div className="text-xs text-blue-600 font-medium mt-0.5">
                            Todos participam
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border rounded-md shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-bold text-primary">Fevereiro</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-100">
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">01/02</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Jeferson e Bruna</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">08/02</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Leno e Carol</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex bg-blue-50">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">15/02</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-blue-700">(Dia D)</span>
                          <div className="text-xs text-blue-600 font-medium mt-0.5">
                            Todos participam
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">22/02</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Stefany e Tita</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">29/02</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Karina e Maicon</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border rounded-md shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-bold text-primary">Março</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-100">
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">01/03</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Camila e Nicole</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">08/03</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Baby e Bruna</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">15/03</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Leno e Stefany</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">22/03</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Tainan e Maicon</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">29/03</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Carol e Nicole</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border rounded-md shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-bold text-primary">Abril</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-100">
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">05/04</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Camila e Baby</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">12/04</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Jeferson e Stefany</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex bg-blue-50">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">19/04</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-blue-700">(Dia D)</span>
                          <div className="text-xs text-blue-600 font-medium mt-0.5">
                            Todos participam
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">26/04</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Tainan e Leno</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border rounded-md shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-bold text-primary">Maio</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-100">
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">03/05</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Karina e Tita</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">10/05</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Carol e Maicon</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">17/05</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Tainan e Jeferson</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">24/05</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Baby e Bruna</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">31/05</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Stefany e Leno</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border rounded-md shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-bold text-primary">Junho</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-100">
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">07/06</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Nicole e Tita</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">14/06</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Carol e Camila</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex bg-blue-50">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">21/06</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-blue-700">(Dia D)</span>
                          <div className="text-xs text-blue-600 font-medium mt-0.5">
                            Todos participam
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">28/06</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Maicon e Stefany</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card className="border rounded-md shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-bold text-primary">Julho</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-100">
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">05/07</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Baby e Bruna</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">12/07</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Leno e Nicole</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">19/07</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Karina e Stefany</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">26/07</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Carol e Maicon</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border rounded-md shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-bold text-primary">Agosto</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-100">
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">02/08</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Camila e Jeferson</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">09/08</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Baby e Leno</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex bg-blue-50">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">16/08</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-blue-700">(Dia D)</span>
                          <div className="text-xs text-blue-600 font-medium mt-0.5">
                            Todos participam
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">23/08</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Tainan e Karina</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">30/08</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Tita e Stefany</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border rounded-md shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-bold text-primary">Setembro</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-100">
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">06/09</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Carol e Maicon</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">13/09</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Camila e Baby</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">20/09</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Jeferson e Tainan</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">27/09</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Nicole e Leno</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border rounded-md shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-bold text-primary">Outubro</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-100">
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">04/10</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Karina e Tita</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">11/10</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Carol e Stefany</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex bg-blue-50">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">18/10</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-blue-700">(Dia D)</span>
                          <div className="text-xs text-blue-600 font-medium mt-0.5">
                            Todos participam
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">25/10</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Camila e Tainan</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border rounded-md shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-bold text-primary">Novembro</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-100">
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">01/11</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Jeferson e Nicole</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">08/11</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Leno e Baby</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">15/11</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Karina e Tainan</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">22/11</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Carol e Camila</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">29/11</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Maicon e Tita</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border rounded-md shadow-sm">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-xl font-bold text-primary">Dezembro</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-gray-100">
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">06/12</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Leno e Jeferson</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">13/12</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Nicole e Bruna</span>
                        </div>
                      </div>
                    </li>
                    <li className="p-3 flex bg-blue-50">
                      <div className="flex items-center space-x-3">
                        <div className="text-center min-w-12">
                          <span className="text-base font-medium">20/12</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-blue-700">(Dia D)</span>
                          <div className="text-xs text-blue-600 font-medium mt-0.5">
                            Todos participam
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card className="mt-8 bg-slate-50">
            <CardHeader>
              <CardTitle>OBSERVAÇÕES:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>• Caso haja necessidade de qualquer motivo para a realização da mesma em dias antecipados ou posteriores, atente-se em comunicar o seu parceiro(a) para não haver discordância.</p>
              <p>• As limpezas serão supervisionadas a cada limpeza, assim verificando se a limpeza teve efetividade.</p>
              <p>• A limpeza do terreiro ocorre mesmo com chuva ou sol. Em dias de chuva a parte externa não precisa ser lavada.</p>
              <p>• A limpeza consiste em lavar o chão, vidros internos e externos, paredes e teto quando necessário, tirar o pó onde houver pó, tirar teias de aranha quando observado, área externa, escadas, banheiro, lavanderia, pias internas e externas, organizar os panos utilizados para a limpeza do dia (lavar, secar, guardar). Retire o lixo para a rua quando houver necessidade. Passar um pano molhado nos corrimãos das escadas, colocar no lixo do banheiro quando trocar, lavar os panos usados na limpeza, lavar os panos de pratos, tapetes e toalhas de rosto.</p>
              <p>• Ao finalizar as tarefas, por favor, salve tudo o que foi utilizado nos seus devidos lugares.</p>
              
              <div className="pt-2">
                <p className="font-semibold">Lembrete: Sempre que levar os panos pra lavar, traga na próxima vez que vier pro Terreiro.</p>
              </div>
              
              <div className="pt-2">
                <p className="font-semibold">Lavar separadamente os panos:</p>
                <p>• Toalhas de rosto com toalhas de rosto.</p>
                <p>• Panos de prato com panos de prato.</p>
                <p>• Tapetes com tapetes.</p>
                <p>• Pano de chão com pano de chão.</p>
              </div>
              
              <p className="pt-2 font-medium">Agradeço a compreensão de todos!</p>
            </CardContent>
          </Card>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Limpeza; 
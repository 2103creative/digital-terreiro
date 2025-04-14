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
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0 md:flex">
      <DesktopSidebar />
      
      <div className="flex-1">
        <DashboardHeader />
        
        <main className="container mx-auto px-4 py-6">
          <div className="bg-white shadow-sm rounded-lg py-4 px-6 mb-6">
            <h1 className="text-xl font-medium text-gray-800 text-center">Lista de limpeza e "Dias D" do terreiro para 2025</h1>
            <p className="text-center text-gray-600 text-sm mt-2">
              "Dias D" Todos participam e segue a cada dois meses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Janeiro</h2>
                </div>
                <div className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">11/01</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Karina e Nicole</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">18/01</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Tita e Maicon (Início da Construção)</span>
                        </td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">25/01</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-blue-700 font-medium">OBRIGAÇÃO DE MATA</span>
                          <div className="text-xs text-blue-600 mt-0.5">
                            Todos participam
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Fevereiro</h2>
                </div>
                <div className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">01/02</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Jeferson e Bruna</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">08/02</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Leno e Carol</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-blue-50">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">15/02</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-blue-700 font-medium">(Dia D)</span>
                          <div className="text-xs text-blue-600 mt-0.5">
                            Todos participam
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">22/02</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Stefany e Tita</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">29/02</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Karina e Maicon</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Março</h2>
                </div>
                <div className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">01/03</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Camila e Nicole</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">08/03</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Baby e Bruna</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">15/03</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Leno e Stefany</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">22/03</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Tainan e Maicon</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">29/03</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Carol e Nicole</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Abril</h2>
                </div>
                <div className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">05/04</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Camila e Baby</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">12/04</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Jeferson e Stefany</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-blue-50">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">19/04</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-blue-700 font-medium">(Dia D)</span>
                          <div className="text-xs text-blue-600 mt-0.5">
                            Todos participam
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">26/04</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Tainan e Leno</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Maio</h2>
                </div>
                <div className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">03/05</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Karina e Tita</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">10/05</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Carol e Maicon</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">17/05</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Tainan e Jeferson</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">24/05</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Baby e Bruna</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">31/05</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Stefany e Leno</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Junho</h2>
                </div>
                <div className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">07/06</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Nicole e Tita</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">14/06</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Carol e Camila</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-blue-50">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">21/06</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-blue-700 font-medium">(Dia D)</span>
                          <div className="text-xs text-blue-600 mt-0.5">
                            Todos participam
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">28/06</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Maicon e Stefany</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Julho</h2>
                </div>
                <div className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">05/07</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Baby e Bruna</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">12/07</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Leno e Nicole</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">19/07</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Karina e Stefany</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">26/07</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Carol e Maicon</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Agosto</h2>
                </div>
                <div className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">02/08</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Camila e Jeferson</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">09/08</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Baby e Leno</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-blue-50">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">16/08</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-blue-700 font-medium">(Dia D)</span>
                          <div className="text-xs text-blue-600 mt-0.5">
                            Todos participam
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">23/08</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Tainan e Karina</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">30/08</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Tita e Stefany</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Setembro</h2>
                </div>
                <div className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">06/09</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Carol e Maicon</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">13/09</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Camila e Baby</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">20/09</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Jeferson e Tainan</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">27/09</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Nicole e Leno</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Outubro</h2>
                </div>
                <div className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">04/10</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Karina e Tita</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">11/10</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Carol e Stefany</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-blue-50">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">18/10</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-blue-700 font-medium">(Dia D)</span>
                          <div className="text-xs text-blue-600 mt-0.5">
                            Todos participam
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">25/10</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Camila e Tainan</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Novembro</h2>
                </div>
                <div className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">01/11</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Jeferson e Nicole</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">08/11</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Leno e Baby</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">15/11</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Karina e Tainan</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">22/11</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Carol e Camila</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">29/11</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Maicon e Tita</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Dezembro</h2>
                </div>
                <div className="p-0">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">06/12</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Leno e Jeferson</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">13/12</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-gray-700">Nicole e Bruna</span>
                        </td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="px-4 py-3 text-center w-16">
                          <span className="text-sm font-medium text-gray-700">20/12</span>
                        </td>
                        <td className="px-2 py-3">
                          <span className="text-sm text-blue-700 font-medium">(Dia D)</span>
                          <div className="text-xs text-blue-600 mt-0.5">
                            Todos participam
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg mt-8 p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">OBSERVAÇÕES:</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>• Caso haja necessidade de qualquer motivo para a realização da mesma em dias antecipados ou posteriores, atente-se em comunicar o seu parceiro(a) para não haver discordância.</p>
              <p>• As limpezas serão supervisionadas a cada limpeza, assim verificando se a limpeza teve efetividade.</p>
              <p>• A limpeza do terreiro ocorre mesmo com chuva ou sol. Em dias de chuva a parte externa não precisa ser lavada.</p>
              <p>• A limpeza consiste em lavar o chão, vidros internos e externos, paredes e teto quando necessário, tirar o pó onde houver pó, tirar teias de aranha quando observado, área externa, escadas, banheiro, lavanderia, pias internas e externas, organizar os panos utilizados para a limpeza do dia (lavar, secar, guardar). Retire o lixo para a rua quando houver necessidade. Passar um pano molhado nos corrimãos das escadas, colocar no lixo do banheiro quando trocar, lavar os panos usados na limpeza, lavar os panos de pratos, tapetes e toalhas de rosto.</p>
              <p>• Ao finalizar as tarefas, por favor, salve tudo o que foi utilizado nos seus devidos lugares.</p>
              
              <div className="pt-2">
                <p className="font-medium text-gray-800">Lembrete: Sempre que levar os panos pra lavar, traga na próxima vez que vier pro Terreiro.</p>
              </div>
              
              <div className="pt-2">
                <p className="font-medium text-gray-800">Lavar separadamente os panos:</p>
                <p>• Toalhas de rosto com toalhas de rosto.</p>
                <p>• Panos de prato com panos de prato.</p>
                <p>• Tapetes com tapetes.</p>
                <p>• Pano de chão com pano de chão.</p>
              </div>
              
              <p className="pt-2 font-medium text-gray-800">Agradeço a compreensão de todos!</p>
            </div>
          </div>
        </main>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Limpeza; 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Book, Users, Calendar, Star, BookOpen } from "lucide-react";

const DashboardHighlights = () => {
  const navigate = useNavigate();
  // Get user from localStorage (in a real app, this would come from a proper auth system)
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : { name: "Maria", avatar: "/placeholder.svg" };
  
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-5 pb-16">
      <div>
        <div className="flex justify-center gap-6 border-b border-gray-200 mb-4">
          <button 
            className="font-medium text-blue-600 border-b-2 border-blue-600 pb-2 px-1 -mb-px text-sm"
            onClick={() => navigate("/dashboard")}
          >
            Destaques
          </button>
          <button 
            className="text-gray-600 hover:text-gray-800 pb-2 px-1 text-sm"
            onClick={() => navigate("/eventos")}
          >
            Eventos
          </button>
          <button 
            className="text-gray-600 hover:text-gray-800 pb-2 px-1 text-sm"
            onClick={() => navigate("/leitura")}
          >
            Leitura
          </button>
          <button 
            className="text-gray-600 hover:text-gray-800 pb-2 px-1 text-sm"
            onClick={() => navigate("/mensagens")}
          >
            Mensagens
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row items-center md:items-start gap-4">
        <Avatar className="h-16 w-16 border border-gray-200">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-blue-50 text-blue-600">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="text-center md:text-left">
          <p className="text-gray-800 font-medium text-lg">{firstName}</p>
          <p className="text-sm text-gray-600">Médium em Desenvolvimento</p>
          <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800">12</p>
              <p className="text-xs text-gray-500">Giras</p>
            </div>
            <div className="h-10 w-px bg-gray-200"></div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800">5</p>
              <p className="text-xs text-gray-500">Estudos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-medium text-gray-800">Próximos Eventos</h2>
          <button 
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            onClick={() => navigate("/eventos")}
          >
            Ver todos
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">Gira de Pretos Velhos</p>
                <p className="text-xs text-gray-500">Sábado, 20 de Maio • 9:00</p>
              </div>
            </div>
            <div className="bg-green-50 px-2 py-1 rounded text-xs font-medium text-green-600">
              Confirmado
            </div>
          </div>
          
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">Desenvolvimento Mediúnico</p>
                <p className="text-xs text-gray-500">Terça, 23 de Maio • 20:00</p>
              </div>
            </div>
            <div className="bg-blue-50 px-2 py-1 rounded text-xs font-medium text-blue-600">
              Obrigatório
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-medium text-gray-800">Atividades Recentes</h2>
          <button 
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todas
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">Leitura concluída</p>
                <p className="text-xs text-gray-500">Fundamentos da Umbanda</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Há 2 dias
            </div>
          </div>
          
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                <Users className="h-5 w-5 text-teal-500" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">Participação em Gira</p>
                <p className="text-xs text-gray-500">Gira de Caboclos</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Há 5 dias
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHighlights;

import React from "react";
import { TerreiroButton } from "@/components/ui/terreiro-button";
import { Axe, Drum, Leaf, Flame } from "lucide-react";

export default function TerreiroBotaoDemo() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Terreiro Button Demo</h1>
      
      <div className="grid gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Variantes</h2>
          <div className="flex flex-wrap gap-4">
            <TerreiroButton variant="default">Padrão</TerreiroButton>
            <TerreiroButton variant="axe"><Axe />Machado</TerreiroButton>
            <TerreiroButton variant="orisha"><Leaf />Orixá</TerreiroButton>
            <TerreiroButton variant="ritual"><Flame />Ritual</TerreiroButton>
            <TerreiroButton variant="outline">Contorno</TerreiroButton>
            <TerreiroButton variant="ghost">Fantasma</TerreiroButton>
            <TerreiroButton variant="link">Link</TerreiroButton>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Tamanhos</h2>
          <div className="flex flex-wrap items-center gap-4">
            <TerreiroButton size="sm">Pequeno</TerreiroButton>
            <TerreiroButton size="default">Padrão</TerreiroButton>
            <TerreiroButton size="lg">Grande</TerreiroButton>
            <TerreiroButton size="xl">Extra Grande</TerreiroButton>
            <TerreiroButton size="icon"><Drum /></TerreiroButton>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Arredondamento</h2>
          <div className="flex flex-wrap gap-4">
            <TerreiroButton rounded="default">Padrão</TerreiroButton>
            <TerreiroButton rounded="full">Arredondado</TerreiroButton>
            <TerreiroButton rounded="none">Quadrado</TerreiroButton>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Combinações</h2>
          <div className="flex flex-wrap gap-4">
            <TerreiroButton variant="axe" size="lg" rounded="full">
              <Axe />
              Ritual de Machado
            </TerreiroButton>
            <TerreiroButton variant="orisha" size="xl" rounded="none">
              <Leaf />
              Cerimônia do Orixá
            </TerreiroButton>
            <TerreiroButton variant="ritual" size="lg">
              <Flame />
              Iniciar Ritual
            </TerreiroButton>
            <TerreiroButton variant="outline" size="lg">
              <Drum />
              Convocar Ancestrais
            </TerreiroButton>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Estados</h2>
          <div className="flex flex-wrap gap-4">
            <TerreiroButton disabled>Desabilitado</TerreiroButton>
            <TerreiroButton variant="axe" disabled>Axé Desabilitado</TerreiroButton>
            <TerreiroButton variant="outline" disabled>Contorno Desabilitado</TerreiroButton>
          </div>
        </section>
      </div>
    </div>
  );
} 
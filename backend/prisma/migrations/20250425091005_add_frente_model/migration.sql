-- CreateTable
CREATE TABLE "Frente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "terreiroId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Frente_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Frente" ADD CONSTRAINT "Frente_terreiroId_fkey" FOREIGN KEY ("terreiroId") REFERENCES "Terreiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

# Backend Digital Terreiro

API multi-tenant para gestão de múltiplos terreiros, usuários e módulos do sistema.

## Tecnologias
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT Auth

## Scripts
- `npm run dev` — inicia servidor em modo desenvolvimento
- `npm run build` — compila para produção
- `npm run start` — executa build de produção
- `npm run prisma:migrate` — roda migrações do banco
- `npm run prisma:generate` — gera client Prisma

## Estrutura
- `/src` — código-fonte
- `/src/prisma` — schema e migrações Prisma
- `/src/controllers` — lógica dos endpoints
- `/src/routes` — rotas Express
- `/src/models` — (opcional) models auxiliares
- `/src/services` — lógica de negócio
- `/src/middlewares` — middlewares Express

## .env
Configure sua string de conexão PostgreSQL e segredo JWT no arquivo `.env`.

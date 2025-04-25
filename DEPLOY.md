# Guia de Deploy — Plataforma Digital Terreiro

## 1. Pré-requisitos
- Node.js 18+
- Yarn ou npm
- Variáveis de ambiente configuradas (ver `.env.example`)
- Backend multi-tenant rodando e acessível

## 2. Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com:

```
VITE_BACKEND_URL=http://localhost:4000/api
```
Ajuste a URL conforme o endereço do backend em produção.

## 3. Instalação
```
yarn install
# ou
npm install
```

## 4. Build de Produção
```
yarn build
# ou
npm run build
```
Os arquivos finais estarão em `dist/`.

## 5. Servindo em Produção
Você pode usar qualquer serviço de hospedagem estática (Netlify, Vercel, Firebase Hosting, etc.) ou um servidor próprio:

```
yarn preview
# ou
npm run preview
```
Acesse em `http://localhost:4173` (ou porta definida).

## 6. Deploy Automatizado (Netlify/Vercel)
- Configure a variável `VITE_BACKEND_URL` no painel do serviço de deploy.
- Aponte o build command para `yarn build` e o diretório de saída para `dist/`.

## 7. Backend
Consulte `backend/README.md` para deploy do backend multi-tenant (Prisma + Node.js).

---

## 8. Testes
Consulte o arquivo `TEST_PLAN.md` para o plano de testes e recomendações de ferramentas (Vitest, Cypress).

---

Dúvidas? Abra uma issue ou consulte a documentação do projeto.

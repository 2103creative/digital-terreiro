# Ylê Axé Xangô & Oxum — Plataforma Digital do Terreiro

Bem-vindo ao sistema digital do terreiro Ylê Axé Xangô & Oxum! Este projeto visa facilitar a comunicação, organização e participação dos membros do terreiro, promovendo acolhimento, transparência e praticidade.

---

## ✨ Visão Geral

- **Gerencie eventos, frentes, ervas, mantimentos, mensagens e muito mais**
- **Acesso diferenciado para membros e administradores**
- **Experiência otimizada para desktop e mobile**

---

## 🚀 Tecnologias Utilizadas

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build e dev server)
- [Tailwind CSS](https://tailwindcss.com/) (estilização)
- [shadcn-ui](https://ui.shadcn.com/) e [Radix UI](https://www.radix-ui.com/) (componentes acessíveis)
- [React Router](https://reactrouter.com/) (rotas)
- [TanStack React Query](https://tanstack.com/query/latest) (gerenciamento de dados)

---

## 📁 Estrutura de Pastas

- `src/pages/` — Páginas principais do sistema, cada arquivo representa uma rota
- `src/components/` — Componentes reutilizáveis de UI
- `src/layouts/` — Layouts para diferentes tipos de usuários (admin, usuário comum, mobile, desktop)
- `src/contexts/` — Contextos React para autenticação, chat, etc.
- `src/hooks/` — Hooks customizados para lógica reutilizável
- `public/` — Assets públicos, imagens, manifest, etc.

---

## 🗺️ Principais Rotas

| Rota                      | Descrição                         | Permissão    |
|---------------------------|-----------------------------------|--------------|
| `/login`                  | Tela de login                     | Pública      |
| `/register`               | Cadastro de novo usuário          | Pública      |
| `/dashboard`              | Dashboard do usuário              | Autenticado  |
| `/frentes`                | Frentes do terreiro               | Autenticado  |
| `/ervas`                  | Catálogo de ervas                 | Autenticado  |
| `/eventos`                | Eventos do terreiro               | Autenticado  |
| `/leitura`                | Leituras e materiais              | Autenticado  |
| `/mensagens`              | Mensagens da comunidade           | Autenticado  |
| `/limpeza`                | Limpezas e escalas                | Autenticado  |
| `/compras`                | Lista de compras                  | Autenticado  |
| `/chat`                   | Chat interno                      | Autenticado  |
| `/favoritos`              | Itens favoritos                   | Autenticado  |
| `/profile`                | Perfil do usuário                 | Autenticado  |
| `/settings`               | Configurações                     | Autenticado  |
| `/admin/dashboard`        | Dashboard administrativo          | Admin        |
| `/admin/frentes`          | Gerenciar frentes                 | Admin        |
| `/admin/ervas`            | Gerenciar ervas                   | Admin        |
| `/admin/compras`          | Gerenciar mantimentos/compras     | Admin        |
| `/admin/eventos`          | Gerenciar eventos                 | Admin        |
| `/admin/leitura`          | Gerenciar leituras                | Admin        |
| `/admin/limpeza`          | Gerenciar limpezas                | Admin        |
| `/admin/mensagens`        | Gerenciar mensagens               | Admin        |
| `/admin/usuarios`         | Gerenciar usuários                | Admin        |
| `/admin/usuarios/editar/:userId` | Editar usuário específico  | Admin        |
| `/admin/usuarios-view`    | Visualizar usuários               | Admin        |
| `/admin/cleaning-generator`| Gerador de escalas de limpeza   | Admin        |
| `*`                       | Página 404                        | Todos        |

---

## 🚦 Otimização e Performance

### Imagens WebP
- Todas as imagens principais usam `<picture>` com fallback para WebP e PNG/JPG.
- Para converter PNG/JPG para WebP, instale o utilitário [Google WebP](https://developers.google.com/speed/webp/download) e execute:
  ```powershell
  ./scripts/convert-images-webp.ps1
  ```
- Certifique-se de que o executável `cwebp` está no PATH do sistema.

### Fontes e Scripts
- Fontes Google otimizadas com `display=swap` e `preconnect`.
- Scripts principais usam `defer` para não bloquear o carregamento.

### Checklist de Deploy
- [ ] Execute o script de imagens WebP após adicionar novas imagens.
- [ ] Rode Lighthouse para validar desempenho.
- [ ] Garanta HTTPS e headers de segurança em produção.
- [ ] Teste acessibilidade (contraste, navegação por teclado, ARIA).
- [ ] Teste offline (PWA) e instale no dispositivo.

---

## 🛠️ Como Rodar Localmente

1. **Clone o repositório:**
   ```sh
   git clone <URL_DO_REPOSITORIO>
   cd <NOME_DA_PASTA>
   ```
2. **Instale as dependências:**
   ```sh
   npm install
   ```
3. **Inicie o servidor de desenvolvimento:**
   ```sh
   npm run dev
   ```
   O site estará disponível em `http://localhost:5173` (ou porta definida pelo Vite).

---

## 📜 Scripts Disponíveis

- `npm run dev` — Inicia o servidor de desenvolvimento
- `npm run build` — Gera a build de produção
- `npm run preview` — Visualiza a build de produção localmente
- `npm run lint` — Verifica padrões de código
- `scripts/convert-images-webp.ps1`: Converte PNG/JPG para WebP em `/public`.

---

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature ou correção: `git checkout -b minha-feature`
3. Commit suas mudanças: `git commit -m "feat: minha contribuição"`
4. Push para seu fork: `git push origin minha-feature`
5. Abra um Pull Request

Sugestões, correções e novas ideias são sempre bem-vindas!

---

## 📬 Contato & Suporte

- Email: [contato@yleaxe.com.br](mailto:contato@yleaxe.com.br)
- WhatsApp: (xx) xxxxx-xxxx
- [Site oficial](https://yleaxe.com.br)

---

## 📄 Licença

Este projeto é privado e destinado ao uso interno do terreiro Ylê Axé Xangô & Oxum.

---

> _Axé e bem-vinde à nossa comunidade digital!_

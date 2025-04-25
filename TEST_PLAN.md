# Plano de Testes — Plataforma Digital Terreiro

## Objetivo
Garantir que todas as funcionalidades principais do sistema estejam funcionando corretamente para múltiplos terreiros (multi-tenant), tanto para usuários comuns quanto administradores, incluindo operações em tempo real.

---

## 1. Autenticação e Cadastro
- [ ] Cadastro de novo usuário vinculado a um terreiro
- [ ] Login de usuário (admin e comum)
- [ ] Redirecionamento correto após login/logout
- [ ] Proteção de rotas

## 2. Dashboard
- [ ] Exibição correta das informações do terreiro do usuário
- [ ] Links para todas as áreas principais

## 3. Frentes
- [ ] Listagem de frentes (usuário)
- [ ] CRUD de frentes (admin)
- [ ] Atualização em tempo real (socket)

## 4. Eventos
- [ ] Listagem de eventos (usuário)
- [ ] CRUD de eventos (admin)
- [ ] Atualização em tempo real (socket)

## 5. Ervas
- [ ] Catálogo de ervas (usuário)
- [ ] CRUD de ervas (admin)
- [ ] Atualização em tempo real (socket)

## 6. Lista de Compras/Mantimentos
- [ ] Listagem de mantimentos (usuário)
- [ ] CRUD de mantimentos (admin)
- [ ] Atualização em tempo real (socket)

## 7. Mensagens/Chat
- [ ] Envio e recebimento de mensagens
- [ ] Atualização em tempo real (socket)

## 8. Limpezas/Escalas
- [ ] Listagem e gerenciamento de escalas
- [ ] CRUD de limpezas (admin)
- [ ] Atualização em tempo real (socket)

## 9. Perfil e Configurações
- [ ] Edição de perfil
- [ ] Alteração de senha
- [ ] Logout

## 10. Multi-Tenant
- [ ] Garantir isolamento de dados entre diferentes terreiros
- [ ] Testar CRUD e real-time em múltiplos terreiros simultaneamente

---

## Testes Automatizados (Sugestão)
- Utilizar [Vitest](https://vitest.dev/) para testes unitários/componentes
- Utilizar [Cypress](https://www.cypress.io/) para testes E2E (end-to-end)

---

## Observações
- Testar em diferentes navegadores e dispositivos
- Validar mensagens de erro e feedbacks visuais
- Testar fluxo de erros (API offline, token expirado, etc.)

---

**Este plano pode ser expandido conforme novas funcionalidades forem adicionadas.**

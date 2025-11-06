-- Tipo enum para roles
create type public.app_role as enum ('admin', 'membro', 'visitante');

-- Tabela de perfis de usuários
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  nome text not null,
  email text not null,
  avatar_url text,
  orixa text,
  data_iniciacao date,
  telefone text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Tabela de roles dos usuários
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone default now() not null,
  unique (user_id, role)
);

-- Função para verificar role do usuário
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Trigger para criar perfil e role padrão quando usuário é criado
create or replace function public.handle_new_user() 
returns trigger 
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nome, email, avatar_url)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'nome', new.email),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  
  insert into public.user_roles (user_id, role)
  values (new.id, 'membro');
  
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Frentes espirituais
create table public.frentes (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  subtitulo text,
  descricao text not null,
  imagem_url text,
  tipo text not null check (tipo in ('umbanda', 'nacao')),
  icone text,
  cor text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Eventos
create table public.eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  data_inicio timestamp with time zone not null,
  data_fim timestamp with time zone not null,
  local text,
  imagem_url text,
  frente_id uuid references public.frentes on delete set null,
  criado_por uuid references auth.users not null,
  publico boolean default true,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Materiais de leitura
create table public.materiais_leitura (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  autor text,
  descricao text,
  conteudo text,
  arquivo_url text,
  imagem_url text,
  frente_id uuid references public.frentes on delete set null,
  criado_por uuid references auth.users not null,
  publico boolean default true,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Mensagens/Comunicados
create table public.mensagens (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  conteudo text not null,
  imagem_url text,
  destaque boolean default false,
  criado_por uuid references auth.users not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Escalas de limpeza
create table public.escalas_limpeza (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  data date not null,
  criado_por uuid references auth.users not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Participantes da escala de limpeza
create table public.participantes_limpeza (
  id uuid primary key default gen_random_uuid(),
  escala_id uuid references public.escalas_limpeza on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  tarefa text,
  concluida boolean default false,
  created_at timestamp with time zone default now() not null,
  unique(escala_id, user_id)
);

-- Listas de compras
create table public.listas_compras (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  data date,
  concluida boolean default false,
  criado_por uuid references auth.users not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Itens da lista de compras
create table public.itens_compra (
  id uuid primary key default gen_random_uuid(),
  lista_id uuid references public.listas_compras on delete cascade not null,
  nome text not null,
  quantidade text default '1',
  unidade text,
  comprado boolean default false,
  comprado_por uuid references auth.users on delete set null,
  created_at timestamp with time zone default now() not null
);

-- Ervas medicinais e ritualísticas
create table public.ervas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  nome_cientifico text,
  descricao text,
  usos text,
  imagem_url text,
  orixa_relacionado text,
  criado_por uuid references auth.users not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Banhos ritualísticos
create table public.banhos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text not null,
  procedimento text not null,
  orixa_relacionado text,
  imagem_url text,
  criado_por uuid references auth.users not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Ingredientes dos banhos
create table public.ingredientes_banho (
  id uuid primary key default gen_random_uuid(),
  banho_id uuid references public.banhos on delete cascade not null,
  erva_id uuid references public.ervas on delete set null,
  outro_ingrediente text,
  quantidade text,
  created_at timestamp with time zone default now() not null
);

-- Mensagens de chat
create table public.mensagens_chat (
  id uuid primary key default gen_random_uuid(),
  conteudo text not null,
  user_id uuid references auth.users on delete cascade not null,
  deletada boolean default false,
  created_at timestamp with time zone default now() not null
);

-- Ativar RLS em todas as tabelas
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.frentes enable row level security;
alter table public.eventos enable row level security;
alter table public.materiais_leitura enable row level security;
alter table public.mensagens enable row level security;
alter table public.escalas_limpeza enable row level security;
alter table public.participantes_limpeza enable row level security;
alter table public.listas_compras enable row level security;
alter table public.itens_compra enable row level security;
alter table public.ervas enable row level security;
alter table public.banhos enable row level security;
alter table public.ingredientes_banho enable row level security;
alter table public.mensagens_chat enable row level security;

-- POLÍTICAS RLS

-- Profiles: todos podem ver, mas só podem editar o próprio
create policy "Perfis são visíveis por usuários autenticados"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Usuários podem atualizar seu próprio perfil"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- User roles: apenas admins podem gerenciar
create policy "Roles são visíveis por usuários autenticados"
  on public.user_roles for select
  to authenticated
  using (true);

create policy "Apenas admins podem criar roles"
  on public.user_roles for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem atualizar roles"
  on public.user_roles for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem deletar roles"
  on public.user_roles for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Frentes: todos podem ver, apenas admins podem gerenciar
create policy "Frentes são visíveis por todos"
  on public.frentes for select
  to authenticated
  using (true);

create policy "Apenas admins podem criar frentes"
  on public.frentes for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem atualizar frentes"
  on public.frentes for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem deletar frentes"
  on public.frentes for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Eventos: membros e admins podem ver e criar, admins podem editar todos
create policy "Eventos são visíveis por membros e admins"
  on public.eventos for select
  to authenticated
  using (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

create policy "Membros e admins podem criar eventos"
  on public.eventos for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

create policy "Admins e criadores podem atualizar eventos"
  on public.eventos for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin') or criado_por = auth.uid());

create policy "Admins e criadores podem deletar eventos"
  on public.eventos for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin') or criado_por = auth.uid());

-- Materiais de leitura: membros podem ver, apenas admins podem gerenciar
create policy "Materiais são visíveis por membros e admins"
  on public.materiais_leitura for select
  to authenticated
  using (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem criar materiais"
  on public.materiais_leitura for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem atualizar materiais"
  on public.materiais_leitura for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem deletar materiais"
  on public.materiais_leitura for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Mensagens: membros podem ver, apenas admins podem gerenciar
create policy "Mensagens são visíveis por membros e admins"
  on public.mensagens for select
  to authenticated
  using (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem criar mensagens"
  on public.mensagens for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem atualizar mensagens"
  on public.mensagens for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem deletar mensagens"
  on public.mensagens for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Escalas de limpeza: membros podem ver, admins podem gerenciar
create policy "Escalas são visíveis por membros e admins"
  on public.escalas_limpeza for select
  to authenticated
  using (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem criar escalas"
  on public.escalas_limpeza for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem atualizar escalas"
  on public.escalas_limpeza for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem deletar escalas"
  on public.escalas_limpeza for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Participantes de limpeza: membros podem ver e atualizar suas tarefas
create policy "Participantes são visíveis por membros e admins"
  on public.participantes_limpeza for select
  to authenticated
  using (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem adicionar participantes"
  on public.participantes_limpeza for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Participantes podem atualizar suas próprias tarefas"
  on public.participantes_limpeza for update
  to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem remover participantes"
  on public.participantes_limpeza for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Listas de compras: membros podem ver e criar, admins podem gerenciar tudo
create policy "Listas são visíveis por membros e admins"
  on public.listas_compras for select
  to authenticated
  using (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

create policy "Membros e admins podem criar listas"
  on public.listas_compras for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

create policy "Admins e criadores podem atualizar listas"
  on public.listas_compras for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin') or criado_por = auth.uid());

create policy "Admins e criadores podem deletar listas"
  on public.listas_compras for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin') or criado_por = auth.uid());

-- Itens de compra: membros podem ver e gerenciar
create policy "Itens são visíveis por membros e admins"
  on public.itens_compra for select
  to authenticated
  using (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

create policy "Membros e admins podem adicionar itens"
  on public.itens_compra for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

create policy "Membros e admins podem atualizar itens"
  on public.itens_compra for update
  to authenticated
  using (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

create policy "Membros e admins podem deletar itens"
  on public.itens_compra for delete
  to authenticated
  using (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

-- Ervas: membros podem ver, admins podem gerenciar
create policy "Ervas são visíveis por membros e admins"
  on public.ervas for select
  to authenticated
  using (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem criar ervas"
  on public.ervas for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem atualizar ervas"
  on public.ervas for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem deletar ervas"
  on public.ervas for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Banhos: membros podem ver, admins podem gerenciar
create policy "Banhos são visíveis por membros e admins"
  on public.banhos for select
  to authenticated
  using (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem criar banhos"
  on public.banhos for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem atualizar banhos"
  on public.banhos for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem deletar banhos"
  on public.banhos for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Ingredientes de banho: seguem as mesmas regras dos banhos
create policy "Ingredientes são visíveis por membros e admins"
  on public.ingredientes_banho for select
  to authenticated
  using (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem adicionar ingredientes"
  on public.ingredientes_banho for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem atualizar ingredientes"
  on public.ingredientes_banho for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem deletar ingredientes"
  on public.ingredientes_banho for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Mensagens de chat: membros podem ver e enviar, admins podem moderar
create policy "Mensagens de chat são visíveis por membros e admins"
  on public.mensagens_chat for select
  to authenticated
  using ((public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin')) and deletada = false);

create policy "Membros e admins podem enviar mensagens"
  on public.mensagens_chat for insert
  to authenticated
  with check (public.has_role(auth.uid(), 'membro') or public.has_role(auth.uid(), 'admin'));

create policy "Usuários podem editar suas próprias mensagens"
  on public.mensagens_chat for update
  to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

create policy "Apenas admins podem deletar mensagens"
  on public.mensagens_chat for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Habilitar realtime para chat
alter publication supabase_realtime add table public.mensagens_chat;

-- Funções auxiliares

-- Função para obter eventos futuros
create or replace function get_proximos_eventos(dias_a_frente int default 30)
returns setof public.eventos
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.eventos
  where data_inicio between now() and (now() + (dias_a_frente || ' days')::interval)
  order by data_inicio asc;
$$;

-- Função para gerar escala de limpeza automaticamente
create or replace function gerar_escala_limpeza(
  titulo_escala text,
  data_escala date,
  ids_usuarios uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  escala_id uuid;
  id_usuario uuid;
  i int;
begin
  -- Criar nova escala
  insert into public.escalas_limpeza (titulo, data, criado_por)
  values (titulo_escala, data_escala, auth.uid())
  returning id into escala_id;
  
  -- Atribuir usuários à escala
  i := 1;
  foreach id_usuario in array ids_usuarios loop
    insert into public.participantes_limpeza (escala_id, user_id, tarefa)
    values (escala_id, id_usuario, 'Tarefa ' || i);
    i := i + 1;
  end loop;
  
  return escala_id;
end;
$$;

-- Dados iniciais (seed data)

-- Inserir frentes de Umbanda
insert into public.frentes (titulo, subtitulo, descricao, tipo, cor, icone) values
  ('Caboclos', 'Energia de proteção e cura', 'Energia de proteção e cura da natureza. Os caboclos são espíritos que representam os nativos brasileiros e trabalham com as forças da natureza para cura e orientação espiritual.', 'umbanda', 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400', '🏹'),
  ('Pretos Velhos', 'Sabedoria ancestral', 'Sabedoria ancestral e acolhimento. Os pretos velhos são espíritos de antigos escravos que viveram no Brasil e trazem consigo conhecimento, caridade e paciência.', 'umbanda', 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400', '👴🏿'),
  ('Crianças', 'Energia de pureza', 'Energia de pureza e alegria. As crianças na umbanda representam a pureza, a inocência e a alegria, trazendo leveza aos trabalhos espirituais.', 'umbanda', 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400', '🧸'),
  ('Exus e Pombagiras', 'Guardiões e orientadores', 'Guardiões e orientadores dos caminhos. Trabalham na quebra de demandas, proteção espiritual e remoção de obstáculos da vida dos médiuns e consulentes.', 'umbanda', 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400', '🔱');

-- Inserir frentes de Nação
insert into public.frentes (titulo, subtitulo, descricao, tipo, cor, icone) values
  ('Xangô', 'Orixá da justiça', 'Orixá da justiça e do trovão. Xangô é o senhor da justiça, representado pelas pedreiras, trovões e pela força que equilibra o bem e o mal.', 'nacao', 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400', '⚡'),
  ('Oxum', 'Orixá das águas doces', 'Orixá das águas doces e do amor. Oxum representa a fertilidade, beleza, riqueza e o amor materno, sendo a dona dos rios e cachoeiras.', 'nacao', 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400', '💛'),
  ('Ogum', 'Orixá guerreiro', 'Orixá guerreiro, senhor dos caminhos. Ogum é o orixá da tecnologia, das batalhas e da força, abrindo caminhos e removendo obstáculos.', 'nacao', 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400', '⚔️'),
  ('Iemanjá', 'Rainha do mar', 'Rainha do mar, mãe de todos os orixás. Iemanjá representa o acolhimento materno, a fertilidade e a proteção de seus filhos.', 'nacao', 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400', '🌊');
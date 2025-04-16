
-- Tabela de usuários (estendendo a tabela auth.users do Supabase)
create table public.users (
  id uuid references auth.users not null primary key,
  name text not null,
  email text not null unique,
  avatar_url text,
  orixa text,
  iniciacao_date timestamp with time zone,
  role text not null check (role in ('admin', 'member', 'guest')) default 'member',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Trigger para inserir automaticamente novos usuários na tabela users
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, name, email, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'name', new.email, new.raw_user_meta_data->>'avatar_url', 'member');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para inserir novos usuários após o signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Frentes espirituais
create table public.frentes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  description text not null,
  image_url text,
  type text not null check (type in ('umbanda', 'nacao')),
  icons text,
  color text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Eventos
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  location text,
  image_url text,
  frente_id uuid references public.frentes,
  created_by uuid references public.users not null,
  is_public boolean default true,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Materiais de leitura
create table public.reading_materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  description text,
  content text,
  file_url text,
  image_url text,
  frente_id uuid references public.frentes,
  created_by uuid references public.users not null,
  is_public boolean default true,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Mensagens
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  image_url text,
  is_pinned boolean default false,
  created_by uuid references public.users not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Escalas de limpeza
create table public.cleaning_schedules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date date not null,
  created_by uuid references public.users not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Participantes da escala de limpeza
create table public.cleaning_participants (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid references public.cleaning_schedules not null,
  user_id uuid references public.users not null,
  task text,
  created_at timestamp with time zone default now() not null,
  unique(schedule_id, user_id)
);

-- Lista de compras
create table public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date date,
  is_completed boolean default false,
  created_by uuid references public.users not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Itens da lista de compras
create table public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references public.shopping_lists not null,
  name text not null,
  quantity integer default 1,
  is_purchased boolean default false,
  created_by uuid references public.users,
  created_at timestamp with time zone default now() not null
);

-- Ervas medicinais e ritualísticas
create table public.herbs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  scientific_name text,
  description text,
  uses text,
  image_url text,
  related_orixa text,
  created_by uuid references public.users not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Banhos ritualísticos
create table public.ritual_baths (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  procedure text not null,
  related_orixa text,
  image_url text,
  created_by uuid references public.users not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Ingredientes dos banhos
create table public.bath_ingredients (
  id uuid primary key default gen_random_uuid(),
  bath_id uuid references public.ritual_baths not null,
  herb_id uuid references public.herbs,
  other_ingredient text,
  quantity text,
  created_at timestamp with time zone default now() not null
);

-- Mensagens de chat
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  user_id uuid references public.users not null,
  is_deleted boolean default false,
  created_at timestamp with time zone default now() not null
);

-- Configurando políticas de segurança (RLS)
-- Ativar RLS em todas as tabelas
alter table public.users enable row level security;
alter table public.frentes enable row level security;
alter table public.events enable row level security;
alter table public.reading_materials enable row level security;
alter table public.messages enable row level security;
alter table public.cleaning_schedules enable row level security;
alter table public.cleaning_participants enable row level security;
alter table public.shopping_lists enable row level security;
alter table public.shopping_items enable row level security;
alter table public.herbs enable row level security;
alter table public.ritual_baths enable row level security;
alter table public.bath_ingredients enable row level security;
alter table public.chat_messages enable row level security;

-- Políticas de usuários
create policy "Usuários podem ver outros usuários"
  on public.users for select
  using (true);

create policy "Usuários podem atualizar seus próprios dados"
  on public.users for update
  using (auth.uid() = id);

-- Políticas para frentes espirituais
create policy "Qualquer pessoa pode ver frentes"
  on public.frentes for select
  using (true);

create policy "Apenas administradores podem criar frentes"
  on public.frentes for insert
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Apenas administradores podem atualizar frentes"
  on public.frentes for update
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Políticas para eventos
create policy "Qualquer pessoa pode ver eventos públicos"
  on public.events for select
  using (is_public = true or 
        exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'member')));

create policy "Membros e admins podem criar eventos"
  on public.events for insert
  using (exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'member')));

create policy "Admins e criador podem atualizar eventos"
  on public.events for update
  using (created_by = auth.uid() or 
        exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Políticas para materiais de leitura
create policy "Qualquer pessoa pode ver materiais públicos"
  on public.reading_materials for select
  using (is_public = true or 
        exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'member')));

create policy "Admins podem criar materiais"
  on public.reading_materials for insert
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins podem atualizar materiais"
  on public.reading_materials for update
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Políticas para mensagens
create policy "Membros e admins podem ver mensagens"
  on public.messages for select
  using (exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'member')));

create policy "Admins podem criar mensagens"
  on public.messages for insert
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins podem atualizar mensagens"
  on public.messages for update
  using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Criar funções para o supabase
-- Função para obter todos os eventos futuros
create or replace function get_upcoming_events(days_ahead int default 30)
returns setof public.events as $$
begin
  return query
    select *
    from public.events
    where start_time between now() and (now() + (days_ahead || ' days')::interval)
    and is_public = true
    order by start_time asc;
end;
$$ language plpgsql security definer;

-- Função para gerar escala de limpeza automaticamente
create or replace function generate_cleaning_schedule(
  schedule_title text,
  schedule_date date,
  user_ids uuid[]
)
returns uuid as $$
declare
  schedule_id uuid;
  user_id uuid;
  i int;
begin
  -- Criar nova escala
  insert into public.cleaning_schedules (title, date, created_by)
  values (schedule_title, schedule_date, auth.uid())
  returning id into schedule_id;
  
  -- Atribuir usuários à escala
  i := 1;
  foreach user_id in array user_ids loop
    insert into public.cleaning_participants (schedule_id, user_id, task)
    values (schedule_id, user_id, 'Tarefa ' || i);
    i := i + 1;
  end loop;
  
  return schedule_id;
end;
$$ language plpgsql security definer;

-- Criar dados iniciais (seed)
-- Inserir frentes de Umbanda
insert into public.frentes (title, subtitle, description, type, color)
values 
  ('Caboclos', 'Energia de proteção e cura', 'Energia de proteção e cura da natureza. Os caboclos são espíritos que representam os nativos brasileiros e trabalham com as forças da natureza para cura e orientação espiritual.', 'umbanda', 'bg-green-50 text-green-700'),
  ('Pretos Velhos', 'Sabedoria ancestral', 'Sabedoria ancestral e acolhimento. Os pretos velhos são espíritos de antigos escravos que viveram no Brasil e trazem consigo conhecimento, caridade e paciência.', 'umbanda', 'bg-amber-50 text-amber-700'),
  ('Crianças', 'Energia de pureza', 'Energia de pureza e alegria. As crianças na umbanda representam a pureza, a inocência e a alegria, trazendo leveza aos trabalhos espirituais.', 'umbanda', 'bg-pink-50 text-pink-700'),
  ('Exus e Pombagiras', 'Guardiões e orientadores', 'Guardiões e orientadores dos caminhos. Trabalham na quebra de demandas, proteção espiritual e remoção de obstáculos da vida dos médiuns e consulentes.', 'umbanda', 'bg-purple-50 text-purple-700');

-- Inserir frentes de Nação
insert into public.frentes (title, subtitle, description, type, color)
values 
  ('Xangô', 'Orixá da justiça', 'Orixá da justiça e do trovão. Xangô é o senhor da justiça, representado pelas pedreiras, trovões e pela força que equilibra o bem e o mal.', 'nacao', 'bg-red-50 text-red-700'),
  ('Oxum', 'Orixá das águas doces', 'Orixá das águas doces e do amor. Oxum representa a fertilidade, beleza, riqueza e o amor materno, sendo a dona dos rios e cachoeiras.', 'nacao', 'bg-yellow-50 text-yellow-700'),
  ('Ogum', 'Orixá guerreiro', 'Orixá guerreiro, senhor dos caminhos. Ogum é o orixá da tecnologia, das batalhas e da força, abrindo caminhos e removendo obstáculos.', 'nacao', 'bg-blue-50 text-blue-700'),
  ('Iemanjá', 'Rainha do mar', 'Rainha do mar, mãe de todos os orixás. Iemanjá representa o acolhimento materno, a fertilidade e a proteção de seus filhos.', 'nacao', 'bg-cyan-50 text-cyan-700');

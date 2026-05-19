-- ============================================================
--  OrganiData — Schema SQL completo para Supabase
--  Pega esto en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- ── 1. EXTENSIONES ──────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── 2. TABLA: perfiles de usuario ───────────────────────────
-- Se vincula automáticamente con auth.users (Supabase Auth)
create table public.perfiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  nombre        text not null,
  email         text,
  direccion     text,
  sector        text default 'Sin sector',
  puntos        integer default 0,
  kilos_reciclados numeric(10,2) default 0,
  avatar_url    text,
  coordenadas   jsonb default '{"lat": -41.4693, "lng": -72.9424}',
  created_at    timestamptz default now()
);

-- RLS: cada usuario solo ve y edita su propio perfil
alter table public.perfiles enable row level security;

create policy "Perfil propio: ver"   on public.perfiles for select using (auth.uid() = id);
create policy "Perfil propio: editar" on public.perfiles for update using (auth.uid() = id);
create policy "Perfil propio: insertar" on public.perfiles for insert with check (auth.uid() = id);

-- ── 3. TABLA: ciclos de compostaje ──────────────────────────
create table public.ciclos_compostaje (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid references public.perfiles(id) on delete cascade not null,
  lote_codigo           text generated always as ('LOTE-' || substr(id::text, 1, 6)) stored,
  nombre_personalizado  text not null,
  fecha_inicio          timestamptz default now(),
  fecha_fin             timestamptz,
  estado                text default 'Activo' check (estado in ('Activo', 'Finalizado', 'Cancelado')),
  cosecha_kilos         numeric(10,2),
  foto_cover_url        text,
  created_at            timestamptz default now()
);

alter table public.ciclos_compostaje enable row level security;

create policy "Ciclos: ver propios"     on public.ciclos_compostaje for select using (auth.uid() = user_id);
create policy "Ciclos: crear"           on public.ciclos_compostaje for insert with check (auth.uid() = user_id);
create policy "Ciclos: editar propios"  on public.ciclos_compostaje for update using (auth.uid() = user_id);
create policy "Ciclos: eliminar propios" on public.ciclos_compostaje for delete using (auth.uid() = user_id);

-- ── 4. TABLA: avances / registros semanales ─────────────────
create table public.avances (
  id           uuid primary key default uuid_generate_v4(),
  ciclo_id     uuid references public.ciclos_compostaje(id) on delete cascade not null,
  user_id      uuid references public.perfiles(id) on delete cascade not null,
  fecha        timestamptz default now(),
  olor         text check (olor in ('normal', 'podrido', 'amoniaco', 'sinolor')),
  humedad      text check (humedad in ('bien', 'seco', 'mojado')),
  kilos_anadidos numeric(5,2) default 0,
  foto_url     text,
  nota         text,
  puntos_otorgados boolean default false,
  created_at   timestamptz default now()
);

alter table public.avances enable row level security;

create policy "Avances: ver propios"    on public.avances for select using (auth.uid() = user_id);
create policy "Avances: crear"          on public.avances for insert with check (auth.uid() = user_id);
create policy "Avances: editar propios" on public.avances for update using (auth.uid() = user_id);

-- ── 5. TABLA: medallas ───────────────────────────────────────
create table public.medallas (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references public.perfiles(id) on delete cascade not null,
  nombre       text not null,
  icono        text not null,
  descripcion  text,
  obtenida_at  timestamptz default now()
);

alter table public.medallas enable row level security;
create policy "Medallas: ver propias" on public.medallas for select using (auth.uid() = user_id);
create policy "Medallas: insertar"    on public.medallas for insert with check (auth.uid() = user_id);

-- ── 6. TABLA: avisos municipales ─────────────────────────────
-- Solo admins pueden insertar; todos los usuarios autenticados pueden ver
create table public.avisos_municipales (
  id        uuid primary key default uuid_generate_v4(),
  titulo    text not null,
  mensaje   text not null,
  fecha     timestamptz default now(),
  sector    text default 'Todos'
);

alter table public.avisos_municipales enable row level security;
create policy "Avisos: ver autenticados" on public.avisos_municipales for select to authenticated using (true);

-- ── 7. TABLA: ranking (view materializada simplificada) ──────
-- Vista para ranking de vecinos por puntos
create or replace view public.ranking_vecinos as
  select
    p.id,
    p.nombre,
    p.sector,
    p.puntos,
    p.avatar_url,
    rank() over (order by p.puntos desc) as posicion
  from public.perfiles p
  order by p.puntos desc;

-- ── 8. STORAGE: bucket para fotos del compost ───────────────
-- Ejecuta esto también en el SQL Editor:
insert into storage.buckets (id, name, public)
values ('fotos-compost', 'fotos-compost', true)
on conflict do nothing;

-- Política de storage: cada usuario puede subir a su carpeta
create policy "Fotos: subir propias"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'fotos-compost' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Fotos: ver todas"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'fotos-compost');

create policy "Fotos: eliminar propias"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'fotos-compost' and (storage.foldername(name))[1] = auth.uid()::text);

-- ── 9. FUNCIÓN: crear perfil automático al registrarse ───────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

-- Trigger: se dispara al crear un usuario nuevo en auth
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 10. DATOS SEED: avisos iniciales ────────────────────────
insert into public.avisos_municipales (titulo, mensaje, sector) values
  ('Retiro de Abono Certificado', 'El camión recolector pasará este jueves por el cuadrante del piloto.', 'Valle Volcanes'),
  ('Talleres de Huerto Urbano', 'Inscríbete gratis al taller online de este sábado usando el link oficial.', 'Todos');

-- ── 11. FUNCIONES RPC (llamadas desde el cliente JS) ─────────
-- Sumar puntos de forma atómica (evita race conditions)
create or replace function public.sumar_puntos(p_user_id uuid, p_puntos integer)
returns void language sql security definer as $$
  update public.perfiles
  set puntos = puntos + p_puntos
  where id = p_user_id;
$$;

-- Incrementar kilos de forma atómica
create or replace function public.incrementar_kilos(p_user_id uuid, p_kilos numeric)
returns void language sql security definer as $$
  update public.perfiles
  set kilos_reciclados = kilos_reciclados + p_kilos
  where id = p_user_id;
$$;


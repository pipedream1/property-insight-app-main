-- Clean reset migration: simplified schema, RLS, trigger, canonical view
-- Apply in a fresh Supabase project or to wipe an existing one (will DROP objects!).

begin;

-- 1) Drop dependent objects safely
drop view if exists v_water_readings_canonical cascade;

do $$
begin
  if exists (
    select 1 from pg_trigger where tgname = 'trg_set_water_source_id'
  ) then
    drop trigger trg_set_water_source_id on public.water_readings;
  end if;
exception when undefined_table then
  -- ignore
end $$;

drop function if exists trg_set_water_source_id() cascade;

-- 2) Drop tables (order matters)
drop table if exists public.water_source_aliases cascade;
drop table if exists public.water_readings cascade;
drop table if exists public.water_sources cascade;
drop table if exists public.reservoir_readings cascade;
drop table if exists public.profiles cascade;

-- 3) Core tables
create table public.profiles (
  user_id uuid primary key,
  role text not null default 'viewer' check (role in ('admin','manager','viewer')),
  created_at timestamptz not null default now()
);

create table public.water_sources (
  id serial primary key,
  name text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.water_source_aliases (
  id serial primary key,
  water_source_id int not null references public.water_sources(id) on delete cascade,
  alias text not null unique,
  created_at timestamptz not null default now()
);

-- Store cumulative meter in liters (integer). Frontend displays L; charts show kL.
create table public.water_readings (
  id bigserial primary key,
  water_source_id int references public.water_sources(id) on delete restrict,
  -- Legacy string fields kept temporarily for UI compatibility; will be removed after UI switches to FK-only.
  component_type text,
  component_name text,
  reading bigint not null check (reading >= 0), -- liters
  date date not null,
  comment text,
  photo_taken boolean,
  photo_url text,
  created_at timestamptz not null default now()
);

-- Unique per source + date (only when FK is present)
create unique index water_readings_unique_per_source_date
  on public.water_readings (water_source_id, date)
  where water_source_id is not null;

create table public.reservoir_readings (
  id bigserial primary key,
  reading_date date not null,
  water_level numeric(12,2),
  percentage_full numeric(5,2),
  notes text,
  created_at timestamptz not null default now()
);

-- 4) Helper function/trigger to set water_source_id from names/aliases on insert/update
create or replace function public.trg_set_water_source_id()
returns trigger
language plpgsql
as $$
declare
  src text;
  sid int;
begin
  if new.water_source_id is null then
    src := coalesce(new.component_type, new.component_name);
    if src is not null then
      select s.id into sid
      from public.water_sources s
      left join public.water_source_aliases a on a.water_source_id = s.id
      where s.name = src or a.alias = src
      order by s.id
      limit 1;
      if sid is not null then
        new.water_source_id := sid;
      end if;
    end if;
  end if;
  return new;
end
$$;

create trigger trg_set_water_source_id
before insert or update on public.water_readings
for each row execute function public.trg_set_water_source_id();

-- 5) Canonical view for frontend (stable shape)
create or replace view public.v_water_readings_canonical as
select
  wr.id,
  wr.date,
  wr.reading,
  wr.comment,
  wr.photo_taken,
  wr.photo_url,
  wr.created_at,
  wr.water_source_id,
  coalesce(s.name, wr.component_type, wr.component_name) as source_name,
  coalesce(s.name, wr.component_type) as component_type,
  coalesce(s.name, wr.component_name) as component_name
from public.water_readings wr
left join public.water_sources s on s.id = wr.water_source_id;

-- 6) RLS policies (idempotent style)
alter table public.water_readings enable row level security;
alter table public.water_sources enable row level security;
alter table public.water_source_aliases enable row level security;
alter table public.reservoir_readings enable row level security;

-- Read for authenticated users
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='water_readings' and policyname='water_readings_select') then
    create policy water_readings_select on public.water_readings
      for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='water_sources' and policyname='water_sources_select') then
    create policy water_sources_select on public.water_sources
      for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='water_source_aliases' and policyname='water_source_aliases_select') then
    create policy water_source_aliases_select on public.water_source_aliases
      for select to authenticated using (true);
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='reservoir_readings' and policyname='reservoir_readings_select') then
    create policy reservoir_readings_select on public.reservoir_readings
      for select to authenticated using (true);
  end if;
end $$;

-- Write for admin/manager
do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='water_readings' and policyname='water_readings_write') then
    create policy water_readings_write on public.water_readings
      for insert to authenticated with check (exists (
        select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin','manager')
      ));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='water_readings' and policyname='water_readings_update') then
    create policy water_readings_update on public.water_readings
      for update to authenticated using (exists (
        select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin','manager')
      )) with check (exists (
        select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin','manager')
      ));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='water_readings' and policyname='water_readings_delete') then
    create policy water_readings_delete on public.water_readings
      for delete to authenticated using (exists (
        select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin','manager')
      ));
  end if;

  -- Sources & aliases admin-only writes
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='water_sources' and policyname='water_sources_write') then
    create policy water_sources_write on public.water_sources
      for all to authenticated using (exists (
        select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin'
      )) with check (exists (
        select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin'
      ));
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='water_source_aliases' and policyname='water_source_aliases_write') then
    create policy water_source_aliases_write on public.water_source_aliases
      for all to authenticated using (exists (
        select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin'
      )) with check (exists (
        select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'admin'
      ));
  end if;

  -- Reservoir writes for admin/manager
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='reservoir_readings' and policyname='reservoir_readings_write') then
    create policy reservoir_readings_write on public.reservoir_readings
      for all to authenticated using (exists (
        select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin','manager')
      )) with check (exists (
        select 1 from public.profiles p where p.user_id = auth.uid() and p.role in ('admin','manager')
      ));
  end if;
end $$;

-- 7) Grants for the canonical view (so anon/authenticated can read if desired)
grant select on public.v_water_readings_canonical to anon, authenticated;

commit;

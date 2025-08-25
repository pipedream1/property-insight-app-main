begin;

-- Extensions and helpers
create extension if not exists pgcrypto;
create extension if not exists vector;

-- Enum(s)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('owner','management','resident');
  end if;
end$$;

-- Updated-at trigger helper
create or replace function public.update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

-- contacts
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  surname text,
  name text,
  erf_no text,
  street_name text,
  street_number text,
  mobile text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.contacts enable row level security;
drop policy if exists "Users can view their own contacts" on public.contacts;
drop policy if exists "Users can create their own contacts" on public.contacts;
drop policy if exists "Users can update their own contacts" on public.contacts;
drop policy if exists "Users can delete their own contacts" on public.contacts;
create policy "Users can view their own contacts" on public.contacts
  for select using (auth.uid() = user_id);
create policy "Users can create their own contacts" on public.contacts
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own contacts" on public.contacts
  for update using (auth.uid() = user_id);
create policy "Users can delete their own contacts" on public.contacts
  for delete using (auth.uid() = user_id);
drop trigger if exists update_contacts_updated_at on public.contacts;
create trigger update_contacts_updated_at
  before update on public.contacts
  for each row execute function public.update_updated_at_column();

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone_number text,
  property_number text,
  role public.user_role not null default 'resident',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "Users can view/update own profile" on public.profiles;
create policy "Users can view/update own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- inspections
create table if not exists public.inspections (
  id uuid primary key default gen_random_uuid(),
  component_type text not null,
  component_name text not null,
  condition text not null,
  comment text,
  photo_url text,
  photo_taken boolean,
  inspector_name text,
  inspection_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.inspections enable row level security;
drop policy if exists "Authenticated can read inspections" on public.inspections;
drop policy if exists "Authenticated can write inspections" on public.inspections;
create policy "Authenticated can read inspections" on public.inspections
  for select using (auth.uid() is not null);
create policy "Authenticated can write inspections" on public.inspections
  for insert with check (auth.uid() is not null);
create policy "Authenticated can update inspections" on public.inspections
  for update using (auth.uid() is not null);
create policy "Authenticated can delete inspections" on public.inspections
  for delete using (auth.uid() is not null);
drop trigger if exists update_inspections_updated_at on public.inspections;
create trigger update_inspections_updated_at
  before update on public.inspections
  for each row execute function public.update_updated_at_column();

-- property_components
create table if not exists public.property_components (
  id serial primary key,
  component_type text,
  component_name text,
  condition text,
  comment text,
  date date,
  photo_url text,
  photo_taken boolean,
  created_at timestamptz not null default now()
);
alter table public.property_components enable row level security;
drop policy if exists "Authenticated can read components" on public.property_components;
drop policy if exists "Authenticated can write components" on public.property_components;
create policy "Authenticated can read components" on public.property_components
  for select using (auth.uid() is not null);
create policy "Authenticated can write components" on public.property_components
  for insert with check (auth.uid() is not null);
create policy "Authenticated can update components" on public.property_components
  for update using (auth.uid() is not null);
create policy "Authenticated can delete components" on public.property_components
  for delete using (auth.uid() is not null);

-- maintenance_tasks
create table if not exists public.maintenance_tasks (
  id uuid primary key default gen_random_uuid(),
  component_type text not null,
  component_name text,
  description text not null,
  priority text not null default 'medium',
  inspection_id integer references public.property_components(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);
alter table public.maintenance_tasks enable row level security;
drop policy if exists "Authenticated can read tasks" on public.maintenance_tasks;
drop policy if exists "Authenticated can write tasks" on public.maintenance_tasks;
create policy "Authenticated can read tasks" on public.maintenance_tasks
  for select using (auth.uid() is not null);
create policy "Authenticated can write tasks" on public.maintenance_tasks
  for insert with check (auth.uid() is not null);
create policy "Authenticated can update tasks" on public.maintenance_tasks
  for update using (auth.uid() is not null);
create policy "Authenticated can delete tasks" on public.maintenance_tasks
  for delete using (auth.uid() is not null);
drop trigger if exists update_maintenance_tasks_updated_at on public.maintenance_tasks;
create trigger update_maintenance_tasks_updated_at
  before update on public.maintenance_tasks
  for each row execute function public.update_updated_at_column();

-- maintenance_photos
create table if not exists public.maintenance_photos (
  id uuid primary key default gen_random_uuid(),
  maintenance_task_id uuid references public.maintenance_tasks(id) on delete cascade,
  photo_url text not null,
  description text,
  latitude double precision not null,
  longitude double precision not null,
  user_id uuid,
  created_at timestamptz default now()
);
alter table public.maintenance_photos enable row level security;
drop policy if exists "Authenticated can read photos" on public.maintenance_photos;
drop policy if exists "Authenticated can write photos" on public.maintenance_photos;
create policy "Authenticated can read photos" on public.maintenance_photos
  for select using (auth.uid() is not null);
create policy "Authenticated can write photos" on public.maintenance_photos
  for insert with check (auth.uid() is not null);
create policy "Authenticated can delete photos" on public.maintenance_photos
  for delete using (auth.uid() is not null);

-- location_tracks
create table if not exists public.location_tracks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  latitude double precision not null,
  longitude double precision not null,
  accuracy double precision,
  altitude double precision,
  heading double precision,
  speed double precision,
  timestamp timestamptz default now(),
  created_at timestamptz default now()
);
alter table public.location_tracks enable row level security;
drop policy if exists "Authenticated can read tracks" on public.location_tracks;
drop policy if exists "Authenticated can write tracks" on public.location_tracks;
create policy "Authenticated can read tracks" on public.location_tracks
  for select using (auth.uid() is not null);
create policy "Authenticated can write tracks" on public.location_tracks
  for insert with check (auth.uid() is not null);

-- water_readings
create table if not exists public.water_readings (
  id serial primary key,
  component_type text,
  component_name text,
  reading numeric,
  date date not null,
  comment text,
  photo_taken boolean,
  photo_url text,
  created_at timestamptz default now()
);
alter table public.water_readings enable row level security;
drop policy if exists "Authenticated can read water readings" on public.water_readings;
drop policy if exists "Authenticated can write water readings" on public.water_readings;
create policy "Authenticated can read water readings" on public.water_readings
  for select using (auth.uid() is not null);
create policy "Authenticated can write water readings" on public.water_readings
  for insert with check (auth.uid() is not null);
create policy "Authenticated can update water readings" on public.water_readings
  for update using (auth.uid() is not null);
create policy "Authenticated can delete water readings" on public.water_readings
  for delete using (auth.uid() is not null);

-- reservoir_readings (public)
create table if not exists public.reservoir_readings (
  id uuid primary key default gen_random_uuid(),
  reading_date date not null default current_date,
  water_level numeric not null,
  percentage_full numeric not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.reservoir_readings enable row level security;
do $$
declare pol text;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'reservoir_readings'
  loop
    execute format('drop policy if exists "%s" on public.reservoir_readings', pol);
  end loop;
end $$;
create policy "Public can view reservoir readings" on public.reservoir_readings for select using (true);
create policy "Public can create reservoir readings" on public.reservoir_readings for insert with check (true);
create policy "Public can update reservoir readings" on public.reservoir_readings for update using (true);
create policy "Public can delete reservoir readings" on public.reservoir_readings for delete using (true);
drop trigger if exists update_reservoir_readings_updated_at on public.reservoir_readings;
create trigger update_reservoir_readings_updated_at
  before update on public.reservoir_readings
  for each row execute function public.update_updated_at_column();

-- reports
create table if not exists public.reports (
  id serial primary key,
  type text,
  name text,
  month text,
  year text,
  status text,
  file_url text,
  data jsonb,
  created_at timestamptz not null default now()
);
alter table public.reports enable row level security;
drop policy if exists "Authenticated can read reports" on public.reports;
drop policy if exists "Authenticated can write reports" on public.reports;
create policy "Authenticated can read reports" on public.reports
  for select using (auth.uid() is not null);
create policy "Authenticated can write reports" on public.reports
  for insert with check (auth.uid() is not null);
create policy "Authenticated can update reports" on public.reports
  for update using (auth.uid() is not null);
create policy "Authenticated can delete reports" on public.reports
  for delete using (auth.uid() is not null);

-- pdf_chunks
create table if not exists public.pdf_chunks (
  id serial primary key,
  content text,
  embedding text,
  source_file text
);
alter table public.pdf_chunks enable row level security;
drop policy if exists "Authenticated can read pdf_chunks" on public.pdf_chunks;
drop policy if exists "Authenticated can write pdf_chunks" on public.pdf_chunks;
create policy "Authenticated can read pdf_chunks" on public.pdf_chunks
  for select using (auth.uid() is not null);
create policy "Authenticated can write pdf_chunks" on public.pdf_chunks
  for insert with check (auth.uid() is not null);
create policy "Authenticated can delete pdf_chunks" on public.pdf_chunks
  for delete using (auth.uid() is not null);

-- WhatsApp config & messages
create table if not exists public.whatsapp_config (
  id serial primary key,
  phone_number text not null,
  api_key text not null,
  webhook_url text not null,
  enable_auto_responder boolean default false,
  auto_response text,
  created_at timestamptz default now()
);
alter table public.whatsapp_config enable row level security;
drop policy if exists "Authenticated can read whatsapp_config" on public.whatsapp_config;
drop policy if exists "Authenticated can write whatsapp_config" on public.whatsapp_config;
create policy "Authenticated can read whatsapp_config" on public.whatsapp_config
  for select using (auth.uid() is not null);
create policy "Authenticated can write whatsapp_config" on public.whatsapp_config
  for insert with check (auth.uid() is not null);
create policy "Authenticated can update whatsapp_config" on public.whatsapp_config
  for update using (auth.uid() is not null);
create policy "Authenticated can delete whatsapp_config" on public.whatsapp_config
  for delete using (auth.uid() is not null);

create table if not exists public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  from_number text not null,
  from_name text,
  to_number text not null,
  content text not null,
  direction text not null,
  status text,
  created_at timestamptz default now()
);
alter table public.whatsapp_messages enable row level security;
drop policy if exists "Authenticated can read whatsapp_messages" on public.whatsapp_messages;
drop policy if exists "Authenticated can write whatsapp_messages" on public.whatsapp_messages;
create policy "Authenticated can read whatsapp_messages" on public.whatsapp_messages
  for select using (auth.uid() is not null);
create policy "Authenticated can write whatsapp_messages" on public.whatsapp_messages
  for insert with check (auth.uid() is not null);

commit;

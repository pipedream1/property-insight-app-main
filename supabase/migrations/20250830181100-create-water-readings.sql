-- Create table for water readings with canonical columns used by the app
-- Idempotent: checks existence before creating table, indexes, and policies

do $$ begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'water_readings'
  ) then
    create table public.water_readings (
      id serial primary key,
      component_type text null,
      component_name text null,
      reading numeric null,
      date date not null,
      comment text null,
      photo_taken boolean null,
      photo_url text null,
      created_at timestamp with time zone null default now()
    ) tablespace pg_default;
  end if;
end $$;

-- Helpful indexes for sorting and analytics
create index if not exists water_readings_date_idx on public.water_readings (date);
create index if not exists water_readings_component_type_date_idx on public.water_readings (component_type, date);
create index if not exists water_readings_component_name_date_idx on public.water_readings (component_name, date);

-- Enable Row Level Security and allow authenticated app users to read/write
alter table public.water_readings enable row level security;

-- Read policy
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'water_readings' and polname = 'Allow authenticated read water_readings'
  ) then
    create policy "Allow authenticated read water_readings"
      on public.water_readings
      for select
      to authenticated
      using (true);
  end if;
end $$;

-- Insert policy
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'water_readings' and polname = 'Allow authenticated insert water_readings'
  ) then
    create policy "Allow authenticated insert water_readings"
      on public.water_readings
      for insert
      to authenticated
      with check (true);
  end if;
end $$;

-- Update policy
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'water_readings' and polname = 'Allow authenticated update water_readings'
  ) then
    create policy "Allow authenticated update water_readings"
      on public.water_readings
      for update
      to authenticated
      using (true)
      with check (true);
  end if;
end $$;

-- (Optional) Delete policy, uncomment if needed by the app
-- do $$ begin
--   if not exists (
--     select 1 from pg_policies where schemaname = 'public' and tablename = 'water_readings' and polname = 'Allow authenticated delete water_readings'
--   ) then
--     create policy "Allow authenticated delete water_readings"
--       on public.water_readings
--       for delete
--       to authenticated
--       using (true);
--   end if;
-- end $$;

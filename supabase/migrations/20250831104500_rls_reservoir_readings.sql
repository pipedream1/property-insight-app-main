-- Tighten RLS for reservoir_readings: read for authenticated, write only for owner/management

alter table if exists public.reservoir_readings enable row level security;

-- Recreate policies idempotently using profiles.role to avoid custom function dependencies
do $$
begin
  -- Drop and recreate read policy
  if exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'reservoir_readings' and policyname = 'allow_read_reservoir_to_authenticated'
  ) then
    drop policy allow_read_reservoir_to_authenticated on public.reservoir_readings;
  end if;

  create policy allow_read_reservoir_to_authenticated
    on public.reservoir_readings
    for select
    to authenticated
    using (true);

  -- Drop and recreate write policy gated by profiles.role
  if exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'reservoir_readings' and policyname = 'allow_write_reservoir_to_admins'
  ) then
    drop policy allow_write_reservoir_to_admins on public.reservoir_readings;
  end if;

  create policy allow_write_reservoir_to_admins
    on public.reservoir_readings
    for all
    to authenticated
    using (exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('owner','management')
    ))
    with check (exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('owner','management')
    ));
end;
$$;

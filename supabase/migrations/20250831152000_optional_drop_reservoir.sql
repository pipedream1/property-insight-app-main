-- Optional: Drop reservoir_readings if you don't need reservoir tracking
-- Safe to run multiple times
begin;

do $$
begin
  if exists (
    select 1 from information_schema.tables 
    where table_schema='public' and table_name='reservoir_readings'
  ) then
    drop table public.reservoir_readings cascade;
  end if;
exception when others then
  raise notice 'optional_drop_reservoir: %', sqlerrm;
end $$;

commit;

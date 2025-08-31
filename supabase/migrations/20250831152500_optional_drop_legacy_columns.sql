-- Optional: Remove legacy string columns from water_readings after UI uses water_source_id exclusively
begin;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='water_readings' and column_name='component_type'
  ) then
    alter table public.water_readings drop column component_type;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='water_readings' and column_name='component_name'
  ) then
    alter table public.water_readings drop column component_name;
  end if;
exception when others then
  raise notice 'optional_drop_legacy_columns: %', sqlerrm;
end $$;

commit;

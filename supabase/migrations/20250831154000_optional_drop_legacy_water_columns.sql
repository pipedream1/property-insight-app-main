-- Optional: Drop legacy component_type and component_name columns from water_readings
-- Run this AFTER confirming the UI is writing water_source_id correctly
-- and the database trigger is working properly.

begin;

-- Verify we have water_source_id populated for all rows
do $$
begin
  if exists (
    select 1 from public.water_readings where water_source_id is null limit 1
  ) then
    raise exception 'Found water_readings rows with null water_source_id. Cannot drop legacy columns.';
  end if;
end $$;

-- Drop the legacy columns
alter table public.water_readings 
drop column if exists component_type,
drop column if exists component_name;

commit;

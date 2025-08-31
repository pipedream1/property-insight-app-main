-- Create or replace canonical view for water readings
-- Provides stable source_name joined from water_sources via water_source_id

create or replace view public.v_water_readings_canonical as
select
  wr.*,
  coalesce(s.canonical_name, wr.component_type, wr.component_name) as source_name
from public.water_readings wr
left join public.water_sources s
  on s.id = wr.water_source_id;

-- Grant read access to standard roles used by Supabase
grant select on public.v_water_readings_canonical to anon, authenticated;

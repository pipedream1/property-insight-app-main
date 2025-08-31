-- Auto-fill water_source_id on insert/update based on canonical names/aliases
-- and enforce NOT NULL when there are no NULLs remaining.

create or replace function public.set_water_source_id_from_labels()
returns trigger
language plpgsql
as $$
begin
  if new.water_source_id is not null then
    return new;
  end if;

  with candidate as (
    select s.id
    from public.water_sources s
    left join public.water_source_aliases a
      on a.water_source_id = s.id
    where lower(coalesce(new.component_type, new.component_name)) in (
      lower(s.canonical_name), lower(a.alias)
    )
    limit 1
  )
  select id into new.water_source_id from candidate;

  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'trg_set_water_source_id_from_labels'
  ) then
    create trigger trg_set_water_source_id_from_labels
    before insert or update of component_type, component_name
    on public.water_readings
    for each row
    execute function public.set_water_source_id_from_labels();
  end if;
end;
$$;

-- Enforce NOT NULL when safe (no remaining NULLs)
do $$
declare
  null_count bigint;
begin
  select count(*) into null_count from public.water_readings where water_source_id is null;
  if null_count = 0 then
    begin
      alter table public.water_readings
        alter column water_source_id set not null;
    exception when others then
      -- ignore if already NOT NULL or column missing in older environments
      null;
    end;
  end if;
end;
$$;

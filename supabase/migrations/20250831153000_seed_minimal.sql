-- Minimal seed: admin profile + baseline water sources and example aliases
-- Replace the UUID below with your auth.uid() after you sign in at least once.

begin;

-- 1) Admin profile (replace with your actual user_id)
-- insert into public.profiles(user_id, role) values ('00000000-0000-0000-0000-000000000000', 'admin')
-- on conflict (user_id) do update set role = excluded.role;

-- 2) Baseline sources
insert into public.water_sources(name) values
  ('Borehole 2'),
  ('Borehole 3'),
  ('Borehole 4'),
  ('Knysna Water')
on conflict (name) do nothing;

-- 3) Example aliases (adjust to your historic labels)
insert into public.water_source_aliases(water_source_id, alias)
select s.id, a.alias
from (
  values
    ('Borehole 2','BH 2'),
    ('Borehole 3','BH 3'),
    ('Borehole 4','BH 4'),
    ('Knysna Water','Municipal Water')
) as a(src, alias)
join public.water_sources s on s.name = a.src
on conflict (alias) do nothing;

commit;

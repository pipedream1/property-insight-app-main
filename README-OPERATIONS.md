# Operational Cookbook

This document describes day-2 operations for the Property Insight app in production.

## Login & Access
- Roles: `owner`, `management`, `resident` (least privilege)
- Supabase Auth is used. Ensure user records map to correct `profiles.role`.

## Data Entry
- Water readings: use the dashboard Add Reading dialog.
- Reservoir readings: accessible to `owner/management` due to RLS.

## Reports
- Monthly water usage report is generated from canonicalized readings.
- PDF export aligns with dashboard (baseline + positive deltas).

## Expected Outcomes
- All sources display even with 0 usage in a month.
- Units are kL across charts, cards, and PDFs.

## Seeding (non-prod)
1. Create `water_sources` rows for each canonical source.
2. Add `water_source_aliases` as needed.
3. Insert a few `water_readings` per source over 2–3 months.

## Backups
- Enable daily backups in Supabase. Test restore quarterly.

## Monitoring
- Supabase: enable alerts for errors and RLS denials.
- Cloudflare Worker: set up a heartbeat URL check.

## Deployment
- Build: `npm run build`
- Deploy Worker: `npm run deploy:worker`
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Troubleshooting
- If a new label isn’t recognized, add an alias in `water_source_aliases`.
- If duplicates on same date appear, the unique index on `(water_source_id, date)` blocks it—adjust data as needed.

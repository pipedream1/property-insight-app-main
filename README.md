# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/2b44bfe9-1a79-4706-a3b8-518e0074f890

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2b44bfe9-1a79-4706-a3b8-518e0074f890) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Environment configuration (Supabase)

This app now reads Supabase credentials from environment variables to make switching projects seamless.

Set these variables in your environment (local `.env`, Cloudflare Pages, or CI):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

See `.env.example` for a template. For Supabase Edge Functions, set secrets (in the Supabase dashboard) like:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` (e.g. `gpt-5-mini`)

### Migrating to a new Supabase project

1. Backup current data: in the old Supabase project, use Table Editor export or `supabase db dump`.
2. Create the new project, then import schema and data:
	- Run SQL from `supabase/migrations` to recreate schema.
	- Import CSVs or use `supabase db reset && supabase db push` depending on your workflow.
3. Deploy Edge Functions in the new project and set function secrets.
4. Update environment variables (above) for each environment (local, preview, production).
5. Smoke test: app login, water readings list, reports, AI insights.

Tip: keep old read-only credentials around temporarily to verify data parity.

### Optional helpers (scripts/migrate)

- Copy database tables: edit `scripts/migrate/tables.example.json` → save as `tables.json` and list the tables you want to copy.
- Then run (PowerShell):

```
$env:OLD_SUPABASE_URL="https://OLD.supabase.co"
$env:OLD_SUPABASE_SERVICE_ROLE_KEY="<old-service-role>"
$env:NEW_SUPABASE_URL="https://NEW.supabase.co"
$env:NEW_SUPABASE_SERVICE_ROLE_KEY="<new-service-role>"
node scripts/migrate/db-copy.mjs
```

- Copy Storage buckets/objects:

```
$env:OLD_SUPABASE_URL="https://OLD.supabase.co"
$env:OLD_SUPABASE_SERVICE_ROLE_KEY="<old-service-role>"
$env:NEW_SUPABASE_URL="https://NEW.supabase.co"
$env:NEW_SUPABASE_SERVICE_ROLE_KEY="<new-service-role>"
node scripts/migrate/storage-migrate.mjs
```

## How can I deploy this project?

Use Cloudflare Pages:

- Framework preset: Vite
- Build command: `npm ci && npm run build`
- Output directory: `dist`
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

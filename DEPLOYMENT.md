# Deployment Guide - Property Insight Dashboard

## Overview
This guide covers deploying the Property Insight Dashboard to production, including Supabase database setup and Cloudflare Worker hosting.

## Prerequisites
- GitHub account with repository access
- Supabase account and project
- Cloudflare account
- Node.js 18+ installed locally

## Step 1: Supabase Database Setup

### 1.1 Set up GitHub Secrets for Automated Migrations
1. Get your Supabase database connection string:
   - Go to Supabase Dashboard → Settings → Database
   - Find "Connection string" → "URI" (Direct connection)
   - Copy the full PostgreSQL URI (ensure it ends with `?sslmode=require`)

2. Add GitHub repository secret:
   - Go to GitHub → Repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `SUPABASE_DB_URL`
   - Value: Your PostgreSQL connection string
   - Save

### 1.2 Run Database Migrations
1. Push to trigger migrations (or run manually):
   - GitHub → Actions → "Supabase Migrations" → "Run workflow"
   - Monitor the workflow to ensure all migrations apply successfully

2. Run the seed script:
   - In GitHub Actions, run the "seed-minimal" job
   - OR manually run the seed SQL in Supabase SQL editor

### 1.3 Configure User Profiles
1. Create admin profile:
   ```sql
   INSERT INTO public.profiles (user_id, role) 
   VALUES ('your-auth-user-uuid', 'admin');
   ```

2. Set up water sources and aliases as needed:
   ```sql
   -- Sources should be created by the migration, but verify:
   SELECT * FROM public.water_sources;
   SELECT * FROM public.water_source_aliases;
   ```

## Step 2: Frontend Environment Setup

### 2.1 Environment Variables
Create `.env.local` file (copy from `.env.example`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2.2 Build and Test Locally
```bash
npm install
npm run build
npm run preview  # Test production build locally
```

## Step 3: Cloudflare Worker Deployment

### 3.1 Configure Cloudflare
1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler auth login
   ```

### 3.2 Deploy to Cloudflare Workers
```bash
npm run deploy:worker
```

This will:
- Build the React app for production
- Deploy to Cloudflare Workers
- Return the deployed URL

### 3.3 Configure Custom Domain (Optional)
1. In Cloudflare dashboard, go to Workers & Pages
2. Find your deployed worker
3. Go to Settings → Triggers → Add Custom Domain
4. Configure your domain and SSL

## Step 4: Supabase Edge Functions (Optional)

### 4.1 Configure OpenAI Integration
1. Get OpenAI API key from https://platform.openai.com/api-keys
2. In Supabase Dashboard → Edge Functions → Secrets:
   ```
   OPENAI_API_KEY=your-openai-api-key
   OPENAI_MODEL=gpt-4o-mini
   ```

### 4.2 Deploy Edge Functions
```bash
# From project root
supabase functions deploy --no-verify-jwt
```

## Step 5: Post-Deployment Verification

### 5.1 Health Checks
1. Visit your deployed URL + `/health` to verify:
   - Supabase connection works
   - Authentication works (after login)
   - Database queries succeed

### 5.2 Feature Testing
1. **Authentication**: Sign up/login works
2. **Water Readings**: Add/edit readings work
3. **Monthly Usage**: Charts display correctly
4. **Reports**: PDF generation works
5. **Role Permissions**: Admin/manager/viewer roles work correctly

## Step 6: Monitoring and Maintenance

### 6.1 Set Up Monitoring
1. **Cloudflare Analytics**: Enable in Worker dashboard
2. **Supabase Monitoring**: Enable alerts for errors
3. **Database Backups**: Enable daily backups in Supabase

### 6.2 Regular Maintenance
1. **Database**: Monitor storage and performance
2. **Migrations**: New schema changes auto-deploy via GitHub Actions
3. **Dependencies**: Regular updates via Dependabot
4. **Error Monitoring**: Check Cloudflare and Supabase logs weekly

## Troubleshooting

### Common Issues
1. **Migration Failures**: Check SUPABASE_DB_URL secret is correct
2. **Auth Issues**: Verify Supabase URL/keys in environment
3. **Deployment Fails**: Check build errors, ensure dependencies are installed
4. **RLS Denials**: Verify user profiles have correct roles
5. **Water Sources Missing**: Run the seed script or manually insert sources

### Debug Commands
```bash
# Check build issues
npm run build

# Test Supabase connection locally
npm run dev
# Then visit localhost:5173/health

# Verify migrations applied
# In Supabase SQL editor:
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

## Security Considerations
1. **Environment Variables**: Never commit .env files
2. **API Keys**: Use Supabase secrets for sensitive data
3. **RLS Policies**: Review and test role-based access
4. **Database Backups**: Enable and test restore procedures
5. **HTTPS**: Ensure all traffic uses SSL/TLS

## Performance Optimization
1. **CDN**: Cloudflare provides global CDN automatically
2. **Database**: Monitor slow queries in Supabase
3. **Caching**: Consider Redis for high-traffic scenarios
4. **Images**: Optimize image uploads and storage

---

## Quick Deployment Checklist

- [ ] SUPABASE_DB_URL GitHub secret configured
- [ ] Database migrations applied successfully
- [ ] Admin user profile created
- [ ] .env.local configured with correct Supabase credentials
- [ ] Local build test passes (`npm run build`)
- [ ] Deployed to Cloudflare Worker (`npm run deploy:worker`)
- [ ] Health check passes at deployed URL + `/health`
- [ ] Core features tested (auth, readings, reports)
- [ ] Monitoring configured
- [ ] Documentation updated with deployment URL

For issues or questions, refer to the README-OPERATIONS.md file or check the GitHub Issues section.

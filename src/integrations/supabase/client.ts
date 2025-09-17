
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Read credentials from environment variables so switching projects is a config change, not a code change.
// In Vite, variables must be prefixed with VITE_ to be exposed to the client bundle.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  // Surface a clear message during local dev and at runtime if env is missing
  const missing = [
    !SUPABASE_URL ? 'VITE_SUPABASE_URL' : null,
    !SUPABASE_PUBLISHABLE_KEY ? 'VITE_SUPABASE_ANON_KEY' : null,
  ].filter(Boolean).join(', ');
  console.error(`Supabase env missing: ${missing}. Please set them in your environment (.env, Pages env, or CI).`);
  throw new Error('Supabase environment variables are not configured');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

try {
  const host = new URL(SUPABASE_URL).host;
  console.log(`[Supabase] Client initialized for host: ${host}`);
} catch {
  // no-op
}

// Add custom type for reports until Supabase types are updated
export type ReportType = {
  id: string;
  type: 'water' | 'component';
  name: string;
  month: string;
  year: string; // Changed from number to string to match database schema
  created_at: string;
  file_url?: string;
  status: 'pending' | 'completed' | 'failed';
  data?: unknown;
}

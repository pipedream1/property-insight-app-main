import { supabase } from './client';

// Minimal runtime diagnostics to help pinpoint connectivity/config issues.
export function getSupabaseConfigSummary() {
  try {
    // Extract host without exposing secrets. Use env as the source of truth.
    const urlEnv = (import.meta as unknown as { env?: Record<string, string> })?.env?.VITE_SUPABASE_URL;
    const url: string = typeof urlEnv === 'string' ? urlEnv : '';
    const host = url ? new URL(String(url)).host : 'unknown';
    const isHttps = url ? new URL(String(url)).protocol === 'https:' : false;
    if (!isHttps && url) {
      console.warn(`[Supabase] VITE_SUPABASE_URL is not HTTPS: ${url}. This may cause CORS/network errors. Update to https://<project>.supabase.co`);
    }
    return { host, isHttps };
  } catch (e) {
    console.warn('[Supabase] Invalid VITE_SUPABASE_URL format:', e);
    return { host: 'unknown', isHttps: false };
  }
}

export async function pingSupabaseAuthHealth(timeoutMs = 4000): Promise<{
  ok: boolean;
  status?: number;
  error?: string;
}> {
  try {
    // Prefer environment variable for base URL to avoid depending on internals
    const envObj = import.meta as unknown as { env?: Record<string, string> };
    const baseUrl: string | undefined = envObj?.env?.VITE_SUPABASE_URL;
    if (!baseUrl) return { ok: false, error: 'Missing Supabase URL' };
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort('timeout'), timeoutMs);

    const target = `${baseUrl.replace(/\/$/, '')}/auth/v1/health`;
    const res = await fetch(target, { method: 'GET', signal: controller.signal });
    clearTimeout(timer);
    return { ok: res.ok, status: res.status, error: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export function isLikelyNetworkError(message: string | undefined | null): boolean {
  if (!message) return false;
  const m = message.toLowerCase();
  return (
    m.includes('failed to fetch') ||
    m.includes('fetch failed') ||
    m.includes('networkerror') ||
    m.includes('network error') ||
    m.includes('cors') ||
    m.includes('ssl') ||
    m.includes('certificate') ||
    m.includes('blocked by client') ||
    m.includes('dns') ||
    m.includes('typeerror')
  );
}

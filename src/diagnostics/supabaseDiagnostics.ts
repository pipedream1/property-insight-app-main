/*
  Runtime diagnostics for Supabase environment and basic network availability.
  Triggered automatically at startup, and can render a panel if ?diag=1 is present.
*/
import { toast } from '@/hooks/use-toast';

interface PingResult {
  ok: boolean;
  status?: number;
  errorCategory?: 'network' | 'dns' | 'cors' | 'other';
  errorMessage?: string;
  ts: number;
}

const STATE: {
  envIssues: string[];
  ping?: PingResult;
  lastRun?: number;
} = { envIssues: [] };

function classifyNetworkError(message: string): PingResult['errorCategory'] {
  const m = message.toLowerCase();
  if (m.includes('dns') || m.includes('name not resolved')) return 'dns';
  if (m.includes('cors')) return 'cors';
  if (m.includes('network') || m.includes('failed to fetch')) return 'network';
  return 'other';
}

async function pingRestEndpoint(url: string): Promise<PingResult> {
  const ts = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    const resp = await fetch(`${url.replace(/\/$/, '')}/rest/v1/`, {
      method: 'GET',
      headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || '' },
      mode: 'cors',
      signal: controller.signal
    });
    clearTimeout(timer);
    return { ok: resp.ok || resp.status === 404, status: resp.status, ts };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, errorCategory: classifyNetworkError(msg), errorMessage: msg, ts };
  }
}

function validateEnv() {
  STATE.envIssues = [];
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url) STATE.envIssues.push('VITE_SUPABASE_URL missing');
  else if (!/^https:\/\/.*\.supabase\.co\/?$/.test(url)) STATE.envIssues.push('Supabase URL format invalid');
  if (!key) STATE.envIssues.push('VITE_SUPABASE_ANON_KEY missing');
  else if (key.length < 60) STATE.envIssues.push('Anon key length suspicious (<60)');
}

function injectBanner(message: string, color = '#b00020') {
  const id = 'supabase-env-banner';
  if (document.getElementById(id)) return;
  const div = document.createElement('div');
  div.id = id;
  div.style.cssText = `position:fixed;z-index:99999;bottom:10px;right:10px;max-width:320px;` +
    `background:${color};color:#fff;padding:10px 12px;font:12px/1.3 system-ui;border-radius:6px;` +
    `box-shadow:0 2px 6px rgba(0,0,0,.25);`; 
  div.textContent = message;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 20000);
}

function maybeRenderPanel() {
  if (!window.location.search.includes('diag=1')) return;
  const existing = document.getElementById('supabase-diagnostics-panel');
  if (existing) return;
  const panel = document.createElement('div');
  panel.id = 'supabase-diagnostics-panel';
  panel.style.cssText = 'position:fixed;top:10px;right:10px;z-index:99998;background:#0f172a;color:#f8fafc;'+
    'padding:16px;border-radius:8px;font:12px system-ui;max-width:360px;overflow:auto;max-height:80vh;box-shadow:0 4px 18px rgba(0,0,0,.4);';
  const url = import.meta.env.VITE_SUPABASE_URL || '—';
  const keyLen = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').length;
  const refMatch = url.match(/https:\/\/([a-z0-9-]+)\.supabase\.co/i);
  const projectRef = refMatch ? refMatch[1] : 'unknown';
  const ping = STATE.ping;
  const envList = STATE.envIssues.length ? STATE.envIssues.join(', ') : 'None';

  panel.innerHTML = `<strong>Supabase Diagnostics</strong><br/>` +
    `<div style='margin-top:6px'>Project Ref: <code>${projectRef}</code></div>` +
    `<div>URL: <code>${url}</code></div>` +
    `<div>Anon Key Length: ${keyLen}</div>` +
    `<div>Env Issues: ${envList}</div>` +
    `<div style='margin-top:6px'>Ping: ${ping ? (ping.ok ? 'OK':'FAIL') : '—'} ` +
    `${ping?.status ? '(status '+ping.status+')' : ''} ` +
    `${ping?.errorCategory ? '['+ping.errorCategory+']' : ''}</div>` +
    `${ping?.errorMessage ? `<div style='white-space:pre-wrap;margin-top:4px'>${ping.errorMessage}</div>`:''}` +
    `<div style='margin-top:8px;font-size:11px;opacity:.8'>Add ?diag=1 to URL anytime. Closes with ESC.</div>`;

  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') panel.remove(); });
  document.body.appendChild(panel);
}

let started = false;
export async function runSupabaseDiagnostics() {
  if (started) return; started = true;
  validateEnv();
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (STATE.envIssues.length) {
    injectBanner('Supabase config issue: ' + STATE.envIssues.join('; '));
  toast({ variant: 'destructive', title: 'Supabase env issues detected', description: STATE.envIssues.join('; ') });
  }
  if (url && STATE.envIssues.length === 0) {
    STATE.ping = await pingRestEndpoint(url);
    if (!STATE.ping.ok) {
      const cat = STATE.ping.errorCategory;
      const msg = cat === 'dns' ? 'DNS issue reaching Supabase' : cat === 'network' ? 'Network error reaching Supabase' : 'Supabase fetch failed';
      injectBanner(`${msg}${STATE.ping.status ? ' (status '+STATE.ping.status+')':''}`);
  toast({ variant: 'destructive', title: msg });
    } else {
      console.log('[Supabase Diagnostics] REST endpoint reachable', STATE.ping);
    }
  }
  maybeRenderPanel();
}

// Allow manual re-run from console
// @ts-expect-error adding for debug
window.__runSupabaseDiagnostics = runSupabaseDiagnostics;

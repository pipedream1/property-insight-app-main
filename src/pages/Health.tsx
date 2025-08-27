import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Status = 'idle' | 'ok' | 'error';

export default function Health() {
  const [publicStatus, setPublicStatus] = useState<Status>('idle');
  const [publicDetail, setPublicDetail] = useState<string>('');
  const [authStatus, setAuthStatus] = useState<Status>('idle');
  const [authDetail, setAuthDetail] = useState<string>('');

  useEffect(() => {
    // Public read test against reservoir_readings (policies allow anon)
    (async () => {
      try {
        const { data, error } = await supabase
          .from('reservoir_readings')
          .select('id, reading_date')
          .limit(1);
        if (error) throw error;
        setPublicStatus('ok');
        setPublicDetail(`rows: ${data?.length ?? 0}`);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setPublicStatus('error');
        setPublicDetail(msg);
      }
    })();

    // Auth + RLS test (only succeeds if logged in)
    (async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser();
        if (!userRes?.user) {
          setAuthStatus('error');
          setAuthDetail('No active session; login required for RLS-protected tables');
          return;
        }
        const { error } = await supabase
          .from('contacts')
          .select('id')
          .limit(1);
        if (error) throw error;
        setAuthStatus('ok');
        setAuthDetail('Authenticated query succeeded');
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setAuthStatus('error');
        setAuthDetail(msg);
      }
    })();
  }, []);

  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const urlHost = (() => {
    try { return url ? new URL(url).host : 'not set'; } catch { return url ?? 'not set'; }
  })();

  const Badge = ({ s }: { s: Status }) => (
    <span style={{
      padding: '2px 8px',
      borderRadius: 8,
      fontSize: 12,
      background: s === 'ok' ? '#DCFCE7' : s === 'error' ? '#FEE2E2' : '#E5E7EB',
      color: s === 'ok' ? '#166534' : s === 'error' ? '#991B1B' : '#1F2937',
      border: '1px solid #D1D5DB'
    }}>{s.toUpperCase()}</span>
  );

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Connectivity Health</h1>
      <p style={{ color: '#4B5563', marginBottom: 24 }}>
        Supabase URL host: <strong>{urlHost}</strong>
      </p>

      <div style={{ display: 'grid', gap: 16 }}>
        <section style={{ padding: 12, border: '1px solid #E5E7EB', borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Public read (reservoir_readings)</h2>
            <Badge s={publicStatus} />
          </div>
          <p style={{ marginTop: 8, color: '#374151', whiteSpace: 'pre-wrap' }}>{publicDetail}</p>
        </section>

        <section style={{ padding: 12, border: '1px solid #E5E7EB', borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Authenticated read (contacts)</h2>
            <Badge s={authStatus} />
          </div>
          <p style={{ marginTop: 8, color: '#374151', whiteSpace: 'pre-wrap' }}>{authDetail}</p>
        </section>
      </div>
    </div>
  );
}

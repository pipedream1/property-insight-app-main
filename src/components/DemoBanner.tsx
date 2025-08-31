import React from 'react';

export default function DemoBanner() {
  const demo = (import.meta.env.VITE_DEMO_MODE as string | undefined)?.toString() === 'true';
  if (!demo) return null;
  return (
    <div style={{
      background: '#FFFBEB',
      borderBottom: '1px solid #FDE68A',
      color: '#92400E',
      padding: '8px 16px',
      fontSize: 14,
      textAlign: 'center'
    }}>
      Demo mode is ON — writes may be limited and activity is for demonstration only.
    </div>
  );
}

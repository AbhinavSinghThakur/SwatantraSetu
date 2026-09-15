export default function StatCard({ label, value, hint, tone = 'default' }) {
  const tones = {
    default: { bg: '#fff', accent: 'var(--brand)' },
    green: { bg: 'var(--coop-soft)', accent: 'var(--coop)' },
    blue: { bg: 'var(--brand-soft)', accent: 'var(--brand)' },
    warn: { bg: 'var(--warn-soft)', accent: 'var(--warn)' },
  };
  const t = tones[tone] || tones.default;
  return (
    <div className="card" style={{ padding: '1rem 1.1rem', background: t.bg, borderColor: 'transparent' }}>
      <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontSize: '1.55rem', fontWeight: 800, color: t.accent, marginTop: '0.25rem' }}>{value}</div>
      {hint && <div style={{ fontSize: '0.8rem', color: 'var(--ink-soft)', marginTop: '0.25rem' }}>{hint}</div>}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { AlertOctagon, Navigation } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatCard from '../../components/StatCard';
import SyncIndicator from '../../components/SyncIndicator';
import { formatINR, statusLabel } from '../../utils/format';

export default function WorkerDashboard() {
  const { user } = useAuth();
  const { online, syncNow, lowData, setLowData } = useApp();
  const [jobs, setJobs] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [availability, setAvailability] = useState('available');
  const [msg, setMsg] = useState('');

  const load = () => {
    api.bookings({ workerId: 'w1' }).then((r) => setJobs(r.data || [])).catch(() => {});
    api.earnings('w1').then((r) => setEarnings(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const act = async (id, status) => {
    const offline = !online;
    await api.updateBookingStatus(id, status, offline);
    setMsg(offline ? `Saved offline: ${status}. Will sync later.` : `Job ${status}.`);
    load();
  };

  const sync = async () => {
    const res = await syncNow();
    setMsg(res.ok ? `Synced ${res.syncedCount || 0} offline actions` : 'Still offline');
    load();
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Worker home</h1>
          <p style={{ margin: '0.25rem 0 0' }}>{user?.name} · Delhi Labour Cooperative Society</p>
        </div>
        <button className="btn btn-danger" type="button" onClick={() => alert('SOS sent to cooperative response desk')}>
          <AlertOctagon size={16} /> Emergency SOS
        </button>
      </header>

      <SyncIndicator />
      {msg && <div className="badge badge-verified" style={{ marginTop: '0.75rem' }}>{msg}</div>}

      <div className="grid-4" style={{ margin: '1rem 0' }} id="earnings">
        <StatCard label="Today" value={formatINR(earnings?.today || 0)} tone="green" />
        <StatCard label="This week" value={formatINR(earnings?.week || 0)} tone="blue" />
        <StatCard label="This month" value={formatINR(earnings?.month || 0)} />
        <StatCard label="Pending payout" value={formatINR(earnings?.pendingPayout || 0)} tone="warn" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1rem' }} className="worker-grid">
        <section id="jobs" className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Job requests</h3>
            <button className="btn btn-secondary btn-sm" type="button" onClick={sync}>Sync queue</button>
          </div>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {jobs.map((j) => (
              <article key={j.id} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <strong>{j.customerName} · {j.service}</strong>
                  <span className="badge">{statusLabel(j.status)}</span>
                </div>
                <p style={{ margin: '0.35rem 0', fontSize: '0.9rem' }}>{j.notes || j.address}</p>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{formatINR(j.amount)} · {j.type} {j.offlineQueued ? '· offline queued' : ''}</div>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.65rem', flexWrap: 'wrap' }}>
                  {j.status === 'pending' && (
                    <>
                      <button className="btn btn-coop btn-sm" type="button" onClick={() => act(j.id, 'in_progress')}>Accept{!online ? ' (offline)' : ''}</button>
                      <button className="btn btn-secondary btn-sm" type="button" onClick={() => act(j.id, 'rejected')}>Reject</button>
                    </>
                  )}
                  {j.status === 'in_progress' && (
                    <>
                      <button className="btn btn-primary btn-sm" type="button"><Navigation size={14} /> Navigate</button>
                      <button className="btn btn-coop btn-sm" type="button" onClick={() => act(j.id, 'completed')}>Mark complete</button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <section id="availability" className="card" style={{ padding: '1rem' }}>
            <h3>Availability</h3>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['available', 'busy', 'offline'].map((a) => (
                <button
                  key={a}
                  type="button"
                  className={`btn btn-sm ${availability === a ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    setAvailability(a);
                    api.updateAvailability('w1', a).catch(() => {});
                  }}
                >
                  {statusLabel(a)}
                </button>
              ))}
            </div>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: '0.85rem' }}>
              <input type="checkbox" checked={lowData} onChange={(e) => setLowData(e.target.checked)} />
              Low-data mode (4G/5G+)
            </label>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>SMS fallback: reply YES/NO to job SMS when app data fails.</p>
          </section>

          <section className="card" style={{ padding: '1rem' }}>
            <h3>Earnings chart</h3>
            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer>
                <BarChart data={earnings?.chart || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4ebf3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#0B6E4F" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section id="profile" className="card" style={{ padding: '1rem' }}>
            <h3>Welfare & training</h3>
            <p>Insurance: Accident ✓ · Health ✓ · Welfare ✓</p>
            <p>Next training: Safety Level-3 · 22 Mar</p>
            <div style={{ height: 8, background: '#e4ebf3', borderRadius: 99 }}>
              <div style={{ width: '78%', height: '100%', background: '#0E4D92', borderRadius: 99 }} />
            </div>
            <small>Profile verification 78%</small>
          </section>
        </div>
      </div>
      <style>{`@media (max-width: 900px){ .worker-grid{ grid-template-columns:1fr !important; display:grid !important; } }`}</style>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, AlertTriangle } from 'lucide-react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import SyncIndicator from '../../components/SyncIndicator';
import { formatINR, statusLabel } from '../../utils/format';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    api.bookings().then((r) => setBookings(r.data || [])).catch(() => {});
    api.notifications().then((r) => setNotes(r.data || [])).catch(() => {});
  }, []);

  return (
    <div>
      <header style={headerStyle}>
        <div>
          <h1 style={{ margin: 0 }}>Namaste, {user?.name?.split(' ')[0]}</h1>
          <p style={{ margin: '0.25rem 0 0' }}>Customer home · Bookings · Messages · Profile</p>
        </div>
        <Link className="btn btn-primary" to="/find-worker">Book a service</Link>
      </header>

      <SyncIndicator />

      <div className="grid-4" style={{ margin: '1rem 0' }}>
        <StatCard label="Active bookings" value={bookings.filter((b) => ['pending', 'scheduled', 'in_progress'].includes(b.status)).length} tone="blue" />
        <StatCard label="Completed" value={bookings.filter((b) => b.status === 'completed').length} tone="green" />
        <StatCard label="Unread alerts" value={notes.filter((n) => n.unread).length} tone="warn" />
        <StatCard label="Emergency" value="SOS ready" hint="Trust & safety" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }} className="dash-grid">
        <section id="bookings" className="card" style={{ padding: '1rem' }}>
          <h3>Booking tracking</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {bookings.map((b) => (
              <article key={b.id} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <strong>{b.service} · {b.workerName}</strong>
                  <span className="badge">{statusLabel(b.status)}</span>
                </div>
                <p style={{ margin: '0.35rem 0', fontSize: '0.9rem' }}>{b.address}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--muted)' }}>
                  <span>{b.type} · {b.paymentMethod} · {b.paymentStatus}</span>
                  <strong style={{ color: 'var(--ink)' }}>{formatINR(b.amount)}</strong>
                </div>
                {b.etaMinutes && <div className="badge badge-verified" style={{ marginTop: '0.5rem' }}>ETA {b.etaMinutes} min</div>}
              </article>
            ))}
            {!bookings.length && <p>No bookings yet. <Link to="/find-worker">Find a worker</Link></p>}
          </div>
        </section>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <section id="messages" className="card" style={{ padding: '1rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Bell size={16} /> Notifications</h3>
            {notes.map((n) => (
              <div key={n.id} style={{ padding: '0.65rem 0', borderBottom: '1px solid var(--line)' }}>
                <strong>{n.title}</strong>
                <p style={{ margin: '0.2rem 0', fontSize: '0.88rem' }}>{n.body}</p>
                <small style={{ color: 'var(--muted)' }}>{n.time}</small>
              </div>
            ))}
          </section>
          <section id="profile" className="card" style={{ padding: '1rem' }}>
            <h3>Profile & preferences</h3>
            <p>{user?.email}</p>
            <p>Languages: English, Hindi · Voice search enabled</p>
            <p>Payments: UPI · Wallet · Card · Cash</p>
            <button className="btn btn-danger btn-sm" type="button"><AlertTriangle size={14} /> Report complaint</button>
          </section>
        </div>
      </div>
      <style>{`@media (max-width: 900px){ .dash-grid{ grid-template-columns:1fr !important; display:grid !important; } }`}</style>
    </div>
  );
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '1rem',
  alignItems: 'center',
  marginBottom: '1rem',
  flexWrap: 'wrap',
};

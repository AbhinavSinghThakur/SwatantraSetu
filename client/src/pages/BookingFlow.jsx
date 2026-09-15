import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/format';

export default function BookingFlow() {
  const { workerId } = useParams();
  const { user } = useAuth();
  const { online, cachedWorkers } = useApp();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(cachedWorkers.find((w) => w.id === workerId));
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    type: 'instant',
    address: 'B-42, Saket, New Delhi',
    notes: '',
    paymentMethod: 'UPI',
    scheduledAt: '',
  });
  const [booking, setBooking] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.worker(workerId).then((r) => setWorker(r.data)).catch(() => {});
  }, [workerId]);

  const submit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    try {
      const res = await api.createBooking({
        workerId,
        ...form,
        amount: form.type === 'emergency' ? (worker?.startingRate || 0) + 200 : worker?.startingRate,
        service: worker?.skill,
        offline: !online,
      });
      setBooking(res.data);
      setStep(3);
      if (res.data?.id) {
        try {
          const inv = await api.invoice(res.data.id);
          setInvoice(inv.data);
        } catch {
          /* optional */
        }
      }
    } catch (err) {
      setError(err.message || 'Could not create booking');
    }
  };

  if (!worker) return <section className="section"><div className="container">Loading worker…</div></section>;

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 className="section-title">Book {worker.name}</h1>
        <p className="section-lead">{worker.skill} · from {formatINR(worker.startingRate)} · {online ? 'Online booking' : 'Will queue offline & sync later'}</p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {[1, 2, 3].map((s) => (
            <span key={s} className={`badge ${step === s ? 'badge-verified' : ''}`}>Step {s}</span>
          ))}
        </div>

        {step === 1 && (
          <div className="card" style={{ padding: '1.25rem', display: 'grid', gap: '0.75rem' }}>
            <label>Booking type</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['instant', 'scheduled', 'emergency', 'recurring'].map((t) => (
                <button key={t} type="button" className={`btn btn-sm ${form.type === t ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setForm({ ...form, type: t })}>
                  {t}
                </button>
              ))}
            </div>
            {form.type === 'scheduled' && (
              <input type="datetime-local" style={field} value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
            )}
            <input style={field} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Service address" />
            <textarea style={field} rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Describe the issue" />
            <button className="btn btn-primary" type="button" onClick={() => setStep(2)}>Continue to payment</button>
          </div>
        )}

        {step === 2 && (
          <div className="card" style={{ padding: '1.25rem', display: 'grid', gap: '0.75rem' }}>
            <h3>Payment</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['UPI', 'Wallet', 'Card', 'Cash'].map((m) => (
                <button key={m} type="button" className={`btn btn-sm ${form.paymentMethod === m ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setForm({ ...form, paymentMethod: m })}>
                  {m}
                </button>
              ))}
            </div>
            <div className="card" style={{ padding: '0.9rem', background: '#f4f7fb' }}>
              <div>Service estimate: <strong>{formatINR(worker.startingRate)}</strong></div>
              {form.type === 'emergency' && <div>Emergency fee: <strong>{formatINR(200)}</strong></div>}
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '0.35rem' }}>Cooperative commission shown on invoice (typically 15%).</div>
            </div>
            {error && <div className="badge badge-danger">{error}</div>}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" type="button" onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" type="button" onClick={submit}>Confirm booking</button>
            </div>
          </div>
        )}

        {step === 3 && booking && (
          <div className="card" style={{ padding: '1.25rem' }}>
            <span className="badge badge-verified">Booking {booking.status}</span>
            <h3 style={{ marginTop: '0.75rem' }}>Request sent to {booking.workerName}</h3>
            <p>ID: {booking.id} · {booking.paymentMethod} · {booking.paymentStatus}</p>
            {booking.offlineQueued && <div className="badge badge-warn">Queued offline — will sync when online</div>}
            {invoice && (
              <div className="card" style={{ padding: '1rem', marginTop: '1rem', background: '#fff' }}>
                <strong>Digital invoice {invoice.invoiceId}</strong>
                <p>Subtotal {formatINR(booking.amount)} · Tax {formatINR(invoice.tax)} · Total {formatINR(invoice.total)}</p>
                <p style={{ fontSize: '0.85rem' }}>Worker share {invoice.workerSharePct}% · Cooperative commission {invoice.cooperativeCommissionPct}%</p>
              </div>
            )}
            <p style={{ marginTop: '0.75rem' }}>SMS status updates enabled for this booking.</p>
            <Link className="btn btn-primary" to="/app/customer">Go to dashboard</Link>
          </div>
        )}
      </div>
    </section>
  );
}

const field = {
  width: '100%',
  padding: '0.75rem 0.9rem',
  borderRadius: '12px',
  border: '1px solid var(--line-strong)',
};

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

const icons = {
  electrician: '⚡', plumber: '🔧', carpenter: '🪵', painter: '🎨', cleaner: '✨',
  domestic: '🏠', caregiver: '💛', driver: '🚗', gardener: '🌿', technician: '🛠️',
};

export default function Services() {
  const [services, setServices] = useState([]);
  useEffect(() => {
    api.services().then((r) => setServices(r.data || [])).catch(() => {
      setServices([
        { id: 'electrician', name: 'Electrician', nameHi: 'बिजली मिस्त्री' },
        { id: 'plumber', name: 'Plumber', nameHi: 'प्लंबर' },
        { id: 'cleaner', name: 'Cleaner', nameHi: 'सफाई कर्मी' },
        { id: 'caregiver', name: 'Caregiver', nameHi: 'देखभालकर्ता' },
      ]);
    });
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Services</h1>
        <p className="section-lead">Household and community services delivered by verified cooperative members.</p>
        <div className="grid-3" style={{ marginTop: '1.5rem' }}>
          {services.map((s) => (
            <Link key={s.id} to={`/find-worker?skill=${s.id}`} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '1.6rem' }}>{icons[s.id] || '•'}</div>
              <h3 style={{ marginTop: '0.5rem' }}>{s.name}</h3>
              <p style={{ marginBottom: '0.5rem' }}>{s.nameHi}</p>
              <span className="badge">Instant · Scheduled · Emergency</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

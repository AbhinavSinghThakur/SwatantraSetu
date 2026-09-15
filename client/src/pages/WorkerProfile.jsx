import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BadgeCheck, Languages, MapPin, Shield, Star } from 'lucide-react';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import { formatINR, statusLabel } from '../utils/format';
import SyncIndicator from '../components/SyncIndicator';

export default function WorkerProfile() {
  const { id } = useParams();
  const { cachedWorkers, t } = useApp();
  const [worker, setWorker] = useState(cachedWorkers.find((w) => w.id === id) || null);
  const [fromCache, setFromCache] = useState(false);

  useEffect(() => {
    api.worker(id)
      .then((r) => {
        setWorker(r.data);
        setFromCache(Boolean(r.meta?.cached));
      })
      .catch(() => {
        const cached = cachedWorkers.find((w) => w.id === id);
        setWorker(cached || null);
        setFromCache(true);
      });
  }, [id]);

  if (!worker) {
    return (
      <section className="section">
        <div className="container"><p>Worker not found in network or cache.</p></div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <SyncIndicator />
        {fromCache && <div className="badge badge-warn" style={{ marginTop: '0.75rem' }}>Viewing cached / local profile data</div>}

        <div className="card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="avatar" style={{ width: 84, height: 84, borderRadius: 22, fontSize: '1.4rem', background: 'linear-gradient(145deg,#e8f1fb,#e6f5ef)', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
              {worker.photo}
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{worker.name}</h1>
                {worker.verified && <span className="badge badge-verified"><BadgeCheck size={14} /> Verified Worker</span>}
              </div>
              <p style={{ margin: '0.35rem 0' }}>{worker.skill} · {worker.cooperative}</p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Star size={16} fill="#F59E0B" color="#F59E0B" /> <strong>{worker.rating}</strong> ({worker.reviewsCount})</span>
                <span className={`badge`}>{statusLabel(worker.availability)}</span>
                <span style={{ color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {worker.distanceKm} km · {worker.serviceArea}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Starting rate</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--brand)' }}>{formatINR(worker.startingRate)}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>per {worker.rateUnit}</div>
              <Link className="btn btn-primary" style={{ marginTop: '0.75rem' }} to={`/book/${worker.id}`}>{t('bookNow')}</Link>
            </div>
          </div>

          <p style={{ marginTop: '1.25rem' }}>{worker.bio}</p>

          <div className="grid-4" style={{ marginTop: '1rem' }}>
            <div className="card" style={{ padding: '0.85rem' }}><small>Experience</small><strong style={{ display: 'block' }}>{worker.experienceYears} years</strong></div>
            <div className="card" style={{ padding: '0.85rem' }}><small>Completed jobs</small><strong style={{ display: 'block' }}>{worker.jobsCompleted}</strong></div>
            <div className="card" style={{ padding: '0.85rem' }}><small>Languages</small><strong style={{ display: 'block' }}><Languages size={14} /> {worker.languages?.join(', ')}</strong></div>
            <div className="card" style={{ padding: '0.85rem' }}><small>Insurance / welfare</small><strong style={{ display: 'block' }}><Shield size={14} /> {worker.insurance?.welfare ? 'Enrolled' : 'Pending'}</strong></div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <h3>Certifications</h3>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {(worker.certifications || []).map((c) => <span key={c} className="badge">{c}</span>)}
            </div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <h3>Skills</h3>
            <span className="badge badge-verified">{worker.skill}</span>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <h3>Recent reviews</h3>
            {(worker.recentReviews || []).length === 0 && <p>No recent reviews yet.</p>}
            <div className="grid-2">
              {(worker.recentReviews || []).map((r) => (
                <article key={r.id} className="card" style={{ padding: '0.9rem' }}>
                  <strong>{r.customer}</strong> · {'★'.repeat(r.rating)}
                  <p style={{ margin: '0.4rem 0 0' }}>{r.text}</p>
                  <small style={{ color: 'var(--muted)' }}>{r.date}</small>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

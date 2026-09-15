import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function Cooperatives() {
  const [coops, setCoops] = useState([]);
  useEffect(() => {
    api.cooperatives().then((r) => setCoops(r.data || [])).catch(() => {});
  }, []);

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Cooperatives</h1>
        <p className="section-lead">Labour Cooperative Societies connected through the National Labour Cooperative Federation network.</p>
        <div className="grid-2" style={{ marginTop: '1.5rem' }}>
          {coops.map((c) => (
            <article key={c.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                <h3>{c.name}</h3>
                {c.verified && <span className="badge badge-verified">Verified</span>}
              </div>
              <p>{c.city}, {c.state} · {c.shortName}</p>
              <div className="grid-3" style={{ margin: '0.75rem 0' }}>
                <div><small>Workers</small><strong style={{ display: 'block' }}>{c.workers}</strong></div>
                <div><small>Active</small><strong style={{ display: 'block' }}>{c.activeWorkers}</strong></div>
                <div><small>Rating</small><strong style={{ display: 'block' }}>{c.rating}★</strong></div>
              </div>
              <p style={{ fontSize: '0.88rem' }}>Coverage: {c.coverage?.join(', ')}</p>
              <p style={{ fontSize: '0.88rem' }}>Welfare {c.welfareCoverage}% · Insurance {c.insuranceCoverage}%</p>
            </article>
          ))}
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <Link className="btn btn-primary" to="/login">Cooperative admin login</Link>
        </div>
      </div>
    </section>
  );
}

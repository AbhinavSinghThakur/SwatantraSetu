import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mic, Search } from 'lucide-react';
import { api } from '../api/client';
import WorkerCard from '../components/WorkerCard';
import MapPanel from '../components/MapPanel';
import SyncIndicator from '../components/SyncIndicator';
import { useApp } from '../context/AppContext';

export default function FindWorker() {
  const [params] = useSearchParams();
  const { cachedWorkers, online } = useApp();
  const [workers, setWorkers] = useState(cachedWorkers);
  const [services, setServices] = useState([]);
  const [q, setQ] = useState('');
  const [skill, setSkill] = useState(params.get('skill') || '');
  const [city, setCity] = useState('New Delhi');
  const [aiNote, setAiNote] = useState('');

  const load = async () => {
    try {
      const [w, s] = await Promise.all([
        api.workers({ q, skill, city }),
        api.services(),
      ]);
      setWorkers(w.data || []);
      setServices(s.data || []);
    } catch {
      let list = [...cachedWorkers];
      if (skill) list = list.filter((w) => w.skillId === skill || w.skill.toLowerCase().includes(skill));
      if (q) list = list.filter((w) => w.name.toLowerCase().includes(q.toLowerCase()));
      setWorkers(list);
    }
  };

  useEffect(() => { load(); }, []);

  const runAi = async () => {
    try {
      const res = await api.aiMatch({ service: skill || q, city });
      setWorkers(res.data || []);
      setAiNote(res.recommendation || '');
    } catch {
      setAiNote('AI match cached offline. Showing local results.');
    }
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Find a Worker</h1>
        <p className="section-lead">Map-based discovery with offline cache, AI matching and SMS fallback.</p>

        <div style={{ margin: '1rem 0' }}><SyncIndicator /></div>

        <div className="card" style={{ padding: '1rem', display: 'grid', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr auto auto', gap: '0.6rem' }} className="find-controls">
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search service or name (voice-ready)" style={field} />
              <button className="btn btn-secondary btn-sm" type="button" aria-label="Voice search"><Mic size={16} /></button>
            </div>
            <select value={skill} onChange={(e) => setSkill(e.target.value)} style={field}>
              <option value="">All skills</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              {!services.length && ['electrician','plumber','cleaner','driver','caregiver'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={city} onChange={(e) => setCity(e.target.value)} style={field}>
              {['New Delhi', 'Mumbai', 'Bengaluru', 'Jaipur'].map((c) => <option key={c}>{c}</option>)}
            </select>
            <button className="btn btn-primary" type="button" onClick={load}><Search size={16} /> Search</button>
            <button className="btn btn-coop" type="button" onClick={runAi}>AI Match</button>
          </div>
          {!online && <div className="badge badge-warn">Showing cached workers · Last network sync retained locally</div>}
          {aiNote && <div className="badge badge-verified">{aiNote}</div>}
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
            SMS fallback: text <strong>BOOK {skill || 'ELECTRICIAN'} 110017</strong> to <strong>56767</strong> · USSD <strong>*789*1#</strong>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.25rem' }} className="find-layout">
          <div className="grid-2">
            {workers.map((w) => <WorkerCard key={w.id} worker={w} />)}
            {!workers.length && <p>No workers found. Try another locality or SMS booking.</p>}
          </div>
          <MapPanel workers={workers} title="Nearby availability" />
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <Link className="btn btn-secondary" to="/mobile">Open mobile booking UI</Link>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .find-controls { grid-template-columns: 1fr !important; }
          .find-layout { grid-template-columns: 1fr !important; display: grid !important; }
        }
      `}</style>
    </section>
  );
}

const field = {
  width: '100%',
  padding: '0.7rem 0.85rem',
  borderRadius: '12px',
  border: '1px solid var(--line-strong)',
  background: '#fff',
};

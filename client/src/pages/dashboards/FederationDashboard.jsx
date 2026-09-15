import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, Legend,
} from 'recharts';
import { Sparkles } from 'lucide-react';
import { api } from '../../api/client';
import StatCard from '../../components/StatCard';
import MapPanel from '../../components/MapPanel';

export default function FederationDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.federationAnalytics().then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <div className="card" style={{ padding: '1.5rem' }}>Loading federation intelligence…</div>;

  return (
    <div>
      <header style={{ marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Federation Administrator</h1>
        <p style={{ margin: '0.25rem 0 0' }}>National Labour Cooperative Federation · Multi-coop oversight</p>
      </header>

      <div className="grid-4">
        <StatCard label="Cooperatives" value={data.cooperatives} tone="blue" />
        <StatCard label="Total workers" value={data.totalWorkers.toLocaleString('en-IN')} tone="green" />
        <StatCard label="Active workers" value={data.activeWorkers.toLocaleString('en-IN')} />
        <StatCard label="System bookings" value={data.systemBookings.toLocaleString('en-IN')} tone="warn" />
        <StatCard label="Monthly revenue" value={`₹${data.monthlyRevenueCr} Cr`} tone="blue" />
        <StatCard label="Welfare coverage" value={`${data.welfareCoverage}%`} tone="green" />
        <StatCard label="Insurance coverage" value={`${data.insuranceCoverage}%`} />
        <StatCard label="Trainings completed" value={data.trainingCompleted.toLocaleString('en-IN')} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1rem', marginTop: '1rem' }} className="fed-grid">
        <section className="card" style={{ padding: '1rem' }} id="coops">
          <h3>Cooperative comparison</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={data.coopComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4ebf3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" name="Revenue ₹L" fill="#0E4D92" radius={[6, 6, 0, 0]} />
                <Bar dataKey="fulfilment" name="Fulfilment %" fill="#0B6E4F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="card" style={{ padding: '1rem' }} id="analytics">
          <h3>Service demand forecasting</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={data.demandForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4ebf3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#0E4D92" strokeWidth={3} />
                <Line type="monotone" dataKey="forecast" stroke="#F59E0B" strokeWidth={3} strokeDasharray="6 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }} className="fed-grid">
        <section className="card" style={{ padding: '1rem' }} id="workforce">
          <h3>Geographic demand heatmap</h3>
          <MapPanel heatmap title="National demand intensity" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
            {data.heatmap.map((h) => (
              <div key={h.city} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>{h.city}</span>
                <strong>{h.intensity}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{ padding: '1rem' }} id="ai">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Sparkles size={18} /> AI recommendations</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {data.aiRecommendations.map((a) => (
              <article key={a.id} style={{ border: '1px solid var(--line)', borderRadius: 12, padding: '0.85rem', background: '#f7fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <strong>{a.title}</strong>
                  <span className={`badge ${a.impact === 'High' ? 'badge-warn' : 'badge-verified'}`}>{a.impact}</span>
                </div>
                <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem' }}>{a.reason}</p>
              </article>
            ))}
          </div>
          <p style={{ marginTop: '0.85rem', fontSize: '0.88rem' }}>
            Includes workforce allocation, peak demand prediction, smart pricing, route optimization and fraud/anomaly alerts.
          </p>
        </section>
      </div>
      <style>{`@media (max-width: 900px){ .fed-grid{ grid-template-columns:1fr !important; display:grid !important; } }`}</style>
    </div>
  );
}

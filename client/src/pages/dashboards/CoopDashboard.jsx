import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { api } from '../../api/client';
import StatCard from '../../components/StatCard';
import MapPanel from '../../components/MapPanel';
import { formatINR } from '../../utils/format';
import { useApp } from '../../context/AppContext';

const PIE = ['#0E4D92', '#0B6E4F', '#128277', '#F59E0B', '#64748B'];

export default function CoopDashboard() {
  const { cachedWorkers } = useApp();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.coopAnalytics().then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <div className="card" style={{ padding: '1.5rem' }}>Loading cooperative analytics…</div>;

  return (
    <div>
      <header style={{ marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Cooperative Administrator</h1>
        <p style={{ margin: '0.25rem 0 0' }}>Delhi Labour Cooperative Society · Workforce · Bookings · Analytics</p>
      </header>

      <div className="grid-4" id="analytics">
        <StatCard label="Total workers" value={data.totalWorkers} tone="blue" />
        <StatCard label="Active workers" value={data.activeWorkers} tone="green" />
        <StatCard label="Available now" value={data.availableWorkers} />
        <StatCard label="Jobs today" value={data.jobsToday} tone="warn" />
        <StatCard label="Completed" value={data.completedJobs} tone="green" />
        <StatCard label="Pending" value={data.pendingJobs} />
        <StatCard label="Total earnings" value={formatINR(data.totalEarnings)} tone="blue" />
        <StatCard label="Worker earnings" value={formatINR(data.workerEarnings)} tone="green" />
        <StatCard label="Satisfaction" value={`${data.customerSatisfaction}★`} />
        <StatCard label="Welfare cover" value={`${data.welfareCoverage}%`} tone="green" />
        <StatCard label="Insurance cover" value={`${data.insuranceCoverage}%`} />
        <StatCard label="Open complaints" value={data.complaintsOpen} tone="warn" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1rem', marginTop: '1rem' }} className="coop-grid">
        <section className="card" style={{ padding: '1rem' }}>
          <h3>Weekly jobs</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={data.weeklyJobs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4ebf3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jobs" fill="#0E4D92" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="card" style={{ padding: '1rem' }}>
          <h3>Earnings trend (₹ Cr)</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={data.earningsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4ebf3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#0B6E4F" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }} className="coop-grid-3">
        <section className="card" style={{ padding: '1rem' }} id="workers">
          <h3>Top service categories</h3>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.topCategories} dataKey="jobs" nameKey="category" outerRadius={80} label>
                  {data.topCategories.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="card" style={{ padding: '1rem' }}>
          <h3>Demand by location</h3>
          {data.demandByLocation.map((d) => (
            <div key={d.location} style={{ marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>{d.location}</span><strong>{d.demand}</strong>
              </div>
              <div style={{ height: 8, background: '#e8eef5', borderRadius: 99 }}>
                <div style={{ width: `${d.demand}%`, height: '100%', background: '#128277', borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </section>
        <section className="card" style={{ padding: '1rem' }} id="bookings">
          <h3>Verification & complaints</h3>
          <p>Pending worker verifications: <strong>{data.verificationPending}</strong></p>
          <p>Open complaints / disputes: <strong>{data.complaintsOpen}</strong></p>
          <p>Commission collected: <strong>{formatINR(data.cooperativeCommission)}</strong></p>
          <button className="btn btn-secondary btn-sm" type="button">Export report</button>
        </section>
      </div>

      <div style={{ marginTop: '1rem' }} id="settings">
        <MapPanel workers={cachedWorkers.filter((w) => w.cooperativeId === 'coop-delhi')} title="Geographic service map — Delhi" />
      </div>
      <style>{`
        @media (max-width: 1000px){
          .coop-grid, .coop-grid-3 { grid-template-columns: 1fr !important; display: grid !important; }
        }
      `}</style>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { api } from '../api/client';
import StatCard from '../components/StatCard';

export default function Impact() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.impact().then((r) => setData(r.data)).catch(() => setData({
      workersEmpowered: 62400, householdsServed: 890000, cooperativesOnboarded: 48,
      statesCovered: 18, jobsCompleted: 2400000, offlineBookingsPct: 27, avgRating: 4.7, womenWorkersPct: 38,
    }));
  }, []);

  if (!data) return null;

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Impact & Statistics</h1>
        <p className="section-lead">Evidence of scalable national digital infrastructure for cooperative workers.</p>
        <div className="grid-4" style={{ marginTop: '1.5rem' }}>
          <StatCard label="Workers empowered" value={data.workersEmpowered.toLocaleString('en-IN')} tone="green" />
          <StatCard label="Households served" value={data.householdsServed.toLocaleString('en-IN')} tone="blue" />
          <StatCard label="Jobs completed" value={`${(data.jobsCompleted / 1e6).toFixed(1)}M`} />
          <StatCard label="States covered" value={data.statesCovered} />
          <StatCard label="Cooperatives" value={data.cooperativesOnboarded} tone="green" />
          <StatCard label="Offline / SMS bookings" value={`${data.offlineBookingsPct}%`} tone="warn" />
          <StatCard label="Avg. rating" value={`${data.avgRating}★`} />
          <StatCard label="Women workers" value={`${data.womenWorkersPct}%`} tone="blue" />
        </div>
      </div>
    </section>
  );
}

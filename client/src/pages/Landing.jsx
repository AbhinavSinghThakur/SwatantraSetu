import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Wifi, Smartphone, Users, Building2, Briefcase, Signal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import WorkerCard from '../components/WorkerCard';
import { useApp } from '../context/AppContext';
import './Landing.css';

export default function Landing() {
  const { t, cachedWorkers } = useApp();
  const [workers, setWorkers] = useState(cachedWorkers.slice(0, 3));
  const [impact, setImpact] = useState(null);

  useEffect(() => {
    api.workers({ available: 'true' }).then((r) => setWorkers((r.data || []).slice(0, 3))).catch(() => setWorkers(cachedWorkers.slice(0, 3)));
    api.impact().then((r) => setImpact(r.data)).catch(() => {});
  }, []);

  return (
    <div className="landing">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy fade-up">
            <div className="hero-brand">Swatantra Setu</div>
            <p className="eyebrow">Cooperative Gig Services Platform for Household & Community Services</p>
            <h1>Trusted Local Workers. Powered by Cooperatives.</h1>
            <p className="hero-sub">
              Book verified electricians, plumbers, cleaners, caregivers, drivers and other skilled workers through a cooperative-owned digital service network.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-primary btn-lg" to="/find-worker">{t('findService')} <ArrowRight size={18} /></Link>
              <Link className="btn btn-secondary btn-lg" to="/register/worker">{t('joinWorker')}</Link>
            </div>
            <div className="connectivity-callout">
              <Signal size={18} />
              <div>
                <strong>{t('worksOffline')}</strong>
                <span>Designed for 4G/5G+, offline access and SMS-based service support.</span>
              </div>
            </div>
          </div>

          <div className="hero-visual fade-up">
            <div className="flow-card">
              <div className="flow-title">How value moves</div>
              <div className="flow-track">
                <div className="flow-node"><Users size={18} /><span>Customer</span></div>
                <span className="flow-arrow">→</span>
                <div className="flow-node platform"><Smartphone size={18} /><span>Platform</span></div>
                <span className="flow-arrow">→</span>
                <div className="flow-node"><Building2 size={18} /><span>Cooperative</span></div>
                <span className="flow-arrow">→</span>
                <div className="flow-node worker"><Briefcase size={18} /><span>Worker</span></div>
              </div>
              <ul className="flow-points">
                <li><ShieldCheck size={16} /> Verified skills & cooperative membership</li>
                <li><Wifi size={16} /> Offline profiles + job sync queue</li>
                <li><Signal size={16} /> SMS / USSD fallback (*789*1#)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section trust-strip">
        <div className="container trust-grid">
          <div><strong>{impact?.workersEmpowered?.toLocaleString('en-IN') || '62,400'}+</strong><span>Workers empowered</span></div>
          <div><strong>{impact?.householdsServed?.toLocaleString('en-IN') || '8,90,000'}+</strong><span>Households served</span></div>
          <div><strong>{impact?.cooperativesOnboarded || 48}</strong><span>Cooperatives onboarded</span></div>
          <div><strong>{impact?.offlineBookingsPct || 27}%</strong><span>Offline / SMS bookings</span></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Services communities rely on</h2>
          <p className="section-lead">From emergency repairs to recurring care — every worker is attached to a Labour Cooperative Society.</p>
          <div className="service-grid">
            {['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Cleaner', 'Caregiver', 'Driver', 'Gardener', 'Domestic Helper', 'Technician'].map((s) => (
              <Link key={s} to={`/find-worker?skill=${encodeURIComponent(s.toLowerCase())}`} className="service-tile card">
                <strong>{s}</strong>
                <span>Verified · Insured · Nearby</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head-row">
            <div>
              <h2 className="section-title">Nearby verified workers</h2>
              <p className="section-lead">Profiles stay viewable from cache when connectivity drops.</p>
            </div>
            <Link className="btn btn-secondary" to="/find-worker">View all</Link>
          </div>
          <div className="grid-3">
            {workers.map((w) => <WorkerCard key={w.id} worker={w} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container pillars">
          <h2 className="section-title">Built for trust, cooperation & accessibility</h2>
          <div className="grid-4">
            {[
              ['Trust', 'Skill verification, ratings, insurance and dispute resolution.'],
              ['Cooperation', 'Owned and operated with Labour Cooperative Federations.'],
              ['Technology', 'AI matching, maps, payments — optimized for low bandwidth.'],
              ['Empowerment', 'Transparent earnings, welfare, training and SOS support.'],
            ].map(([title, body]) => (
              <article key={title} className="card pillar">
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container cta-inner">
          <div>
            <h2>Ready for national cooperative infrastructure</h2>
            <p>Presentable to government departments, federations, NGOs, investors and technology partners.</p>
          </div>
          <div className="cta-actions">
            <Link className="btn btn-primary btn-lg" to="/register">Get started</Link>
            <Link className="btn btn-secondary btn-lg" to="/mobile">See mobile app</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

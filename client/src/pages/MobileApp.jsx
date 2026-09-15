import { useState } from 'react';
import { Home, Search, Calendar, MessageSquare, User, Briefcase, Wallet, Radio, LayoutDashboard, Users, BarChart3, Settings } from 'lucide-react';
import './MobileApp.css';

const tabs = {
  customer: [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ],
  worker: [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'availability', label: 'Availability', icon: Radio },
    { id: 'earnings', label: 'Earnings', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workers', label: 'Workers', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
};

export default function MobileApp() {
  const [role, setRole] = useState('customer');
  const [tab, setTab] = useState('home');
  const [sync, setSync] = useState('synced');

  const nav = tabs[role];

  return (
    <section className="section mobile-page">
      <div className="container">
        <h1 className="section-title">Mobile Application UI</h1>
        <p className="section-lead">Optimized for budget Android devices and poor network conditions — large tap targets, low-data mode, offline job actions.</p>

        <div className="role-switch">
          {['customer', 'worker', 'admin'].map((r) => (
            <button key={r} type="button" className={`btn btn-sm ${role === r ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setRole(r); setTab(tabs[r][0].id); }}>
              {r === 'admin' ? 'Admin' : r[0].toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <div className="phone-stage">
          <div className="phone">
            <div className="phone-notch" />
            <div className={`phone-status sync-${sync}`}>
              <span>Co-opConnect</span>
              <button type="button" onClick={() => setSync((s) => (s === 'synced' ? 'offline' : s === 'offline' ? 'syncing' : 'synced'))}>
                {sync === 'offline' ? 'Offline' : sync === 'syncing' ? 'Syncing…' : 'Synced · 2m'}
              </button>
            </div>

            <div className="phone-body">
              {role === 'customer' && tab === 'home' && <CustomerHome />}
              {role === 'customer' && tab === 'search' && <CustomerSearch />}
              {role === 'customer' && tab === 'bookings' && <CustomerBookings />}
              {role === 'customer' && tab === 'messages' && <SimpleList title="Messages" items={['Ramesh is 18 min away', 'Payment receipt ready', 'SMS fallback enabled']} />}
              {role === 'customer' && tab === 'profile' && <SimpleList title="Profile" items={['Priya Sharma', 'Saket, New Delhi', 'Language: EN / HI', 'Low-data mode: On']} />}

              {role === 'worker' && tab === 'home' && <WorkerHome />}
              {role === 'worker' && tab === 'jobs' && <WorkerJobs />}
              {role === 'worker' && tab === 'availability' && <SimpleList title="Availability" items={['Available', 'Busy', 'Offline / SMS only']} />}
              {role === 'worker' && tab === 'earnings' && <SimpleList title="Earnings" items={['Today ₹1,250', 'Week ₹6,800', 'Pending payout ₹4,200']} />}
              {role === 'worker' && tab === 'profile' && <SimpleList title="Profile" items={['Ramesh Kumar · Verified', 'Electrician · 8 yrs', 'Welfare enrolled', 'SOS ready']} />}

              {role === 'admin' && <AdminPane tab={tab} />}
            </div>

            <nav className="phone-nav">
              {(role === 'admin' ? tabs.admin : nav).map((t) => {
                const Icon = t.icon;
                return (
                  <button key={t.id} type="button" className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
                    <Icon size={18} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="phone-notes card">
            <h3>Mobile-first principles</h3>
            <ul>
              <li>Cached worker cards remain readable offline</li>
              <li>Accept / reject jobs queues until sync</li>
              <li>SMS/USSD templates for zero-data booking</li>
              <li>Compressed avatars & lightweight lists</li>
              <li>Accessible contrast and large buttons</li>
              <li>EN / HI language toggle + voice input affordance</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function CustomerHome() {
  return (
    <div className="m-screen">
      <h2>What do you need?</h2>
      <div className="m-chips">
        {['Electrician', 'Plumber', 'Cleaner', 'Driver'].map((s) => <button key={s} type="button">{s}</button>)}
      </div>
      <div className="m-card highlight">
        <strong>Emergency booking</strong>
        <p>Verified workers within 30 min</p>
        <button type="button" className="m-btn">Book now</button>
      </div>
      <div className="m-card">
        <div className="m-row">
          <div className="m-avatar">RK</div>
          <div>
            <strong>Ramesh Kumar</strong>
            <p>Electrician · 4.8★ · 2.4 km</p>
          </div>
        </div>
        <button type="button" className="m-btn ghost">View profile</button>
      </div>
    </div>
  );
}

function CustomerSearch() {
  return (
    <div className="m-screen">
      <h2>Search</h2>
      <input className="m-input" placeholder="Voice or type a service…" />
      <div className="m-card"><strong>Nearby map</strong><p>3 available · 1 busy · cached pins</p></div>
      <div className="m-card"><strong>AI match</strong><p>Best fit: Ramesh Kumar (92%)</p></div>
    </div>
  );
}

function CustomerBookings() {
  return (
    <div className="m-screen">
      <h2>Bookings</h2>
      <div className="m-card">
        <span className="m-pill">In progress</span>
        <strong>Electrician · Ramesh</strong>
        <p>ETA 18 min · UPI paid</p>
      </div>
      <div className="m-card">
        <span className="m-pill muted">Scheduled</span>
        <strong>Plumber · Suresh</strong>
        <p>18 Mar, 4:00 PM · Cash</p>
      </div>
    </div>
  );
}

function WorkerHome() {
  return (
    <div className="m-screen">
      <h2>Jobs today</h2>
      <div className="m-stats">
        <div><strong>₹1,250</strong><span>Today</span></div>
        <div><strong>2</strong><span>Pending</span></div>
      </div>
      <div className="m-card warn">
        <strong>Offline queue: 1 action</strong>
        <p>Will sync when network returns</p>
      </div>
      <button type="button" className="m-btn danger">SOS</button>
    </div>
  );
}

function WorkerJobs() {
  return (
    <div className="m-screen">
      <h2>Job requests</h2>
      <div className="m-card">
        <strong>Amit Joshi · Emergency</strong>
        <p>Greater Kailash · ₹900</p>
        <div className="m-actions">
          <button type="button" className="m-btn">Accept</button>
          <button type="button" className="m-btn ghost">Reject</button>
        </div>
      </div>
    </div>
  );
}

function AdminPane({ tab }) {
  const titles = {
    dashboard: 'Today: 146 jobs · 310 available',
    workers: '1,240 workers · 28 pending verification',
    bookings: 'Pending 32 · In progress 16',
    analytics: 'Satisfaction 4.72★ · Welfare 94%',
    settings: 'SMS gateway · RBAC · Low-data defaults',
  };
  return (
    <div className="m-screen">
      <h2>{tab[0].toUpperCase() + tab.slice(1)}</h2>
      <div className="m-card"><strong>{titles[tab]}</strong><p>Cooperative admin mobile console</p></div>
      <div className="m-card"><strong>Demand heatmap</strong><p>South Delhi peaking this evening</p></div>
    </div>
  );
}

function SimpleList({ title, items }) {
  return (
    <div className="m-screen">
      <h2>{title}</h2>
      {items.map((item) => (
        <div key={item} className="m-card"><strong>{item}</strong></div>
      ))}
    </div>
  );
}

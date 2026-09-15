import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SyncIndicator from '../components/SyncIndicator';
import { roleHome } from '../utils/format';
import './AppLayout.css';

const navByRole = {
  customer: [
    { to: '/app/customer', label: 'Home' },
    { to: '/find-worker', label: 'Search' },
    { to: '/app/customer#bookings', label: 'Bookings' },
    { to: '/app/customer#messages', label: 'Messages' },
    { to: '/app/customer#profile', label: 'Profile' },
  ],
  worker: [
    { to: '/app/worker', label: 'Home' },
    { to: '/app/worker#jobs', label: 'Jobs' },
    { to: '/app/worker#availability', label: 'Availability' },
    { to: '/app/worker#earnings', label: 'Earnings' },
    { to: '/app/worker#profile', label: 'Profile' },
  ],
  coop_admin: [
    { to: '/app/coop', label: 'Dashboard' },
    { to: '/app/coop#workers', label: 'Workers' },
    { to: '/app/coop#bookings', label: 'Bookings' },
    { to: '/app/coop#analytics', label: 'Analytics' },
    { to: '/app/coop#settings', label: 'Settings' },
  ],
  federation_admin: [
    { to: '/app/federation', label: 'Dashboard' },
    { to: '/app/federation#coops', label: 'Cooperatives' },
    { to: '/app/federation#workforce', label: 'Workforce' },
    { to: '/app/federation#analytics', label: 'Analytics' },
    { to: '/app/federation#ai', label: 'AI Insights' },
  ],
};

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = navByRole[user?.role] || navByRole.customer;

  return (
    <div className="app-shell">
      <aside className="app-side">
        <button type="button" className="side-brand" onClick={() => navigate('/')}>
          <span>CC</span>
          <div>
            <strong>Swatantra Setu</strong>
            <small>{user?.role?.replace('_', ' ')}</small>
          </div>
        </button>
        <nav>
          {links.map((l) => (
            <NavLink key={l.label} to={l.to}>{l.label}</NavLink>
          ))}
        </nav>
        <div className="side-foot">
          <SyncIndicator compact />
          <button className="btn btn-secondary btn-sm" type="button" onClick={() => { logout(); navigate('/'); }}>
            Logout
          </button>
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => navigate(roleHome(user?.role))}>
            {user?.name}
          </button>
        </div>
      </aside>
      <div className="app-main">
        <Outlet />
      </div>
    </div>
  );
}

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Globe2, Menu, WifiOff, Wifi, RefreshCw, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { formatRelativeSync, roleHome } from '../utils/format';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, setLang, lowData, setLowData, syncStatus, lastSyncedAt, online, syncNow, t } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/find-worker', label: 'Find a Worker' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/cooperatives', label: 'Cooperatives' },
    { to: '/welfare', label: 'Welfare' },
    { to: '/trust', label: 'Trust' },
    { to: '/impact', label: 'Impact' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="nav">
      <div className="nav-bar container">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden>SS</span>
          <span>
            <strong>Swatantra Setu </strong>
            <small>Cooperative Gig Services</small>
          </span>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <button className="nav-close" type="button" onClick={() => setOpen(false)} aria-label="Close">
            <X size={20} />
          </button>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/mobile" className="mobile-showcase-link" onClick={() => setOpen(false)}>
            Mobile App
          </Link>
        </nav>

        <div className="nav-actions">
          <div className={`sync-chip sync-${online ? syncStatus : 'offline'}`} title={`${t('lastSynced')}: ${formatRelativeSync(lastSyncedAt)}`}>
            {!online || syncStatus === 'offline' ? <WifiOff size={14} /> : syncStatus === 'syncing' ? <RefreshCw size={14} className="spin" /> : <Wifi size={14} />}
            <span>{!online ? t('offline') : syncStatus === 'syncing' ? t('syncing') : t('synced')}</span>
          </div>

          <button className="icon-btn" type="button" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} aria-label="Language">
            <Globe2 size={16} />
            <span>{lang.toUpperCase()}</span>
          </button>

          <button
            className={`icon-btn ${lowData ? 'active' : ''}`}
            type="button"
            onClick={() => setLowData(!lowData)}
            title={t('lowData')}
          >
            5G+
          </button>

          {user ? (
            <>
              <button className="btn btn-secondary btn-sm" type="button" onClick={() => navigate(roleHome(user.role))}>
                Dashboard
              </button>
              <button className="btn btn-ghost btn-sm" type="button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost btn-sm" to="/login">Login</Link>
              <Link className="btn btn-primary btn-sm" to="/register">{t('findService')}</Link>
            </>
          )}

          <button className="menu-btn" type="button" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu size={22} />
          </button>
        </div>
      </div>
      {!online && (
        <div className="offline-banner">
          Offline mode — cached worker profiles available. SMS: BOOK SERVICE PINCODE to 56767.
          <button type="button" onClick={syncNow}>Retry sync</button>
        </div>
      )}
    </header>
  );
}

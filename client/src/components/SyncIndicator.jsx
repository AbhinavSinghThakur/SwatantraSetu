import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatRelativeSync } from '../utils/format';

export default function SyncIndicator({ compact }) {
  const { online, syncStatus, lastSyncedAt, syncNow, t } = useApp();
  const status = online ? syncStatus : 'offline';
  return (
    <div className={`sync-indicator status-${status}`} style={styles.wrap}>
      <div style={styles.left}>
        {status === 'offline' ? <WifiOff size={16} /> : status === 'syncing' ? <RefreshCw size={16} className="spin" /> : <Wifi size={16} />}
        <div>
          <strong>{status === 'offline' ? t('offline') : status === 'syncing' ? t('syncing') : t('synced')}</strong>
          {!compact && <div style={styles.sub}>{t('lastSynced')}: {formatRelativeSync(lastSyncedAt)}</div>}
        </div>
      </div>
      <button className="btn btn-secondary btn-sm" type="button" onClick={syncNow}>Sync</button>
    </div>
  );
}

const styles = {
  wrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '1px solid var(--line)',
    background: '#fff',
  },
  left: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  sub: { fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 500 },
};

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const AppContext = createContext(null);

const dict = {
  en: {
    findService: 'Find a Service',
    joinWorker: 'Join as a Worker',
    worksOffline: 'Works even with low connectivity',
    lastSynced: 'Last Synced',
    offline: 'Offline',
    syncing: 'Syncing',
    synced: 'Synced',
    bookNow: 'Book Now',
    available: 'Available',
    lowData: 'Low-data mode',
  },
  hi: {
    findService: 'सेवा खोजें',
    joinWorker: 'कर्मचारी के रूप में जुड़ें',
    worksOffline: 'कम नेटवर्क में भी काम करता है',
    lastSynced: 'अंतिम सिंक',
    offline: 'ऑफ़लाइन',
    syncing: 'सिंक हो रहा है',
    synced: 'सिंक हो गया',
    bookNow: 'अभी बुक करें',
    available: 'उपलब्ध',
    lowData: 'कम-डेटा मोड',
  },
};

export function AppProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('cc_lang') || 'en');
  const [lowData, setLowData] = useState(localStorage.getItem('cc_lowdata') === '1');
  const [online, setOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [lastSyncedAt, setLastSyncedAt] = useState(new Date().toISOString());
  const [cachedWorkers, setCachedWorkers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cc_workers_cache') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cc_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('cc_lowdata', lowData ? '1' : '0');
    document.body.classList.toggle('low-data', lowData);
  }, [lowData]);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [workersRes, syncRes] = await Promise.all([api.workers(), api.syncStatus()]);
        setCachedWorkers(workersRes.data || []);
        localStorage.setItem('cc_workers_cache', JSON.stringify(workersRes.data || []));
        setLastSyncedAt(syncRes.data?.lastSyncedAt || new Date().toISOString());
        setSyncStatus(syncRes.data?.status || 'synced');
      } catch {
        setSyncStatus(online ? 'synced' : 'offline');
      }
    };
    load();
  }, []);

  const syncNow = async () => {
    if (!online) {
      setSyncStatus('offline');
      return { ok: false };
    }
    setSyncStatus('syncing');
    try {
      const res = await api.syncBookings();
      const workersRes = await api.workers();
      setCachedWorkers(workersRes.data || []);
      localStorage.setItem('cc_workers_cache', JSON.stringify(workersRes.data || []));
      setLastSyncedAt(res.meta?.lastSyncedAt || new Date().toISOString());
      setSyncStatus('synced');
      return { ok: true, syncedCount: res.syncedCount };
    } catch {
      setSyncStatus('offline');
      return { ok: false };
    }
  };

  const t = (key) => dict[lang]?.[key] || dict.en[key] || key;

  const value = useMemo(
    () => ({
      lang,
      setLang,
      lowData,
      setLowData,
      online,
      syncStatus: online ? syncStatus : 'offline',
      lastSyncedAt,
      cachedWorkers,
      setCachedWorkers,
      syncNow,
      t,
    }),
    [lang, lowData, online, syncStatus, lastSyncedAt, cachedWorkers]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}

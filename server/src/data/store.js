import {
  services,
  cooperatives,
  workers,
  users,
  bookings,
  notifications,
  coopAnalytics,
  federationAnalytics,
  workerEarnings,
  impactStats,
} from './sampleData.js';

const clone = (v) => JSON.parse(JSON.stringify(v));

export const store = {
  services: clone(services),
  cooperatives: clone(cooperatives),
  workers: clone(workers),
  users: clone(users),
  bookings: clone(bookings),
  notifications: clone(notifications),
  coopAnalytics: clone(coopAnalytics),
  federationAnalytics: clone(federationAnalytics),
  workerEarnings: clone(workerEarnings),
  impactStats: clone(impactStats),
  offlineQueue: [],
  syncMeta: {
    lastSyncedAt: new Date().toISOString(),
    status: 'synced',
  },
};

export function resetStore() {
  Object.assign(store, {
    services: clone(services),
    cooperatives: clone(cooperatives),
    workers: clone(workers),
    users: clone(users),
    bookings: clone(bookings),
    notifications: clone(notifications),
    coopAnalytics: clone(coopAnalytics),
    federationAnalytics: clone(federationAnalytics),
    workerEarnings: clone(workerEarnings),
    impactStats: clone(impactStats),
    offlineQueue: [],
    syncMeta: {
      lastSyncedAt: new Date().toISOString(),
      status: 'synced',
    },
  });
}

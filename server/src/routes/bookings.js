import { Router } from 'express';
import { store } from '../data/store.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, (req, res) => {
  const { status, workerId, customerId } = req.query;
  let list = [...store.bookings];
  if (status) list = list.filter((b) => b.status === status);
  if (workerId) list = list.filter((b) => b.workerId === workerId);
  if (customerId) list = list.filter((b) => b.customerId === customerId);
  if (req.user.role === 'customer') list = list.filter((b) => b.customerId === req.user.id || b.customerName === req.user.name);
  if (req.user.role === 'worker') {
    const me = store.users.find((u) => u.id === req.user.id);
    const wid = me?.workerId || 'w1';
    list = list.filter((b) => b.workerId === wid);
  }
  res.json({ data: list, meta: { lastSyncedAt: store.syncMeta.lastSyncedAt } });
});

router.post('/', authRequired, (req, res) => {
  const body = req.body || {};
  const worker = store.workers.find((w) => w.id === body.workerId);
  const booking = {
    id: `b${Date.now()}`,
    customerId: req.user.id,
    customerName: req.user.name,
    workerId: body.workerId,
    workerName: worker?.name || body.workerName,
    service: body.service || worker?.skill,
    status: 'pending',
    type: body.type || 'instant',
    scheduledAt: body.scheduledAt || new Date().toISOString(),
    address: body.address || '',
    amount: body.amount || worker?.startingRate || 0,
    paymentMethod: body.paymentMethod || 'UPI',
    paymentStatus: body.paymentMethod === 'Cash' ? 'pending' : 'authorized',
    cooperative: worker?.cooperative || '',
    notes: body.notes || '',
    etaMinutes: worker ? Math.round(worker.distanceKm * 8) : null,
    createdAt: new Date().toISOString(),
    offlineQueued: Boolean(body.offline),
  };
  store.bookings.unshift(booking);
  res.status(201).json({ data: booking });
});

router.patch('/:id/status', authRequired, (req, res) => {
  const booking = store.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  const { status, offline } = req.body || {};
  if (offline) {
    store.offlineQueue.push({
      id: `oq-${Date.now()}`,
      bookingId: booking.id,
      action: status,
      createdAt: new Date().toISOString(),
    });
    store.syncMeta.status = 'pending_sync';
    booking.offlineQueued = true;
  }
  if (status) booking.status = status;
  if (status === 'completed') booking.paymentStatus = booking.paymentStatus === 'pending' ? 'pending' : 'paid';
  res.json({ data: booking, meta: { syncStatus: store.syncMeta.status } });
});

router.post('/sync', authRequired, (req, res) => {
  const synced = store.offlineQueue.splice(0, store.offlineQueue.length);
  store.bookings.forEach((b) => {
    if (b.offlineQueued) b.offlineQueued = false;
  });
  store.syncMeta = { lastSyncedAt: new Date().toISOString(), status: 'synced' };
  res.json({
    message: 'Offline actions synchronized',
    syncedCount: synced.length,
    synced,
    meta: store.syncMeta,
  });
});

router.get('/:id/invoice', authRequired, (req, res) => {
  const booking = store.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json({
    data: {
      invoiceId: booking.invoiceId || `INV-${booking.id.toUpperCase()}`,
      booking,
      issuedAt: new Date().toISOString(),
      tax: Math.round(booking.amount * 0.05),
      total: Math.round(booking.amount * 1.05),
      cooperativeCommissionPct: 15,
      workerSharePct: 85,
    },
  });
});

export default router;

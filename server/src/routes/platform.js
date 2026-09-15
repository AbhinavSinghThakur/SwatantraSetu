import { Router } from 'express';
import { store } from '../data/store.js';
import { authRequired, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/services', (_req, res) => {
  res.json({ data: store.services });
});

router.get('/cooperatives', (_req, res) => {
  res.json({ data: store.cooperatives });
});

router.get('/cooperatives/:id', (req, res) => {
  const coop = store.cooperatives.find((c) => c.id === req.params.id);
  if (!coop) return res.status(404).json({ message: 'Cooperative not found' });
  const workers = store.workers.filter((w) => w.cooperativeId === coop.id);
  res.json({ data: { ...coop, workers } });
});

router.get('/notifications', authRequired, (_req, res) => {
  res.json({ data: store.notifications });
});

router.get('/impact', (_req, res) => {
  res.json({ data: store.impactStats });
});

router.get('/sync-status', (_req, res) => {
  res.json({ data: store.syncMeta, offlineQueueLength: store.offlineQueue.length });
});

router.get(
  '/analytics/cooperative',
  authRequired,
  requireRole('coop_admin', 'federation_admin'),
  (_req, res) => {
    res.json({ data: store.coopAnalytics });
  }
);

router.get(
  '/analytics/federation',
  authRequired,
  requireRole('federation_admin'),
  (_req, res) => {
    res.json({ data: store.federationAnalytics });
  }
);

router.post('/ai/match', (req, res) => {
  const { service, city } = req.body || {};
  let matches = [...store.workers].filter((w) => w.availability === 'available');
  if (service) {
    matches = matches.filter(
      (w) => w.skillId === service || w.skill.toLowerCase().includes(String(service).toLowerCase())
    );
  }
  if (city) matches = matches.filter((w) => w.city.toLowerCase().includes(String(city).toLowerCase()));
  matches = matches
    .map((w) => ({
      ...w,
      matchScore: Math.min(99, Math.round(w.rating * 18 + (10 - w.distanceKm) * 2 + (w.verified ? 5 : 0))),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
  res.json({
    data: matches,
    recommendation: matches[0]
      ? `Best match: ${matches[0].name} (${matches[0].matchScore}% fit) — verified, nearby, high rating.`
      : 'No available workers matched. Try SMS fallback *COOP* to 56767.',
  });
});

router.post('/ai/chat', (req, res) => {
  const message = String(req.body?.message || '').toLowerCase();
  let reply =
    'I can help you book a verified cooperative worker, check booking status, or enable SMS fallback. What do you need?';
  if (message.includes('plumb') || message.includes('leak')) {
    reply = 'For plumbing issues, I recommend Suresh Yadav (4.6★, 3.1 km). Shall I start an instant booking?';
  } else if (message.includes('electric') || message.includes('power')) {
    reply = 'Ramesh Kumar is available nearby (2.4 km, 4.8★). Emergency booking is also available.';
  } else if (message.includes('sms') || message.includes('offline') || message.includes('network')) {
    reply =
      'Low connectivity mode: dial *789*# or SMS BOOK <SERVICE> <PINCODE> to 56767. Your last sync will keep worker profiles available offline.';
  } else if (message.includes('price') || message.includes('rate')) {
    reply = 'Typical starting rates: Electrician ₹350/visit, Plumber ₹300/visit, Cleaner ₹200/visit. Smart pricing adjusts for peak hours.';
  }
  res.json({ data: { reply, lang: req.body?.lang || 'en' } });
});

router.post('/sms/fallback', (req, res) => {
  const { action, payload } = req.body || {};
  res.json({
    data: {
      channel: 'SMS/USSD',
      action: action || 'BOOK',
      ussd: '*789*1#',
      smsTo: '56767',
      template: `COOP ${action || 'BOOK'} ${payload || 'ELECTRICIAN'} DELHI`,
      status: 'accepted',
      message: 'SMS fallback request queued. You will receive status updates by SMS.',
    },
  });
});

export default router;

import { Router } from 'express';
import { store } from '../data/store.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const { skill, city, q, available } = req.query;
  let list = [...store.workers];
  if (skill) list = list.filter((w) => w.skillId === skill || w.skill.toLowerCase() === String(skill).toLowerCase());
  if (city) list = list.filter((w) => w.city.toLowerCase().includes(String(city).toLowerCase()));
  if (available === 'true') list = list.filter((w) => w.availability === 'available');
  if (q) {
    const s = String(q).toLowerCase();
    list = list.filter(
      (w) =>
        w.name.toLowerCase().includes(s) ||
        w.skill.toLowerCase().includes(s) ||
        w.serviceArea.toLowerCase().includes(s) ||
        w.cooperative.toLowerCase().includes(s)
    );
  }
  list.sort((a, b) => a.distanceKm - b.distanceKm);
  res.json({
    data: list,
    meta: {
      count: list.length,
      lastSyncedAt: store.syncMeta.lastSyncedAt,
      syncStatus: store.syncMeta.status,
      compressed: true,
    },
  });
});

router.get('/:id', (req, res) => {
  const worker = store.workers.find((w) => w.id === req.params.id);
  if (!worker) return res.status(404).json({ message: 'Worker not found' });
  res.json({
    data: worker,
    meta: { lastSyncedAt: store.syncMeta.lastSyncedAt, syncStatus: store.syncMeta.status, cached: true },
  });
});

router.patch('/:id/availability', authRequired, (req, res) => {
  const worker = store.workers.find((w) => w.id === req.params.id);
  if (!worker) return res.status(404).json({ message: 'Worker not found' });
  worker.availability = req.body.availability || worker.availability;
  res.json({ data: worker });
});

router.get('/:id/earnings', authRequired, (req, res) => {
  res.json({ data: store.workerEarnings, meta: { lastSyncedAt: store.syncMeta.lastSyncedAt } });
});

export default router;

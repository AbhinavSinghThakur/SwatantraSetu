import { Router } from 'express';
import { store } from '../data/store.js';
import { signToken, authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = store.users.find(
    (u) => u.email.toLowerCase() === String(email || '').toLowerCase() && u.password === password
  );
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });
  const { password: _, ...safe } = user;
  const token = signToken(safe);
  res.json({ token, user: safe });
});

router.post('/register', (req, res) => {
  const { name, email, password, role = 'customer', phone, city } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  if (store.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ message: 'Account already exists' });
  }
  const user = {
    id: `u-${Date.now()}`,
    name,
    email,
    password,
    role,
    phone: phone || '',
    city: city || '',
    verified: false,
    languages: ['English', 'Hindi'],
  };
  store.users.push(user);
  const { password: _, ...safe } = user;
  res.status(201).json({ token: signToken(safe), user: safe });
});

router.get('/me', authRequired, (req, res) => {
  const user = store.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password: _, ...safe } = user;
  res.json(safe);
});

export default router;

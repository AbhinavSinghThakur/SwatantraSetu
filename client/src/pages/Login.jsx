import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roleHome } from '../utils/format';

const demos = [
  { label: 'Customer', email: 'priya.sharma@email.com' },
  { label: 'Worker', email: 'ramesh.kumar@coop.in' },
  { label: 'Coop Admin', email: 'admin@delhi-labour.coop' },
  { label: 'Federation', email: 'federation@nlcf.in' },
];

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('priya.sharma@email.com');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      navigate(roleHome(user.role));
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 480 }}>
        <h1 className="section-title">Login</h1>
        <p className="section-lead">Role-based access for customers, workers and cooperative administrators.</p>
        <form className="card" style={{ padding: '1.25rem', display: 'grid', gap: '0.75rem' }} onSubmit={submit}>
          <input style={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input style={field} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
          {error && <div className="badge badge-danger">{error}</div>}
          <button className="btn btn-primary" disabled={loading} type="submit">{loading ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem' }}>
          <small style={{ color: 'var(--muted)' }}>Demo accounts (password: demo1234)</small>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {demos.map((d) => (
              <button key={d.email} type="button" className="btn btn-secondary btn-sm" onClick={() => setEmail(d.email)}>
                {d.label}
              </button>
            ))}
          </div>
          <p>New here? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </section>
  );
}

export function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: 'demo1234',
    phone: '',
    city: 'New Delhi',
    role: params.get('role') === 'worker' ? 'worker' : 'customer',
  });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await register(form);
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 520 }}>
        <h1 className="section-title">Register</h1>
        <p className="section-lead">Create a customer or worker account. Cooperative admins are provisioned by federations.</p>
        <form className="card" style={{ padding: '1.25rem', display: 'grid', gap: '0.75rem' }} onSubmit={submit}>
          <select style={field} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="customer">Customer</option>
            <option value="worker">Worker / Service Provider</option>
          </select>
          <input style={field} required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input style={field} required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input style={field} placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input style={field} placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input style={field} required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <div className="badge badge-danger">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>Create account</button>
        </form>
        <p style={{ marginTop: '1rem' }}>Already registered? <Link to="/login">Login</Link></p>
      </div>
    </section>
  );
}

const field = {
  width: '100%',
  padding: '0.75rem 0.9rem',
  borderRadius: '12px',
  border: '1px solid var(--line-strong)',
};

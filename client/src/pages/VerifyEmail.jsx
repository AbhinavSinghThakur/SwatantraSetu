import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { roleHome } from '../utils/format';

const field = {
  width: '3rem',
  height: '3.5rem',
  textAlign: 'center',
  fontSize: '1.4rem',
  fontWeight: 700,
  borderRadius: '12px',
  border: '1px solid var(--line-strong)',
};

export default function VerifyEmail() {
  const { verifyEmail, loading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get('email') || '');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const updateCode = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < 5) inputs.current[index + 1]?.focus();
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setResending(true);
    try {
      const user = await verifyEmail(email, code.join(''));
      setSuccess('Email verified successfully. Redirecting…');
      window.setTimeout(() => navigate(roleHome(user.role)), 500);
    } catch (err) {
      setError(err.message || 'Verification failed');
    }
  };

  const resend = async () => {
    if (cooldown > 0 || !email) return;
    setError('');
    setSuccess('');
    try {
      const data = await api.resendOtp(email);
      setSuccess(data.message);
      setCooldown(60);
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Unable to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 520 }}>
        <h1 className="section-title">Verify your email</h1>
        <p className="section-lead">Enter the 6-digit code sent to your email. The code expires in 5 minutes.</p>
        <form className="card" style={{ padding: '1.25rem', display: 'grid', gap: '1rem' }} onSubmit={submit}>
          <input style={{ ...field, width: '100%', height: 'auto', textAlign: 'left', fontSize: '1rem', fontWeight: 400 }} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" required />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(element) => { inputs.current[index] = element; }}
                style={field}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(event) => updateCode(index, event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && !code[index] && index > 0) inputs.current[index - 1]?.focus();
                }}
                aria-label={`Verification digit ${index + 1}`}
              />
            ))}
          </div>
          {error && <div className="badge badge-danger">{error}</div>}
          {success && <div className="badge" style={{ color: 'var(--success)' }}>{success}</div>}
          <button className="btn btn-primary" disabled={loading || code.join('').length !== 6} type="submit">
            {loading ? 'Verifying…' : 'Verify OTP'}
          </button>
          <button className="btn btn-secondary" disabled={cooldown > 0 || resending} type="button" onClick={resend}>
            {resending ? 'Sending…' : cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
          </button>
        </form>
        <p style={{ marginTop: '1rem' }}><Link to="/login">Back to login</Link></p>
      </div>
    </section>
  );
}
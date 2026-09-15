import { Link } from 'react-router-dom';

function PageShell({ title, lead, children }) {
  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">{title}</h1>
        {lead && <p className="section-lead">{lead}</p>}
        <div style={{ marginTop: '1.75rem' }}>{children}</div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <PageShell
      title="About the Cooperative Model"
      lead="Swatantra Setu is a cooperative-owned digital marketplace that digitizes Labour Cooperative Federations and Societies — not a private gig aggregator."
    >
      <div className="grid-2">
        <article className="card" style={{ padding: '1.25rem' }}>
          <h3>Our mission</h3>
          <p>Give verified cooperative workers dignified digital access to household and community demand, while keeping ownership, welfare and governance with cooperatives.</p>
        </article>
        <article className="card" style={{ padding: '1.25rem' }}>
          <h3>Who we serve</h3>
          <p>Households, MSMEs, institutions, RWAs, Labour Cooperative Societies, Federations, NGOs and government skill missions.</p>
        </article>
      </div>
      <div className="grid-3" style={{ marginTop: '1rem' }}>
        {['Worker-first design', 'Federation governance', 'Low-connectivity India'].map((t) => (
          <div key={t} className="card" style={{ padding: '1rem' }}><strong>{t}</strong></div>
        ))}
      </div>
    </PageShell>
  );
}

export function HowItWorks() {
  const steps = [
    ['Customer requests', 'Search nearby verified workers or book via SMS/USSD when data is weak.'],
    ['AI + cooperative match', 'Platform matches skill, distance, rating, availability and welfare status.'],
    ['Worker accepts', 'Workers can accept offline; actions sync when connectivity returns.'],
    ['Service & payout', 'Track job, pay via UPI/wallet/card/cash, transparent cooperative commission.'],
  ];
  return (
    <PageShell title="How It Works" lead="A simple loop designed for real Indian network conditions.">
      <div className="grid-2">
        {steps.map(([t, b], i) => (
          <article key={t} className="card" style={{ padding: '1.2rem' }}>
            <span className="badge">Step {i + 1}</span>
            <h3 style={{ marginTop: '0.7rem' }}>{t}</h3>
            <p>{b}</p>
          </article>
        ))}
      </div>
      <div style={{ marginTop: '1.5rem' }}>
        <Link className="btn btn-primary" to="/find-worker">Try finding a worker</Link>
      </div>
    </PageShell>
  );
}

export function Trust() {
  return (
    <PageShell title="Trust & Safety" lead="Verification, insurance, SOS and dispute resolution built into every booking.">
      <div className="grid-3">
        {[
          ['Verified worker badge', 'Identity, cooperative membership and skill certification checks.'],
          ['Customer verification', 'Phone OTP and address confirmation for safer jobs.'],
          ['SOS & emergency', 'One-tap SOS for workers with cooperative response protocols.'],
          ['Complaints & disputes', 'Escalation to cooperative admins with audit trail.'],
          ['Insurance integration', 'Accident and welfare coverage visibility on profiles.'],
          ['Privacy-conscious location', 'Approximate distance by default; precise only during active jobs.'],
        ].map(([t, b]) => (
          <article key={t} className="card" style={{ padding: '1.1rem' }}>
            <h3>{t}</h3>
            <p>{b}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

export function Welfare() {
  return (
    <PageShell title="Worker Welfare" lead="Digital access to insurance, training, grievance redressal and cooperative benefits.">
      <div className="grid-2">
        <article className="card" style={{ padding: '1.25rem' }}>
          <h3>Coverage dashboard</h3>
          <p>Workers see welfare enrolment, accident insurance, health cover and claim status — even in low-data mode.</p>
          <ul>
            <li>Accident insurance linked to active jobs</li>
            <li>Training & certification pathways</li>
            <li>Transparent payouts & commission share</li>
          </ul>
        </article>
        <article className="card" style={{ padding: '1.25rem' }}>
          <h3>Cooperative responsibility</h3>
          <p>Administrators track coverage gaps and receive AI prompts to enrol uncovered members before peak seasons.</p>
          <Link className="btn btn-coop" to="/register/worker">Join as a worker</Link>
        </article>
      </div>
    </PageShell>
  );
}

export function Contact() {
  return (
    <PageShell title="Contact" lead="Partner with Co-opConnect for federation rollouts, pilots and integrations.">
      <div className="grid-2">
        <form className="card" style={{ padding: '1.25rem', display: 'grid', gap: '0.75rem' }} onSubmit={(e) => e.preventDefault()}>
          <input placeholder="Full name" required style={inputStyle} />
          <input placeholder="Organisation" style={inputStyle} />
          <input type="email" placeholder="Email" required style={inputStyle} />
          <textarea placeholder="How can we help?" rows={4} style={inputStyle} />
          <button className="btn btn-primary" type="submit">Send message</button>
        </form>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3>Reach us</h3>
          <p>Email: partners@coopconnect.in</p>
          <p>SMS helpline: 56767</p>
          <p>USSD: *789*1#</p>
          <p>New Delhi · Mumbai · Bengaluru federation desks</p>
        </div>
      </div>
    </PageShell>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem 0.9rem',
  borderRadius: '12px',
  border: '1px solid var(--line-strong)',
};

export { PageShell };

import { Link } from 'react-router-dom';

export default function WorkerRegistration() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 className="section-title">Worker Registration</h1>
        <p className="section-lead">Join through your Labour Cooperative Society. Profiles work offline after first sync.</p>
        <div className="card" style={{ padding: '1.25rem', display: 'grid', gap: '0.75rem' }}>
          {['Full name & photo', 'Cooperative membership ID', 'Skills & certifications', 'Service areas & languages', 'Bank / UPI for payouts', 'Welfare & insurance enrolment'].map((s, i) => (
            <div key={s} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span className="badge">{i + 1}</span>
              <strong>{s}</strong>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <Link className="btn btn-primary" to="/register?role=worker">Start digital registration</Link>
            <button className="btn btn-secondary" type="button" onClick={() => alert('SMS: JOIN WORKER <COOP-ID> to 56767')}>Register via SMS</button>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';

export default function CustomerRegistration() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 className="section-title">Customer Registration</h1>
        <p className="section-lead">Book verified cooperative workers for home and community services.</p>
        <div className="card" style={{ padding: '1.25rem' }}>
          <ul>
            <li>Phone-verified account</li>
            <li>Location & language preferences</li>
            <li>UPI / wallet / card payment methods</li>
            <li>SMS status notifications for low connectivity</li>
          </ul>
          <Link className="btn btn-primary" to="/register?role=customer">Create customer account</Link>
        </div>
      </div>
    </section>
  );
}

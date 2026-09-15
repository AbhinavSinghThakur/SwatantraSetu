import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">Co-opConnect</div>
          <p>Cooperative-owned digital service network for household and community services. Built for trust, worker empowerment and low-connectivity India.</p>
        </div>
        <div>
          <h4>Platform</h4>
          <Link to="/services">Services</Link>
          <Link to="/find-worker">Find a Worker</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/mobile">Mobile App</Link>
        </div>
        <div>
          <h4>Cooperatives</h4>
          <Link to="/cooperatives">Member Societies</Link>
          <Link to="/welfare">Worker Welfare</Link>
          <Link to="/trust">Trust & Safety</Link>
          <Link to="/impact">Impact</Link>
        </div>
        <div>
          <h4>Get Started</h4>
          <Link to="/register?role=customer">Customer Registration</Link>
          <Link to="/register?role=worker">Worker Registration</Link>
          <Link to="/login">Login</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Co-opConnect · National Labour Cooperative Federation partner platform</span>
        <span>Designed for 2G/3G · Offline · SMS/USSD</span>
      </div>
    </footer>
  );
}

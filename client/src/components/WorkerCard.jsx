import { Link } from 'react-router-dom';
import { BadgeCheck, MapPin, Star } from 'lucide-react';
import { formatINR, statusLabel } from '../utils/format';
import './WorkerCard.css';

export default function WorkerCard({ worker, compact = false }) {
  if (!worker) return null;
  return (
    <article className={`worker-card card ${compact ? 'compact' : ''}`}>
      <div className="wc-top">
        <div className="avatar" aria-hidden>{worker.photo || worker.name.slice(0, 2).toUpperCase()}</div>
        <div className="wc-meta">
          <div className="wc-name-row">
            <h3>{worker.name}</h3>
            {worker.verified && (
              <span className="badge badge-verified"><BadgeCheck size={12} /> Verified</span>
            )}
          </div>
          <p className="wc-skill">{worker.skill} · {worker.cooperative?.replace('Delhi Labour Cooperative Society', 'DLCS') || worker.cooperative}</p>
          <div className="wc-rating">
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            <strong>{worker.rating}</strong>
            <span>({worker.reviewsCount})</span>
            <span className={`avail avail-${worker.availability}`}>{statusLabel(worker.availability)}</span>
          </div>
        </div>
      </div>
      {!compact && (
        <div className="wc-stats">
          <div><span>Experience</span><strong>{worker.experienceYears} yrs</strong></div>
          <div><span>Jobs</span><strong>{worker.jobsCompleted}</strong></div>
          <div><span>From</span><strong>{formatINR(worker.startingRate)}</strong></div>
        </div>
      )}
      <div className="wc-foot">
        <span className="wc-loc"><MapPin size={14} /> {worker.distanceKm} km · {worker.serviceArea}</span>
        <Link className="btn btn-primary btn-sm" to={`/workers/${worker.id}`}>View</Link>
      </div>
    </article>
  );
}

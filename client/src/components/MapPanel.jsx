import './MapPanel.css';

export default function MapPanel({ workers = [], heatmap = false, title = 'Nearby workers' }) {
  return (
    <div className="map-panel card">
      <div className="map-head">
        <strong>{title}</strong>
        <span>{heatmap ? 'Demand heatmap' : `${workers.length} pins`}</span>
      </div>
      <div className="map-canvas" aria-label="Service map">
        <div className="map-grid" />
        {heatmap ? (
          <>
            <span className="heat h1" />
            <span className="heat h2" />
            <span className="heat h3" />
            <span className="heat h4" />
          </>
        ) : (
          workers.slice(0, 8).map((w, i) => (
            <button
              key={w.id}
              type="button"
              className={`pin avail-${w.availability}`}
              style={{ left: `${18 + (i % 4) * 18}%`, top: `${22 + Math.floor(i / 4) * 28 + (i % 3) * 6}%` }}
              title={`${w.name} · ${w.skill}`}
            >
              <em>{w.photo || w.name.slice(0, 1)}</em>
              <span>{w.distanceKm} km</span>
            </button>
          ))
        )}
        <div className="map-legend">
          <span><i className="dot available" /> Available</span>
          <span><i className="dot busy" /> Busy</span>
          <span><i className="dot offline" /> Offline cache</span>
        </div>
      </div>
    </div>
  );
}

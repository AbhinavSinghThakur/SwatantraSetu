export function formatINR(n) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function formatRelativeSync(iso) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleString('en-IN');
}

export function stars(rating) {
  const full = Math.floor(rating);
  return `${'★'.repeat(full)}${'☆'.repeat(5 - full)}`;
}

export function roleHome(role) {
  switch (role) {
    case 'worker':
      return '/app/worker';
    case 'coop_admin':
      return '/app/coop';
    case 'federation_admin':
      return '/app/federation';
    case 'customer':
    default:
      return '/app/customer';
  }
}

export function statusLabel(status) {
  const map = {
    pending: 'Pending',
    scheduled: 'Scheduled',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
    available: 'Available',
    busy: 'Busy',
    offline: 'Offline',
  };
  return map[status] || status;
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import { useToast } from '../../context/ToastContext';
import { SkeletonList } from '../../components/ui/Skeleton';

const TYPE_CONFIG = {
  pickup_request: { icon: 'local_shipping', color: 'var(--color-info)',    bg: 'var(--color-info-alpha)' },
  status_change:  { icon: 'sync_alt',       color: 'var(--color-success)',  bg: 'var(--color-success-alpha)' },
  reminder:       { icon: 'alarm',          color: 'var(--color-warning)',  bg: 'var(--color-warning-alpha)' },
  thank_you:      { icon: 'favorite',       color: 'var(--color-danger)',   bg: 'var(--color-danger-alpha)' },
  feedback:       { icon: 'rate_review',    color: 'var(--color-accent)',   bg: 'var(--color-accent-alpha)' },
  default:        { icon: 'notifications',  color: 'var(--color-primary)',  bg: 'var(--color-primary-alpha)' },
};

const MOCK = [
  { id: 1, type: 'pickup_request', title: 'New Pickup Request', message: 'Food Bank XYZ has requested to pick up your fresh produce donation.', status: 'unread', timestamp: new Date(Date.now() - 30 * 60000).toISOString(), actionRequired: true, donation: { id: 101, title: 'Fresh Produce' } },
  { id: 2, type: 'status_change',  title: 'Donation Collected', message: 'Your bakery items donation has been successfully collected.', status: 'read', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), actionRequired: false, donation: { id: 102, title: 'Bakery Items' } },
  { id: 3, type: 'reminder',      title: 'Pickup Window Approaching', message: 'Your prepared meals donation has a pickup window in 2 hours.', status: 'unread', timestamp: new Date(Date.now() - 3600000).toISOString(), actionRequired: false, donation: { id: 103, title: 'Prepared Meals' } },
  { id: 4, type: 'thank_you',     title: 'Thank You Note 💚', message: 'Food Bank XYZ thanks you for your recent donation. You helped 15 families!', status: 'read', timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), actionRequired: false, donation: { id: 104, title: 'Canned Goods' } },
  { id: 5, type: 'feedback',      title: 'Recipient Feedback', message: 'A recipient has left feedback on your recent donation.', status: 'unread', timestamp: new Date(Date.now() - 4 * 86400000).toISOString(), actionRequired: true, donation: { id: 105, title: 'Dairy Products' } },
];

const timeAgo = (ts) => {
  const mins = Math.floor((Date.now() - new Date(ts)) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins/60)}h ago`;
  return `${Math.floor(mins/1440)}d ago`;
};

const Notifications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setTimeout(() => { setItems(MOCK); setLoading(false); }, 800);
  }, []);

  const markRead = (id) => setItems(prev => prev.map(n => n.id === id ? { ...n, status: 'read' } : n));
  const markAllRead = () => {
    setItems(prev => prev.map(n => ({ ...n, status: 'read' })));
    toast.success('All read', 'All notifications marked as read.');
  };

  const unreadCount = items.filter(n => n.status === 'unread').length;
  const filtered = items.filter(n => {
    if (filter === 'unread') return n.status === 'unread';
    if (filter === 'action') return n.actionRequired;
    return true;
  });

  const FILTERS = [
    { key: 'all',    label: 'All' },
    { key: 'unread', label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
    { key: 'action', label: 'Action Required' },
  ];

  return (
    <AppShell title="Notifications" showBack role="donor">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={markAllRead}>
            <span className="material-icons-round icon-sm">done_all</span>
            Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 4, border: '1px solid var(--border)' }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: 'none',
            background: filter === f.key ? 'var(--color-primary)' : 'transparent',
            color: filter === f.key ? 'white' : 'var(--text-secondary)',
            fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? <SkeletonList count={4} /> : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <div className="empty-title">No notifications</div>
          <div className="empty-subtitle">You're all caught up!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((n) => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.default;
            const isUnread = n.status === 'unread';
            return (
              <div key={n.id} onClick={() => markRead(n.id)} style={{
                display: 'flex', gap: 14, padding: '16px', borderRadius: 'var(--radius-md)',
                background: 'var(--surface)', border: `1px solid ${isUnread ? 'var(--color-primary)' : 'var(--border)'}`,
                boxShadow: isUnread ? '0 0 0 2px var(--color-primary-alpha)' : 'var(--shadow-sm)',
                cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-icons-round" style={{ fontSize: 20, color: cfg.color }}>{cfg.icon}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{n.title}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0 }}>{timeAgo(n.timestamp)}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>{n.message}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="badge badge-neutral">{n.donation.title}</span>
                    {n.actionRequired && <span className="badge badge-warning">Action Required</span>}
                  </div>
                </div>
                {isUnread && (
                  <div style={{ position: 'absolute', top: 14, right: 14, width: 10, height: 10, background: 'var(--color-primary)', borderRadius: '50%' }} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
};

export default Notifications;
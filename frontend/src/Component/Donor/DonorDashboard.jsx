import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import { useToast } from '../../context/ToastContext';
import { useSocket } from '../../context/SocketContext';
import { SkeletonStatGrid, SkeletonList } from '../../components/ui/Skeleton';
import { api } from '../../utils/api';
import { getOrCreateDonorRef } from '../../utils/localIdentity';
import './Dashboard.css';

const FOOD_ICONS = {
  'Cooked Food': '🍛', 'Vegetables': '🥦', 'Fruits': '🍎',
  'Bakery Items': '🍞', 'Dairy Products': '🥛', 'Prepared Meals': '🍱',
  default: '🥡',
};

const STATUS_MAP = {
  pending:   { badge: 'badge-warning', label: 'Pending' },
  verified:  { badge: 'badge-info',    label: 'Verified' },
  assigned:  { badge: 'badge-primary', label: 'Assigned' },
  picked_up: { badge: 'badge-primary', label: 'In transit' },
  delivered: { badge: 'badge-success', label: 'Delivered' },
  closed:    { badge: 'badge-neutral', label: 'Closed' },
  rejected:  { badge: 'badge-danger',  label: 'Rejected' },
  expired:   { badge: 'badge-neutral', label: 'Expired' },
  available: { badge: 'badge-primary', label: 'Available' },
};

const ACTIVITY = [
  { icon: '✅', color: '#22C55E', bg: '#DCFCE7', text: 'Vegetables donation picked up by volunteer', time: '2 days ago' },
  { icon: '📦', color: '#3B82F6', bg: '#DBEAFE', text: 'New bread donation created', time: '4 days ago' },
  { icon: '🎉', color: '#F59E0B', bg: '#FEF3C7', text: 'Your meal helped 12 families!', time: '1 week ago' },
];

const DonorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { socket } = useSocket();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [stats, setStats]         = useState({ total: 0, meals: 148, kg: 45, co2: 86 });

  const donorRef = getOrCreateDonorRef();

  const fetchDonations = useCallback(async () => {
    try {
      const res = await api.get('/donations', { params: { donorRef } });
      if (res.data?.success) {
        const data = res.data.donations || [];
        setDonations(data);
        setStats((s) => ({ ...s, total: data.length }));
      }
    } catch {
      toast.error('Offline', 'Could not load your donations. Is the API running?');
      setDonations([]);
      setStats((s) => ({ ...s, total: 0 }));
    } finally {
      setLoading(false);
    }
  }, [donorRef]);

  useEffect(() => {
    setLoading(true);
    fetchDonations();
  }, [fetchDonations]);

  useEffect(() => {
    if (!socket) return;
    const onUpdate = (payload) => {
      if (payload?.donorRef && payload.donorRef !== donorRef) return;
      fetchDonations();
    };
    socket.on('donation_status_changed', onUpdate);
    return () => socket.off('donation_status_changed', onUpdate);
  }, [socket, donorRef, fetchDonations]);

  const STAT_CARDS = [
    { icon: 'volunteer_activism', color: 'green',  value: stats.total, label: 'Donations', suffix: '' },
    { icon: 'restaurant',         color: 'amber',  value: stats.meals, label: 'Meals',     suffix: '' },
    { icon: 'scale',              color: 'blue',   value: stats.kg,    label: 'Kg Saved',  suffix: '' },
    { icon: 'eco',                color: 'purple', value: stats.co2,   label: 'CO₂ Saved', suffix: 'kg' },
  ];

  return (
    <AppShell role="donor">
      {/* Welcome Banner */}
      <div className="donor-welcome anim-fade-up">
        <div className="welcome-avatar">🌱</div>
        <div className="welcome-text">
          <div className="welcome-greeting">Good morning 👋</div>
          <div className="welcome-name">Food Hero!</div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }} title="Stored on this device to show your donations">
            Donor ref · {donorRef.slice(0, 8)}…
          </div>
        </div>
        <button
          className="welcome-notif-btn"
          onClick={() => navigate('/notifications')}
          aria-label="View notifications"
        >
          <span className="material-icons-round">notifications</span>
          <span className="notif-dot" />
        </button>
      </div>

      {/* Impact Stats */}
      <div className="section-header anim-fade-up delay-1">
        <span className="section-title">Your Impact</span>
      </div>

      {loading ? (
        <div style={{ marginBottom: 24 }}><SkeletonStatGrid /></div>
      ) : (
        <div className="stats-grid anim-fade-up delay-1" style={{ marginBottom: 24 }}>
          {STAT_CARDS.map((s) => (
            <div key={s.label} className={`stat-card ${s.color}`}>
              <div className={`stat-icon ${s.color}`}>
                <span className="material-icons-round icon-lg">{s.icon}</span>
              </div>
              <div className="stat-info">
                <div className="stat-value">{s.value}{s.suffix}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions anim-fade-up delay-2">
        <button className="quick-action-btn primary" onClick={() => navigate('/create-donation')}>
          <div className="quick-action-icon"><div className="qa-icon-white"><span className="material-icons-round">add</span></div></div>
          <span className="qa-label" style={{ color: 'white' }}>Donate</span>
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/notifications')}>
          <div className="quick-action-icon qa-icon-amber"><span className="material-icons-round" style={{ fontSize: 22 }}>notifications</span></div>
          <span className="qa-label">Alerts</span>
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/profile')}>
          <div className="quick-action-icon qa-icon-green"><span className="material-icons-round" style={{ fontSize: 22 }}>person</span></div>
          <span className="qa-label">Profile</span>
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/donor-data')}>
          <div className="quick-action-icon" style={{ background: 'var(--color-accent-alpha)', color: 'var(--color-accent)' }}>
            <span className="material-icons-round" style={{ fontSize: 22 }}>bar_chart</span>
          </div>
          <span className="qa-label">Reports</span>
        </button>
      </div>

      {/* Active Donations */}
      <div className="section-header anim-fade-up delay-2">
        <span className="section-title">Active Donations</span>
        <button className="btn btn-ghost btn-sm">View All</button>
      </div>

      <div className="anim-fade-up delay-3">
        {loading ? (
          <SkeletonList count={2} />
        ) : donations.length > 0 ? (
          donations.slice(0, 5).map((d, i) => {
            const statusKey = (d.status || 'pending').toLowerCase();
            const s = STATUS_MAP[statusKey] || STATUS_MAP.pending;
            const icon = FOOD_ICONS[d.food_type] || FOOD_ICONS.default;
            return (
              <div key={d.donation_id || i} className="donation-item">
                <div className="donation-item-icon">{icon}</div>
                <div className="donation-item-info">
                  <div className="donation-item-name">{d.food_type || 'Unknown Food'}</div>
                  <div className="donation-item-meta">
                    <span className="material-icons-round" style={{ fontSize: 13 }}>inventory_2</span>
                    {d.quantity} {d.unit}
                    {(d.expiry_datetime || d.expiry_date) && (
                      <>
                        <span style={{ margin: '0 4px', color: 'var(--border-strong)' }}>·</span>
                        <span className="material-icons-round" style={{ fontSize: 13 }}>schedule</span>
                        Expires {new Date(d.expiry_datetime || d.expiry_date).toLocaleString()}
                      </>
                    )}
                  </div>
                </div>
                <span className={`badge ${s.badge}`}>{s.label}</span>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <div className="empty-title">No active donations</div>
            <div className="empty-subtitle">Create a donation to share food with your community</div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => navigate('/create-donation')}>
              <span className="material-icons-round icon-sm">add</span>
              Create Donation
            </button>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="section-header anim-fade-up delay-3" style={{ marginTop: 28 }}>
        <span className="section-title">Recent Activity</span>
      </div>
      <div className="card anim-fade-up delay-4" style={{ padding: '4px 16px' }}>
        <div className="activity-timeline">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="activity-entry">
              <div className="activity-dot-col">
                <div className="activity-dot" style={{ background: a.bg, color: a.color }}>{a.icon}</div>
                {i < ACTIVITY.length - 1 && <div className="activity-line" />}
              </div>
              <div style={{ paddingTop: 4, flex: 1 }}>
                <div className="activity-text">{a.text}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default DonorDashboard;
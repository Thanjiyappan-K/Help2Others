import React, { useState, useEffect, useMemo } from 'react';
import AppShell from '../../components/layout/AppShell';
import { useToast } from '../../context/ToastContext';
import { useSocket } from '../../context/SocketContext';
import Button from '../../components/ui/Button';
import { FloatingSelect } from '../../components/ui/FloatingInput';
import { SkeletonList } from '../../components/ui/Skeleton';
import MapView from '../../components/map/MapView';
import { api } from '../../utils/api';
import { getVolunteerId, setVolunteerId } from '../../utils/localIdentity';

const DISTRICTS = ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'];

const DeliveryDashboard = () => {
  const { toast } = useToast();
  const { socket, subscribe } = useSocket();
  const [district, setDistrict] = useState('');
  const [volunteerIdInput, setVolunteerIdInput] = useState(() => getVolunteerId() || '');
  const [claimable, setClaimable] = useState([]);
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [completing, setCompleting] = useState(null);
  const [action, setAction] = useState(null);

  useEffect(() => {
    if (district) subscribe?.({ district });
    const vid = volunteerIdInput.trim() || getVolunteerId();
    if (vid) subscribe?.({ volunteerId: vid });
  }, [district, volunteerIdInput, subscribe]);

  const fetchDeliveries = async () => {
    if (!district) { toast.warning('District required', 'Please select a district first.'); return; }
    const vid = volunteerIdInput.trim() || getVolunteerId();
    setLoading(true);
    try {
      const [poolRes, mineRes] = await Promise.all([
        api.get('/donations', { params: { district, status: 'verified', unassigned: 'true' } }),
        vid ? api.get('/donations', { params: { myVolunteerId: vid } }) : Promise.resolve({ data: { donations: [] } }),
      ]);
      const pool = poolRes.data.success ? poolRes.data.donations || [] : [];
      const active = mineRes.data.success ? mineRes.data.donations || [] : [];
      setClaimable(pool);
      setMine(active);
      if (pool.length === 0 && active.length === 0) {
        toast.info('Nothing to show', 'No unclaimed verified donations or your active runs in this district.');
      }
    } catch {
      toast.error('Fetch failed', 'Unable to load deliveries. Check connection.');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!socket || !district) return;
    const refresh = () => { fetchDeliveries(); };
    socket.on('donation_status_changed', refresh);
    return () => socket.off('donation_status_changed', refresh);
  }, [socket, district]);

  const claim = async (donationId) => {
    const vid = volunteerIdInput.trim() || getVolunteerId();
    if (!vid) { toast.warning('Volunteer ID', 'Enter your volunteer ID from registration and save.'); return; }
    setCompleting(donationId);
    try {
      await api.post(`/donations/${donationId}/claim`, { volunteerId: Number(vid) });
      setVolunteerId(vid);
      toast.success('Claimed', 'Pickup assigned to you. Mark picked up when you collect the food.');
      await fetchDeliveries();
    } catch (err) {
      toast.error('Claim failed', err.response?.data?.error || err.message);
    } finally { setCompleting(null); }
  };

  const markPickedUp = async (donationId) => {
    const vid = volunteerIdInput.trim() || getVolunteerId();
    setCompleting(donationId);
    try {
      await api.patch(`/donations/${donationId}/status`, { status: 'picked_up', volunteerId: Number(vid) });
      toast.success('Picked up', 'Head to the beneficiary to complete delivery.');
      await fetchDeliveries();
    } catch (err) {
      toast.error('Update failed', err.response?.data?.error || err.message);
    } finally { setCompleting(null); }
  };

  const markDelivered = async (donationId) => {
    const vid = volunteerIdInput.trim() || getVolunteerId();
    setCompleting(donationId);
    try {
      await api.patch(`/donations/${donationId}/status`, { status: 'delivered', volunteerId: Number(vid) });
      toast.success('Delivered', `Donation #${donationId} completed.`);
      setConfirming(null);
      await fetchDeliveries();
    } catch (err) {
      toast.error('Update failed', err.response?.data?.error || err.message);
    } finally { setCompleting(null); }
  };

  const mapsUrl = (address, city, zip) =>
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${address}, ${city} ${zip || ''}`)}`;

  const mapForDonation = (d) => {
    const markers = [];
    if (d.lat != null && d.lng != null) {
      markers.push({ lat: d.lat, lng: d.lng, kind: 'pickup', label: `Pickup #${d.donation_id}` });
    }
    const ben = d.beneficiary;
    if (ben?.lat != null && ben?.lng != null) {
      markers.push({
        lat: ben.lat,
        lng: ben.lng,
        kind: 'drop',
        label: `Drop · ${ben.organization_name || ben.organizationName || 'Beneficiary'}`,
      });
    }
    let route = null;
    if (d.lat != null && d.lng != null && ben?.lat != null && ben?.lng != null) {
      route = [[d.lat, d.lng], [ben.lat, ben.lng]];
    }
    return { markers, route };
  };

  const allOpen = useMemo(() => [...mine, ...claimable], [mine, claimable]);
  const pendingCount = mine.filter((d) => d.status !== 'delivered').length + claimable.length;

  return (
    <AppShell role="delivery">
      <div style={{
        background: 'linear-gradient(135deg, #1a3a5c, #1e40af, #2563EB)',
        borderRadius: 'var(--radius-xl)', padding: '20px 24px', marginBottom: 20,
        display: 'flex', gap: 14, alignItems: 'flex-start', boxShadow: '0 4px 14px rgba(37,99,235,0.35)', flexWrap: 'wrap',
      }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
          🚚
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Delivery Dashboard</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>Volunteer Portal</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 8 }}>Your volunteer ID (from registration):</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
            <input
              value={volunteerIdInput}
              onChange={(e) => setVolunteerIdInput(e.target.value)}
              placeholder="e.g. 1"
              style={{
                width: 100, padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.35)',
                background: 'rgba(0,0,0,0.15)', color: 'white', fontSize: 14,
              }}
            />
            <button
              type="button"
              onClick={() => { setVolunteerId(volunteerIdInput.trim()); toast.success('Saved', 'Volunteer ID stored on this device.'); }}
              style={{
                padding: '8px 12px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.25)',
                color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 13,
              }}
            >
              Save ID
            </button>
          </div>
        </div>
        {allOpen.length > 0 && (
          <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '8px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>{pendingCount}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Open tasks</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <FloatingSelect label="Select District" name="district" value={district} onChange={(e) => setDistrict(e.target.value)}>
            <option value="">— Choose district —</option>
            {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </FloatingSelect>
        </div>
        <Button variant="primary" onClick={fetchDeliveries} loading={loading} icon="search" style={{ marginBottom: 24 }}>
          Load
        </Button>
      </div>

      {loading ? <SkeletonList count={3} /> : allOpen.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛵</div>
          <div className="empty-title">No deliveries yet</div>
          <div className="empty-subtitle">Load tasks for your district — claim verified donations or continue an assigned run</div>
        </div>
      ) : (
        <>
          {mine.filter((d) => d.status !== 'delivered').length > 0 && (
            <>
              <div className="section-header">
                <span className="section-title">My active deliveries</span>
                <span className="badge badge-primary">{mine.filter((d) => d.status !== 'delivered').length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {mine.filter((d) => d.status !== 'delivered').map((d) => {
                  const { markers, route } = mapForDonation(d);
                  return (
                    <div key={d.donation_id} className="card anim-fade-up" style={{ padding: 0, overflow: 'hidden', borderLeft: '4px solid var(--color-success)' }}>
                      <div style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>#{d.donation_id}</span>
                          <span className="badge badge-warning">{d.status}</span>
                        </div>
                        <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{d.food_type || 'Food'}</h4>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                          {d.address}, {d.city}, {d.zip_code}
                        </div>
                        {markers.length > 0 && <MapView markers={markers} route={route} height="200px" />}
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          <a
                            href={mapsUrl(d.address, d.city, d.zip_code)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              flex: 1, minWidth: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                              padding: '10px 14px', borderRadius: 10, border: '1.5px solid var(--color-info)', color: 'var(--color-info)',
                              fontWeight: 600, fontSize: 13, textDecoration: 'none', background: 'var(--color-info-alpha)',
                            }}
                          >
                            <span className="material-icons-round" style={{ fontSize: 16 }}>map</span>
                            Navigate
                          </a>
                          {d.status === 'assigned' && (
                            <Button
                              variant="secondary"
                              loading={completing === d.donation_id && action === 'pickup'}
                              onClick={() => { setAction('pickup'); markPickedUp(d.donation_id); }}
                              icon="inventory_2"
                            >
                              Picked up
                            </Button>
                          )}
                          {(d.status === 'picked_up' || d.status === 'assigned') && (
                            <Button
                              variant="primary"
                              loading={completing === d.donation_id && action === 'deliver'}
                              onClick={() => {
                                if (confirming === d.donation_id) {
                                  setAction('deliver');
                                  markDelivered(d.donation_id);
                                } else setConfirming(d.donation_id);
                              }}
                              icon={confirming === d.donation_id ? 'check_circle' : 'local_shipping'}
                            >
                              {confirming === d.donation_id ? 'Confirm delivered' : 'Delivered'}
                            </Button>
                          )}
                        </div>
                        {confirming === d.donation_id && (
                          <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--color-success-alpha)', borderRadius: 10 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)' }}>Confirm handoff at beneficiary?</span>
                            <button type="button" onClick={() => setConfirming(null)} style={{ marginLeft: 12, background: 'none', border: 'none', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>Cancel</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {claimable.length > 0 && (
            <>
              <div className="section-header">
                <span className="section-title">Available to claim</span>
                <span className="badge badge-primary">{claimable.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {claimable.map((d) => (
                  <div key={d.donation_id} className="card anim-fade-up" style={{ padding: '16px 18px', borderLeft: '4px solid var(--color-primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>#{d.donation_id}</span>
                      <span className="badge badge-info">Verified</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{d.food_type}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{d.address}, {d.city}</div>
                    <Button variant="primary" icon="pan_tool" loading={completing === d.donation_id} onClick={() => claim(d.donation_id)}>
                      Claim this delivery
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}

          {mine.filter((d) => d.status === 'delivered').length > 0 && (
            <>
              <div className="section-header">
                <span className="section-title" style={{ fontSize: 16 }}>Completed</span>
                <span className="badge badge-success">{mine.filter((d) => d.status === 'delivered').length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {mine.filter((d) => d.status === 'delivered').map((d) => (
                  <div key={d.donation_id} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', opacity: 0.85 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>#{d.donation_id} · {d.food_type}</div>
                    <span className="badge badge-success" style={{ marginLeft: 'auto' }}>Done</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </AppShell>
  );
};

export default DeliveryDashboard;

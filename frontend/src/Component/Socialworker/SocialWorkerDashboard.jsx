import React, { useState, useEffect, useMemo } from 'react';
import AppShell from '../../components/layout/AppShell';
import { useToast } from '../../context/ToastContext';
import { useSocket } from '../../context/SocketContext';
import FloatingInput, { FloatingTextarea, FloatingSelect } from '../../components/ui/FloatingInput';
import Button from '../../components/ui/Button';
import { SkeletonList } from '../../components/ui/Skeleton';
import MapView from '../../components/map/MapView';
import { api } from '../../utils/api';
import { getSocialWorkerId, setSocialWorkerId } from '../../utils/localIdentity';

const DISTRICTS = ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'];
const CHECKLIST_ITEMS = [
  { key: 'freshness',   label: 'Food appears fresh and edible',      icon: 'eco' },
  { key: 'packaging',   label: 'Packaging is intact and clean',       icon: 'inventory_2' },
  { key: 'temperature', label: 'Temperature is appropriate',          icon: 'thermostat' },
  { key: 'expiration',  label: 'Not expired / within use-by date',    icon: 'event_available' },
  { key: 'quantity',    label: 'Quantity matches donation description', icon: 'scale' },
];

const PRIORITY_STYLE = {
  high:   { badge: 'badge-danger',   bar: 'priority-high' },
  medium: { badge: 'badge-warning',  bar: 'priority-medium' },
  low:    { badge: 'badge-success',  bar: 'priority-low' },
};

const SocialWorkerDashboard = () => {
  const { toast } = useToast();
  const { socket, subscribe } = useSocket();
  const [tab, setTab]               = useState('donations');
  const [district, setDistrict]     = useState('');
  const [donations, setDonations]   = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [selected, setSelected]     = useState(null);
  const [beneficiaryId, setBeneficiaryId] = useState('');
  const [workerIdInput, setWorkerIdInput] = useState(() => getSocialWorkerId() || '');
  const [checklist, setChecklist]   = useState({ freshness: false, packaging: false, temperature: false, expiration: false, quantity: false });
  const [notes, setNotes]           = useState('');
  const [tempReading, setTempReading] = useState('');
  const [photo, setPhoto]           = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (district) subscribe?.({ district });
  }, [district, subscribe]);

  const fetchBeneficiaries = async (d) => {
    if (!d) return;
    try {
      let res = await api.get('/beneficiaries', { params: { district: d, isApproved: 'true' } });
      let list = res.data.beneficiaries || [];
      if (list.length === 0) {
        res = await api.get('/beneficiaries', { params: { district: d } });
        list = res.data.beneficiaries || [];
      }
      setBeneficiaries(list);
    } catch {
      setBeneficiaries([]);
    }
  };

  const fetchDonations = async () => {
    if (!district) { toast.warning('District required', 'Please select a district first.'); return; }
    setLoading(true);
    try {
      await fetchBeneficiaries(district);
      const res = await api.get('/donors', { params: { district } });
      if (res.data.success) {
        setDonations(res.data.donors.map(d => ({
          donation_id: d.donation_id,
          donor: d.donor_ref ? `Donor ${String(d.donor_ref).slice(0, 8)}…` : (d.address || 'Donor'),
          foodType: d.food_type,
          quantity: `${d.quantity} ${d.unit}`,
          pickupLocation: d.address,
          timeReceived: d.created_at || '',
          priority: d.priority || 'medium',
          status: d.status || 'pending',
          lat: d.lat,
          lng: d.lng,
          city: d.city,
        })));
      }
    } catch {
      toast.error('Fetch failed', 'Unable to load donations. Check connection.');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!socket || !district) return;
    const refresh = () => { fetchDonations(); };
    socket.on('donation_status_changed', refresh);
    return () => socket.off('donation_status_changed', refresh);
  }, [socket, district]);

  const pending = donations.filter(d => d.status === 'pending');

  const mapMarkers = useMemo(() => {
    const m = [];
    pending.forEach((d) => {
      if (d.lat != null && d.lng != null) {
        m.push({ lat: d.lat, lng: d.lng, kind: 'pickup', label: `#${d.donation_id} ${d.foodType}` });
      }
    });
    beneficiaries.forEach((b) => {
      if (b.lat != null && b.lng != null) {
        m.push({
          lat: b.lat,
          lng: b.lng,
          kind: 'drop',
          label: `${b.organizationName || 'Beneficiary'} · ${b.district || ''}`,
        });
      }
    });
    return m;
  }, [pending, beneficiaries]);

  const allChecked = Object.values(checklist).every(Boolean);

  const approveDonation = async () => {
    const swId = workerIdInput.trim() || getSocialWorkerId();
    if (!swId) { toast.warning('Worker ID', 'Save your Social Worker ID (from registration) in the field above.'); return; }
    if (!beneficiaryId) { toast.warning('Beneficiary', 'Select a beneficiary to receive this food.'); return; }
    if (!allChecked) { toast.warning('Checklist incomplete', 'Complete all quality checks before approving.'); return; }
    setSubmitting(true);
    try {
      await api.patch(`/donations/${selected.donation_id}/status`, {
        status: 'verified',
        socialWorkerId: Number(swId),
        beneficiaryId: Number(beneficiaryId),
        remarks: tempReading ? `Temp °C: ${tempReading}` : undefined,
      });
      setSocialWorkerId(swId);
      setDonations(prev => prev.map(d => d.donation_id === selected.donation_id ? { ...d, status: 'verified' } : d));
      toast.success('Verified', `Donation #${selected.donation_id} routed to beneficiary. Volunteers can claim it.`);
      setSelected(null);
      setBeneficiaryId('');
    } catch (err) {
      toast.error('Approval failed', err.response?.data?.error || err.message || 'Try again.');
    }
    finally { setSubmitting(false); }
  };

  const rejectDonation = async () => {
    const swId = workerIdInput.trim() || getSocialWorkerId();
    if (!swId) { toast.warning('Worker ID', 'Enter your Social Worker ID for the audit log.'); return; }
    if (!notes.trim()) { toast.warning('Notes required', 'Please provide a reason for rejection.'); return; }
    setSubmitting(true);
    try {
      await api.patch(`/donations/${selected.donation_id}/status`, {
        status: 'rejected',
        socialWorkerId: Number(swId),
        remarks: notes,
      });
      setSocialWorkerId(swId);
      setDonations(prev => prev.map(d => d.donation_id === selected.donation_id ? { ...d, status: 'rejected' } : d));
      toast.info('Rejected', `Donation #${selected.donation_id} rejected.`);
      setSelected(null);
    } catch (err) {
      toast.error('Rejection failed', err.response?.data?.error || err.message || 'Try again.');
    }
    finally { setSubmitting(false); }
  };

  const TAB_ITEMS = [
    { key: 'donations',      icon: 'fact_check',     label: 'Donations' },
    { key: 'notifications',  icon: 'notifications',  label: 'Notifications' },
    { key: 'reports',        icon: 'flag',            label: 'Reports' },
  ];

  return (
    <AppShell role="social">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f, #1e40af, #3B82F6)',
        borderRadius: 'var(--radius-xl)', padding: '20px 24px', marginBottom: 20,
        display: 'flex', gap: 14, alignItems: 'center', boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
      }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
          👩‍💼
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Social Worker</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>Verification desk</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>
            Your ID (from registration, stored on this device):
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
            <input
              value={workerIdInput}
              onChange={(e) => setWorkerIdInput(e.target.value)}
              placeholder="e.g. 1"
              style={{
                width: 100, padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.35)',
                background: 'rgba(0,0,0,0.15)', color: 'white', fontSize: 14,
              }}
            />
            <button
              type="button"
              onClick={() => { setSocialWorkerId(workerIdInput.trim()); toast.success('Saved', 'Worker ID stored locally.'); }}
              style={{
                padding: '8px 12px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.25)',
                color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: 13,
              }}
            >
              Save ID
            </button>
          </div>
        </div>
      </div>

      {/* District Picker */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <FloatingSelect label="Select District" name="district" value={district} onChange={e => setDistrict(e.target.value)}>
            <option value="">— Choose district —</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </FloatingSelect>
        </div>
        <Button variant="primary" onClick={fetchDonations} loading={loading} icon="search" style={{ marginBottom: 24 }}>
          Fetch
        </Button>
      </div>

      {tab === 'donations' && mapMarkers.length > 0 && (
        <MapView markers={mapMarkers} height="260px" />
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 4, border: '1px solid var(--border)', marginBottom: 20 }}>
        {TAB_ITEMS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '10px 8px', borderRadius: 'var(--radius-sm)', border: 'none',
            background: tab === t.key ? 'var(--color-info)' : 'transparent',
            color: tab === t.key ? 'white' : 'var(--text-secondary)',
            fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
          }}>
            <span className="material-icons-round" style={{ fontSize: 16 }}>{t.icon}</span>
            <span style={{ display: window.innerWidth < 380 ? 'none' : 'inline' }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Verification Panel – Slide-in when donation selected */}
      {selected && (
        <div className="card anim-scale" style={{ padding: 20, marginBottom: 20, border: '2px solid var(--color-info)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <button className="btn btn-icon btn-ghost" onClick={() => setSelected(null)}>
              <span className="material-icons-round">arrow_back</span>
            </button>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
              Verify Donation #{selected.donation_id}
            </h3>
          </div>

          {/* Donation Info */}
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 20 }}>
            {[['Donor', selected.donor], ['Food', selected.foodType], ['Quantity', selected.quantity], ['Location', selected.pickupLocation]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{k}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{v || '—'}</span>
              </div>
            ))}
          </div>

          <FloatingSelect
            label="Assign beneficiary (receiving organization)"
            name="beneficiaryId"
            value={beneficiaryId}
            onChange={(e) => setBeneficiaryId(e.target.value)}
            required
          >
            <option value="">— Select approved beneficiary —</option>
            {beneficiaries.map((b) => (
              <option key={b.id} value={b.id}>
                {b.organizationName} · {b.district}
              </option>
            ))}
          </FloatingSelect>
          {beneficiaries.length === 0 && (
            <p style={{ fontSize: 12, color: 'var(--color-warning)', marginBottom: 12 }}>
              No beneficiaries in this district yet — register one under Beneficiaries or approve pending orgs in Admin.
            </p>
          )}

          {/* Checklist */}
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quality Checklist</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {CHECKLIST_ITEMS.map((item) => (
              <label
                key={item.key}
                className="checkbox-custom"
                style={{ cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(checklist[item.key])}
                  onChange={(e) =>
                    setChecklist((c) => ({ ...c, [item.key]: e.target.checked }))
                  }
                />
                <div className={`checkbox-box ${checklist[item.key] ? 'checked' : ''}`} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="material-icons-round" style={{ fontSize: 18, color: 'var(--color-info)' }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{item.label}</span>
                </div>
              </label>
            ))}
          </div>

          <FloatingInput label="Temperature Reading (°C)" name="temp" type="text" value={tempReading} onChange={e => setTempReading(e.target.value)} icon="thermostat" />

          {/* Photo Upload */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Photo Evidence</div>
            <label style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', border: '2px dashed var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) setPhoto(URL.createObjectURL(e.target.files[0])); }} />
              <span className="material-icons-round" style={{ color: 'var(--text-tertiary)' }}>add_a_photo</span>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>{photo ? 'Photo added ✓' : 'Upload photo evidence'}</span>
            </label>
            {photo && <img src={photo} alt="Evidence" style={{ width: '100%', marginTop: 8, borderRadius: 10, maxHeight: 160, objectFit: 'cover' }} />}
          </div>

          <FloatingTextarea label="Verification Notes" name="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Observations, concerns, special handling..." />

          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="danger" full loading={submitting} onClick={rejectDonation} icon="cancel">Reject</Button>
            <Button variant="primary" full loading={submitting} onClick={approveDonation}
              icon="verified" disabled={!allChecked}>
              Approve & Notify
            </Button>
          </div>
          {!allChecked && <p style={{ fontSize: 12, color: 'var(--color-warning)', textAlign: 'center', marginTop: 8 }}>Complete all checklist items to approve</p>}
        </div>
      )}

      {/* Donations Tab */}
      {tab === 'donations' && !selected && (
        <>
          <div className="section-header">
            <span className="section-title">Pending Donations</span>
            {pending.length > 0 && <span className="badge badge-warning">{pending.length}</span>}
          </div>
          {loading ? <SkeletonList count={3} /> : pending.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <div className="empty-title">{donations.length === 0 ? 'Select a district' : 'No pending donations'}</div>
              <div className="empty-subtitle">{donations.length === 0 ? 'Choose a district and fetch donations' : 'All donations have been verified.'}</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pending.map(d => {
                const ps = PRIORITY_STYLE[d.priority] || PRIORITY_STYLE.medium;
                return (
                  <div key={d.donation_id} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', display: 'flex' }}>
                    <div className={`priority-bar ${ps.bar}`} />
                    <div style={{ flex: 1, padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>#{d.donation_id}</span>
                        <span className={`badge ${ps.badge}`}>{d.priority}</span>
                      </div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{d.donor}</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>🍱 {d.foodType} · {d.quantity}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 12 }}>📍 {d.pickupLocation}</p>
                      <Button variant="secondary" btn-sm onClick={() => { setSelected(d); setBeneficiaryId(''); setChecklist({ freshness: false, packaging: false, temperature: false, expiration: false, quantity: false }); setNotes(''); setPhoto(null); }} icon="fact_check">
                        Verify Now
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Notifications Tab */}
      {tab === 'notifications' && !selected && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[{ id: 5, label: '#5', status: 'Delivered', type: 'success', recipient: 'John (Picker)', time: '2025-03-31 08:45' },
            { id: 4, label: '#4', status: 'Read',      type: 'info',    recipient: 'Maria (Picker)', time: '2025-03-30 14:20' },
            { id: 3, label: '#3', status: 'Pending',   type: 'warning', recipient: 'Alex (Picker)',  time: '2025-03-30 11:30' }
          ].map(n => (
            <div key={n.id} className="card" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Donation {n.label}</span>
                <span className={`badge badge-${n.type}`}>{n.status}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Recipient: {n.recipient}</p>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Sent: {n.time}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reports Tab */}
      {tab === 'reports' && !selected && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Issue Report</h3>
          <FloatingSelect label="Issue Type" name="issueType" value="" onChange={() => {}}>
            <option value="">Select issue type…</option>
            <option value="food_quality">Food Quality Issue</option>
            <option value="donor_issue">Donor Issue</option>
            <option value="delivery_problem">Delivery Problem</option>
            <option value="other">Other</option>
          </FloatingSelect>
          <FloatingInput label="Related Donation ID" name="donationId" value="" onChange={() => {}} icon="tag" />
          <FloatingSelect label="Severity" name="severity" value="" onChange={() => {}}>
            <option value="">Select severity…</option>
            <option value="low">Low – Informational</option>
            <option value="medium">Medium – Needs attention</option>
            <option value="high">High – Urgent</option>
          </FloatingSelect>
          <FloatingTextarea label="Description" name="description" value="" onChange={() => {}} rows={4} placeholder="Describe the issue in detail…" />
          <Button variant="primary" full icon="send" onClick={() => toast.success('Report submitted', 'Your issue report has been sent.')}>Submit Report</Button>
        </div>
      )}
    </AppShell>
  );
};

export default SocialWorkerDashboard;
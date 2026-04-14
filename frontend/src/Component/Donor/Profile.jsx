import React, { useState, useEffect } from 'react';
import AppShell from '../../components/layout/AppShell';
import FloatingInput, { FloatingTextarea, FloatingSelect } from '../../components/ui/FloatingInput';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

const MOCK_PROFILE = {
  name: 'Fresh Harvest Restaurant', email: 'contact@freshharvestrestaurant.com',
  phone: '(555) 123-4567', address: '123 Main Street, Foodville', organizationType: 'restaurant',
  bio: 'Farm-to-table restaurant committed to reducing food waste and supporting our local community.',
  joinDate: '2023-05-15',
};
const MOCK_STATS = [
  { icon: 'volunteer_activism', color: 'green',  value: 42,  label: 'Donations' },
  { icon: 'star',               color: 'amber',  value: 89,  label: 'Impact Score' },
  { icon: 'restaurant',         color: 'blue',   value: 320, label: 'Meals Donated' },
  { icon: 'scale',              color: 'purple', value: '275kg', label: 'Food Rescued' },
];

const Profile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [form, setForm]       = useState(MOCK_PROFILE);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setTimeout(() => { setProfile(MOCK_PROFILE); setLoading(false); }, 600); }, []);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setProfile(form);
    setSaving(false);
    setEditing(false);
    toast.success('Profile updated!', 'Your changes have been saved.');
  };

  const initials = (name) => name ? name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : '?';

  if (loading) return (
    <AppShell title="Profile" showBack role="donor">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="skeleton skeleton-card" style={{ height: 160 }} />
        <div className="skeleton" style={{ height: 100, borderRadius: 16 }} />
      </div>
    </AppShell>
  );

  return (
    <AppShell title="Profile" showBack role="donor">
      {/* Profile Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary), #4ADE80)',
        borderRadius: 'var(--radius-xl)', padding: '32px 24px', marginBottom: 20,
        display: 'flex', alignItems: 'flex-start', gap: 18, position: 'relative',
        boxShadow: 'var(--shadow-primary)',
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 18,
          background: 'rgba(255,255,255,0.25)', border: '3px solid rgba(255,255,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, color: 'white', flexShrink: 0,
        }}>
          {initials(profile.name)}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 4 }}>{profile.name}</h2>
          <span style={{
            background: 'rgba(255,255,255,0.2)', color: 'white', padding: '3px 12px',
            borderRadius: 100, fontSize: 12, fontWeight: 600,
          }}>
            {profile.organizationType.charAt(0).toUpperCase() + profile.organizationType.slice(1)}
          </span>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>
            Member since {new Date(profile.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
            width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
          }}>
            <span className="material-icons-round" style={{ fontSize: 18 }}>edit</span>
          </button>
        )}
      </div>

      {/* Impact Stats */}
      <div className="stats-grid anim-fade-up" style={{ marginBottom: 20 }}>
        {MOCK_STATS.map((s) => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className={`stat-icon ${s.color}`}>
              <span className="material-icons-round icon-lg">{s.icon}</span>
            </div>
            <div className="stat-info">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form / View */}
      {editing ? (
        <div className="card anim-scale" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>Edit Profile</h3>
          <FloatingInput label="Organization Name" name="name" value={form.name} onChange={onChange} required />
          <FloatingInput label="Email" name="email" type="email" value={form.email} onChange={onChange} icon="email" />
          <FloatingInput label="Phone" name="phone" type="tel" value={form.phone} onChange={onChange} icon="phone" />
          <FloatingInput label="Address" name="address" value={form.address} onChange={onChange} icon="place" />
          <FloatingSelect label="Organization Type" name="organizationType" value={form.organizationType} onChange={onChange}>
            {['restaurant','grocery','farm','catering','bakery','other'].map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
            ))}
          </FloatingSelect>
          <FloatingTextarea label="Bio" name="bio" value={form.bio} onChange={onChange} rows={4} />
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <Button variant="ghost" full onClick={() => { setForm(profile); setEditing(false); }}>Cancel</Button>
            <Button variant="primary" full loading={saving} onClick={handleSave} icon="save">
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="card anim-fade-up" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { icon: 'info', label: 'About', value: profile.bio },
            { icon: 'email', label: 'Email', value: profile.email },
            { icon: 'phone', label: 'Phone', value: profile.phone },
            { icon: 'place', label: 'Address', value: profile.address },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 20px', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-icons-round" style={{ fontSize: 18, color: 'var(--color-primary)' }}>{row.icon}</span>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{row.label}</div>
                <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5 }}>{row.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
};

export default Profile;
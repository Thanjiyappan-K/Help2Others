import React, { useState } from 'react';
import { API_BASE } from '../../utils/api';
import { setSocialWorkerId } from '../../utils/localIdentity';

const SocialWorkerRegistration = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', district: '', lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/social-workers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.socialWorkerId != null) setSocialWorkerId(String(data.socialWorkerId));
        alert(`Registered successfully! Your Social Worker ID is ${data.socialWorkerId}. It has been saved on this device.`);
        setFormData({ name: '', phone: '', email: '', district: '', lat: null, lng: null });
        if (onSuccess) onSuccess();
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setFormData(prev => ({ ...prev, lat: position.coords.latitude, lng: position.coords.longitude })),
        (error) => alert('Failed to get location. ' + error.message)
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Social Worker Registration</h2>
      {error && <p style={{color: 'red', marginBottom: '15px'}}>{error}</p>}
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
        <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{padding: '12px', border: '1px solid #ccc', borderRadius: '4px'}} />
        <input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{padding: '12px', border: '1px solid #ccc', borderRadius: '4px'}} />
        <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{padding: '12px', border: '1px solid #ccc', borderRadius: '4px'}} />
        <input type="text" placeholder="District (e.g. Coimbatore)" required value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} style={{padding: '12px', border: '1px solid #ccc', borderRadius: '4px'}} />
        <button type="button" onClick={captureLocation} style={{padding: '12px 15px', backgroundColor: '#f39c12', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>
          {formData.lat ? `Location Captured (${formData.lat.toFixed(2)}, ${formData.lng.toFixed(2)})` : 'Capture My Location'}
        </button>
        <button type="submit" disabled={loading} style={{padding: '12px 15px', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default SocialWorkerRegistration;

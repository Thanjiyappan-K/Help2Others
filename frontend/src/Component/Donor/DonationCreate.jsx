import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import { useToast } from '../../context/ToastContext';
import FloatingInput, { FloatingTextarea, FloatingSelect } from '../../components/ui/FloatingInput';
import Button from '../../components/ui/Button';
import MapPicker from '../../components/map/MapPicker';
import { api } from '../../utils/api';
import { getOrCreateDonorRef } from '../../utils/localIdentity';
import { reverseGeocode } from '../../utils/geocode';

const DISTRICTS = ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'];
const DISTRICT_CENTERS = {
  Chennai: [13.0827, 80.2707],
  Coimbatore: [11.0168, 76.9558],
  Madurai: [9.9252, 78.1198],
  Tiruchirappalli: [10.7905, 78.7047],
  Salem: [11.6643, 78.146],
};

const STEPS = [
  { icon: 'restaurant', label: 'Food Details' },
  { icon: 'schedule',   label: 'Availability' },
  { icon: 'location_on', label: 'Location' },
  { icon: 'rule',        label: 'Review' },
];

const FOOD_TYPES = [
  'Fresh Produce', 'Bakery Items', 'Prepared Meals', 'Canned Goods',
  'Dairy Products', 'Meat & Poultry', 'Seafood', 'Grains & Cereals', 'Snacks', 'Beverages',
];

const UNIT_MAP = {
  'Fresh Produce': ['kg', 'g', 'lb', 'items'],
  'Bakery Items': ['items', 'servings', 'trays'],
  'Prepared Meals': ['servings', 'trays', 'items'],
  'Dairy Products': ['liters', 'kg', 'items'],
  'Beverages': ['liters', 'bottles', 'cans'],
  default: ['kg', 'items', 'servings', 'boxes'],
};

const Stepper = ({ current }) => (
  <div className="stepper" style={{ marginBottom: 32 }}>
    {STEPS.map((s, i) => (
      <div key={i} className={`stepper-item ${i < current ? 'completed' : ''} ${i === current ? 'active' : ''}`}>
        <div className="stepper-circle">
          {i < current
            ? <span className="material-icons-round" style={{ fontSize: 16 }}>check</span>
            : i === current
              ? <span className="material-icons-round" style={{ fontSize: 16 }}>{s.icon}</span>
              : i + 1}
        </div>
        {i < STEPS.length - 1 && <div className="stepper-line" />}
      </div>
    ))}
  </div>
);

const DonationCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    foodType: '', description: '', quantity: '', unit: '', image: null,
    expiryDate: '', expiryTime: '', pickupStartDate: '', pickupStartTime: '',
    pickupEndDate: '', pickupEndTime: '',
    address: '', city: '', district: '', zipCode: '', specialInstructions: '',
    lat: '', lng: '',
  });
  const [errors, setErrors] = useState({});

  const set = (name, value) => {
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
  };
  const onChange = (e) => set(e.target.name, e.target.value);

  const validate = () => {
    const err = {};
    if (step === 0) {
      if (!form.foodType) err.foodType = 'Please select a food type';
      if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) <= 0) err.quantity = 'Enter a valid quantity';
      if (!form.unit) err.unit = 'Select a unit';
    }
    if (step === 1) {
      if (!form.expiryDate || !form.expiryTime) err.expiryDate = 'Expiry date & time required';
    }
    if (step === 2) {
      if (!form.address.trim()) err.address = 'Address is required';
      if (!form.city.trim()) err.city = 'City is required';
      if (!form.district.trim()) err.district = 'District is required';
      if (!form.zipCode.trim()) err.zipCode = 'ZIP code is required';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      set('image', file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      const donorRef = getOrCreateDonorRef();
      fd.append('donorRef', donorRef);
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'image' && v) fd.append('image', v);
        else if (v !== null && v !== undefined && v !== '') fd.append(k, v.toString());
      });
      const res = await api.post('/donations', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        toast.success('Donation created! 🎉', 'Your donation has been submitted successfully.');
        setTimeout(() => navigate('/dash'), 1500);
      }
    } catch (err) {
      toast.error('Submission failed', err.response?.data?.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const units = UNIT_MAP[form.foodType] || UNIT_MAP.default;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="anim-fade-up">
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Food Details</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Tell us about the food you're donating</p>

            <FloatingSelect label="Food Type" name="foodType" value={form.foodType}
              onChange={(e) => { set('foodType', e.target.value); set('unit', (UNIT_MAP[e.target.value] || UNIT_MAP.default)[0]); }}
              error={errors.foodType} required>
              <option value="">Select food type</option>
              {FOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </FloatingSelect>

            <FloatingTextarea label="Description (Optional)" name="description"
              value={form.description} onChange={onChange} rows={3}
              placeholder="Briefly describe the food, preparation method, etc." />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FloatingInput label="Quantity" name="quantity" type="number"
                value={form.quantity} onChange={onChange} error={errors.quantity}
                icon="scale" required min="1" />
              <FloatingSelect label="Unit" name="unit" value={form.unit} onChange={onChange} error={errors.unit} required>
                <option value="">Unit</option>
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </FloatingSelect>
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>
                Photo (Optional)
              </div>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)',
                padding: 24, cursor: 'pointer', transition: 'border-color 0.2s',
                background: preview ? 'var(--surface)' : 'var(--bg-secondary)',
              }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { set('image', f); setPreview(URL.createObjectURL(f)); } }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                {preview ? (
                  <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8 }} />
                ) : (
                  <>
                    <span className="material-icons-round" style={{ fontSize: 40, color: 'var(--text-tertiary)', marginBottom: 8 }}>add_photo_alternate</span>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>Tap to add photo</span>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>or drag & drop here</span>
                  </>
                )}
              </label>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="anim-fade-up">
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Availability</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>When can this food be picked up?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FloatingInput label="Expiry Date" name="expiryDate" type="date" value={form.expiryDate} onChange={onChange} error={errors.expiryDate} required />
              <FloatingInput label="Expiry Time" name="expiryTime" type="time" value={form.expiryTime} onChange={onChange} />
            </div>
            <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 12px', letterSpacing: '0.3px' }}>PICKUP WINDOW</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FloatingInput label="Start Date" name="pickupStartDate" type="date" value={form.pickupStartDate} onChange={onChange} />
              <FloatingInput label="Start Time" name="pickupStartTime" type="time" value={form.pickupStartTime} onChange={onChange} />
              <FloatingInput label="End Date" name="pickupEndDate" type="date" value={form.pickupEndDate} onChange={onChange} />
              <FloatingInput label="End Time" name="pickupEndTime" type="time" value={form.pickupEndTime} onChange={onChange} />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="anim-fade-up">
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Pickup Location</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Pin the pickup spot and confirm the address.</p>
            <FloatingSelect label="District (for matching)" name="district" value={form.district} onChange={onChange} error={errors.district} required>
              <option value="">Select district</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </FloatingSelect>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  const c = DISTRICT_CENTERS[form.district];
                  if (!c) {
                    toast.warning('Pick a district first', 'Select district, then place a default pin.');
                    return;
                  }
                  setForm((f) => ({ ...f, lat: c[0], lng: c[1] }));
                  toast.info('Pin placed', 'Drag the pin to the exact pickup entrance if needed.');
                }}
              >
                <span className="material-icons-round icon-sm">place</span>
                Default pin (district)
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  if (!navigator.geolocation) {
                    toast.error('Not supported', 'Geolocation is not available in this browser.');
                    return;
                  }
                  navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                      const la = pos.coords.latitude;
                      const ln = pos.coords.longitude;
                      setForm((f) => ({ ...f, lat: la, lng: ln }));
                      try {
                        const g = await reverseGeocode(la, ln);
                        setForm((f) => ({
                          ...f,
                          lat: la,
                          lng: ln,
                          address: g.address || f.address,
                          city: g.city || f.city,
                          zipCode: g.zipCode || f.zipCode,
                          district: g.district || f.district,
                        }));
                        toast.success('Location set', 'Map and address updated from GPS.');
                      } catch {
                        toast.info('Coords saved', 'Could not reverse-geocode; adjust the pin or type the address.');
                      }
                    },
                    () => toast.error('Location denied', 'Allow location or place the pin manually.')
                  );
                }}
              >
                <span className="material-icons-round icon-sm">my_location</span>
                Use GPS
              </button>
            </div>
            {form.lat !== '' && form.lng !== '' && (
              <MapPicker
                lat={Number(form.lat)}
                lng={Number(form.lng)}
                onPositionChange={(la, ln) => setForm((f) => ({ ...f, lat: la, lng: ln }))}
              />
            )}
            <FloatingInput label="Street Address" name="address" value={form.address} onChange={onChange} error={errors.address} icon="place" required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FloatingInput label="City" name="city" value={form.city} onChange={onChange} error={errors.city} required />
              <FloatingInput label="ZIP / PIN Code" name="zipCode" value={form.zipCode} onChange={onChange} error={errors.zipCode} required />
            </div>
            <FloatingTextarea label="Special Instructions (Optional)" name="specialInstructions"
              value={form.specialInstructions} onChange={onChange} rows={3}
              placeholder="Gate code, parking info, contact person at pickup..." />
          </div>
        );

      case 3:
        return (
          <div className="anim-fade-up">
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Review & Submit</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Check your details before submitting</p>
            {[
              { icon: 'restaurant', label: 'Food Type', value: form.foodType },
              { icon: 'scale', label: 'Quantity', value: `${form.quantity} ${form.unit}` },
              { icon: 'schedule', label: 'Expires', value: `${form.expiryDate} ${form.expiryTime}` },
              { icon: 'place', label: 'Location', value: `${form.address}, ${form.district || form.city} – ${form.zipCode}` },
              form.description && { icon: 'notes', label: 'Description', value: form.description },
            ].filter(Boolean).map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-icons-round" style={{ fontSize: 18, color: 'var(--color-primary)' }}>{item.icon}</span>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', marginTop: 2 }}>{item.value || '—'}</div>
                </div>
              </div>
            ))}
            {preview && <img src={preview} alt="Food preview" style={{ width: '100%', borderRadius: 12, marginTop: 16, objectFit: 'cover', maxHeight: 180 }} />}
          </div>
        );
      default: return null;
    }
  };

  return (
    <AppShell title="Create Donation" showBack role="donor">
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <Stepper current={step} />
        {renderStep()}
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          {step > 0 && (
            <Button variant="ghost" onClick={back} icon="arrow_back" full>Back</Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button variant="primary" onClick={next} iconEnd="arrow_forward" full>Continue</Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} loading={submitting} icon="check_circle" full>
              {submitting ? 'Submitting…' : 'Submit Donation'}
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default DonationCreate;
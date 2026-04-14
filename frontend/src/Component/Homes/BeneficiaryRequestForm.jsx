import React, { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import { useToast } from '../../context/ToastContext';
import FloatingInput, { FloatingTextarea, FloatingSelect } from '../../components/ui/FloatingInput';
import Button from '../../components/ui/Button';
import MapPicker from '../../components/map/MapPicker';
import { api } from '../../utils/api';
import { setBeneficiaryId } from '../../utils/localIdentity';

const STEPS = [
  { icon: 'business', label: 'Organization' },
  { icon: 'place',    label: 'Location' },
  { icon: 'group',    label: 'Capacity' },
  { icon: 'restaurant', label: 'Food Needs' },
  { icon: 'summarize', label: 'Submit' },
];

const STATES = ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Kerala', 'Andhra Pradesh', 'Delhi'];
const DISTRICTS_MAP = { 'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'], default: [] };

const Stepper = ({ current }) => (
  <div className="stepper" style={{ marginBottom: 28 }}>
    {STEPS.map((s, i) => (
      <div key={i} className={`stepper-item ${i < current ? 'completed' : ''} ${i === current ? 'active' : ''}`}>
        <div className="stepper-circle">
          {i < current ? <span className="material-icons-round" style={{ fontSize: 14 }}>check</span> : i + 1}
        </div>
        {i < STEPS.length - 1 && <div className="stepper-line" />}
      </div>
    ))}
  </div>
);

const DISTRICT_CENTERS = {
  Chennai: [13.0827, 80.2707],
  Coimbatore: [11.0168, 76.9558],
  Madurai: [9.9252, 78.1198],
  Tiruchirappalli: [10.7905, 78.7047],
  Salem: [11.6643, 78.146],
};

const INITIAL = {
  organizationName: '', organizationType: '', registrationNumber: '', establishedYear: '',
  state: '', district: '', address: '', pincode: '', lat: '', lng: '',
  contactPerson: '', phoneNumber: '', email: '',
  totalCapacity: '', currentOccupancy: '', maleCount: '', femaleCount: '', childrenCount: '', elderlyCount: '',
  mealBreakfast: false, mealLunch: false, mealDinner: false, mealSnacks: false,
  vegetarian: false, vegan: false, glutenFree: false, diabetic: false,
  frequencyOfSupply: 'daily', priorityLevel: 'medium', additionalNotes: '', consent: false,
};

const CheckPill = ({ checked, onToggle, label, icon }) => (
  <button type="button" onClick={onToggle} style={{
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
    borderRadius: 100, border: `1.5px solid ${checked ? 'var(--color-primary)' : 'var(--border)'}`,
    background: checked ? 'var(--color-primary-alpha)' : 'var(--surface)',
    color: checked ? 'var(--color-primary)' : 'var(--text-secondary)',
    fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
  }}>
    {icon && <span className="material-icons-round" style={{ fontSize: 15 }}>{icon}</span>}
    {label}
    {checked && <span className="material-icons-round" style={{ fontSize: 14 }}>check</span>}
  </button>
);

const BeneficiaryRequestForm = () => {
  const { toast } = useToast();
  const [step, setStep]         = useState(0);
  const [form, setForm]         = useState(INITIAL);
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set   = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const tog   = (k) => setForm(f => ({ ...f, [k]: !f[k] }));
  const onChg = (e) => set(e.target.name, e.target.value);

  const validate = () => {
    const err = {};
    if (step === 0) {
      if (!form.organizationName) err.organizationName = 'Required';
      if (!form.organizationType) err.organizationType = 'Required';
    }
    if (step === 1) {
      if (!form.state) err.state = 'Required';
      if (!form.district) err.district = 'Required';
      if (!form.address) err.address = 'Required';
      if (!form.pincode) err.pincode = 'Required';
      if (!form.contactPerson) err.contactPerson = 'Required';
      if (!form.phoneNumber) err.phoneNumber = 'Required';
    }
    if (step === 2) {
      if (!form.totalCapacity) err.totalCapacity = 'Required';
      if (!form.currentOccupancy) err.currentOccupancy = 'Required';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!form.consent) { toast.warning('Consent required', 'Please confirm the accuracy of information.'); return; }
    setSubmitting(true);
    try {
      const payload = {
        organizationName: form.organizationName, organizationType: form.organizationType,
        state: form.state, district: form.district, address: form.address, pincode: form.pincode,
        contactPerson: form.contactPerson, phoneNumber: form.phoneNumber, email: form.email,
        totalCapacity: Number(form.totalCapacity), currentOccupancy: Number(form.currentOccupancy),
        lat: form.lat !== '' ? Number(form.lat) : undefined,
        lng: form.lng !== '' ? Number(form.lng) : undefined,
      };
      const res = await api.post('/beneficiaries', payload);
      if (res.data?.beneficiaryId) setBeneficiaryId(res.data.beneficiaryId);
      toast.success('Request submitted! 🎉', 'Your organization has been registered. We will review and contact you.');
      setForm(INITIAL);
      setStep(0);
    } catch (err) {
      toast.error('Submission failed', err.response?.data?.message || 'Please try again.');
    } finally { setSubmitting(false); }
  };

  const districts = DISTRICTS_MAP[form.state] || DISTRICTS_MAP.default;

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div className="anim-fade-up">
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Organization Info</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Tell us about your organization</p>
          <FloatingInput label="Organization Name" name="organizationName" value={form.organizationName} onChange={onChg} error={errors.organizationName} required />
          <FloatingSelect label="Organization Type" name="organizationType" value={form.organizationType} onChange={onChg} error={errors.organizationType} required>
            <option value="">Select type</option>
            {['ngo','oldAgeHome','orphanage','shelter','other'].map(t => <option key={t} value={t}>{t}</option>)}
          </FloatingSelect>
          <FloatingInput label="Registration Number" name="registrationNumber" value={form.registrationNumber} onChange={onChg} icon="tag" />
          <FloatingInput label="Year Established" name="establishedYear" type="number" value={form.establishedYear} onChange={onChg} icon="calendar_today" min="1900" max={new Date().getFullYear()} />
        </div>
      );
      case 1: return (
        <div className="anim-fade-up">
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Location & Contact</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Where are you located?</p>
          <FloatingSelect label="State" name="state" value={form.state} onChange={onChg} error={errors.state} required>
            <option value="">Select state</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </FloatingSelect>
          <FloatingSelect label="District" name="district" value={form.district} onChange={onChg} disabled={!form.state} error={errors.district} required>
            <option value="">Select district</option>
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
          </FloatingSelect>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const c = DISTRICT_CENTERS[form.district];
                if (!c) { toast.warning('District first', 'Choose district, then place org pin.'); return; }
                setForm((f) => ({ ...f, lat: c[0], lng: c[1] }));
              }}
            >
              <span className="material-icons-round icon-sm">place</span>
              Org location (district center)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (!navigator.geolocation) return;
                navigator.geolocation.getCurrentPosition(
                  (pos) => setForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude })),
                  () => toast.error('GPS denied', 'Use district center or enter manually.')
                );
              }}
            >
              <span className="material-icons-round icon-sm">my_location</span>
              GPS
            </button>
          </div>
          {form.lat !== '' && form.lng !== '' && (
            <MapPicker lat={Number(form.lat)} lng={Number(form.lng)} onPositionChange={(la, ln) => setForm((f) => ({ ...f, lat: la, lng: ln }))} height="200px" />
          )}
          <FloatingTextarea label="Full Address" name="address" value={form.address} onChange={onChg} error={errors.address} required rows={3} />
          <FloatingInput label="PIN Code" name="pincode" value={form.pincode} onChange={onChg} error={errors.pincode} icon="pin" maxLength={6} required />
          <div style={{ height: 1, background: 'var(--border)', margin: '8px 0 20px' }} />
          <FloatingInput label="Contact Person" name="contactPerson" value={form.contactPerson} onChange={onChg} error={errors.contactPerson} icon="person" required />
          <FloatingInput label="Phone Number" name="phoneNumber" type="tel" value={form.phoneNumber} onChange={onChg} error={errors.phoneNumber} icon="phone" required />
          <FloatingInput label="Email (optional)" name="email" type="email" value={form.email} onChange={onChg} icon="email" />
        </div>
      );
      case 2: return (
        <div className="anim-fade-up">
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Capacity</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>How many people do you serve?</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FloatingInput label="Total Capacity" name="totalCapacity" type="number" value={form.totalCapacity} onChange={onChg} error={errors.totalCapacity} min="1" required />
            <FloatingInput label="Current Occupancy" name="currentOccupancy" type="number" value={form.currentOccupancy} onChange={onChg} error={errors.currentOccupancy} min="0" required />
            <FloatingInput label="Male" name="maleCount" type="number" value={form.maleCount} onChange={onChg} min="0" />
            <FloatingInput label="Female" name="femaleCount" type="number" value={form.femaleCount} onChange={onChg} min="0" />
            <FloatingInput label="Children" name="childrenCount" type="number" value={form.childrenCount} onChange={onChg} min="0" />
            <FloatingInput label="Elderly" name="elderlyCount" type="number" value={form.elderlyCount} onChange={onChg} min="0" />
          </div>
        </div>
      );
      case 3: return (
        <div className="anim-fade-up">
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Food Needs</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>What kind of food do you need?</p>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Meal Types</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            <CheckPill checked={form.mealBreakfast} onToggle={() => tog('mealBreakfast')} label="Breakfast" icon="free_breakfast" />
            <CheckPill checked={form.mealLunch}     onToggle={() => tog('mealLunch')}     label="Lunch" icon="lunch_dining" />
            <CheckPill checked={form.mealDinner}    onToggle={() => tog('mealDinner')}    label="Dinner" icon="dinner_dining" />
            <CheckPill checked={form.mealSnacks}    onToggle={() => tog('mealSnacks')}    label="Snacks" icon="cookie" />
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Dietary Requirements</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            <CheckPill checked={form.vegetarian} onToggle={() => tog('vegetarian')} label="Vegetarian" />
            <CheckPill checked={form.vegan}      onToggle={() => tog('vegan')}      label="Vegan" />
            <CheckPill checked={form.glutenFree} onToggle={() => tog('glutenFree')} label="Gluten-Free" />
            <CheckPill checked={form.diabetic}   onToggle={() => tog('diabetic')}   label="Diabetic" />
          </div>
          <FloatingSelect label="Frequency of Supply" name="frequencyOfSupply" value={form.frequencyOfSupply} onChange={onChg}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="oneTime">One-time</option>
          </FloatingSelect>
          <FloatingSelect label="Priority Level" name="priorityLevel" value={form.priorityLevel} onChange={onChg}>
            <option value="low">Low – Can wait</option>
            <option value="medium">Medium – Needed soon</option>
            <option value="high">High – Urgent</option>
            <option value="critical">Critical – Emergency</option>
          </FloatingSelect>
        </div>
      );
      case 4: return (
        <div className="anim-fade-up">
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Review & Submit</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Verify your details</p>
          {[
            { label: 'Organization', value: `${form.organizationName} (${form.organizationType})` },
            { label: 'Location', value: `${form.address}, ${form.district}, ${form.state} – ${form.pincode}` },
            { label: 'Contact', value: `${form.contactPerson} · ${form.phoneNumber}` },
            { label: 'Capacity', value: `${form.totalCapacity} total, ${form.currentOccupancy} current` },
            { label: 'Priority', value: form.priorityLevel },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>{r.label}</span>
              <span style={{ fontSize: 13, color: 'var(--text-primary)', textAlign: 'right' }}>{r.value || '—'}</span>
            </div>
          ))}
          <FloatingTextarea label="Additional Notes" name="additionalNotes" value={form.additionalNotes} onChange={onChg} rows={3} placeholder="Any special requirements..." />
          <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', marginTop: 8, padding: '14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: `1.5px solid ${form.consent ? 'var(--color-primary)' : 'var(--border)'}` }}>
            <div className={`checkbox-box ${form.consent ? 'checked' : ''}`} onClick={() => tog('consent')} style={{ marginTop: 1 }} />
            <span style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, cursor: 'pointer' }} onClick={() => tog('consent')}>
              I certify that all information provided is true and accurate. I understand that false information may result in rejection.
            </span>
          </label>
        </div>
      );
      default: return null;
    }
  };

  return (
    <AppShell title="Beneficiary Request" showBack role="beneficiary">
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <Stepper current={step} />
        {renderStep()}
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          {step > 0 && <Button variant="ghost" onClick={back} icon="arrow_back" full>Back</Button>}
          {step < STEPS.length - 1 ? (
            <Button variant="primary" onClick={next} iconEnd="arrow_forward" full>Continue</Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} loading={submitting} icon="send" full>
              {submitting ? 'Submitting…' : 'Submit Request'}
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default BeneficiaryRequestForm;
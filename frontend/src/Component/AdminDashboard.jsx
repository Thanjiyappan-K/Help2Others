import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, LogOut, RefreshCw, Check, Users, Truck, Home, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { SkeletonTable } from '../components/ui/Skeleton';
import { API_BASE } from '../utils/api';
import './AdminDashboard.css';

const api = axios.create({ baseURL: `${API_BASE}/api` });

const AdminDashboard = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('h2o_admin_auth') === '1');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('social');
  const [socialWorkers, setSocialWorkers] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const ok = username === 'admin' && password === 'admin123';
    if (!ok) {
      toast.error('Invalid admin credentials');
      return;
    }
    sessionStorage.setItem('h2o_admin_auth', '1');
    setIsAuthenticated(true);
    setUsername('');
    setPassword('');
    toast.success('Welcome, Admin');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('h2o_admin_auth');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    toast.info('Logged out');
  };

  const fetchUnapproved = async () => {
    setLoading(true);
    try {
      const [swRes, volRes, benRes] = await Promise.all([
        api.get('/social-workers?isApproved=false'),
        api.get('/delivery-volunteers?isApproved=false'),
        api.get('/beneficiaries?isApproved=false'),
      ]);
      if (swRes.data.success) setSocialWorkers(swRes.data.socialWorkers);
      if (volRes.data.success) setVolunteers(volRes.data.volunteers);
      if (benRes.data.success) setBeneficiaries(benRes.data.beneficiaries);
    } catch {
      toast.error('Failed to fetch pending registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchUnapproved();
  }, [isAuthenticated]);

  const approveUser = async (role, id) => {
    try {
      const endpoints = {
        'social-worker': `/social-workers/${id}/approve`,
        volunteer: `/delivery-volunteers/${id}/approve`,
        beneficiary: `/beneficiaries/${id}/approve`,
      };
      await api.patch(endpoints[role]);
      toast.success('Registration approved successfully!');
      fetchUnapproved();
    } catch {
      toast.error('Failed to approve registration');
    }
  };

  const TABS = [
    { id: 'social', label: 'Social Workers', icon: Users, count: socialWorkers.length },
    { id: 'volunteer', label: 'Delivery Volunteers', icon: Truck, count: volunteers.length },
    { id: 'beneficiary', label: 'Beneficiaries', icon: Home, count: beneficiaries.length },
  ];

  const currentData = {
    social: { items: socialWorkers, cols: ['ID', 'Name', 'Email', 'District'] },
    volunteer: { items: volunteers, cols: ['ID', 'Name', 'Vehicle', 'District'] },
    beneficiary: { items: beneficiaries, cols: ['ID', 'Organization', 'Type', 'District'] },
  }[activeTab];

  const getRow = (item, tab) => {
    if (tab === 'social') return [item.id, item.name, item.email, item.district];
    if (tab === 'volunteer') return [item.id, item.name, `${item.vehicleType || '—'} (${item.vehicleNumber || '—'})`, item.district];
    if (tab === 'beneficiary') return [item.id, item.organizationName, item.organizationType, item.district];
    return [];
  };

  const roleForTab = { social: 'social-worker', volunteer: 'volunteer', beneficiary: 'beneficiary' };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login__card animate-scale-in">
          <div className="admin-login__icon">
            <ShieldCheck size={32} />
          </div>
          <h1 className="admin-login__title">Admin Portal</h1>
          <p className="admin-login__sub">Login required for approvals</p>

          <form onSubmit={handleLogin} className="admin-login__form">
            <div className="form-field">
              <label className="form-label" htmlFor="admin-username">Username</label>
              <input
                id="admin-username"
                type="text"
                required
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                required
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn-primary admin-login__submit">
              <ShieldCheck size={18} /> Secure Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <div>
          <h1 className="admin-dashboard__title">Administration Portal</h1>
          <p className="admin-dashboard__sub">Approve registrations (admin login enabled)</p>
        </div>
        <div className="admin-dashboard__actions">
          <button className="admin-icon-btn" onClick={fetchUnapproved} title="Refresh" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'admin-spin' : ''} />
          </button>
          <button className="admin-icon-btn admin-icon-btn--danger" onClick={handleLogout} title="Logout" disabled={loading}>
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div className="admin-summary">
        {TABS.map(({ id, label, icon: Icon, count }) => (
          <div key={id} className={`admin-summary-card ${activeTab === id ? 'admin-summary-card--active' : ''}`} onClick={() => setActiveTab(id)}>
            <div className="admin-summary-card__icon"><Icon size={20} /></div>
            <div>
              <div className="admin-summary-card__count">{count}</div>
              <div className="admin-summary-card__label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-tabs">
        {TABS.map(({ id, label, count }) => (
          <button key={id} className={`admin-tab ${activeTab === id ? 'admin-tab--active' : ''}`} onClick={() => setActiveTab(id)}>
            {label}
            {count > 0 && <span className="admin-tab__badge">{count}</span>}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <SkeletonTable rows={4} cols={5} />
        ) : currentData.items.length === 0 ? (
          <div className="admin-empty">
            <AlertCircle size={40} />
            <p>No pending {TABS.find((t) => t.id === activeTab)?.label.toLowerCase()} to review.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {currentData.cols.map((col) => (
                  <th key={col}>{col}</th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.items.map((item) => (
                <tr key={item.id}>
                  {getRow(item, activeTab).map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                  <td>
                    <button className="admin-approve-btn" onClick={() => approveUser(roleForTab[activeTab], item.id)}>
                      <Check size={14} /> Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

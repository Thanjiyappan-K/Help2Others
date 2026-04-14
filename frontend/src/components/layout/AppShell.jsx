import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ToastContainer from '../ui/Toast';

const AppShell = ({ children, role = 'donor', title = 'Help2Others', showBack = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = {
    donor: [
      { icon: 'dashboard', label: 'Home', path: '/dash' },
      { icon: 'volunteer_activism', label: 'Donate', path: '/create-donation' },
      { icon: 'notifications', label: 'Alerts', path: '/notifications' },
      { icon: 'person', label: 'Profile', path: '/profile' },
    ],
    social: [
      { icon: 'dashboard', label: 'Home', path: '/social' },
      { icon: 'fact_check', label: 'Verify', path: '/social' },
    ],
    delivery: [
      { icon: 'local_shipping', label: 'Deliveries', path: '/picker' },
    ],
    beneficiary: [
      { icon: 'home', label: 'Home', path: '/' },
      { icon: 'add_circle', label: 'Request', path: '/homes' },
    ],
  };

  const items = navItems[role] || navItems.donor;
  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-shell">
      {/* Sticky Header */}
      <header className="app-header">
        {showBack ? (
          <button className="btn btn-icon btn-ghost" onClick={() => navigate(-1)} aria-label="Go back">
            <span className="material-icons-round">arrow_back</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Help2Others Home"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 800, fontSize: 16,
            }}>H</div>
            <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
              Help<span style={{ color: 'var(--color-primary)' }}>2</span>Others
            </span>
          </button>
        )}

        {title && showBack && (
          <h1 style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>
            {title}
          </h1>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Theme Toggle */}
          <button
            className="btn btn-icon btn-ghost"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <span className="material-icons-round">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main page">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {items.length > 0 && (
        <nav className="app-bottom-nav" role="navigation" aria-label="Main navigation">
          {items.map((item) => (
            <button
              key={item.path + item.label}
              className={`bottom-nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              <span className="material-icons-round">{item.icon}</span>
              <span style={{ fontSize: 10 }}>{item.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default AppShell;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Bell, User, Package, Truck, UserCheck, ShieldCheck } from 'lucide-react';
import './BottomNav.css';

const NAV_ITEMS = [
  { icon: Home,       label: 'Home',       path: '/' },
  { icon: Package,    label: 'Donate',     path: '/dash' },
  { icon: Bell,       label: 'Alerts',     path: '/notifications' },
  { icon: Truck,      label: 'Delivery',   path: '/picker' },
  { icon: User,       label: 'Profile',    path: '/profile' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            className={`bottom-nav__item ${active ? 'bottom-nav__item--active' : ''}`}
            onClick={() => navigate(path)}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
          >
            <span className="bottom-nav__icon">
              {active && <span className="bottom-nav__indicator" />}
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            </span>
            <span className="bottom-nav__label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;

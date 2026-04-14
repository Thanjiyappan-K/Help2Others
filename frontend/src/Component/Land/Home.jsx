import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './Home.css';

const ROLES = [
  {
    key: 'donor',
    emoji: '🍱',
    color: 'green',
    title: 'Food Donors',
    desc: 'Restaurants, hotels, and households with surplus food ready to donate to those in need.',
    path: '/dash',
  },
  {
    key: 'beneficiary',
    emoji: '🏠',
    color: 'amber',
    title: 'Beneficiaries',
    desc: 'NGOs, old age homes, and orphanages looking for regular food donations for their residents.',
    path: '/homes',
  },
  {
    key: 'delivery',
    emoji: '🚚',
    color: 'blue',
    title: 'Delivery Volunteers',
    desc: 'Community volunteers who help collect food from donors and deliver it to beneficiaries.',
    path: '/picker',
  },
  {
    key: 'social',
    emoji: '🔍',
    color: 'purple',
    title: 'Social Workers',
    desc: 'Verified professionals who inspect food quality and coordinate logistics between all parties.',
    path: '/social',
  },
];

const HOW_IT_WORKS = [
  { num: '01', icon: '🍲', color: 'green',  title: 'Donor Lists Food',      desc: 'Restaurants post surplus food with details, photos, and pickup window.' },
  { num: '02', icon: '🔎', color: 'amber',  title: 'Social Worker Verifies', desc: 'A local social worker inspects food quality and approves the donation.' },
  { num: '03', icon: '🚐', color: 'blue',   title: 'Volunteer Picks Up',     desc: 'A delivery volunteer collects the verified food and heads to the destination.' },
  { num: '04', icon: '🤝', color: 'purple', title: 'Community Gets Fed',     desc: 'Fresh food reaches beneficiaries within hours, zero waste.' },
];

// Animated counter
const Counter = ({ end, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1500;
          const step = end / (duration / 16);
          const timer = setInterval(() => {
            start = Math.min(start + step, end);
            setCount(Math.floor(start));
            if (start >= end) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Home = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* NAVBAR */}
      <nav className="lp-navbar">
        <div className="lp-logo">
          <div className="lp-logo-icon">H</div>
          Help<span style={{ color: '#4ADE80' }}>2</span>Others
        </div>
        <div className="lp-nav-links">
          <a href="#how" className="lp-nav-link">How It Works</a>
          <a href="#join" className="lp-nav-link">Join</a>
          <button className="lp-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="material-icons-round" style={{ fontSize: 18 }}>
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-bg">
          <div className="lp-hero-pattern" />
        </div>

        <div className="lp-hero-content">
          <div className="lp-hero-badge">
            <span className="material-icons-round" style={{ fontSize: 14 }}>eco</span>
            Zero Food Waste Movement
          </div>

          <h1 className="lp-hero-title">
            Feed Communities,<br />
            <span className="accent">Reduce Waste</span>
          </h1>

          <p className="lp-hero-subtitle">
            Connect surplus food from restaurants and households with NGOs, shelters, and families who need it most — verified by trusted social workers.
          </p>

          <div className="lp-hero-actions">
            <button className="lp-btn-hero-primary" onClick={() => navigate('/dash')}>
              <span className="material-icons-round" style={{ fontSize: 18 }}>volunteer_activism</span>
              Start Donating
            </button>
            <button className="lp-btn-hero-secondary" onClick={() => document.getElementById('join').scrollIntoView({ behavior: 'smooth' })}>
              Learn More
              <span className="material-icons-round" style={{ fontSize: 18 }}>arrow_forward</span>
            </button>
          </div>

          {/* Stats */}
          <div className="lp-stats-bar">
            {[
              { end: 1200, suffix: '+', label: 'Meals Saved' },
              { end: 50,   suffix: '+', label: 'Partners' },
              { end: 200,  suffix: '+', label: 'Volunteers' },
              { end: 8,    suffix: ' Districts', label: 'Covered' },
            ].map((s) => (
              <div key={s.label} className="lp-stat-item">
                <div className="lp-stat-num"><Counter end={s.end} suffix={s.suffix} /></div>
                <div className="lp-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="lp-wave">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: '100%', height: 60 }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--bg)" />
          </svg>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="lp-section">
        <p className="lp-section-label">Simple Process</p>
        <h2 className="lp-section-title">How It Works</h2>
        <p className="lp-section-sub">
          From food surplus to full plates in four simple steps — transparent, trusted, and traceable.
        </p>
        <div className="lp-how-grid">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.num} className="lp-how-card anim-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="lp-how-num">{step.num}</div>
              <div className={`lp-how-icon`} style={{
                background: step.color === 'green'  ? 'linear-gradient(135deg,#DCFCE7,#BBF7D0)' :
                            step.color === 'amber'  ? 'linear-gradient(135deg,#FEF3C7,#FDE68A)' :
                            step.color === 'blue'   ? 'linear-gradient(135deg,#DBEAFE,#BFDBFE)' :
                                                      'linear-gradient(135deg,#EDE9FE,#DDD6FE)',
              }}>
                {step.icon}
              </div>
              <h3 className="lp-how-card-title">{step.title}</h3>
              <p className="lp-how-card-text">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROLE CARDS */}
      <section id="join" className="lp-roles-section">
        <p className="lp-section-label">Choose Your Role</p>
        <h2 className="lp-section-title">Join The Movement</h2>
        <p className="lp-section-sub">
          Every role matters. Pick yours and start making a difference today.
        </p>
        <div className="lp-roles-grid">
          {ROLES.map((role, i) => (
            <div
              key={role.key}
              className="lp-role-card anim-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
              onClick={() => navigate(role.path)}
              role="button"
              tabIndex={0}
              aria-label={`Go to ${role.title}`}
              onKeyDown={(e) => e.key === 'Enter' && navigate(role.path)}
            >
              <div className={`lp-role-card-illustration ${role.color}`}>
                <span style={{ fontSize: 56 }}>{role.emoji}</span>
              </div>
              <div className="lp-role-card-body">
                <h3 className="lp-role-card-title">{role.title}</h3>
                <p className="lp-role-card-desc">{role.desc}</p>
                <div className="lp-role-card-cta">
                  Get Started
                  <span className="material-icons-round" style={{ fontSize: 16 }}>arrow_forward</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-logo">
          Help<span>2</span>Others
        </div>
        <div className="lp-footer-links">
          {['About', 'Privacy Policy', 'Terms', 'Contact', 'Volunteer'].map(l => (
            <button key={l} type="button" className="lp-footer-link">{l}</button>
          ))}
          <button type="button" className="lp-footer-link" onClick={() => navigate('/admin')}>Admin approvals</button>
        </div>
        <p className="lp-footer-copy">
          © {new Date().getFullYear()} Help2Others — Reducing food waste, one meal at a time. 🌱
        </p>
      </footer>
    </div>
  );
};

export default Home;
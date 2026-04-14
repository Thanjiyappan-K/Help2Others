import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Leaf, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '#about' },
  { label: 'Contact', path: '#contact' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner h2o-container">
          {/* Logo */}
          <button
            className="navbar__logo"
            onClick={() => navigate('/')}
            aria-label="Help2Others Home"
          >
            <div className="navbar__logo-icon">
              <Leaf size={18} strokeWidth={2.5} />
            </div>
            <span className="navbar__logo-text">
              Help<span>2</span>Others
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="navbar__links" aria-label="Main navigation">
            {NAV_LINKS.map(link => (
              <a
                key={link.path}
                href={link.path}
                className={`navbar__link ${isActive(link.path) ? 'navbar__link--active' : ''}`}
                onClick={link.path === '/' ? (e) => { e.preventDefault(); navigate('/'); } : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="navbar__actions">
            <button
              className="navbar__icon-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              className="navbar__icon-btn navbar__hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`mobile-drawer ${menuOpen ? 'mobile-drawer--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="mobile-drawer__nav">
          {NAV_LINKS.map(link => (
            <a
              key={link.path}
              href={link.path}
              className={`mobile-drawer__link ${isActive(link.path) ? 'mobile-drawer__link--active' : ''}`}
              onClick={(e) => {
                if (link.path === '/') { e.preventDefault(); navigate('/'); }
                setMenuOpen(false);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="mobile-drawer__backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}
    </>
  );
};

export default Navbar;

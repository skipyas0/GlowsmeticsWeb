import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';
import logo from '../assets/logosimple.svg';

const InstagramIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Glowsmetics" />
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            {t('nav.about')}
          </Link>
          <Link to="/procedures" className={`nav-link ${location.pathname.startsWith('/procedures') ? 'active' : ''}`}>
            {t('nav.procedures')}
          </Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
            {t('nav.contact')}
          </Link>
        </div>

        <div className="navbar-actions">
          <div className="language-switch">
            <button
              className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
              onClick={() => changeLanguage('en')}
            >
              🇬🇧 EN
            </button>
            <span className="lang-divider">|</span>
            <button 
              className={`lang-btn ${i18n.language === 'cs' ? 'active' : ''}`}
              onClick={() => changeLanguage('cs')}
            >
              🇨🇿 CZ
            </button>
          </div>
          <a href="https://www.instagram.com/glowsmetics_prague/" target="_blank" rel="noopener noreferrer" className="nav-social" style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
            <InstagramIcon size={20} />
          </a>
          <a href="https://booking.reservanto.cz/Modal/?id=25208" target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t('nav.book_now')}</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

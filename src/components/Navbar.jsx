import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Instagram } from 'lucide-react';
import './Navbar.css';
import logo from '../assets/logosimple.svg';

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
            <Instagram size={20} />
          </a>
          <a href="https://booking.reservanto.cz/Modal/?id=25208" target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t('nav.book_now')}</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

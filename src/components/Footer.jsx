import React from 'react';
import { useTranslation } from 'react-i18next';
import './Footer.css';
import logo from '../assets/logosimple.svg';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-logo">
          <img src={logo} alt="Glowsmetics" />
        </div>
        <div className="footer-info">
          <p>&copy; {new Date().getFullYear()} Glowsmetics. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

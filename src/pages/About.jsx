import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page animate-fade-in">
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">{t('about.title')}</h1>
            <p className="hero-subtitle">{t('about.subtitle')}</p>
            <p className="hero-description">{t('about.description')}</p>
            <div className="hero-actions">
              <Link to="/procedures" className="btn btn-outline">{t('nav.procedures')}</Link>
              <a href="https://booking.reservanto.cz/Modal/?id=25208" target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t('nav.book_now')}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

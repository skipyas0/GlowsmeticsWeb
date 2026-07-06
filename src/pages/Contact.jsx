import React from 'react';
import { useTranslation } from 'react-i18next';
import './Contact.css';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="contact-page animate-fade-in container">
      <div className="contact-header">
        <h1 className="text-center">{t('contact.title')}</h1>
      </div>

      <div className="contact-grid">
        <div className="contact-info-cards">
          <div className="info-card glass">
            <MapPin className="info-icon" />
            <h3>{t('contact.location')}</h3>
            <p><strong>{t('contact.address_label')}:</strong></p>
            <p>{t('contact.address')}</p>
          </div>

          <div className="info-card glass">
            <Phone className="info-icon" />
            <h3>{t('contact.contact')}</h3>
            <p><a href={`tel:${t('contact.phone')}`}>{t('contact.phone')}</a></p>
          </div>

          <div className="info-card glass">
            <Mail className="info-icon" />
            <h3>Email</h3>
            <p><a href="mailto:info@glowsmetics.cz">{t('contact.email')}</a></p>
          </div>

          <div className="info-card glass">
            <Clock className="info-icon" />
            <h3>{t('contact.hours')}</h3>
            <p>{t('contact.hours_value')}</p>
          </div>
        </div>

        <div className="contact-map glass">
          <iframe 
            src="https://maps.google.com/maps?q=Glowsmetics%20|%20Facials,%20Brows%20%26%20Lashes,%20Ve%20Smečkách%201258/6,%20110%2000%20Nové%20Město&t=&z=16&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{border:0}} 
            allowFullScreen="" 
            loading="lazy"
            title="Location Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Procedures.css';

const ProcedureDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  // Check if procedure exists in translations
  const title = t(`procedures.${id}.title`, { defaultValue: '' });
  
  if (!title || title === `procedures.${id}.title`) {
    return (
      <div className="container animate-fade-in" style={{padding: '6rem 2rem', textAlign: 'center'}}>
        <h2>Procedure not found</h2>
        <Link to="/procedures" className="btn btn-outline" style={{marginTop: '2rem'}}>Back to Procedures</Link>
      </div>
    );
  }

  const backText = i18n.language === 'en' ? 'Back to all services' : 'Zpět na všechny služby';
  const aboutText = i18n.language === 'en' ? 'About the Treatment' : 'O proceduře';

  return (
    <div className="procedure-detail-page animate-fade-in">
      <div className="detail-hero">
        <div className="container">
          <Link to="/procedures" className="back-link">&larr; {backText}</Link>
          <h1 className="detail-title">{t(`procedures.${id}.title`)}</h1>
          <p className="detail-price">{t(`procedures.${id}.price`)}</p>
        </div>
      </div>

      <div className="container detail-content">
        <div className="detail-main glass">
          <h2>{aboutText}</h2>
          <p className="detail-desc">{t(`procedures.${id}.description`)}</p>
          <div style={{marginTop: '3rem', textAlign: 'center'}}>
            <a href="tel:+420732825839" className="btn btn-primary">{t('procedures.book_button')}</a>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="sidebar-card glass">
            <h3>{t('procedures.detail.additional_info')}</h3>
            <div className="info-section">
              <h4>{t('procedures.detail.pre_care')}</h4>
              <p className="text-muted">{t('procedures.detail.placeholder')}</p>
            </div>
            <div className="info-section">
              <h4>{t('procedures.detail.post_care')}</h4>
              <p className="text-muted">{t('procedures.detail.placeholder')}</p>
            </div>
            <div className="info-section">
              <h4>{t('procedures.detail.contraindications')}</h4>
              <p className="text-muted">{t('procedures.detail.placeholder')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcedureDetail;

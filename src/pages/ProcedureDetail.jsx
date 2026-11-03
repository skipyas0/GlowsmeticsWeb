import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Procedures.css';

const ProcedureDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();

  if (!i18n.exists(`procedures.${id}.title`)) {
    return (
      <div className="container animate-fade-in" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2>{t('procedures.detail.not_found')}</h2>
        <Link to="/procedures" className="btn btn-outline" style={{ marginTop: '2rem' }}>{t('procedures.detail.back')}</Link>
      </div>
    );
  }

  // Care sections are shown only if the service has a list for them.
  const sections = ['pre_care', 'post_care', 'contraindications']
    .map((key) => ({ key, items: t(`procedures.${id}.${key}`, { returnObjects: true }) }))
    .filter(({ items }) => Array.isArray(items) && items.length > 0);

  return (
    <div className="procedure-detail-page animate-fade-in">
      <div className="detail-hero">
        <div className="container">
          <Link to="/procedures" className="back-link">&larr; {t('procedures.detail.back')}</Link>
          <h1 className="detail-title">{t(`procedures.${id}.title`)}</h1>
          <p className="detail-price">{t(`procedures.${id}.price`)}</p>
        </div>
      </div>

      <div className="container detail-content">
        <div className="detail-main glass">
          <h2>{t('procedures.detail.about')}</h2>
          <p className="detail-desc">{t(`procedures.${id}.description`)}</p>
          <div style={{marginTop: '3rem', textAlign: 'center'}}>
            <a href="https://booking.reservanto.cz/Modal/?id=25208" target="_blank" rel="noopener noreferrer" className="btn btn-primary">{t('procedures.book_button')}</a>
          </div>
        </div>

        {sections.length > 0 && (
          <div className="detail-sidebar">
            <div className="sidebar-card glass">
              <h3>{t('procedures.detail.additional_info')}</h3>
              {sections.map(({ key, items }) => (
                <div className="info-section" key={key}>
                  <h4>{t(`procedures.detail.${key}`)}</h4>
                  <ul className="text-muted" style={{ paddingLeft: '1.2rem', margin: 0 }}>
                    {items.map((item, index) => <li key={index} style={{ marginBottom: '0.25rem' }}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcedureDetail;

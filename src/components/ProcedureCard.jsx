import React from 'react';
import { Link } from 'react-router-dom';
import './ProcedureCard.css';
import { useTranslation } from 'react-i18next';

const ProcedureCard = ({ id, title, description, price }) => {
  const { t } = useTranslation();
  return (
    <Link to={`/procedures/${id}`} className="procedure-card glass">
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-desc">{description}</p>
        <div className="card-footer">
          <span className="card-price">{price}</span>
          <span className="card-link">{t('procedures.view_details')} &rarr;</span>
        </div>
      </div>
    </Link>
  );
};

export default ProcedureCard;

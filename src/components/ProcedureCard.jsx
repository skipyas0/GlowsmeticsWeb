import React from 'react';
import { Link } from 'react-router-dom';
import './ProcedureCard.css';
import { useTranslation } from 'react-i18next';

const ProcedureCard = ({ id, title, description, price }) => {
  const { i18n } = useTranslation();
  return (
    <Link to={`/procedures/${id}`} className="procedure-card glass">
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-desc">{description}</p>
        <div className="card-footer">
          <span className="card-price">{price}</span>
          <span className="card-link">{i18n.language === 'en' ? 'View Details' : 'Více informací'} &rarr;</span>
        </div>
      </div>
    </Link>
  );
};

export default ProcedureCard;

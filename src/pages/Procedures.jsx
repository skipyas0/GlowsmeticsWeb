import React from 'react';
import { useTranslation } from 'react-i18next';
import ProcedureCard from '../components/ProcedureCard';
import './Procedures.css';

const Procedures = () => {
  const { t } = useTranslation();

  const procedureList = [
    'hydration_facial',
    'calm_restore_facial',
    'korean_glow_facial',
    'brow_lamination_tint',
    'brow_lamination',
    'korean_lash_lift',
    'brow_lamination_tint_lash_lift'
  ];

  return (
    <div className="procedures-page animate-fade-in container">
      <div className="procedures-header">
        <h1 className="text-center">{t('procedures.title')}</h1>
      </div>
      
      <div className="procedures-grid">
        {procedureList.map(id => (
          <ProcedureCard 
            key={id}
            id={id}
            title={t(`procedures.${id}.title`)}
            description={t(`procedures.${id}.description`)}
            price={t(`procedures.${id}.price`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Procedures;

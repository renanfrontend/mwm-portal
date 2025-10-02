import React from 'react';

interface Props {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconColor: string;
}

const MetricCard = ({ title, value, icon, iconColor }: Props) => {
  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-content">
        <div className="media">
          <div className="media-content">
            <p className="is-size-7 has-text-grey">{title}</p>
            <p className="title is-4 my-2" style={{ color: 'var(--text-color)' }}>{value}</p>
          </div>
          <div className="media-right">
             <span className="material-symbols-outlined is-size-2" style={{ color: iconColor }}>
              {icon}
            </span>
          </div>
        </div>
        <div className="has-text-right mt-3">
          <a href="#" className="is-size-7">Detalhar</a>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
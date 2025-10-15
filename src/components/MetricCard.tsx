import React from 'react';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

interface Props {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconColor: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard = ({ title, value, icon, iconColor, trend }: Props) => {
  const trendColor = trend === 'up' ? 'has-text-success' : trend === 'down' ? 'has-text-danger' : '';
  const trendIcon = trend === 'up' ? <MdTrendingUp /> : trend === 'down' ? <MdTrendingDown /> : null;
  const isNeutral = trend === 'neutral' || !trend;

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-content">
        <div className="media">
          <div className="media-content">
            <p className="is-size-7 has-text-grey">{title}</p>
            <div className="is-flex is-align-items-center">
              <p className="title is-4 my-2" style={{ color: 'var(--text-color)' }}>{value}</p>
              {!isNeutral && (
                <div className={`is-flex is-align-items-center ml-2 ${trendColor}`}>
                  <span className="icon">
                    {trendIcon}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="media-right">
             <span className="icon is-size-2" style={{ color: iconColor }}>
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
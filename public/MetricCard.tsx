import React from 'react';

interface Props {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<Props> = ({ title, value, icon, trend }) => {
  const trendIcon = trend === 'up' ? '▲' : trend === 'down' ? '▼' : '';
  const trendColor = trend === 'up' ? 'has-text-success' : 'has-text-danger';

  return (
    <div className="box pt-4 pb-2" style={{ height: '100%' }}>
      <div className="field is-grouped mb-0">
        <div className="control">
          <span className="icon has-text-link is-large">{icon}</span>
        </div>
        <div className="control is-expanded">
          <label className="help">{title}</label>
          <label className={`is-size-4 has-text-weight-bold ${trendColor}`}>
            <span className="icon-text"><span>{value}</span><span className="is-size-6 ml-1">{trendIcon}</span></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

interface DataItem {
  name: string;
  value: number;
}

interface Props {
  chartData: DataItem[];
  title: string;
  dataKey: string;
  barColor: string;
  yAxisLabel?: string;
}

const MonthlyBarChart: React.FC<Props> = ({ chartData, title, dataKey, barColor, yAxisLabel, }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return (
        <div className="custom-tooltip" style={{ backgroundColor: 'var(--tooltip-bg)', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '5px' }}>
          <p className="label" style={{ color: 'var(--text-color)' }}>{`${label}: ${value} ${yAxisLabel || ''}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" style={{ height: '100%' }}>
      <header className="card-header">
        <p className="card-header-title">{title}</p>
      </header>
      <div className="card-content">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey={dataKey} fill={barColor} name={dataKey === 'faturamento' ? 'Valor (R$)' : 'Volume (M³)'} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyBarChart;
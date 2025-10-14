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
import useTheme from '../hooks/useTheme';

interface DataItem {
  name: string;
  value: number;
  [key: string]: any; // Para permitir outras propriedades como 'volume' ou 'faturamento'
}

interface Props {
  chartData: DataItem[];
  title: string;
  dataKey: string;
  barColor: string;
  yAxisLabel?: string;
}

const MonthlyBarChart: React.FC<Props> = ({ chartData, title, dataKey, barColor, yAxisLabel, }) => {
  const { theme } = useTheme();
  const axisColor = theme === 'dark' ? '#a0aec0' : '#7a7a7a';
  const textColor = theme === 'dark' ? '#a0aec0' : '#7a7a7a';

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
        <p className="card-header-title" style={{ color: theme === 'dark' ? '#a0aec0' : '#363636' }}>{title}</p>
      </header>
      <div className="card-content">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontFamily: 'Quicksand', fontSize: 12, fill: axisColor }} />
            <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: axisColor, fontSize: 12 } }} tick={{ fontFamily: 'Quicksand', fontSize: 12, fill: axisColor }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontFamily: 'Quicksand', color: textColor }} />
            <Bar dataKey="value" fill={barColor} name={yAxisLabel === '(R$)' ? 'Valor (R$)' : 'Volume (M³)'} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyBarChart;
import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';
import { type AbastecimentoItem } from '../services/api';
import useTheme from '../hooks/useTheme'; // Certifique-se de que este hook existe e está correto

interface Props {
  chartData: AbastecimentoItem[];
  title?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AbastecimentoPieChart = ({ chartData, title = 'Abastecimento' }: Props) => {
  const { theme } = useTheme(); // Assumindo que useTheme retorna um objeto com a propriedade 'theme'
  const textColor = theme === 'dark' ? '#a0aec0' : '#7a7a7a';
  return (
    <div className="card" style={{ height: '100%' }}>
      <header className="card-header">
        <p className="card-header-title">{title}</p>
      </header>
      <div className="card-content">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="m3"
              nameKey="veiculo"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--tooltip-bg)', border: '1px solid var(--border-color)' }}
              itemStyle={{ color: 'var(--text-color)' }}
            />
            <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ color: textColor }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AbastecimentoPieChart;
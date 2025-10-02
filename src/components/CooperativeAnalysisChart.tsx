import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
  Line,
  Legend,
} from 'recharts';
import type { CooperativeAnalysisItem } from '../services/api';

 

interface Props {
  chartData: CooperativeAnalysisItem[];
  title?: string; // Tornando o título opcional
}

const CooperativeAnalysisChart = ({ chartData, title = 'Análise' }: Props) => {
  return (
    <div className="card" style={{ height: '100%' }}>
      <header className="card-header">
        <p className="card-header-title">{title}</p>
      </header>
      <div className="card-content">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={chartData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontFamily: 'Quicksand', fontSize: 12 }} angle={-45} textAnchor="end" height={70} />
            <YAxis tick={{ fontFamily: 'Quicksand', fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: 'rgba(206, 206, 206, 0.2)' }}
              contentStyle={{ fontFamily: 'Quicksand' }}
            />
            <Legend wrapperStyle={{ fontFamily: 'Quicksand' }} />
            <Bar dataKey="value" name="Densidade (Barra)">
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Bar>
            <Line type="monotone" dataKey="value" name="Densidade (Linha)" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

CooperativeAnalysisChart.displayName = 'CooperativeAnalysisChart';

export default CooperativeAnalysisChart;
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
  Legend
} from 'recharts';
import useTheme from '../hooks/useTheme';
import type { CooperativeAnalysisItem } from '../services/api';

interface Props {
  chartData: CooperativeAnalysisItem[];
  title?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'var(--tooltip-bg)', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '5px' }}>
        <p className="label" style={{ color: 'var(--text-color)' }}>{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const CooperativeAnalysisChart = ({ chartData, title = 'Análise' }: Props) => {
  const { theme } = useTheme();
  const axisColor = theme === 'dark' ? '#a0aec0' : '#7a7a7a';

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
            barGap={10}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontFamily: 'Quicksand', fontSize: 12, fill: axisColor }} angle={-45} textAnchor="end" height={70} interval={0} />
            <YAxis tick={{ fontFamily: 'Quicksand', fontSize: 12, fill: axisColor }} />
            <Tooltip cursor={{ fill: 'rgba(206, 206, 206, 0.2)' }} content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontFamily: 'Quicksand', color: 'var(--text-color)' }} />
            <Bar dataKey="value" name="Densidade" barSize={20}>
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

CooperativeAnalysisChart.displayName = 'CooperativeAnalysisChart';

export default CooperativeAnalysisChart;
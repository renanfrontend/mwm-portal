// src/components/AbastecimentoPieChart.tsx

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend, Label } from 'recharts';
import { type AbastecimentoSummaryItem } from '../services/api';
import useTheme from '../hooks/useTheme';

interface Props {
  // Tornamos opcional (?) para evitar erro de TS se não for passado
  chartData?: AbastecimentoSummaryItem[];
  title?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Definimos o valor padrão de chartData como []
const AbastecimentoPieChart = ({ chartData = [], title = 'Abastecimento' }: Props) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#a0aec0' : '#7a7a7a';

  // Garante que safeData seja sempre um array
  const safeData = chartData || [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: 'var(--card-background-color)', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '5px' }}>
          <p className="label">{`${payload[0].name} : ${payload[0].value.toFixed(2)} m³`}</p>
        </div>
      );
    }
    return null;
  };

  // Se não houver dados, exibe um estado vazio em vez de quebrar
  if (safeData.length === 0) {
    return (
      <div className="card" style={{ height: '100%' }}>
        <header className="card-header">
          <p className="card-header-title">{title}</p>
        </header>
        <div className="card-content" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <p className="has-text-grey">Sem dados para exibir no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ height: '100%' }}>
      <header className="card-header">
        <p className="card-header-title">{title}</p>
      </header>
      <div className="card-content">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={safeData}
              dataKey="volumeTotal"
              nameKey="placa"
              outerRadius={150}
              innerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              labelLine={false}
            >
              {safeData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <Label value="Volume por Veículo" position="center" fill={textColor} fontSize="16px" />
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
            />
            <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ color: textColor }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AbastecimentoPieChart;
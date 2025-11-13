// CORRIGIDO: Removido 'React' (TS6133)
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { type AbastecimentoReportItem } from '../services/api';

interface Props {
  data: AbastecimentoReportItem[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'var(--card-background-color)', padding: '10px', border: '1px solid var(--border-color)', borderRadius: '5px' }}>
        <p className="label">{`Placa: ${data.placa}`}</p>
        <p>{`Data: ${data.data}`}</p>
        <p>{`Volume: ${data.volume.toFixed(2)} m³`}</p>
        <p>{`Odômetro: ${data.odometro} km`}</p>
        <p>{`Produto: ${data.produto}`}</p>
      </div>
    );
  }
  return null;
};

const DetailedSupplyChart = ({ data }: Props) => {
  const groupedData = data.reduce((acc, item) => {
    const key = item.placa;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, AbastecimentoReportItem[]>);

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">Análise de Abastecimento (Volume vs. Odômetro)</p>
      </header>
      <div className="card-content">
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="odometro" name="Odômetro" unit="km" />
            <YAxis type="number" dataKey="volume" name="Volume" unit="m³" />
            <ZAxis type="category" dataKey="placa" name="Placa" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <Legend />
            {Object.keys(groupedData).map((placa, index) => (
              <Scatter key={placa} name={placa} data={groupedData[placa]} fill={COLORS[index % COLORS.length]} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DetailedSupplyChart;
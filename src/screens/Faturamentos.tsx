import React, { useState, useEffect } from 'react';
import MonthlyBarChart from '../components/MonthlyBarChart';
import { fetchFaturamentoData } from '../services/api';

// Define a interface para os dados que o MonthlyBarChart espera
interface ChartDataItem {
  name: string;
  value: number;
  [key: string]: unknown; // Para permitir outras propriedades como 'faturamento'
}

const Faturamentos = () => {
  const [data, setData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const fetchedData = await fetchFaturamentoData();
      // Mapeia os dados para o formato esperado pelo MonthlyBarChart
      const mappedData: ChartDataItem[] = fetchedData.map(item => ({
        name: item.name, // 'name' para o eixo X
        value: item.faturamento, // 'value' para o gráfico
        faturamento: item.faturamento, // Mantém 'faturamento' para o dataKey
      }));
      setData(mappedData);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title is-4">Faturamentos</h1>
        {loading ? (
          <progress className="progress is-large is-info" max="100"></progress>
        ) : (
          <div className="card">
            <div className="card-content">
              <MonthlyBarChart
                chartData={data}
                title="Faturamentos Realizados (mês)"
                dataKey="faturamento"
                barColor="#007bff"
                yAxisLabel="(R$)"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Faturamentos;
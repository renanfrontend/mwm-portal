import React, { useState, useEffect } from 'react';
import MonthlyBarChart from '../components/MonthlyBarChart';
import { fetchAbastecimentoVolumeData } /*, AbastecimentoVolumeItem */ from '../services/api';

// Define a interface para os dados que o MonthlyBarChart espera
interface ChartDataItem {
 name: string;
 value: number;
 [key: string]: unknown; // Para permitir outras propriedades como 'volume'
}

const Abastecimentos = () => {
  const [data, setData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const fetchedData = await fetchAbastecimentoVolumeData();
      const mappedData: ChartDataItem[] = fetchedData.map(item => ({
        name: item.name, // 'name' para o eixo X
        value: item.volume, // 'value' para o gráfico
        volume: item.volume, // Mantém 'volume' para o dataKey
      }));
      setData(mappedData);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title is-4">Abastecimentos</h1>
        {loading ? (
          <progress className="progress is-large is-info" max="100"></progress>
        ) : (
          <div className="card">
            <div className="card-content">
              <MonthlyBarChart
                chartData={data}
                title="Abastecimentos Realizados (m³)"
                dataKey="volume"
                barColor="#3298dc"
                yAxisLabel="(M³)"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Abastecimentos;
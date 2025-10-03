import React, { useState, useEffect } from 'react';
import MonthlyBarChart from '../components/MonthlyBarChart';
import { fetchFaturamentoData, fetchAbastecimentoVolumeData, type FaturamentoItem, type AbastecimentoVolumeItem } from '../services/api';

const Faturamentos = () => {
  const [faturamentoData, setFaturamentoData] = useState<FaturamentoItem[]>([]);
  const [abastecimentoData, setAbastecimentoData] = useState<AbastecimentoVolumeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [faturamentos, abastecimentos] = await Promise.all([
        fetchFaturamentoData(),
        fetchAbastecimentoVolumeData()
      ]);
      setFaturamentoData(faturamentos);
      setAbastecimentoData(abastecimentos);
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
          <div className="columns">
            <div className="column">
              <MonthlyBarChart
                chartData={faturamentoData.map(item => ({ name: item.name, value: item.faturamento }))}
                title="Faturamentos Realizados (mês)"
                dataKey="value"
                barColor="#007bff"
                yAxisLabel="(R$)"
              />
            </div>
            <div className="column">
              <MonthlyBarChart
                chartData={abastecimentoData.map(item => ({ name: item.name, value: item.volume }))}
                title="Abastecimentos Realizados (m³)"
                dataKey="value"
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

export default Faturamentos;
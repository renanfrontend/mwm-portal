import React, { useState, useEffect } from 'react';
import MonthlyBarChart from '../components/MonthlyBarChart';
import { fetchFaturamentoData, fetchAbastecimentoVolumeData } from '../services/api'; // Functions still from api.ts
import { type FaturamentoItem, type AbastecimentoVolumeItem } from '../types/models'; // Types from models.ts

const Faturamentos = () => {
  const [faturamentoData, setFaturamentoData] = useState<FaturamentoItem[]>([]);
  const [abastecimentoData, setAbastecimentoData] = useState<AbastecimentoVolumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [faturamentos, abastecimentos] = await Promise.all([
          fetchFaturamentoData(),
          fetchAbastecimentoVolumeData()
        ]);
        setFaturamentoData(faturamentos);
        setAbastecimentoData(abastecimentos);
      } catch (err) {
        setError("Ocorreu um erro ao buscar os dados de faturamento.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title is-4">Faturamentos</h1>
        {loading ? (
          <progress className="progress is-large is-info" max="100"></progress>
        ) : error ? (
          <div className="notification is-danger">{error}</div>
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
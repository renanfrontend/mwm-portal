import React, { useState, useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import StockStatus from '../components/StockStatus';
import CooperativeAnalysisChart from '../components/CooperativeAnalysisChart';
import AbastecimentoPieChart from '../components/AbastecimentoPieChart';
import { fetchDashboardData, fetchAbastecimentoData, type DashboardData, type AbastecimentoItem } from '../services/api'; // Removido Header
import { MdWaterDrop, MdPowerSettingsNew, MdTimer, MdAnalytics, MdWater } from 'react-icons/md';

const iconMap = {
  'density_medium': <MdAnalytics />,
  'water_drop': <MdWaterDrop />,
  'timer': <MdTimer />,
  'power_settings_new': <MdPowerSettingsNew />,
  'water_do': <MdWater />
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [abastecimentoData, setAbastecimentoData] = useState<AbastecimentoItem[]>([]); // Adicione a tipagem correta
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use Promise.all para carregar os dois conjuntos de dados em paralelo
        const [fetchedDashboardData, fetchedAbastecimentoData] = await Promise.all([
          fetchDashboardData(),
          fetchAbastecimentoData()
        ]);
        setData(fetchedDashboardData);
        setAbastecimentoData(fetchedAbastecimentoData);
      } catch (err) {
        setError("Ocorreu um erro ao buscar os dados do dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      {loading && ( // Renderiza o estado de carregamento
        <section className="section">
          <div className="container has-text-centered">
            <p className="title is-4">Carregando dados...</p>
            <progress className="progress is-large is-info" max="100"></progress>
          </div>
        </section>
      )}
      {error && ( // Renderiza o estado de erro
        <section className="section">
          <div className="container has-text-centered">
            <p className="title is-4 has-text-danger">Erro</p>
            <p>{error}</p>
          </div>
        </section>
      )}
      {!loading && !error && data && (
        <section className="section">
          <div className="container">
            <div className="columns is-multiline">
              {data.metrics.map(metric => (
                <div key={metric.id} className="column is-12 is-6-tablet is-3-desktop">
                  <MetricCard
                    title={metric.label}
                    value={`${metric.value}${metric.unit || ''}`}
                    icon={iconMap[metric.icon as keyof typeof iconMap]}
                    iconColor={metric.color}
                  />
                </div>
              ))}
            </div>
            <div className="columns mt-4">
              <div className="column is-4">
                <StockStatus stockItems={data.stock} />
              </div>
              <div className="column is-8">
                <CooperativeAnalysisChart
                  chartData={data.cooperativeAnalysis}
                  title="Análise de Cooperados"
                  // theme={theme} // Removido: 'theme' não é uma prop esperada pelo CooperativeAnalysisChart
                />
              </div>
            </div>
            {/* Linha para o gráfico de pizza */}
            <div className="columns mt-4">
              <div className="column is-8 is-offset-2">
                <AbastecimentoPieChart
                  chartData={abastecimentoData}
                  title="Abastecimento em M³ por Veículo - Primato"
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
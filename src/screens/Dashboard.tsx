import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MetricCard from '../components/MetricCard';
import StockStatus from '../components/StockStatus';
import CooperativeAnalysisChart from '../components/CooperativeAnalysisChart';
import { fetchDashboardData, type DashboardData } from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedData = await fetchDashboardData();
        setData(fetchedData);
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
      <Header />
      {loading && (
        <section className="section">
          <div className="container has-text-centered">
            <p className="title is-4">Carregando dados...</p>
            <progress className="progress is-large is-info" max="100"></progress>
          </div>
        </section>
      )}
      {error && (
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
                    icon={iconMap[metric.icon] || null}
                    trend={metric.trend}
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
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Dashboard;
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MetricCard from '../components/MetricCard';
import StockStatus from '../components/StockStatus';
import CooperativeAnalysisChart from '../components/CooperativeAnalysisChart';
import { fetchDashboardData, type DashboardData } from '../services/api';
import { MdDensityMedium, MdWaterDrop, MdTimer, MdPowerSettingsNew } from "react-icons/md";

const iconMap: { [key: string]: React.ReactNode } = {
  density_medium: <MdDensityMedium data-testid="metric-icon" />,
  water_drop: <MdWaterDrop data-testid="metric-icon" />,
  timer: <MdTimer data-testid="metric-icon" />,
  power_settings_new: <MdPowerSettingsNew data-testid="metric-icon" />,
};

const trendToColorMap: { [key: string]: string } = {
  up: '#48c774', // Bulma success green
  down: '#f14668', // Bulma danger red
  neutral: '#b5b5b5', // Bulma grey
};

type Theme = 'light' | 'dark';

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('light');

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
  
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div>
      <Header theme={theme} toggleTheme={toggleTheme} />
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
              {data.metrics.map((metric, index) => (
                <div
                  key={metric.id}
                  className="column is-12 is-6-tablet is-3-desktop card-animation"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <MetricCard
                    title={metric.label} 
                    value={`${metric.value}${metric.unit || ''}`}
                    icon={iconMap[metric.icon] || <span className="material-symbols-outlined">help</span>}
                    iconColor={trendToColorMap[metric.trend] || 'grey'}
                  />
                </div>
              ))}
            </div>
            <div className="columns mt-4">
              <div
                className="column is-4 card-animation"
                style={{ animationDelay: `${(data.metrics.length) * 100}ms` }}
              >
                <StockStatus stockItems={data.stock} />
              </div>
              <div
                className="column is-8 card-animation"
                style={{ animationDelay: `${(data.metrics.length + 1) * 100}ms` }}
              >
                <CooperativeAnalysisChart
                  chartData={data.cooperativeAnalysis.map(item => ({ ...item, lineValue: item.value }))}
                  title="Análise de Cooperados"
                  theme={theme}
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
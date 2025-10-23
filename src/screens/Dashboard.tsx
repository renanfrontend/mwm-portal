// src/screens/Dashboard.tsx

import React, { useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import StockStatus from '../components/StockStatus';
import CooperativeAnalysisChart from '../components/CooperativeAnalysisChart';
// import AbastecimentoPieChart from '../components/AbastecimentoPieChart'; // Removido
import { loadDashboardData } from '../features/dashboard/dashboardSlice';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { MdWaterDrop, MdPowerSettingsNew, MdTimer, MdAnalytics, MdWater } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const iconMap: { [key: string]: React.ReactNode } = {
  'density_medium': <MdAnalytics/>,
  'water_drop': <MdWaterDrop/>,
  'timer': <MdTimer/>,
  'power_settings_new': <MdPowerSettingsNew/>,
  'water_do': <MdWater/>,
};

const Dashboard = () => {
  const dispatch = useAppDispatch();
  // 'abastecimentoSummary' removido
  const { data, loading, error } = useAppSelector((state) => state.dashboard);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    dispatch(loadDashboardData());
  }, [isAuthenticated, navigate, dispatch]);

  return (
    <div>
      {loading && !data && (
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
            <p className="title is-4">Erro</p>
            <p className="subtitle is-6">{error}</p>
          </div>
        </section>
      )}
      {data && (
        <section className="section">
          <div className="container">
            <h1 className="title is-4">Dashboard</h1>
            <div className="columns is-multiline">
              {data.metrics.map((metric) => (
                <div key={metric.id} className="column is-12 is-6-tablet is-3-desktop">
                  <MetricCard
                    title={metric.label}
                    value={`${metric.value}${metric.unit || ''}`}
                    icon={iconMap[metric.icon]}
                    trend={metric.trend}
                    iconColor="" // Prop fantasma mantida para não quebrar (embora o componente não a use mais)
                  />
                </div>
              ))}
            </div>
            <div className="columns mt-4">
              <div className="column is-4">
                <StockStatus stockItems={data.stock} />
              </div>
              <div className="column is-8">
                <CooperativeAnalysisChart chartData={data.cooperativeAnalysis} title="Análise de Cooperados" />
              </div>
            </div>
            
            {/* Bloco do AbastecimentoPieChart removido */}

          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
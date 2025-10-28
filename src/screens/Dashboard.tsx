// src/screens/Dashboard.tsx

import React, { useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import StockStatus from '../components/StockStatus';
import CooperativeAnalysisChart from '../components/CooperativeAnalysisChart';
import { loadDashboardData } from '../features/dashboard/dashboardSlice';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { MdWaterDrop, MdPowerSettingsNew, MdTimer, MdAnalytics, MdWater, MdFilterList } from 'react-icons/md'; 
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
  
  const handleFilterClick = () => {
      console.log('Botão de Filtros clicado! Implemente a lógica de abertura de modal/dropdown aqui.');
  };

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
        <section className="section" style={{ paddingTop: '1.5rem' }}> 
          <div className="container">
            
            {/* SEGUNDO HEADER (ESPECÍFICO DO DASHBOARD) */}
            <div className="level is-mobile mb-4">
                
                {/* Lado Esquerdo: Nome da Unidade */}
                <div className="level-left">
                    <div className="level-item">
                        <p className="is-size-5 has-text-weight-semibold">Toledo - PR</p> 
                    </div>
                </div>
                
                {/* Lado Direito: Botão de Filtros */}
                <div className="level-right">
                    <div className="level-item">
                        <button className="button is-info is-rounded" onClick={handleFilterClick}> 
                            <span className="icon">
                                <MdFilterList size={24} />
                            </span>
                            <span>Filtros</span>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* O restante do conteúdo do Dashboard */}
            <div className="columns is-multiline">
              {data.metrics.map((metric) => (
                <div key={metric.id} className="column is-12 is-6-tablet is-3-desktop">
                  <MetricCard
                    title={metric.label}
                    value={`${metric.value}${metric.unit || ''}`}
                    icon={iconMap[metric.icon]}
                    trend={metric.trend}
                    iconColor=""
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
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
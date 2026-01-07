// src/screens/Dashboard.tsx

import { useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import StockStatus from '../components/StockStatus';
import CooperativeAnalysisChart from '../components/CooperativeAnalysisChart';
import { loadDashboardData } from '../features/dashboard/dashboardSlice';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import type { Metric } from '../services/api';
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
    // ESTRUTURA DE LAYOUT PADRÃO (CORRIGE SCROLL E SOBREPOSIÇÃO)
    <div className="screen-container">
      
      {/* ÁREA DE CONTEÚDO COM SCROLL */}
      <div className="screen-content">
        <div className="container is-fluid px-0">
            
            {/* SEU HEADER ORIGINAL */}
            {/* <div className="level is-mobile mb-4">
                <div className="level-left">
                    <div className="level-item">
                        <p className="is-size-5 has-text-weight-semibold">Toledo - PR</p> 
                    </div>
                </div>
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
            </div> */}
            
            {loading && !data && (
                <div className="section has-text-centered">
                  <progress className="progress is-large is-info" max="100"></progress>
                </div>
            )}

            {error && <div className="notification is-danger">{error}</div>}
            
            {/* SEUS CARDS ORIGINAIS */}
            {data && (
                <>
                    <div className="columns mt-4  is-multiline">
                      {data.metrics.map((metric: Metric) => (
                        <div key={metric.id} className="column is-12 is-6-tablet is-3-desktop">
                          <MetricCard
                            title={metric.label}
                            value={`${metric.value}${metric.unit || ''}`}
                            icon={iconMap[metric.icon]}
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
                        <CooperativeAnalysisChart chartData={data.cooperativeAnalysis} title="Análise de Cooperados" />
                      </div>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
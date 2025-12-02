// src/screens/Dashboard.tsx

import { useEffect } from 'react';
import MetricCard from '../components/MetricCard';
import StockStatus from '../components/StockStatus';
import CooperativeAnalysisChart from '../components/CooperativeAnalysisChart';
import { loadDashboardData } from '../features/dashboard/dashboardSlice';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import type { Metric } from '../services/api';
import { MdWaterDrop, MdPowerSettingsNew, MdTimer, MdAnalytics, MdWater, MdFilterList, MdArrowBack } from 'react-icons/md'; 
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
  <div className="screen-container p-2">
    {/* Toolbar Padronizada */}
    <div className="box is-radiusless mb-0" style={{ borderBottom: '1px solid #dbdbdb', padding: '0.75rem 1rem' }}>
      <div className="level is-mobile">
        <div className="level-left">
            {/* Dashboard geralmente é a home, mas mantive o botão para padronização visual */}
          <button className="button is-white mr-2" onClick={() => navigate(-1)}>
            <span className="icon"><MdArrowBack size={24} /></span>
          </button>
          <span className="title is-4 mb-0" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Dashboard</span>
        </div>
        <div className="level-right">
          <button className="button is-info is-rounded is-small" onClick={() => console.log('Filtro')}> 
              <span className="icon"><MdFilterList /></span>
              <span>Filtros</span>
          </button>
        </div>
      </div>
    </div>

    <div className="screen-content">
      <div className="container is-fluid px-0">
          <div className="mb-4">
              <p className="is-size-5 has-text-weight-semibold">Toledo - PR</p>
          </div>

          {loading && !data && <progress className="progress is-large is-info" max="100"></progress>}
          {error && <div className="notification is-danger">{error}</div>}
          
          {data && (
              <>
                  <div className="columns is-multiline">
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
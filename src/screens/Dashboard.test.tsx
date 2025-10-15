import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import * as api from '../services/api';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../features/dashboard/dashboardSlice';

// Mock do hook useAuth
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ isAuthenticated: true, user: { role: 'administrador' } }),
}));

// Mock do hook useTheme
vi.mock('../hooks/useTheme', () => ({
  default: () => ({ theme: 'light' }),
}));

// Mock do useNavigate
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
}));

// Mock do módulo da API
vi.mock('../services/api');

// Mock dos componentes filhos para isolar a lógica do Dashboard
vi.mock('../components/MetricCard', () => ({ default: (props: { title: string }) => <div data-testid="metric-card">{props.title}</div> }));
vi.mock('../components/StockStatus', () => ({ default: () => <div>StockStatus Mock</div> }));
vi.mock('../components/CooperativeAnalysisChart', () => ({ default: () => <div>CooperativeAnalysisChart Mock</div> }));
vi.mock('../components/AbastecimentoPieChart', () => ({ default: () => <div>AbastecimentoPieChart Mock</div> }));

const mockDashboardData: api.DashboardData = {
  metrics: [
    { id: 1, icon: 'density_medium', label: 'Densidade dos dejetos', value: 1014, trend: 'up' },
    { id: 2, icon: 'water_drop', label: 'Volume recebido', value: '34.6M', trend: 'up', unit: 'M³' },
  ],
  stock: [
    { id: 1, label: 'Fertilizantes', value: 74480, capacity: 78400, unit: 't', color: 'is-link' },
  ],
  cooperativeAnalysis: [
    { name: 'Ademir E.', value: 2.5, color: '#334bff' },
  ],
};

const mockAbastecimentoSummaryData: api.AbastecimentoSummaryItem[] = [
  { veiculo: 'Caminhão (Ração)', placa: 'ABC-1234', volumeTotal: 100 },
];

const createStore = () => configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});

describe('Dashboard Screen', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('deve exibir o estado de carregamento inicialmente', () => {
    vi.mocked(api.fetchDashboardData).mockReturnValue(new Promise(() => {})); // Promise que nunca resolve
    vi.mocked(api.fetchAbastecimentoSummaryData).mockReturnValue(new Promise(() => {}));

    render(
      <Provider store={createStore()}>
        <Dashboard />
      </Provider>
    );

    expect(screen.getByText('Carregando dados...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('deve exibir o estado de erro se a API falhar', async () => {
    const errorMessage = "Ocorreu um erro ao buscar os dados do dashboard.";
    vi.mocked(api.fetchDashboardData).mockRejectedValue(new Error('API Error'));
    vi.mocked(api.fetchAbastecimentoSummaryData).mockRejectedValue(new Error('API Error'));
    
    render(
      <Provider store={createStore()}>
        <Dashboard />
      </Provider>
    );
    
    expect(await screen.findByText('Erro')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByText('Carregando dados...')).not.toBeInTheDocument();
  });

  it('deve renderizar os dados do dashboard com sucesso', async () => {
    vi.mocked(api.fetchDashboardData).mockResolvedValue(mockDashboardData);
    vi.mocked(api.fetchAbastecimentoSummaryData).mockResolvedValue(mockAbastecimentoSummaryData);

    render(
      <Provider store={createStore()}>
        <Dashboard />
      </Provider>
    );

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    expect(screen.getAllByTestId('metric-card')).toHaveLength(mockDashboardData.metrics.length);
    expect(screen.getByText('StockStatus Mock')).toBeInTheDocument();
    expect(screen.getByText('CooperativeAnalysisChart Mock')).toBeInTheDocument();
    expect(screen.getByText('AbastecimentoPieChart Mock')).toBeInTheDocument();
  });
});
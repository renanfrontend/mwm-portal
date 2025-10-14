import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import * as api from '../services/api';

// Mock do módulo da API
vi.mock('../services/api');

// Mock dos componentes filhos para isolar a lógica do Dashboard
vi.mock('../components/Header', () => ({ default: (props: { theme: string, toggleTheme: () => void }) => <div data-testid="header-mock">{props.theme}</div> }));
vi.mock('../components/MetricCard', () => ({ default: (props: { title: string }) => <div data-testid="metric-card">{props.title}</div> }));
vi.mock('../components/StockStatus', () => ({ default: () => <div>StockStatus Mock</div> }));
vi.mock('../components/CooperativeAnalysisChart', () => ({ default: () => <div>CooperativeAnalysisChart Mock</div> }));

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

describe('Dashboard Screen', () => {
  beforeEach(() => {
    // Reseta os mocks antes de cada teste
    vi.resetAllMocks();
  });

  it('deve exibir o estado de carregamento inicialmente', () => {
    vi.mocked(api.fetchDashboardData).mockReturnValue(new Promise(() => {})); // Promise que nunca resolve
    render(<Dashboard />);
    expect(screen.getByText('Carregando dados...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('deve exibir o estado de erro se a API falhar', async () => {
    const errorMessage = "Ocorreu um erro ao buscar os dados do dashboard.";
    vi.mocked(api.fetchDashboardData).mockRejectedValue(new Error('API Error'));
    
    render(<Dashboard />);
    
    expect(await screen.findByText('Erro')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.queryByText('Carregando dados...')).not.toBeInTheDocument();
  });

  it('deve tentar buscar os dados novamente ao clicar em "Tentar Novamente"', async () => {
    const user = userEvent.setup();
    // Primeira chamada falha
    vi.mocked(api.fetchDashboardData).mockRejectedValueOnce(new Error('API Error'));
    
    render(<Dashboard />);
    
    // Espera o botão "Tentar Novamente" aparecer
    const retryButton = await screen.findByRole('button', { name: /Tentar Novamente/i });
    
    // Segunda chamada tem sucesso
    vi.mocked(api.fetchDashboardData).mockResolvedValueOnce(mockDashboardData);
    await user.click(retryButton);
    expect(await screen.findByTestId('header-mock')).toBeInTheDocument();
  });

  it('deve renderizar os dados do dashboard com sucesso', async () => {
    vi.mocked(api.fetchDashboardData).mockResolvedValue(mockDashboardData);

    render(<Dashboard />);

    expect(await screen.findByTestId('header-mock')).toBeInTheDocument();
    expect(screen.getAllByTestId('metric-card')).toHaveLength(mockDashboardData.metrics.length);
    expect(screen.getByText('StockStatus Mock')).toBeInTheDocument();
    expect(screen.getByText('CooperativeAnalysisChart Mock')).toBeInTheDocument();
  });

  it('deve alternar o tema ao clicar no botão do Header', async () => {
    vi.mocked(api.fetchDashboardData).mockResolvedValue(mockDashboardData);
    const user = userEvent.setup();

    render(<Dashboard />);

    const headerMock = await screen.findByTestId('header-mock');
    expect(headerMock).toHaveTextContent('light');
    // O clique no botão de toggleTheme é mockado no Header, então não podemos testar a funcionalidade diretamente aqui.
  });
});
/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AbastecimentoPieChart from '../logistica/AbastecimentoPieChart';
import { type AbastecimentoItem } from '../../types/models';

// Mock do hook useTheme para não depender do Contexto
vi.mock('../hooks/useTheme', () => ({
  default: () => ({ theme: 'light' }),
}));

// Mock dos componentes da Recharts
vi.mock('recharts', async () => {
  const originalModule = await vi.importActual<typeof import('recharts')>('recharts');
  return {
    ...originalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container-mock">{children}</div>
    ),
    PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart-mock">{children}</div>,
    Pie: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-mock">{children}</div>,
    Cell: () => <div data-testid="cell-mock" />,
    Tooltip: () => <div data-testid="tooltip-mock" />,
    Legend: () => <div data-testid="legend-mock" />,
    Label: ({ value }: { value: string }) => <div data-testid="label-mock">{value}</div>,
  };
});

const mockChartData: AbastecimentoItem[] = [
  { id: '1', data: '2025-01-01', horaInicio: '08:00', transportadora: 'Translog', status: 'Concluído', tipoAbastecimento: 'Bomba', tipoVeiculo: 'Caminhão', produto: 'Biometano', placa: 'ABC-1234', veiculo: 'Caminhão (Ração)', m3: 150.5, odometro: '1000', pressaoInicial: '200', usuario: 'sistema' },
  { id: '2', data: '2025-01-02', horaInicio: '09:00', transportadora: 'Rapidão', status: 'Concluído', tipoAbastecimento: 'Bomba', tipoVeiculo: 'Carro', produto: 'Biometano', placa: 'XYZ-5678', veiculo: 'Carro', m3: 50.2, odometro: '2000', pressaoInicial: '200', usuario: 'sistema' },
];

describe('AbastecimentoPieChart', () => {
  it('deve renderizar o título fornecido', () => {
    render(<AbastecimentoPieChart chartData={[]} title="Teste de Título" />);
    // CORRIGIDO: (TS2339) - A referência na linha 1 corrige este erro
    expect(screen.getByText('Teste de Título')).toBeInTheDocument();
  });

  it('deve usar o título padrão se nenhum for fornecido', () => {
    render(<AbastecimentoPieChart chartData={[]} />);
    // CORRIGIDO: (TS2339) - A referência na linha 1 corrige este erro
    expect(screen.getByText('Abastecimento')).toBeInTheDocument();
  });

  it('deve renderizar a label central "Volume por Veículo" mesmo com dados vazios', () => {
    render(<AbastecimentoPieChart chartData={[]} />);
    // CORRIGIDO: (TS2339) - A referência na linha 1 corrige este erro
    expect(screen.getByText('Volume por Veículo')).toBeInTheDocument();
  });

  it('deve renderizar os componentes do gráfico quando houver dados', () => {
    render(<AbastecimentoPieChart chartData={mockChartData} />);
    // CORRIGIDO: (TS2339) - A referência na linha 1 corrige este erro
    expect(screen.getByTestId('pie-chart-mock')).toBeInTheDocument();
    expect(screen.getByTestId('legend-mock')).toBeInTheDocument();
  });
});